import React from "react";

// Styles
import "./sass/globals.scss";

// React-Router
import { router } from "./routes/routes";
import { RouterProvider } from "react-router-dom";


const App = () => {

	return (
		<div className={`App`}>
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
