import axios from "axios";
import { youtube_parser } from "./parse-music-url";
import { Music } from "../types/types-converted-music";
import { getYouTubeThumbnail } from "./get-music-thumbnail";
import { notify } from "../stores/shared/notification";
import { animateTo } from "../stores/shared/button-state";
import { uycmusic } from "../stores/user/music-list";
import { email } from "../stores/user/user-state";
import { converted } from "../stores/shared/converted-song";

type ConvertToMP3Props = {
  youtubeLinkRef: React.RefObject<string>;
  id: string;
  resetInput: () => void;
};

export async function ConvertToMP3(props: ConvertToMP3Props) {
  const { default: before, error: failed, pending, success } = animateTo(props.id);

  if (props.youtubeLinkRef.current.trim() === "") {
    notify.error("Link can not be empty", 1000);
    failed();
    before();
    return false;
  }

  const youtubeId = youtube_parser(props.youtubeLinkRef.current);
  if (!youtubeId) {
    notify.error("Please enter valid YouTube link", 1500);
    failed();
    before();
    return false;
  }

  try {
    console.log("Requesting conversion for YouTube ID:", youtubeId);
    pending();
    const options = {
      method: "GET",
      url: "https://youtube-mp36.p.rapidapi.com/dl",
      params: { id: youtubeId },
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_RAPID_API_KEY,
        "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
      },
    };
    const response = await axios.request(options);
    if (!response.data.link && response.data.link === "") {
      failed();
      before();
      notify.error("No download link found, please try again later", 2500);
      return false;
    }
    // const headers = response.headers;
    // const remainingLimit = headers["x-ratelimit-request-remaining"];
    // const dailyLimit = headers["x-ratelimit-request-limit"];
    const music: Music = {
      id: youtubeId,
      starred: false,
      duration: response.data.duration,
      fileSize: response.data.filesize,
      link: response.data.link,
      youtubeLink: props.youtubeLinkRef.current,
      title: response.data.title,
      thumbnail: getYouTubeThumbnail(youtubeId),
      rating: 0,
      expiresAt: Date.now() + 43200000,
      addedAt: Date.now(),
    };

    if (email.state()) {
      uycmusic.save(music);
    }
    converted.add(music);
    props.resetInput();
    success();
    before();
    notify.success("Link has been converted successfully", 2500);
    return true;
  } catch (error) {
    notify.error("Failed to convert", 1500);
    failed();
    before();
    console.log(error);
    return false;
  }
}
