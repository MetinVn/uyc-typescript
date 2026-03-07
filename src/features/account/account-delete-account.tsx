import { RefObject, useCallback } from "react";
import { FormFields } from "../../components/reused-ui/reused-form-fields";
import { FormModal } from "../../components/reused-ui/reused-form-modal";
import { animateTo, useButtonState } from "../../stores/shared/button-state";
import { notify } from "../../stores/shared/notification";
import { User } from "firebase/auth";
import {
  deleteUserAccount,
  reauthenticateUser,
} from "../../services/user/firebase-database";
import { useDeleteProfileForm } from "../../hooks/hooks-form-controllers/model/delete-account-form";
import { uycmusic } from "../../stores/user/music-list";
import { converted } from "../../stores/shared/converted-song";

type DeleteAccountChunkProps = {
  user: User;
  deleteAccRef: RefObject<HTMLDivElement | null>;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DeleteAccountChunk = ({
  deleteAccRef,
  user,
  setShowDeleteModal,
}: DeleteAccountChunkProps) => {
  const animatingDeleteAccID = "AccountDelete";

  const deleteButtonState = useButtonState((s) =>
    s.getButtonState(animatingDeleteAccID),
  );

  const deleteAccAnimation = animateTo(animatingDeleteAccID);

  const deleteProfileForm = useDeleteProfileForm();

  const handleDeleteAccount = useCallback(
    async (e: React.FormEvent<HTMLElement>) => {
      e.preventDefault();
      deleteAccAnimation.pending();
      const data = deleteProfileForm.validateForm();
      if (!data) {
        notify.error("Missing password.", 2000);
        deleteAccAnimation.error();
        deleteAccAnimation.default(1500);
        return false;
      }
      deleteProfileForm.setErrors({ currentPassword: "" });

      const reauthSuccess = await reauthenticateUser(
        user,
        data.currentPassword,
      );
      if (!reauthSuccess) {
        notify.error("Incorrect password. Please try again.", 2500);
        deleteProfileForm.setErrors({ currentPassword: "Invalid password" });
        deleteAccAnimation.error();
        deleteAccAnimation.default(1500);
        return false;
      }
      deleteProfileForm.setErrors({ currentPassword: "" });

      const deletionSuccess = await deleteUserAccount(user);
      if (!deletionSuccess) {
        notify.error("Something went wrong while deleting your account.", 2500);
        deleteAccAnimation.error();
        deleteAccAnimation.default(1500);
        deleteProfileForm.setErrors({
          currentPassword: "Unexpected error occured",
        });
        return false;
      }

      uycmusic.destroy();
      converted.clear();
      deleteProfileForm.setErrors({ currentPassword: "" });
      deleteProfileForm.resetForm();
      notify.success("Your account has been successfully deleted!", 4000);
      deleteAccAnimation.success();
      deleteAccAnimation.default();
      setShowDeleteModal(false);
      console.clear();
      return true;
    },
    [deleteProfileForm, user, deleteAccAnimation, setShowDeleteModal],
  );

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    deleteProfileForm.resetForm();
  }, [setShowDeleteModal, deleteProfileForm]);

  return (
    <FormModal
      ref={deleteAccRef}
      onSubmit={handleDeleteAccount}
      onCloseModal={handleCloseDeleteModal}
      dangerTitle
      animButtonText="Confirm"
      buttonState={deleteButtonState}
      animButtonId={animatingDeleteAccID}
      title={"Delete Account"}
    >
      <section role="alert" className="my-2 rounded-md text-sm text-muted ">
        <p>
          Are you absolutely sure? This will delete your account while
          permanently remove all your data from the database.
        </p>
      </section>
      <FormFields
        errors={deleteProfileForm.errors}
        formData={deleteProfileForm.formData}
        handleChange={deleteProfileForm.handleChange}
        showEmailField={false}
        showNameField={false}
        showPasswordField={false}
        showCurrentPasswordField={true}
        showForgotPasswordLink={true}
        showForgotCurrentPasswordLink={true}
        onSubmit={handleDeleteAccount}
      />
    </FormModal>
  );
};

export default DeleteAccountChunk;
