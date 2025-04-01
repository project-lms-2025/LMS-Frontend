// SuccessPopup.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SuccessPopup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/resultList");
    }, 2000); // wait 3 seconds then redirect
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white z-50">
      <div className="text-purple-600 text-6xl mb-6">✅</div>
      <h2 className="text-2xl font-bold mb-4 text-black">
        Test Submitted Successfully
      </h2>
      <div className="bg-purple-600 text-white px-6 py-3 rounded-full">
        Redirecting to Home
      </div>
    </div>
  );
};

export default SuccessPopup;
