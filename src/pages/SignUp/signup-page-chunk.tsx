import { useNavigate } from "react-router-dom";

import {
  sendVerificationEmail,
  signOutCurrentUser,
  signUpWithEmailPassword,
  signUpWithGoogle,
} from "../../services/user/firebase";
import { FirebaseError } from "firebase/app";

import { ROUTES } from "../../routes/routes";
import { useSignUpForm } from "../../hooks/hooks-form-controllers/model/signup-form";
import { animateTo } from "../../stores/shared/button-state";
import { notify } from "../../stores/shared/notification";
import { CustomLink } from "../../components/reused-ui/reused-router-link";
import { FormFields } from "../../components/reused-ui/reused-form-fields";
import { AnimatingButton } from "../../components/reused-ui/reused-animating-button";
import { RegisterWithGoogle } from "../../components/reused-ui/reused-google-login";

export const SignUpComponent = () => {
  const navigate = useNavigate();
  const { formData, errors, handleChange, validateForm, resetForm, setErrors } = useSignUpForm();

  const animatingButtonTackerID = "SignUp";
  const { default: before, error: failed, pending, success } = animateTo(animatingButtonTackerID);

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    pending();
    const validated = validateForm();
    if (!validated) {
      notify.error("Fill the form fields correctly", 3500);
      failed();
      before();
      return false;
    }
    try {
      const user = await signUpWithEmailPassword(validated.email, validated.password, validated.displayName);
      await sendVerificationEmail(user);
      await signOutCurrentUser();
      notify.success("Email verification link has been sent to your inbox! Please verify your email to sign in", 3500);
      success();
      resetForm();
      setErrors({});
      before(300);
      setTimeout(() => {
        navigate(ROUTES.AUTH.SIGN_IN, { replace: true });
      }, 500);
      return true;
    } catch (error) {
      if (error instanceof FirebaseError) {
        notify.error(error.message, 2500);
        setErrors({
          displayName: "Unexpected error happened",
          email: error.message,
          password: "Unexpected error happened",
        });
      } else {
        notify.error("Please choose different provider to sign in", 2500);
        setErrors({
          displayName: "Unexpected error happened",
          email: "Unexpected error happened",
          password: "Unexpected error happened",
        });
      }
      failed();
      return false;
    } finally {
      before();
    }
  };

  const handleGoogleSignUp = async () => {
    pending();
    notify.info("Waiting for Google sign-up...", 3500);
    try {
      await signUpWithGoogle();
      notify.success("Signed up with Google successfully!", 3500);
      success();
      before(300);
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 500);
      return true;
    } catch (error) {
      let message = "Google sign-up failed. Please try again.";
      if (error instanceof FirebaseError) {
        if (error.message.includes("popup-closed-by-user")) {
          message = "Google sign-up was cancelled.";
        }
      }
      notify.error(message, 3500);
      failed();
      before();
      return false;
    }
  };

  return (
    <div className="min-h-screen h-auto bg-[var(--gray-900)] flex justify-center items-center py-4 px-4">
      <div className="p-8 w-full max-w-md bg-[var(--gray-800)] rounded-lg shadow-md">
        <CustomLink path={ROUTES.HOME} title="Back" />

        <div className="space-y-5">
          <h2 className="text-[var(--gray-100)] text-2xl font-semibold text-center">Sign Up</h2>
          <FormFields
            showEmailField
            onSubmit={handleSubmit}
            errors={errors}
            formData={formData}
            handleChange={handleChange}
            showNameField={true}
            showPasswordField={true}
            showForgotPasswordLink={false}
          />
          <AnimatingButton id={animatingButtonTackerID} fullWidth defaultText="Sign up" setButtonState={handleSubmit} />
          <div className="flex items-center gap-4 text-[var(--gray-400)] text-sm">
            <div className="h-px bg-[var(--gray-600)] flex-1" />
            <span className="uppercase text-xs tracking-widest">or</span>
            <div className="h-px bg-[var(--gray-600)] flex-1" />
          </div>
          <RegisterWithGoogle id={animatingButtonTackerID} onClick={handleGoogleSignUp} />
          <div className="mt-4 text-sm text-center text-[var(--gray-300)]">
            <p>
              Already have an account? <CustomLink path={ROUTES.AUTH.SIGN_IN} title="Sign in" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpComponent;
