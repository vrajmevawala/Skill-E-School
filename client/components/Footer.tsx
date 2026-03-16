import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900 tracking-tight">Skill E-School</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Empowering individuals and franchises with modern skills through our blended learning platform. Join the future of education today.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link to="/courses" className="hover:text-indigo-600 transition-colors">All Courses</Link></li>
              <li><Link to="/webinars" className="hover:text-indigo-600 transition-colors">Live Webinars</Link></li>
              <li><Link to="/consultancy" className="hover:text-indigo-600 transition-colors">Mentorship</Link></li>
              <li><Link to="/franchise" className="hover:text-indigo-600 transition-colors">Franchise Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm">Support</h3>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link to="/faq" className="hover:text-indigo-600 transition-colors">Help Center / FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-gray-900 font-semibold mb-4 text-sm">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-indigo-600 shrink-0" />
                <span>123 Education Way, Tech City, ST 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-indigo-600 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-600 shrink-0" />
                <span>hello@skill-eschool.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Skill E-School. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
