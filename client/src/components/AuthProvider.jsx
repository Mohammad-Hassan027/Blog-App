import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import Loader from "./Loader";

// Initialize auth state listener
export function AuthProvider({ children }) {
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    const unsubscribe = init();
    return () => unsubscribe();
  }, [init]);

  return children;
}

// Protect routes that require authentication
export function PrivateRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex item-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

// Redirect authenticated users away from auth pages
export function AuthRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex item-center justify-center">
        <Loader />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
}
