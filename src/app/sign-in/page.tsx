"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<object | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Send email and password to the login endpoint
    console.log("Attempting login with:", { email, password });

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Login successful. Response data:", data);

        // ** Save data to local storage **
        // Assuming the response data has a structure like { token: '...', user: { username: '...' } }
        if (data.token && data.user?.username) {
          localStorage.setItem(
            "warp_user_data",
            JSON.stringify({ token: data.token, username: data.user.username })
          );
          console.log("User data saved to local storage.");
          // You might want to redirect here after saving
          // router.push('/');
        } else {
          console.warn(
            "Login successful, but missing token or username in response data.",
            data
          );
          // Still show modal even if data structure is unexpected, but note the warning
        }

        // Store data and show modal (can be removed if modal is no longer needed after saving)
        setModalData(data);
        setShowModal(true);
      } else {
        // Handle login errors (e.g., display error message)
        console.error(
          "Login failed. Response status:",
          res.status,
          "Response data:",
          data
        );
        alert(`Login failed: ${data.message || res.statusText}`);
      }
    } catch (error) {
      console.error("Error during login request:", error);
      alert("An error occurred during login.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/Wcorp.png"
            alt="WARP Corporation Logo"
            width={60}
            height={60}
          />
          <span className="text-2xl font-bold text-blue-400">WARP Corp.</span>
        </div>
        <div className="flex gap-6">
          <Link href="/" className="text-gray-300 hover:text-blue-400">
            Home
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-blue-400">
            About
          </Link>
          <Link href="/schedule" className="text-gray-300 hover:text-blue-400">
            Schedule
          </Link>
          <Link href="/book" className="text-gray-300 hover:text-blue-400">
            Book
          </Link>
          <Link
            href="/buy-ticket"
            className="text-gray-300 hover:text-blue-400"
          >
            Buy Ticket
          </Link>
          <Link href="/sign-in" className="text-blue-400">
            Sign In
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 flex justify-center items-center">
        <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-400 text-center mb-6">
            Login to WARP Corp.
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Username or Email
              </label>
              <input
                type="text"
                id="email"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Login
            </button>
          </form>

          {/* Optional: Link to a Sign Up page if you create one */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="#" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-blue-400">
                Login Response Data
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-100 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <pre className="bg-gray-900 p-4 rounded text-gray-300 text-sm overflow-x-auto">
              {JSON.stringify(modalData, null, 2)}
            </pre>
          </div>
        </div>
      )}

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
