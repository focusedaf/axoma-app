"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Menu, X } from "lucide-react"; 

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        <h1 className="font-bold text-lg">
          <Link href="/">Axoma</Link>
        </h1>

       
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#requirements">Requirements</a>

          {isAuthenticated && user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-400 transition"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Login
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md border border-gray-300"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-md px-6 py-4 flex flex-col gap-3">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#requirements">Requirements</a>

          {isAuthenticated && user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-center"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-center"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-4 py-2 bg-blue-300 text-white rounded-md text-center"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-center"
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
