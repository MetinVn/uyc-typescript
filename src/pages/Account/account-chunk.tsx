import { useCallback, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";

import { User } from "firebase/auth";

import { ROUTES } from "../../routes/routes";
import { useHandleOutsideClicks } from "../../hooks/hook-outside-clicks";
import { useMusicList, uycmusic } from "../../stores/user/music-list";
import { animateTo, useButtonState } from "../../stores/shared/button-state";
import { useEditProfilePassForm } from "../../hooks/hooks-form-controllers/model/edit-account-pass-form";
import { useEditProfileNameForm } from "../../hooks/hooks-form-controllers/model/edit-account-name-form";
import { useDeleteProfileForm } from "../../hooks/hooks-form-controllers/model/delete-account-form";
import { notify } from "../../stores/shared/notification";
import { changeName, changePassword } from "../../services/user/firebase";
import { deleteUserAccount, reauthenticateUser } from "../../services/user/firebase-database";
import { converted } from "../../stores/shared/converted-song";
import { CustomLink } from "../../components/reused-ui/reused-router-link";
import { ImageLoader } from "../../utils/img-loader";
import { FormModal } from "../../components/reused-ui/reused-form-modal";
import { FormFields } from "../../components/reused-ui/reused-form-fields";

const AccountContent = () => {
  const [showEditName, setShowEditName] = useState(false);
  const [showEditPass, setShowEditPass] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const editNameRef = useRef<HTMLDivElement | null>(null);
  const editPassRef = useRef<HTMLDivElement | null>(null);
  const deleteAccRef = useRef<HTMLDivElement | null>(null);

  useHandleOutsideClicks({ isActive: showEditName, ref: editNameRef, stateChanger: setShowEditName });
  useHandleOutsideClicks({ isActive: showEditPass, ref: editPassRef, stateChanger: setShowEditPass });
  useHandleOutsideClicks({ isActive: showDeleteModal, ref: deleteAccRef, stateChanger: setShowDeleteModal });

  const user = useOutletContext<User>();
  const musicListLength = useMusicList((s) => s.getListLength());

  const animatingEditNameID = "AccountEditName";
  const animatingEditPassID = "AccountEditPass";
  const animatingDeleteAccID = "AccountDelete";

  const editNameButtonState = useButtonState((s) => s.getButtonState(animatingEditNameID));
  const editPassButtonState = useButtonState((s) => s.getButtonState(animatingEditPassID));
  const deleteButtonState = useButtonState((s) => s.getButtonState(animatingDeleteAccID));

  const editNameAnimation = animateTo(animatingEditNameID);
  const editPassAnimation = animateTo(animatingEditPassID);
  const deleteAccAnimation = animateTo(animatingDeleteAccID);

  const editNameForm = useEditProfileNameForm(user.displayName || "");
  const editPassForm = useEditProfilePassForm();
  const deleteProfileForm = useDeleteProfileForm();

  const userCreationDate = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

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
        const authenticated = await reauthenticateUser(user, data.currentPassword);
        if (!authenticated) {
          editPassAnimation.error();
          editPassAnimation.default();
          editPassForm.setErrors({ currentPassword: "Password is incorrect", password: "" });
          notify.error("Password is incorrect, please try again", 2500);
          return false;
        }

        const passChanged = await changePassword(user, data.password);
        if (!passChanged) {
          editPassAnimation.error();
          editPassAnimation.default();
          notify.error("Failed to update the password, please try again later");
          editPassForm.setErrors({ currentPassword: "", password: "Failed to set password" });
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
        notify.error("Failed to change password");
        editPassAnimation.error();
        editPassAnimation.default(2000);
        return false;
      }
    },
    [user, editPassAnimation, editPassForm, setShowEditPass]
  );

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

      const reauthSuccess = await reauthenticateUser(user, data.currentPassword);
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
        deleteProfileForm.setErrors({ currentPassword: "Unexpected error occured" });
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
    [deleteProfileForm, user, deleteAccAnimation, setShowDeleteModal]
  );

  const handleCloseEditName = useCallback(() => {
    setShowEditName(false);
    editNameForm.resetForm();
    console.log("Resetting name to: " + editNameForm.formData.displayName);
  }, [setShowEditName, editNameForm]);

  const handleCloseEditPass = useCallback(() => {
    setShowEditPass(false);
    editPassForm.resetForm();
  }, [setShowEditPass, editPassForm]);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    deleteProfileForm.resetForm();
  }, [setShowDeleteModal, deleteProfileForm]);

  return (
    <div className="min-h-screen h-auto bg-[var(--gray-900)] p-6 text-[var(--gray-300)]">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-5">
          <CustomLink title="Back" replace path={ROUTES.HOME} />
        </div>

        <section className="py-3 pl-3 border my-4 rounded-xl bg-[var(--gray-900)] text-sm">
          <h1>Just a heads up, any spaces you type in your password will be removed before it's saved.</h1>
        </section>
        {/* Account Info */}
        <section className="bg-[var(--gray-800)] p-4 sm:p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row w-full items-center sm:space-x-4">
            <ImageLoader
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
              alt="Profile image"
              imgSrc={user.photoURL}
            />
            <div>
              <div className="text-base sm:text-lg flex items-center gap-3">
                <span>{user.displayName || "User"}</span>
                <button onClick={() => setShowEditName(true)} type="button" className="cursor-pointer">
                  <Pencil strokeWidth={1} size={13} />
                </button>
              </div>
              <div className="text-sm text-[var(--gray-400)]">Email: {user.email}</div>
              <div className="text-sm flex items-center gap-3">
                <p className="text-[var(--gray-400)]">
                  Password: <span className="tracking-widest">••••••••</span>
                </p>
                <button onClick={() => setShowEditPass(true)} type="button" className="cursor-pointer">
                  <Pencil strokeWidth={1} size={13} />
                </button>
              </div>
              {userCreationDate && <p className="text-sm text-[var(--gray-400)]">Member since : {userCreationDate}</p>}
            </div>
          </div>
        </section>

        {/* User Data Info */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <section className="bg-[var(--gray-800)] p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Your Music Library</h2>
            <p className="text-[var(--gray-400)]">
              You have{" "}
              <span className="text-[var(--gray-300)] font-semibold">
                <Link title={ROUTES.MUSIC} to={ROUTES.MUSIC}>
                  {musicListLength}
                </Link>
              </span>{" "}
              song
              {musicListLength > 1 ? "s " : " "}
              stored.
            </p>
          </section>

          <section className="bg-[var(--gray-800)] p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Your Video Library</h2>
            <p className="text-[var(--gray-400)]">
              You have <span className="text-[var(--gray-300)] font-semibold">0</span> videos stored.
            </p>
          </section>

          <section className="bg-[var(--red-700)] p-4 sm:p-6 rounded-2xl shadow-md border border-[var(--gray-700)] space-y-4 sm:col-span-2">
            <h2 className="text-xl font-semibold text-[var(--gray-50)]">Danger Zone</h2>
            <p className="text-sm text-[var(--gray-100)]">
              Permanently delete all your data. This <strong>cannot</strong> be undone.
            </p>
            <ul className="list-disc list-inside text-sm text-[var(--gray-100)] space-y-1 pl-4">
              <li>All your converted songs and videos</li>
              <li>Your favorites and ratings</li>
              <li>All personalized playlists or saved content</li>
              <li>Metadata associated with your account</li>
            </ul>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="bg-[var(--red-500)] hover:bg-[var(--red-700)] text-white cursor-pointer px-4 py-2 rounded-md transition"
            >
              Delete My Account
            </button>
          </section>
        </div>

        {/* Edit Profile Name Modal */}
        {showEditName && (
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
        )}

        {/* Edit Profile Pass Modal */}
        {showEditPass && (
          <FormModal
            ref={editPassRef}
            onSubmit={updateProfilePass}
            onCloseModal={handleCloseEditPass}
            title="Update Password"
            buttonState={editPassButtonState}
            animButtonText="Change Password"
            animButtonId={animatingEditPassID}
          >
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
        )}

        {/* Delete Data Modal */}
        {showDeleteModal && (
          <FormModal
            ref={deleteAccRef}
            onSubmit={handleDeleteAccount}
            onCloseModal={handleCloseDeleteModal}
            dangerTitle
            animButtonText="Confirm"
            buttonState={deleteButtonState}
            animButtonId={animatingDeleteAccID}
            title={"Delete Account"}
            confirmMessage={
              "Are you absolutely sure? This will delete your account while permanently remove all your data from the database."
            }
          >
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
        )}
      </div>
    </div>
  );
};

export default AccountContent;
