"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/useAuth";

function Profile() {
  const { user, updateProfile, changePassword, logout, loading } = useAuth();
  const router = useRouter();

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
      router.push("/auth");
      return;
    }
    setProfileData({
      name: user.name || "",
      email: user.email || "",
    });
  }, [user, router]);

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
        error instanceof Error ? error.message : "Failed to update profile",
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

    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
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
        error instanceof Error ? error.message : "Failed to change password",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-2xl rounded-xl border-2 border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        {/* Profile Header */}{" "}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full border-4 border-sky-500 bg-gradient-to-br from-sky-400 to-cyan-500 text-4xl font-bold shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="mb-1 bg-gradient-to-b from-gray-300 from-60% to-gray-700 bg-clip-text text-4xl font-bold text-transparent">
            {user.name}
          </h1>
          <p className="text-slate-400">{user.email}</p>
          <div className="mt-2 flex gap-2">
            <span
              className={`rounded px-2 py-1 text-xs ${
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
              className={`rounded px-2 py-1 text-xs ${user.isVerified ? "bg-green-600" : "bg-gray-600"}`}
            >
              {user.isVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-600 p-3 text-white">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-600 p-3 text-white">
            {success}
          </div>
        )}{" "}
        {/* Profile Form */}
        {isEditing ? (
          <form onSubmit={handleProfileSubmit} className="mb-6 space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
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
                className="w-full rounded-lg border border-zinc-600 bg-zinc-700 p-3 focus:border-sky-500 focus:outline-none"
                required
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                className="w-full rounded-lg border border-zinc-500 bg-zinc-600 p-3 text-slate-400"
                disabled
                title="Email cannot be changed"
              />
              <p className="mt-1 text-xs text-slate-400">
                Email cannot be changed
              </p>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-sky-500 py-3 font-semibold text-white transition duration-300 hover:bg-sky-600 disabled:bg-slate-600"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-lg bg-gray-500 py-3 font-semibold text-white transition duration-300 hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-zinc-700 p-4 shadow-md">
              <h2 className="mb-2 text-xl font-semibold text-gray-300">
                Profile Information
              </h2>
              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-zinc-700 p-4 shadow-md">
              <h2 className="mb-2 text-xl font-semibold text-gray-300">
                Account Details
              </h2>
              <div className="space-y-2 text-sm text-slate-300">
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
          <form onSubmit={handlePasswordSubmit} className="mb-6 space-y-4">
            <h3 className="mb-4 text-xl font-semibold text-sky-400">
              Change Password
            </h3>{" "}
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-medium"
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
                className="w-full rounded-lg border border-zinc-600 bg-zinc-700 p-3 focus:border-sky-500 focus:outline-none"
                required
                placeholder="Enter your current password"
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium"
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
                className="w-full rounded-lg border border-zinc-600 bg-zinc-700 p-3 focus:border-sky-500 focus:outline-none"
                required
                minLength={8}
                placeholder="Enter your new password"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
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
                className="w-full rounded-lg border border-zinc-600 bg-zinc-700 p-3 focus:border-sky-500 focus:outline-none"
                required
                minLength={8}
                placeholder="Confirm your new password"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-sky-500 py-3 font-semibold text-white transition duration-300 hover:bg-sky-600 disabled:bg-slate-600"
              >
                {isSubmitting ? "Changing..." : "Change Password"}
              </button>
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="flex-1 rounded-lg bg-gray-500 py-3 font-semibold text-white transition duration-300 hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {!isEditing && !isChangingPassword && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="transform rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-gray-600 hover:shadow-lg"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="transform rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-gray-600 hover:shadow-lg"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="transform rounded-lg bg-red-500 px-6 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-red-600 hover:shadow-lg"
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
