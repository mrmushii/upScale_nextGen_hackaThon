"use client";

import { useState, useEffect } from "react";
import { CreditCard, Check, ArrowLeft, Sparkles, Shield, Zap, Infinity, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const PLAN_FEATURES = {
  basic: {
    name: "Basic",
    price: 0,
    description: "Perfect for getting started",
    features: [
      "3 Mock Interviews/month",
      "1 Career Roadmap/month",
      "2 CV Analyses/month",
      "1 Evaluation Interview/month",
      "Community Access",
      "Basic Support",
    ],
    color: "from-gray-500 to-gray-600",
    icon: Shield,
  },
  pro: {
    name: "Pro",
    price: 999,
    description: "For serious job seekers",
    features: [
      "10 Mock Interviews/month",
      "5 Career Roadmaps/month",
      "10 CV Analyses/month",
      "5 Evaluation Interviews/month",
      "2 Mentor Sessions/month",
      "Priority Support",
      "Advanced AI Features",
    ],
    color: "from-primary-500 to-primary-600",
    icon: Zap,
    popular: true,
  },
  ultimate: {
    name: "Ultimate",
    price: 2499,
    description: "Unlimited everything",
    features: [
      "Unlimited Mock Interviews",
      "Unlimited Career Roadmaps",
      "Unlimited CV Analyses",
      "Unlimited Evaluation Interviews",
      "5 Mentor Sessions/month",
      "24/7 Priority Support",
      "All AI Features",
      "Early Access to New Features",
    ],
    color: "from-coral-500 to-coral-600",
    icon: Infinity,
  },
};

export default function PaymentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof PLAN_FEATURES>("pro");
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "card">("bkash");
  const [processing, setProcessing] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [paymentDetails, setPaymentDetails] = useState({
    phoneNumber: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  const fetchCurrentSubscription = async () => {
    try {
      const response = await fetch("/api/subscription");
      if (response.ok) {
        const data = await response.json();
        setCurrentSubscription(data);
        if (data.currentTier && data.currentTier !== "basic") {
          setSelectedPlan(data.currentTier);
        }
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const validatePayment = () => {
    if (selectedPlan === "basic") return true;

    if (paymentMethod === "bkash" || paymentMethod === "nagad") {
      if (!paymentDetails.phoneNumber || !/^01\d{9}$/.test(paymentDetails.phoneNumber)) {
        toast.error("Please enter a valid phone number (01XXXXXXXXX)");
        return false;
      }
    } else if (paymentMethod === "card") {
      if (!paymentDetails.cardNumber || paymentDetails.cardNumber.replace(/\s/g, "").length < 16) {
        toast.error("Please enter a valid card number");
        return false;
      }
      if (!paymentDetails.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) {
        toast.error("Please enter a valid expiry date (MM/YY)");
        return false;
      }
      if (!paymentDetails.cvv || paymentDetails.cvv.length < 3) {
        toast.error("Please enter a valid CVV");
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validatePayment()) return;

    setProcessing(true);
    const loadingToast = toast.loading("Processing your subscription...");

    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: selectedPlan,
          paymentMethod,
          paymentDetails: paymentMethod === "card" 
            ? {
                cardNumber: paymentDetails.cardNumber.replace(/\s/g, ""),
                expiryDate: paymentDetails.expiryDate,
                cvv: paymentDetails.cvv,
              }
            : {
                phoneNumber: paymentDetails.phoneNumber,
              },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success(`🎉 Successfully upgraded to ${PLAN_FEATURES[selectedPlan].name} plan!`, {
          duration: 5000,
        });
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.error || "Payment failed. Please try again.");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("An error occurred. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription info...</p>
        </div>
      </div>
    );
  }

  const selectedPlanData = PLAN_FEATURES[selectedPlan];
  const isCurrentPlan = currentSubscription?.currentTier === selectedPlan;

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="text-gray-600 mt-2">Unlock your career potential with the perfect plan</p>
        </div>
      </motion.div>

      {/* Current Subscription Banner */}
      {currentSubscription?.subscription && currentSubscription.subscription.status === "active" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-green-900 mb-1">
                Current Plan: {PLAN_FEATURES[currentSubscription.currentTier as keyof typeof PLAN_FEATURES]?.name}
              </h3>
              <p className="text-sm text-green-700">
                Renews on {new Date(currentSubscription.subscription.endDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })}
              </p>
            </div>
            {currentSubscription.subscription.autoRenew && (
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                Auto-renew ON
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Payment Partners */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-primary-50 to-coral-50 rounded-3xl p-6"
      >
        <p className="text-sm text-gray-600 text-center mb-4 font-semibold">Trusted Payment Partners</p>
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src="/BKash-Logo.wine.svg"
            alt="bKash"
            className="h-8 grayscale hover:grayscale-0 transition opacity-60 hover:opacity-100 cursor-pointer"
          />
          <motion.img
            whileHover={{ scale: 1.1 }}
            src="/Nagad-logo.svg"
            alt="Nagad"
            className="h-8 grayscale hover:grayscale-0 transition opacity-60 hover:opacity-100 cursor-pointer"
          />
          <motion.img
            whileHover={{ scale: 1.1 }}
            src="/512px-Visa_Inc._logo.svg.png"
            alt="Visa"
            className="h-7 grayscale hover:grayscale-0 transition opacity-60 hover:opacity-100 cursor-pointer"
          />
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Plan Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(PLAN_FEATURES).map(([key, plan]) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === key;
              const isCurrent = currentSubscription?.currentTier === key;

              return (
                <motion.button
                  key={key}
                  onClick={() => setSelectedPlan(key as keyof typeof PLAN_FEATURES)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`text-left p-6 rounded-3xl border-4 transition relative overflow-hidden ${
                    isSelected
                      ? `border-primary-500 bg-gradient-to-br ${plan.color} text-white shadow-2xl`
                      : "border-gray-200 bg-white hover:border-primary-300"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                        POPULAR
                      </span>
                    </div>
                  )}

                  {isCurrent && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                        CURRENT
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${isSelected ? "bg-white/20" : "bg-primary-50"}`}>
                      <Icon size={24} className={isSelected ? "text-white" : "text-primary-600"} />
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <Check size={24} className="text-white" />
                      </motion.div>
                    )}
                  </div>

                  <h3 className={`text-2xl font-bold mb-1 ${isSelected ? "text-white" : "text-gray-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${isSelected ? "text-white/80" : "text-gray-600"}`}>
                    {plan.description}
                  </p>

                  <div className={`text-4xl font-bold mb-2 ${isSelected ? "text-white" : "text-gray-900"}`}>
                    ৳{plan.price === 0 ? "Free" : plan.price.toLocaleString()}
                  </div>
                  <div className={`text-sm ${isSelected ? "text-white/80" : "text-gray-600"}`}>
                    {plan.price === 0 ? "Forever" : "per month"}
                  </div>

                  <div className="mt-6 space-y-2">
                    {plan.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-2 text-sm ${
                          isSelected ? "text-white/90" : "text-gray-700"
                        }`}
                      >
                        <Check size={16} className={isSelected ? "text-white" : "text-green-600"} />
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Payment Methods */}
          {selectedPlan !== "basic" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h3>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  { key: "bkash", label: "bKash", selectedClass: "border-pink-500 bg-pink-50" },
                  { key: "nagad", label: "Nagad", selectedClass: "border-orange-500 bg-orange-50" },
                  { key: "card", label: "Card", selectedClass: "border-blue-500 bg-blue-50" },
                ].map((method) => (
                  <motion.button
                    key={method.key}
                    onClick={() => setPaymentMethod(method.key as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-6 rounded-2xl border-2 transition flex items-center justify-center ${
                      paymentMethod === method.key
                        ? method.selectedClass
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {method.key === "card" ? (
                      <img
                        src="/512px-Visa_Inc._logo.svg.png"
                        alt="Visa Card"
                        className="h-10"
                      />
                    ) : (
                      <img
                        src={method.key === "bkash" ? "/BKash-Logo.wine.svg" : "/Nagad-logo.svg"}
                        alt={method.label}
                        className="h-12"
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Payment Forms */}
              <AnimatePresence mode="wait">
                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        value={paymentDetails.cardNumber}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            cardNumber: formatCardNumber(e.target.value),
                          })
                        }
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          value={paymentDetails.expiryDate}
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              expiryDate: formatExpiry(e.target.value),
                            })
                          }
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          maxLength={4}
                          value={paymentDetails.cvv}
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              cvv: e.target.value.replace(/\D/g, ""),
                            })
                          }
                          placeholder="123"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-6 rounded-2xl ${paymentMethod === "bkash" ? "bg-pink-50" : "bg-orange-50"}`}
                  >
                    <h4 className="font-bold text-gray-900 mb-2">
                      {paymentMethod === "bkash" ? "bKash" : "Nagad"} Payment
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      You'll be redirected to {paymentMethod === "bkash" ? "bKash" : "Nagad"} to complete payment
                    </p>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {paymentMethod === "bkash" ? "bKash" : "Nagad"} Number
                      </label>
                      <input
                        type="tel"
                        maxLength={11}
                        value={paymentDetails.phoneNumber}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            phoneNumber: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        placeholder="01XXXXXXXXX"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-lg sticky top-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-semibold text-gray-900">{selectedPlanData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing</span>
                <span className="font-semibold text-gray-900">Monthly</span>
              </div>
              {isCurrentPlan && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    ⚠️ You're already on this plan
                  </p>
                </div>
              )}
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-2xl text-primary-600">
                  ৳{selectedPlanData.price.toLocaleString()}
                </span>
              </div>
            </div>

            <motion.button
              onClick={handlePayment}
              disabled={processing || isCurrentPlan}
              whileHover={!processing && !isCurrentPlan ? { scale: 1.02 } : {}}
              whileTap={!processing && !isCurrentPlan ? { scale: 0.98 } : {}}
              className="w-full bg-gradient-to-r from-primary-600 to-coral-600 text-white py-4 rounded-xl hover:from-primary-700 hover:to-coral-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : isCurrentPlan ? (
                <>
                  <Check size={20} />
                  Current Plan
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  {selectedPlan === "basic" ? "Activate Free Plan" : "Complete Payment"}
                </>
              )}
            </motion.button>

            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Secure payment • Cancel anytime • 30-day money-back guarantee
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
