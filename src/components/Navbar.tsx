"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/utils/auth";

interface NavbarProps {
  showBuyTicket?: boolean;
}

export default function Navbar({ showBuyTicket = false }: NavbarProps) {
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const userDataString = localStorage.getItem("warp_user_data");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData.username) {
          setLoggedInUsername(userData.username);
        }
      } catch (e) {
        console.error("Failed to parse user data from local storage", e);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
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
      <div className="flex gap-6 items-center">
        <Link
          href="/"
          className={
            pathname === "/"
              ? "text-blue-400"
              : "text-gray-300 hover:text-blue-400"
          }
        >
          Home
        </Link>
        <Link
          href="/about"
          className={
            pathname === "/about"
              ? "text-blue-400"
              : "text-gray-300 hover:text-blue-400"
          }
        >
          About
        </Link>
        <Link
          href="/schedule"
          className={
            pathname === "/schedule"
              ? "text-blue-400"
              : "text-gray-300 hover:text-blue-400"
          }
        >
          Schedule
        </Link>
        <Link
          href="/book"
          className={
            pathname === "/book"
              ? "text-blue-400"
              : "text-gray-300 hover:text-blue-400"
          }
        >
          Book
        </Link>
        {showBuyTicket && (
          <Link
            href="/buy-ticket"
            className={
              pathname === "/buy-ticket"
                ? "text-blue-400"
                : "text-gray-300 hover:text-blue-400"
            }
          >
            Buy Ticket
          </Link>
        )}
        {loggedInUsername ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
            >
              <span>{loggedInUsername}</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Settings
                </Link>
                <Link
                  href="/tickets"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Tickets
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/sign-in"
            className={
              pathname === "/sign-in"
                ? "text-blue-400"
                : "text-gray-300 hover:text-blue-400"
            }
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
