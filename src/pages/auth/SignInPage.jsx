import React, { useContext, useEffect, useState } from 'react';

// Styles
import styles from "../../sass/auth_stlyes/Auth.module.scss";

// Assets
import venaLogo from "../../assets/vena-logo.png";

// React-Router
import { Link, useNavigate } from 'react-router-dom';

// Context
import { AuthContext } from '../../context/AuthContext';

// Vena-DB
import vena_db from "../../config/supabaseClient";
import authDB from '../../config/authDB';

// Toastify
import { toast } from 'react-toastify';
import toastifyOptions from '../../mocks/toastifyOptions';

// React-Icons
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";


const SignInPage = () => {

    const navigate = useNavigate();

    const {
        isAuthenticated,
        setIsAuthenticated,
        setUserSession,
        isSessionLoading,
        setIsSessionLoading,
        setLoggedUserData
    } = useContext(AuthContext);

    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [message, setMessage] = useState("");

    const [passwordVisible, setPasswordVisible] = useState(false);


    useEffect(() => {
        authDB.getSession(setIsAuthenticated, setUserSession, setIsSessionLoading, setLoggedUserData);

        window.scrollTo(0, 0);
    }, []);


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
            navigate("/dashboard");
        }

        setEmailInput("");
        setPasswordInput("");
    }


    if (isSessionLoading) return (
        <>

        </>
    );

    else {
        if (isAuthenticated) return (
            navigate("/dashboard")
        )

        if (!isAuthenticated) return (
            <div className={styles.authPage}>
                <div className={styles.leftContainer}>
                    <Link to="/" className={styles.venaLogo}>
                        <img src={venaLogo} alt="vena-logo-png" />
                        <p>Vena</p>
                    </Link>

                    <div className={styles.authForm}>
                        <h1>Welcome Back</h1>
                        <p className={styles.authInfo}>Enter your email and password to access your account</p>
                        <form onSubmit={handleSignIn}>
                            <div className={styles.emailInput}>
                                <h4>Email</h4>
                                <input
                                    type="email"
                                    placeholder='Enter your email'
                                    onChange={(event) => setEmailInput(event.target.value)}
                                    value={emailInput}
                                />
                            </div>
                            <div className={styles.passwordInput}>
                                <h4>Password</h4>
                                <div>
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder='Enter your password'
                                        onChange={(event) => setPasswordInput(event.target.value)}
                                        value={passwordInput}
                                    />
                                    {passwordVisible ?
                                        <IoEyeOff
                                            className={styles.showPasswordButton}
                                            onClick={() => setPasswordVisible(false)}
                                            style={{ fill: "#ac231c" }}
                                        /> :
                                        <IoEye className={styles.showPasswordButton} onClick={() => setPasswordVisible(true)} />}
                                </div>
                            </div>

                            <div className={styles.loginOptions}>
                                <div>
                                    <input type="checkbox" />
                                    <p>Remember me</p>
                                </div>
                                <p className={styles.forgotPasswordButton}>Forgot Password</p>
                            </div>

                            <button className={styles.submitButton} type='submit'>Sign In</button>
                            <div className={styles.platformDivider}>Or continue with</div>
                        </form>
                        <div className={styles.otherPlatforms}>
                            <FaGoogle />
                            <FaFacebook />
                            <FaGithub />
                        </div>
                    </div>

                    <p className={styles.authSwitch}>Don't have an account? <Link className={styles.switchButton} to="/signup">Sign Up</Link></p>
                </div>

                <div className={styles.rightContainer}>
                    <h1>Real-Time Vitals<br />Seamless Insights</h1>
                    <p>Monitor your health metrics effortlessly with wireless<br />precision and real-time tracking, built for modern care</p>
                </div>
            </div>
        );
    }
}

export default SignInPage;