"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { District } from "@/definitions";
import { useRouter, usePathname } from "next/navigation";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFrom, setSelectedFrom] = useState<string>("");
  const [selectedTo, setSelectedTo] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);

  const images = [
    {
      src: "/warp trains above.png",
      caption: "WARP Trains Above The City",
    },
    {
      src: "/p corp warp platform.png",
      caption: "P Corp WARP Station",
    },
    {
      src: "/t corp warp platform.png",
      caption: "T Corp WARP Station",
    },
    {
      src: "/v corp warp platform.png",
      caption: "V Corp WARP Station",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch("http://localhost:8000/districts");
        if (!response.ok) {
          throw new Error("Failed to fetch districts");
        }
        const data = await response.json();
        setDistricts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDistricts();
  }, []);

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

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedFrom(value);
    if (value === selectedTo) {
      setSelectedTo("");
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTo(value);
    if (value === selectedFrom) {
      setSelectedFrom("");
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const router = useRouter();
  const pathname = usePathname();

  const handleSearchClick = () => {
    if (selectedFrom && selectedTo && selectedDate) {
      router.push(
        `/book?start=${selectedFrom}&end=${selectedTo}&date=${selectedDate}`
      );
    }
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
          <Link href="#" className="text-gray-300 hover:text-blue-400">
            Contact
          </Link>
          {/* Conditionally render Sign In or Username */}
          {loggedInUsername ? (
            <span className="text-blue-400">{loggedInUsername}!</span>
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

      {/* Hero Section */}
      <main>
        {/* Image Carousel */}
        <div className="relative h-[70vh] overflow-hidden">
          {images.map((image, index) => (
            <div
              key={image.src}
              className={`absolute w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image.src}
                alt={image.caption}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute bottom-4 right-4 bg-black/70 px-4 py-2 rounded-lg">
                <p className="text-white text-lg font-medium">
                  {image.caption}
                </p>
              </div>
            </div>
          ))}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-4xl px-4">
              <h1 className="text-6xl font-bold mb-6 text-blue-400">
                Experience the Future of Travel
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                WARP Corporation&apos;s interdimensional transportation system
              </p>
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-blue-400">
              Welcome to WARP Corp.
            </h2>
            <div className="space-y-6 text-gray-300">
              <p className="text-lg">
                In The City, where it is difficult to travel between districts,
                WARP Corp. stands at the forefront of transportation innovation.
                Our interdimensional travel technology has redefined the concept
                of distance and time.
              </p>
              <p className="text-lg">
                Our trains utilize advanced warping technology to transport
                passengers between districts in a mere 10 seconds. Experience
                the future of travel as you step into our luxurious cabins,
                available in both Economy and First Class configurations.
              </p>
              <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-500/30">
                <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                  Why Choose WARP?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">⚡</span>
                    Instant travel between districts in just 10 seconds
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">🛡️</span>
                    State-of-the-art safety systems
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">💎</span>
                    Premium comfort in both Economy and First Class
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">🌐</span>
                    Connect to any district in The City
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="bg-gray-900 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-blue-400">
                Book Your Interdimensional Journey
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Experience the future of transportation with WARP trains
              </p>
            </div>

            <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8 mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    From District
                  </label>
                  <select
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    value={selectedFrom}
                    onChange={handleFromChange}
                  >
                    <option value="">Select District</option>
                    {isLoading ? (
                      <option disabled>Loading districts...</option>
                    ) : error ? (
                      <option disabled>Error loading districts</option>
                    ) : (
                      districts.map((district) => (
                        <option
                          key={district.code}
                          value={district.code}
                          disabled={district.code === selectedTo}
                        >
                          {district.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    To District
                  </label>
                  <select
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    value={selectedTo}
                    onChange={handleToChange}
                  >
                    <option value="">Select District</option>
                    {isLoading ? (
                      <option disabled>Loading districts...</option>
                    ) : error ? (
                      <option disabled>Error loading districts</option>
                    ) : (
                      districts.map((district) => (
                        <option
                          key={district.code}
                          value={district.code}
                          disabled={district.code === selectedFrom}
                        >
                          {district.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
              <div>
                <button
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSearchClick}
                  disabled={!selectedFrom || !selectedTo || !selectedDate}
                >
                  Search for a train
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-gray-800 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">
                About WARP
              </h4>
              <p className="text-gray-400">
                Revolutionizing transportation in The City with interdimensional
                travel technology.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400">
                    Schedule
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400">
                    Fares
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400">
                    Stations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">
                Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-blue-400">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-blue-400">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-blue-400">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">
                Newsletter
              </h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 WARP Corporation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
