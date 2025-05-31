import { createContext, useContext } from "react";
import { IServedUser, ServeUser } from "../hooks/hook-serve-user";

const UserContext = createContext<IServedUser | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const userContext = ServeUser();

  return <UserContext.Provider value={userContext}>{children}</UserContext.Provider>;
};

export default UserProvider;

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
