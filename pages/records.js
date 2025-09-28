import Head from "next/head";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

import RecordListElement from "@/components/recordListElement/recordListElement";
import styles from "../styles/Records.module.css";

export default function Records() {
  const records = useLiveQuery(() => db.records.toArray(), []) || [];

  return (
    <>
      <Head>
        <title>NeuroTracker App - Enregistrements</title>
      </Head>
      <main className={styles.recordsMain}>
        <h1>Historique de mes enregistrements</h1>

        {records.length === 0 ? (
          <p className={styles.noRecords}>Aucun enregistrement trouvé.</p>
        ) : (
          <ul className={styles.recordsList}>
            {records
              .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
              .map((record) => (
                <li key={record.id}>
                  <RecordListElement record={record} />
                </li>
              ))}
          </ul>
        )}
      </main>
    </>
  );
}
