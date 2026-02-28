import { FormFields } from "@/components/reused-ui/reused-form-fields";
import { FormModal } from "@/components/reused-ui/reused-form-modal";
import { useEditProfileNameForm } from "@/hooks/hooks-form-controllers/model/edit-account-name-form";
import { changeName } from "@/services/user/firebase";
import { animateTo, useButtonState } from "@/stores/shared/button-state";
import { notify } from "@/stores/shared/notification";
import { User } from "firebase/auth";
import { RefObject, useCallback } from "react";

type AccountEditNameChunkProps = {
  user: User;
  editNameRef: RefObject<HTMLDivElement | null>;
  setShowEditName: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AccountEditNameChunk = ({
  user,
  editNameRef,
  setShowEditName,
}: AccountEditNameChunkProps) => {
  // unique id for identifying submit button to read&change its state
  const animatingEditNameID = "AccountEditName";

  // state of the animating submit button
  const editNameButtonState = useButtonState((s) =>
    s.getButtonState(animatingEditNameID)
  );

  // functions for changing animating submit button's state
  const editNameAnimation = animateTo(animatingEditNameID);

  // functions for changing the user credential
  const editNameForm = useEditProfileNameForm(user.displayName || "");

  const updateProfileName = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    editNameAnimation.pending();
    editNameForm.setErrors({ displayName: "" });

    const data = editNameForm.validateForm();
    if (!data) {
      notify.error("Please fill the form field properly", 2500);
      editNameAnimation.error();
      editNameAnimation.default(1500);
      return false;
    }
    if (data.displayName === user.displayName) {
      notify.info("You haven't changed your name", 1500);
      editNameAnimation.error();
      editNameAnimation.default();
      return false;
    }

    try {
      await changeName(user, data.displayName);
      notify.success("Name updated successfully.", 1500);
      editNameForm.setFormData({ displayName: data.displayName });
      editNameForm.setErrors({ displayName: "" });
      editNameForm.resetForm();
      editNameAnimation.success();
      editNameAnimation.default();
      return true;
    } catch (error) {
      notify.error("Failed to update your name", 1500);
      editNameAnimation.error();
      editNameAnimation.default();
      return false;
    }
  };

  const handleCloseEditName = useCallback(() => {
    setShowEditName(false);
    editNameForm.resetForm();
  }, [setShowEditName, editNameForm, animatingEditNameID]);

  return (
    <FormModal
      ref={editNameRef}
      title="Update Profile"
      onSubmit={updateProfileName}
      onCloseModal={handleCloseEditName}
      buttonState={editNameButtonState}
      animButtonText="Change Name"
      animButtonId={animatingEditNameID}
    >
      <FormFields
        errors={editNameForm.errors}
        showEmailField={false}
        formData={editNameForm.formData}
        handleChange={editNameForm.handleChange}
        showNameField={true}
        showPasswordField={false}
        showCurrentPasswordField={false}
        showForgotCurrentPasswordLink={false}
        showForgotPasswordLink={false}
        onSubmit={updateProfileName}
      />
    </FormModal>
  );
};

export default AccountEditNameChunk;
