import ReactDOM from "react-dom";
import { useDrugs } from "@/hooks/useDrugs";
import MedicineSearch from "@/components/medicineSearch/medicineSearch";
import styles from "./medicineModal.module.css";
import { useState } from "react";

const MedicineModal = ({ isOpen, hide }) => {
    const { drugs: myDrugs, addDrug, deleteDrug, editDrugMolecule } = useDrugs();
    const [editingId, setEditingId] = useState(null);

    const handleBlurMolecule = (id, e) => {
        editDrugMolecule(id, e.target.innerText.trim());
        setEditingId(null);
    };

    return (
        isOpen &&
        ReactDOM.createPortal(
            <div className={styles.modalContainer}>
                <div className={styles.overlay} onClick={hide}></div>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h3>
                            <i className="far fa-capsules"></i> Mes médicaments
                        </h3>
                        <button type="button" className={styles.closeBtn} onClick={hide}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className={styles.modalContent}>
                        <MedicineSearch onSelect={addDrug} />

                        {myDrugs.length === 0 ? (
                            <p>Aucun médicament enregistré.</p>
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
                    </div>
                </div>
            </div>,
            document.body
        )
    );
};

export default MedicineModal;
