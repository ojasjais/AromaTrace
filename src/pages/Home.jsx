import Hero from "../components/Hero";
import Card from "../components/Card";

function Home() {
  return (
    <>
      <Hero />

      <Card
        title="Batch Management"
        description="Create and track production batches."
      />

      <Card
        title="Certificate Tracking"
        description="Manage quality certificates."
      />
    </>
  );
}

export default Home;