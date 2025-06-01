export type Video = {
  id: string;
  duration: number;
  fileSize: number;
  link: string;
  youtubeLink: string;
  title: string;
  thumbnail: string | null;
  starred: boolean;
  rating: number;
};
