'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-rock-darker/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl md:text-3xl font-display font-bold text-white">
              Mind's Eye <span className="text-primary-500">View</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-primary-500' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`font-medium transition-colors ${
                isActive('/about') ? 'text-primary-500' : 'text-gray-300 hover:text-white'
              }`}
            >
              About
            </Link>
            <Link
              href="/shows"
              className={`font-medium transition-colors ${
                isActive('/shows') ? 'text-primary-500' : 'text-gray-300 hover:text-white'
              }`}
            >
              Shows
            </Link>
            <Link
              href="/acoustic"
              className={`font-medium transition-colors ${
                isActive('/acoustic') ? 'text-primary-500' : 'text-gray-300 hover:text-white'
              }`}
            >
              Acoustic
            </Link>
            <Link
              href="/gallery"
              className={`font-medium transition-colors ${
                isActive('/gallery') ? 'text-primary-500' : 'text-gray-300 hover:text-white'
              }`}
            >
              Gallery
            </Link>
            <Link
              href="/contact"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link
              href="/"
              className={`block font-medium ${
                isActive('/') ? 'text-primary-500' : 'text-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`block font-medium ${
                isActive('/about') ? 'text-primary-500' : 'text-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/shows"
              className={`block font-medium ${
                isActive('/shows') ? 'text-primary-500' : 'text-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Shows
            </Link>
            <Link
              href="/acoustic"
              className={`block font-medium ${
                isActive('/acoustic') ? 'text-primary-500' : 'text-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Acoustic
            </Link>
            <Link
              href="/gallery"
              className={`block font-medium ${
                isActive('/gallery') ? 'text-primary-500' : 'text-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/contact"
              className="block bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
