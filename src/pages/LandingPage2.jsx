import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { contactUs } from "../api/auth";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowRight,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import { Package, FileText, ShoppingCart, Megaphone } from "lucide-react";
import toast from "react-hot-toast";
const data = [
  { month: "Month1", revenue: 20000, branding: 5000, fee: 2000 },
  { month: "Month2", revenue: 50000, branding: 8000, fee: 3000 },
  { month: "Month3", revenue: 120000, branding: 15000, fee: 6000 },
  { month: "Month4", revenue: 250000, branding: 30000, fee: 12000 },
  { month: "Month5", revenue: 380000, branding: 45000, fee: 18000 },
  { month: "Month6", revenue: 480000, branding: 60000, fee: 24000 },
  { month: "Month7", revenue: 550000, branding: 70000, fee: 28000 },
  { month: "Month8", revenue: 640000, branding: 85000, fee: 34000 },
  { month: "Month9", revenue: 730000, branding: 92000, fee: 38000 },
  { month: "Month10", revenue: 820000, branding: 100000, fee: 42000 },
  { month: "Month11", revenue: 900000, branding: 110000, fee: 46000 },
  { month: "Month12", revenue: 1000000, branding: 120000, fee: 50000 },
];
const FEATURES = [
  {
    title: "Branded App & Website",
    content:
      "Custom iOS/Android apps and responsive websites built to showcase your brand and drive engagement across devices.",
    image:
      "/appWeb.jpeg", // replace with your actual paths
  },
  {
    title: "Test Series",
    content:
      "Comprehensive practice tests and mock exams to help learners assess and improve.",
    image: "/testSeries.jpeg",
  },
  {
    title: "Course Selling",
    content:
      "End-to-end platform setup for packaging, pricing, and selling your courses online.",
    image:
      "/courseSell.jpeg",
  },
  {
    title: "Marketing & Advertising",
    content:
      "Data-driven campaigns across channels to grow your audience and boost enrollments.",
    image:
      "/marketing.jpeg",
  },
  {
    title: "Video Editing and Professional Docs",
    content:
      "We provide stunning professional Document, Video editing  with advanced  animation and graphics.",
    image:
      "/editing.jpeg",
  },
];

