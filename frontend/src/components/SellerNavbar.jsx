import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Install: npm i lucide-react

const SellerNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">OwnIt Seller</h1>

        {/* Hamburger Icon */}
        <button className="md:hidden" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <Link to="/seller/add-purchase" className="hover:underline">
            Add Purchase
          </Link>
          <Link to="/seller/purchases" className="hover:underline">
            Purchases
          </Link>
          <Link to="/seller/requests" className="hover:underline">
            Service Requests
          </Link>
          <button onClick={handleLogout} className="bg-red-400 px-3 py-1 rounded hover:bg-red-500">
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="flex flex-col md:hidden mt-2 space-y-2">
          <Link to="/seller/add-purchase" className="hover:underline" onClick={toggleMenu}>
            Add Purchase
          </Link>
          <Link to="/seller/purchases" className="hover:underline" onClick={toggleMenu}>
            Purchases
          </Link>
          <Link to="/seller/requests" className="hover:underline" onClick={toggleMenu}>
            Service Requests
          </Link>
          <button onClick={handleLogout} className="bg-red-400 px-3 py-1 rounded hover:bg-red-500">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default SellerNavbar;
