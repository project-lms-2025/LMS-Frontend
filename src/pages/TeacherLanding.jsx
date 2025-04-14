import { Calendar, ChevronRight, Circle, MoveRight, Star } from 'lucide-react';
import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const TeacherLanding = () => {
    const benefits = [
        {
            title: "Exam-Like Mock Tests",
            desc: "Full-Length Tests based on actual JEE & GATE exam patterns",
            color: "bg-blue-500",
        },
        {
            title: "AI-Powered Performance Analysis",
            desc: "Detailed Performance Breakdown (Speed, Accuracy, Weak Areas)",
            color: "bg-red-400",
        },
        {
            title: "Rank Leaderboard",
            desc: "Real-time ranking updates after every test",
            color: "bg-green-400",
        },
        {
            title: "Adaptive Learning",
            desc: "AI suggests customized test plans based on weak areas",
            color: "bg-cyan-600",
        },
        {
            title: "Interactive Test Interface",
            desc: "Mobile & Web Support – Take tests anytime, anywhere",
            color: "bg-orange-400",
        },
        {
            title: "Affordable & Value-Packed Plans",
            desc: "Our dedicated team is available around the clock to help you.",
            color: "bg-purple-500",
        },
    ];

    const testSeriesData = [
        {
            title: "Data Science & Artificial Intelligence test Series",
            totalTests: 90,
            freeTests: 9,
            startDate: "31 March 2025",
            features: ["50 latest test", "50 latest test", "50 latest test"],
        },
        {
            title: "Data Science & Artificial Intelligence test Series",
            totalTests: 90,
            freeTests: 9,
            startDate: "31 March 2025",
            features: ["50 latest test", "50 latest test", "50 latest test"],
        },
        {
            title: "Data Science & Artificial Intelligence test Series",
            totalTests: 90,
            freeTests: 9,
            startDate: "31 March 2025",
            features: ["50 latest test", "50 latest test", "50 latest test"],
        },
    ];

    const reviews = Array(3).fill({
        name: "Sparsh Saxena",
        course: "ML +Maths Pro Course",
        text: `Manoj Sir and Sahitya Sir’s teaching style is unmatched. They covered every topic relevant to GATE DA with precision and depth, unlike many educators who skip core concepts. Their content was lifesaving when I discovered gaps in my understanding from other platforms. Manoj Sir's exceptional ML and his guidance in Probability, Statistics, Linear Algebra, and Calculus, along with Sahitya Sir’s insights into Python Data Structures and Algorithms, proved invaluable for my GATE DA exam.`,
        rating: 4,
    });

    const faqData = [
        {
            question: 'Can I attempt a test multiple times?',
            answer:
                'Lorem ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
        },
        {
            question: 'Can I attempt a test multiple times?',
            answer:
                'Yes, you can attempt the test multiple times to improve your score and gain more practice.',
        },
        {
            question: 'Can I attempt a test multiple times?',
            answer:
                'Absolutely. Each attempt will be recorded, and you can review your progress over time.',
        },
        {
            question: 'Can I attempt a test multiple times?',
            answer:
                'Test attempts are unlimited, though some tests may have cooldown periods depending on the rules.',
        },
        {
            question: 'Can I attempt a test multiple times?',
            answer:
                'Repeated attempts help you reinforce the knowledge and gain confidence before the real exam.',
        },
        {
            question: 'Can I attempt a test multiple times?',
            answer:
                'Of course! There is no limit to how many times you can attempt the practice test.',
        },
    ];

    const [openIndexes, setOpenIndexes] = useState(Array(faqData.length).fill(false));

    // Toggle function to update the open state for a specific FAQ item
    const toggleFaq = (index) => {
        setOpenIndexes((prev) =>
            prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
        );
    };
    return (
        <div>
            <div className="flex justify-center items-center max-w-[85rem]   ">
                <div className="w-full bg-[url(/herobg.png)] bg-contain bg-center mt-10 bg-no-repeat  ">
                    <div className='my-20 mx-24' >
                        <h1 className=' text-[#E69632] text-2xl mb-4' > 100% SATISFACTION GUARANTEE</h1>
                        <h2 className='text-7xl mb-4' >The Top Choice For <br /> Gate <span className="  text-primary-purple ">Data Science and <br /> Artificial  <span className='bg-[url(/line.png)] bg-bottom bg-no-repeat' >Intelligence</span>  </span> </h2>
                        <h3 className='w-[30rem] text-2xl ' >"JEE & GATE mock tests with AI analysis, real-time leaderboard, expert solutions, personalized improvement plans, affordable pricing, and flexible access."</h3>

                        <div className='flex justify-between items-center w-96' >
                            <button className='bg-[#E69632] text-white font-bold py-2 px-4 rounded-full mt-8 text-xl' >Get Started</button>
                            <button className='bg-white border-2 border-black  text-black font-bold py-2 px-4 rounded-full mt-8 text-xl' >Book a Free Demo</button>
                        </div>
                    </div>
                </div>
            </div>

            <section className="bg-[#DCD1F1] py-16 px-6 md:px-24">
                <div className="flex w-full gap-12">
                    <div className="">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#0B0B33] mb-10">
                            Explore Various Test Series
                        </h2>

                        <ul className="text-[#0B0B33] space-y-4 mb-10 text-lg">
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3" />
                                The user needs to select the subject category to view the list of upcoming exams.
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3" />
                                After reviewing the exam details, users will be able to participate in the exam by paying the entry fee.
                            </li>
                        </ul>

                        <button className="bg-orange-400 text-white font-semibold py-3 px-8 rounded-full hover:bg-orange-500 transition mb-10">
                            ENROLL NOW
                        </button>
                    </div>

                    <div className="flex w-[50%] flex-col md:flex-row gap-6">
                        {/* JEE Exam Card */}
                        <div className="bg-white p-8 rounded-xl shadow-md flex-1 text-center">
                            <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full mb-6" />
                            <h3 className="text-xl font-semibold">Jee Exam <br /> Test Series</h3>
                            <p className="text-gray-600 mt-4">
                                “Crack JEE Main & Advanced <br />
                                with Expert–Curated Test <br />
                                Series!”
                            </p>
                        </div>

                        {/* GATE Exam Card */}
                        <div className="bg-white p-8 rounded-xl shadow-md flex-1 text-center">
                            <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full mb-6" />
                            <h3 className="text-xl font-semibold">Gate Exam <br /> Test Series</h3>
                            <p className="text-gray-600 mt-4">
                                “Crack JEE Main & Advanced <br />
                                with Expert–Curated Test <br />
                                Series!”
                            </p>
                        </div>
                    </div>
                </div>

            </section>

            <div className="  ">
                <img src="/numbers.png" alt="" className='w-full' />
            </div>

            <section className="py-2 my-10 px-6 md:px-24 bg-white">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-12">
                    <div className="max-w-xl">
                        <h4 className="text-purple-600 font-semibold mb-2">Benifits</h4>
                        <h2 className="text-4xl font-bold text-[#0B0B33]">
                            Don’t just take our word fot it our result speak for themselves
                        </h2>
                    </div>
                    <p className="text-gray-600 text-lg mt-6 md:mt-0 max-w-md">
                        "JEE & GATE mock tests with AI analysis, real-time leaderboard, expert solutions,
                        personalized improvement plans, affordable pricing, and flexible access."
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="bg-[#F8F8FD] mb-6 rounded-2xl p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 shadow-md">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className={`w-4 h-4 mt-2 rounded-full ${benefit.color}`} />
                            <div>
                                <h3 className="font-semibold text-xl text-[#0B0B33]">{benefit.title}</h3>
                                <p className="text-gray-500 mt-1 text-sm">{benefit.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-14 bg-[url(/cardsbg.png)] bg-no-repeat bg-contain bg-position-[center_top_0.2rem] px-6 md:px-24 bg-white relative overflow-hidden">
                {/* Heading */}
                <div className="text-center my-12">
                    <h2 className="text-4xl font-bold text-[#0B0B33] mb-4">Our Popular Test Series</h2>
                    <p className="text-gray-600">
                        Bless your efforts and sharpen your skills with exams hosted by industry experts.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    {testSeriesData.map((test, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-b from-[#E3D7F8] to-white rounded-xl shadow-md p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white p-2 rounded-full shadow-md">
                                    <img
                                        src="https://img.icons8.com/ios-filled/30/graduation-cap.png"
                                        alt="icon"
                                        className="w-6 h-6"
                                    />
                                </div>
                                <span className="text-sm text-white bg-yellow-400 px-3 py-1 rounded-full shadow">
                                    ⚡ 1k User
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-[#0B0B33] mb-2 leading-snug">
                                {test.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                                <span className="font-medium text-[#0B0B33]">{test.totalTests} Total Test</span> |
                                <span className="text-green-500 font-medium ml-2">{test.freeTests} Free Test</span>
                            </p>
                            <hr className="my-4" />

                            {/* Features */}
                            <ul className="space-y-3 mb-6 text-sm">
                                <li className="flex items-center gap-3">
                                    <Calendar className="text-purple-600" />
                                    <span>Test Starts Date</span>
                                    <span className="ml-auto text-gray-500">{test.startDate}</span>
                                </li>
                                {test.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <Calendar className="text-purple-600" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full bg-[#D1B5F9] hover:bg-[#c29def] text-purple-900 font-medium py-2 rounded-md transition">
                                View Test Series
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-gradient-to-b from-[#e9ddf671] to-[#E0D1F1] py-20 px-6 md:px-24 text-center">
                {/* Title */}
                <h2 className="text-4xl font-bold text-[#0B0B33] mb-4">Learning Impact</h2>
                <p className="text-gray-600 mb-12 max-w-xl mx-auto">
                    Bless your efforts and sharpen your skills with exams hosted by industry experts.
                </p>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Card 1 */}
                    <div className="bg-white rounded-2xl shadow  flex items-center gap-6 text-left">
                        <img
                            src="/right-stud.png" /// replace with actual image URL or local import
                            alt="Student Illustration"
                            className="w-40 h-40 mt-4 object-contain"
                        />
                        <div>
                            <h3 className="text-2xl font-bold text-[#0B0B33] mb-2">100+ Students</h3>
                            <p className="text-gray-500">Get into iit</p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-2xl shadow flex items-center gap-6 text-left">
                        <img
                            src="/left-stud.png" // replace with actual image URL or local import
                            alt="Teacher Illustration"
                            className="w-40 h-40 mt-4 object-contain"
                        />
                        <div>
                            <h3 className="text-2xl font-bold text-[#0B0B33] mb-2">100+ Tests</h3>
                            <p className="text-gray-500">Practice make you perfectly ready for your real test.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-b from-[#E2CDEA] to-[#F7F5FA] py-20 px-6 md:px-24">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-[#0B0B33]">Students Reviews</h2>
                    <p className="text-gray-600 mt-3">
                        Bless your efforts and sharpen your skills with exams hosted by industry experts.
                    </p>
                </div>

                {/* Reviews */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg p-6 text-left border-b-4 border-[#9B7BF3]"
                        >
                            {/* Profile */}
                            <div className="flex items-center gap-4 mb-4">
                                <Circle className="text-gray-400 text-4xl" />
                                <div>
                                    <h4 className="font-bold text-lg text-[#0B0B33]">{review.name}</h4>
                                    <p className="text-sm text-gray-500">{review.course}</p>
                                </div>
                            </div>

                            {/* Review Text */}
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">{review.text}</p>

                            {/* Rating */}
                            <div className="flex text-yellow-500 text-lg">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-10">
                <div className="bg-gradient-to-r from-pink-50 to-white rounded-3xl p-8 md:p-12 shadow-md">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {/* Left Column: Title, Subheading, Description, and Image */}
                        <div className="md:w-2/4 space-y-6">
                            <span className="block text-lg font-medium text-purple-500 mb-1">
                                FAQ
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                                Prepare Yourself For Exam
                            </h2>
                            
                            <div className="w-full mt-20 h-auto">
                                {/* Replace the URL with your own image */}
                                <img
                                    src="/FAQ_IMG.png"
                                    alt="Exam Preparation"
                                    className=" w-96 object-contain"
                                />
                            </div>
                        </div>

                        {/* Right Column: FAQ Accordion */}
                        <div className="md:w-3/4">
                            {faqData.map((item, index) => (
                                <div key={index} className="border-b border-gray-200 py-4">
                                    <button
                                        className="flex justify-between items-center w-full focus:outline-none"
                                        onClick={() => toggleFaq(index)}
                                    >
                                        <span className="text-base font-semibold text-gray-800">
                                            {item.question}
                                        </span>
                                        <span className="text-gray-500 ml-2">
                                            {openIndexes[index] ? <FaChevronUp /> : <FaChevronDown />}
                                        </span>
                                    </button>
                                    {openIndexes[index] && (
                                        <div className="mt-2 text-gray-600 text-sm leading-relaxed">
                                            {item.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="flex flex-col items-center ">
                <div className=" h-20 flex justify-between w-full">
                    <div className='bg-[#DCD1F1] w-full h-20 rounded-tr-full' ></div>
                    <div className=' bg-[#DCD1F1] w-full h-20 rounded-tl-full' ></div>
                </div>
                <div className="text-center flex-col items-center justify-center bg-[#DCD1F1] w-full py-10 px-6 md:px-24">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Learn how to unlock everyday wins for your team
                    </h2>
                    <p className="text-lg text-gray-700 mt-4">
                        Grow, empower, and retain top performers across all your frontline roles
                    </p>
                </div>
                <div className='bg-[#DCD1F1]  w-full flex justify-center items-center py-10' >
                    <button className="#contact-form flex flex-row items-center text-black bg-white rounded-full  p-4 ">Get In Touch
                        <ChevronRight className=" " />
                    </button>
                </div>
            </section>

            <footer className="bg-[#DCD1F1] text-gray-800 py-8">
                {/* Container */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Top Section */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
                        {/* Left Column */}
                        <div className="max-w-md">
                            <h1 className="text-2xl font-bold text-purple-900">
                                Tomorrows Architect of AI
                            </h1>
                            <p className="mt-2 text-gray-700">
                                Expertise in Machine Learning, Deep Learning, Linear Algebra and Probability and Statistics
                            </p>
                            {/* Social Icons */}
                            <div className="flex items-center gap-4 mt-4">
                                <a
                                    href="#facebook"
                                    aria-label="Facebook"
                                    className="text-gray-600 hover:text-purple-700 transition-colors"
                                >
                                    {/* Replace with any icon library or SVG */}
                                    <svg
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5"
                                    >
                                        <path d="M22,12A10,10,0,1,0,12,22h0A10,10,0,0,0,22,12ZM13.48,17.27V12.93h1.45l.21-1.64H13.48V9.82c0-.47.13-.8.79-.8h.84V7.58a11.51,11.51,0,0,0-1.24-.06,2.28,2.28,0,0,0-2.43,2.49v1.2H10.13v1.64h1.31v4.34Z"></path>
                                    </svg>
                                </a>
                                <a
                                    href="#twitter"
                                    aria-label="Twitter"
                                    className="text-gray-600 hover:text-purple-700 transition-colors"
                                >
                                    <svg
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5"
                                    >
                                        <path d="M24,4.56a9.87,9.87,0,0,1-2.82.77,4.93,4.93,0,0,0,2.16-2.72,9.8,9.8,0,0,1-3.13,1.19A4.92,4.92,0,0,0,16.64,3a5,5,0,0,0-4.91,6.12,13.94,13.94,0,0,1-10.13-5.14,4.93,4.93,0,0,0,1.52,6.56A4.81,4.81,0,0,1,1,9.86v.06A4.92,4.92,0,0,0,4.92,15a4.9,4.9,0,0,1-2.21.08,4.93,4.93,0,0,0,4.6,3.42,9.88,9.88,0,0,1-6.12,2.11,9.71,9.71,0,0,1-1.18-.07A13.94,13.94,0,0,0,7.55,22,14,14,0,0,0,21.81,7.65c0-.21,0-.42,0-.63A9.93,9.93,0,0,0,24,4.56Z"></path>
                                    </svg>
                                </a>
                                <a
                                    href="#github"
                                    aria-label="GitHub"
                                    className="text-gray-600 hover:text-purple-700 transition-colors"
                                >
                                    <svg
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5"
                                    >
                                        <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.869 10.943c.576.107.787-.25.787-.556 0-.274-.009-1-.015-2-3.2.691-3.88-1.545-3.88-1.545a3.053 3.053 0 0 0-1.28-1.687c-1.046-.71.08-.695.08-.695a2.427 2.427 0 0 1 1.77 1.19 2.451 2.451 0 0 0 3.354.96 2.454 2.454 0 0 1 .73-1.54c-2.556-.29-5.245-1.278-5.245-5.687a4.449 4.449 0 0 1 1.185-3.084 4.13 4.13 0 0 1 .111-3.041s.967-.31 3.172 1.183a10.782 10.782 0 0 1 5.78 0c2.206-1.493 3.172-1.183 3.172-1.183a4.12 4.12 0 0 1 .111 3.04A4.449 4.449 0 0 1 19.88 10.7c0 4.42-2.693 5.39-5.257 5.676a2.747 2.747 0 0 1 .79 2.13c0 1.538-.014 2.78-.014 3.16 0 .31.208.67.794.55A11.5 11.5 0 0 0 12 .5Z"></path>
                                    </svg>
                                </a>
                                <a
                                    href="#linkedin"
                                    aria-label="LinkedIn"
                                    className="text-gray-600 hover:text-purple-700 transition-colors"
                                >
                                    <svg
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5"
                                    >
                                        <path d="M19 0h-14a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5v-14a5 5 0 0 0-5-5zm-11 19h-3v-10h3zm-1.5-11.25a1.75 1.75 0 0 1 0-3.5 1.75 1.75 0 0 1 0 3.5zm13.5 11.25h-3v-5.36c0-1.28-.02-2.93-1.79-2.93-1.8 0-2.07 1.4-2.07 2.84v5.45h-3v-10h2.88v1.37h.04a3.16 3.16 0 0 1 2.84-1.56c3.04 0 3.6 2 3.6 4.59z"></path>
                                    </svg>
                                </a>
                                <a
                                    href="#youtube"
                                    aria-label="YouTube"
                                    className="text-gray-600 hover:text-purple-700 transition-colors"
                                >
                                    <svg
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5"
                                    >
                                        <path d="M21.58 7.51a2.73 2.73 0 0 0-1.93-1.93C18.43 5.16 12 5.16 12 5.16s-6.43 0-7.65.42A2.73 2.73 0 0 0 2.42 7.51 28.07 28.07 0 0 0 2 12a28.07 28.07 0 0 0 .42 4.49 2.73 2.73 0 0 0 1.93 1.93c1.22.42 7.65.42 7.65.42s6.43 0 7.65-.42a2.73 2.73 0 0 0 1.93-1.93A28.07 28.07 0 0 0 22 12a28.07 28.07 0 0 0-.42-4.49ZM10 15.27v-6l5.2 3Z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Right Columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full md:w-auto">
                            {/* Company */}
                            <div>
                                <h2 className="text-lg font-semibold text-purple-900 mb-3">
                                    Company
                                </h2>
                                <ul className="space-y-2 text-black">
                                    <li>
                                        <a href="#about" className="hover:text-purple-700 text-black">
                                            About
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#contact-us" className="hover:text-purple-700 text-black">
                                            Contact us
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#careers" className="hover:text-purple-700 text-black">
                                            Careers
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#culture" className="hover:text-purple-700 text-black">
                                            Culture
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Support */}
                            <div>
                                <h2 className="text-lg font-semibold text-purple-900 mb-3">
                                    Support
                                </h2>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#getting-started" className="hover:text-purple-700 text-black">
                                            Getting started
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#help-center" className="hover:text-purple-700 text-black">
                                            Help center
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#server-status" className="hover:text-purple-700 text-black">
                                            Server status
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#report-bug" className="hover:text-purple-700 text-black">
                                            Report a bug
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#chat-support" className="hover:text-purple-700 text-black">
                                            Chat support
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Contact Us */}
                            <div>
                                <h2 className="text-lg font-semibold text-purple-900 mb-3">
                                    Contacts us
                                </h2>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <svg
                                            className="w-4 h-4 text-purple-700"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 5a1 1 0 011-1h3.28a1 1 0 01.71.29l2.3 2.3a1 1 0 01.29.7v3.28a1 1 0 01-1 1H8l-5-5V6a1 1 0 011-1zM13 5h3a2 2 0 012 2v3m-4.24 3.76l1.24.62c.57.28 1.21.42 1.85.42a2 2 0 002-2v-1a2 2 0 00-2-2h-3c-1.6 0-3.13.64-4.24 1.76l-5.76 5.76a2 2 0 000 2.83l1.17 1.17a2 2 0 002.83 0l5.76-5.76z"
                                            />
                                        </svg>
                                        <a href="#phone" className="hover:text-purple-700 text-black">
                                            8479680909
                                        </a>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg
                                            className="w-4 h-4 text-purple-700"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3.75 4.75l8.25 8.25 8.25-8.25M3.75 19.25l8.25-8.25 8.25 8.25"
                                            />
                                        </svg>
                                        <a href="#location" className="hover:text-purple-700 text-black">
                                            Jaipur, Rajasthan
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-300 my-8"></div>

                    {/* Bottom Section */}
                    <div className="text-center">
                        <p className="text-7xl font-bold text-purple-900">
                            Tomorrows Architect of AI
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            &copy; {new Date().getFullYear()} All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default TeacherLanding