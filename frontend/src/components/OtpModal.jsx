import { useState } from "react";
import axios from "axios";

const OtpModal = ({ name, email, password, onClose, onSuccess }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        name, 
        email, 
        password,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      onSuccess(); // navigate or close modal
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h3 className="text-lg font-semibold mb-4">Enter OTP</h3>
        <input
          type="text"
          className="w-full p-2 border rounded mb-3"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600 hover:underline">Cancel</button>
          <button onClick={handleVerify} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Verify</button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
