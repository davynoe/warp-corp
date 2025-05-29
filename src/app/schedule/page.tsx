"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Line } from "@/definitions";
import type { Schedule } from "@/definitions";
import { usePathname } from "next/navigation";
import { signOut } from "@/utils/auth";
import Navbar from "@/components/Navbar";

export default function Schedule() {
  const [lines, setLines] = useState<Line[]>([]);
  const [schedules, setSchedules] = useState<{ [key: string]: Schedule[] }>({});
  const [selectedLine, setSelectedLine] = useState<Line | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const pathname = usePathname();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Fetch all lines and schedules when the component mounts
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch lines
        const linesResponse = await fetch("http://localhost:8000/lines");
        if (!linesResponse.ok) {
          throw new Error("Failed to fetch lines");
        }
        const linesData = await linesResponse.json();
        setLines(linesData);

        if (linesData.length > 0) {
          setSelectedLine(linesData[0]);
        }

        // Fetch all schedules in parallel
        const schedulePromises = linesData.flatMap((line: Line) => [
          fetch(`http://localhost:8000/schedules/${line.code}`),
          fetch(`http://localhost:8000/schedules/${line.code}-rev`),
        ]);

        const scheduleResponses = await Promise.all(schedulePromises);

        // Check if any response failed
        const failedResponse = scheduleResponses.find(
          (response) => !response.ok
        );
        if (failedResponse) {
          throw new Error("Failed to fetch some schedules");
        }

        // Process all schedule responses
        const scheduleData = await Promise.all(
          scheduleResponses.map((response) => response.json())
        );

        // Organize schedules by line code
        const organizedSchedules: { [key: string]: Schedule[] } = {};
        linesData.forEach((line: Line, index: number) => {
          const regularSchedules = scheduleData[index * 2];
          const reverseSchedules = scheduleData[index * 2 + 1];

          organizedSchedules[line.code] = regularSchedules;
          organizedSchedules[`${line.code}-rev`] = reverseSchedules;
        });

        setSchedules(organizedSchedules);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []); // Empty dependency array means this runs once when component mounts

  useEffect(() => {
    // Check local storage for user data on component mount
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold mb-8 text-blue-400">
          Routes & Schedules
        </h1>

        {/* Train Lines Selection */}
        <div className="mb-12">
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              Train Lines
            </h2>
            <div className="flex flex-wrap gap-4">
              {isLoading ? (
                <div className="text-gray-400">
                  Loading lines and schedules...
                </div>
              ) : error ? (
                <div className="text-red-400">{error}</div>
              ) : (
                lines.map((line) => (
                  <button
                    key={line.id}
                    onClick={() => setSelectedLine(line)}
                    className={`px-6 py-3 rounded-lg text-left transition-colors ${
                      selectedLine?.id === line.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <div className="font-semibold">{line.name}</div>
                    <div className="text-sm opacity-75">{line.code}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Schedules Display */}
        {selectedLine && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Regular Schedule */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-6 text-blue-400">
                {selectedLine.code} Schedule
              </h3>
              {schedules[selectedLine.code]?.map((schedule) => (
                <div key={schedule.id} className="mb-8">
                  <div className="font-semibold text-blue-300 mb-4">
                    Departure: {schedule.stops[0].departure}
                  </div>
                  <div className="bg-gray-700 rounded-lg overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-600">
                          <th className="p-4 text-left">District</th>
                          <th className="p-4 text-left">Arrival</th>
                          <th className="p-4 text-left">Departure</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.stops.map((stop, i) => (
                          <tr key={i} className="border-t border-gray-600">
                            <td className="p-4">District {stop.station}</td>
                            <td className="p-4">{stop.arrival}</td>
                            <td className="p-4">{stop.departure || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Reverse Schedule */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-6 text-blue-400">
                {selectedLine.code}-REV Schedule
              </h3>
              {schedules[`${selectedLine.code}-rev`]?.map((schedule) => (
                <div key={schedule.id} className="mb-8">
                  <div className="font-semibold text-blue-300 mb-4">
                    Departure: {schedule.stops[0].departure}
                  </div>
                  <div className="bg-gray-700 rounded-lg overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-600">
                          <th className="p-4 text-left">District</th>
                          <th className="p-4 text-left">Arrival</th>
                          <th className="p-4 text-left">Departure</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.stops.map((stop, i) => (
                          <tr key={i} className="border-t border-gray-600">
                            <td className="p-4">District {stop.station}</td>
                            <td className="p-4">{stop.arrival}</td>
                            <td className="p-4">{stop.departure || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
