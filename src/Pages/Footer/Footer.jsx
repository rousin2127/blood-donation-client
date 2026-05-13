import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="mt-16 border-t border-gray-200">
            <div className="py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-3">
                        <Link to="/" className="text-lg font-bold text-gray-900">
                            Blood Donation
                        </Link>
                        <p className="text-sm text-gray-600">
                            Connect donors with recipients, manage requests, and help save lives.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link className="hover:text-gray-900" to="/donation-requests">Donation Requests</Link></li>
                            <li><Link className="hover:text-gray-900" to="/search">Search Donors</Link></li>
                            <li><Link className="hover:text-gray-900" to="/dashboard">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><span className="text-gray-500">Phone:</span> +880 1XXXXXXXXX</li>
                            <li><span className="text-gray-500">Email:</span> support@example.com</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Follow</h4>
                        <div className="flex items-center gap-3">
                            <a
                                className="btn btn-ghost btn-sm"
                                href="https://x.com/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="X"
                                title="X"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.244 2H21.552L14.33 10.26L22.823 22H16.17L10.96 14.934L4.779 22H1.469L9.191 13.172L1.05 2H7.873L12.58 8.502L18.244 2ZM17.084 20.05H18.917L6.88 3.848H4.913L17.084 20.05Z" fill="currentColor" />
                                </svg>
                            </a>
                            <a className="btn btn-ghost btn-sm" href="#" aria-label="Facebook" title="Facebook">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 9H16V6H14C11.791 6 10 7.791 10 10V12H8V15H10V22H13V15H15.358L16 12H13V10C13 9.448 13.448 9 14 9Z" fill="currentColor"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} Blood Donation. All rights reserved.</p>
                    <p>Made with MERN + Firebase Auth.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;