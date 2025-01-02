import React from 'react';

function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Quiz Forge. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

