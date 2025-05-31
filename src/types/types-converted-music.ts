export type Music = {
  id: string;
  duration: number;
  fileSize: number;
  link: string;
  youtubeLink: string;
  title: string;
  thumbnail: string | null;
  starred: boolean;
  rating: number | null;
  expiresAt: number;
  addedAt: number;
};
