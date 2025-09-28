import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Facebook, Twitter, Linkedin, Github } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center">
                <Briefcase className="text-white" size={20} />
              </div>
              <span className="ml-2 text-xl font-bold">ProConnect</span>
            </div>
            <p className="text-gray-300 text-base">
              Connecting talent with opportunity. Find your dream job or your next great hire on ProConnect.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Github size={20} />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  For Candidates
                </h3>
                <ul className="mt-4 space-y-4">
                  <li><Link to="/jobs" className="text-base text-gray-300 hover:text-white">Browse Jobs</Link></li>
                  <li><Link to="/companies" className="text-base text-gray-300 hover:text-white">Companies</Link></li>
                  <li><Link to="/login" className="text-base text-gray-300 hover:text-white">Sign In</Link></li>
                  <li><Link to="/register" className="text-base text-gray-300 hover:text-white">Create Account</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  For Employers
                </h3>
                <ul className="mt-4 space-y-4">
                  <li><Link to="/company/register" className="text-base text-gray-300 hover:text-white">Post a Job</Link></li>
                  <li><Link to="/candidates" className="text-base text-gray-300 hover:text-white">Browse Candidates</Link></li>
                  <li><Link to="/pricing" className="text-base text-gray-300 hover:text-white">Pricing</Link></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li><Link to="/about" className="text-base text-gray-300 hover:text-white">About</Link></li>
                  <li><Link to="/contact" className="text-base text-gray-300 hover:text-white">Contact</Link></li>
                  <li><Link to="/careers" className="text-base text-gray-300 hover:text-white">Careers</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li><Link to="/privacy" className="text-base text-gray-300 hover:text-white">Privacy</Link></li>
                  <li><Link to="/terms" className="text-base text-gray-300 hover:text-white">Terms</Link></li>
                  <li><Link to="/cookies" className="text-base text-gray-300 hover:text-white">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-300 xl:text-center">
            &copy; 2024 ProConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer