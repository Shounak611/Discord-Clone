import { useEffect, useState } from "react";
import "./css/LandingPage.css";
import { Link } from "react-router-dom";
import Button from "../Componennts/LandingPage/Button";

const phrases = [
    "Connect with friends.",
    "Communicate in real-time.",
    "Collaborate effortlessly.",
    "Build your community.",
];

export default function LandingPage() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="landing-container">
            <h1 className="main-heading">Welcome to Discord</h1>
            <h2 className="dynamic-text">{phrases[index]}</h2>
            <Link to={"/login"}>
                <div className="btn-in"><Button text={"Login"}/></div>
            </Link>
            <Link to={"/register"}>
                <div className="btn-register"><Button text={"Register"}/></div>
            </Link>
        </div>
    );
}
