import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 text-white bg-blue-900">
        <div className="container px-4 mx-auto text-center">
          <h1 className="mb-6 text-5xl font-bold">
            Professional Legal Services
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-xl">
            Connect with experienced lawyers and get the legal help you need
          </p>
          {!isAuthenticated ? (
            <div className="space-x-4">
              <Link
                to="/register"
                className="px-8 py-3 font-semibold text-blue-900 transition-colors bg-white rounded-lg hover:bg-gray-100"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 font-semibold transition-colors border-2 border-white rounded-lg hover:bg-white hover:text-blue-900"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="px-8 py-3 font-semibold text-blue-900 transition-colors bg-white rounded-lg hover:bg-gray-100"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center">Why Choose Us?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Verified Lawyers</h3>
              <p className="text-gray-600">All lawyers are verified and licensed professionals</p>
            </div>
            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Expert Consultation</h3>
              <p className="text-gray-600">Get expert legal advice from experienced professionals</p>
            </div>
            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Easy Booking</h3>
              <p className="text-gray-600">Simple and quick appointment booking system</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-100">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center">What Our Clients Say</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 mr-4 bg-blue-100 rounded-full">
                  <span className="text-xl font-semibold text-blue-600">JD</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">John Doe</h3>
                  <p className="text-sm text-gray-500">Business Owner</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I was able to find the perfect lawyer for my business needs within minutes.
                The consultation was professional and the advice was exactly what I needed."
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 mr-4 bg-blue-100 rounded-full">
                  <span className="text-xl font-semibold text-blue-600">SM</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Sarah Miller</h3>
                  <p className="text-sm text-gray-500">Homeowner</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The platform made it so easy to connect with a real estate attorney.
                The entire process from booking to consultation was seamless."
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 mr-4 bg-blue-100 rounded-full">
                  <span className="text-xl font-semibold text-blue-600">RJ</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Robert Johnson</h3>
                  <p className="text-sm text-gray-500">Family Law Client</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I needed a family lawyer quickly, and this platform delivered.
                My lawyer was compassionate, knowledgeable, and helped me through a difficult time."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white bg-blue-800">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl">
            Join thousands of satisfied clients who found the right legal help
          </p>
          <Link
            to="/register"
            className="px-8 py-3 font-semibold text-blue-800 transition-colors bg-white rounded-lg hover:bg-gray-100"
          >
            Find a Lawyer Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;