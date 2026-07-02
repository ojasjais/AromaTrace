import { useEffect, useState } from "react";
import { getBatches } from "../api/batches";
import showToast from "../components/ui/Toast";
import Modal from "../components/ui/Modal";
import Loader from "../components/ui/Loader";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Hero from "../components/Hero";
import Card from "../components/Card";

function Home() {
 const [open, setOpen] = useState(false);
const [batches, setBatches] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchBatches();
}, []);

const fetchBatches = async () => {
  try {
    const data = await getBatches();
    setBatches(data);
  } catch (error) {
    console.error(error);
    showToast("Failed to load batches");
  } finally {
    setLoading(false);
  }
};

if (loading) {
  return <Loader />;
}

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
  <Hero />

  <div className="max-w-4xl mx-auto px-4">
    <Button
      variant="primary"
      size="md"
      onClick={() => showToast("Batch Added Successfully!")}
    >
      Add Batch
    </Button>

    <Input
      label="Buyer Name"
      placeholder="Enter buyer name"
    />


    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Batch Details"
    >
      <p>Rosemary Oil Batch</p>
    </Modal>

    {batches.map((batch) => (
  <Card
    key={batch.id}
    title={batch.name}
    description={`Quantity: ${batch.quantity} | Status: ${batch.status}`}
  />
))}

  </div>
</div>
  );
}

export default Home;