import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Card from "./components/Card";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Navbar />

      <Hero />

      <Card
        title="Batch Management"
        description="Create and track production batches."
      />

      <Card
        title="Certificate Tracking"
        description="Manage quality certificates and compliance records."
      />

      <Footer />
    </div>
  );
}

export default App;