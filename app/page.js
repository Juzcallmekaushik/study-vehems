'use client';
import NavBar from '../components/NavBar';
import { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";
import Image from 'next/image';

export default function HomePage() {
    const backgroundImage = '../wallpapers/homepage.png';
    const [isMobile, setIsMobile] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPageLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);
    
    const [session, setSession] = useState(null);

    useEffect(() => {
        const checkGoogleSession = async () => {
            try {
                const res = await fetch('/api/auth/session');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.user) {
                        setSession(data);
                        return;
                    }
                }
                setSession(null);
            } catch {
                setSession(null);
            }
        };
        checkGoogleSession();
        setSession(null);
    }, []);

    return (
        <>
            <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
                <NavBar />
            </div>
            {isPageLoading ? (
                <div style={{
                    maxHeight: '94vh',
                    backgroundColor: '##0a0a0a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        opacity: 0.3
                    }}>
                        <Image
                            src="/logos/favicon.png"
                            alt="Vehems Logo"
                            width={40}
                            height={40}
                            style={{
                                height: '40px',
                                width: '40px',
                                animation: 'spin 2s linear infinite'
                            }}
                            priority
                        />
                    </div>
                    <style jsx>{`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 0.3; }
                        }
                    `}</style>
                </div>
            ) : (
                <main
                    style={{
                        backgroundColor: '#000000',
                        minHeight: isMobile ? '96vh' : '94vh',
                        color: '#fff',
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        padding: isMobile ? '0 20px' : '0',
                        animation: 'fadeInMain 0.5s ease-in-out',
                        height: 'fit-content'
                    }}
                >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 'fit-content',
                        minHeight: '92.5vh',
                        textAlign: 'center',
                        gap: 0,
                        padding: isMobile ? '20px' : '0',
                    }}
                >
                    <h1 style={{ 
                        fontFamily: 'Literata, serif', 
                        fontSize: isMobile ? '1.7rem' : '2.5rem', 
                        fontWeight: '900', 
                        margin: 0, 
                        letterSpacing: '0.05em',
                        lineHeight: isMobile ? '1.2' : '1.1',
                        maxWidth: isMobile ? '100%' : 'none',
                        wordBreak: isMobile ? 'break-word' : 'normal'
                    }}>
                        VEHEMS STUDY LOFT
                    </h1>
                    <p style={{
                        fontFamily: 'Jost, sans-serif',
                        fontSize: isMobile ? '1.1rem' : '1rem',
                        fontWeight: '500',
                        margin: isMobile ? '0.3rem 0 1.3rem 0' : '0.2rem 0 1.4rem 0',
                        color: '#fff',
                        opacity: 0.85,
                        letterSpacing: '0.01em'
                    }}>
                        notes made easy
                    </p>
                    {!session && (
                        <button
                            style={{
                                padding: isMobile ? '0.7rem 1.5rem' : '0.5rem 1.2rem',
                                fontSize: isMobile ? '0.8rem' : '0.7rem',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#FFFFFF',
                                color: '#384031',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                transition: 'all 0.2s',
                                marginTop: isMobile ? '0.5rem' : '-0.25rem',
                                fontFamily: 'Jost, sans-serif',
                                minWidth: isMobile ? '200px' : 'auto',
                                transform: 'scale(1)',
                            }}
                            onClick={() => signIn('google')}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                            }}
                        >
                            BECOME A MEMBER
                        </button>
                    )}
                </div>
                <style jsx>{`
                    @keyframes fadeInMain {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 10; transform: translateY(0); }
                    }
                `}</style>
            </main>
            )}
        </>
    );
}
