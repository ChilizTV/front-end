import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import LiveDetailsPage from "@/components/live/LiveDetailsPage";

interface LivePageProps {
    params: {
        id: `0x${string}`;
    };
}

export default function LivePage({
    params,
  }: {
    params: LivePageProps["params"];
  }) {

    if (!params.id || !/^0x[a-fA-F0-9]{40}$/.test(params.id)) {
        return <div>Invalid match ID</div>;
    }

    return (
        <main>
            <Header />
            <LiveDetailsPage id={params.id} />
            <Footer />
        </main>
    );
}
