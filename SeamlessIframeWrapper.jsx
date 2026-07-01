"use client";

import React, { useEffect, useRef } from 'react';

export default function SeamlessIframeWrapper({ children }) {
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const sendHeight = () => {
            if (wrapperRef.current) {
                // We add a tiny 15px buffer to prevent fractional pixel cutoff
                const currentHeight = wrapperRef.current.scrollHeight + 15;
                window.parent.postMessage({ 
                    type: 'iframe-resize', 
                    height: currentHeight 
                }, '*'); 
            }
        };

        sendHeight();

        let resizeObserver;
        if ('ResizeObserver' in window) {
            resizeObserver = new ResizeObserver(() => {
                window.requestAnimationFrame(() => {
                    sendHeight();
                });
            });

            if (wrapperRef.current) {
                resizeObserver.observe(wrapperRef.current);
            }
        }

        return () => {
            if (resizeObserver) resizeObserver.disconnect();
        };
    }, []);

    // FIX: Removed the 100vh height constraint. The ledger now only measures the raw content.
    return (
        <div ref={wrapperRef} style={{ width: '100%', overflow: 'hidden' }}>
            {children}
        </div>
    );
}
