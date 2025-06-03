import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { Link, useOutletContext } from "react-router-dom";
import { User } from "firebase/auth";
import { notify } from "../stores/shared/notification";
import { useMusicList, uycmusic } from "../stores/user/music-list";
import { animateTo, useButtonState } from "../stores/shared/button-state";
import { deleteUserAccount, reauthenticateUser } from "../services/user/firebase-database";
import { changeName, changePassword } from "../services/user/firebase";
import FormFields from "../components/reused-ui/reused-form-fields";
import { CustomLink } from "../components/reused-ui/reused-router-link";
import { useEditProfileNameForm } from "../hooks/hooks-form-controllers/model/edit-account-name-form";
import { useDeleteProfileForm } from "../hooks/hooks-form-controllers/model/delete-account-form";
import { ROUTES } from "../routes/routes";
import { useEditProfilePassForm } from "../hooks/hooks-form-controllers/model/edit-account-pass-form";
import { FormModal } from "../components/reused-ui/reused-form-modal";
import { converted } from "../stores/shared/converted-song";
import ImageLoader from "../utils/img-loader";

export default function Account() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [showEditPass, setShowEditPass] = useState(false);

  const user = useOutletContext<User>();
  const music = useMusicList((s) => s.music);

  const animateEditNameID = "AccountEditName";
  const animatingEditPassID = "AccountEditPass";
  const animatingDeleteAccID = "AccountDelete";

  const editNameButtonState = useButtonState((s) => s.getButtonState(animateEditNameID));
  const editPassButtonState = useButtonState((s) => s.getButtonState(animatingEditPassID));
  const deleteButtonState = useButtonState((s) => s.getButtonState(animatingDeleteAccID));

  const editNameAnimation = animateTo(animateEditNameID);
  const editPassAnimation = animateTo(animatingEditPassID);
  const deleteAnimation = animateTo(animatingDeleteAccID);

  const editProfileNameForm = useEditProfileNameForm(user.displayName || "");
  const editProfilePassForm = useEditProfilePassForm();
  const deleteProfileForm = useDeleteProfileForm();

  const updateProfileName = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    editNameAnimation.pending();
    editProfileNameForm.setErrors({ displayName: "" });

    const data = editProfileNameForm.validateForm();
    if (!data) {
      notify.error("Please fill the form field properly", 2500);
      editNameAnimation.error();
      editNameAnimation.default(1500);
      editProfileNameForm.setErrors({ displayName: "Name is too short" });
      return false;
    }
    if (data.displayName === user.displayName) {
      notify.info("You haven't changed your name", 1500);
      editNameAnimation.error();
      editNameAnimation.default();
      return false;
    }

    try {
      await changeName(user, data.displayName!);
      notify.success("Name updated successfully.", 1500);
      editProfileNameForm.setErrors({ displayName: "" });
      editProfileNameForm.resetForm();
      editNameAnimation.success();
      editNameAnimation.default();
      setTimeout(() => {
        setShowEditName(false);
      }, 1500);
      return true;
    } catch (error) {
      notify.error("Failed to update your name", 1500);
      editNameAnimation.error();
      editNameAnimation.default();
      return false;
    }
  };

  const updateProfilePass = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    editPassAnimation.pending();
    editProfilePassForm.setErrors({ currentPassword: "", password: "" });

    const data = editProfilePassForm.validateForm();
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
        editProfilePassForm.setErrors({ currentPassword: "Password is incorrect", password: "" });
        notify.error("Password is incorrect, please try again", 2500);
        return false;
      }

      const passChanged = await changePassword(user, data.password);
      if (!passChanged) {
        editPassAnimation.error();
        editPassAnimation.default();
        notify.error("Failed to update the password, please try again later");
        editProfilePassForm.setErrors({ currentPassword: "", password: "Failed to set password" });
        return false;
      }

      editPassAnimation.success();
      editPassAnimation.default();
      editProfilePassForm.resetForm();
      notify.success("Password updated successfully.", 1500);
      setShowEditPass(false);
      editProfilePassForm.setErrors({ currentPassword: "", password: "" });
      return true;
    } catch (error) {
      notify.error("Failed to change password");
      editPassAnimation.error();
      editPassAnimation.default(2000);
      return false;
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    deleteAnimation.pending();
    const data = deleteProfileForm.validateForm();
    if (!data) {
      notify.error("Missing password.", 2000);
      deleteAnimation.error();
      deleteAnimation.default(1500);
      deleteProfileForm.setErrors({ currentPassword: "Password can't be empty" });
      return false;
    }
    deleteProfileForm.setErrors({ currentPassword: "" });

    const reauthSuccess = await reauthenticateUser(user, data.currentPassword);
    if (!reauthSuccess) {
      notify.error("Incorrect password. Please try again.", 2500);
      deleteProfileForm.setErrors({ currentPassword: "Invalid password" });
      deleteAnimation.error();
      deleteAnimation.default(1500);
      return false;
    }
    deleteProfileForm.setErrors({ currentPassword: "" });

    const deletionSuccess = await deleteUserAccount(user);
    if (!deletionSuccess) {
      notify.error("Something went wrong while deleting your account.", 2500);
      deleteAnimation.error();
      deleteAnimation.default(1500);
      deleteProfileForm.setErrors({ currentPassword: "Unexpected error occured" });
      return false;
    }

    uycmusic.destroy();
    converted.clear();
    deleteProfileForm.setErrors({ currentPassword: "" });
    deleteProfileForm.resetForm();
    notify.warning("Your account has been successfully deleted!", 4000);
    deleteAnimation.success();
    deleteAnimation.default();
    setShowDeleteModal(false);
    console.clear();
    return true;
  };

  return (
    <div className="min-h-screen h-auto bg-[var(--account-page-bg)] p-6 text-white">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-5">
          <CustomLink title="Back" replace path={ROUTES.HOME} />
        </div>
        {/* Account Info */}
        <section className="bg-[#4c4c4c] p-4 sm:p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <ImageLoader
              loading="eager"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
              alt="Profile image"
              imgSrc={user.photoURL}
            />
            <div>
              <div className="text-base sm:text-lg flex items-center gap-3">
                <span>{user.displayName || "User"}</span>
                <button onClick={() => setShowEditName(true)} type="button" className="cursor-pointer">
                  <FiEdit2 size={13} />
                </button>
              </div>
              <div className="text-sm text-gray-400">Email: {user.email}</div>
              <div className="text-sm flex items-center gap-3">
                <p className=" text-gray-400">
                  Password: <span className="tracking-widest">••••••••</span>
                </p>
                <button onClick={() => setShowEditPass(true)} type="button" className="cursor-pointer">
                  <FiEdit2 size={13} />
                </button>
              </div>
              {user.metadata.creationTime && (
                <p className="text-sm text-gray-400">
                  Member since :{" "}
                  {new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* User Data Info */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <section className="bg-[#4c4c4c] p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Your Music Library</h2>
            <p className="text-gray-400">
              You have{" "}
              <span className="text-white font-semibold">
                <Link title={ROUTES.MUSIC} to={ROUTES.MUSIC}>
                  {music.length}
                </Link>
              </span>{" "}
              song
              {music.length > 1 ? "s " : " "}
              stored.
            </p>
          </section>

          <section className="bg-[#4c4c4c] p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Your Video Library</h2>
            <p className="text-gray-400">
              You have <span className="text-white font-semibold">0</span> videos stored.
            </p>
          </section>

          <section className="bg-[#f164641e] p-4 sm:p-6 rounded-2xl shadow-md border border-red-500 space-y-4 sm:col-span-2">
            <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
            <p className="text-sm text-red-200">
              Permanently delete all your data. This <strong>cannot</strong> be undone.
            </p>
            <ul className="list-disc list-inside text-sm text-red-200 space-y-1 pl-4">
              <li>All your converted songs and videos</li>
              <li>Your favorites and ratings</li>
              <li>All personalized playlists or saved content</li>
              <li>Metadata associated with your account</li>
            </ul>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer px-4 py-2 rounded-md transition"
            >
              Delete My Account
            </button>
          </section>
        </div>

        {/* Edit Profile Name Modal */}
        {showEditName && (
          <FormModal
            title="Update Profile"
            onSubmit={updateProfileName}
            onCloseModal={() => {
              setShowEditName(false);
              editProfileNameForm.resetForm();
            }}
            buttonState={editNameButtonState}
            animButtonText="Change Name"
            animButtonId={animateEditNameID}
          >
            <FormFields
              errors={editProfileNameForm.errors}
              showEmailField={false}
              formData={editProfileNameForm.formData}
              handleChange={editProfileNameForm.handleChange}
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
            onSubmit={updateProfilePass}
            onCloseModal={() => {
              setShowEditPass(false);
              editProfilePassForm.resetForm();
            }}
            title="Update Password"
            buttonState={editPassButtonState}
            animButtonText="Change Password"
            animButtonId={animatingEditPassID}
          >
            <FormFields
              errors={editProfilePassForm.errors}
              showEmailField={false}
              formData={editProfilePassForm.formData}
              handleChange={editProfilePassForm.handleChange}
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
            onSubmit={handleDeleteAccount}
            onCloseModal={() => {
              setShowDeleteModal(false);
              deleteProfileForm.resetForm();
            }}
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
}
