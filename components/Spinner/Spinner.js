import styles from "./Spinner.module.css";

export default function Spinner({ strokeWidth = 10, sectorWidth = 4 }) {
    const r = 45; // rayon central du ring
    const outer = r + sectorWidth / 2;
    const inner = r - sectorWidth / 2;

    return (
        <div className={styles.spinnerContainer}>
            <svg
                className={styles.spinner}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Cercle complet (ring) */}
                <circle
                    className={styles.ring}
                    cx="50"
                    cy="50"
                    r={r}
                    strokeWidth={strokeWidth}
                />

                {/* Quart d’anneau plus fin, centré sur le ring */}
                <path
                    className={styles.sector}
                    d={`
          M ${50 + outer},50
          A ${outer},${outer} 0 0,1 50,${50 + outer}
          L 50,${50 + inner}
          A ${inner},${inner} 0 0,0 ${50 + inner},50
          Z
        `}
                />
            </svg>

            <p>Chargement</p>
        </div>
    );
}
