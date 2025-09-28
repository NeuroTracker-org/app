// context/AuthContext.js

import { createContext, useState, useEffect } from "react";
import { db } from "@/lib/db";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [currentRecordId, setCurrentRecordId] = useState(null);

  // Charger depuis IndexedDB
  useEffect(() => {
    db.meta.get("recordingState").then((saved) => {
      if (saved) {
        setIsRecording(saved.isRecording);
        setStartTime(saved.startTime);
      }
    });
  }, []);

  // Sauvegarder à chaque changement
  useEffect(() => {
    db.meta.put(
      { key: "recordingState", isRecording, startTime },
      "recordingState"
    );
  }, [isRecording, startTime]);

  const values = {
    isRecording,
    setIsRecording,
    startTime,
    setStartTime,
    currentRecordId,
    setCurrentRecordId
  };

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
}
