"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function Settings() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("warp_user_data");
    if (!userData) {
      router.push("/sign-in");
      return;
    }

    try {
      const { username: storedUsername } = JSON.parse(userData);
      setUsername(storedUsername);
    } catch (err) {
      console.error("Failed to parse user data:", err);
    }
  }, [router]);

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const userData = localStorage.getItem("warp_user_data");
      if (!userData) {
        router.push("/sign-in");
        return;
      }

      const { token } = JSON.parse(userData);
      const response = await fetch("http://localhost:8000/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
        mode: "cors",
        credentials: "include",
      }).catch((error) => {
        console.error("Network error:", error);
        throw new Error(
          "Network error - please check if the server is running"
        );
      });

      if (!response) {
        throw new Error("No response from server");
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess("Username updated successfully");
        // Update localStorage with new username
        localStorage.setItem(
          "warp_user_data",
          JSON.stringify({ token, username })
        );
      } else {
        setError(data.message || data.error || "Failed to update username");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while updating username"
      );
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const userData = localStorage.getItem("warp_user_data");
      if (!userData) {
        router.push("/sign-in");
        return;
      }

      const { token } = JSON.parse(userData);
      const response = await fetch("http://localhost:8000/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
        mode: "cors",
        credentials: "include",
      }).catch((error) => {
        console.error("Network error:", error);
        throw new Error(
          "Network error - please check if the server is running"
        );
      });

      if (!response) {
        throw new Error("No response from server");
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess("Email updated successfully");
      } else {
        setError(data.message || data.error || "Failed to update email");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while updating email"
      );
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const userData = localStorage.getItem("warp_user_data");
      if (!userData) {
        router.push("/sign-in");
        return;
      }

      const { token } = JSON.parse(userData);
      const response = await fetch("http://localhost:8000/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
        mode: "cors",
        credentials: "include",
      }).catch((error) => {
        console.error("Network error:", error);
        throw new Error(
          "Network error - please check if the server is running"
        );
      });

      if (!response) {
        throw new Error("No response from server");
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || data.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while updating password"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-blue-400">Settings</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Username Update Form */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              Update Username
            </h2>
            <form onSubmit={handleUsernameUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  New Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Update Username
              </button>
            </form>
          </div>

          {/* Email Update Form */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              Update Email
            </h2>
            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  New Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Update Email
              </button>
            </form>
          </div>

          {/* Password Update Form */}
          <div className="bg-gray-800 rounded-xl p-6 md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              Update Password
            </h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-gray-800 mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-400">
            <p>&copy; 2026 WARP Corporation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
