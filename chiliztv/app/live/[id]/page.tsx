import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import LiveDetailsPage from "@/components/live/LiveMatch";

export default function LivePage() {
    const params = {
        id: "12345", // Replace with dynamic ID or fetch from context
    };

    return (
        <main>
            <Header />
            <LiveDetailsPage id={params.id} />
            <Footer />
        </main>
    );
}
