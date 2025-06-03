import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AnimatingButton from "../components/reused-ui/reused-animating-button";
import FormFields from "../components/reused-ui/reused-form-fields";
import { resetPassword } from "../services/user/firebase";
import { ROUTES } from "../routes/routes";
import { useForgotPasswordForm } from "../hooks/hooks-form-controllers/model/reset-password-form";
import { notify } from "../stores/shared/notification";
import { animateTo } from "../stores/shared/button-state";
import { CustomLink } from "../components/reused-ui/reused-router-link";
import { useUser } from "../contexts/context-user";

export default function ForgotPasswordComponent() {
  const { user, userLoading } = useUser();
  const [searchParams] = useSearchParams();
  const fromAccount = searchParams.get("fromAccount") === "true";

  const [prompted, setPrompted] = useState(false);
  const [autoSent, setAutoSent] = useState(false);
  const [showForm, setShowForm] = useState(!fromAccount);

  const { formData, handleChange, errors, validateForm, resetForm, setErrors } = useForgotPasswordForm();

  const trackerID = "ResetPass";
  const { default: before, error: failed, pending, success } = animateTo(trackerID);

  useEffect(() => {
    if (fromAccount && !prompted) {
      setPrompted(true);

      if (!user) {
        setShowForm(true);
        return;
      }

      if (window.confirm(`Would you like us to send a reset link to your current email: ${user.email}?`)) {
        pending();
        resetPassword(user.email!)
          .then(() => {
            notify.success(`Reset link sent to ${user.email}. Check your inbox.`, 3500);
            setAutoSent(true);
            success();
          })
          .catch(() => {
            notify.error("Failed to send to your email. Please use the form below.", 3000);
            setShowForm(true);
            failed();
          })
          .finally(() => before());
      } else {
        setShowForm(true);
      }
    }
  }, [fromAccount, prompted, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    pending();

    const validated = validateForm();
    if (!validated) {
      notify.error("Please enter a valid email.", 1500);
      failed();
      before();
      return false;
    }

    try {
      await resetPassword(validated.email);
      notify.success("If an account exists for this email, a reset link has been sent.", 3500);
      resetForm();
      setErrors({});
      success();
      before();
      return true;
    } catch {
      notify.error("An error occurred. Please try again later.", 1500);
      failed();
      setErrors({ email: "Unable to send reset link" });
      before();
      return false;
    }
  };

  if (userLoading) {
    return (
      <div className="h-screen bg-[var(--gray-900)] flex justify-center items-center text-[var(--gray-100)]">
        Loading…
      </div>
    );
  }

  if (autoSent) {
    return (
      <div className="h-screen bg-[var(--gray-900)] flex justify-center items-center px-4">
        <div className="p-8 w-full max-w-md bg-[var(--gray-800)] rounded-lg shadow-md text-[var(--gray-100)]">
          <h2 className="text-xl">
            A reset link has been sent to <span className="font-medium">{user?.email || "your email"}</span>
          </h2>
          <div className="mt-3">
            <CustomLink path={ROUTES.AUTH.ACCOUNT} title="Back to Account" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[var(--gray-900)] flex justify-center items-center px-4">
      <div className="p-8 w-full max-w-md bg-[var(--gray-800)] rounded-lg shadow-md">
        <CustomLink path={ROUTES.HOME} title="Back" />
        <h1 className="text-[var(--gray-100)] text-2xl font-semibold text-center pb-7">Reset Password</h1>

        {showForm && (
          <>
            <FormFields
              showEmailField
              errors={errors}
              formData={formData}
              handleChange={handleChange}
              onSubmit={handleSubmit}
              showForgotPasswordLink={false}
              showNameField={false}
              showPasswordField={false}
            />
            <AnimatingButton id={trackerID} fullWidth defaultText="Send Reset Link" setButtonState={handleSubmit} />
          </>
        )}
      </div>
    </div>
  );
}
