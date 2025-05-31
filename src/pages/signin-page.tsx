import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/routes";
import { animateTo } from "../stores/shared/button-state";
import { signInWithEmailPassword, signInWithGoogle, signOutCurrentUser } from "../services/user/firebase";
import { useSignInForm } from "../hooks/hooks-form-controllers/model/signin-form";
import FormFields from "../components/reused-ui/reused-form-fields";
import AnimatingButton from "../components/reused-ui/reused-animating-button";
import RegisterWithGoogle from "../components/reused-ui/reused-google-login";
import { CustomLink } from "../components/reused-ui/reused-router-link";
import { FirebaseError } from "firebase/app";
import { notify } from "../stores/shared/notification";

export default function SignInComponent() {
  const navigate = useNavigate();
  const { formData, errors, handleChange, validateForm, resetForm, setErrors } = useSignInForm();

  const animatingButtonTackerID = "SignIn";
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
      const user = await signInWithEmailPassword(validated.email, validated.password);

      if (user && !user.emailVerified) {
        await signOutCurrentUser();
        notify.warning("Please verify your email before signing in", 3500);
        setErrors({ email: "Please verify this email before signing in", password: "" });
        failed();
        before();
        return false;
      }
      resetForm();
      setErrors({});
      notify.success(`Welcome ${user.displayName || "User"}`, 3500);
      success();
      before(500);
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1000);
      console.clear();
      return true;
    } catch (error) {
      let errorMessage = "Something went wrong";
      let delay = 2500;

      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-not-verified") {
          errorMessage = "Please verify your email before signing in";
          delay = 3000;
        } else {
          errorMessage = "Invalid user credentials";
          setErrors({
            email: "Invalid credential",
            password: "Invalid credential",
          });
        }
        notify.error(errorMessage, delay);
      }
      notify.warning("Couldn't find an account with those credentials.", 3500);

      failed();
      before();
      return false;
    }
  };

  const handleGoogleSignIn = async () => {
    pending();
    notify.info("Waiting for Google sign-in...", 3500);
    try {
      await signInWithGoogle();
      notify.success("Signed in with Google successfully!", 3500);
      success();
      before(300);
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 300);
      return true;
    } catch (error) {
      let message = "Google sign-in failed. Please try again.";

      if (error instanceof FirebaseError) {
        if (error.message.includes("popup-closed-by-user")) {
          message = "Google sign-in was cancelled.";
        } else if (error.message.includes("network-request-failed")) {
          message = "Network error. Please check your connection.";
        }
      }
      notify.error(message, 3500);
      failed();
      before();
      return false;
    }
  };

  return (
    <div className="min-h-screen h-auto bg-[var(--authpage-bg)] flex justify-center items-center px-4">
      <div className="p-8 w-full max-w-md bg-[var(--authpage-form-bg)] rounded-lg shadow-md">
        <CustomLink path={ROUTES.HOME} title="Back" />
        <div className="space-y-5">
          <h2 className="text-white text-2xl font-semibold text-center">Sign In</h2>
          <FormFields
            showEmailField
            onSubmit={handleSubmit}
            showForgotPasswordLink={true}
            errors={errors}
            formData={formData}
            handleChange={handleChange}
            showNameField={false}
            showPasswordField={true}
          />
          <AnimatingButton id={animatingButtonTackerID} fullWidth defaultText="Sign in" setButtonState={handleSubmit} />
          <div className="flex items-center gap-4 text-[#aaa] text-sm">
            <div className="h-px bg-[#444] flex-1" />
            <span className="uppercase text-xs tracking-widest">or</span>
            <div className="h-px bg-[#444] flex-1" />
          </div>
          <RegisterWithGoogle id={animatingButtonTackerID} onClick={handleGoogleSignIn} />
          <div className="mt-4 text-sm text-center text-[#ccc]">
            <p>
              Don't have an account? <CustomLink title="Register" path={ROUTES.AUTH.SIGN_UP} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