const LandingPage2 = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Inquiry about pricing",
    message: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [active, setActive] = useState(0);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.email = "Valid email is required";
    if (!form.message.trim()) errs.message = "Message cannot be empty";
    if (!form.phone_number.trim()) errs.phone_number = "Phone number is required";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form", form);
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setStatus(null);
    try {
      await contactUs({
        ...form,
        subject: "Contact Form Submission" // Adding a default subject as it's required by the API
      });
      setStatus({ type: "success", msg: "Thanks! We'll be in touch shortly." });
      setForm({ name: "", email: "", message: "", phone_number: "" });
      toast.success("Thanks! We'll be in touch shortly.");
    } catch (err) {
      setStatus({ type: "error", msg: err.message || "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Create refs for each heading
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, amount: 0.5 });

  return (
    <div className="overflow-x-hidden">
      <div className="bg-[url(/Subtract.png)] lg:bg-cover bg-no-repeat bg-center h-screen">
        <div className="flex flex-col justify-center items-center h-full pt-14 md:pt-[24dvh]">
          <motion.div
            ref={headingRef}
            initial="hidden"
            animate={isHeadingInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="bg-white font-bold p-2 px-4 rounded-full text-sm mb-4"
          >
            Experience a best learning management system
          </motion.div>
          <motion.h1
            className="text-3xl text-center lg:text-5xl font-bold mb-6"
            initial="hidden"
            animate={isHeadingInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.8,
                  delay: 0.2,
                },
              },
            }}
          >
            Teach Anyone, Anytime, Anywhere
          </motion.h1>
          <motion.p
            className="text-md lg:text-lg max-w-2xl text-center font-light mb-4"
            initial="hidden"
            animate={isHeadingInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.8,
                  delay: 0.4,
                },
              },
            }}
          >
            Empowering educators with smart tools to manage classroom track
            progress and engage student all in one place
          </motion.p>
          {/* <button className=" p-2 px-4 bg-black text-white font-bold rounded-xl hover:bg-primary-purple transition-colors">
            Start Demo
          </button> */}
          <img src="/hero1.png" alt="" className="w-[90%] lg:w-[70%]" />
        </div>
        <section className="lg:py-32 bg-white">
          {/* Header */}
          <div className="max-w-6xl mt-10 mx-auto px-4 mb-8 flex flex-col md:flex-row md:items-center">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl w-full text-center font-bold text-gray-900"
            >
              Increase your Revenue 10× Faster
            </motion.h2>
            {/* <p className="mt-2 md:mt-0 md:ml-6 text-gray-600 max-w-sm ">
              Comparison of your standing with other learners and the topper of
              the live test
            </p> */}
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row bg-white border border-gray-300 rounded-3xl overflow-hidden">
              {/* Chart */}
              <div className="w-full md:w-2/3 h-80 p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#4ade80"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4ade80"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorBrand"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#fde047"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#fde047"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="colorFee" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#a78bfa"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#a78bfa"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#6b7280" }}
                      tickLine={false}
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      tickFormatter={(val) =>
                        `₹${(val / 1000).toLocaleString()}K`
                      }
                      tick={{ fill: "#6b7280" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ top: 0 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#22c55e"
                      fill="url(#colorRev)"
                    />
                    <Area
                      type="monotone"
                      dataKey="branding"
                      name="Branding and Marketing"
                      stroke="#facc15"
                      fill="url(#colorBrand)"
                    />
                    <Area
                      type="monotone"
                      dataKey="fee"
                      name="Platform fee"
                      stroke="#8b5cf6"
                      fill="url(#colorFee)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Text */}
              <div className="w-full md:w-1/3 p-6 flex items-center">
                <div className="space-y-4">
                  <p className="text-gray-700 text-xl font-semibold">
                    Online system are the demand of modern business, our proven
                    tech and marketing strategies will be the best investment
                    for your brand
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="product" className="py-20 pb-32">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl font-bold text-gray-800 mb-4"
            >
              Discover Our Services
            </motion.h2>
            <p className="text-gray-600 mb-12 text-lg">
              Everything you need to build, launch, and grow your online
              learning business.
            </p>
            <div className="max-w-7xl mx-auto  grid md:grid-cols-2 gap-12 items-start">
              {/* LEFT: tabs */}
              <div className="space-y-6">
                {FEATURES.map((f, i) => {
                  const isOpen = i === active;
                  return (
                    <div key={i}>
                      <button
                        onClick={() => setActive(isOpen ? -1 : i)}
                        className={`
                    w-full flex justify-between items-center
                    text-left text-gray-800 font-semibold text-lg
                    pl-4 py-3
                    border-l-4
                    ${isOpen ? "border-primary-purple" : "border-transparent"}
                    hover:border-primary-purple
                    transition
                  `}
                      >
                        {f.title}
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      {isOpen && (
                        <p className="mt-2 ml-8 text-gray-600 text-left text-base">
                          {f.content}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* RIGHT: image */}
              <div className="flex justify-center">
                <div className="bg-purple-100 rounded-2xl p-4">
                  <img
                    src={FEATURES[active]?.image}
                    alt={FEATURES[active]?.title}
                    className="rounded-xl shadow-lg min-h-96 max-h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="who-its-for" className="py-12 bg-white">
          {/* Header */}
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:items-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              Who It's For
            </motion.h2>
            <p className="mt-3 md:mt-0 md:ml-6 text-gray-700 max-w-xl">
              Our LMS platform is designed to serve the entire educational
              ecosystem with specialized tools for every Teacher or Course
              creating.
            </p>
          </div>

          {/* Cards */}
          <div className="max-w-6xl mx-auto px-4 grid gap-6 grid-cols-1 md:grid-cols-2">
            {/* Student Card */}
            <div className="flex flex-col md:flex-row items-center bg-gray-100 border border-gray-300 rounded-3xl p-8">
              <div className="flex-1">
                <span className="inline-block bg-primary-purple/70 text-white font-semibold px-4 py-1 rounded-md mb-4">
                  Rising Teacher/Course creator
                </span>
                <p className="text-gray-700 mb-6">
                  All in one platform: secure, automated tools for creating,
                  managing, and selling your courses with ease .
                </p>
              </div>
              <img
                src="/student1.png"
                alt="Student illustration"
                className="mt-8 md:mt-0 md:ml-8 w-44 h-auto"
              />
            </div>

            {/* Teacher Card */}
            <div className="flex flex-col md:flex-row items-center bg-primary-purple/70 rounded-3xl p-8">
              <div className="flex-1">
                <span className="inline-block bg-white text-black font-semibold px-4 py-1 rounded-md mb-4">
                  Coaching Institutes
                </span>
                <p className="text-white mb-6">
                  Manage classes efficiently, reach more students, and create
                  engaging learning experiences with our intuitive tools.
                </p>
              </div>
              <img
                src="/teacher2.png"
                alt="Teacher illustration"
                className="mt-8 md:mt-0 md:ml-8 w-44 h-auto"
              />
            </div>
          </div>
        </section>
        <section id="contact" className=" py-32">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl font-bold text-gray-800 text-center mb-12"
            >
              Get in Touch
            </motion.h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
              {/* Left info panel */}
              <div className="p-8 bg-primary-purple/60 text-white space-y-8">
                <p className="text-xl">
                  Have questions or want to learn more? Drop us a line and we’ll
                  get back to you as soon as possible!
                </p>

                <div className="space-y-6">
                  <div className="flex items-center">
                    <Mail className="w-6 h-6 mr-3 opacity-90" />
                    <a
                      href="mailto:contact@teachertech.in"
                      className="hover:underline text-white font-semibold"
                    >
                      contact@teachertech.in
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-6 h-6 mr-3 opacity-90" />
                    <a
                      href="tel:+919105030503"
                      className="hover:underline text-white font-semibold"
                    >
                      91-0503-0503
                    </a>
                  </div>
                </div>
              </div>

              {/* Right form panel */}
              <div className="p-8 border border-primary-purple/60 rounded-r-2xl">
                {status && (
                  <div
                    className={`mb-6 p-4 rounded ${
                      status.type === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {status.msg}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone no
                    </label>
                    <input
                      type="text"
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.phone_number ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows="3"
                      value={form.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.message ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      // onClick={handleSubmit}
                      className="bg-primary-purple/60 hover:bg-primary-purple text-white font-semibold px-6 py-3 rounded-lg shadow-sm transition disabled:opacity-50"
                    >
                      {submitting ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        <div className="flex">
          <div className="bg-primary-purple/60  w-1/2 h-40 rounded-tr-[3rem] border-r-[1px] border-dashed border-gray-100 "></div>
          <div className="bg-primary-purple/60  w-1/2 h-40 rounded-tl-[3rem] border-l-[1px] border-dashed border-gray-100"></div>
        </div>
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
              className="lg:text-[10rem] text-[3rem] font-extrabold py-10">
              TeacherTech
            </motion.h2>
            
          </div>
        </section>
      </div>

      <div></div>
    </div>
  );
};

export default LandingPage2;
