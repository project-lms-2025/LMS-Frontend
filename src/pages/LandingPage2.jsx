import React from "react";
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
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
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

const LandingPage2 = () => {
  return (
    <div>
      <div className="bg-[url(/Subtract.png)] bg-contain bg-center h-screen">
        <div className="flex flex-col justify-center items-center h-full pt-40">
          <h3 className=" bg-white font-bold p-2 px-4 rounded-full text-sm  mb-8">
            Experience a broad learning platform
          </h3>
          <h1 className="text-5xl font-bold mb-6 ">
            Teach Anyone, Anytime, Anywhere
          </h1>
          <p className="text-lg  max-w-2xl font-light text-center mb-4">
            {" "}
            Empowering educators with smart tools to manage classroom track
            progress and engage student all in one place
          </p>
          <button className=" p-2 px-4 bg-black text-white font-bold rounded-xl hover:bg-primary-purple transition-colors">
            Start Demo
          </button>
          <img src="/hero1.png" alt="" className="w-[70%]" />
        </div>
        <section className="py-12 bg-white">
          {/* Header */}
          <div className="max-w-6xl mt-10 mx-auto px-4 mb-8 flex flex-col md:flex-row md:items-center">
            <h2 className="text-4xl font-bold text-gray-900">Stats</h2>
            <p className="mt-2 md:mt-0 md:ml-6 text-gray-600 max-w-sm ">
              Comparison of your standing with other learners and the topper of
              the live test
            </p>
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
                  <h3 className="text-xl font-semibold text-gray-900">Hey.</h3>
                  <p className="text-gray-700">
                    You were ranked <span className="font-bold">24/234</span> in
                    this test. You are doing better than{" "}
                    <span className="font-bold">80%</span> of learners who
                    appeared in the test.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="who-its-for" className="py-12 bg-white">
          {/* Header */}
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Who It's For
            </h2>
            <p className="mt-3 md:mt-0 md:ml-6 text-gray-700 max-w-xl">
              Our platform is designed to serve the entire educational ecosystem
              with specialized tools for every stakeholder.
            </p>
          </div>

          {/* Cards */}
          <div className="max-w-6xl mx-auto px-4 grid gap-6 grid-cols-1 md:grid-cols-2">
            {/* Student Card */}
            <div className="flex flex-col md:flex-row items-center bg-gray-100 border border-gray-300 rounded-3xl p-8">
              <div className="flex-1">
                <span className="inline-block bg-purple-500 text-black font-semibold px-4 py-1 rounded-md mb-4">
                  Student
                </span>
                <p className="text-gray-700 mb-6">
                  Learn smarter with personalized tools designed to enhance your
                  understanding and retention while making education more
                  engaging.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-gray-900 font-medium hover:underline"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Learn more
                </a>
              </div>
              <img
                src="/student1.png"
                alt="Student illustration"
                className="mt-8 md:mt-0 md:ml-8 w-44 h-auto"
              />
            </div>

            {/* Teacher Card */}
            <div className="flex flex-col md:flex-row items-center bg-purple-500 rounded-3xl p-8">
              <div className="flex-1">
                <span className="inline-block bg-white text-black font-semibold px-4 py-1 rounded-md mb-4">
                  Teacher
                </span>
                <p className="text-white mb-6">
                  Manage classes efficiently, reach more students, and create
                  engaging learning experiences with our intuitive tools.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-white font-medium hover:underline"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Learn more
                </a>
              </div>
              <img
                src="/teacher2.png"
                alt="Teacher illustration"
                className="mt-8 md:mt-0 md:ml-8 w-44 h-auto"
              />
            </div>
          </div>
        </section>
        <div className="flex">
            <div className="bg-primary-purple/60  w-1/2 h-40 rounded-tr-[3rem] border-r-[1px] border-dashed border-gray-100 " ></div>
            <div className="bg-primary-purple/60  w-1/2 h-40 rounded-tl-[3rem] border-l-[1px] border-dashed border-gray-100" ></div>
        </div>
        <section className="bg-primary-purple/60 text-gray-900">
          {/* CTA */}
          <div className="pt-16 pb-14 text-center px-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Learn how to unlock everyday wins for your team
            </h2>
            <p className="text-lg mb-8">
              Grow, empower, and retain top performers across all your frontline
              roles
            </p>
            <button
              onClick={() => {
                document
                  .getElementById("contact-us")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-white text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition"
            >
              Get In Touch
            </button>
          </div>

          {/* Footer grid */}
          <div
            id="contact-us"
            className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {/* Brand & social */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                Tomorrows Architect of AI
              </h3>
              <p className="text-gray-800">
                Expertise in Machine Learning, Deep Learning, Linear Algebra and
                Probability and Statistics
              </p>
              <div className="flex space-x-3  ">
                <a href="#" aria-label="Facebook" className="text-primary-purple" >
                  <Facebook size={20} />
                </a>
                <a href="#" aria-label="Twitter" className="text-primary-purple ">
                  <Twitter size={20} />
                </a>
                <a href="#" aria-label="Instagram" className="text-primary-purple ">
                  <Instagram size={20} />
                </a>
                <a href="#" aria-label="LinkedIn" className="text-primary-purple ">
                  <Linkedin size={20} />
                </a>
                <a href="#" aria-label="YouTube" className="text-primary-purple ">
                  <Youtube size={20} />
                </a>
              </div>
            </div>

            {/* Company links */}
            <div>
              <h4 className="text-lg font-semibold text-purple-700 mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-gray-800">
                <li>
                  <a href="#" className="hover:underline text-black">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline text-black">
                    Contact us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline text-black">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline text-black">
                    Culture
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline text-black">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Support links */}
            <div>
              <h4 className="text-lg font-semibold text-purple-700 mb-4">
                Support
              </h4>
              <ul className="space-y-2 text-gray-800">
                <li>
                  <a href="#" className="hover:underline text-black">
                    Getting started
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline text-black">
                    Help center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline text-black">
                    Server status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline text-black">
                    Report a bug
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline text-black">
                    Chat support
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact info */}
            <div>
              <h4 className="text-lg font-semibold text-purple-700 mb-4">
                Contact us
              </h4>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-center">
                  <Mail className="mr-2" /> team@teachertech
                </li>
                <li className="flex items-center">
                  <Phone className="mr-2" /> +91 8724966907
                </li>
                <li className="flex items-center">
                  <MapPin className="mr-2" /> Jaipur, Rajasthan
                </li>
              </ul>
            </div>
          </div>

          {/* Large brand stamp */}
          <div className="pb-8 text-center">
            <span className="text-[10rem] font-extrabold">TeacherTech</span>
          </div>
        </section>
      </div>

      <div></div>
    </div>
  );
};

export default LandingPage2;
