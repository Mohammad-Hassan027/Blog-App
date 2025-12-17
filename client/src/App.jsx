import { lazy, Suspense } from "react"; //
import { useRoutes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AuthProvider,
  PrivateRoute,
  AuthRoute,
} from "./components/AuthProvider";
import Layout from "./components/Layout";
import Loader from "./components/Loader"; // Ensure you import your Loader component

// 1. Replace static imports with lazy imports
const Home = lazy(() => import("./pages/Home/Home"));
const CreatePost = lazy(() => import("./pages/Create-post/CreatePost"));
const SinglePost = lazy(() => import("./pages/SinglePost/SInglePost"));
const AllPostsPage = lazy(() => import("./pages/All-posts"));
const AboutPage = lazy(() => import("./pages/About-us/index"));
const ContactPage = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const DashBoard = lazy(() => import("./pages/Dashboard"));
const EditPost = lazy(() => import("./pages/Edit-post/EditPost"));
const Profile = lazy(() => import("./pages/Profile/Profile"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

function Routes() {
  const element = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/post/:id",
          element: <SinglePost />,
        },
        {
          path: "create",
          element: (
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          ),
        },
        {
          path: "edit-post/:id",
          element: (
            <PrivateRoute>
              <EditPost />
            </PrivateRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          ),
        },
        {
          path: "dashboard",
          element: (
            <PrivateRoute>
              <DashBoard />
            </PrivateRoute>
          ),
        },
        {
          path: "/all-posts",
          element: <AllPostsPage />,
        },
        {
          path: "/about",
          element: <AboutPage />,
        },
        {
          path: "/contact",
          element: <ContactPage />,
        },
        {
          path: "/login",
          element: (
            <AuthRoute>
              <Login />
            </AuthRoute>
          ),
        },
        {
          path: "/register",
          element: (
            <AuthRoute>
              <Register />
            </AuthRoute>
          ),
        },
      ],
    },
  ]);
  return element;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              <Loader />
            </div>
          }
        >
          <Routes />
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
