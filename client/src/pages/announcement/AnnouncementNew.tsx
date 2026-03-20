import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import AnnouncementForm from "../../components/AnnouncementForm/AnnouncementForm";
import type { AnnouncementCategory } from "../../types/AnnouncementCategory";
import type { AnnouncementNew as AnnouncementNewType } from "../../types/AnnouncementNew"; // Ajout de l'import
import type { Classroom } from "../../types/Classroom";
import type { OutletAuthContext } from "../../types/OutletAuthContext";
import type { Student } from "../../types/Student";
import styles from "./AnnouncementNew.module.css";

function AnnouncementNew() {
  const [announcementCategories, setAnnouncementCategories] = useState<
    AnnouncementCategory[]
  >([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [formSent, setFormSent] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingError, setLoadingError] = useState<boolean>(false);

  const navigate = useNavigate();
  const { auth } = useOutletContext<OutletAuthContext>();

  useEffect(() => {
    const headers = { Authorization: `Bearer ${auth?.token}` };

    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/announcement-categories`, {
        headers,
      }).then((res) => {
        if (!res.ok) {
          setLoadingError(true);
          return;
        }
        return res.json();
      }),

      fetch(`${import.meta.env.VITE_API_URL}/api/schools/me/students`, {
        headers,
      }).then((res) => {
        if (!res.ok) {
          setLoadingError(true);
          return;
        }
        return res.json();
      }),
    ]).then(([fetchedCategories, fetchedStudents]) => {
      if (!fetchedCategories || !fetchedStudents) return;
      setAnnouncementCategories(fetchedCategories);
      setStudents(fetchedStudents);
    });
  }, [auth]);

  const classrooms = (): Classroom[] => {
    const classroomsById = new Map<number, string>();

    for (const student of students) {
      if (!classroomsById.has(student.classroomId)) {
        classroomsById.set(student.classroomId, student.classroomName);
      }
    }

    return Array.from(classroomsById.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.id - b.id);
  };

  const submitNewAnnouncement = (newAnnouncement: AnnouncementNewType) => {
    setIsSubmitting(true);
    setError(null);

    // Création du format d'envoi spécial pour les fichiers
    const formData = new FormData();
    formData.append("title", newAnnouncement.title);
    formData.append("content", newAnnouncement.content);
    formData.append(
      "announcementCategoryId",
      String(newAnnouncement.announcementCategoryId),
    );

    formData.append("studentIds", JSON.stringify(newAnnouncement.studentIds));

    if (newAnnouncement.image) {
      formData.append("image", newAnnouncement.image);
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/schools/me/announcements`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
      body: formData,
    })
      .then((response) => response.ok)
      .then((isSuccess) => {
        if (!isSuccess) {
          setError("Une erreur est survenue. Veuillez renvoyer votre demande.");
        }
        setFormSent(true);
        setIsSubmitting(false);
      })
      .catch(() => {
        // Sécurité supplémentaire en cas de coupure internet
        setError(
          "Impossible de contacter le serveur. Vérifiez votre connexion.",
        );
        setFormSent(true);
        setIsSubmitting(false);
      });
  };

  return (
    <main className="school-background">
      {formSent ? (
        <div className={styles.confirmation_form}>
          {error ? <p>{error}</p> : <p>Votre annonce a bien été envoyée !</p>}
          <div className={styles.ticket_buttons_container}>
            <button
              onClick={() => navigate("/school/announcements")}
              type="button"
              className="non-primary-button"
            >
              Retourner aux annonces
            </button>
            <button
              onClick={() => {
                setFormSent(false);
                setError(null);
              }}
              type="button"
              className="primary-button"
            >
              Nouvelle annonce
            </button>
          </div>
        </div>
      ) : loadingError ? (
        <p className="general_error_message">
          Échec de la chargement du formulaire
        </p>
      ) : (
        <AnnouncementForm
          announcementCategories={announcementCategories}
          classrooms={classrooms()}
          students={students}
          isSubmitting={isSubmitting}
          onSubmit={submitNewAnnouncement}
        />
      )}
    </main>
  );
}

export default AnnouncementNew;
