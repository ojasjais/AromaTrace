import Button from "../components/ui/Button";

function Showcase() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">UI Components</h1>

      <Button variant="primary" size="md">
        Add Batch
      </Button>
    </div>
  );
}

export default Showcase;