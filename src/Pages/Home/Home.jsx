import React from 'react';
import { Link } from 'react-router';

const Home = () => {
    return (
        <div className="space-y-16 py-8">
            {/* Hero / Banner */}
            <section className="rounded-2xl bg-gradient-to-br from-red-50 via-white to-rose-50 border border-red-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 sm:p-10 items-center">
                    <div className="space-y-5">
                        <div className="badge badge-outline border-red-300 text-red-600">Blood Donation Platform</div>
                        <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">
                            Donate blood, save lives.
                            <span className="block text-red-600">Find donors faster.</span>
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg">
                            A simple platform to create blood donation requests, connect donors with recipients,
                            and manage requests through a role-based dashboard.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link to="/register" className="btn btn-error text-white">
                                Join as a donor
                            </Link>
                            <Link to="/search" className="btn btn-outline border-red-300 text-red-600 hover:bg-red-50">
                                Search donors
                            </Link>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                <span>Fast requests</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                <span>Role-based dashboard</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                <span>Secure access</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="rounded-2xl bg-white border border-red-100 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900">How it works</h3>
                            <div className="mt-4 grid grid-cols-1 gap-4">
                                <div className="flex gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600 font-bold">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Create a request</p>
                                        <p className="text-sm text-gray-600">Add recipient info, location, date and time.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600 font-bold">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Match with donors</p>
                                        <p className="text-sm text-gray-600">Find donors by blood group & area.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600 font-bold">
                                        3
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Donate & update status</p>
                                        <p className="text-sm text-gray-600">Track: pending → inprogress → done.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden sm:block absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-red-100 blur-2xl" />
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="space-y-6">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why choose this platform</h2>
                        <p className="text-gray-600 mt-2">A clean workflow built for speed and clarity.</p>
                    </div>
                    <Link to="/donation-requests" className="btn btn-sm btn-outline">
                        View requests
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-sm transition">
                        <h3 className="font-semibold text-gray-900">Smart search</h3>
                        <p className="text-gray-600 mt-2 text-sm">
                            Filter donors by blood group, district and upazila to find the best match.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-sm transition">
                        <h3 className="font-semibold text-gray-900">Request management</h3>
                        <p className="text-gray-600 mt-2 text-sm">
                            Create, view, update, and track donation request statuses from your dashboard.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-sm transition">
                        <h3 className="font-semibold text-gray-900">Role-based access</h3>
                        <p className="text-gray-600 mt-2 text-sm">
                            Admin, donor, and volunteer workflows — built for safer management.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Us */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-3">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Us</h2>
                        <p className="text-gray-600">
                            Need help or want to share feedback? Send a message and we'll get back to you.
                        </p>
                        <div className="mt-4">
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-semibold text-gray-900">+880 1XXXXXXXXX</p>
                        </div>
                    </div>

                    <form
                        className="space-y-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            alert("Thanks! We received your message.");
                            e.currentTarget.reset();
                        }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input className="input input-bordered w-full" name="name" required placeholder="Your name" />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input className="input input-bordered w-full" type="email" name="email" required placeholder="you@email.com" />
                            </div>
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">Message</span>
                            </label>
                            <textarea className="textarea textarea-bordered w-full min-h-28" name="message" required placeholder="Write your message..." />
                        </div>
                        <div className="flex items-center justify-end">
                            <button className="btn btn-error text-white" type="submit">
                                Send message
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Home;