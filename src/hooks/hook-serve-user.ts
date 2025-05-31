import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useUserState } from "../stores/user/user-state";

export interface IServedUser {
  user: User | null;
  userLoading: boolean;
}

export const ServeUser = (): IServedUser => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const setIsEmailVerified = useUserState((state) => state.setIsEmailVerified);

  useEffect(() => {
    const stopListening = onAuthStateChanged(auth, (user) => {
      if (!user?.emailVerified) {
        setUser(null);
        setIsEmailVerified(false);
      } else if (user && user.emailVerified) {
        setUser(user);
        setIsEmailVerified(true);
      } else {
        setUser(null);
        setIsEmailVerified(false);
      }
      setUserLoading(false);
    });

    return () => stopListening();
  }, []);

  return { user, userLoading };
};
