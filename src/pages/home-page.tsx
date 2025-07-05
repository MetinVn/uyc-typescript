import { useState } from "react";
import { useUser } from "../contexts/context-user";
import { ConvertToMP3 } from "../utils/convert-to-mp3";
import { GuestProfile } from "../components/guest-ui/home-page-profile";
import AnimatingButton from "../components/reused-ui/reused-animating-button";
import { CustomSelect } from "../components/reused-ui/reused-select";
import { UserProfile } from "../components/user-ui/home-page-profile";
import { CustomInput } from "../components/reused-ui/reused-input";
import { ConvertedSongUI } from "../components/reused-ui/reused-converted-song";

export default function HomePage() {
  const animatingButtonTackerID = "ConvertingToMP3";
  const { user, userLoading } = useUser();

  const [youtubeLink, setYoutubeLink] = useState<string>("");

  const handleYTLink = (data: string) => {
    setYoutubeLink(data);
  };

  const resetInput = () => {
    console.log("Resetting input");
    setYoutubeLink("");
  };

  const convertToMP3 = {
    youtubeLinkRef: { current: youtubeLink },
    id: animatingButtonTackerID,
    resetInput,
  };

  return (
    <div className="#home-page min-h-screen h-auto flex flex-col items-center w-full bg-[var(--gray-900)] overflow-hidden">
      <div className="#header w-full flex items-center justify-end min-h-20 p-1 bg-[var(--gray-800)]">
        {userLoading ? (
          <p className="text-[var(--gray-100)] sm:mr-20">Loading...</p>
        ) : user ? (
          <UserProfile user={user} />
        ) : (
          <GuestProfile />
        )}
      </div>

      <div className="flex flex-grow flex-col justify-center items-center h-full w-full px-5 sm:px-0">
        <div className="flex flex-col p-1 sm:flex-row items-start sm:items-center w-full px-1 sm:px-3 sm:py-2 gap-2 max-w-[570px] bg-[var(--gray-800)] rounded-md">
          <CustomInput onValueChange={handleYTLink} value={youtubeLink} />

          <div className="w-full sm:w-auto flex items-center gap-2">
            <CustomSelect />
            <AnimatingButton
              id={animatingButtonTackerID}
              defaultText="Convert"
              setButtonState={() => ConvertToMP3(convertToMP3)}
            />
          </div>
        </div>

        <ConvertedSongUI />
      </div>
    </div>
  );
}
