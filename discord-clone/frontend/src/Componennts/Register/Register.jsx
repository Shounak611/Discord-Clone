import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import './Register.css';

export default function Register() {
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState({ day: "", month: "", year: "" });
    const navigate = useNavigate();

    const handleGoogleRegister = useGoogleLogin({
        scope: "https://www.googleapis.com/auth/user.birthday.read",
        onSuccess: async (tokenResponse) => {
            console.log("Google token response:", tokenResponse);
            try {
                const res = await axios.post("http://localhost:8000/register/google", {
                    access_token: tokenResponse.access_token
                });
                localStorage.setItem("email", res.data.email);
                localStorage.setItem("token", res.data.token);
                alert("Registration successful!");
                navigate("/home");
            } catch (err) {
                console.error("Failed to register with Google", err);
                if (err.response?.data?.detail) {
                    alert("Registration failed:\n" + err.response.data.detail);
                } else {
                    alert("Google registration failed on server.");
                }
            }
        },
        onError: (error) => {
            console.log("Google Registration Failed:", error);
            alert("Google Registration Failed");
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dobString = `${dob.year}-${dob.month.toString().padStart(2, "0")}-${dob.day.toString().padStart(2, "0")}`;
        try {
            const res = await axios.post("http://localhost:8000/register/registration", {
                email: email,
                display_name: displayName,
                username: username,
                password: password,
                dob: dobString,
            });
            alert("Registration successful!");
            localStorage.setItem("email", email);
            localStorage.setItem("token", res.data.token);
            navigate("/home");
        } catch (err) {
            console.log(err);
            if (err.response?.data?.detail) {
                const detail = err.response.data.detail;
                const message = Array.isArray(detail)
                    ? detail.map(e => e.msg).join("\n")
                    : detail;
                alert("Registration failed:\n" + message);
            } else {
                alert("Registration failed: " + err.message);
            }
        }
    };

    return (
        <div className="registerCardBody">
            <div className="registerFormSection">
                <div className="registerHeader">
                    <h2>Create an account</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="registerForm">
                    <div className="inputGroup">
                        <label className="inputLabel">
                            Email <span className="requiredIndicator">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="registerInputField"
                            required
                        />
                    </div>

                    <div className="inputRow">
                        <div className="inputGroup">
                            <label className="inputLabel">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="registerInputField"
                            />
                        </div>
                        
                        <div className="inputGroup">
                            <label className="inputLabel">
                                Username <span className="requiredIndicator">*</span>
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="registerInputField"
                                required
                            />
                        </div>
                    </div>

                    <div className="inputGroup">
                        <label className="inputLabel">
                            Password <span className="requiredIndicator">*</span>
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="registerInputField"
                            required
                        />
                    </div>

                    <div className="inputGroup">
                        <label className="inputLabel">
                            Date of Birth <span className="requiredIndicator">*</span>
                        </label>
                        <div className="dobSelectContainer">
                            <select
                                className="dobSelect"
                                value={dob.month}
                                onChange={(e) => setDob({ ...dob, month: e.target.value })}
                                required
                            >
                                <option value="" disabled hidden>Month</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                            
                            <select
                                className="dobSelect"
                                value={dob.day}
                                onChange={(e) => setDob({ ...dob, day: e.target.value })}
                                required
                            >
                                <option value="" disabled hidden>Day</option>
                                {[...Array(31).keys()].map(d => (
                                    <option key={d + 1} value={d + 1}>{d + 1}</option>
                                ))}
                            </select>
                            
                            <select
                                className="dobSelect"
                                value={dob.year}
                                onChange={(e) => setDob({ ...dob, year: e.target.value })}
                                required
                            >
                                <option value="" disabled hidden>Year</option>
                                {[...Array(100)].map((_, i) => {
                                    const year = 2025 - i;
                                    return <option key={year} value={year}>{year}</option>;
                                })}
                            </select>
                        </div>
                    </div>

                    <button className="submitButton" type="submit">Continue</button>

                    <div className="loginPrompt">
                        <span className="loginText">Already have an account?</span>
                        <Link className="loginLink" to="/login">
                            Log In
                        </Link>
                    </div>
                </form>
            </div>

            <div className="dividerLine"></div>

            <div className="googleAuthSection">
                <div className="googleContainerCard">
                    <div className="googleLogoWrapper">
                        <svg className="googleSvgIcon" aria-hidden="true" width="48" height="48" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                    </div>
                    <div className="googleInfoText">
                        <h3>Join with Google</h3>
                        <p>Fast, secure, and one-click account creation</p>
                        <button type="button" onClick={() => handleGoogleRegister()} className="googleRegisterButton">
                            <svg className="btnGoogleIcon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Register with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
