import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, user, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const loginMessage = location.state?.message;
  const redirectTo = location.state?.redirectTo || "/";

  // ✅ Redirect AFTER user is set
  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, redirectTo, navigate]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await signIn(email, password);
  } catch {
    alert("Invalid login credentials");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6">
          Sign in to your account
        </h2>

                {/* ✅ MESSAGE FROM CHECKOUT */}
        {loginMessage && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4">
            {loginMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-right text-sm">
        <Link
        to="/forgot-password"
        className="text-sm text-purple-600 hover:underline text-right block"
        >
        Forgot password?
        </Link>
        </p>

        <p className="text-center text-sm mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-purple-600 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;