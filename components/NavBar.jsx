"use client";
import React, { useState, useEffect } from 'react';
import { adventPro } from '../app/fonts';
import { CircleUser, Bell, LogIn, Menu, X, LogOut } from 'lucide-react'
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

const UserMenu = ({ isLoggedIn, session, adventPro }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (!e.target.closest('.user-menu-trigger') && !e.target.closest('.user-menu-dropdown')) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    if (!isLoggedIn) {
        return (
            <LogIn
                color="#BFDAA4"
                size={15}
                onClick={() => signIn("google")}
                style={{ cursor: 'pointer' }}
            />
        );
    }

    return (
        <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <span
                className="user-menu-trigger"
                style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
                tabIndex={0}
            >
                <CircleUser color="#BFDAA4" size={15} />
            </span>
            {open && (
                <div
                    className="user-menu-dropdown"
                    style={{
                        position: 'absolute',
                        top: '28px',
                        right: 0,
                        minWidth: '220px',
                        background: '#2c3327',
                        borderRadius: '10px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                        padding: '10px 20px 10px 20px',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 0,
                        animation: 'fadeIn 0.18s',
                    }}
                >
                    <span
                        className={adventPro.className}
                        style={{
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '15px',
                            letterSpacing: '0.5px'
                        }}
                    >
                        {session?.user?.name || 'User'}
                    </span>
                    <span
                        className={adventPro.className}
                        style={{
                            color: '#BFDAA4',
                            fontSize: '13px',
                            wordBreak: 'break-all'
                        }}
                    >
                        {session?.user?.email}
                    </span>
                    <button
                        onClick={() => {
                            signOut();
                        }}
                        style={{
                            marginTop: '8px',
                            maxWidth: '100%',
                            padding: '8px 16px',
                            background: '#BFDAA4',
                            color: '#384031',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'background 0.18s'
                        }}
                        className={adventPro.className}
                    >
                        Log out
                    </button>
                </div>
            )}
            <style jsx>{`
                .user-menu-dropdown {
                    animation: fadeIn 0.18s;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-8px);}
                    to { opacity: 1; transform: translateY(0);}
                }
            `}</style>
        </div>
    );
};

const NotificationMenu = ({ adventPro }) => {
    const [open, setOpen] = React.useState(false);

    const [notifications, setNotifications] = useState([]);

    function timeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 172800) return `${Math.floor(diff / 86400)}d ago`;
        return date.toLocaleDateString();
    }

    useEffect(() => {
        async function fetchNotifications() {
            try {
                const { createClient } = await import('../lib/supabaseClient');
                const supabase = createClient();

                const { data, error } = await supabase
                    .from('notifications')
                    .select('id, notification, created_at')
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (error) {
                    setNotifications([]);
                } else {
                    if (data && data.length > 0) {
                        const processedNotifications = data.map(n => ({
                            id: n.id,
                            text: n.notification,
                            time: timeAgo(n.created_at)
                        }));
                        setNotifications(processedNotifications);
                    } else {
                        setNotifications([]);
                    }
                }
            } catch (error) {
                setNotifications([]);
            }
        }
        fetchNotifications();
    }, []);

    React.useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (
                !e.target.closest('.notification-menu-trigger') &&
                !e.target.closest('.notification-menu-dropdown')
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    return (
        <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setOpen(true)}
        >
            <span
                className="notification-menu-trigger"
                style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}
                tabIndex={0}
            >
                <Bell color="#BFDAA4" size={15} />
                {notifications.length > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            background: '#E57373',
                            borderRadius: '50%',
                            width: '8px',
                            height: '8px',
                            border: '1px solid #384031'
                        }}
                    />
                )}
            </span>
            {open && (
                <div
                    className="notification-menu-dropdown"
                    style={{
                        position: 'absolute',
                        top: '28px',
                        right: 0,
                        minWidth: '260px',
                        background: '#2c3327',
                        borderRadius: '10px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                        padding: '12px 0',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        animation: 'fadeInNotif 0.18s',
                        border: '1px solid #4a5344'
                    }}
                    onMouseLeave={() => setOpen(false)}
                >
                    <span
                        className={adventPro.className}
                        style={{
                            color: '#BFDAA4',
                            fontWeight: 700,
                            fontSize: '15px',
                            letterSpacing: '0.5px',
                            padding: '0 20px 8px 20px',
                            borderBottom: '1px solid #384031',
                            marginBottom: '6px'
                        }}
                    >
                        Notifications
                    </span>
                    
                    {notifications.length === 0 ? (
                        <div style={{ padding: '10px 20px', color: '#BFDAA4', fontSize: '13px' }}>
                            No notifications
                        </div>
                    ) : (
                        notifications.map(n => (
                        <div
                            key={n.id}
                            style={{
                                padding: '10px 20px',
                                borderBottom: '1px solid #384031',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                background: 'none',
                                transition: 'background 0.15s',
                                cursor: 'pointer'
                            }}
                            className="notification-item"
                            tabIndex={0}
                            onClick={() => setOpen(false)}
                            onKeyDown={e => { if (e.key === 'Enter') setOpen(false); }}
                        >
                            <span
                                className={adventPro.className}
                                style={{
                                    color: '#fff',
                                    fontSize: '13px',
                                    fontWeight: 500
                                }}
                            >
                                {n.text}
                            </span>
                            <span
                                className={adventPro.className}
                                style={{
                                    color: '#BFDAA4',
                                    fontSize: '11px'
                                }}
                            >
                                {n.time}
                            </span>
                        </div>
                    )))}
                </div>
            )}
        </div>
    );
};

