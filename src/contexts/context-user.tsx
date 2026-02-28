import { createContext, useContext } from "react";
import { type IServedUser, ServeUser } from "../hooks/hook-serve-user";

const UserContext = createContext<IServedUser | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, userLoading } = ServeUser();

  const AppUserContext = { user, userLoading };

  return (
    <UserContext.Provider value={AppUserContext}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
