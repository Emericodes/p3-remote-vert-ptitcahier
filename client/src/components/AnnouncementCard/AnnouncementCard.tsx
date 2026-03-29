import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { Announcement } from "../../types/Announcement";
import type { OutletAuthContext } from "../../types/OutletAuthContext";
import AnnouncementContentTextarea from "../AnnouncementContentTextarea/AnnouncementContentTextarea";
import styles from "./AnnouncementCard.module.css";

function extractStudentNamesList(studentNamesString?: string): string[] {
  if (!studentNamesString) return [];
  return studentNamesString.split(",").map((name) => name.trim());
}

function calculateClassroomDistribution(classroomNamesString?: string) {
  if (!classroomNamesString) return [];
  const classroomNamesArray = classroomNamesString
    .split(",")
    .map((name) => name.trim());
  const distributionMap: Record<string, number> = {};
  for (const name of classroomNamesArray) {
    distributionMap[name] = (distributionMap[name] || 0) + 1;
  }
  return Object.keys(distributionMap).map((name) => ({
    name: name,
    count: distributionMap[name],
  }));
}

function getBadgeStyleForCategory(categoryName: string): string {
  switch (categoryName) {
    case "Vie de l'école":
      return styles.an_badge_school_life;
    case "Administratif":
      return styles.an_badge_admin;
    case "Evénement":
      return styles.an_badge_event;
    case "Classe":
      return styles.an_badge_class;
    default:
      return styles.an_badge_default;
  }
}

type AnnouncementCardProps = {
  announcement: Announcement;
  variant?: "default" | "dashboard";
  onDelete?: (announcementId: number) => void | Promise<void>;
  onEdit?: (
    announcementId: number,
    nextContent: string,
  ) => boolean | Promise<boolean>;
};

