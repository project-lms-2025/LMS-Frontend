// src/components/Pricing.jsx
import React, { useState, useEffect, Fragment } from "react";
import { Check, Info, Loader2, Mail, Phone, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, useInView } from "framer-motion";
import { contactUs } from "../api/auth";
import toast from "react-hot-toast";
const plans = [
  {
    name: "Special Plan (For Rising Teacher)",
    monthlyPrice: 5999,
    yearlyPrice: 5400,
    perstudent: 499,
    original: 5999,
    headerClass: "bg-fuchsia-500 text-white",
    features: [
      "\uD83D\uDC68\u200D\uD83C\uDFEB Teach up to 100 students",
      "\uD83C\uDF10 Branded Website",
      "\uD83C\uDFA5 Live Classes + Class Recordings",
      "\uD83E\uDDEA Online Test System (Basic)",
      "\uD83D\uDCB3 Payment Gateway Integration",
      "\uD83D\uDCE7 Email Support",
      "\uD83D\uDD12 Encrypted Content & Platform Security",
      "\uD83C\uDF93 Sell Recorded Courses with Validity Controls",
      "\uD83D\uDCE4 Upload & Manage up to 10 Courses",
      "\uD83D\uDDFE Basic Attendance Tracking",
      "\uD83D\uDCDD Basic Student Progress Reports",
    ],
  },
  {
    name: "Professional Plan",
    monthlyPrice: 12999,
    yearlyPrice: 11700,
    perstudent: 599,
    original: 15000,
    headerClass: "bg-gradient-to-r from-purple-700 to-pink-500 text-white",
    features: [
      "🎨 Premium UI Design for Website + Secured App",
      "👥 Teach up to 250 students",
      "💳 Advanced Payment Options (EMI, Partial Payments)",
      "🚀 Launch & Manage Test Series",
      "⏱ Advanced Test Logic with Timers (NTA-style UI)",
      "🔐 One Device Login Restriction",
      "⚙️ Student Management Dashboard (Batch-wise analytics)",
      "📤 Upload & Manage up to 50 Courses",
      "📞 Same-day Email & Phone Support",
      "🔔 Alerts & Push Notifications (App + Email)",
      "📘 Free Digital Notes for Students"
    ],
  },
  {
    name: "Premium Plan",
    monthlyPrice: 19999,
    yearlyPrice: 17999,
    perstudent: 699,
    original: 22000,
    headerClass: "bg-purple-200",
    features: [
      "All in professional Plan +",
      "📱 Custom Branded Mobile App (Android + Web Link)",
      "🧩 Custom Logo Design (1-time professional branding package)",
      "👨‍🏫 Teach up to 300 students",
      "👔 Priority Support with Dedicated Success Manager",
      "🎞️ 5 Free Video Edits per Month (Intros, Branding, Trims)",
      "📄 Pro Presentation & Docs Templates",
      "📊 Analytics Dashboard & Growth Reports (Exportable)",
      "📅 Schedule-Based Class & Test Reminders",
      "📤 Upload & Manage Unlimited Courses",
      "📈 AI-Powered Batch Recommendations (based on engagement) for students",
      "📺 Smart Banner Integration for Upcoming Courses & Offers",
      "🛑 Screen Recording & Screenshot Protection",
      "📘 Advance Progress report of Student ",
      "🔔 Alerts for Student Fee, New student Regestration and Many more",
      "📈 Detailed Test Analysis for student performance",
      "💧 Watermarking in Live Classes"
    ],
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState("yearly");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const subject = "Pricing Page Contact Form";
  const message = "I'm interested in your pricing plans and would like to know more.";
  // Open modal on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);



  const handleDiscountSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await contactUs({ name, email, phone_number, subject, message });
      setIsOpen(false);
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      toast.success("Thank you for your interest! We'll get back to you soon.");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit the form. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
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
                  <X size={20} className="text-black" />
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
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-1 w-full border rounded px-3 py-2 bg-white dark:bg-white text-gray-900 dark:text-gray-100"
                    />
                  </div>
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
                      value={phone_number}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="mt-1 w-full border rounded px-3 py-2 bg-white dark:bg-white text-gray-900 dark:text-gray-900"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-800 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[100px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit'
                      )}
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
                  Save up to 10%
                </span>
              )}
            </button>
          ))}
        </div>

        <section className="py-16 bg-white">
          <div className="max-w mx-10  px-4 grid gap-4 grid-cols-1 md:grid-cols-3">
            {plans.map((plan) => {
              let displayPrice, priceLabel;
              if (billing === "yearly") {
                displayPrice = plan.yearlyPrice.toFixed(2);
                priceLabel = "Per month, 1 Year commitment";
              } else if (billing === "monthly") {
                displayPrice = plan.monthlyPrice.toFixed(2);
                priceLabel = "Per month";
              } else {
                displayPrice = plan.perstudent.toFixed(2);
                priceLabel = "Per Student(Minimum 5 students)";
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
                      ₹{Number(displayPrice).toLocaleString('en-IN')}
                    </div>
                    {billing === "yearly" && (
                      <div className="flex items-center text-gray-400 mt-1">
                        <span className="line-through mr-2">
                          ₹{Number(plan.original).toLocaleString('en-IN')}
                        </span>
                        <span>INR</span>
                      </div>
                    )}
                    {billing === "monthly" && (
                      <div className="flex items-center text-gray-400 mt-1">
                        <span className="line-through mr-2">
                          ₹{Number(plan.original).toLocaleString('en-IN')}
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
                      {plan.features.map((feat, idx) => {
                        const highlight =
                          feat === "All in Starter Plan +" ||
                          feat === "All in professional Plan +";
                        return (
                          <li key={idx} className="flex items-start">
                            <Check className="w-5 h-5 flex-shrink-0 text-green-500 mt-1" />
                            <span
                              className={
                                "ml-2 text-gray-700" +
                                (highlight
                                  ? " font-bold bg-purple-300 text-black px-2 py-0.5 rounded"
                                  : "")
                              }
                            >
                              {feat}
                            </span>
                          </li>
                        );
                      })}
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
