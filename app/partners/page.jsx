'use client';
import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import PartnerCard from '../../components/PartnerCard';

export default function PartnersPage() {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPartners() {
            const { createClient } = await import('../../lib/supabaseClient');
            const supabase = createClient();

            const { data, error } = await supabase
                .from('partners')
                .select('*');
            if (error) {
                console.error('Error fetching partners:', error.message);
                setPartners([]);
            } else {
                setPartners(data || []);
            }
            setLoading(false);
        }
        fetchPartners();
    }, []);

    const partnersHeroImage = '/wallpapers/partners1.png';

    if (loading) return null;

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
                    backgroundColor: '#000',
                }}
            >
                <img
                    src={partnersHeroImage}
                    alt="Partners Hero"
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
                        OUR PARTNERS
                    </span>
                </div>
            </div>
            <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
                {partners.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#888', fontSize: '1.25rem', marginTop: '1rem' }}>
                        Coming soon...
                    </div>
                ) : (
                    <div>
                        {partners.map((partner, idx) => (
                            <div key={partner.id} style={{ marginBottom: '0.56rem' }}>
                                <PartnerCard
                                    title={partner.title}
                                    description={partner.description}
                                    imageUrl={partner.image_url}
                                    websiteUrl={partner.website_url}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}