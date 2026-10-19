import React from "react";

// Styles
import "./sass/globals.scss";

// React-Router
import { router } from "./routes/routes";
import { RouterProvider } from "react-router-dom";

// Context
import { AuthContextProvider } from "./context/AuthContext";


const App = () => {

	return (
		<AuthContextProvider>
			<div className={`App`}>
				<RouterProvider router={router} />
			</div>
		</AuthContextProvider>
	);
}

export default App;
