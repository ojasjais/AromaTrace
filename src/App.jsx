import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Card from "./components/Card";

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
    </div>
  );
}

export default App;