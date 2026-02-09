import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nature Embroidery</h3>
            <p className="text-gray-400">
              Creating beautiful custom embroidery designs for all your needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/designs" className="text-gray-400 hover:text-white">Designs</Link></li>
              <li><Link to="/orders" className="text-gray-400 hover:text-white">Orders</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link to="/terms-and-conditions" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white"> Privacy Policy</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-400 hover:text-white">Shipping Policy</Link></li>
              <li><Link to="/cancellation-refunds" className="text-gray-400 hover:text-white">Cancellation & Refunds</Link></li>

            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                <a href="mailto:natureembroideries@gmail.com" className="hover:text-white">
                  natureembroideries@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1KRTNtc9MH/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Facebook size={24} />
              </a>
              <a href="https://www.instagram.com/nature__embroidery_0203?igsh=MTQwb2ZsNmc0c2gyZQ==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Nature Embroidery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
