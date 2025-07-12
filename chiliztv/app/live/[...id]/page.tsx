import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import LiveDetailsPage from "@/components/live/LiveDetailsPage";

type LivePageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function LivePage({ params }: LivePageProps) {
const { id } = await params;

if (!id || !/^0x[a-fA-F0-9]{40}$/.test(id)) {
    return <div>Invalid match ID</div>;
}

    return (
        <main>
            <Header />
            <LiveDetailsPage id={id} />
            <Footer />
        </main>
    );
}
