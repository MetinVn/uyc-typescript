import {
  sendEmailVerification,
  signOut,
  updateProfile,
  User,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";
import {
  auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "../../firebase";
import { FirebaseError } from "firebase/app";

// Google Sign-In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw error;
    }
    throw new Error("An unexpected error occurred during Google Sign-In.");
  }
};

// Email/Password Sign-In
export const signInWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Sign-In Error:", error);
    throw error;
  }
};

// Email/Password Sign-Up
export const signUpWithEmailPassword = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await changeName(userCredential.user, displayName);

    return userCredential.user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw error;
    }
    throw new Error("An unexpected error occurred during sign-up.");
  }
};

// Log out current user
export const signOutCurrentUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Unexpected error during logout:", error);
    throw new Error("Failed to log out the user.");
  }
};

// Sign up user with Google
export const signUpWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw error;
    }
    throw new Error("An unexpected error occurred during Google sign-up.");
  }
};

// Send email verification
export const sendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
    return true;
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw error;
    }
    throw new Error("An unexpected error occurred while sending email verification.");
  }
};

// Send password reset link
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Error sending password reset:", error);
    throw new Error("Password reset failed.");
  }
};

// Reset the password
export const changePassword = async (user: User, newPassword: string) => {
  try {
    await updatePassword(user, newPassword);
    return true;
  } catch (error: any) {
    console.error("Error updating password:", error);
    throw new Error(error?.message || "Error updating password");
  }
};

// Change user name
export const changeName = async (user: User, name: string) => {
  try {
    await updateProfile(user, { displayName: name });
    return true;
  } catch (error) {
    throw new Error("Error updating profile");
  }
};
