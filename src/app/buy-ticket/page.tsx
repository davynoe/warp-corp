"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function BuyTicket() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [ticketDetails, setTicketDetails] = useState<{
    start: string | null;
    end: string | null;
    date: string | null;
    scheduleId: string | null;
  } | null>(null);
  // Add state for form inputs
  const [userName, setUserName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [seatClass, setSeatClass] = useState<"economy" | "firstClass">(
    "economy"
  );
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);

  useEffect(() => {
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const date = searchParams.get("date");
    const scheduleId = searchParams.get("scheduleId");

    setTicketDetails({
      start,
      end,
      date,
      scheduleId,
    });
  }, [searchParams]);

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

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert("Please accept the Terms of Service to proceed.");
      return;
    }

    // Here you would typically handle the payment processing
    console.log("Payment submitted:", {
      userName,
      cardNumber,
      expiryDate,
      cvv,
      peopleCount,
      seatClass,
      ticketDetails,
    });
    alert("Payment simulation successful! Check console for details.");
    // Redirect or show success message
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
          Ticket Purchase
        </h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            Enter Payment Details
          </h2>
          {ticketDetails ? (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* Ticket Details Summary */}
              <div className="text-gray-300 text-sm mb-4 p-4 bg-gray-700 rounded-md">
                <p>
                  <strong>Route:</strong> District {ticketDetails.start} →
                  District {ticketDetails.end}
                </p>
                <p>
                  <strong>Date:</strong> {ticketDetails.date}
                </p>
                <p>
                  <strong>Schedule ID:</strong> {ticketDetails.scheduleId}
                </p>
              </div>

              {/* Class Selection Cards */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-400">
                  Choose Your Class
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Economy Class Card */}
                  <div
                    className={`cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                      seatClass === "economy"
                        ? "border-2 border-blue-500"
                        : "border-2 border-transparent"
                    }`}
                    onClick={() => setSeatClass("economy")}
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src="/warp train economy cabin.png"
                        alt="Economy Class Cabin"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 bg-gray-700 text-center font-semibold text-lg">
                      Economy Class
                    </div>
                  </div>

                  {/* First Class Card */}
                  <div
                    className={`cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                      seatClass === "firstClass"
                        ? "border-2 border-blue-500"
                        : "border-2 border-transparent"
                    }`}
                    onClick={() => setSeatClass("firstClass")}
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src="/warp train first class cabin.png"
                        alt="First Class Cabin"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 bg-gray-700 text-center font-semibold text-lg">
                      First Class
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-400">
                  Description
                </h3>
                <div className="bg-gray-700 rounded-xl p-4 text-gray-300">
                  {seatClass === "economy" ? (
                    <p>
                      Experience rapid interdimensional travel in our Economy
                      Class. While the journey is incredibly fast, completing
                      the warp in just 10 seconds, passengers may experience a
                      slight physical strain during the process. Our comfortable
                      seating is designed for efficiency and affordability.
                    </p>
                  ) : (
                    <p>
                      Indulge in unparalleled luxury with our First Class
                      service. Travel is almost instant as you enter your
                      personal cryogenic suspension capsule, minimizing any
                      physical sensation by temporarily freezing your body.
                      Enjoy priority security access and exclusive amenities for
                      the ultimate travel experience.
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Rules */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-400">
                  Rules and Guidelines
                </h3>
                <div className="bg-gray-700 rounded-xl p-4 text-gray-300">
                  {seatClass === "economy" ? (
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        No smoking or vaping is permitted aboard the train.
                      </li>
                      <li>
                        Please keep noise levels to a minimum to respect other
                        passengers.
                      </li>
                      <li>
                        Passengers must remain seated with seatbelts fastened
                        during warp transit.
                      </li>
                      <li>
                        Consumption of personal food and beverages is allowed,
                        provided it does not disturb others.
                      </li>
                    </ul>
                  ) : (
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        Do not attempt to open or tamper with the cryogenic
                        suspension capsules during transit.
                      </li>
                      <li>
                        Please remove your shoes before entering your personal
                        cryogenic suspension capsule.
                      </li>
                      <li>
                        Treat the First Class amenities and capsules with care
                        to maintain a pristine environment.
                      </li>
                      <li>
                        Personal belongings should be stored securely within the
                        designated compartments.
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              {/* User Name */}
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="userName"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>

              {/* Credit Card Information */}
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Expiry Date (MM/YY)
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* People Count */}
              <div>
                <label
                  htmlFor="peopleCount"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Number of Passengers
                </label>
                <input
                  type="number"
                  id="peopleCount"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  value={peopleCount}
                  onChange={(e) =>
                    setPeopleCount(parseInt(e.target.value) || 1)
                  }
                  min="1"
                  required
                />
              </div>

              {/* Terms of Service Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-400">
                  Terms of Service
                </h3>
                <div className="bg-gray-700 rounded-xl p-6 max-h-96 overflow-y-auto text-gray-300 text-sm">
                  <p className="font-bold text-center mb-4">
                    WARP Corporation – Terms of Service (ToS)
                  </p>
                  <p className="text-center mb-6">
                    Effective Date: ██/██/████ | Last Updated: ██/██/████
                  </p>

                  <p className="mb-4">
                    Welcome to WARP Corporation™, also referred to as W Corp or
                    WARP Corp™, the premier provider of advanced high-efficiency
                    transit services through spacetime-folding logistics. By
                    accessing, purchasing, or utilizing any service provided by
                    WARP Corporation—including, but not limited to, interstitial
                    travel, cargo transfer, suspended continuity processing, or
                    cryogenic stasis—you (“the User”) agree to be bound by the
                    following legally binding Terms of Service.
                  </p>

                  <p className="font-semibold mb-4">
                    Please read carefully. Usage of WARP Transit constitutes
                    irrevocable consent.
                  </p>

                  <p className="font-bold mb-2">1. Consent to Transit</p>
                  <p className="mb-2">
                    1.1. By purchasing a ticket (hereafter “Temporal Boarding
                    Credential”), the User voluntarily agrees to participate in
                    WARP Corporation’s proprietary transportation system, which
                    may involve exposure to anomalous time fields, internal
                    dilation, or trans-conceptual phenomena.
                  </p>
                  <p className="mb-4">
                    1.2. The User accepts that there may be a discrepancy
                    between perceived and objective time, and fully waives any
                    right to contest, inquire about, or seek restitution
                    regarding such temporal experiences.
                  </p>
                  <p className="mb-4">
                    1.3. WARP Corporation assumes no liability for any
                    psychological, physical, existential, or mnemonic trauma
                    sustained before, during, or after the usage of WARP
                    services.
                  </p>

                  <p className="font-bold mb-2">2. Liability Disclaimer</p>
                  <p className="mb-2">
                    2.1. WARP Corp™ disclaims responsibility for the following
                    conditions or outcomes, without limitation:
                  </p>
                  <ul className="list-disc list-inside mb-4 ml-4">
                    <li>Temporal elongation or compression;</li>
                    <li>Memory alteration or deletion;</li>
                    <li>
                      Emotional destabilization or identity disassociation;
                    </li>
                    <li>Misalignment with reality consensus layers;</li>
                    <li>
                      Molecular irregularities within standard deviation
                      parameters (≤4.9% variance).
                    </li>
                  </ul>
                  <p className="mb-4">
                    2.2. WARP Corp™ guarantees post-transit structural
                    reassembly using advanced Cleanup Division protocols based
                    on the User&apos;s Departure Time D₀ configuration.
                    Subjective coherence is not ensured.
                  </p>

                  <p className="font-bold mb-2">
                    3. Enhanced Passenger Tier (“First Class”)
                  </p>
                  <p className="mb-2">
                    3.1. Users who opt into First Class experience Enhanced
                    Passenger Preservation Protocols (EPPP), involving temporary
                    biological suspension in secure containment modules during
                    transit.
                  </p>
                  <p className="mb-4">
                    3.2. The specific methods used in stasis containment are
                    confidential and protected under Internal Protocol
                    Designation BLACK-VIOLET/9. Details are not disclosed to the
                    public.
                  </p>
                  <p className="mb-4">
                    3.3. First Class pricing reflects the precision and
                    resources required to maintain full temporal discontinuity
                    during passage. Refunds are categorically disallowed.
                  </p>

                  <p className="font-bold mb-2">
                    4. Data Collection and Consent
                  </p>
                  <p className="mb-2">
                    4.1. The User grants WARP Corporation unrestricted,
                    perpetual access to the following data sources:
                  </p>
                  <ul className="list-disc list-inside mb-4 ml-4">
                    <li>Biological signatures;</li>
                    <li>Cognitive patterns and neural maps;</li>
                    <li>Emotional fluctuations and hormonal telemetry;</li>
                    <li>
                      Full memory recall logs, both active and suppressed.
                    </li>
                  </ul>
                  <p className="mb-4">
                    4.2. WARP Corporation reserves the right to:
                  </p>
                  <ul className="list-disc list-inside mb-4 ml-4">
                    <li>
                      Utilize User data for research, behavioral modeling, and
                      performance calibration;
                    </li>
                    <li>
                      Simulate User consciousness for internal testing purposes;
                    </li>
                    <li>
                      Monetize anonymized thought-constructs and memory
                      fragments as permitted by jurisdictional code ZR-7.
                    </li>
                  </ul>
                  <p className="mb-4">
                    4.3. By agreeing to this ToS, the User relinquishes all
                    personal rights to any thoughts, dreams, or mental
                    narratives occurring within WARP Transit Zones.
                  </p>

                  <p className="font-bold mb-2">
                    5. Confidentiality, Amnesia, and Indemnification
                  </p>
                  <p className="mb-2">
                    5.1. Any recollection of transit-related occurrences
                    constitutes a breach of the Experiential Containment Clause
                    (ECC-3). Such recollections must be reported to WARP
                    Corp&apos;s Cleanup Division for immediate corrective
                    processing.
                  </p>
                  <p className="mb-4">
                    5.2. Attempting to retrieve or reconstruct transit
                    experiences may result in permanent dissociation, null
                    instantiation, or recursive timeline bleed.
                  </p>
                  <p className="mb-4">
                    5.3. The User agrees to indemnify and hold harmless WARP
                    Corporation, its personnel, partners, and associated
                    subsystems from all claims, known or unknown, arising from
                    or related to the use of WARP services.
                  </p>

                  <p className="font-bold mb-2">6. Miscellaneous Provisions</p>
                  <p className="mb-2">
                    6.1. WARP Corporation reserves the unilateral right to
                    update, alter, redact, or obfuscate these Terms without
                    notice. Continued usage signifies consent to all updates.
                  </p>
                  <p className="mb-4">
                    6.2. These Terms are governed by the Chrono-Logistics Codex
                    and are enforceable in all recognized jurisdictions within
                    and adjacent to Linearity.
                  </p>
                  <p className="mb-4">
                    6.3. In all cases of dispute between User perception and
                    WARP Corporation official logs, the latter shall prevail as
                    absolute truth.
                  </p>

                  <p className="font-bold text-center mt-6">
                    By proceeding with your ticket purchase, you acknowledge
                    that you have read, understood, and consented to the above
                    Terms—regardless of your level of awareness.
                  </p>

                  <p className="font-bold text-center mt-4">
                    WARP Corporation – “Arrival is Inevitable.”
                  </p>
                </div>
              </div>

              {/* Accept Terms Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                />
                <label
                  htmlFor="acceptTerms"
                  className="ml-2 block text-sm text-gray-300"
                >
                  I have read and agree to the{" "}
                  <span className="text-blue-400">Terms of Service</span>
                </label>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!termsAccepted}
              >
                Pay Now
              </button>
            </form>
          ) : (
            <p className="text-gray-400">Loading ticket details...</p>
          )}

          {/* Optional: Link to a Sign Up page if you create one */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="#" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>
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
