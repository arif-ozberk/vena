// Routes
import { navLinks } from "../routes/navLinks";


const appName = "Vena | "


export const setTabName = (setCurrentPage) => {

    if (location.pathname === "/404") {
        setCurrentPage({
            name: "Not Found",
        });
        document.title = appName + "Not Found";
        return;
    }

    if (location.pathname === "/") {
        setCurrentPage({
            name: "Home Page",
        });
        document.title = appName + "Home Page";
        return;
    }

    if (location.pathname === "/dashboard") {
        setCurrentPage({
            name: "Dashboard",
        });
        document.title = appName + "Dashboard";
        return;
    }

    if (location.pathname === "/signin") {
        setCurrentPage({
            name: "Sign In",
        });
        document.title = appName + "Sign In";
        return;
    }

    if (location.pathname === "/signup") {
        setCurrentPage({
            name: "Sign Up",
        });
        document.title = appName + "Sign Up";
        return;
    }

    if (location.pathname === "/dashboard/user-settings") {
        setCurrentPage({
            name: "User Settings",
        });
        document.title = appName + "User Settings";
        return;
    }

    if (location.pathname === "/dashboard/project-report") {
        setCurrentPage({
            name: "Project Report",
        });
        document.title = appName + "Project Report";
        return;
    }

    if (location.pathname === "/dashboard/calendar-app") {
        setCurrentPage({
            name: "Calendar App",
        });
        document.title = appName + "Calendar App";
        return;
    }

    if (location.pathname === "/dashboard/project-components") {
        setCurrentPage({
            name: "Project Components",
        });
        document.title = appName + "Project Components";
        return;
    }

    if (location.pathname === "/dashboard/about-vena") {
        setCurrentPage({
            name: "About Vena",
        });
        document.title = appName + "About Vena";
        return;
    }

    setTabName(navLinks.find((link) => link.path === location.pathname));
    document.title = (navLinks.find((link) => link.path === location.pathname)).name.charAt(0).toUpperCase() +
        (navLinks.find((link) => link.path === location.pathname)).name.slice(1);
}