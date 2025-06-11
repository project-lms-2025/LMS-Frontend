// src/components/Pricing.jsx
import React, { useState } from "react";
import { Check, Info } from "lucide-react";

const plans = [
  {
    name: "Starter Plan",
    yearlyPrice: 864,
    monthlyPrice: 99,
    perstudent:500,
    original: 1080,
    headerClass: "bg-purple-200",
    features: [
      'Custom Domain',
      'Branded Website',
      'Live classes and recording',
      'Online Test System',
      'Payment gateway',
      'Email support',
      'Encrypted content and security',
      'Sell recorded courses with validity',
    ],
  },
  {
    name: "Professional Plan",
    yearlyPrice: 864,
    monthlyPrice: 99,
    perstudent:500,
    original: 1080,
    headerClass: "bg-gradient-to-r from-purple-700 to-pink-500 text-white",
    features: [
      'All in Starter and stunning Website design',
      'Create offers and discounts and advanced payment options like EMI',
      'Launch your Test series',
      'One device login',
      'Same day Email and phone support',
      'Student Management dashboard',
      'Free Email marketing',
      'Alerts and notifications',
      'Stop screen recording and screenshots',
    ],
  },
  {
    name: "Premium Plan",
    yearlyPrice: 864,
    perstudent:500,
    monthlyPrice: 99,
    original: 1080,
    headerClass: "bg-purple-200",
    features: [
      'All in Professional and Branded App for your institutes',
      'Enhanced security for your content',
      'Professional PPT and documentation templates',
      'Personalised Video editing (up to 10 free videos per month)',
      'Advanced Business and marketing strategies',
      'Professional social media Marketing',
      'AI Recommendation for new batches launch',
      'Analytics reports to grow your business',
    ],
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState("yearly");

  return (
    <div className="pt-20">
      <h2 className="text-5xl text-center font-bold text-gray-900 mt-8">
        Pricing Plans
      </h2>

      {/* Toggle */}
      <div className="flex items-center justify-center space-x-6 mt-6">
        <button
          onClick={() => setBilling("yearly")}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <span
            className={`w-5 h-5 rounded-full ${
              billing === "yearly"
                ? "bg-purple-700"
                : "border-2 border-gray-400"
            }`}
          />
          <span className="text-gray-800 text-lg">Yearly</span>
          {billing === "yearly" && (
            <span className="ml-2 bg-primary-purple/80 text-white text-xs px-2 py-1 rounded">
              Save up to 16%
            </span>
          )}
        </button>

        <button
          onClick={() => setBilling("monthly")}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <span
            className={`w-5 h-5 rounded-full ${
              billing === "monthly"
                ? "bg-purple-700"
                : "border-2 border-gray-400"
            }`}
          />
          <span className="text-gray-800 text-lg">Monthly</span>
        </button>
        <button
          onClick={() => setBilling("student")}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <span
            className={`w-5 h-5 rounded-full ${
              billing === "student"
                ? "bg-purple-700"
                : "border-2 border-gray-400"
            }`}
          />
          <span className="text-gray-800 text-lg">Per Student</span>
        </button>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid gap-8 grid-cols-1 md:grid-cols-3">
          {plans.map((plan) => {
            // Calculate price based on billing type
            let displayPrice;
            let priceLabel;
            
            if (billing === "yearly") {
              displayPrice = plan.yearlyPrice.toFixed(2);
              priceLabel = "per User/month, 1 Year commitment";
            } else if (billing === "monthly") {
              displayPrice = plan.monthlyPrice.toFixed(2);
              priceLabel = "per User/month";
            } else if (billing === "student") {
              displayPrice = plan.perstudent.toFixed(2);
              priceLabel = "per Student";
            }
            
            return (
              <div
                key={plan.name}
                className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <div className={`${plan.headerClass} px-6 py-4 text-center`}>
                  <h3
                    className={`text-lg font-medium ${
                      plan.headerClass.includes("text-white")
                        ? ""
                        : "text-gray-800"
                    }`}
                  >
                    {plan.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="p-6 text-center flex flex-col items-center">
                  <div className="text-4xl font-bold text-purple-700">
                    ₹{displayPrice}
                  </div>
                  {billing === "yearly" && (
                    <div className="flex items-center text-gray-400 mt-1">
                      <span className="line-through mr-2">
                        ₹{plan.original}
                      </span>
                      <span>INR</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <span>{priceLabel}</span>
                  </div>
                </div>

                {/* Rest of your component remains the same */}
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="font-semibold mb-4">Plan highlights:</h4>
                  <ul className="space-y-2 flex-1">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 flex-shrink-0 text-green-500 mt-1" />
                        <span className="ml-2 text-gray-700">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
