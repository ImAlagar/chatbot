import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff, X } from "lucide-react";
import { toast } from "react-toastify";
import { useAdminAuth } from "../context/AdminAuthContext";
import chatbot1 from "../assets/chatbot1.jpg"

const Signup = () => {
    const { logout } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) {
      toast.warning("Email & password required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully 🎉");
      navigate("/chat");
    } catch (error) {
      // Friendly Firebase errors
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already registered");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address");
      } else if (error.code === "auth/weak-password") {
        toast.error("Weak password");
      } else {
        toast.error("Signup failed. Try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center font-poppins"
      style={{
        backgroundImage: `url(${chatbot1})`,
      }}
    >
      <div className="relative w-[340px] rounded-2xl border border-white/70 backdrop-blur-3xl shadow-2xl overflow-hidden">
        <div className="p-6 relative">

          {/* Close Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-0 right-0 p-2 bg-white/50 rounded-md hover:scale-105 transition"
          >
            <X size={16} />
          </button>

          <h2 className="text-2xl font-semibold text-center mt-8 mb-8">
            Create Account
          </h2>

          {/* Email */}
          <div className="relative mb-6">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full bg-transparent border-b border-black pt-5 pb-1 outline-none placeholder-transparent"
            />

            <label className="
              absolute left-0 top-4 text-black transition-all
              peer-focus:-top-1 peer-focus:text-xs
              peer-valid:-top-1 peer-valid:text-xs
            ">
              Email Address
            </label>

            <Mail size={16} className="absolute right-0 top-5" />
          </div>

          {/* Password */}
          <div className="relative mb-8">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full bg-transparent border-b border-black pt-5 pb-1 outline-none placeholder-transparent"
            />

            <label className="
              absolute left-0 top-4 text-black transition-all
              peer-focus:-top-1 peer-focus:text-xs
              peer-valid:-top-1 peer-valid:text-xs
            ">
              Password
            </label>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-5"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-2.5 rounded-md disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Footer */}
          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="font-semibold cursor-pointer"
            >
              Login here
            </span>
            
          </p>

          <div className="flex items-center justify-center">
                <button
              onClick={() => {
                logout();
                navigate("/admin-login");
              }}
              className=" text-center text-white bg-gradient-to-r from-emerald-700 to-emerald-900 border-black  p-2 rounded-md text-sm mt-6"
            >
              Admin Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
