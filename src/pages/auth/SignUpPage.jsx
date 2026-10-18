import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Vena-DB
import vena_db from "../../config/supabaseClient";

// Toastify
import { toast } from 'react-toastify';
import toastifyOptions from '../../mocks/toastifyOptions';


const SignUpPage = () => {

    const navigate = useNavigate();

    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [message, setMessage] = useState("");


    const handleSignUp = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (emailInput === "" || passwordInput === "") {
            toast.error("Please fill all the inputs", toastifyOptions.darkTopRight)
            return;
        }

        if (passwordInput.length < 6) {
            toast.error("Password must be at least 6 characters", toastifyOptions.darkTopRight);
            return;
        }
        
        const { data, error } = await vena_db.auth.signUp({
            email: emailInput,
            password: passwordInput
        });

        if (error) {
            setMessage(error.message);

            if (error.status === 422) {
                toast.error(error.message, toastifyOptions.darkTopRight);
            }

            return;
        }

        if (data) {
            setMessage("Check your email for confirmation!");
            toast.success("Check your email for confirmation!", toastifyOptions.darkTopRight);
            navigate("/login");
        }

        setEmailInput("");
        setPasswordInput("");
    }

    return (
        <div>
            <h2>Sign Up Page</h2>
            <form onSubmit={handleSignUp}>
                <input
                    type="email"
                    placeholder='Email'
                    value={emailInput}
                    onChange={(event) => setEmailInput(event.target.value)}
                />
                <input
                    type="password"
                    placeholder='Password'
                    value={passwordInput}
                    onChange={(event) => setPasswordInput(event.target.value)}
                />
                <button type='submit'>Sign Up</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default SignUpPage;