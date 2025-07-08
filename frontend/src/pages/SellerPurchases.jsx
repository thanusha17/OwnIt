import { useEffect, useState } from 'react';
import axios from 'axios';
import SellerNavbar from "../components/SellerNavbar";

const SellerPurchases = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/seller/purchases', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPurchases(res.data);
      } catch (err) {
        console.error('Error fetching purchases:', err);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <>
    <SellerNavbar />

    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-semibold mb-10 mu-6 text-center underline">Purchases</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {purchases.map((purchase, idx) => (
          <div key={idx} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-2">{purchase.product_name}</h3>
            <p><strong>Customer:</strong> {purchase.customer_name}</p>
            <p><strong>Email:</strong> {purchase.customer_email}</p>
            <p><strong>Invoice:</strong> {purchase.invoice_no}</p>
            <p><strong>Purchase Date:</strong> {new Date(purchase.purchase_date).toLocaleDateString()}</p>
            <p><strong>Warranty:</strong> {purchase.warranty_period} months</p>
          </div>
        ))}
      </div>
    </div>
     </>
  );
};

export default SellerPurchases;
