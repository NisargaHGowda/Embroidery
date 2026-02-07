import { useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { validatePassword } from "../../utils/passwordStrength";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signUp, loading } = useAuthStore();
  const navigate = useNavigate();

  const isStrongPassword = (password: string) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&      // uppercase
    /[a-z]/.test(password) &&      // lowercase
    /[0-9]/.test(password) &&      // number
    /[^A-Za-z0-9]/.test(password) // special char
  );
};

  // ✅ Redirect once user exists
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!/^\d{10}$/.test(phoneNumber)) {
    setError("Phone number must be exactly 10 digits");
    return;
  }

  if (!isStrongPassword(password)) {
  setError(
    "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
  );
  return;
}

    const passwordError = validatePassword(password);
  if (passwordError) {
    setError(passwordError);
    return;
  }

  try {
    await signUp(email, password, fullName, phoneNumber);
    navigate("/login", { replace: true });
  } catch (err: any) {
    setError(err.message || "User already registered");
  }

};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create your account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border p-3 rounded"
          />

          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            placeholder="Phone Number"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border p-3 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded"
          />

          <p className="text-xs text-gray-500">
          Password must contain:
          <br />• At least 8 characters
          <br />• Uppercase letter
          <br />• Lowercase letter
          <br />• Number
          <br />• Special character
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
