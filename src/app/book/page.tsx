"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { District, MergedRoute } from "@/definitions";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function BookRoutes() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(true);
  const [errorDistricts, setErrorDistricts] = useState<string | null>(null);
  const [selectedFrom, setSelectedFrom] = useState<string>("");
  const [selectedTo, setSelectedTo] = useState<string>("");
  const [routes, setRoutes] = useState<MergedRoute[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [errorRoutes, setErrorRoutes] = useState<string | null>(null);
  const [expandedSchedule, setExpandedSchedule] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Fetch districts on component mount and trigger search if params exist
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingDistricts(true);
      setErrorDistricts(null);
      try {
        const response = await fetch("http://localhost:8000/districts");
        if (!response.ok) {
          throw new Error("Failed to fetch districts");
        }
        const data = await response.json();
        setDistricts(data);

        const startParam = searchParams.get("start");
        const endParam = searchParams.get("end");
        const dateParam = searchParams.get("date");

        // Only trigger search if all required parameters are present in the URL
        if (startParam && endParam && dateParam) {
          // Set state from URL parameters
          setSelectedFrom(startParam);
          setSelectedTo(endParam);
          setSelectedDate(dateParam);
          // Trigger search automatically with parameters from URL
          handleSearch(startParam, endParam, dateParam);
        } else {
          // If params are not complete, ensure states are reset and no search is triggered initially
          setSelectedFrom("");
          setSelectedTo("");
          setSelectedDate("");
          // Optionally clear any previous search results if the user navigates here without complete params
          setRoutes([]);
          setExpandedSchedule(null);
        }
      } catch (err) {
        setErrorDistricts(
          err instanceof Error ? err.message : "An error occurred"
        );
      } finally {
        setIsLoadingDistricts(false);
      }
    };

    fetchInitialData();
  }, [searchParams]); // Depend on searchParams to re-run if they change

  // Effect to check local storage for user data on component mount
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
        // Optionally clear invalid data
        // localStorage.removeItem('warp_user_data');
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleSearch = async (start?: string, end?: string, date?: string) => {
    // Use parameters if provided, otherwise fallback to state
    const searchStart = start || selectedFrom;
    const searchEnd = end || selectedTo;
    const searchDate = date || selectedDate;

    if (!searchStart || !searchEnd || !searchDate) {
      setErrorRoutes("Please select origin, destination, and date.");
      setRoutes([]);
      return;
    }

    setIsLoadingRoutes(true);
    setErrorRoutes(null);
    setRoutes([]);
    setExpandedSchedule(null);

    try {
      // Include date in the API call
      const response = await fetch(
        `http://localhost:8000/find-routes?start=${searchStart}&end=${searchEnd}&date=${searchDate}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch routes");
      }
      const data: MergedRoute[] = await response.json();
      setRoutes(data);
    } catch (err) {
      setErrorRoutes(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoadingRoutes(false);
    }
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedFrom(value);
    // Reset results when selection changes manually
    setRoutes([]);
    setExpandedSchedule(null);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTo(value);
    // Reset results when selection changes manually
    setRoutes([]);
    setExpandedSchedule(null);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedDate(value);
    // Reset results when selection changes manually
    setRoutes([]);
    setExpandedSchedule(null);
  };

  const toggleScheduleExpansion = (scheduleId: number) => {
    setExpandedSchedule(expandedSchedule === scheduleId ? null : scheduleId);
  };

  const handleSelectSchedule = (route: MergedRoute, scheduleId: number) => {
    // Navigate to the ticket buying page with parameters
    router.push(
      `/buy-ticket?start=${route.route[0]}&end=${
        route.route[route.route.length - 1]
      }&date=${selectedDate}&scheduleId=${scheduleId}`
    );
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

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold mb-8 text-blue-400">
          Book Your Journey
        </h1>

        {/* Compact Search Component */}
        <div className="mb-12 bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            Find a Route
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                From District
              </label>
              <select
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                value={selectedFrom}
                onChange={handleFromChange}
                disabled={isLoadingDistricts}
              >
                <option value="">Select District</option>
                {isLoadingDistricts ? (
                  <option disabled>Loading districts...</option>
                ) : errorDistricts ? (
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
                disabled={isLoadingDistricts}
              >
                <option value="">Select District</option>
                {isLoadingDistricts ? (
                  <option disabled>Loading districts...</option>
                ) : errorDistricts ? (
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
            <button
              onClick={() =>
                handleSearch(selectedFrom, selectedTo, selectedDate)
              }
              disabled={
                !selectedFrom || !selectedTo || !selectedDate || isLoadingRoutes
              }
              className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingRoutes ? "Searching..." : "Search Routes"}
            </button>
          </div>
          {errorDistricts && (
            <p className="text-red-400 text-sm mt-2">{errorDistricts}</p>
          )}
          {errorRoutes && (
            <p className="text-red-400 text-sm mt-2">{errorRoutes}</p>
          )}
        </div>

        {/* Search Results */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">
            Available Routes
          </h2>

          {isLoadingRoutes && (
            <p className="text-gray-400">Searching for routes...</p>
          )}

          {!isLoadingRoutes &&
            routes.length === 0 &&
            !errorRoutes &&
            selectedFrom &&
            selectedTo && (
              <p className="text-gray-400">
                No routes found for the selected districts.
              </p>
            )}

          <div className="grid grid-cols-1 gap-8">
            {routes.map((route, routeIndex) => (
              <div
                key={routeIndex}
                className="bg-gray-800 rounded-xl shadow-lg p-6"
              >
                {/* Container for image and summary - using flexbox */}
                <div className="flex flex-col md:flex-row gap-6 mb-6 items-center md:items-start">
                  {/* Image container - made square and fixed size */}
                  <div className="relative w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src="/warp train from front.webp" // Assuming image is in public folder
                      alt="Warp train"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Container for Route Summary Details */}
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-xl font-semibold mb-2 text-blue-300">
                      Route: {route.route.join(" → ")}
                    </h3>
                    <p className="text-gray-300 mb-1">
                      Stations: {route.stationsCount}
                    </p>
                    {route.transfer && route.transfer.length > 0 && (
                      <p className="text-gray-300 mb-1">
                        Transfers: {route.transfer.join(", ")}
                      </p>
                    )}
                    <p className="text-gray-300">
                      Price: Economy ${route.prices.economy} | First Class $
                      {route.prices.firstClass}
                    </p>
                  </div>
                </div>

                {/* Schedules */}
                <h4 className="text-lg font-semibold mb-4 text-blue-300">
                  Schedules:
                </h4>
                <div className="space-y-4">
                  {route.schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="bg-gray-700 rounded-lg overflow-hidden"
                    >
                      <button
                        className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-600 transition-colors"
                        onClick={() => toggleScheduleExpansion(schedule.id)}
                      >
                        <span className="font-semibold">
                          Departure:{" "}
                          {schedule.segments[0]?.stops[0]?.departure || "N/A"}
                        </span>
                        <span>
                          {expandedSchedule === schedule.id ? "▲" : "▼"}
                        </span>
                      </button>
                      {expandedSchedule === schedule.id && (
                        <div className="p-4 border-t border-gray-600">
                          {schedule.segments.map((segment, segmentIndex) => (
                            <div key={segmentIndex} className="mb-4 last:mb-0">
                              <div className="font-semibold text-blue-200 mb-2">
                                Line: {segment.line}
                              </div>
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-gray-600">
                                    <th className="p-2 text-left">District</th>
                                    <th className="p-2 text-left">Arrival</th>
                                    <th className="p-2 text-left">Departure</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {segment.stops.map((stop, stopIndex) => (
                                    <tr
                                      key={stopIndex}
                                      className="border-t border-gray-600"
                                    >
                                      <td className="p-2">
                                        District {stop.station}
                                      </td>
                                      <td className="p-2">{stop.arrival}</td>
                                      <td className="p-2">
                                        {stop.departure || "-"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))}

                          {/* Select Schedule Button */}
                          <button
                            onClick={() =>
                              handleSelectSchedule(route, schedule.id)
                            }
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-2 rounded-lg transition duration-200 text-sm"
                          >
                            Select Schedule
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