function AnnouncementCard({
  announcement,
  variant = "default",
  onDelete,
  onEdit,
}: AnnouncementCardProps) {
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isEditModeActive, setIsEditModeActive] = useState(false);
  const [editableAnnouncementText, setEditableAnnouncementText] = useState(
    announcement.content,
  );

  const imageDialogReference = useRef<HTMLDialogElement>(null);
  const { auth } = useOutletContext<OutletAuthContext>();
  const backendServerUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const currentDialog = imageDialogReference.current;
    if (!currentDialog) return;
    if (isImageZoomed) {
      currentDialog.showModal();
    } else {
      currentDialog.close();
    }
  }, [isImageZoomed]);

  const closeModalWithBackgroundClick = (event: React.MouseEvent) => {
    if (event.target === imageDialogReference.current) setIsImageZoomed(false);
  };

  const closeModalWithKeyboard = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") setIsImageZoomed(false);
  };

  useEffect(() => {
    if (!isEditModeActive) setEditableAnnouncementText(announcement.content);
  }, [announcement.content, isEditModeActive]);

  const enableEditMode = () => setIsEditModeActive(true);
  const discardEditChanges = () => {
    setIsEditModeActive(false);
    setEditableAnnouncementText(announcement.content);
  };

  const submitUpdatedAnnouncementText = async () => {
    if (!onEdit) return;
    const cleanedText = editableAnnouncementText.trim();
    if (
      cleanedText.length === 0 ||
      cleanedText === announcement.content.trim()
    ) {
      setIsEditModeActive(false);
      return;
    }
    const isUpdateSuccessful = await onEdit(announcement.id, cleanedText);
    if (isUpdateSuccessful !== false) setIsEditModeActive(false);
  };

  const confirmAndDelete = () => {
    if (
      window.confirm(
        `Voulez-vous vraiment supprimer l'annonce "${announcement.title}" ?`,
      )
    ) {
      onDelete?.(announcement.id);
    }
  };

  const formattedPublicationDate = new Date(
    announcement.createdAt,
  ).toLocaleString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const parsedStudentNamesList = extractStudentNamesList(
    announcement.studentNames,
  );
  const classroomDistributionList = calculateClassroomDistribution(
    announcement.classroomNames,
  );
  const isSchoolUser = auth?.role === "school";
  const isParentUser = auth?.role === "parent";
  const isAuthorizedToDelete = isSchoolUser && typeof onDelete === "function";
  const isAuthorizedToEdit = isSchoolUser && typeof onEdit === "function";

  return (
    <article
      className={`${styles.ann_card} ${variant === "dashboard" ? styles.card_dashboard : ""}`}
      aria-labelledby={`title-${announcement.id}`}
    >
      <section className={styles.content_card}>
        <div className={styles.media_block}>
          <header>
            <h2 id={`title-${announcement.id}`} className={styles.title}>
              {announcement.title}
            </h2>
          </header>

          {announcement.imageUrl && (
            <button
              type="button"
              className={styles.imageTrigger}
              onClick={() => setIsImageZoomed(true)}
              aria-haspopup="dialog"
              aria-label={`Agrandir l'image de l'annonce : ${announcement.title}`}
            >
              <img
                src={`${backendServerUrl}${announcement.imageUrl}`}
                alt={`Illustration : ${announcement.title}`}
                className={styles.mainImage}
              />
            </button>
          )}
        </div>

        {isEditModeActive ? (
          <div className={styles.edit_block}>
            <AnnouncementContentTextarea
              ariaLabel={`Modifier le texte de l'annonce : ${announcement.title}`}
              value={editableAnnouncementText}
              onChange={setEditableAnnouncementText}
            />
            <div className={styles.edit_actions}>
              <button
                type="button"
                className="non-primary-button"
                onClick={discardEditChanges}
              >
                Annuler
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={submitUpdatedAnnouncementText}
                disabled={editableAnnouncementText.trim().length === 0}
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        ) : (
          <p className={styles.text}>{announcement.content}</p>
        )}

        <footer className={styles.footerInfo}>
          {(isAuthorizedToEdit || isAuthorizedToDelete) &&
            !isEditModeActive && (
              <div className={styles.footer_actions}>
                {isAuthorizedToEdit && (
                  <button
                    type="button"
                    className={styles.edit_button}
                    onClick={enableEditMode}
                    aria-label={`Modifier l'annonce : ${announcement.title}`}
                  >
                    <Pencil className={styles.edit_icon} aria-hidden="true" />
                    <span className={styles.edit_label}>Modifier</span>
                  </button>
                )}
                {isAuthorizedToDelete && (
                  <button
                    type="button"
                    className={styles.delete_button}
                    onClick={confirmAndDelete}
                    aria-label={`Supprimer l'annonce : ${announcement.title}`}
                  >
                    <Trash2 className={styles.delete_icon} aria-hidden="true" />
                    <span className={styles.delete_label}>Supprimer</span>
                  </button>
                )}
              </div>
            )}
          <time
            className={styles.dateLabel}
            dateTime={new Date(announcement.createdAt).toISOString()}
          >
            Publié le {formattedPublicationDate}
          </time>
        </footer>
      </section>

      {variant !== "dashboard" && (
        <aside className={styles.badgeSidebar}>
          <span
            className={getBadgeStyleForCategory(
              announcement.announcementCategoryName,
            )}
          >
            {announcement.announcementCategoryName}
          </span>
          {isSchoolUser && (
            <ul className={styles.tagList}>
              {(announcement.totalStudents || 0) > 0 &&
              (announcement.studentCount || 0) >=
                (announcement.totalStudents || 0) - 2 ? (
                <li className={styles.an_badge_all_school}>
                  Toutes les classes
                </li>
              ) : (announcement.studentCount || 0) > 5 ? (
                <>
                  {classroomDistributionList.map((classroom) => (
                    <li key={classroom.name} className={styles.an_badge_class}>
                      {classroom.name} ({classroom.count})
                    </li>
                  ))}
                  <li className={styles.an_count_tag}>
                    Total élèves: {announcement.studentCount}
                  </li>
                </>
              ) : (
                parsedStudentNamesList.map((studentName) => (
                  <li key={studentName} className={styles.an_student_tag}>
                    {studentName}
                  </li>
                ))
              )}
            </ul>
          )}

          {isParentUser && parsedStudentNamesList.length > 0 && (
            <ul className={styles.tagList}>
              {parsedStudentNamesList.map((studentName) => (
                <li key={studentName} className={styles.an_student_tag}>
                  {studentName}
                </li>
              ))}
            </ul>
          )}
        </aside>
      )}

      {announcement.imageUrl && (
        <dialog
          ref={imageDialogReference}
          className={styles.imageModal}
          onClick={closeModalWithBackgroundClick}
          onKeyDown={closeModalWithKeyboard}
          aria-label="Aperçu de l'image en plein écran"
        >
          <div className={styles.modalWrapper}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsImageZoomed(false)}
              aria-label="Fermer l'image"
            >
              &times;
            </button>
            <img
              src={`${backendServerUrl}${announcement.imageUrl}`}
              alt={`Vue agrandie : ${announcement.title}`}
              className={styles.fullSizeImage}
            />
          </div>
        </dialog>
      )}
    </article>
  );
}

export default AnnouncementCard;
