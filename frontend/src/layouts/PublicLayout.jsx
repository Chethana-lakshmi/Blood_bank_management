import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { Droplets, Heart, Phone, Mail } from 'lucide-react'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white text-lg">BloodConnect</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                Connecting blood donors with hospitals in need. Every donation counts and saves lives.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/blood-availability', label: 'Blood Availability' },
                  { to: '/about', label: 'About Us' },
                  { to: '/register', label: 'Register as Donor' },
                  { to: '/login', label: 'Login' },
                ].map(link => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-gray-400 hover:text-red-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-400" />
                  <span className="text-gray-400">+91 1800-XXX-XXXX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red-400" />
                  <span className="text-gray-400">support@bloodconnect.in</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-gray-400">Emergency: 104</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} BloodConnect. All rights reserved. Made with ❤️ to save lives.
          </div>
        </div>
      </footer>
    </div>
  )
}
