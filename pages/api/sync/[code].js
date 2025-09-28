// pages/api/sync/[code].js
import fs from "fs";
import path from "path";

const SYNC_DIR = path.join(process.cwd(), "tmp", "sync");

// Assure l'existence du dossier
if (!fs.existsSync(SYNC_DIR)) {
  fs.mkdirSync(SYNC_DIR, { recursive: true });
}

// Fonction de nettoyage auto
function cleanupExpired() {
  const now = Date.now();
  const files = fs.readdirSync(SYNC_DIR);
  for (const file of files) {
    const filePath = path.join(SYNC_DIR, file);
    try {
      const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      if (content.expiresAt && content.expiresAt < now) {
        fs.unlinkSync(filePath);
      }
    } catch {
      fs.unlinkSync(filePath); // fichier corrompu
    }
  }
}

// Lance le cleanup au chargement du fichier (exécuté à chaque appel)
cleanupExpired();

export default async function handler(req, res) {
  const { code } = req.query;
  const filePath = path.join(SYNC_DIR, `${code}.json`);

  if (req.method === "POST") {
    try {
      const payload = req.body;
      if (!payload) {
        return res.status(400).json({ error: "Payload manquant" });
      }

      // Stocke avec expiration dans 1h
      const expiresAt = Date.now() + 60 * 60 * 1000;
      const data = { ...payload, expiresAt };

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

      return res.status(200).json({ ok: true, expiresAt });
    } catch (err) {
      console.error("Erreur POST sync:", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  if (req.method === "GET") {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Le code de synchronisation est introuvable" });
    }

    try {
      const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      if (content.expiresAt < Date.now()) {
        fs.unlinkSync(filePath);
        return res.status(410).json({ error: "Expired" });
      }
      return res.status(200).json(content);
    } catch (err) {
      console.error("Erreur lecture sync:", err);
      return res.status(500).json({ error: "Erreur lecture fichier" });
    }
  }

  res.setHeader("Allow", ["POST", "GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
