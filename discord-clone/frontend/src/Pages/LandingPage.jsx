import { useEffect, useState } from "react";
import "./css/LandingPage.css";
import { Link } from "react-router-dom";
import Discordlogo from '../assets/login-page-discord-logo.svg';

const phrases = [
    "Connect with friends.",
    "Communicate in real-time.",
    "Collaborate effortlessly.",
    "Build your community.",
];

function Typewriter({ phrases }) {
    const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    
    useEffect(() => {
        let timer;
        const fullText = phrases[currentPhraseIdx];
        const typeSpeed = isDeleting ? 35 : 70;
        
        if (!isDeleting && currentText === fullText) {
            timer = setTimeout(() => setIsDeleting(true), 2500);
        } else if (isDeleting && currentText === "") {
            setIsDeleting(false);
            setCurrentPhraseIdx((prev) => (prev + 1) % phrases.length);
        } else {
            timer = setTimeout(() => {
                setCurrentText((prev) => 
                    isDeleting 
                        ? fullText.substring(0, prev.length - 1)
                        : fullText.substring(0, prev.length + 1)
                );
            }, typeSpeed);
        }
        
        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentPhraseIdx, phrases]);

    return (
        <span className="typewriterText">
            {currentText}
            <span className="typewriterCursor">|</span>
        </span>
    );
}

