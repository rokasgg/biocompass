import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { THEME } from '../theme';

// ── 3D geometry ──────────────────────────────────────────────
const R = 50;   // belt radius
const H = 85;   // half-height (apex to equator)

// Belt at y=0, 4 points at 45° offsets for diamond silhouette
const VERTS = {
    top: [0, -H, 0],
    bot: [0,  H, 0],
    b0:  [ R,  0,  0],
    b1:  [ 0,  0,  R],
    b2:  [-R,  0,  0],
    b3:  [ 0,  0, -R],
};

// 8 triangular faces: [a, b, c, lightFactor 0–1]
// Tighter range = less contrast = more pastel feel
const FACES = [
    ['top', 'b0', 'b1', 1.00],
    ['top', 'b1', 'b2', 0.82],
    ['top', 'b2', 'b3', 0.68],
    ['top', 'b3', 'b0', 0.90],
    ['bot', 'b1', 'b0', 0.86],
    ['bot', 'b2', 'b1', 0.72],
    ['bot', 'b3', 'b2', 0.60],
    ['bot', 'b0', 'b3', 0.78],
];

// ── Math helpers ─────────────────────────────────────────────
function rotY(p, theta) {
    const c = Math.cos(theta), s = Math.sin(theta);
    return [p[0] * c - p[2] * s, p[1], p[0] * s + p[2] * c];
}

// Perspective projection onto SVG canvas (120 × 200)
function project(p, fov = 350) {
    const scale = fov / (fov + p[2]);
    return [60 + p[0] * scale, 100 + p[1] * scale, p[2]];
}

function faceZ(pts) {
    return (pts[0][2] + pts[1][2] + pts[2][2]) / 3;
}

function toPoints(pts) {
    return pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
}

function hexToRgb(hex) {
    const n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function applyLight([r, g, b], f) {
    const mix = (a, bv, t) => Math.round(Math.min(255, a + (bv - a) * t));
    if (f >= 1) {
        // Brightest face: push 40% toward white
        return `rgb(${mix(r, 255, 0.40)},${mix(g, 255, 0.40)},${mix(b, 255, 0.40)})`;
    }
    // Darker faces: blend between a light-grey shadow and white-tinted base
    const shadowR = r * 0.75 + 55, shadowG = g * 0.75 + 55, shadowB = b * 0.75 + 55;
    const t = Math.max(0, Math.min(1, (f - 0.60) / 0.40));
    return `rgb(${mix(shadowR, r, t)},${mix(shadowG, g, t)},${mix(shadowB, b, t)})`;
}

// ── Component ────────────────────────────────────────────────
const VitalityPlumbob = ({ score = 0, isLoading = false }) => {
    const [angle, setAngle]   = useState(0);
    const [colorT, setColorT] = useState(0); // 0 = grey, 1 = target color
    const angleRef   = useRef(0);
    const rafRef     = useRef(null);
    const colorRafRef = useRef(null);

    useEffect(() => {
        cancelAnimationFrame(rafRef.current);
        cancelAnimationFrame(colorRafRef.current);

        if (isLoading) {
            setColorT(0);
            let last = null;
            const loop = (ts) => {
                if (last !== null) {
                    angleRef.current += ((ts - last) / 4500) * Math.PI * 2;
                }
                last = ts;
                setAngle(angleRef.current);
                rafRef.current = requestAnimationFrame(loop);
            };
            rafRef.current = requestAnimationFrame(loop);
        } else {
            // Settle spin over 5 s
            const startAngle = angleRef.current;
            const fullTurns  = Math.ceil(startAngle / (Math.PI * 2));
            const target     = fullTurns * Math.PI * 2;
            const duration   = 5000;
            const startTs    = performance.now();

            const settle = (ts) => {
                const t    = Math.min((ts - startTs) / duration, 1);
                const ease = 1 - Math.pow(1 - t, 3);
                angleRef.current = startAngle + (target - startAngle) * ease;
                setAngle(angleRef.current);
                if (t < 1) {
                    rafRef.current = requestAnimationFrame(settle);
                } else {
                    // Fade colour in over 1.2 s after spin settles
                    const colorStart = performance.now();
                    const fadeColor = (cts) => {
                        const ct = Math.min((cts - colorStart) / 1200, 1);
                        setColorT(ct);
                        if (ct < 1) colorRafRef.current = requestAnimationFrame(fadeColor);
                    };
                    colorRafRef.current = requestAnimationFrame(fadeColor);
                }
            };
            rafRef.current = requestAnimationFrame(settle);
        }

        return () => {
            cancelAnimationFrame(rafRef.current);
            cancelAnimationFrame(colorRafRef.current);
        };
    }, [isLoading]);

    const getTargetColor = () => {
        if (score >= 70) return THEME.colors.primary;
        if (score >= 40) return '#EAB308';
        return THEME.colors.error;
    };

    const greyRgb  = hexToRgb(THEME.colors.outlineVariant);
    const targetRgb = hexToRgb(getTargetColor());
    // Lerp grey → target based on colorT (0 while loading/spinning, 0→1 on fade-in)
    const mix = (a, b, t) => Math.round(a + (b - a) * t);
    const rgb = [
        mix(greyRgb[0], targetRgb[0], colorT),
        mix(greyRgb[1], targetRgb[1], colorT),
        mix(greyRgb[2], targetRgb[2], colorT),
    ];

    // Build projected + sorted faces
    const rotated = {};
    Object.entries(VERTS).forEach(([k, v]) => { rotated[k] = rotY(v, angle); });

    const projected = {};
    Object.entries(rotated).forEach(([k, v]) => { projected[k] = project(v); });

    const renderable = FACES
        .map(([a, b, c, lf]) => {
            const pts = [projected[a], projected[b], projected[c]];
            // Back-face cull: skip faces facing away (negative Z normal component not needed —
            // we use painter's algorithm and just sort by avg Z)
            return { pts, z: faceZ(pts), lf };
        })
        .sort((a, b) => a.z - b.z); // back to front

    return (
        <View style={styles.container}>
            <Svg width="110" height="190" viewBox="0 0 120 200">
                {renderable.map(({ pts, lf }, i) => (
                    <Polygon
                        key={i}
                        points={toPoints(pts)}
                        fill={applyLight(rgb, lf)}
                        stroke={applyLight(rgb, lf * 0.75)}
                        strokeWidth={0.6}
                    />
                ))}
            </Svg>

            {/* Ground shadow */}
            <View style={styles.shadow} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shadow: {
        position: 'absolute',
        bottom: 12,
        width: 50,
        height: 10,
        borderRadius: 25,
        backgroundColor: 'rgba(0,0,0,0.12)',
    },
});

export default VitalityPlumbob;
