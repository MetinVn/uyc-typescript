import { RefObject, useCallback } from "react";
import { FormFields } from "../../components/reused-ui/reused-form-fields";
import { FormModal } from "../../components/reused-ui/reused-form-modal";
import { animateTo, useButtonState } from "../../stores/shared/button-state";
import { notify } from "../../stores/shared/notification";
import { changePassword } from "../../services/user/firebase";
import { User } from "firebase/auth";
import { useEditProfilePassForm } from "../../hooks/hooks-form-controllers/model/edit-account-pass-form";
import { reauthenticateUser } from "../../services/user/firebase-database";

type AccountEditPasswordChunkProps = {
  user: User;
  editPassRef: RefObject<HTMLDivElement | null>;
  setShowEditPass: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AccountEditPasswordChunk = ({
  editPassRef,
  user,
  setShowEditPass,
}: AccountEditPasswordChunkProps) => {
  const animatingEditPassID = "AccountEditPass";

  const editPassButtonState = useButtonState((s) =>
    s.getButtonState(animatingEditPassID)
  );
  const editPassAnimation = animateTo(animatingEditPassID);
  const editPassForm = useEditProfilePassForm();

  const updateProfilePass = useCallback(
    async (e: React.FormEvent<HTMLElement>) => {
      e.preventDefault();
      editPassAnimation.pending();
      editPassForm.setErrors({ currentPassword: "", password: "" });

      const data = editPassForm.validateForm();
      if (!data) {
        notify.error("Please fill the form fields properly", 2500);
        editPassAnimation.error();
        editPassAnimation.default();
        return false;
      }

      try {
        const authenticated = await reauthenticateUser(
          user,
          data.currentPassword
        );
        if (!authenticated) {
          editPassAnimation.error();
          editPassAnimation.default();
          editPassForm.setErrors({
            currentPassword: "Password is incorrect",
            password: "",
          });
          notify.error("Password is incorrect, please try again", 2500);
          return false;
        }

        const passChanged = await changePassword(user, data.password);
        if (!passChanged) {
          editPassAnimation.error();
          editPassAnimation.default();
          notify.error(
            "Failed to update the password, please try again later",
            2500
          );
          editPassForm.setErrors({
            currentPassword: "",
            password: "Failed to set password",
          });
          return false;
        }
        editPassAnimation.success();
        editPassAnimation.default();
        editPassForm.resetForm();
        notify.success("Password updated successfully.", 1500);
        setShowEditPass(false);
        editPassForm.setErrors({ currentPassword: "", password: "" });
        return true;
      } catch (error) {
        notify.error("Failed to change password", 2500);
        editPassAnimation.error();
        editPassAnimation.default(2000);
        return false;
      }
    },
    [user, editPassAnimation, editPassForm, setShowEditPass]
  );

  const handleCloseEditPass = useCallback(() => {
    setShowEditPass(false);
    editPassForm.resetForm();
  }, [setShowEditPass, editPassForm]);

  return (
    <FormModal
      ref={editPassRef}
      onSubmit={updateProfilePass}
      onCloseModal={handleCloseEditPass}
      title="Update Password"
      buttonState={editPassButtonState}
      animButtonText="Change Password"
      animButtonId={animatingEditPassID}
    >
      <section
        role="alert"
        className="my-2 rounded-md text-sm text-muted-foreground "
      >
        <p>
          Passwords can’t contain spaces. Any spaces you enter will be removed
          before saving.
        </p>
      </section>

      <FormFields
        errors={editPassForm.errors}
        showEmailField={false}
        formData={editPassForm.formData}
        handleChange={editPassForm.handleChange}
        showNameField={false}
        showPasswordField={true}
        showCurrentPasswordField={true}
        showForgotCurrentPasswordLink={true}
        showForgotPasswordLink={false}
        onSubmit={updateProfilePass}
      />
    </FormModal>
  );
};

export default AccountEditPasswordChunk;
