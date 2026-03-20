import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import AnnouncementContentTextarea, {
  MAX_ANNOUNCEMENT_CONTENT_LENGTH,
} from "../../components/AnnouncementContentTextarea/AnnouncementContentTextarea";
import FilterStudent from "../../components/FilterStudents/FilterStudent";
import type { AnnouncementCategory } from "../../types/AnnouncementCategory";
import type { AnnouncementNew } from "../../types/AnnouncementNew";
import type { Classroom } from "../../types/Classroom";
import type { Student } from "../../types/Student";
import CategoryFormButton from "../CategoryFormButton/CategoryFormButton";
import ImageUploader from "../ImageUploader/ImageUploader";
import styles from "./AnnouncementForm.module.css";

// FONCTIONS UTILITAIRES (Hors du composant pour l'alléger)

function normalizeText(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

function addUniqueIds(currentIds: number[], idsToAdd: number[]) {
  const nextIds = [...currentIds];
  for (const id of idsToAdd) {
    if (!nextIds.includes(id)) {
      nextIds.push(id);
    }
  }
  return nextIds;
}

function removeIds(currentIds: number[], idsToRemove: number[]) {
  if (idsToRemove.length === 0) return currentIds;
  return currentIds.filter((id) => !idsToRemove.includes(id));
}

// TYPES

type AnnouncementFormProps = {
  announcementCategories: AnnouncementCategory[];
  classrooms: Classroom[];
  students: Student[];
  onSubmit: (announcement: AnnouncementNew) => void;
  isSubmitting: boolean;
};

// COMPOSANT PRINCIPAL

function AnnouncementForm({
  announcementCategories,
  classrooms,
  students,
  onSubmit,
  isSubmitting = false,
}: AnnouncementFormProps) {
  // --- 1. ÉTATS (STATE) ---
  const navigate = useNavigate();
  const [announcementText, setAnnouncementText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // États pour la sélection finale des élèves
  const [selectedClassroomIds, setSelectedClassroomIds] = useState<number[]>(
    [],
  );
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  // États pour la modale de filtre (brouillon avant validation)
  const [draftClassroomIds, setDraftClassroomIds] = useState<number[]>([]);
  const [draftStudentIds, setDraftStudentIds] = useState<number[]>([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [isStudentSearchModalOpen, setIsStudentSearchModalOpen] =
    useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [showValidationWarning, setShowValidationWarning] = useState(false);

  // --- 2. LOGIQUE DE GROUPEMENT ET RECHERCHE ---
  const studentsGroupedByClassroom = useMemo(() => {
    const map: Record<number, Student[]> = {};
    for (const student of students) {
      if (!map[student.classroomId]) {
        map[student.classroomId] = [];
      }
      map[student.classroomId].push(student);
    }
    return (classroomId: number) => map[classroomId] ?? [];
  }, [students]);

  const hideWarning = () => {
    if (showValidationWarning) setShowValidationWarning(false);
  };

  const getClassroomNameById = (classroomId: number) => {
    const classroom = classrooms.find((c) => c.id === classroomId);
    return classroom?.name ?? "Classe inconnue";
  };

  const getStudentById = (studentId: number) => {
    return students.find((s) => s.id === studentId);
  };

  // --- 3. GESTION DE LA MODALE ---
  const openFilterModal = () => {
    setDraftClassroomIds(selectedClassroomIds);
    setDraftStudentIds(selectedStudentIds);
    setStudentSearchQuery("");
    setIsStudentSearchModalOpen(false);
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
    setStudentSearchQuery("");
    setIsStudentSearchModalOpen(false);
  };

  const confirmFilterSelection = () => {
    setSelectedClassroomIds(draftClassroomIds);
    setSelectedStudentIds(draftStudentIds);
    closeFilterModal();
    hideWarning();
  };

  // --- 4. ACTIONS SUR LES FILTRES (Dans la modale) ---
  const toggleClassroomInDraft = (classroomId: number) => {
    const isAlreadySelected = draftClassroomIds.includes(classroomId);
    const classroomStudentIds = studentsGroupedByClassroom(classroomId).map(
      (s) => s.id,
    );

    if (isAlreadySelected) {
      setDraftClassroomIds((prev) => prev.filter((id) => id !== classroomId));
      setDraftStudentIds((prev) => removeIds(prev, classroomStudentIds));
    } else {
      setDraftClassroomIds((prev) => [...prev, classroomId]);
      setDraftStudentIds((prev) => addUniqueIds(prev, classroomStudentIds));
    }
  };

  const toggleStudentInDraft = (studentId: number) => {
    setDraftStudentIds((prev) => {
      if (prev.includes(studentId))
        return prev.filter((id) => id !== studentId);
      return [...prev, studentId];
    });
  };

  const removeClassroomFromFinalSelection = (classroomId: number) => {
    setSelectedClassroomIds((prev) => prev.filter((id) => id !== classroomId));
    const classroomStudentIds = studentsGroupedByClassroom(classroomId).map(
      (s) => s.id,
    );
    setSelectedStudentIds((prev) => removeIds(prev, classroomStudentIds));
  };

  const removeStudentFromFinalSelection = (studentId: number) => {
    setSelectedStudentIds((prev) => prev.filter((id) => id !== studentId));
  };

  // --- 5. RECHERCHE ÉTUDIANT (Barre de recherche) ---
  const doesStudentMatchSearch = (student: Student, searchValue: string) => {
    const classroomName =
      student.classroomName ?? getClassroomNameById(student.classroomId);
    const fullName = `${student.firstName} ${student.lastName}`;
    const searchTarget = [fullName, classroomName]
      .map((item) => normalizeText(item))
      .join(" ");
    return searchTarget.includes(searchValue);
  };

  const normalizedSearchQuery = normalizeText(studentSearchQuery);
  const searchResults =
    normalizedSearchQuery.length === 0
      ? []
      : students.filter((student) =>
          doesStudentMatchSearch(student, normalizedSearchQuery),
        );

  const selectStudentFromSearchAndClose = (studentId: number) => {
    setDraftStudentIds((prev) =>
      prev.includes(studentId) ? prev : [...prev, studentId],
    );
    setStudentSearchQuery("");
    setIsStudentSearchModalOpen(false);
  };

  // --- 6. PRÉPARATION DU RÉSUMÉ VISUEL ---
  const fullySelectedClassroomsForSummary = selectedClassroomIds.filter(
    (classroomId) => {
      const studentsInClass = studentsGroupedByClassroom(classroomId);
      if (studentsInClass.length === 0) return false;
      return studentsInClass.every((student) =>
        selectedStudentIds.includes(student.id),
      );
    },
  );

  const individualStudentsForSummary = (
    selectedStudentIds.map((id) => getStudentById(id)) as Student[]
  ).filter(
    (student) =>
      student &&
      !fullySelectedClassroomsForSummary.includes(student.classroomId),
  );

  const draftStudentsForModal = draftStudentIds
    .map((id) => getStudentById(id))
    .filter((student): student is Student => student !== undefined);

  // --- 7. SOUMISSION DU FORMULAIRE ---
  const submitAnnouncementForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const title = (formData.get("title") as string).trim();
    const announcementCategoryId = Number(
      formData.get("announcementCategoryId"),
    );
    const cleanedText = announcementText.trim();

    if (
      !title ||
      cleanedText.length === 0 ||
      !Number.isInteger(announcementCategoryId) ||
      announcementCategoryId <= 0 ||
      selectedStudentIds.length === 0
    ) {
      setShowValidationWarning(true);
      return;
    }

    // On passe toutes les infos
    onSubmit({
      title: title,
      content: cleanedText,
      announcementCategoryId: announcementCategoryId,
      studentIds: selectedStudentIds,
      image: selectedImage ?? undefined,
    });
  };

  // RENDU VISUEL (JSX)

  return (
    <>
      <form className={styles.form} onSubmit={submitAnnouncementForm}>
        <h1 className="primary-title">Nouvelle Annonce</h1>
        <p className={styles.form_instructions}>
          Choisissez un motif, sélectionnez les élèves concernés, puis rédigez
          votre annonce.
        </p>

        <div className={styles.fieldset_title}>
          <label htmlFor="title" className={styles.form_label}>
            Titre* :
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={styles.text_input}
            onChange={hideWarning}
            aria-required="true"
          />
        </div>

        <fieldset className={styles.fieldset_categories}>
          <legend className={styles.form_label}>Motif de l'annonce* :</legend>
          <ul>
            {announcementCategories.map((category) => (
              <li key={category.id}>
                <CategoryFormButton
                  category={category}
                  formName="announcementCategoryId"
                  onChange={hideWarning}
                />
              </li>
            ))}
          </ul>
        </fieldset>

        <div className={styles.filter_section}>
          <div className={styles.filter_row}>
            <span className={styles.form_label}>Élèves concernés* :</span>
            <button
              type="button"
              className="primary-button"
              onClick={openFilterModal}
            >
              Sélectionner les élèves
            </button>
          </div>

          <div
            className={styles.selection_summary}
            aria-label="Élèves sélectionnés"
          >
            <div className={styles.chip_row}>
              {fullySelectedClassroomsForSummary.map((classroomId) => (
                <span key={classroomId} className={styles.summary_chip}>
                  {getClassroomNameById(classroomId)}
                  <button
                    type="button"
                    className={styles.chip_remove}
                    aria-label={`Retirer la classe ${getClassroomNameById(classroomId)}`}
                    onClick={() =>
                      removeClassroomFromFinalSelection(classroomId)
                    }
                  >
                    {"\u00d7"}
                  </button>
                </span>
              ))}

              {individualStudentsForSummary.map((student) => (
                <span key={student.id} className={styles.summary_chip}>
                  {student.firstName} {student.lastName} (
                  {getClassroomNameById(student.classroomId)})
                  <button
                    type="button"
                    className={styles.chip_remove}
                    aria-label={`Retirer ${student.firstName} ${student.lastName}`}
                    onClick={() => removeStudentFromFinalSelection(student.id)}
                  >
                    {"\u00d7"}
                  </button>
                </span>
              ))}

              {fullySelectedClassroomsForSummary.length === 0 &&
                individualStudentsForSummary.length === 0 && (
                  <span className={styles.summary_empty}>
                    Sélectionnez au moins un élève.
                  </span>
                )}
            </div>
          </div>
        </div>

        <fieldset className={styles.fieldset_message}>
          <legend className={styles.form_label}>Message* :</legend>
          <AnnouncementContentTextarea
            id="content"
            name="content"
            ariaRequired
            maxLength={MAX_ANNOUNCEMENT_CONTENT_LENGTH}
            placeholder="Écrivez votre annonce"
            value={announcementText}
            onChange={(nextValue) => {
              setAnnouncementText(nextValue);
              hideWarning();
            }}
          />
        </fieldset>

        <ImageUploader onImageSelected={setSelectedImage} />

        <div className={styles.ticket_buttons_container}>
          <button
            onClick={() => navigate("/school/announcements")}
            type="button"
            className="non-primary-button"
          >
            Retourner aux annonces
          </button>
          <button
            type="submit"
            className="primary-button"
            disabled={showValidationWarning || isSubmitting}
          >
            Publier
          </button>
        </div>

        {showValidationWarning && (
          <p className={styles.warning} role="alert" aria-live="polite">
            Veuillez remplir tous les champs obligatoires (indiqués par *).
          </p>
        )}
      </form>

      <FilterStudent
        isFilterOpen={isFilterModalOpen}
        classrooms={classrooms}
        filterSelectedClassroom={draftClassroomIds}
        togglefilterClassroom={toggleClassroomInDraft}
        studentSearch={studentSearchQuery}
        setStudentSearch={setStudentSearchQuery}
        setIsStudentSearchOpen={setIsStudentSearchModalOpen}
        isStudentSearchOpen={isStudentSearchModalOpen}
        studentSearchResults={searchResults}
        filterSelectedStudent={draftStudentIds}
        selectStudentFromSearch={selectStudentFromSearchAndClose}
        getClassroomName={getClassroomNameById}
        filterSelectedStudents={draftStudentsForModal}
        togglefilterStudent={toggleStudentInDraft}
        closeFilterModal={closeFilterModal}
        applyFilterModal={confirmFilterSelection}
      />
    </>
  );
}

export default AnnouncementForm;
