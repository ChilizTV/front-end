// curl --request POST https://auth.privy.io/api/v1/users/<user-did>/custom_metadata \
// -u "<your-privy-app-id>:<your-privy-app-secret>" \
// -H "privy-app-id: <your-privy-app-id>"
// -d '{
//   "custom_metadata": {username: "name", isVerified: true, age: 23}
// }'

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userDid, customMetadata } = await req.json();

        if (!userDid || !customMetadata) {
            return NextResponse.json(
                {
                    status: "error",
                    result: false,
                    reason: "userDid and customMetadata are required",
                    error_code: "INVALID_INPUTS",
                },
                { status: 400 }
            );
        }

        const privyAppId = process.env.PRIVY_PROJECT_ID ?? "";
        const privyAppSecret = process.env.PRIVY_APP_SECRET ?? "";
        if (!privyAppId || !privyAppSecret) {
            return NextResponse.json(
                {
                    status: "error",
                    result: false,
                    reason: "Privy app ID and secret are not configured",
                    error_code: "CONFIGURATION_ERROR",
                },
                { status: 500 }
            );
        }

        const response = await fetch(`https://auth.privy.io/api/v1/users/${userDid}/custom_metadata`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${privyAppId}:${privyAppSecret}`).toString('base64')}`,
                'privy-app-id': privyAppId,
            },
            body: JSON.stringify({ custom_metadata: customMetadata }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                {
                    status: "error",
                    result: false,
                    reason: errorData.message ?? "Failed to update metadata",
                    error_code: "API_ERROR",
                },
                { status: response.status }
            );
        }

        return NextResponse.json(
            {
                status: "success",
                result: true,
                message: "Custom metadata updated successfully",
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error updating username:", error);
        return NextResponse.json(
            {
                status: "error",
                result: false,
                reason: error instanceof Error ? error.message : "Unknown error occurred",
                error_code: "SERVER_ERROR",
            },
            { status: 500 }
        );
    }
}