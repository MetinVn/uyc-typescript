import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useUserState } from "../stores/user/user-state";

export interface IServedUser {
  user: User | null;
  userLoading: boolean;
}

export const ServeUser = (): IServedUser => {
  const [userState, setUserState] = useState<IServedUser>({
    user: null,
    userLoading: true,
  });
  const setIsEmailVerified = useUserState((state) => state.setIsEmailVerified);

  useEffect(() => {
    const stopListening = onAuthStateChanged(auth, (user) => {
      const isEmailVerified = user?.emailVerified ?? false;
      const servedUser = isEmailVerified ? user : null;

      setUserState({
        user: servedUser,
        userLoading: false,
      });

      setIsEmailVerified(isEmailVerified);
    });

    return () => stopListening();
  }, [setIsEmailVerified]);

  return { user: userState.user, userLoading: userState.userLoading };
};
