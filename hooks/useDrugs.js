import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

/**
 * Hook pour gérer les médicaments en IndexedDB
 */
export function useDrugs() {
  const drugs = useLiveQuery(() => db.drugs.toArray(), []) || [];

  const addDrug = async (drug) => {
    if (!drug?.molecule) return;
    const exists = await db.drugs
      .where("molecule")
      .equalsIgnoreCase(drug.molecule.trim())
      .first();
    if (exists) return;
    await db.drugs.add({
      molecule: drug.molecule.trim(),
      brands: drug.brands || [],
    });
  };

  const deleteDrug = async (id) => {
    await db.drugs.delete(id);
  };

  const editDrugMolecule = async (id, newName) => {
    await db.drugs.update(id, { molecule: newName });
  };

  const editDrugBrands = async (id, str) => {
    const brands = str.split(",").map((b) => b.trim()).filter(Boolean);
    await db.drugs.update(id, { brands });
  };

  return {
    drugs,
    addDrug,
    deleteDrug,
    editDrugMolecule,
    editDrugBrands,
  };
}