function InteractiveChatMockup() {
    const [messages, setMessages] = useState([
        { id: 1, author: "Wumpus", avatar: "🤖", text: "Hey there! Welcome to the Discord Clone landing page! 👋", isBot: true },
        { id: 2, author: "Nelly", avatar: "🎒", text: "Try typing a message below to test this interactive chat mockup!", isBot: false },
    ]);
    const [inputVal, setInputVal] = useState("");
    const [activeChannel, setActiveChannel] = useState("general");

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputVal.trim()) return;

        const newUserMessage = {
            id: Date.now(),
            author: "Guest Explorer",
            avatar: "🎮",
            text: inputVal,
            isBot: false,
        };

        setMessages((prev) => [...prev, newUserMessage]);
        const userText = inputVal.toLowerCase();
        setInputVal("");

        // Trigger bot reply after a short delay
        setTimeout(() => {
            let replyText = "That's awesome! Explore more by registering for a full account. 🚀";
            if (userText.includes("hello") || userText.includes("hi")) {
                replyText = "Hello explorer! Hope you are having an amazing day! What server are you going to create first? 🌐";
            } else if (userText.includes("help") || userText.includes("features")) {
                replyText = "In the full app, you can create servers, add text & voice channels, chat in real-time, and join Google OAuth! 🛠️";
            } else if (userText.includes("design") || userText.includes("theme")) {
                replyText = "We designed this UI with glassmorphism, smooth animations, and premium Discord dark theme styling! ✨";
            } else if (userText.includes("clear")) {
                setMessages([
                    { id: 1, author: "Wumpus", avatar: "🤖", text: "Chat cleared! Let's start fresh. 😊", isBot: true }
                ]);
                return;
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    author: "Wumpus",
                    avatar: "🤖",
                    text: replyText,
                    isBot: true,
                }
            ]);
        }, 1000);
    };

    return (
        <div className="chatMockupContainer">
            {/* Sidebar */}
            <div className="mockSidebar">
                <div className="mockSidebarHeader">
                    <span>Channels</span>
                </div>
                <div className="mockChannelList">
                    <div 
                        className={`mockChannelItem ${activeChannel === 'general' ? 'active' : ''}`}
                        onClick={() => setActiveChannel('general')}
                    >
                        <span className="hash">#</span> general
                    </div>
                    <div 
                        className={`mockChannelItem ${activeChannel === 'gaming' ? 'active' : ''}`}
                        onClick={() => setActiveChannel('gaming')}
                    >
                        <span className="hash">#</span> gaming-lounge
                    </div>
                    <div 
                        className={`mockChannelItem ${activeChannel === 'announcements' ? 'active' : ''}`}
                        onClick={() => setActiveChannel('announcements')}
                    >
                        <span className="hash">📢</span> announcements
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="mockChatArea">
                <div className="mockChatHeader">
                    <span className="hash">#</span> {activeChannel === 'general' ? 'general' : activeChannel === 'gaming' ? 'gaming-lounge' : 'announcements'}
                </div>
                
                <div className="mockMessagesList">
                    {messages.map((msg) => (
                        <div className="mockMessage" key={msg.id}>
                            <div className="mockAvatar">{msg.avatar}</div>
                            <div className="mockMessageContent">
                                <div className="mockMessageHeader">
                                    <span className="mockAuthor">{msg.author}</span>
                                    {msg.isBot && <span className="mockBotTag">BOT</span>}
                                    <span className="mockTimestamp">Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="mockMessageText">{msg.text}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSendMessage} className="mockInputForm">
                    <input 
                        type="text" 
                        placeholder={`Message #${activeChannel === 'general' ? 'general' : activeChannel === 'gaming' ? 'gaming-lounge' : 'announcements'}`}
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        className="mockInput"
                    />
                </form>
            </div>
        </div>
    );
}

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const container = document.querySelector('.landing-container');
            if (container) {
                const x = e.clientX;
                const y = e.clientY;
                container.style.setProperty('--x', `${x}px`);
                container.style.setProperty('--y', `${y}px`);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="landing-container">
            {/* Header / Navigation */}
            <header className="landingNavbar">
                <div className="navLogo">
                    <img src={Discordlogo} alt="Discord logo" />
                </div>
                <nav className="navLinks">
                    <a href="#features">Features</a>
                    <a href="#demo">Interactive Demo</a>
                    <a href="https://discord.com/nitro" target="_blank" rel="noopener noreferrer">Nitro</a>
                    <a href="https://discord.com/safety" target="_blank" rel="noopener noreferrer">Safety</a>
                </nav>
                <div className="navActions">
                    <Link to="/login" className="loginBtn">Login</Link>
                    <button 
                        className="mobileMenuToggle" 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>
                </div>
            </header>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="mobileMenuOverlay">
                    <div className="mobileMenuClose" onClick={() => setMobileMenuOpen(false)}>✕</div>
                    <nav className="mobileNavLinks">
                        <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#demo" onClick={() => setMobileMenuOpen(false)}>Interactive Demo</a>
                        <a href="https://discord.com/nitro" target="_blank" rel="noopener noreferrer">Nitro</a>
                        <a href="https://discord.com/safety" target="_blank" rel="noopener noreferrer">Safety</a>
                        <Link to="/login" className="mobileLoginBtn" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                        <Link to="/register" className="mobileRegisterBtn" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                    </nav>
                </div>
            )}

            {/* Hero Section */}
            <section className="heroSection">
                <div className="badge">Next-Gen Communities</div>
                <h1 className="heroHeading">Imagine a place...</h1>
                <div className="dynamic-text">
                    <Typewriter phrases={phrases} />
                </div>
                <div className="heroButtons">
                    <Link to="/register" className="ctaBtnPrimary">Get Started</Link>
                    <a href="#demo" className="ctaBtnSecondary">Try Interactive Demo</a>
                </div>

                {/* Interactive Demo Block */}
                <div id="demo" className="chatMockupWrapper">
                    <InteractiveChatMockup />
                </div>
            </section>

            {/* Features Grid Section */}
            <section id="features" className="featuresGrid">
                <div className="featureCard">
                    <div className="featureIcon">💬</div>
                    <h3>Invite-Only Places</h3>
                    <p>Create organized servers where text channels keep conversations tidy and voice rooms welcome you in without a phone call.</p>
                </div>
                <div className="featureCard">
                    <div className="featureIcon">🔊</div>
                    <h3>Crystal Clear Voice</h3>
                    <p>Low latency voice channels let you feel like you are in the same room. Watch friends stream games, or gather together on video.</p>
                </div>
                <div className="featureCard">
                    <div className="featureIcon">🌐</div>
                    <h3>Fast Google OAuth</h3>
                    <p>One-click secure registration and login using your Google account to get you into the action instantly.</p>
                </div>
            </section>

            {/* Bottom CTA / Footer */}
            <footer className="ctaFooterSection">
                <h2>Ready to start your journey?</h2>
                <p>Join millions of people who communicate, build communities, and hang out online everyday.</p>
                <div style={{ marginBottom: '48px' }}>
                    <Link to="/register" className="ctaBtnPrimary" style={{ padding: '16px 40px', fontSize: '18px' }}>
                        Register Now
                    </Link>
                </div>
                <div className="footerLogo">
                    <img src={Discordlogo} alt="Discord Logo" />
                </div>
                <div className="footerCopyright">
                    © 2026 Discord Clone. Redesigned with premium CSS layouts and React state interactivity.
                </div>
            </footer>
        </div>
    );
}
