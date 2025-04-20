import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import {
  getAllBatches,
  createBatch,
  getBatchById,
  updateBatchById,
  deleteBatchById,
} from "../../api/auth";
import toast from "react-hot-toast";
import Sidebar from "../../components/Sidebar";

const Batch = () => {
  const [open, setOpen] = useState(false);
  const [batches, setBatches] = useState([]);
  const [batchData, setBatchData] = useState({ batch_name: "", description: "", start_date: "", end_date: "", cost: "" });
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await getAllBatches();
      if (response && response.success && Array.isArray(response.data)) {
        console.log("Fetched Batches:", response.data);
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
    // Validation
    if (!batchData.batch_name.trim()) {
      toast.error("Batch name is required.");
      return;
    }

    if (!batchData.start_date) {
      toast.error("Start date is required.");
      return;
    }

    if (!batchData.end_date) {
      toast.error("End date is required.");
      return;
    }

    if (!batchData.cost || isNaN(batchData.cost) || parseFloat(batchData.cost) <= 0) {
      toast.error("Please enter a valid cost greater than 0.");
      return;
    }

    if (!batchData.description.trim()) {
      toast.error("Batch description is required.");
      return;
    }

    try {
      setLoading(true);
      console.log("Creating Batch with data:", batchData);
      await createBatch(batchData);
      setBatchData({ batch_name: "", description: "", start_date: "", end_date: "", cost: "" });
      toast.success("Batch created successfully!");
      fetchBatches();
    } catch (err) {
      toast.error("Failed to create batch.");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBatch = async () => {
    if (!selectedBatchId) return;

    // Validation
    if (!batchData.batch_name.trim()) {
      toast.error("Batch name is required.");
      return;
    }

    if (!batchData.start_date) {
      toast.error("Start date is required.");
      return;
    }

    if (!batchData.end_date) {
      toast.error("End date is required.");
      return;
    }

    if (!batchData.cost || isNaN(batchData.cost) || parseFloat(batchData.cost) <= 0) {
      toast.error("Please enter a valid cost greater than 0.");
      return;
    }

    if (!batchData.description.trim()) {
      toast.error("Batch description is required.");
      return;
    }

    try {
      setLoading(true);
      await updateBatchById(selectedBatchId, batchData);
      setSelectedBatchId(null);
      setBatchData({ batch_name: "", description: "", start_date: "", end_date: "", cost: "" });
      toast.success("Batch updated successfully!");
      fetchBatches();
    } catch (err) {
      toast.error("Failed to update batch.");
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
    <div className="m-0">
      <Sidebar open={open} setOpen={setOpen} />
      <div className={`transition-all duration-300 ${open ? 'md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[75%]' : 'ml-24 mr-2'} md:w-[90%]  w-[95%]`}>
        <div className="p-6 max-w-4xl mx-auto bg-secondary-gray rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-primary-purple mb-4">Batch Management</h2>
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="text"
            placeholder="Batch Name"
            value={batchData.batch_name}
            onChange={(e) => setBatchData({ ...batchData, batch_name: e.target.value })}
            className="border p-3 w-full mb-3 rounded-lg bg-primary-white shadow-sm"
          />
          <div className="flex justify-between gap-2">
            <div className="w-1/2">
              <h1 className="text-xl">Start date</h1>
              <input
                type="date"
                placeholder="Start Date"
                value={batchData.start_date || ""}
                onChange={(e) => setBatchData({ ...batchData, start_date: e.target.value })}
                className="border p-3 w-full mb-3 rounded-lg bg-primary-white shadow-sm"
              />
            </div>
            <div className="w-1/2">
              <h1 className="text-xl">End date</h1>
              <input
                type="date"
                placeholder="End Date"
                value={batchData.end_date || ""}
                onChange={(e) => setBatchData({ ...batchData, end_date: e.target.value })}
                className="border p-3 w-full mb-3 rounded-lg bg-primary-white shadow-sm"
              />
            </div>
            <div className="w-1/2">
              <h1 className="text-xl">Cost</h1>
              <input
                type="text"
                placeholder="Cost"
                value={batchData.cost}
                onChange={(e) => setBatchData({ ...batchData, cost: e.target.value })}
                className="border p-3 w-full mb-3 rounded-lg bg-primary-white shadow-sm"
              />
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <label htmlFor="image" className="flex items-center justify-center w-48 h-48 border-2 border-dashed border-primary-purple rounded-lg cursor-pointer">
              {
                selectedImage ? (
                  <img src={URL.createObjectURL(selectedImage)} className="h-full w-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14V6h-4v2m0 10h3a1 1 0 001-1V7a1 1 0 00-1-1H3a1 1 0 00-1 1v3H1v2h2v3z" />
                  </svg>
                )
              }
            </label>
            <input type="file" id="image" className="hidden" onChange={(e) => setSelectedImage(e.target.files[0])} />
          </div>

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
                  {/* <p className="text-gray-400 text-xs">Teacher: {batch.teacher_email}</p> */}
                </div>
                <div className="flex space-x-2 text-black">
                  <button
                    onClick={() => {
                      setSelectedBatchId(batch.batch_id);
                      setBatchData({
                        batch_name: batch.batch_name,
                        description: batch.description,
                        start_date: batch.start_date,
                        end_date: batch.end_date,
                        cost: batch.cost
                      });
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
      </div>
    </div>
  );
};

export default Batch;
