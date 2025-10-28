import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="flex flex-col max-w-7xl mx-auto">
      <Header />
      <div className="px-2 sm:px-4 py-3 sm:py-8 md:py-10 mx-auto max-w-8xl">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
