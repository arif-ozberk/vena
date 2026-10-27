// React-Icons
import { FaCalendarAlt, FaProjectDiagram } from "react-icons/fa";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { BiSolidReport } from "react-icons/bi";
import { MdSettingsInputComponent } from "react-icons/md";


export const navLinks = [
    {
        name: "Dashboard",
        icon: <BsFillGrid3X3GapFill />,
        path: "/dashboard"
    },
    {
        name: "Calendar App",
        icon: <FaCalendarAlt />,
        path: "/dashboard/calendar-app"
    },
    {
        name: "Project Report",
        icon: <BiSolidReport />,
        path: "/dashboard/project-report"
    },
    {
        name: "Project Components",
        icon: <MdSettingsInputComponent />,
        path: "/dashboard/project-components"
    },
    {
        name: "About Vena",
        icon: <FaProjectDiagram />,
        path: "/dashboard/about-vena"
    }
];