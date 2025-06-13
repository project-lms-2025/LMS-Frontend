// src/components/Pricing.jsx
import React, { useState, useEffect, Fragment } from "react";
import { Check, Info, Mail, Phone, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, useInView } from "framer-motion";
const plans = [
  {
    name: "Starter Plan",
    yearlyPrice: 864,
    monthlyPrice: 99,
    perstudent: 500,
    original: 1080,
    headerClass: "bg-purple-200",
    features: [
      "Custom Domain",
      "Branded Website",
      "Live classes and recording",
      "Online Test System",
      "Payment gateway",
      "Email support",
      "Encrypted content and security",
      "Sell recorded courses with validity",
    ],
  },
  {
    name: "Professional Plan",
    yearlyPrice: 1299,
    monthlyPrice: 149,
    perstudent: 750,
    original: 1548,
    headerClass: "bg-gradient-to-r from-purple-700 to-pink-500 text-white",
    features: [
      "All in Starter plus advanced payment options (EMI)",
      "Launch your Test series",
      "One device login",
      "Same day Email & phone support",
      "Student Management dashboard",
      "Free Email marketing",
      "Alerts & notifications",
      "Stop screen recording & screenshots",
    ],
  },
  {
    name: "Premium Plan",
    yearlyPrice: 1999,
    monthlyPrice: 249,
    perstudent: 1000,
    original: 2376,
    headerClass: "bg-purple-200",
    features: [
      "All in Professional plus Branded App",
      "Enhanced content security",
      "Pro PPT & docs templates",
      "10 free video edits/mo",
      "Advanced marketing strategies",
      "Social media campaigns",
      "AI batch recommendations",
      "Analytics & growth reports",
    ],
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState("yearly");
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Open modal on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleDiscountSubmit = (e) => {
    e.preventDefault();
    // TODO: send email & phone to your backend here
    setIsOpen(false);
  };

  return (
    <>
      {/* —— Discount Dialog —— */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-50"
            leave="ease-in duration-150"
            leaveFrom="opacity-50"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          {/* Panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white dark:bg-primary-purple rounded-xl shadow-xl max-w-md w-full p-6 relative">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                  <X size={20} className="text-white" />
                </button>
                <Dialog.Title className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                  🎁 Claim Your Extra Discount
                </Dialog.Title>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Fill in your details below and we’ll send you a special code!
                </p>
                <form onSubmit={handleDiscountSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 w-full border rounded px-3 py-2 bg-white dark:bg-white text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="mt-1 w-full border rounded px-3 py-2 bg-white dark:bg-white text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-500  text-white rounded hover:bg-purple-800 transition"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* —— Pricing Content —— */}
      <div className="pt-20">
        <h2 className="text-5xl text-center font-bold text-gray-900 mt-8">
          Pricing Plans
        </h2>

        {/* Toggle */}
        <div className="flex items-center justify-center space-x-6 mt-6">
          {["yearly", "monthly", "student"].map((mode) => (
            <button
              key={mode}
              onClick={() => setBilling(mode)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span
                className={`w-5 h-5 rounded-full ${
                  billing === mode
                    ? "bg-purple-700"
                    : "border-2 border-gray-400"
                }`}
              />
              <span className="text-gray-800 capitalize">{mode}</span>
              {mode === "yearly" && billing === "yearly" && (
                <span className="ml-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                  Save up to 16%
                </span>
              )}
            </button>
          ))}
        </div>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 grid gap-8 grid-cols-1 md:grid-cols-3">
            {plans.map((plan) => {
              let displayPrice, priceLabel;
              if (billing === "yearly") {
                displayPrice = plan.yearlyPrice.toFixed(2);
                priceLabel = "per User/month, 1 Year commitment";
              } else if (billing === "monthly") {
                displayPrice = plan.monthlyPrice.toFixed(2);
                priceLabel = "per User/month";
              } else {
                displayPrice = plan.perstudent.toFixed(2);
                priceLabel = "per Student";
              }

              return (
                <div
                  key={plan.name}
                  className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden"
                >
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
                      <Info className="w-4 h-4 ml-1" />
                    </div>
                  </div>

                  <hr className="border-gray-200" />

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
        <section className="bg-primary-purple/60 text-gray-900">
          {/* CTA */}
          <div className="pt-16 pb-14 text-center px-4">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Start your journey with us - we'll forge your path to market
              leadership!
            </motion.h2>
          </div>

          {/* Footer grid */}
          <div
            id="contact-us"
            className="max-w-7xl mx-auto px-4 py-4 flex flex-col items-center justify-center"
          >
            <a
              href="#contact"
              className=" font-bold text-primary-purple px-4 py-2 bg-gray-300 rounded-full border-2 border-primary-purple text-2xl mb-4"
            >
              Contact us
            </a>
            <div className="  flex items-center gap-4 justify-between text-white text-lg font-semibold ">
              <div className="flex items-center">
                <Mail className="mr-2" /> contact@teachertech.in
              </div>
              <div className="flex items-center">
                <Phone className="mr-2" /> 91-0503-0503
              </div>
            </div>
          </div>

          {/* Large brand stamp */}
          <div className="pb-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:text-[10rem] text-[3rem] font-extrabold py-10"
            >
              TeacherTech
            </motion.h2>
          </div>
        </section>
      </div>
    </>
  );
}
