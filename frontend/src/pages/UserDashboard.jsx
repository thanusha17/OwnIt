import { useEffect, useState } from "react";
import axios from "axios";
import UserNavbar from "../components/UserNavbar";

const UserDashboard = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/user/purchases", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPurchases(res.data);
      } catch (err) {
        console.error("Error fetching purchases:", err);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <>
    <UserNavbar />
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-semibold mb-10 mu-6 text-center underline">Your Purchases</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <h3 className="text-lg font-semibold">{purchase.product}</h3>
            <p className="text-sm text-gray-600">Invoice: {purchase.invoice_no}</p>
            <p className="text-sm text-gray-600">Purchased on: {new Date(purchase.purchase_date).toLocaleDateString()}</p>
            <p className="text-sm mt-2">
              Warranty: {purchase.warranty_period} months
            </p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default UserDashboard;
