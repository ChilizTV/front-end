import { NextRequest, NextResponse } from "next/server";
import { countries, Country3LetterCode, SelfAppDisclosureConfig } from "@selfxyz/common";
import {
  countryCodes,
  SelfBackendVerifier,
  AllIds,
  DefaultConfigStore,
  VerificationConfig
} from "@selfxyz/core";

export async function POST(req: NextRequest) {
  console.log("Received request");
  try {
    const { attestationId, proof, publicSignals, userContextData } = await req.json();

    if (!proof || !publicSignals || !attestationId || !userContextData) {
      return NextResponse.json({
        status: 'error',
        result: false,
        reason: "Proof, publicSignals, attestationId and userContextData are required",
        error_code: "INVALID_INPUTS"
      }, { status: 200 });
    }

    const disclosures_config: VerificationConfig = {
      excludedCountries: [],
      ofac: false,
      minimumAge: 18,
    };

    const configStore = new DefaultConfigStore(disclosures_config);

    const selfBackendVerifier = new SelfBackendVerifier(
      "self-workshop",
      process.env.NEXT_PUBLIC_SELF_ENDPOINT || "",
      true,
      AllIds,
      configStore,
      "hex",
    );

    const result = await selfBackendVerifier.verify(
      attestationId,
      proof,
      publicSignals,
      userContextData
    );
    
    if (!result.isValidDetails.isValid) {
      return NextResponse.json({
        status: "error",
        result: false,
        reason: "Verification failed",
        error_code: "VERIFICATION_FAILED"
        details: result.isValidDetails,
      }, { status: 200 });
    }

    const saveOptions = (await configStore.getConfig(
      result.userData.userIdentifier
    )) as unknown as SelfAppDisclosureConfig;

    if (result.isValidDetails.isValid) {
      console.log(result.discloseOutput);

      return NextResponse.json({
        status: "success",
        result: result.isValidDetails.isValid,
        credentialSubject: result.discloseOutput,
        verificationOptions: {
          minimumAge: saveOptions.minimumAge,
          ofac: saveOptions.ofac,
          excludedCountries: saveOptions.excludedCountries?.map(
            (countryName) => {
              const entry = Object.entries(countryCodes).find(
                ([_, name]) => name === countryName
              );
              return entry ? entry[0] : countryName;
            }
          ),
        },
      });
    } else {
      return NextResponse.json({
        status: "error",
        result: result.isValidDetails.isValid,
        reason: "Verification failed",
        error_code: "VERIFICATION_FAILED"
        details: result,
      }, { status: 200 });
    }
  } catch (error) {
    console.error("Error verifying proof:", error);
    return NextResponse.json({
      status: "error",
      result: false,
      reason: "Internal Error",
      error_code: "INTERNAL_ERROR"
    }, { status: 200 });
  }
}