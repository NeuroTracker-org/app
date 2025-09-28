import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./frontzones.module.css";

function FloatingTooltip({ text, x, y }) {
    if (!text) return null;
    return createPortal(
        <div className={styles.tooltip} style={{ top: y, left: x }}>
            {text}
        </div>,
        document.body
    );
}

const FrontZones = ({ handleZoneClick, selectedZones }) => {
    const isSelected = (zone) =>
        selectedZones.includes(zone) ? `${styles.fzoneColor2} ${styles.selected}` : styles.fzoneColor2;

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
                viewBox="0 0 547.92 629.71"
                id={styles.FrontZones}
                onMouseMove={handleMouseMove}
                onMouseLeave={leave}
            >
                <defs>
                    <linearGradient id={`neckgradient`} data-name="neckgradient" x1="274.35" y1="516.28" x2="274.02" y2="612.08" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="var(--background-grey)" />
                        <stop offset="1" stop-color="var(--background)" stop-opacity="0" />
                    </linearGradient>
                </defs>
                <g id="headgroup">
                    <path
                        id="neck"
                        d="M468.79 602.26c-14.12-5.16-30.4-8.17-49.69-22.33-12.09-8.88-17.82-17.44-20.89-23.11-5.31-9.83-6.98-25.38-7.56-31.22l4.08-91.63h-.02c-9.1 12.39-19.15 21.56-27.1 28.81-13.83 12.62-21.96 25.73-40.96 32.74-7.07 2.61-20.44 6.72-52.7 6.65-32.26.07-45.63-4.04-52.7-6.65-19-7.01-27.13-20.13-40.96-32.74-7.95-7.25-18-16.42-27.1-28.81l4.08 91.63c-.58 5.84-2.24 21.39-7.56 31.22-3.07 5.68-8.8 14.23-20.89 23.11-19.28 14.16-35.56 17.17-49.69 22.33C59.67 609.37 35 618.04 1 628.7h545.92c-34-10.67-58.67-19.33-78.13-26.44"
                        className={styles.cls20}
                    ></path>
                    <g id="neckline">
                        <path
                            id="neckline-right"
                            d="m153.18 433.97 4.08 91.63c-.58 5.84-2.24 21.39-7.56 31.22-3.07 5.68-8.8 14.23-20.89 23.11-19.28 14.16-35.56 17.17-49.69 22.33-19.46 7.11-44.13 15.78-78.13 26.44"
                            className={styles.cls2}
                        ></path>
                        <path
                            id="neckline-left"
                            d="M546.92 628.71c-34-10.67-58.67-19.33-78.13-26.44-14.12-5.16-30.4-8.17-49.69-22.33-12.09-8.88-17.82-17.44-20.89-23.11-5.31-9.83-6.98-25.38-7.56-31.22l4.08-91.63h-.02"
                            className={styles.cls2}
                        ></path>
                    </g>
                    <path
                        id="head"
                        d="M437.84 138.33c-4.75-23.83-12.72-61.16-44.44-92.44-31.74-31.3-69.7-39.24-82.67-41.78C297 1.42 284.6.78 273.96 1.07c-10.64-.29-23.04.35-36.77 3.04-12.96 2.54-50.93 10.48-82.67 41.78-31.72 31.28-39.69 68.62-44.44 92.44-4.93 24.68-.88 62.41 7.74 142.73.32 2.94 3.67 28.2 9.22 75.94 2.91 25 7.08 40.27 11.48 50.98 10.99 26.73 29.07 43.21 41.78 54.8 13.83 12.62 21.96 25.73 40.96 32.74 7.07 2.61 20.44 6.72 52.7 6.65 32.26.07 45.63-4.04 52.7-6.65 19-7.01 27.13-20.13 40.96-32.74 12.71-11.59 30.78-28.08 41.78-54.8 4.4-10.7 8.57-25.97 11.48-50.98 5.56-47.74 8.91-73 9.22-75.94 8.62-80.32 12.66-118.04 7.74-142.73"
                        className={styles.cls22}
                    ></path>
                    <path
                        id="headline"
                        d="M437.84 138.33c-4.75-23.83-12.72-61.16-44.44-92.44-31.74-31.3-69.7-39.24-82.67-41.78C297 1.42 284.6.78 273.96 1.07c-10.64-.29-23.04.35-36.77 3.04-12.96 2.54-50.93 10.48-82.67 41.78-31.72 31.28-39.69 68.62-44.44 92.44-4.93 24.68-.88 62.41 7.74 142.73.32 2.94 3.67 28.2 9.22 75.94 2.91 25 7.08 40.27 11.48 50.98 10.99 26.73 29.07 43.21 41.78 54.8 13.83 12.62 21.96 25.73 40.96 32.74 7.07 2.61 20.44 6.72 52.7 6.65 32.26.07 45.63-4.04 52.7-6.65 19-7.01 27.13-20.13 40.96-32.74 12.71-11.59 30.78-28.08 41.78-54.8 4.4-10.7 8.57-25.97 11.48-50.98 5.56-47.74 8.91-73 9.22-75.94 8.62-80.32 12.66-118.04 7.74-142.73"
                        className={styles.cls2}
                    ></path>
                    <g id="ear-left">
                        <path
                            id="el"
                            d="M422.22 353.97c3.75 1.03 11.81.64 16.52-2.82 1.32-.97 2.1-2 2.43-2.44 11.76-15.96 16.24-30 16.24-30 7.21-22.61 6.59-20.44 10.89-45.56 0 0 2.06-7.09 3.33-33.78.04-.77.11-2.81-1.11-4.67-2.03-3.09-6.22-3.49-7.11-3.56-3.64-.25-6.49 1.4-9.78 3.56-7.42 4.87-12.83 9.28-15.33 11.78-2.24 2.23-3.01 4.55-4.15 5.9z"
                            className={styles.cls22}
                        ></path>
                        <path
                            id="el-line"
                            d="M422.12 353.47c3.75 1.03 11.91 1.14 16.63-2.32 1.32-.97 2.1-2 2.43-2.44 11.76-15.96 16.24-30 16.24-30 7.21-22.61 6.59-20.44 10.89-45.56 0 0 2.06-7.09 3.33-33.78.04-.77.11-2.81-1.11-4.67-2.03-3.09-6.22-3.49-7.11-3.56-3.64-.25-6.49 1.4-9.78 3.56-7.42 4.87-10.55 7.19-13.06 9.69-2.24 2.23-6.07 5.94-7.29 7.47"
                            className={styles.cls13}
                        ></path>
                    </g>
                    <g id="ear-right">
                        <path
                            id="er"
                            d="M125.64 353.97c-3.75 1.03-11.81.64-16.52-2.82-1.32-.97-2.1-2-2.43-2.44-11.76-15.96-16.24-30-16.24-30-7.21-22.61-6.59-20.44-10.89-45.56 0 0-2.06-7.09-3.33-33.78-.04-.77-.11-2.81 1.11-4.67 2.03-3.09 6.22-3.49 7.11-3.56 3.64-.25 6.49 1.4 9.78 3.56 7.42 4.87 12.83 9.28 15.33 11.78 2.24 2.23 3.01 4.55 4.15 5.9z"
                            className={styles.cls22}
                        ></path>
                        <path
                            id="er-line"
                            d="M125.75 353.47c-3.75 1.03-11.91 1.14-16.63-2.32-1.32-.97-2.1-2-2.43-2.44-11.76-15.96-16.24-30-16.24-30-7.21-22.61-6.59-20.44-10.89-45.56 0 0-2.06-7.09-3.33-33.78-.04-.77-.11-2.81 1.11-4.67 2.03-3.09 6.22-3.49 7.11-3.56 3.64-.25 6.49 1.4 9.78 3.56 7.42 4.87 10.55 7.19 13.06 9.69 2.24 2.23 6.07 5.94 7.29 7.47"
                            className={styles.cls13}
                        ></path>
                    </g>
                    <g id="LINES">
                        <g id="line">
                            <path
                                d="M136.02 396.72c.13-.3.25-.61.38-.92"
                                className={styles.cls6}
                            ></path>
                            <path
                                d="M137.13 393.93c11.29-29.73 13.59-80.49 13.88-109.72.74-75.2-16.31-115.7-37.39-149.35"
                                className={styles.cls10}
                            ></path>
                            <path
                                d="M113.08 134.02c-.18-.28-.36-.56-.53-.84"
                                className={styles.cls6}
                            ></path>
                        </g>
                        <g id="line-2" data-name="line">
                            <path
                                d="M412.07 396c-.13-.3-.25-.61-.38-.92"
                                className={styles.cls6}
                            ></path>
                            <path
                                d="M410.96 393.21c-11.31-29.68-13.81-79.77-14.1-109-.74-75.2 16.16-116.73 37.24-150.42"
                                className={styles.cls4}
                            ></path>
                            <path
                                d="M434.64 132.95c.18-.28.35-.56.53-.84"
                                className={styles.cls6}
                            ></path>
                        </g>
                        <g id="line-3" data-name="line">
                            <path d="M112.55 133.17c.26.21.52.42.78.62" className={styles.cls6}></path>
                            <path
                                d="M114.9 135.02c36.13 27.47 87.11 27.25 157.03 27.24"
                                className={styles.cls16}
                            ></path>
                            <path d="M272.93 162.26h1" className={styles.cls6}></path>
                        </g>
                        <g id="line-4" data-name="line">
                            <path d="M273.93 2.32v1" className={styles.cls6}></path>
                            <path d="M273.93 5.32v154.94" className={styles.cls5}></path>
                            <path d="M273.93 161.26v1h1" className={styles.cls6}></path>
                            <path
                                d="M276.92 162.26c69.92-.01 120.52-.67 156.52-28.65"
                                className={styles.cls8}
                            ></path>
                            <path d="M434.22 133c.26-.21.52-.41.78-.62" className={styles.cls6}></path>
                        </g>
                        <g id="line-5" data-name="line">
                            <path d="m150.56 266.08.93.36" className={styles.cls6}></path>
                            <path
                                d="M153.33 267.14c25.38 9.61 55.13 16.26 87.4 19"
                                className={styles.cls9}
                            ></path>
                            <path d="M241.72 286.22c.33.03.66.05 1 .08" className={styles.cls6}></path>
                        </g>
                        <g id="line-6" data-name="line">
                            <path
                                d="M242.76 285.31v1c.33.03.66.05 1 .08"
                                className={styles.cls6}
                            ></path>
                            <path
                                d="M245.7 286.53c9.23.67 18.65 1.03 28.23 1.03s19.66-.38 29.2-1.1"
                                className={styles.cls14}
                            ></path>
                            <path
                                d="M304.11 286.39c.33-.03.66-.05 1-.08v-1"
                                className={styles.cls6}
                            ></path>
                            <path d="M305.11 283.31V164.26" className={styles.cls7}></path>
                            <path d="M305.11 163.26v-1h-1" className={styles.cls6}></path>
                            <path d="M302.16 162.26h-57.43" className={styles.cls12}></path>
                            <path d="M243.76 162.26h-1v1" className={styles.cls6}></path>
                            <path d="M242.76 165.26v119.05" className={styles.cls7}></path>
                        </g>
                        <g id="line-7" data-name="line">
                            <path d="M305.06 286.3c.33-.03.66-.05 1-.08" className={styles.cls6}></path>
                            <path
                                d="M308.02 286.05c32.28-2.82 62.02-9.56 87.34-19.26"
                                className={styles.cls1}
                            ></path>
                            <path d="m396.28 266.44.93-.36" className={styles.cls6}></path>
                        </g>
                        <g id="line-8" data-name="line">
                            <path d="M135.8 396.12c.29.16.59.31.89.45" className={styles.cls6}></path>
                            <path
                                d="M138.53 397.31c21.13 7.2 54.83-23.6 71.76-43.01 21.44-24.58 29.09-51.44 32.09-66.47"
                                className={styles.cls3}
                            ></path>
                            <path
                                d="M242.57 286.85c.06-.33.13-.66.19-.98"
                                className={styles.cls6}
                            ></path>
                        </g>
                        <g id="line-9" data-name="line">
                            <path
                                d="M412.31 395.39c-.29.16-.59.31-.89.45"
                                className={styles.cls6}
                            ></path>
                            <path
                                d="M409.58 396.58c-21.15 7.27-55.07-22.87-72.01-42.29-21.44-24.58-29.09-51.44-32.09-66.47"
                                className={styles.cls15}
                            ></path>
                            <path
                                d="M305.29 286.85c-.06-.33-.13-.66-.19-.98"
                                className={styles.cls6}
                            ></path>
                        </g>
                        <g id="line-10" data-name="line">
                            <path
                                d="M225.98 495.88c.08-.33.15-.65.23-.98"
                                className={styles.cls6}
                            ></path>
                            <path
                                d="M226.62 492.95c2.57-12.72 1.66-22.1 1.42-25.16-2.4-30.69-21.86-65.91-54.58-79.67"
                                className={styles.cls17}
                            ></path>
                            <path
                                d="M172.54 387.74c-.31-.13-.62-.25-.93-.37"
                                className={styles.cls6}
                            ></path>
                        </g>
                        <g id="line-11" data-name="line">
                            <path
                                d="M322.24 495.82c-.08-.33-.15-.65-.23-.98"
                                className={styles.cls6}
                            ></path>
                            <path
                                d="M321.6 492.9c-2.59-12.71-1.79-22.05-1.56-25.1 2.4-30.69 21.86-65.91 54.58-79.67"
                                className={styles.cls18}
                            ></path>
                            <path
                                d="M375.54 387.74c.31-.13.62-.25.93-.37"
                                className={styles.cls6}
                            ></path>
                        </g>
                        <ellipse
                            id="line-12"
                            cx="273.93"
                            cy="380.94"
                            className={styles.cls11}
                            data-name="line"
                            rx="57.21"
                            ry="16.25"
                        ></ellipse>
                    </g>
                    <g id="selectables">
                        <path
                            id="tr"
                            d="M147.18 271.55c.48-45.83-14.22-91.72-28.82-119.7-1.12-2.15-4.34-1.52-4.59.89-.3 2.92-.53 5.76-.57 6.6-.82 19.31.37 48.25 7.29 109.79.25 2.25 2.95 21.61 7.42 58.19 1.13 9.26 3.89 32.01 6.07 45.57.42 2.63 4.13 2.78 4.78.2 6.93-27.66 8.22-81.36 8.43-101.53Z"
                            onClick={handleZoneClick}
                            onMouseEnter={() => enter("Temporal droit")}
                            onMouseLeave={leave}
                            data-zone="Temporal droit"
                            className={`${isSelected("Temporal droit")} ${styles.cls21}`}
                        ></path>
                        <path
                            id="tl"
                            d="M400.45 271.55c-.49-47.45 15.28-94.97 30.38-122.61.66-1.22 2.49-.88 2.67.49.47 3.75.89 8.74.94 9.91.82 19.31-.37 48.25-7.29 109.79-.25 2.25-2.95 21.61-7.42 58.19-1.27 10.39-4.59 37.78-6.84 50.09-.27 1.46-2.32 1.6-2.76.18-8.03-25.87-9.46-84.71-9.68-106.04"
                            onClick={handleZoneClick}
                            onMouseEnter={() => enter("Temporal gauche")}
                            onMouseLeave={leave}
                            data-zone="Temporal gauche"
                            className={`${isSelected("Temporal gauche")} ${styles.cls21}`}
                        ></path>
                        <ellipse
                            onClick={handleZoneClick}
                            onMouseEnter={() => enter("Buccale")}
                            onMouseLeave={leave}
                            data-zone="Buccale"
                            className={`${isSelected("Buccale")} ${styles.cls21}`}
                            cx="273.93"
                            cy="380.94"
                            rx="52.85"
                            ry="13.35"
                        ></ellipse>
                        <path
                            id="fr"
                            d="M267.26 155.48c-18.17.68-47.27.66-80.59-3.95-40.61-5.62-63.74-15.99-64-25.2-.35-12.59 20.4-63.94 43.26-82.67 37.59-30.78 81.06-35.89 101.33-36.88z"
                            onClick={handleZoneClick}
                            onMouseEnter={() => enter("Frontale droite")}
                            onMouseLeave={leave}
                            data-zone="Frontale droite"
                            className={`${isSelected("Frontale droite")} ${styles.cls21}`}
                        ></path>
                        <path
                            id="fl"
                            d="M280.59 155.48c18.17.68 47.27.66 80.59-3.95 40.61-5.62 63.74-15.99 64-25.2.35-12.59-20.4-63.94-43.26-82.67-37.59-30.79-81.06-35.9-101.33-36.89v148.7Z"
                            onClick={handleZoneClick}
                            onMouseEnter={() => enter("Frontale gauche")}
                            onMouseLeave={leave}
                            data-zone="Frontale gauche"
                            className={`${isSelected("Frontale gauche")} ${styles.cls21}`}
                        ></path>
                        <path
                            id="or"
                            d="M235.93 280.22c-11.04 0-24.94-1.73-44.52-6.3-22.22-5.19-35.85-8.3-36.15-11.7-1.41-16.24.47-28.73-6.74-55.31-9.44-34.81-22.3-57.95-23.49-59.43 0 0 22 13.93 56.45 17.19 22.97 2.17 42.15 3.01 55.19 2.96z"
                            onClick={handleZoneClick}
                            onMouseEnter={() => enter("Oculaire droite")}
                            onMouseLeave={leave}
                            data-zone="Oculaire droite"
                            className={`${isSelected("Oculaire droite")} ${styles.cls21}`}
                        ></path>
                        <path
                            id="ol"
                            d="M309.28 280.22c11.04 0 24.94-1.73 44.52-6.3 22.22-5.19 35.85-8.3 36.15-11.7 1.41-16.24-.47-28.73 6.74-55.31 9.44-34.81 22.3-57.95 23.49-59.43 0 0-22 13.93-56.45 17.19-22.97 2.17-42.15 3.01-55.19 2.96z"
                            onClick={handleZoneClick}
                            onMouseEnter={() => enter("Oculaire gauche")}
                            onMouseLeave={leave}
                            data-zone="Oculaire gauche"
                            className={`${isSelected("Oculaire gauche")} ${styles.cls21}`}
                        ></path>
                        <path
                            id="nasal"
                            d="M246 167.11h55.33v114H246z"
                            onClick={handleZoneClick}
                            onMouseEnter={() => enter("Nasale")}
                            onMouseLeave={leave}
                            data-zone="Nasale"
                            className={`${isSelected("Nasale")} ${styles.cls21}`}
                        ></path>
                        <path
                            id="mxr"
                            d="M156.94 279.6c-.17-3.53 3.27-6.1 6.6-4.94 7.29 2.54 19.21 6.39 30.87 8.81s27.42 4.61 35.86 5.67c3.26.41 5.22 3.8 3.97 6.84-7.9 19.19-16.98 38.08-29.84 54.5-12.82 16.38-30.17 31.39-50.07 38.3-3.94 1.37-10.24.77-8.76-5.09 3.11-12.36 8.31-35.59 10.62-60.89 1.6-17.5 1.2-34.01.75-43.2"
                            onClick={handleZoneClick}
                            onMouseEnter={() => enter("Maxillaire droit")}
                            onMouseLeave={leave}
                            data-zone="Maxillaire droit"
                            className={`${isSelected("Maxillaire droit")} ${styles.cls21}`}
                        ></path>
                        <path
                            id="mxl"
                            d="M391.75 279.6c.17-3.53-3.27-6.1-6.6-4.94-7.29 2.54-19.21 6.39-30.87 8.81-12.21 2.54-27.42 4.61-35.86 5.67-3.26.41-5.22 3.8-3.97 6.84 7.9 19.19 16.98 38.08 29.84 54.5 12.82 16.38 30.17 31.39 50.07 38.3 3.94 1.37 10.24.77 8.76-5.09-3.11-12.36-8.31-35.59-10.62-60.89-1.6-17.5-1.2-34.01-.75-43.2"
                            onClick={handleZoneClick}
                            onMouseEnter={() => enter("Maxillaire gauche")}
                            onMouseLeave={leave}
                            data-zone="Maxillaire gauche"
                            className={`${isSelected("Maxillaire gauche")} ${styles.cls21}`}
                        ></path>
                        <path
                            id="mr"
                            d="M144.59 409.43c-1.86-2.59-.2-6.2 2.97-6.51 2.25-.22 4.7-.6 7.3-1.22a53 53 0 0 0 14.35-5.78c4.18-2.44 9.08.55 12.69 2.78 4.27 2.64 7.97 6.12 11.21 9.93 4.57 5.39 8.26 11.47 12.08 17.42 3.65 5.69 7.45 11.33 10.12 17.54 5.49 12.8 6.38 27.18 6.49 40.93.02 2.12-2.33 3.39-4.1 2.23-8.58-5.63-15.75-12.7-23.09-19.81-7.99-7.74-15.88-15.6-23.39-23.81-9.74-10.64-18.22-22.03-26.62-33.71Z"
                            onClick={handleZoneClick}
                            onMouseEnter={() => enter("Mentonnière droite")}
                            onMouseLeave={leave}
                            data-zone="Mentonnière droite"
                            className={`${isSelected("Mentonnière droite")} ${styles.cls21}`}
                        ></path>
                        <path
                            id="mll"
                            d="M402.56 409.43c1.86-2.59.2-6.2-2.97-6.51-2.25-.22-4.7-.6-7.3-1.22a53 53 0 0 1-14.35-5.78c-4.18-2.44-9.08.55-12.69 2.78-4.27 2.64-7.97 6.12-11.21 9.93-4.57 5.39-8.26 11.47-12.08 17.42-3.65 5.69-7.45 11.33-10.12 17.54-5.49 12.8-6.38 27.18-6.49 40.93-.02 2.12 2.33 3.39 4.1 2.23 8.58-5.63 15.75-12.7 23.09-19.81 7.99-7.74 15.88-15.6 23.39-23.81 9.74-10.64 18.22-22.03 26.62-33.71Z"
                            onClick={handleZoneClick}
                            onMouseEnter={() => enter("Mentonnière gauche")}
                            onMouseLeave={leave}
                            data-zone="Mentonnière gauche"
                            className={`${isSelected("Mentonnière gauche")} ${styles.cls21}`}
                        ></path>
                    </g>
                    <g id={styles.eyebrows}>
                        <path
                            id="eyebrow-right"
                            d="M151.44 216.37c14.21-2.95 27.7-5.39 41.96-4.55 6.86.31 13.91 1.27 21.15 1.89 7.15.61 14.32 1.36 21.84 1.64-9.57-5.94-20.36-9.17-31.29-11.36-18.51-3.86-39.17-.06-53.66 12.39Z"
                            className={styles.cls19}
                        ></path>
                        <path
                            id="eyebrow-left"
                            d="M340.04 203.95c-11.01 2.21-21.86 5.46-31.5 11.44 7.57-.28 14.79-1.04 21.99-1.65 7.29-.62 14.4-1.58 21.3-1.9 14.35-.84 27.94 1.62 42.25 4.58-14.59-12.53-35.4-16.37-54.03-12.48Z"
                            className={styles.cls19}
                        ></path>
                    </g>
                </g>
            </svg>
        </>
    )
}

export default FrontZones;