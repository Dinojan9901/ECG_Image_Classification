import { Link } from 'react-router-dom';
import { HiHeart } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-custom py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <span>© {new Date().getFullYear()}</span>
            <span>ECG Arrhythmia Classification</span>
            <HiHeart className="text-red-500 h-4 w-4" />
          </div>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-500 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/yourusername/ecg-classification-project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;