import React from "react";
import { Eye } from "lucide-react";
import { signIn } from "next-auth/react";

const NotesCard = ({ title, level, date, readTime, image, file }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    function timeAgo(dateString) {
        const now = new Date();
        const dateObj = new Date(dateString);
        const diff = Math.floor((now - dateObj) / 1000);

        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 172800) return `${Math.floor(diff / 86400)}d ago`;
        return dateObj.toLocaleDateString();
    }
    return (
        <div
            style={{
                background: "transparent",
                overflow: "hidden",
                color: "#222",
                maxWidth: window.innerWidth <= 768 ? 175 : 205,
                maxHeight: window.innerWidth <= 768 ? 265 : 320,
                width: "100%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                fontFamily: "adventpro, sans-serif",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: isHovered ? "translateY(-5px)" : "translateY(0)",
                boxShadow: isHovered ? "0 8px 25px rgba(0,0,0,0.25)" : "0 2px 8px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ 
                height: window.innerWidth <= 768 ? 160 : 200, 
                overflow: "hidden",
                position: "relative"
            }}>
                <img
                    src={image}
                    alt={title}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.3s ease",
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(75, 88, 66, 0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "15px",
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 0.3s ease",
                        pointerEvents: isHovered ? "auto" : "none",
                    }}
                >
                    <button
                        style={{
                            width: "45px",
                            height: "45px",
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.9)",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = "#ffffff";
                            e.target.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "rgba(255, 255, 255, 0.9)";
                            e.target.style.transform = "scale(1)";
                        }}
                        onClick={(e) => {
                            const session = sessionStorage.getItem("session");
                            if (!session) {
                                signIn('google', {
                                    callbackUrl: `${window.location.pathname}?openFile=${encodeURIComponent(file)}`
                                });
                            } else {
                                window.open(file, "_blank");
                            }
                        }}
                    >
                        <Eye size={20} color="#4B5842" />
                    </button>
                </div>
            </div>
            <div
                style={{
                    background: "#cbe6a3",
                    padding: window.innerWidth <= 768 ? "16px 14px 12px 14px" : "20px 18px 16px 18px",
                }}
            >
                <div
                    style={{
                        fontSize: window.innerWidth <= 768 ? 11 : 12,
                        fontWeight: 500,
                        letterSpacing: 0.5,
                        color: "#000000",
                        marginBottom: 3,
                        opacity: 0.85,
                    }}
                >
                    {level && level.toUpperCase()}
                </div>
                <div
                    style={{
                        fontSize: window.innerWidth <= 768 ? 15 : 15,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        marginBottom: window.innerWidth <= 768 ? 5 : 7,
                        color: "#222",
                    }}
                >
                    {title && title.toUpperCase()}
                </div>
                <div
                    style={{
                        fontSize: window.innerWidth <= 768 ? 12 : 14,
                        color: "#444",
                        opacity: 0.8,
                        display: "flex",
                        gap: window.innerWidth <= 768 ? 6 : 8,
                        alignItems: "center",
                    }}
                >
                    <span>{timeAgo(date)}</span>
                    <span style={{ fontSize: 10 }}>•</span>
                    <span>{readTime}</span>
                </div>
            </div>
        </div>
    );
};

export default NotesCard;