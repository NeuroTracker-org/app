import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import styles from "./backzones.module.css";

function FloatingTooltip({ text, x, y }) {
    if (!text) return null;
    return createPortal(
        <div className={styles.tooltip} style={{ top: y, left: x }}>
            {text}
        </div>,
        document.body
    );
}


const BackZones = ({ handleZoneClick, selectedZones }) => {
    const isSelected = (zone) =>
        selectedZones.includes(zone) ? `${styles.bzoneColor0} ${styles.selected}` : styles.bzoneColor0;

    const [hoveredZone, setHoveredZone] = useState(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleMouseMove = (e) => {
        // coordonnées viewport -> parfait pour position: fixed
        setPos({ x: e.clientX, y: e.clientY });
    };

    const enter = (zone) => setHoveredZone(zone);
    const leave = () => setHoveredZone(null);

    return (
        <>
            {mounted && <FloatingTooltip text={hoveredZone} x={pos.x} y={pos.y} />}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                id={styles.BackZones}
                viewBox="0 0 547.18 637.58"
                onMouseMove={handleMouseMove}
                onMouseLeave={leave}
            >
                <g id="headgroup">
                    <path
                        id="head"
                        d="M467.79 603.13c-14.12-5.16-30.4-8.17-49.69-22.33-12.09-8.88-17.82-17.44-20.89-23.11-5.31-9.83-6.98-25.38-7.56-31.22l4.08-91.63h-.02c5.45-7.42 10.56-15.99 14.67-25.99 4.4-10.7 8.57-25.97 11.48-50.98.16-1.34.31-2.65.46-3.95 3.75 1.03 11.81.64 16.52-2.82 1.32-.97 2.1-2 2.43-2.44 11.76-15.96 16.24-30 16.24-30 7.21-22.61 6.59-20.44 10.89-45.56 0 0 2.06-7.09 3.33-33.78.04-.77.11-2.81-1.11-4.67-2.03-3.09-6.22-3.49-7.11-3.56-3.64-.25-6.49 1.4-9.78 3.56-7.42 4.87-12.83 9.28-15.33 11.78-2.24 2.23-3.01 4.55-4.15 5.9l-.04.3c6.39-60.63 8.9-91.96 4.61-113.43-4.75-23.83-12.72-61.16-44.44-92.44-31.74-31.3-69.7-39.24-82.67-41.78-13.73-2.69-26.13-3.33-36.77-3.04-10.64-.29-23.04.35-36.77 3.04-12.96 2.54-50.93 10.48-82.67 41.78-31.72 31.28-39.69 68.62-44.44 92.44-4.28 21.42-1.79 52.68 4.57 113.07-1.12-1.36-1.89-3.64-4.11-5.85-2.51-2.49-7.92-6.91-15.33-11.78-3.29-2.16-6.14-3.81-9.78-3.56-.89.06-5.08.46-7.11 3.56-1.22 1.85-1.15 3.89-1.11 4.67 1.27 26.68 3.33 33.78 3.33 33.78 4.3 25.11 3.68 22.95 10.89 45.56 0 0 4.48 14.04 16.24 30 .33.45 1.1 1.47 2.43 2.44 4.7 3.45 12.72 3.85 16.48 2.83.15 1.3.3 2.61.46 3.94 2.91 25 7.08 40.27 11.48 50.98 4.12 10.01 9.23 18.58 14.68 26l4.08 91.63c-.58 5.84-2.24 21.39-7.56 31.22-3.07 5.68-8.8 14.23-20.89 23.11-19.28 14.16-35.56 17.17-49.69 22.33-19.46 7.11-44.13 15.78-78.13 26.44 0 0 204.77 8.01 273.08 8.01 68.25 0 272.84-8.01 272.84-8.01-34-10.67-58.67-19.33-78.13-26.44Z"
                        className={styles.cls7}
                    ></path>
                    <path
                        id="headline"
                        d="M546.88 628.64c-34-10.67-58.67-19.33-78.13-26.44-14.12-5.16-30.4-8.17-49.69-22.33-12.09-8.88-17.82-17.44-20.89-23.11-5.31-9.83-6.98-25.38-7.56-31.22l4.08-91.63h-.02l14.67-25.99c4.4-10.7 8.57-25.97 11.48-50.98.13-1.12.26-2.21.39-3.3 4.05.8 11.3.63 15.63-2.55 1.32-.97 2.1-2 2.43-2.44 11.76-15.96 16.24-30 16.24-30 7.21-22.61 6.59-20.44 10.89-45.56 0 0 2.06-7.09 3.33-33.78.04-.77.11-2.81-1.11-4.67-2.03-3.09-6.22-3.49-7.11-3.56-3.64-.25-6.49 1.4-9.78 3.56-7.42 4.87-10.55 7.19-13.06 9.69-2.21 2.19-4.07 3.86-5.29 5.36 6.24-59.32 8.64-90.19 4.4-111.42-4.75-23.83-12.72-61.16-44.44-92.44-31.74-31.3-69.7-39.24-82.67-41.78-13.73-2.69-26.13-2.89-36.77-3.04-10.67.11-23.04.35-36.77 3.04-12.96 2.54-50.93 10.48-82.67 41.78-31.72 31.28-39.69 68.62-44.44 92.44-4.29 21.52-1.77 52.96 4.66 113.9-1.22-1.53-5.19-5.61-7.44-7.84-2.51-2.49-5.64-4.82-13.06-9.69-3.29-2.16-6.14-3.81-9.78-3.56-.89.06-5.08.46-7.11 3.56-1.22 1.85-1.15 3.89-1.11 4.67 1.27 26.68 3.33 33.78 3.33 33.78 4.3 25.11 3.68 22.95 10.89 45.56 0 0 4.48 14.04 16.24 30 .33.45 1.1 1.47 2.43 2.44 4.72 3.46 13.75 3.43 17.5 2.4.13 1.14.27 2.29.4 3.46 2.91 25 7.08 40.27 11.48 50.98l14.67 25.99 4.08 91.63c-.58 5.84-2.24 21.39-7.56 31.22-3.07 5.68-8.8 14.23-20.89 23.11-19.28 14.16-35.56 17.17-49.69 22.33-19.46 7.11-44.13 15.78-78.13 26.44"
                        className={styles.cls4}
                    ></path>
                    <g id="LINES">
                        <g id="line">
                            <path d="M112.51 133.11c.26.21.52.42.78.62" className={styles.cls2}></path>
                            <path
                                d="M114.86 134.95c36.48 27.73 88.08 27.24 159.03 27.24h1.54c71.46 0 121.82.5 158.3-27.84"
                                className={styles.cls5}
                            ></path>
                            <path
                                d="M434.53 133.73c.26-.21.52-.41.78-.62"
                                className={styles.cls2}
                            ></path>
                        </g>
                        <g id="line-2" data-name="line">
                            <path d="m154.61 433.71.9.42" className={styles.cls2}></path>
                            <path
                                d="M157.32 434.94c27.47 11.87 63.73 12 116.99 12s89.8.05 117.36-12.21"
                                className={styles.cls1}
                            ></path>
                            <path d="m392.57 434.32.9-.42" className={styles.cls2}></path>
                        </g>
                        <g id="line-3" data-name="line">
                            <path d="M273.9 2.07v1" className={styles.cls2}></path>
                            <path d="M273.9 5.06v630.46" className={styles.cls3}></path>
                            <path d="M273.9 636.52v1" className={styles.cls2}></path>
                        </g>
                    </g>
                    <g id={styles.selectables}>
                        <path
                            id="parietal-right"
                            onClick={handleZoneClick}
                            data-zone="Parietale droite"
                            onMouseEnter={() => enter("Parietale droit")}
                            onMouseLeave={leave}
                            d="M282.04 156.22c18.17.68 47.27.66 80.59-3.95 40.61-5.62 63.74-15.99 64-25.2.35-12.59-20.4-63.94-43.26-82.67-37.59-30.79-81.06-35.9-101.33-36.89v148.7Z"
                            className={`${styles.cls6} ${isSelected("Parietale droite")}`}
                        ></path>
                        <path
                            id="parietal-left"
                            onClick={handleZoneClick}
                            data-zone="Parietale gauche"
                            onMouseEnter={() => enter("Parietale gauche")}
                            onMouseLeave={leave}
                            d="M265.82 156.22c-18.17.68-47.27.66-80.59-3.95-40.61-5.62-63.74-15.99-64-25.2-.35-12.59 20.4-63.94 43.26-82.67 37.59-30.79 81.05-35.89 101.33-36.88z"
                            className={`${styles.cls6} ${isSelected("Parietale gauche")}`}
                        ></path>
                        <path
                            id="occipital-left"
                            onClick={handleZoneClick}
                            data-zone="Occipital gauche"
                            onMouseEnter={() => enter("Occipital gauche")}
                            onMouseLeave={leave}
                            d="M122.16 165.08c-.42-6.11 5.7-10.52 11.37-8.22 14.7 5.97 34.88 9.41 56.77 12.99 23.03 3.77 41.77 6.38 57.98 5.23 5.51-.39 10.18 3.98 10.18 9.5v239c0 6.57-5.44 11.83-12 11.6-24.02-.84-85.04-8.2-91.85-19.1-8.89-14.22-25.92-143.26-27.7-176.15-1.23-22.73-3.47-56.28-4.74-74.84Z"
                            className={`${styles.cls6} ${isSelected("Occipital gauche")}`}
                        ></path>
                        <path
                            id="occipital-right"
                            onClick={handleZoneClick}
                            data-zone="Occipital droite"
                            onMouseEnter={() => enter("Occipital droite")}
                            onMouseLeave={leave}
                            d="M426.61 165.08c.42-6.11-5.7-10.52-11.37-8.22-14.7 5.97-34.88 9.41-56.77 12.99-23.03 3.77-41.77 6.38-57.98 5.23-5.51-.39-10.18 3.98-10.18 9.5v239c0 6.57 5.44 11.83 12 11.6 24.02-.84 85.04-8.2 91.85-19.1 8.89-14.22 25.92-143.26 27.7-176.15 1.23-22.73 3.47-56.28 4.74-74.84Z"
                            className={`${styles.cls6} ${isSelected("Occipital droite")}`}
                        ></path>
                        <path
                            id="cervicale-left"
                            onClick={handleZoneClick}
                            data-zone="Cervicale gauche"
                            onMouseEnter={() => enter("Cervicale gauche")}
                            onMouseLeave={leave}
                            d="M164.6 456.29c-.24-4.49 3.9-7.81 8.02-6.46 12.94 4.25 27.04 4.63 40.48 5.63a762 762 0 0 0 44.05 2.02c2.51.04 5.27.18 7.09 1.98 2.04 2.02 2.11 5.33 2.03 8.26-.84 33.01-1.66 66.03-2.44 99.04-.06 2.48-.18 4.97-.18 7.45 0 6.14-4.78 11.12-10.67 11.12H163.7c-5.44 0-8.98-5.98-6.52-11.05 5.64-11.63 9.33-24.29 10.67-37.25s-1.24-26.58-1.21-40.05c.03-13.51-1.34-27.2-2.05-40.69Z"
                            className={`${styles.cls6} ${isSelected("Cervicale gauche")}`}
                        ></path>
                        <path
                            id="cervicale-right"
                            onClick={handleZoneClick}
                            data-zone="Cervicale droite"
                            onMouseEnter={() => enter("Cervicale droite")}
                            onMouseLeave={leave}
                            d="M385.27 456.29c.24-4.49-3.9-7.81-8.02-6.46-12.94 4.25-27.04 4.63-40.48 5.63a762 762 0 0 1-44.05 2.02c-2.51.04-5.27.18-7.09 1.98-2.04 2.02-2.11 5.33-2.03 8.26.84 33.01 1.66 66.03 2.44 99.04.06 2.48.18 4.97.18 7.45 0 6.14 4.78 11.12 10.67 11.12h89.28c5.44 0 8.98-5.98 6.52-11.05-5.64-11.63-9.33-24.29-10.67-37.25-1.39-13.51 1.24-26.58 1.21-40.05-.03-13.51 1.34-27.2 2.05-40.69Z"
                            className={`${styles.cls6} ${isSelected("Cervicale droite")}`}
                        ></path>
                    </g>
                </g>
            </svg>
        </>
    )
}

export default BackZones;