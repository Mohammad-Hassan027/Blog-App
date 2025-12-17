import { useState, useEffect } from "react";
import useAuthStore from "../../store/useAuthStore";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary";
import Toast from "../../components/Toast";
import { isValidUrl } from "../../utils/ValidateData";

export default function Profile() {
  const { user, updateProfile, loading, error } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL ?? "");
  const [newUploadedPublicId, setNewUploadedPublicId] = useState(null);
  const [savedOnSubmit, setSavedOnSubmit] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!displayName.trim()) {
      setFormError("Display name cannot be empty.");
      return;
    }

    if (isUploading) return;

    try {
      await updateProfile({ displayName, photoURL });
      setSavedOnSubmit(true);
      setSuccessMessage("Profile updated successfully! 🎉");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setFormError(err.message || "Failed to update profile");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setFormError("");
      setSuccessMessage("");
      try {
        // If there's a previously uploaded-but-unsaved image, delete it first
        if (newUploadedPublicId) {
          try {
            await deleteFromCloudinary(newUploadedPublicId);
          } catch (ign) {
            console.warn("Failed to delete previous temp upload:", ign);
          }
          setNewUploadedPublicId(null);
        }

        const result = await uploadToCloudinary(file);
        const secure = result?.secure_url || result?.url || null;
        const publicId = result?.public_id || null;
        setPhotoURL(secure);
        setNewUploadedPublicId(publicId);
        setToastMessage("Image uploaded");
        setToastType("success");
        setShowToast(true);
      } catch (err) {
        console.log(err);
        setFormError("Failed to upload image. Please try again.");
        setToastMessage("Image upload failed");
        setToastType("error");
        setShowToast(true);
      } finally {
        setIsUploading(false);
        e.target.value = null;
      }
    }
  };

  const isFormDisabled = loading || isUploading;

  // Cleanup: if user uploaded a new profile image but never saved, delete it on unmount
  useEffect(() => {
    return () => {
      if (newUploadedPublicId && !savedOnSubmit) {
        // best-effort cleanup
        deleteFromCloudinary(newUploadedPublicId).catch((err) =>
          console.warn("Cleanup failed for temp profile image:", err)
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the photoURL is cleared (e.g. user clicked Remove Image or emptied the input),
  // delete any newly uploaded-but-unsaved image to avoid leaving orphans in Cloudinary.
  useEffect(() => {
    if (!photoURL && newUploadedPublicId && !savedOnSubmit) {
      // best-effort delete
      deleteFromCloudinary(newUploadedPublicId).catch((err) =>
        console.warn("Failed to delete temp profile image on clear:", err)
      );
      setNewUploadedPublicId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoURL]);

  // show form-level errors/success as toasts for consistent UX
  useEffect(() => {
    if (error) {
      const msg = error?.message || String(error);
      setToastMessage(msg);
      setToastType("error");
      setShowToast(true);
    } else if (formError) {
      setToastMessage(formError);
      setToastType("error");
      setShowToast(true);
    } else if (successMessage) {
      setToastMessage(successMessage);
      setToastType("success");
      setShowToast(true);
    }
  }, [error, formError, successMessage]);

  return (
    <div className="flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
          Your Profile
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* show messages via toast instead of inline alert */}

            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700"
              >
                Display Name
              </label>
              <div className="mt-1">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isFormDisabled}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="photoURL"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Picture URL
              </label>
              <div className="flex items-center mt-1">
                <input
                  id="photoURL"
                  name="photoURL"
                  type="url"
                  autoComplete="photo"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="Paste image URL or use the upload button"
                  disabled={isFormDisabled}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />

                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isFormDisabled}
                />
                <label
                  htmlFor="image-upload"
                  className={`ml-2 inline-flex items-center px-4 py-2 rounded-md bg-gray-100 cursor-pointer text-sm font-medium transition duration-150 ease-in-out whitespace-nowrap ${
                    isFormDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {isUploading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-amber-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : photoURL ? (
                    "Change"
                  ) : (
                    "Upload"
                  )}
                </label>
              </div>

              {photoURL && isValidUrl(photoURL) && (
                <div className="flex items-center mt-2">
                  <img
                    src={photoURL}
                    alt="Profile Preview"
                    className="object-cover w-20 h-20 mr-4 rounded-full border border-gray-200 shadow"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (isFormDisabled) return;
                      // If this image was just uploaded and not saved, delete it from Cloudinary
                      if (newUploadedPublicId) {
                        try {
                          await deleteFromCloudinary(newUploadedPublicId);
                          setToastMessage("Image removed");
                          setShowToast(true);
                        } catch (delErr) {
                          console.error(
                            "Failed to delete temp profile image:",
                            delErr
                          );
                        }
                        setNewUploadedPublicId(null);
                      }
                      setPhotoURL("");
                    }}
                    className="text-sm text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                    disabled={isFormDisabled}
                  >
                    Remove Image
                  </button>
                </div>
              )}
              <Toast
                message={toastMessage}
                show={showToast}
                onClose={() => setShowToast(false)}
                type={toastType}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isFormDisabled}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-150 ease-in-out ${
                  isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
