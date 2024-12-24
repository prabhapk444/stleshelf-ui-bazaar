import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white border-t mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">StyleShelf</h3>
            <p className="text-sm text-gray-600">
              Your one-stop destination for premium fashion and accessories.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-gray-900">Shop</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              </li>
              <li>
                <Link to="/auth/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              </li>
              <li>
                <Link to="/auth/feedback" className="text-gray-600 hover:text-gray-900">Feedback</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-gray-900">E-commerce</Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-gray-900">Marketing</Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-gray-900">Application UI</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-600">
                <MapPin size={16} />
                <span>9/527 5.B Gandhinagar, Reserveline, sivakasi</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Phone size={16} />
                <span>+91 9047560048</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Mail size={16} />
                <span>styleshelfv@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} StyleShelf. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};