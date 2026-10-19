import React, { useEffect, useState } from 'react';

// React-Router
import { Link } from 'react-router-dom';

// Context

// Vena-DB
import authDB from '../config/authDB'; 


const HomePage = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);


    useEffect(() => {
        authDB.checkSession(setIsLoggedIn, setUsername);
    }, [])

    return (
        <div>
            <h1>HomePage</h1>

            {isLoggedIn && <p>Welcome back, {username}. You are already signed in!</p>}
            {isLoggedIn && <Link to="/dashboard" ><h3>Go to Dashboard</h3></Link>}

            {!isLoggedIn && <Link to="/login">
                <h2>Sign In</h2>
            </Link>}

            {!isLoggedIn && <Link to="/signup">
                <h2>Sign Up</h2>
            </Link>}
        </div>
    );
}

export default HomePage;