"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

// Format card number as user types (e.g., 1234-5678-9012-3456)
const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join("-");
  } else {
    return value;
  }
};

// Format expiration date as user types (e.g., 12/27)
const formatExpiryDate = (value: string) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

  if (v.length >= 3) {
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
  }
  return v;
};

// Format CVV (3 digits only)
const formatCVV = (value: string) => {
  return value
    .replace(/\s+/g, "")
    .replace(/[^0-9]/gi, "")
    .substring(0, 3);
};

export default function BuyTicket() {
  const searchParams = useSearchParams();
  const [ticketDetails, setTicketDetails] = useState<{
    start: string | null;
    end: string | null;
    date: string | null;
    scheduleId: string | null;
  } | null>(null);
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
  const router = useRouter();

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
          setUserName(userData.username); // Pre-fill the name field with username
        }
      } catch (e) {
        console.error("Failed to parse user data from local storage", e);
      }
    }
  }, []);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loggedInUsername) {
      alert("Please sign in to complete your purchase.");
      router.push("/sign-in");
      return;
    }

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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCVV(e.target.value);
    setCvv(formatted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar showBuyTicket={true} />

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
                    <div
                      className="relative w-full"
                      style={{ aspectRatio: "4/3" }}
                    >
                      <Image
                        src="/warp train economy cabin.png"
                        alt="Economy Class Cabin"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <h4 className="text-xl font-semibold text-white">
                          Economy Class
                        </h4>
                        <p className="text-gray-200 text-sm mt-1">
                          Comfortable seating with basic amenities
                        </p>
                      </div>
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
                    <div
                      className="relative w-full"
                      style={{ aspectRatio: "4/3" }}
                    >
                      <Image
                        src="/warp train first class cabin.png"
                        alt="First Class Cabin"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <h4 className="text-xl font-semibold text-white">
                          First Class
                        </h4>
                        <p className="text-gray-200 text-sm mt-1">
                          Luxury private capsules with premium service
                        </p>
                      </div>
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
                  onChange={handleCardNumberChange}
                  placeholder="1234-5678-9012-3456"
                  maxLength={19} // 16 digits + 3 hyphens
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
                    onChange={handleExpiryDateChange}
                    placeholder="MM/YY"
                    maxLength={5} // MM/YY format
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
                    onChange={handleCVVChange}
                    placeholder="123"
                    maxLength={3}
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

              {/* Payment Button */}
              <button
                type="submit"
                className={`w-full mt-6 ${
                  loggedInUsername
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white font-semibold py-3 px-6 rounded-lg transition duration-200`}
                onClick={() => {
                  if (!loggedInUsername) {
                    router.push("/sign-in");
                  }
                }}
              >
                {loggedInUsername ? "Pay Now" : "Login to Pay"}
              </button>
            </form>
          ) : (
            <p className="text-gray-400">Loading ticket details...</p>
          )}
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
