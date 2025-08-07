import { useCallback, useRef, useState } from "react";
import { ConvertToMP3 } from "../../utils/convert-to-mp3";

import { ConvertToMP3Props } from "../../types/types-utility-props";
import { useUser } from "../../contexts/context-user";
import { converted } from "../../stores/shared/converted-song";
import { useMusicList } from "../../stores/user/music-list";
import { UserProfile } from "../../components/user-ui/home-page-profile";
import { GuestProfile } from "../../components/guest-ui/home-page-profile";
import { CustomInput } from "../../components/reused-ui/reused-input";
import { CustomSelect } from "../../components/reused-ui/reused-select";
import { AnimatingButton } from "../../components/reused-ui/reused-animating-button";
import { ConvertedSongUI } from "../../components/reused-ui/reused-converted-song";

export const HomePage = () => {
  const { user, userLoading } = useUser();
  const convertedSong = converted.use();
  const music = useMusicList((state) => state.music);
  const [youtubeLink, setYoutubeLink] = useState<string>("");
  const youtubeLinkRef = useRef<string>("");
  const animatingButtonTackerID = "ConvertingToMP3";

  const handleYTLink = useCallback((data: string) => {
    setYoutubeLink(data);
    youtubeLinkRef.current = data;
  }, []);

  const resetInput = useCallback(() => {
    setYoutubeLink("");
    youtubeLinkRef.current = "";
  }, []);

  const handleConvert = useCallback(() => {
    const propsForConversion: ConvertToMP3Props = {
      youtubeLinkRef,
      id: animatingButtonTackerID,
      resetInput,
    };
    ConvertToMP3(propsForConversion);
  }, [animatingButtonTackerID, resetInput]);

  return (
    <div className="min-h-screen h-auto flex flex-col items-center w-full bg-[var(--gray-900)] overflow-hidden">
      <div className="w-full flex items-center justify-end min-h-20 p-1 bg-[var(--gray-800)]">
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
              fullWidth
              id={animatingButtonTackerID}
              defaultText="Convert"
              setButtonState={handleConvert}
            />
          </div>
        </div>

        {convertedSong && music && <ConvertedSongUI convertedSong={convertedSong} music={music} />}
      </div>
    </div>
  );
};

export default HomePage;
