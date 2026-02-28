import { lazy, Suspense, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";

import { User } from "firebase/auth";

import { ROUTES } from "../../routes/routes";
import { useHandleOutsideClicks } from "../../hooks/hook-outside-clicks";
import { useMusicList } from "../../stores/user/music-list";
import { CustomLink } from "../../components/reused-ui/reused-router-link";
import { ImageLoader } from "../../utils/img-loader";

const AccountContent = () => {
  const user = useOutletContext<User>();

  const [showEditName, setShowEditName] = useState(false);
  const [showEditPass, setShowEditPass] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const editNameRef = useRef<HTMLDivElement | null>(null);
  const editPassRef = useRef<HTMLDivElement | null>(null);
  const deleteAccRef = useRef<HTMLDivElement | null>(null);

  const musicListLength = useMusicList((s) => s.getListLength());

  const LazyAccountEditNameChunk = lazy(
    () => import("../../features/account/account-edit-name.tsx")
  );
  const LazyAccountEditPasswordChunk = lazy(
    () => import("../../features/account/account-edit-password.tsx")
  );
  const LazyDeleteAccountChunk = lazy(
    () => import("../../features/account/account-delete-account.tsx")
  );

  useHandleOutsideClicks({
    isActive: showEditName,
    ref: editNameRef,
    stateChanger: setShowEditName,
  });
  useHandleOutsideClicks({
    isActive: showEditPass,
    ref: editPassRef,
    stateChanger: setShowEditPass,
  });
  useHandleOutsideClicks({
    isActive: showDeleteModal,
    ref: deleteAccRef,
    stateChanger: setShowDeleteModal,
  });

  const userCreationDate = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen h-auto bg-[var(--gray-900)] p-6 text-[var(--gray-300)]">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-5">
          <CustomLink title="Back" replace path={ROUTES.HOME} />
        </div>

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
                <button
                  onClick={() => setShowEditName(true)}
                  type="button"
                  className="cursor-pointer"
                >
                  <Pencil strokeWidth={1} size={13} />
                </button>
              </div>
              <div className="text-sm text-[var(--gray-400)]">
                Email: {user.email}
              </div>
              <div className="text-sm flex items-center gap-3">
                <p className="text-[var(--gray-400)]">
                  Password: <span className="tracking-widest">••••••••</span>
                </p>
                <button
                  onClick={() => setShowEditPass(true)}
                  type="button"
                  className="cursor-pointer"
                >
                  <Pencil strokeWidth={1} size={13} />
                </button>
              </div>
              {userCreationDate && (
                <p className="text-sm text-[var(--gray-400)]">
                  Member since : {userCreationDate}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* User Data Info */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <section className="bg-[var(--gray-800)] p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Your Music Library</h2>
            <p className="text-[var(--gray-400)]">
              You have
              <span className="text-[var(--gray-300)] font-semibold">
                <Link title={ROUTES.MUSIC} to={ROUTES.MUSIC}>
                  {` ${musicListLength} `}
                </Link>
              </span>
              song
              {musicListLength > 1 ? "s" : " "}
              stored.
            </p>
          </section>

          <section className="bg-[var(--gray-800)] p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Your Video Library</h2>
            <p className="text-[var(--gray-400)]">
              You have
              <span className="text-[var(--gray-300)] font-semibold">{`${" 0 "}`}</span>
              videos stored.
            </p>
          </section>

          <section className="bg-[var(--red-600)] p-4 sm:p-6 rounded-2xl shadow-md border border-[var(--gray-700)] space-y-4 sm:col-span-2">
            <h2 className="text-xl font-semibold text-[var(--gray-50)]">
              Danger Zone
            </h2>
            <p className="text-sm text-[var(--gray-100)]">
              Permanently delete all your data. This <strong>cannot</strong> be
              undone.
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
          <Suspense fallback={<div>Loading Form</div>}>
            <LazyAccountEditNameChunk
              editNameRef={editNameRef}
              setShowEditName={setShowEditName}
              user={user}
            />
          </Suspense>
        )}

        {/* Edit Profile Password Modal */}
        {showEditPass && (
          <Suspense fallback={<div>Loading Form</div>}>
            <LazyAccountEditPasswordChunk
              editPassRef={editPassRef}
              setShowEditPass={setShowEditPass}
              user={user}
            />
          </Suspense>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <Suspense fallback={<div>Loading Form</div>}>
            <LazyDeleteAccountChunk
              deleteAccRef={deleteAccRef}
              setShowDeleteModal={setShowDeleteModal}
              user={user}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default AccountContent;
