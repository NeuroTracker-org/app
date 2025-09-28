import Head from "next/head";
import MedicineSearch from "../components/medicineSearch/medicineSearch.js";
import { useDrugs } from "@/hooks/useDrugs";
import styles from "../styles/Medicine.module.css";
import { useState } from "react";

export default function MedicinePage() {
  const { drugs: myDrugs, addDrug, deleteDrug, editDrugMolecule } = useDrugs();
  const [editingId, setEditingId] = useState(null);

  const handleBlurMolecule = (id, e) => {
    editDrugMolecule(id, e.target.innerText.trim());
    setEditingId(null);
  };

  return (
    <>
      <Head>
        <title>NeuroTracker App - Médicaments</title>
      </Head>

      <main className={styles.medicineMain}>
        <h1><i className="fas fa-capsules"></i> Mes médicaments</h1>
        <p className={styles.medicineDescription}>Ajoute, modifie ou supprime tes médicaments.</p>

        <div className={styles.medicineSearch}>
          <MedicineSearch onSelect={addDrug} />
        </div>

        {myDrugs.length === 0 ? (
          <p>Aucun médicament ajouté.</p>
        ) : (
          <ul className={styles.drugList}>
            {myDrugs.map((drug) => (
              <li key={drug.id} className={styles.drugItem}>
                <p
                  contentEditable={editingId === drug.id}
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlurMolecule(drug.id, e)}
                  className={`${styles.drugText} ${editingId === drug.id ? styles.editing : ""
                    }`}
                >
                  {drug.molecule}
                </p>
                <div className={styles.buttonGroup}>
                  <button
                    onClick={() => setEditingId(drug.id)}
                    className={styles.editBtn}
                  >
                    <i className="far fa-pen" />
                  </button>
                  <button
                    onClick={() => deleteDrug(drug.id)}
                    className={styles.deleteBtn}
                  >
                    <i className="far fa-trash-alt" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
