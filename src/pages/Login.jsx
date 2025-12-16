import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import { toast } from "react-toastify";
import chatbot1 from "../assets/chatbot1.jpg"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.warning("Email & password required");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful 🎉");
      navigate("/chat");
    } catch (err) {
      toast.error("Invalid email or password");
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
      <div className="relative w-[350px] rounded-2xl border border-white/70 backdrop-blur-3xl shadow-2xl">
        <div className="p-6 relative">



          <h2 className="text-2xl  font-semibold text-center mt-8 mb-8">
            Sign In
          </h2>

          {/* Email */}
          <div className="relative mb-8">
            <input
              type="email"
              required
              className="peer w-full bg-transparent border-b border-black pt-5 pb-1 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="absolute left-0 top-4 transition-all pointer-events-none
              peer-focus:-top-1 peer-focus:text-xs
              peer-valid:-top-1 peer-valid:text-xs">
              Email Address
            </label>
            <Mail size={16} className="absolute right-0 top-5" />
          </div>

          {/* Password */}
          <div className="relative mb-8">
            <input
              type={showPassword ? "text" : "password"}
              required
              className="peer w-full bg-transparent border-b border-black pt-5 pb-1 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="absolute left-0 top-4 transition-all pointer-events-none
              peer-focus:-top-1 peer-focus:text-xs
              peer-valid:-top-1 peer-valid:text-xs">
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

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gray-700 text-white py-2.5 rounded-md mb-4"
          >
            {loading ? "Logging in..." : "Login"}
          </button>



        </div>
      </div>
    </div>
  );
};

export default Login;
