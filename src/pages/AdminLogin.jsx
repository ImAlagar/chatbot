// pages/AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useAdminAuth } from "../context/AdminAuthContext";
import chatbot1 from "../assets/chatbot1.jpg"; // Reuse your background image

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    if (!email || !password) {
      toast.warning("Admin email & password required");
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const isSuccess = login(email, password);
      if (isSuccess) {
        toast.success("Admin login successful 🎉");
        navigate("/signup"); // Redirect to signup page
      } else {
        toast.error("Invalid admin credentials");
      }
      setLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdminLogin();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center font-poppins"
      style={{
        backgroundImage: `url(${chatbot1})`,
      }}
    >
      <div className="relative w-[350px] rounded-2xl border border-white/70 backdrop-blur-3xl shadow-2xl">
        <div className="p-6 relative">
          <h2 className="text-2xl font-semibold text-center mt-8 mb-8">
            Admin Access
          </h2>
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
            Enter admin credentials to access signup page
          </p>

          {/* Email */}
          <div className="relative mb-8">
            <input
              type="email"
              required
              className="peer w-full bg-transparent border-b border-black dark:border-white pt-5 pb-1 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder=" "
            />
            <label className="absolute left-0 top-4 transition-all pointer-events-none
              peer-focus:-top-1 peer-focus:text-xs
              peer-valid:-top-1 peer-valid:text-xs
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base">
              Admin Email
            </label>
            <Mail size={16} className="absolute right-0 top-5" />
          </div>

          {/* Password */}
          <div className="relative mb-8">
            <input
              type={showPassword ? "text" : "password"}
              required
              className="peer w-full bg-transparent border-b border-black dark:border-white pt-5 pb-1 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder=" "
            />
            <label className="absolute left-0 top-4 transition-all pointer-events-none
              peer-focus:-top-1 peer-focus:text-xs
              peer-valid:-top-1 peer-valid:text-xs
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base">
              Admin Password
            </label>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-5"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleAdminLogin}
            disabled={loading}
            className="w-full bg-gray-700 text-white py-2.5 rounded-md mb-4 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Admin Login"}
          </button>

          {/* Back to normal login */}
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Back to User Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;