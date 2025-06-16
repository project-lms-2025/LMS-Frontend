import { useEffect, useState } from "react";
import { Edit, Paperclip, Trash2 } from "lucide-react";
import {
  getAllBatches,
  createBatch,
  getBatchById,
  updateBatchById,
  deleteBatchById,
} from "../../api/auth";
import { uploadBatchImageToS3 } from "../../api/test";
import toast from "react-hot-toast";
import Sidebar from "../../components/Sidebar";
import { v4 as uuidv4 } from "uuid";

const Batch = () => {
  const [open, setOpen] = useState(false);
  const [batches, setBatches] = useState([]);
  const [batchData, setBatchData] = useState({ batch_id: uuidv4(), batch_name: "", description: "", start_date: "", end_date: "", cost: "" });
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await getAllBatches();
      if (response && response.success && Array.isArray(response.data)) {
        // Sort batches by start_date in descending order (newest first)
        const sortedBatches = [...response.data].sort(
          (a, b) => new Date(b.start_date) - new Date(a.start_date)
        );
        console.log("Fetched and sorted Batches:", sortedBatches);
        setBatches(sortedBatches);
      } else {
        setBatches([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file, batchId) => {
    if (!file) return "";
    try {
      setIsUploading(true);
      const url = await uploadBatchImageToS3(file, batchId);
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return "";
    } finally {
      setIsUploading(false);
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
      
      let imageUrl = "";
      // If there's an image selected, upload it first
      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage, batchData.batch_id);
      }
      
      // Create the batch with all data including image URL if available
      const batchPayload = {
        ...batchData,
        ...(imageUrl && { image_url: imageUrl }) // Only include image_url if available
      };
      
      await createBatch(batchPayload);
      
      // Reset form and fetch updated batch list
      setBatchData({ batch_id: uuidv4(), batch_name: "", description: "", start_date: "", end_date: "", cost: "" });
      setSelectedImage(null);
      setImageUrl("");
      toast.success("Batch created successfully!");
      fetchBatches();
    } catch (err) {
      console.error("Error creating batch:", err);
      toast.error(err.message || "Failed to create batch");
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
      
      // First update the batch data
      const updateData = { ...batchData };
      
      // If there's a new image selected, upload it
      if (selectedImage) {
        const imageUrl = await handleImageUpload(selectedImage, selectedBatchId);
        if (imageUrl) {
          updateData.image_url = imageUrl;
        }
      }
      
      // Update the batch with the new data
      await updateBatchById(selectedBatchId, updateData);
      
      // Reset form and fetch updated batch list
      setSelectedBatchId(null);
      setBatchData({ batch_name: "", description: "", start_date: "", end_date: "", cost: "" });
      setSelectedImage(null);
      setImageUrl("");
      toast.success("Batch updated successfully!");
      fetchBatches();
    } catch (err) {
      console.error("Error updating batch:", err);
      toast.error(err.message || "Failed to update batch");
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
      <div className={`transition-all mt-14 pt-12 duration-300 ${open ? 'md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[70%]' : 'ml-24 mr-2 md:w-[90%]  w-[95%]'}`}>
        <div className="p-6  max-w-4xl mx-auto bg-secondary-gray rounded-lg shadow-lg">
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
              <h1 className="text-xl text-primary-purple  ">Start date</h1>
              <input
                type="date"
                placeholder="Start Date"
                value={batchData.start_date || ""}
                onChange={(e) => setBatchData({ ...batchData, start_date: e.target.value })}
                className="border p-3 w-full mb-3 rounded-lg bg-primary-white shadow-sm"
              />
            </div>
            <div className="w-1/2">
              <h1 className="text-xl text-primary-purple">End date</h1>
              <input
                type="date"
                placeholder="End Date"
                value={batchData.end_date || ""}
                onChange={(e) => setBatchData({ ...batchData, end_date: e.target.value })}
                className="border p-3 w-full mb-3 rounded-lg bg-primary-white shadow-sm"
              />
            </div>
            <div className="w-1/2">
              <h1 className="text-xl text-primary-purple">Cost</h1>
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
            <label htmlFor="image" className="flex items-center justify-center w-48 h-48 border-2 border-dashed border-primary-purple rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              {isUploading ? (
                <div className="text-primary-purple">Uploading...</div>
              ) : selectedImage ? (
                <img 
                  src={URL.createObjectURL(selectedImage)} 
                  className="h-full w-full object-cover rounded-lg"
                  alt="Selected batch"
                />
              ) : imageUrl ? (
                <img 
                  src={imageUrl} 
                  className="h-full w-full object-cover rounded-lg"
                  alt="Current batch"
                />
              ) : (
                <div className="text-center p-4">
                  <Paperclip
                    className="h-12 w-12 text-primary-purple mx-auto mb-2" 
                    strokeWidth={2}
                  />
                  <span className="text-sm text-gray-500">Click to upload an image</span>
                </div>
              )}
            </label>
            <input 
              type="file" 
              id="image" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedImage(file);
                }
              }} 
            />
            {selectedImage && (
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  setImageUrl("");
                }}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>

          <textarea
            placeholder="Batch Description"
            value={batchData.description}
            onChange={(e) => setBatchData({ ...batchData, description: e.target.value })}
            className="border p-3 w-full mb-3 rounded-lg bg-primary-white shadow-sm"
          ></textarea>
          <button
            onClick={selectedBatchId ? handleUpdateBatch : handleCreateBatch}
            className="bg-primary-purple text-primary-white p-3 w-full rounded-lg font-semibold hover:bg-opacity-90 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
            disabled={loading || isUploading}
          >
            {loading || isUploading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isUploading ? 'Uploading...' : (selectedBatchId ? 'Updating...' : 'Creating...')}
              </>
            ) : (
              selectedBatchId ? "Update Batch" : "Create Batch"
            )}
          </button>
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Batches</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...batches]
                .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
                .map((batch) => (
                <div key={batch.batch_id} className="group relative aspect-square bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Start Date Tag */}
                  <div className="absolute top-0 right-0 bg-primary-purple text-white px-2 py-1 text-xs font-medium rounded-bl-lg z-10">
                    {new Date(batch.start_date).toLocaleDateString()}
                  </div>
                  
                  {/* Batch Image */}
                  <div className="h-[60%] bg-gray-100 overflow-hidden">
                    {batch.banner ? (
                      <img 
                        src={batch.banner} 
                        alt={batch.batch_name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-purple to-accent-blue">
                        <span className="text-white text-2xl font-bold">{batch.batch_name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Batch Info */}
                  <div className="p-4 h-[40%] flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg truncate">{batch.batch_name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{batch.description}</p>
                    </div>
                    <div className=" flex justify-between items-center">
                      <span className="text-sm font-medium text-primary-purple">₹{batch.cost}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBatchId(batch.batch_id);
                            setBatchData({
                              batch_name: batch.batch_name,
                              description: batch.description,
                              start_date: batch.start_date,
                              end_date: batch.end_date,
                              cost: batch.cost
                            });
                          }}
                          className="p-1.5 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        {/* <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBatch(batch.batch_id);
                          }}
                          className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          disabled={loading}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Batch;
