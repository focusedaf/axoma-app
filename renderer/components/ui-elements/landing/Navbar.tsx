"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">Axoma</h1>
        <nav className="hidden md:flex gap-8 text-sm text-gray-600">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#requirements">Requirements</a>
        </nav>
      </div>
    </header>
  );
}
