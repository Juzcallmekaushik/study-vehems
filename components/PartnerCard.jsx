"use client";
import React from 'react';
import { blatantBold } from '../app/fonts';

export default function PartnerCard({ imageUrl, title, description, websiteUrl }) {
    return (
        <div className="partner-below-section">
            <img
                src={imageUrl}
                alt={title}
                className="partner-desktop-img"
            />
            <div className="partner-content-box">
                <div>
                    <div className="partner-blatant-title" style={{ fontFamily: blatantBold.style.fontFamily }}>
                        {title && title.toUpperCase()}
                    </div>
                    <p>
                        {description}
                    </p>
                </div>
                {websiteUrl && (
                    <button 
                        className="visit-website-btn"
                        onClick={() => window.open(websiteUrl, '_blank')}
                    >
                        VISIT WEBSITE
                    </button>
                )}
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .partner-below-section {
                        flex-direction: column;
                        align-items: center;
                    }
                    .partner-desktop-img {
                        margin: 0 0 1.5rem 0;
                        max-width: 90vw;
                        width: 100%;
                    }
                }
                @media (max-width: 600px) {
                    .partner-desktop-img {
                        display: none !important;
                    }                .partner-content-box {
                    margin: 0 1.2rem !important;
                }
                .partner-content-box p {
                    margin: 0 0 1.2rem 0 !important;
                }
                .visit-website-btn {
                    margin-top: auto;
                }
                }
                .partner-below-section {
                    display: flex;
                    align-items: flex-start;
                    margin: 2rem 0 0 0;
                    width: 100%;
                }
                .partner-desktop-img {
                    width: 400px;
                    max-width: 35vw;
                    height: auto;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                    margin-right: 2rem;
                    margin-left: 2rem;
                    display: block;
                    background: linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 100%);
                    filter: brightness(0.6);
                    border: 3px solid #b3ffb3;
                }
                .partner-blatant-title {
                    color: #c8ffc8;
                    font-size: 1.2rem;
                    font-weight: bold;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.5);
                    margin-bottom: 0.5rem;
                    letter-spacing: 2px;
                    display: block;
                }
                .partner-content-box {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                }
                .partner-content-box p {
                    font-family: 'adventPro', sans-serif;
                    margin: 0 1.5rem 1.2rem 0;
                    line-height: 1.2;
                    letter-spacing: 0.7px;
                }
                .visit-website-btn {
                    font-family: 'Jost', sans-serif;
                    font-weight: bold;
                    background-color: #c8ffc8;
                    color: #000;
                    border: none;
                    padding: 0.5rem 0.7rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .visit-website-btn:hover {
                    background-color: #b3ffb3;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
            `}</style>
        </div>
    );
}
