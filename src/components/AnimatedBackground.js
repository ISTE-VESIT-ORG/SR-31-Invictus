'use client';
import dynamic from 'next/dynamic';

const ColorBends = dynamic(() => import('../../animatedComponents/colorBends'), { ssr: false });

export default function AnimatedBackground() {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
        }}>
            <ColorBends
                colors={["#0a0015", "#0e1a3d", "#06D6A0", "#4C9FFF", "#8B5CF6"]}
                rotation={30}
                speed={0.1}
                scale={1.5}
                frequency={0.6}
                warpStrength={0.6}
                mouseInfluence={0.3}
                parallax={0.2}
                noise={0.04}
                transparent={false}
                autoRotate={1}
            />
        </div>
    );
}
