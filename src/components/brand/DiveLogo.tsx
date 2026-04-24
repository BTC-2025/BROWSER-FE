'use client';

import React from 'react';

type DiveLogoProps = {
    className?: string;
    markClassName?: string;
    alt?: string;
};

export const DIVE_LOGO_SRC = '/brand/dive-logo.png';
export const DIVE_ICON_SRC = '/icon.png';

export default function DiveLogo({
    className = '',
    markClassName = '',
    alt = 'Dive Browser',
}: DiveLogoProps) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={DIVE_LOGO_SRC}
                alt={alt}
                className={`block object-contain ${markClassName}`}
                draggable={false}
            />
        </div>
    );
}
