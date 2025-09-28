import { useEffect, useState } from 'react';
import Head from "next/head";
import Link from "next/link";

// Components
import dynamic from "next/dynamic";
const GlowGridCanvas = dynamic(() => import('@/components/GlowGridCanvas/GlowGridCanvas'), { ssr: false });


// Styles
import styles from '../styles/Home.module.css';


export default function Home() {

  return (
    <>
      <Head>
        <title>NeuroTracker App</title>
        <meta name="description" content="NeuroTracker App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.homePage}>
        <h1><img src="/wordmark.svg" alt="NeuroTracker Logo wordmark" /> vous aide à mieux connaître vos migraines et céphalées.</h1>
        <p>Il ne vous reste plus qu'à prendre vos maux de tête en main !</p>
        <ul>
          <li className={styles.mainItem}>
            <i className="fas fa-bolt"></i>
            Bouton éclair pour démarrer rapidement un enregistrement
          </li>
          <li>
            <Link href="/reports">
              <i className="far fa-arrow-right"></i>
              Journal de bord pour suivre vos symptômes et identifier les déclencheurs
            </Link>
          </li>
          <li>
            <Link href="/medicine">
              <i className="far fa-arrow-right"></i>
              Liste des médicaments et traitements que vous utilisez
            </Link>
          </li>
          <li>
            <Link href="/records">
              <i className="far fa-arrow-right"></i>
              Historique de vos enregistrements en détail
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <i className="far fa-arrow-right"></i>
              Paramétrage avancé pour synchroniser, gérer ou partager vos données
            </Link>
          </li>
          <li>
            <Link href="/help">
              <i className="far fa-arrow-right"></i>
              Aide contextuelle pour vous guider dans l'utilisation de l'application
            </Link>
          </li>
          <li>

            <Link href="/settings">
              <i className="far fa-arrow-right"></i>
              Paramétrage avancé pour synchroniser, gérer ou partager vos données
            </Link>
          </li>
          <li>
            <Link href="/help">
              <i className="far fa-arrow-right"></i>
              Aide contextuelle pour vous guider dans l'utilisation de l'application
            </Link>
          </li>
        </ul>
      </main>


      <GlowGridCanvas />
    </>
  );
}
