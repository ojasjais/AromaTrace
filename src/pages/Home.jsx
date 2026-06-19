import showToast from "../components/ui/Toast";
import { useState } from "react";
import Modal from "../components/ui/Modal";
import Loader from "../components/ui/Loader";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Hero from "../components/Hero";
import Card from "../components/Card";

function Home() {
  const [open, setOpen] = useState(true);

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

    <Loader />

    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Batch Details"
    >
      <p>Rosemary Oil Batch</p>
    </Modal>

    <Card
      title="Batch Management"
      description="Create and track production batches."
    />

    <Card
      title="Certificate Tracking"
      description="Manage quality certificates."
    />
  </div>
</div>
  );
}

export default Home;