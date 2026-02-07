import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuthStore();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  return children;
};

export default PublicRoute;
