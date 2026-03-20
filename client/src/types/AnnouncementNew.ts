export type AnnouncementNew = {
  title: string;
  content: string;
  announcementCategoryId: number;
  studentIds: number[];
  image?: File;
};
