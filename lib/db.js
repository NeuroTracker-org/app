// lib/db.js
import Dexie from "dexie";

export const db = new Dexie("neurotrackerDB");

db.version(1).stores({
  records: "++id, startTime, stopTime, intensity, infos, zones, drugs",
  meta: "key", // pour stocker état global
  drugs: "++id, molecule", // liste des médicaments
});