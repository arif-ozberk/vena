import React from 'react';
import { Link } from 'react-router-dom';


const HomePage = () => {

    return (
        <div>
            <h1>HomePage</h1>
            <Link to="/login">
                <h2>Sign In</h2>
            </Link>
            <Link to="/signup">
                <h2>Sign Up</h2>
            </Link>
        </div>
    );
}

export default HomePage;