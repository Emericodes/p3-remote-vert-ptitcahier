import express from "express";
import announcementActions from "./modules/announcement/announcementActions";
import announcementCategoryActions from "./modules/announcementCategory/announcementCategoryActions";
import authActions from "./modules/auth/authActions";
import classroomActions from "./modules/classroom/classroomActions";
import parentActions from "./modules/parent/parentActions";
import schoolActions from "./modules/school/schoolActions";
import studentActions from "./modules/student/studentActions";
import ticketActions from "./modules/ticket/ticketActions";
import ticketCategoryActions from "./modules/ticketCategory/ticketCategoryActions";
import userActions from "./modules/user/userActions";

const router = express.Router();

router.post("/login", authActions.login);

router.post(
  "/register/school",
  schoolActions.validate,
  authActions.hashPassword,
  userActions.add,
  schoolActions.add,
  classroomActions.add,
);

router.use(authActions.verifyToken);

router.get("/ticket-categories", ticketCategoryActions.browseAll);
router.get("/announcement-categories", announcementCategoryActions.browseAll);

const parentRouter = express.Router();
parentRouter.use(authActions.verifyRole("parent"));

const schoolRouter = express.Router();
schoolRouter.use(authActions.verifyRole("school"));

parentRouter.get("/me/school", schoolActions.browseByParent);
parentRouter.get("/me/announcements", announcementActions.browseByParent);
parentRouter.get("/me/students", studentActions.browseByParent);
parentRouter.get("/me/tickets", ticketActions.browseByParent);
parentRouter.post("/tickets", ticketActions.validate, ticketActions.add);

schoolRouter.get("/me", schoolActions.browseBySchool);
schoolRouter.get("/me/tickets", ticketActions.browseBySchool);
schoolRouter.get("/me/announcements", announcementActions.browseBySchool);
schoolRouter.get("/me/students", studentActions.browseBySchool);
schoolRouter.get("/me/parents", parentActions.browseBySchool);
schoolRouter.get("/me/classrooms", classroomActions.browseBySchool);
schoolRouter.post(
  "/me/announcements",
  announcementActions.uploadImageMiddleware.single("image"),
  announcementActions.validateAnnouncementFormat,
  announcementActions.verifyDatabaseRelations,
  announcementActions.createAnnouncement,
);
schoolRouter.delete(
  "/me/announcements/:id",
  announcementActions.deleteAnnouncement,
);
schoolRouter.put(
  "/me/announcements/:id",
  announcementActions.validateUpdateFormat,
  announcementActions.updateAnnouncementContent,
);
schoolRouter.patch("/tickets/:id/status", ticketActions.editStatus);
schoolRouter.post("/me/students", studentActions.validate, studentActions.add);
schoolRouter.delete("/me/students/:id", studentActions.destroy);
schoolRouter.put(
  "/me/students/:id",
  studentActions.validate,
  studentActions.update,
);
// schoolRouter.post("/me/parents", parentActions.validate, parentActions.add);
// schoolRouter.post("/me/parents", parentActions.add);
schoolRouter.delete("/me/parents/:id", parentActions.destroy);
schoolRouter.put(
  "/me/parents/:id",
  parentActions.validate,
  parentActions.update,
);

router.use("/parents", parentRouter);
router.use("/schools", schoolRouter);

export default router;
