import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <div>
      <Header />
      <div className="px-4 py-10 mx-auto max-w-8xl">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
