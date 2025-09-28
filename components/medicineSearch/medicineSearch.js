import { useEffect, useRef, useState } from "react";
import medicines from "@/data/medicine_list.json"; // ton fichier JSON nettoyé
import styles from "./medicineSearch.module.css";

export default function MedicineSearch({ placeholder = "Ajouter un médicament...", onSelect }) {
  const inputRef = useRef(null);
  const [q, setQ] = useState("");
  const [openDrop, setOpenDrop] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [results, setResults] = useState([]);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setIsCustom(false);
      return;
    }
    const normQ = q.toLowerCase();

    // Chercher dans molecule + brands
    const filtered = medicines.filter((m) => {
      if (m.molecule.toLowerCase().includes(normQ)) return true;
      return m.brands?.some((b) => b.toLowerCase().includes(normQ));
    });

    setResults(filtered.slice(0, 6)); // limiter les résultats
    setIsCustom(filtered.length === 0); // rien trouvé → ajout libre
  }, [q]);

  const selectDrug = (drug) => {
    onSelect?.(drug);
    setQ(""); // clear input
    setOpenDrop(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (results.length > 0) {
      // sélection d'un résultat connu
      selectDrug(results[highlight] || results[0]);
    } else if (q.trim()) {
      // saisie libre
      onSelect?.({ molecule: q.trim(), brands: [] });
      setQ(""); // clear input
      setOpenDrop(false);
    }
  };


  const onKeyDown = (e) => {
    if (!openDrop && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpenDrop(true);
      return;
    }
    if (!openDrop) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isCustom && q.trim()) {
        selectDrug({ molecule: q.trim(), brands: [] });
      } else if (results[highlight]) {
        selectDrug(results[highlight]);
      }
    } else if (e.key === "Escape") {
      setOpenDrop(false);
    }
  };

  return (
    <div className={styles.searchWrap}>
      <form className={styles.searchForm} onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={q}
          onChange={(e) => { setQ(e.target.value); if (e.target.value) setOpenDrop(true); }}
          onKeyDown={onKeyDown}
          onFocus={() => { if (results.length) setOpenDrop(true); }}
          onBlur={() => setTimeout(() => setOpenDrop(false), 120)}
          autoComplete="off"
        />
        <button type="submit" aria-label={results.length ? "Rechercher" : "Ajouter"}>
          <i className={results.length ? "fas fa-search" : "fas fa-plus"} />
        </button>

      </form>

      {openDrop && results.length > 0 && (
        <ul className={styles.suggestDropdown}>
          {results.map((item, i) => {
            const isActive = i === highlight;
            return (
              <li
                key={item.molecule}
                className={`${styles.suggestItem} ${isActive ? styles.isActive : ""}`}
                onMouseDown={(e) => { e.preventDefault(); selectDrug(item); }}
                onMouseEnter={() => setHighlight(i)}
              >
                <strong>{item.molecule}</strong>
                {item.brands?.length > 0 && (
                  <span className={styles.brandList}>
                    {" – "}{item.brands.join(", ")}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {openDrop && isCustom && q.trim() && (
        <ul className={styles.suggestDropdown}>
          <li
            className={`${styles.suggestItem} ${styles.isActive}`}
            onMouseDown={(e) => { e.preventDefault(); selectDrug({ molecule: q.trim(), brands: [] }); }}
          >
            <i className="fas fa-plus" /> Ajouter « {q.trim()} »
          </li>
        </ul>
      )}
    </div>
  );
}
