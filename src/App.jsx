import React from "react";

// Styles
import "./sass/globals.scss";

// React-Router
import { router } from "./routes/routes";
import { RouterProvider } from "react-router-dom";

// Context
import { AuthContextProvider } from "./context/AuthContext";
import { UIContextProvider } from "./context/UIContext";

// React-Toastify
import { ToastContainer } from "react-toastify";


const App = () => {

	return (
		<AuthContextProvider>
			<UIContextProvider>
				<div className={`App`}>
					<RouterProvider router={router} />
				</div>
			</UIContextProvider>
		</AuthContextProvider>
	);
}

export default App;
