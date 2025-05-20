"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { routes } from "../../data/routes";
import { schedules } from "../../data/schedules";
import { trains } from "../../data/trains";

// Helper to add seconds to a time string (HH:mm or HH:mm:ss)
function addSeconds(time: string, seconds: number) {
  const [h, m, s] = time.split(":").map(Number);
  const date = new Date(0, 0, 0, h, m, s || 0);
  date.setSeconds(date.getSeconds() + seconds);
  return date.toTimeString().slice(0, 8).replace(/:00$/, ""); // Remove seconds if zero
}

// Generate stop-by-stop schedule for a route and base departure time
function generateStopSchedule(
  route: { districts: string[] },
  baseDeparture: string
) {
  const WAIT = 20 * 60; // 20 minutes in seconds
  const HOP = 10; // 10 seconds
  const stops = [];
  let currentTime = baseDeparture;
  for (let i = 0; i < route.districts.length; i++) {
    const district = route.districts[i];
    if (i === 0) {
      // First station: arrival = departure = baseDeparture
      stops.push({
        district,
        arrival: currentTime,
        departure: currentTime,
      });
    } else {
      // Arrive: previous departure + 10s
      currentTime = addSeconds(stops[i - 1].departure ?? "", HOP);
      stops.push({
        district,
        arrival: currentTime,
        departure:
          i === route.districts.length - 1
            ? null
            : addSeconds(currentTime, WAIT),
      });
    }
  }
  return stops;
}

export default function Schedule() {
  const [selectedRoute, setSelectedRoute] = useState(routes[0]);
  const routeSchedule = schedules.find(
    (s) => s.routeCode === selectedRoute.code
  );
  const train = trains.find((t) => t.line === selectedRoute.code);

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
          <Link href="/schedule" className="text-blue-400">
            Schedule
          </Link>
          <Link href="#" className="text-gray-300 hover:text-blue-400">
            Contact
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-8 text-blue-400">
          Routes & Schedules
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Route Selection */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                Train Lines
              </h2>
              <div className="space-y-4">
                {routes.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRoute(route)}
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      selectedRoute.id === route.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <div className="font-semibold">{route.name}</div>
                    <div className="text-sm opacity-75">{route.code}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Route and Schedules */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                Route Details
              </h2>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-300">
                  Districts Covered
                </h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedRoute.districts.map((district, idx) => (
                    <span
                      key={district + idx}
                      className="bg-blue-900/60 text-blue-200 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      District {district}
                      {idx < selectedRoute.districts.length - 1 && (
                        <span className="mx-1 text-blue-400">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-300">
                  Schedules
                </h3>
                {routeSchedule?.baseDepartureTimes.map((baseTime) => {
                  const stops = generateStopSchedule(selectedRoute, baseTime);
                  return (
                    <div key={baseTime} className="mb-8">
                      <div className="font-semibold text-blue-300 mb-2">
                        Departure from District {selectedRoute.districts[0]}:{" "}
                        {baseTime}
                      </div>
                      <div className="bg-gray-700 rounded-lg overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-600">
                              <th className="p-4 text-left">District</th>
                              <th className="p-4 text-left">Arrival Time</th>
                              <th className="p-4 text-left">Departure Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stops.map((stop, i) => (
                              <tr
                                key={stop.district + i}
                                className="border-t border-gray-600 hover:bg-gray-600"
                              >
                                <td className="p-4">
                                  District {stop.district}
                                </td>
                                <td className="p-4">{stop.arrival}</td>
                                <td className="p-4">
                                  {stop.departure ? stop.departure : "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-300">
                  Train Info
                </h3>
                {train ? (
                  <div className="bg-gray-700 rounded-lg p-4 flex flex-col gap-2">
                    <div>
                      <span className="font-semibold text-blue-400">
                        Codename:
                      </span>{" "}
                      {train.code}
                    </div>
                    <div>
                      <span className="font-semibold text-blue-400">Name:</span>{" "}
                      {train.name}
                    </div>
                    <div>
                      <span className="font-semibold text-blue-400">
                        Economy Capacity:
                      </span>{" "}
                      {train.capacityEconomy}
                    </div>
                    <div>
                      <span className="font-semibold text-blue-400">
                        First Class Capacity:
                      </span>{" "}
                      {train.capacityFirstClass}
                    </div>
                    <div>
                      <span className="font-semibold text-blue-400">
                        Status:
                      </span>{" "}
                      {train.status}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    No train assigned to this route.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>&copy; 2026 WARP Corporation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
