import React, { useState } from 'react';

// Vena-DB
import vena_db from "../../config/supabaseClient";

// Toastify
import { toast } from 'react-toastify';
import toastifyOptions from '../../mocks/toastifyOptions';


const SignInPage = () => {

    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [message, setMessage] = useState("");


    const handleSignIn = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (emailInput === "" || passwordInput === "") {
            toast.error("Please fill all the inputs", toastifyOptions.darkTopRight)
            return;
        }

        const { data, error } = await vena_db.auth.signInWithPassword({
            email: emailInput,
            password: passwordInput
        });

        if (error) {
            setMessage(error.message);
            
            if (error.status === 400) {
                toast.error(error.message, toastifyOptions.darkTopRight);
            }

            return;
        }

        if (data) {
            setMessage("You are now signed in!");
            toast.success("You are now signed in!", toastifyOptions.darkTopRight);
        }

        setEmailInput("");
        setPasswordInput("");
    }


    return (
        <div>
            <h2>Sign In Page</h2>
            <form onSubmit={handleSignIn}>
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
                <button type='submit'>Sign In</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default SignInPage;