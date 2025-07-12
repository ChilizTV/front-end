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

if (!id) {
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
