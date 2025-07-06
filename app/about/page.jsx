'use client';
import NavBar from '../../components/NavBar';

export default function AboutPage() {
    const about1Image = '/wallpapers/about1.png';
    const about2Image = '/wallpapers/about2.png';

    return (
        <>
            <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
                <NavBar />
            </div>
            <div
                className="about-hero-section"
                style={{
                    width: '100vw',
                    height: '40vh',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '220px',
                    backgroundColor: '#0a0a0a',
                }}
            >
                <img
                    src={about1Image}
                    alt="About 1"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        flexDirection: 'column',
                    }}
                >
                    <span
                        style={{
                            fontFamily: 'Literata, serif',
                            color: '#fff',
                            fontSize: '2.5rem',
                            fontWeight: '900',
                            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                            padding: '0 1rem',
                            textAlign: 'center',
                            width: '100%',
                            boxSizing: 'border-box',
                        }}
                        className="about-title"
                    >
                        ABOUT US
                    </span>
                </div>
            </div>
            <div className="about-below-section">
                <img
                    src={about2Image}
                    alt="About 2"
                    className="about2-desktop-img"
                />
                <div className="about-content-box">
                    <div className="about-blatant-title">
                        ABOUT VEHEMS STUDY LOFT
                    </div>
                    <p>
                        Vehems Study Loft is a cozy, student-led hub designed to support learners navigating the challenges of CIE IGCSE, AS, and A-Levels. Founded by Veda and Elina, two passionate students who understand the stress and pressure of academic life, the platform offers a calm and welcoming environment where students can find clarity and motivation.
                    </p>
                    <p>
                        With a growing collection of over 20 beautifully handwritten notes covering more than 10 subjects across IGCSE, AS, and A-Level syllabuses, Vehems Study Loft makes revision easier, more engaging, and less overwhelming. Alongside these notes, the page also features thoughtfully written blog posts, filled with tips, reflections, and guidance to help students prepare smartly and stay grounded during exam season.
                    </p>
                    <p>
                        Whether you’re deep into revision or just getting started, Vehems Study Loft is a comforting space made by students for students, reminding you that you’re never alone in your academic journey.
                    </p>
                </div>
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .about-below-section {
                        flex-direction: column;
                        align-items: center;
                    }
                    .about2-desktop-img {
                        margin: 0 0 1.5rem 0;
                        max-width: 90vw;
                        width: 100%;
                    }
                }
                @media (max-width: 600px) {
                    .about-hero-section {
                        height: 20vh !important;
                        min-height: 120px !important;
                    }
                    .about-title {
                        font-size: 1.4rem !important;
                        font-weight: 900 !important;
                        padding: 0 0.5rem !important;
                    }
                    .about2-desktop-img {
                        display: none !important;
                    }
                    .about-blatant-title {
                        display: none !important;
                    }
                    .about-content-box {
                        margin: 0 1.2rem !important;
                    }
                    .about-content-box p {
                        font-size: 1.1rem !important;
                        margin: 0 0 1.2rem 0 !important;
                    }
                }
                .about-below-section {
                    display: flex;
                    align-items: flex-start;
                    margin: 2rem 0 0 0;
                    width: 100%;
                }
                .about2-desktop-img {
                    width: 400px;
                    max-width: 35vw;
                    height: auto;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                    margin-right: 2rem;
                    margin-left: 2rem;
                    display: block;
                }
                .about-blatant-title {
                    font-family: 'Blatant', sans-serif;
                    color: #c8ffc8;
                    font-size: 1.2rem;
                    font-weight: bold;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.5);
                    margin-bottom: 0.5rem;
                    letter-spacing: 2px;
                    display: block;
                }
                .about-content-box p {
                    font-family: 'adventPro', sans-serif;
                    margin: 0 1.5rem 1.2rem 0;
                    line-height: 1.2;
                    letter-spacing: 0.7px;
                }
            `}</style>
        </>
    );
}
