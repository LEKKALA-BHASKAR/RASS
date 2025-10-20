import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div>
                        <img 
  src="/logo.webp" 
  alt="RASS Academy Logo" 
  className="h-12 w-auto"
/>
            <p className="text-sm leading-relaxed">
              RASS Academy offers comprehensive LMS solutions, online courses, webinars, and community support  
              to help learners achieve their goals. Join us to unlock your potential.
            </p>
          </div>
          
          {/* Useful Links */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/courses" className="hover:text-white transition">Courses</a></li>
              <li><a href="/blog" className="hover:text-white transition">Blog</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="/StudentAmbassadorForm" className="hover:text-white transition">Campus Partner</a></li>
            </ul>
          </div>
          
          {/* Support & Resources */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/help-center" className="hover:text-white transition">Help Center</a></li>
              <li><a href="/terms" className="hover:text-white transition">Terms and Conditions</a></li>
              <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>
          
          {/* Social & Contact */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">Stay Connected</h3>
            <div className="flex space-x-4 mb-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition">
                <FaFacebookF className="text-white w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-blue-400 transition">
                <FaTwitter className="text-white w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-pink-500 transition">
                <FaInstagram className="text-white w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-blue-700 transition">
                <FaLinkedinIn className="text-white w-4 h-4" />
              </a>
            </div>
            <p className="text-sm">
              <strong>Email:</strong>{" "}
              <a href="mailto:support@rassacademy.com" className="hover:text-white transition">
                support@rassacademy.com
              </a>
            </p>
            <p className="text-sm mt-1">
              <strong>Phone:</strong>{" "}
              <a href="tel:+1234567890" className="hover:text-white transition">
                +1 (234) 567-890
              </a>
            </p>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-700 mt-12"></div>
        
        {/* Bottom */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} RASS Academy. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="/terms" className="hover:text-white transition">Terms and Conditions</a>
            <span className="text-gray-600">·</span>
            <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
