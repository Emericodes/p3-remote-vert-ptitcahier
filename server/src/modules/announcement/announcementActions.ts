import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import joi from "joi";
import announcementImageUploadMiddleware from "../../middleware/upload";
import announcementCategoryRepository from "../announcementCategory/announcementCategoryRepository";
import studentRepository from "../student/studentRepository";
import announcementRepository from "./announcementRepository";

// 1. SCHÉMAS DE VALIDATION (Déclarés une seule fois)

const creationSchema = joi.object({
  title: joi.string().max(120).required(),
  content: joi.string().max(1000).required(),
  announcementCategoryId: joi.number().integer().positive().required(),
  studentIds: joi
    .array()
    .items(joi.number().integer().positive())
    .min(1)
    .required(),
});

const updateContentSchema = joi.object({
  content: joi.string().max(1000).required(),
});

// 2. CONTRÔLEURS (Actions principales)

const createAnnouncement: RequestHandler = async (req, res, next) => {
  try {
    const imageUrl = req.file
      ? `/uploads/announcements/${req.file.filename}`
      : undefined;
    const schoolId = Number(req.auth.sub);

    const announcementData = {
      title: req.body.title,
      content: req.body.content,
      announcementCategoryId: Number(req.body.announcementCategoryId),
      studentIds: req.body.studentIds,
    };

    const newInsertedAnnouncementId = await announcementRepository.create(
      announcementData,
      schoolId,
      imageUrl,
    );

    res.status(StatusCodes.CREATED).json({ newInsertedAnnouncementId });
  } catch (err) {
    next(err);
  }
};

const fetchParentAnnouncements: RequestHandler = async (req, res, next) => {
  try {
    const parentId = Number(req.auth.sub);
    const categoryId = req.query.category
      ? Number(req.query.category)
      : undefined;
    const studentId = req.query.student ? Number(req.query.student) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const announcements = await announcementRepository.readAllByParent(
      parentId,
      categoryId,
      studentId,
      limit,
    );
    res.json(announcements);
  } catch (err) {
    next(err);
  }
};

const fetchSchoolAnnouncements: RequestHandler = async (req, res, next) => {
  try {
    const schoolId = Number(req.auth.sub);
    const categoryId = req.query.category
      ? Number(req.query.category)
      : undefined;

    const announcements = await announcementRepository.readAllBySchool(
      schoolId,
      categoryId,
    );
    res.json(announcements);
  } catch (err) {
    next(err);
  }
};

const deleteAnnouncement: RequestHandler = async (req, res, next) => {
  try {
    const announcementId = Number(req.params.id);
    const schoolId = Number(req.auth.sub);

    if (!Number.isInteger(announcementId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Identifiant d'annonce invalide" });
      return;
    }

    const affectedRows = await announcementRepository.delete(
      announcementId,
      schoolId,
    );

    if (affectedRows === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Annonce introuvable ou non autorisée" });
      return;
    }

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (err) {
    next(err);
  }
};

const updateAnnouncementContent: RequestHandler = async (req, res, next) => {
  try {
    const announcementId = Number(req.params.id);
    const schoolId = Number(req.auth.sub);

    if (!Number.isInteger(announcementId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Identifiant d'annonce invalide" });
      return;
    }

    const updatedAnnouncementRows = await announcementRepository.updateContent(
      announcementId,
      req.body.content,
      schoolId,
    );

    if (updatedAnnouncementRows === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Annonce introuvable ou non autorisée" });
      return;
    }

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (err) {
    next(err);
  }
};

// 3. MIDDLEWARES DE SÉCURITÉ ET VALIDATION

const validateAnnouncementFormat: RequestHandler = async (req, res, next) => {
  try {
    // Étape 1 : Nettoyage pour FormData
    if (typeof req.body.studentIds === "string") {
      try {
        req.body.studentIds = JSON.parse(req.body.studentIds);
      } catch (parseError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Le format de la liste des étudiants est invalide" });
        return;
      }
    }

    // Étape 2 : Validation Joi
    const { error } = creationSchema.validate(req.body);
    if (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Les données envoyées sont incomplètes ou invalides" });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
};

const verifyDatabaseRelations: RequestHandler = async (req, res, next) => {
  try {
    const schoolId = Number(req.auth.sub);
    const categoryId = req.body.announcementCategoryId;
    const studentIds = req.body.studentIds;

    // Étape 1 : Vérifier si la catégorie existe
    const currentAnnouncementCategory =
      await announcementCategoryRepository.readById(categoryId);
    if (!currentAnnouncementCategory) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "La catégorie sélectionnée est introuvable" });
      return;
    }

    // Étape 2 : Vérifier si les étudiants existent et appartiennent bien à cette école
    for (const studentId of studentIds) {
      const currentStudent = await studentRepository.read(studentId);

      if (!currentStudent) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: `L'étudiant avec l'ID ${studentId} est introuvable` });
        return;
      }

      if (currentStudent.schoolId !== schoolId) {
        res
          .status(StatusCodes.UNPROCESSABLE_ENTITY)
          .json({ error: "Tentative d'ajout d'un étudiant d'une autre école" });
        return;
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};

const validateUpdateFormat: RequestHandler = async (req, res, next) => {
  try {
    const { error } = updateContentSchema.validate(req.body);

    if (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Le texte de l'annonce est invalide" });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
};

// EXPORTATION

export default {
  createAnnouncement,
  browseByParent: fetchParentAnnouncements,
  browseBySchool: fetchSchoolAnnouncements,
  deleteAnnouncement,
  updateAnnouncementContent,
  validateAnnouncementFormat,
  verifyDatabaseRelations,
  validateUpdateFormat,
  uploadImageMiddleware: announcementImageUploadMiddleware,
};
