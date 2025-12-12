import { Outlet } from "react-router-dom";
import Sidebar from "../../Sidebar/components/Sidebar";
import Navbar from "../../Navbar/components/Navbar";
import "../utils/Layout.scss";

const Layout = () => {
    return (
        <>

            <Sidebar />
            <main className="app-content">
                <div className="navbar-container">
                    <Navbar />
                </div>
                <Outlet />
            </main>
        </>
    );
};

export default Layout;