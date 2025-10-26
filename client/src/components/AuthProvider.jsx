import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import Loader from "./Loader";

export function AuthProvider({ children }) {
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    const unsubscribe = init();
    return () => unsubscribe();
  }, [init]);

  return children;
}

export function PrivateRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex justify-center item-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export function AuthRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex justify-center item-center">
        <Loader />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
}
