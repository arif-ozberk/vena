import React, { useEffect, useState } from 'react';

// React-Router
import { Link } from 'react-router-dom';

// Context

// Vena-DB
import authDB from '../config/authDB'; 


const HomePage = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        authDB.checkSession(setIsLoggedIn, setUsername, setIsLoading);
    }, []);

    return (
        <div>
            <h1>HomePage</h1>

            {/* {isLoggedIn && <p>Welcome back, {username}. You are already signed in!</p>}
            {isLoggedIn && <Link to="/dashboard" ><h3>Go to Dashboard</h3></Link>}

            {!isLoggedIn && <Link to="/signin">
                <h2>Sign In</h2>
            </Link>}

            {!isLoggedIn && <Link to="/signup">
                <h2>Sign Up</h2>
            </Link>} */}

            {isLoading ? (
                // Renders nothing or a placeholder while the async check finishes
                <div style={{ minHeight: '40px' }} />
            ) : isLoggedIn ? (
                <div>
                    <p>Welcome back, {username}. You are already signed in!</p>
                    <Link to="/dashboard">
                        <h3>Go to Dashboard</h3>
                    </Link>
                </div>
            ) : (
                <div>
                    <Link to="/signin">
                        <h2>Sign In</h2>
                    </Link>
                    <Link to="/signup">
                        <h2>Sign Up</h2>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default HomePage;