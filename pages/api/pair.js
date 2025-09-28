// pages/api/pair.js
import { db } from "@/lib/db"; // ⚠️ ici tu n’auras pas accès à IndexedDB côté serveur
// Donc il faut stocker dans un cache/DB serveur (Redis, SQLite, etc.)
// Pour la démo, on simule en mémoire (à remplacer en prod)

let codes = {}; 
// Structure: { CODE: { createdAt, expiresAt } }

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Code requis" });
    }

    const entry = codes[code];
    if (!entry) {
      return res.status(404).json({ error: "Code inconnu" });
    }

    if (Date.now() > entry.expiresAt) {
      delete codes[code];
      return res.status(410).json({ error: "Code expiré" });
    }

    // Ici tu pourrais renvoyer des données pour initialiser la synchro
    return res.status(200).json({ success: true, message: "Pairing validé" });
  }

  if (req.method === "PUT") {
    // Générer un nouveau code (exemple côté serveur)
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const exp = Date.now() + 60 * 60 * 1000; // +1h
    codes[code] = { createdAt: Date.now(), expiresAt: exp };

    return res.status(200).json({ code, expiresAt: exp });
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}
