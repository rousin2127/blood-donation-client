import React from "react";
import { Link } from "react-router";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-base-300 bg-neutral text-neutral-content mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-3">
          <p className="text-xl font-bold">
            <span className="text-primary">Blood</span>Care
          </p>
          <p className="text-sm text-neutral-content/80 leading-relaxed">
            Connecting blood donors with patients across Bangladesh through verified requests,
            location search, and coordinated volunteer support.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/explore" className="hover:text-primary transition">Explore requests</Link></li>
            <li><Link to="/search" className="hover:text-primary transition">Find donors</Link></li>
            <li><Link to="/about" className="hover:text-primary transition">About us</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition">Contact</Link></li>
            <li><Link to="/help" className="hover:text-primary transition">Help & support</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-primary transition">Privacy policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary transition">Terms & conditions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-3 text-sm text-neutral-content/90">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" />
              <a href="tel:+8801712345678" className="hover:text-primary">+880 1712-345678</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              <a href="mailto:support@bloodcare.bd" className="hover:text-primary">support@bloodcare.bd</a>
            </li>
            <li className="flex gap-3 pt-2">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="btn btn-ghost btn-sm btn-circle">
                <Facebook className="w-4 h-4" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-content/10 py-4 text-center text-xs text-neutral-content/70">
        © {year} BloodCare. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
