import { Link, useNavigate } from "react-router";
import styles from "./PublicHome.module.css";

import icon_journal from "../../assets/images/icon_journal.png";
import icon_mobil from "../../assets/images/icon_mobil.png";
import icon_parent from "../../assets/images/icon_parent.png";
import ptit_cahier_logo_original from "../../assets/images/ptit_cahier_logo_original.png";
import Smartphone from "../../assets/images/smartphone.png";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string | React.ReactNode;
  customClass?: string;
}

const FeatureItem = ({
  title,
  description,
  icon,
  customClass,
}: FeatureCardProps) => (
  <article className={styles.featureCard}>
    <div className={styles.featureIconContainer} aria-hidden="true">
      {typeof icon === "string" && icon.length < 5 ? (
        <span className={styles.emojiIcon}>{icon}</span>
      ) : (
        <img
          src={icon as string}
          alt=""
          className={`${styles.iconImage} ${customClass ? styles[customClass] : ""}`}
        />
      )}
    </div>
    <h3 className="card-title">{title}</h3>
    <p className="text">{description}</p>
  </article>
);
export default function PublicHome() {
  const navigate = useNavigate();

  const schoolFeatures = [
    {
      id: 1,
      title: "Le Journal de Vie",
      description:
        "Ne manquez plus aucun moment fort. Visualisez les photos des sorties et les projets de classe.",
      icon: icon_journal,
      customClass: "journal-vie-img",
    },
    {
      id: 2,
      title: "Communication en un Clic",
      description:
        "Signalez une absence ou demandez une autorisation depuis votre mobile en quelques secondes.",
      icon: icon_parent,
      customClass: "icon-parent-img",
    },
    {
      id: 3,
      title: "Fil Personnalisé",
      description:
        "Une vue unique par enfant pour ne jamais mélanger les informations importantes.",
      icon: icon_mobil,
      customClass: "emoji-icon",
    },
  ];

  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <main className={styles.landingContainer}>
      <header className={styles.heroSection}>
        <div className={styles.logoContainer}>
          <img
            src={ptit_cahier_logo_original}
            alt="Retour à l'accueil Le P'tit Cahier"
            className={styles.logo}
          />
        </div>

        <div className={styles.heroContent}>
          <section className={styles.heroTextGroup}>
            <h1 className={`primary-title ${styles.mainTitle}`}>
              Le trait d'union numérique entre l'établissement et la famille.
            </h1>
            <p className={`text ${styles.heroSubtitle}`}>
              Digitaliser sans déshumaniser : vivez l'école de vos enfants en
              toute sérénité.
            </p>

            <div className={styles.actionGroup}>
              <button
                type="button"
                className="primary-button"
                onClick={redirectToLogin}
                aria-label="Accéder au test de l'application"
              >
                Connexion
              </button>
              <Link
                to="/register"
                className="non-primary-button"
                aria-label="Créer un compte"
              >
                Enregistrer mon école
              </Link>
            </div>
          </section>

          <aside className={styles.smartphoneWrapper}>
            <img
              src={Smartphone}
              alt="Interface mobile de l'application affichant le fil d'actualité scolaire"
              className={styles.smartphoneImage}
            />
          </aside>
        </div>
      </header>

      <section
        className={styles.benefitsSection}
        aria-labelledby="benefits-title"
      >
        <h2 id="benefits-title" className={`card-title ${styles.sectionTitle}`}>
          Pourquoi vous allez l'adorer
        </h2>
        <div className={styles.featuresGrid}>
          {schoolFeatures.map((feature) => (
            <FeatureItem
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              customClass={feature.customClass}
            />
          ))}
        </div>
      </section>

      <footer className={styles.securityFooter}>
        <div className={styles.copyrightText}>
          <p className="text">
            © 2026 Team P'tit Cahier - Tous droits réservés
          </p>
          <p className={`text ${styles.studentProjectBadge}`}>
            Projet Étudiant
          </p>
        </div>
      </footer>
    </main>
  );
}
