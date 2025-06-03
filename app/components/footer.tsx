import Link from 'next/link'

export function Footer() {
  return (
    <footer className="site-footer w-full py-6 mt-8 border-t border-slate-200 bg-white">
      <div className="footer-content container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="copyright text-sm text-slate-600">
            <p>&copy; 2025 Squarevendo App Studio. All rights reserved.</p>
          </div>
          <div className="social-links flex justify-center items-center space-x-6 mt-4 md:mt-0">
            <a href="https://facebook.com/squarevendo" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 text-xl">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://instagram.com/squarevendo" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 text-xl">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://x.com/squarevendo" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 text-xl">
              <i className="fab fa-x-twitter"></i>
            </a>
            <a href="https://linkedin.com/company/squarevendo" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 text-xl">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://google.com/maps?cid=squarevendo" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 text-xl">
              <i className="fab fa-google"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 