const NavBar = () => {
    const { data: session, status } = useSession();
    const isLoggedIn = session;
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'ABOUT', path: '/about' },
        { name: 'PARTNERS', path: '/partners' },
        { name: 'IGCSE', path: '/igcse' },
        { name: 'AS LEVELS', path: '/aslevels' },
        { name: 'ALEVELS', path: '/alevels' },
    ];

    const router = useRouter();

    const handleLinkClick = (path) => {
        setIsMobileMenuOpen(false);
        router.push(path);
    };

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
            if (status !== 'loading') {
                setIsLoading(false);
            }
        }, 1000);

        if (status !== 'loading') {
            const minLoadTimer = setTimeout(() => {
                setIsLoading(false);
            }, 800);
            return () => clearTimeout(minLoadTimer);
        }

        return () => clearTimeout(timer);
    }, [status]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    if (isLoading) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#384031',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                gap: '20px'
            }}>
                <div style={{
                    animation: 'pulse 1.5s ease-in-out infinite',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img 
                        src="/logos/favicon.png" 
                        alt="Loading..." 
                        style={{ 
                            height: '60px', 
                            width: '60px',
                            filter: 'brightness(1.1)'
                        }} 
                    />
                </div>
                <style jsx>{`
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.1); opacity: 0.8; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <>
            <nav style={{ width: '100%', height: '35px', background: '#384031', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
                <img src="/logos/favicon.png" alt="Logo" style={{ height: '28px', marginRight: '16px' }} />
                
                {!isMobile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, justifyContent: 'flex-end' }}>
                        {navLinks.map(link => {
                            const isActive = pathname === link.path;
                            return (
                                <span
                                    key={link.name}
                                    className={`${adventPro.className}`}
                                    style={{
                                        color: isActive ? '#fff' : '#BFDAA4',
                                        fontSize: '14px',
                                        letterSpacing: '1px',
                                        fontWeight: isActive ? '700' : '400',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleLinkClick(link.path)}
                                >
                                    {link.name}
                                </span>
                            );
                        })}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                            <NotificationMenu adventPro={adventPro} />
                            <UserMenu
                                isLoggedIn={isLoggedIn}
                                session={session}
                                adventPro={adventPro}
                            />
                        </div>
                    </div>
                )}
                {isMobile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <NotificationMenu adventPro={adventPro} />
                        <Menu color="#BFDAA4" size={15} onClick={toggleMobileMenu} style={{ cursor: 'pointer' }} />
                    </div>
                )}
            </nav>

            {isMobile && isMobileMenuOpen && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 998,
                    }}
                    onClick={toggleMobileMenu}
                />
            )}

            {isMobile && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '280px',
                        height: '100%',
                        backgroundColor: '#384031',
                        zIndex: 999,
                        transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
                        transition: 'transform 0.3s ease-in-out',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px',
                        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
                        pointerEvents: isMobileMenuOpen ? 'auto' : 'none'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <img src="/logos/favicon.png" alt="Logo" style={{ height: '28px' }} />
                        <X color="#BFDAA4" size={20} onClick={toggleMobileMenu} style={{ cursor: 'pointer' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
                        {navLinks.map(link => {
                            const isActive = pathname === link.path;
                            return (
                                <span
                                    key={link.name}
                                    className={`${adventPro.className}`}
                                    style={{
                                        color: isActive ? '#fff' : '#BFDAA4',
                                        fontSize: '16px',
                                        letterSpacing: '1px',
                                        fontWeight: isActive ? '700' : '400',
                                        cursor: 'pointer',
                                        padding: '10px 0',
                                        borderBottom: '1px solid #4a5344'
                                    }}
                                    onClick={() => handleLinkClick(link.path)}
                                >
                                    {link.name}
                                </span>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                        {isLoggedIn ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <CircleUser color="#BFDAA4" size={20} />
                                    <span className={`${adventPro.className}`} style={{ color: '#BFDAA4', fontSize: '14px' }}>
                                        {session?.user?.name || 'User'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        signOut();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    style={{
                                        padding: '6px 12px',
                                        color: '#BFDAA4',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'end',
                                        gap: '4px',
                                    }}
                                    className={adventPro.className}
                                >
                                    <LogOut size={14} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    signIn("google");
                                    setIsMobileMenuOpen(false);
                                }}
                                style={{
                                    width: '100%',
                                    padding: '12px 20px',
                                    backgroundColor: '#BFDAA4',
                                    color: '#384031',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                }}
                                className={adventPro.className}
                            >
                                <LogIn size={16} />
                                Continue with Google
                            </button>
                        )}
                    </div>
                </div>
            )}

            <style jsx global>{`
                .notification-menu-dropdown {
                    animation: fadeInNotif 0.18s;
                }
                @keyframes fadeInNotif {
                    from { opacity: 0; transform: translateY(-8px);}
                    to { opacity: 1; transform: translateY(0);}
                }
            `}</style>
        </>
    );
};

export default NavBar;
