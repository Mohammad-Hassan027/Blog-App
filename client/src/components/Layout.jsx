import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <div>
      <Header />
      <div className="max-w-8xl mx-auto py-10 px-4">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
