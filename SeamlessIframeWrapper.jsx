"use client";

import React, { useEffect, useRef } from 'react';

export default function SeamlessIframeWrapper({ children }) {
    const wrapperRef = useRef(null);

    useEffect(() => {
        // Guard clause: Ensures the script only runs in the user's browser, not on Vercel's build servers
        if (typeof window === 'undefined') return;

        const sendHeight = () => {
            if (wrapperRef.current) {
                const currentHeight = wrapperRef.current.scrollHeight;
                // Securely broadcast the exact pixel height to your main homepage
                window.parent.postMessage({ 
                    type: 'iframe-resize', 
                    height: currentHeight 
                }, '*'); 
            }
        };

        // Execute the initial calculation the millisecond the feed loads
        sendHeight();

        // The Elite Engine: ResizeObserver constantly audits the DOM mathematically in real-time.
        // If an Amazon product image loads slowly, it catches the expansion and recalculates instantly.
        let resizeObserver;
        if ('ResizeObserver' in window) {
            resizeObserver = new ResizeObserver(() => {
                // requestAnimationFrame prevents layout thrashing and keeps the CPU overhead at zero
                window.requestAnimationFrame(() => {
                    sendHeight();
                });
            });

            if (wrapperRef.current) {
                resizeObserver.observe(wrapperRef.current);
            }
        }

        // Clean the ledger on unmount to prevent browser memory leaks
        return () => {
            if (resizeObserver) resizeObserver.disconnect();
        };
    }, []);

    // We set a minimum height and hide the overflow to instantly kill any double-scrollbars
    return (
        <div ref={wrapperRef} style={{ width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
            {children}
        </div>
    );
}
