"use client";

import { useState } from "react";
import { CreditCard, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  const plans = {
    pro: { name: "Pro", price: 999, features: ["10 mock interviews/month", "5 roadmaps/month", "AI features"] },
    ultimate: { name: "Ultimate", price: 2499, features: ["Unlimited everything", "Premium features", "Priority support"] },
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      alert(`Payment successful! Welcome to ${plans[selectedPlan as keyof typeof plans].name} plan!`);
      setProcessing(false);
      window.location.href = "/dashboard/settings?tab=subscription";
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <Link href="/dashboard/settings" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold">
        <ArrowLeft size={20} />
        Back to Settings
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upgrade Your Plan</h1>
        <p className="text-gray-600 mt-2">Choose your subscription and payment method</p>
      </div>

      {/* Payment Partners Section */}
      <div className="bg-gradient-to-r from-primary-50 to-coral-50 rounded-3xl p-6">
        <p className="text-sm text-gray-600 text-center mb-4 font-semibold">Trusted Payment Partners</p>
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <img src="/BKash-Logo.wine.svg" alt="bKash" className="h-8 grayscale hover:grayscale-0 transition opacity-60 hover:opacity-100" />
          <img src="/Nagad-logo.svg" alt="Nagad" className="h-8 grayscale hover:grayscale-0 transition opacity-60 hover:opacity-100" />
          <img src="/512px-Visa_Inc._logo.svg.png" alt="Visa" className="h-7 grayscale hover:grayscale-0 transition opacity-60 hover:opacity-100" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Plan Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(plans).map(([key, plan]) => (
              <button
                key={key}
                onClick={() => setSelectedPlan(key)}
                className={`text-left p-6 rounded-3xl border-4 transition ${
                  selectedPlan === key
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 bg-white hover:border-primary-300"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  {selectedPlan === key && (
                    <Check size={24} className="text-primary-600" />
                  )}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">৳{plan.price}</div>
                <div className="text-gray-600 mb-4">per month</div>
                <div className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check size={16} className="text-green-600" />
                      {feature}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h3>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setPaymentMethod("bkash")}
                className={`p-6 rounded-2xl border-2 transition flex items-center justify-center ${
                  paymentMethod === "bkash"
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200 hover:border-pink-300"
                }`}
              >
                <img 
                  src="/BKash-Logo.wine.svg" 
                  alt="bKash" 
                  className="h-12"
                />
              </button>

              <button
                onClick={() => setPaymentMethod("nagad")}
                className={`p-6 rounded-2xl border-2 transition flex items-center justify-center ${
                  paymentMethod === "nagad"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <img 
                  src="/Nagad-logo.svg" 
                  alt="Nagad" 
                  className="h-12"
                />
              </button>

              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-6 rounded-2xl border-2 transition flex items-center justify-center ${
                  paymentMethod === "card"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <img 
                  src="/512px-Visa_Inc._logo.svg.png" 
                  alt="Visa Card" 
                  className="h-10"
                />
              </button>
            </div>

            {/* Payment Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                    <input type="text" placeholder="123" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none" />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "bkash" && (
              <div className="p-6 bg-pink-50 rounded-2xl">
                <h4 className="font-bold text-gray-900 mb-2">bKash Payment</h4>
                <p className="text-sm text-gray-600 mb-4">You'll be redirected to bKash to complete payment</p>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">bKash Number</label>
                  <input type="tel" placeholder="01XXXXXXXXX" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none" />
                </div>
              </div>
            )}

            {paymentMethod === "nagad" && (
              <div className="p-6 bg-orange-50 rounded-2xl">
                <h4 className="font-bold text-gray-900 mb-2">Nagad Payment</h4>
                <p className="text-sm text-gray-600 mb-4">You'll be redirected to Nagad to complete payment</p>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nagad Number</label>
                  <input type="tel" placeholder="01XXXXXXXXX" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 shadow-lg sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-semibold text-gray-900">
                  {plans[selectedPlan as keyof typeof plans].name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing</span>
                <span className="font-semibold text-gray-900">Monthly</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-2xl text-primary-600">
                  ৳{plans[selectedPlan as keyof typeof plans].price}
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-gradient-to-r from-primary-600 to-coral-600 text-white py-4 rounded-xl hover:from-primary-700 hover:to-coral-700 transition font-bold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Complete Payment
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Secure payment • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

