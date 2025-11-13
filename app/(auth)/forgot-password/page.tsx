"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, Info } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reset your password</h1>
            <p className="text-gray-600 mt-2">
              Enter the email you used to sign up. We&apos;ll send next steps to help you recover access.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border-2 border-primary-100 bg-primary-50/60 p-4">
            <div className="rounded-full bg-primary-100 text-primary-600 p-2">
              <Info size={20} />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              For now, password resets are handled manually while we complete the automated workflow. Submit your email
              below and our support team will reach out within one business day.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-coral-600 text-white py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-coral-700 transition flex items-center justify-center gap-2"
            >
              Request support
              <ArrowRight size={18} />
            </button>
          </form>

          {submitted && (
            <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-4 text-sm text-green-700">
              👍 We&apos;ve received your request. A member of the Upscale support team will follow up at{" "}
              <span className="font-semibold">{email}</span>. If the address isn&apos;t active anymore, please email{" "}
              <a href="mailto:support@upscale.careers" className="underline">
                support@upscale.careers
              </a>{" "}
              directly.
            </div>
          )}
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          Remembered your password?{" "}
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

