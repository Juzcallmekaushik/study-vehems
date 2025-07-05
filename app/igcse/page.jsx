'use client';
import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import SearchBar from '../../components/SearchBar';
import NotesCard from '../../components/NotesCard';

export default function IGCSEPage() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNotes() {
            const { createClient } = await import('../../lib/supabaseClient');
            const supabase = createClient();

            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('level', 'cie igcse')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Error fetching notes:', error.message);
                setNotes([]);
            } else {
                setNotes(data || []);
            }
            setLoading(false);
        }
        fetchNotes();
    }, []);

    const igcseHeroImage = '/wallpapers/igcse.png';

    const [searchTerm, setSearchTerm] = useState('');

    if (loading) return null;

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
                <NavBar />
            </div>
            <div
                className="igcse-hero-section"
                style={{
                    width: '98.8vw',
                    height: '10vh',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '220px',
                    backgroundColor: '#000',
                }}
            >
                <img
                    src={igcseHeroImage}
                    alt="IGCSE Hero"
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
                        IGCSE
                    </span>
                </div>
            </div>
            <div
                style={{
                    fontFamily: 'adventPro, sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textAlign: 'center',
                    marginTop: '1.0rem',
                    letterSpacing: '2px',
                    color: '#FFFFFF',
                }}
            >
                SEARCH FOR THE NOTES NOW !!
            </div>
            <div style={{ margin: '0.5rem auto', maxWidth: 600 }}>
                <SearchBar
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <div style={{ margin: '1rem auto 0.5rem auto', maxWidth: 1200 }}>
                {filteredNotes.length === 0 ? (
                    <div
                        style={{
                            fontFamily: 'adventPro, sans-serif',
                            fontWeight: 600,
                            textAlign: 'center',
                            color: '#fff',
                            fontSize: '1.2rem',
                            padding: '1rem',
                        }}
                    >
                        NO NOTES FOUND 😞
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(205px, 1fr))',
                            gap: '1.5rem',
                            justifyContent: 'center',
                            alignItems: 'start',
                            margin: '0 auto',
                            padding: '0 1rem',
                            maxWidth: '1400px',
                            justifyItems: 'center',
                        }}
                    >
                        {filteredNotes.map(note => (
                            <a
                                key={note.id || note.created_at}
                            >
                                <NotesCard
                                    title={note.title}
                                    level={note.level}
                                    date={note.created_at}
                                    file={note.file_url}
                                    readTime={note.read_time}
                                    image={note.image_url}
                                />
                            </a>
                        ))}
                        <style jsx>{`
                            div[style*="display: grid"] {
                                justify-items: center;
                                align-items: center;
                            }
                            @media (max-width: 900px) {
                                div[style*="display: grid"] {
                                    grid-template-columns: repeat(3, 1fr) !important;
                                    padding: 0 1.5rem !important;
                                    max-width: 800px !important;
                                }
                            }
                            @media (max-width: 600px) {
                                div[style*="display: grid"] {
                                    grid-template-columns: repeat(2, 1fr) !important;
                                    padding: 0 1rem !important;
                                    max-width: 500px !important;
                                }
                            }
                        `}</style>
                    </div>
                )}
            </div>
        </>
    );
}