import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Help.module.css";

export default function Help() {
  return (
    <>
      <Head>
        <title>NeuroTracker App – Aide & FAQ</title>
      </Head>

      <main className={styles.helpMain}>
        <header className={styles.header}>
          <h1><i className="far fa-question-circle"></i> Centre d’aide</h1>
          <p>Tout ce qu’il faut pour bien utiliser l’app.</p>
        </header>

        <section className={styles.faq}>
          <details className={styles.item} open>
            <summary className={styles.question}>
              Comment démarrer un enregistrement (Start) ?
            </summary>
            <div className={styles.answer}>
              <p>
                Appuie sur <strong>Start</strong>. L’app crée un enregistrement
                dans ta base locale <code>IndexedDB</code> avec l’heure de début
                <code>startTime</code> et <code>isRecording=true</code>. Le
                bouton passe en état <code>Stop</code>.
              </p>
            </div>
          </details>

          <details className={styles.item}>
            <summary className={styles.question}>
              Que se passe-t-il quand j’appuie sur Stop ?
            </summary>
            <div className={styles.answer}>
              <p>
                Le clic <code>Stop</code> ouvre la fiche pour compléter
                l’enregistrement&nbsp;: <em>zones</em>, <em>dates de début/fin</em>,{" "}
                <em>intensité</em>, <em>médicaments</em> et <em>notes</em>. À
                l’enregistrement, le record est mis à jour <code>isRecording=false</code> et la durée est calculée.
              </p>
            </div>
          </details>

          <details className={styles.item}>
            <summary className={styles.question}>
              Comment fonctionne la sélection des zones (Avant/Arrière) ?
            </summary>
            <div className={styles.answer}>
              <p>
                Clique sur les zones anatomiques pour les (dé)sélectionner. Le
                toggle <code>Avant/Arrière</code> change la vue. La liste
                des zones choisies apparaît sous le sélecteur.
              </p>
            </div>
          </details>

          <details className={styles.item}>
            <summary className={styles.question}>
              Comment régler l’intensité ?
            </summary>
            <div className={styles.answer}>
              <ul>
                <li>Glisse horizontalement ou clique n’importe où sur la barre.</li>
                <li>La valeur varie en continu <code>1 → 100</code> avec un léger effet d’inertie.</li>
                <li>La couleur et l’aura réagissent à l’intensité.</li>
              </ul>
            </div>
          </details>

          <details className={styles.item}>
            <summary className={styles.question}>
              Comment définir les dates de début/fin ?
            </summary>
            <div className={styles.answer}>
              <p>
                Les champs de date utilisent le sélecteur natif du navigateur
                <em>(mobile-friendly)</em>. L’affichage montre une version lisible
                <em>(lundi 14:32)</em>, et un tap ouvre le sélecteur. Par
                défaut, <em>Fin</em> prend l’heure actuelle à l’ouverture
                de la fiche.
              </p>
              <p>
                L’app travaille en heure locale et s’assure d’éviter les
                décalages de fuseau horaire.
              </p>
            </div>
          </details>

          <details className={styles.item}>
            <summary className={styles.question}>
              Comment ajouter des médicaments à un enregistrement ?
            </summary>
            <div className={styles.answer}>
              <p>
                Depuis la fiche, ajoute des entrées via <em>Ajouter un nouveau médicament</em>.
                Chaque médicament peut avoir une quantité <code>0–10</code>. Ils sont
                sauvegardés dans la liste globale et référencés dans chaque record.
              </p>
            </div>
          </details>

          <details className={styles.item}>
            <summary className={styles.question}>
              Comment enregistrer, annuler ou supprimer ?
            </summary>
            <div className={styles.answer}>
              <ul>
                <li>
                  <strong>Enregistrer</strong> met à jour le record existant avec toutes les infos
                  (fin, durée, intensité, zones, médicaments, notes) et remet l’état global
                  <code>isRecording=false</code>
                </li>
                <li>
                  <strong>Annuler</strong> réinitialise le formulaire, remet l’état global
                  et supprime l’éventuel record orphelin créé au démarrage.
                </li>
                <li>
                  Sur la page <em>Records</em>, clique un élément pour l’ouvrir : depuis la page
                  de détail tu peux <strong>modifier</strong> puis enregistrer, ou <strong>supprimer</strong>.
                </li>
              </ul>
            </div>
          </details>

          <details className={styles.item}>
            <summary className={styles.question}>
              Où sont stockées mes données ?
            </summary>
            <div className={styles.answer}>
              <p>
                Les données sont stockées en local dans <strong>IndexedDB</strong> via Dexie
                <code>base neurotrackerDB</code>. Tu conserves la maîtrise et la confidentialité
                en local (attention aux nettoyages de navigateur).
              </p>
            </div>
          </details>

          <details className={styles.item}>
            <summary className={styles.question}>
              Je vois un enregistrement « orphelin », que faire ?
            </summary>
            <div className={styles.answer}>
              <p>
                Si un record a été créé au <em>Start</em> puis tu as quitté sans valider, il
                peut rester. Utilise <strong>Annuler</strong> sur la fiche ou supprime-le depuis
                la page <em>Records</em>. Le flux actuel supprime automatiquement l’orphelin
                quand tu annules.
              </p>
            </div>
          </details>

          <details className={styles.item}>
            <summary className={styles.question}>
              Pourquoi le bouton Enregistrer est parfois désactivé ?
            </summary>
            <div className={styles.answer}>
              <p>
                Le formulaire valide en direct : il faut un début, une fin, au
                moins une zone, une intensité entre 1 et 100, et une cohérence
                temporelle (fin ≥ début). Tant que ces conditions ne sont pas
                réunies, le bouton reste désactivé.
              </p>
            </div>
          </details>

          <details className={styles.item}>
            <summary className={styles.question}>
              Comment accéder / modifier un enregistrement plus tard ?
            </summary>
            <div className={styles.answer}>
              <p>
                Va dans <Link href="/records">Records</Link>, clique sur un
                élément pour ouvrir la page détaillée (même design que la
                création), modifie ce que tu veux puis clique <strong>Enregistrer</strong>.
              </p>
            </div>
          </details>

          <details className={styles.item}>
            <summary className={styles.question}>
              Y a-t-il une exportation des données ?
            </summary>
            <div className={styles.answer}>
              <p>
                Oui, va dans <Link href="/settings">Paramètres</Link> et clique sur <strong>Exporter les données</strong>.
              </p>
            </div>
          </details>

          <details className={styles.item}>
            <summary className={styles.question}>
              Comment synchroniser mes données avec un autre appareil ?
            </summary>
            <div className={styles.answer}>
              <p>
                Tu peux synchroniser tes données entre plusieurs appareils en accédant à la
                page <Link href="/settings">Paramètres</Link> et en cliquant sur <strong>Synchroniser les données</strong>.
                Cela te permettra de transférer tes enregistrements vers un autre appareil.
              </p>
            </div>
          </details>

        </section>
      </main>
    </>
  );
}
