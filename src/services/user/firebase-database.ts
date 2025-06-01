import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { EmailAuthProvider, reauthenticateWithCredential, User } from "firebase/auth";

export async function deleteUserData(userId: User["uid"]): Promise<boolean> {
  try {
    const mp3sRef = collection(db, `users/${userId}/mp3s`);
    const mp3sSnapshot = await getDocs(mp3sRef);

    const deletePromises = mp3sSnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));

    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error("Error deleting user data:", error);
    return false;
  }
}

/** Deletes only Firebase Auth account */
export async function deleteUserAccount(user: User): Promise<boolean> {
  try {
    await user.delete();
    return true;
  } catch (err) {
    console.error("Failed to delete auth account", err);
    return false;
  }
}

/** Reauthenticates the user with a given password */
export async function reauthenticateUser(user: User, password: string): Promise<boolean> {
  try {
    const credential = EmailAuthProvider.credential(user.email!, password);
    await reauthenticateWithCredential(user, credential);
    return true;
  } catch (err) {
    console.error("Reauthentication failed", err);
    return false;
  }
}

/** Deletes both user data from DB and Firebase auth account */
export async function deleteFullAccount(user: User, password: string): Promise<boolean> {
  const reauthed = await reauthenticateUser(user, password);
  if (!reauthed) return false;

  const dataDeleted = await deleteUserData(user.uid);
  if (!dataDeleted) return false;

  const authDeleted = await deleteUserAccount(user);
  return authDeleted;
}
