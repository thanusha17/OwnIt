import { useState } from "react";
import axios from "axios";
import SellerNavbar from "../components/SellerNavbar";

const AddPurchase = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    product_name: "",
    invoice_number: "",
    purchase_date: "",
    warranty_period: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/seller/new-purchase",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
      setFormData({
        customer_name: "",
        customer_email: "",
        product_name: "",
        invoice_number: "",
        purchase_date: "",
        warranty_period: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
    <SellerNavbar />
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Add New Purchase</h2>

        {message && <p className="text-center text-sm text-blue-600 mb-3">{message}</p>}

        <input
          type="text"
          name="customer_name"
          placeholder="Customer Name"
          value={formData.customer_name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="email"
          name="customer_email"
          placeholder="Customer Email"
          value={formData.customer_email}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="text"
          name="product_name"
          placeholder="Product Name"
          value={formData.product_name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="text"
          name="invoice_number"
          placeholder="Invoice Number"
          value={formData.invoice_number}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="date"
          name="purchase_date"
          placeholder="Purchase Date"
          value={formData.purchase_date}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="number"
          name="warranty_period"
          placeholder="Warranty Period (months)"
          value={formData.warranty_period}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
    </>
  );
};

export default AddPurchase;
