import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import {
  getAllBatches,
  createBatch,
  getBatchById,
  updateBatchById,
  deleteBatchById,
} from "../api/auth";

const Batch = () => {
  const [batches, setBatches] = useState([]);
  const [batchData, setBatchData] = useState({ batch_name: "", description: "" });
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await getAllBatches();
      // Make sure to set batches as an array
      if (response && response.success && Array.isArray(response.data)) {
        setBatches(response.data);
      } else {
        setBatches([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async () => {
    try {
      setLoading(true);
      console.log(batchData)
      await createBatch(batchData);
      setBatchData({ batch_name: "", description: "" });
      fetchBatches();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBatch = async () => {
    if (!selectedBatchId) return;
    try {
      setLoading(true);
      await updateBatchById(selectedBatchId, batchData);
      setSelectedBatchId(null);
      setBatchData({ batch_name: "", description: "" });
      fetchBatches();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBatch = async (batchId) => {
    try {
      setLoading(true);
      await deleteBatchById(batchId);
      fetchBatches();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-secondary-gray rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary-purple mb-4">Batch Management</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Batch Name"
        value={batchData.batch_name}
        onChange={(e) => setBatchData({ ...batchData, batch_name: e.target.value })}
        className="border p-3 w-full mb-3 rounded-lg bg-primary-white shadow-sm"
      />
      <textarea
        placeholder="Batch Description"
        value={batchData.description}
        onChange={(e) => setBatchData({ ...batchData, description: e.target.value })}
        className="border p-3 w-full mb-3 rounded-lg bg-primary-white shadow-sm"
      ></textarea>
      <button
        onClick={selectedBatchId ? handleUpdateBatch : handleCreateBatch}
        className="bg-primary-purple text-primary-white p-3 w-full rounded-lg font-semibold hover:bg-opacity-90"
        disabled={loading}
      >
        {selectedBatchId ? "Update Batch" : "Create Batch"}
      </button>
      <ul className="mt-4">
        {batches.map((batch) => (
          <li key={batch.batch_id} className="flex justify-between items-center border p-3 my-2 bg-primary-white rounded-lg shadow-sm">
            <div>
              <p className="font-medium text-gray-700 text-lg">{batch.batch_name}</p>
              <p className="text-gray-500 text-sm">{batch.description}</p>
              <p className="text-gray-400 text-xs">Teacher: {batch.teacher_email}</p>
            </div>
            <div className="flex space-x-2 text-black">
              <button
                onClick={() => {
                  setSelectedBatchId(batch.batch_id);
                  setBatchData({ batch_name: batch.batch_name, description: batch.description });
                }}
                className="bg-accent-yellow text-white p-2 rounded-lg hover:bg-opacity-90"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDeleteBatch(batch.batch_id)}
                className="bg-secondary-coral text-white p-2 rounded-lg hover:bg-opacity-90"
                disabled={loading}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Batch;
