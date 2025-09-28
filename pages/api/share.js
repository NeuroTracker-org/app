// pages/api/share.js
import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "shared-reports");

// Crée le dossier si besoin
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Génère un ID court aléatoire
function generateId(length = 8) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Supprime les fichiers expirés
function purgeExpired() {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  const now = Date.now();

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const filePath = path.join(dir, file);
    try {
      const raw = fs.readFileSync(filePath, "utf8");
      const { expires } = JSON.parse(raw);

      if (expires && now > expires) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Purged expired share: ${file}`);
      }
    } catch (err) {
      // Si un fichier est corrompu → on le supprime aussi
      fs.unlinkSync(filePath);
      console.warn(`⚠️ Removed invalid share file: ${file}`);
    }
  }
}

export default function handler(req, res) {
  purgeExpired(); // 🔥 purge automatique à chaque requête

  if (req.method === "POST") {
    try {
      const { data, ttl = 3600 } = req.body || {};
      if (!data) {
        return res.status(400).json({ error: "Missing data" });
      }

      const id = generateId();
      const expires = Date.now() + ttl * 1000;

      const filePath = path.join(dir, `${id}.json`);
      fs.writeFileSync(
        filePath,
        JSON.stringify({ data, expires }, null, 2),
        "utf8"
      );

      return res.status(200).json({ id });
    } catch (err) {
      console.error("Error POST /share:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "GET") {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Missing id" });

      const filePath = path.join(dir, `${id}.json`);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Not found" });
      }

      const raw = fs.readFileSync(filePath, "utf8");
      const { data, expires } = JSON.parse(raw);

      if (Date.now() > expires) {
        fs.unlinkSync(filePath);
        return res.status(410).json({ error: "Expired" });
      }

      return res.status(200).json({ data });
    } catch (err) {
      console.error("Error GET /share:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

// ⚠️ Active bodyParser si jamais tu l’avais désactivé globalement
export const config = {
  api: {
    bodyParser: true,
  },
};
