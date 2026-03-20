export type Announcement = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  imageUrl?: string | null;
  announcementCategoryName: string;
  studentNames?: string;
  studentCount?: number;
  totalStudents?: number;
  classroomNames?: string;
};
