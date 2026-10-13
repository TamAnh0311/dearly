"use client";

/**
 * Account settings page — manage profile, email, password, and danger zone.
 */

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, Trash2, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.display_name ?? ""
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState("");

  const isAdmin = user?.app_metadata?.role === "admin";

  /** Updates display name in Supabase user metadata. */
  async function handleProfileSave(e: FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName },
      });
      if (error) throw error;
      setProfileSuccess(true);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  }

  /** Updates the user password. */
  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      setPasswordSaving(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setPasswordSaving(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setPasswordSaving(false);
    }
  }

  /** Signs out and redirects to login. */
  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-dearly-text">Account Settings</h1>
        <p className="mt-1 text-sm text-dearly-text-secondary">Manage your profile and security</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-dearly-border bg-dearly-card p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <User size={18} className="text-dearly-accent" />
          <h2 className="font-display text-lg font-semibold text-dearly-text">Profile</h2>
          {isAdmin && (
            <span className="ml-auto flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 ring-1 ring-purple-200">
              <Shield size={10} />
              Admin
            </span>
          )}
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-dearly-text-secondary">Email</label>
            <div className="flex items-center gap-2 rounded-lg border border-dearly-border bg-gray-50 px-3 py-2 text-sm text-dearly-text-muted">
              <Mail size={14} />
              {user?.email ?? "—"}
            </div>
          </div>

          <div>
            <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-dearly-text-secondary">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
            />
          </div>

          {profileError && <p className="text-sm text-red-500">{profileError}</p>}
          {profileSuccess && <p className="text-sm text-green-600">Profile updated successfully.</p>}

          <button
            type="submit"
            disabled={profileSaving}
            className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {profileSaving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </motion.div>

      {/* Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-dearly-border bg-dearly-card p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <Lock size={18} className="text-dearly-accent" />
          <h2 className="font-display text-lg font-semibold text-dearly-text">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-dearly-text-secondary">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
              placeholder="Min 8 characters"
              className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-dearly-text-secondary">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repeat new password"
              className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
            />
          </div>

          {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-green-600">Password changed successfully.</p>}

          <button
            type="submit"
            disabled={passwordSaving}
            className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {passwordSaving ? "Updating…" : "Update Password"}
          </button>
        </form>
      </motion.div>

      {/* Sign Out */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-dearly-border bg-dearly-card p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <LogOut size={18} className="text-dearly-accent" />
          <h2 className="font-display text-lg font-semibold text-dearly-text">Session</h2>
        </div>
        <p className="mb-4 text-sm text-dearly-text-secondary">
          Sign out of your account on this device.
        </p>
        <button
          onClick={handleSignOut}
          className="rounded-lg border border-dearly-border px-4 py-2 text-sm font-medium text-dearly-text-secondary transition hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        >
          Sign Out
        </button>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-red-200 bg-red-50/50 p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <Trash2 size={18} className="text-red-500" />
          <h2 className="font-display text-lg font-semibold text-red-700">Danger Zone</h2>
        </div>
        <p className="mb-4 text-sm text-red-600/80">
          Deleting your account will permanently remove your wedding site, photos, and all data. This cannot be undone.
        </p>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-red-600">
              Type &quot;DELETE&quot; to confirm
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
              placeholder="DELETE"
            />
          </div>
          <button
            disabled={deleteConfirm !== "DELETE"}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
