// components/recordButton/recordButton.js
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { db } from '@/lib/db';
import { useRouter } from "next/router";
import styles from './recordButton.module.css';

export default function RecordButton({ openModalRecord }) {
  const context = useContext(AuthContext);
  const router = useRouter();

  const handleClick = async () => {
    if (!context.isRecording) {
      // 👉 Premier clic : démarrer
      const now = new Date().toISOString();

      // Enregistrer en local (IndexedDB) et récupérer l'id
      const id = await db.records.add({
        startTime: now,
        isRecording: true
      });

      // Mettre à jour le contexte
      context.setIsRecording(true);
      context.setStartTime(now);
      context.setCurrentRecordId(id);   // 👈 ajoute ça dans ton AuthContext
    } else {
      // 👉 Deuxième clic : ouvrir la modal
      openModalRecord();
    }
  };

  const getActiveClass = (href) => (router.pathname === href ? styles.active : "");
  const navigateTo = (path) => {
    if (router.pathname === path) {
      return;
    }
    router.push(path);
  };



  return (
    <div
      className={
        context.isRecording
          ? `${styles.recordButton} ${styles.isRecording}`
          : styles.recordButton
      }
    >
      <ul>
        <li className={getActiveClass("/records")} onClick={() => navigateTo("/records")}><i className="fal fa-file-alt"></i></li>
        <li className={getActiveClass("/reports")} onClick={() => navigateTo("/reports")}><i className="fal fa-chart-line"></i></li>
      </ul>
      <button className={`${styles.btnStart} ${context.isRecording ? styles.isRecording : ''}`} onClick={handleClick}>
        <i className={context.isRecording ? 'fas fa-stop' : 'fas fa-bolt'}></i>
      </button>
      <ul>
        <li className={getActiveClass("/medicine")} onClick={() => navigateTo("/medicine")}><i className="fal fa-capsules"></i></li>
        <li className={getActiveClass("/settings")} onClick={() => navigateTo("/settings")}><i className="fal fa-cog"></i></li>
      </ul>
      {/* <span className={styles.btnLabel}>
        {context.isRecording ? 'Stop' : 'Start'}
      </span> */}
    </div>
  );
}
