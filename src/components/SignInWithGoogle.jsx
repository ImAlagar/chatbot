import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // ✅ IMPORTANT
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignInWithGoogle = () => {
  const navigate = useNavigate();

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        await setDoc(
          doc(db, "Users", user.uid),
          {
            email: user.email,
            firstName: user.displayName,
            photo: user.photoURL,
            lastName: "",
          },
          { merge: true }
        );

        toast.success("Logged in with Google 🎉");
        navigate("/chat");
      }
    } catch (error) {
      console.error(error);
      toast.error("Google login failed");
    }
  };

  return (
    <>
      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-black"></div>
        <span className="mx-4 text-xs">OR</span>
        <div className="flex-grow border-t border-black"></div>
      </div>

      {/* Google Button */}
      <button
        onClick={googleLogin}
        className="w-full flex items-center justify-center gap-3 border border-black py-2 rounded-md hover:bg-black hover:text-white transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>
    </>
  );
};

export default SignInWithGoogle;
