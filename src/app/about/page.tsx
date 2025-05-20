"use client";

import Image from "next/image";
import Link from "next/link";

export default function About() {
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
          <Link href="#" className="text-gray-300 hover:text-blue-400">
            Contact
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {/* Company Introduction */}
        <section className="max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl font-bold mb-8 text-blue-400">
            About WARP Corp.
          </h1>
          <div className="space-y-6 text-gray-300">
            <p className="text-lg">
              WARP Corp. stands as one of The City&apos;s most innovative
              transportation companies, revolutionizing the way citizens travel
              between districts. Our proprietary interdimensional travel
              technology has transformed what was once a lengthy journey into a
              mere 10-second experience.
            </p>
            <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
              <Image
                src="/the city map blue.webp"
                alt="The City Map"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl font-bold mb-8 text-blue-400">
            Our Technology
          </h2>
          <div className="space-y-6 text-gray-300">
            <p className="text-lg">
              At the heart of our transportation system lies the revolutionary
              interdimensional rift technology. When a WARP train enters the
              rift, time flows differently within this space. While only 10
              seconds pass in the real world, passengers experience a 16-hour
              journey through the interdimensional space.
            </p>
            <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-500/30">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                How It Works
              </h3>
              <ol className="space-y-4 list-decimal list-inside">
                <li>The train approaches the departure platform</li>
                <li>
                  Our advanced systems create a stable interdimensional rift
                </li>
                <li>
                  The train enters the rift, beginning the 16-hour journey
                </li>
                <li>
                  After 10 seconds in real time, the train emerges at the
                  destination
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Class Comparison */}
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl font-bold mb-8 text-blue-400">
            Travel Classes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Economy Class */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                Economy Class
              </h3>
              <div className="relative h-[300px] rounded-lg overflow-hidden mb-6">
                <Image
                  src="/warp train economy cabin.png"
                  alt="Economy Class Cabin"
                  fill
                  className="object-cover"
                />
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">⏱️</span>
                  16-hour journey in the rift
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">💺</span>
                  Comfortable seating
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">🍽️</span>
                  Basic meal service
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">🎮</span>
                  Entertainment options
                </li>
              </ul>
            </div>

            {/* First Class */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                First Class
              </h3>
              <div className="relative h-[300px] rounded-lg overflow-hidden mb-6">
                <Image
                  src="/warp train first class cabin.png"
                  alt="First Class Cabin"
                  fill
                  className="object-cover"
                />
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">⏱️</span>
                  Instant travel with cryogenic suspension
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">💎</span>
                  Luxury private capsules
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">❄️</span>
                  Zero-discomfort stasis journey
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">🚪</span>
                  Priority revival and exit service
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-blue-400">
            Safety & Reliability
          </h2>
          <div className="space-y-6 text-gray-300">
            <p className="text-lg">
              WARP Corp. maintains the highest standards of safety in
              interdimensional travel. Our advanced monitoring systems ensure
              stable rift conditions, while our trained staff provides constant
              support throughout your journey.
            </p>
            <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-500/30">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                Safety Features
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">🛡️</span>
                  Advanced rift stabilization technology
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">🔬</span>
                  Continuous monitoring of interdimensional conditions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">👨‍✈️</span>
                  Highly trained interdimensional travel specialists
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">🚨</span>
                  24/7 emergency response systems
                </li>
              </ul>
            </div>
          </div>
        </section>
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
