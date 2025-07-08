import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddPurchase from "./pages/AddPurchase";
import SellerPurchases from "./pages/SellerPurchases";
import UserDashboard from "./pages/UserDashboard";


// import Dashboard from "./pages/Dashboard"; // to be created

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seller/add-purchase" element={<AddPurchase />} />
        <Route path="/seller/purchases" element={<SellerPurchases />} />
        <Route path="/user/purchases" element={<UserDashboard />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
