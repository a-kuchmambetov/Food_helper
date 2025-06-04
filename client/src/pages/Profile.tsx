import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, updateProfile, changePassword, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setProfileData({
      name: user.name || "",
      email: user.email || "",
    });
  }, [user, navigate]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      await updateProfile({
        name: profileData.name,
      });
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setSuccess("Password changed successfully!");
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Failed to change password"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-2xl w-full">
        {/* Profile Header */}{" "}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full shadow-lg mb-4 border-4 border-sky-500 bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-4xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300 mb-1">
            {user.name}
          </h1>
          <p className="text-slate-400">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <span
              className={`px-2 py-1 rounded text-xs ${
                user.role === "admin"
                  ? "bg-red-600"
                  : user.role === "moderator"
                  ? "bg-yellow-600"
                  : "bg-green-600"
              }`}
            >
              {user.role}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                user.isVerified ? "bg-green-600" : "bg-gray-600"
              }`}
            >
              {user.isVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>
        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-600 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-600 text-white p-3 rounded-lg mb-4">
            {success}
          </div>
        )}{" "}
        {/* Profile Form */}
        {isEditing ? (
          <form onSubmit={handleProfileSubmit} className="space-y-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-500 focus:outline-none"
                required
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 text-slate-400"
                disabled
                title="Email cannot be changed"
              />
              <p className="text-xs text-slate-400 mt-1">
                Email cannot be changed
              </p>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 text-white font-semibold py-3 rounded-lg transition duration-300"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-700 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-sky-400 mb-2">
                Profile Information
              </h2>
              <div className="text-slate-300 text-sm space-y-2">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-sky-400 mb-2">
                Account Details
              </h2>
              <div className="text-slate-300 text-sm space-y-2">
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {user.isVerified ? "Verified" : "Unverified"}
                </p>
                <p>
                  <strong>User ID:</strong> {user.userId}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Password Change Form */}
        {isChangingPassword ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 mb-6">
            <h3 className="text-xl font-semibold text-sky-400 mb-4">
              Change Password
            </h3>{" "}
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium mb-2"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-500 focus:outline-none"
                required
                placeholder="Enter your current password"
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium mb-2"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-500 focus:outline-none"
                required
                minLength={6}
                placeholder="Enter your new password"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-500 focus:outline-none"
                required
                minLength={6}
                placeholder="Confirm your new password"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 text-white font-semibold py-3 rounded-lg transition duration-300"
              >
                {isSubmitting ? "Changing..." : "Change Password"}
              </button>
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          {!isEditing && !isChangingPassword && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
