// React-Icons
import { FaHeartbeat, FaFacebook, FaGoogle, FaGithub } from "react-icons/fa";
import { BsFillGrid3X3GapFill } from "react-icons/bs";


export const navLinks = [
    {
        name: "Dashboard",
        icon: <BsFillGrid3X3GapFill />,
        path: "/dashboard"
    },
    // {
    //     name: "Deneme",
    //     icon: <IoWallet />,
    //     path: "/deneme"
    // },
    {
        name: "Heart",
        icon: <FaHeartbeat />,
        path: "/dashboard/heart"
    },
    {
        name: "Google",
        icon: <FaGoogle />,
        path: "/dashboard/google"
    },
    {
        name: "Facebook",
        icon: <FaFacebook />,
        path: "/dashboard/facebook"
    },
    {
        name: "Github",
        icon: <FaGithub />,
        path: "/dashboard/github"
    }
];