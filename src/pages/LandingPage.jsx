import React from "react";
import {
  Book,
  Users,
  Trophy,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: Book,
      title: "Expert-Led Courses",
      description:
        "Learn from industry experts and gain practical knowledge that matters.",
      stats: "500+ Courses",
    },
    {
      icon: Users,
      title: "Interactive Learning",
      description:
        "Engage with peers and mentors in real-time collaborative sessions.",
      stats: "50K+ Students",
    },
    {
      icon: Trophy,
      title: "Recognized Certification",
      description: "Earn certificates valued by top employers worldwide.",
      stats: "98% Success Rate",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col px-20  bg-primary-white dark:bg-primary-purple transition-colors">
      <main className="flex-grow ">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center py-20 px-4 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-skyblue/20 to-primary-purple/20 dark:from-gray-800 dark:to-gray-900" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h20v20H0z%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.03%22%2F%3E%3C%2Fsvg%3E')] opacity-20" />
          </div>

          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent-yellow/20 dark:bg-accent-yellow/30 text-primary-purple dark:text-accent-yellow font-medium text-sm mb-6">
                  <Star className="w-4 h-4 mr-2" />
                  Trusted by over 50,000 students across the country
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 dark:text-primary-white leading-tight">
                  Learn Without{" "}
                  <span className="text-primary-purple dark:text-accent-yellow">
                    Limits
                  </span>
                </h1>
                <p className="text-xl dark:text-secondary-gray dark:text-primary-white/80 mb-8 max-w-xl">
                  Unlock your potential with our world-class courses. Join a
                  community of lifelong learners and transform your career today.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="signin">
                    <button className="bg-primary-purple dark:bg-white dark:text-primary-purple text-primary-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-purple/90 transition-colors inline-flex items-center">
                      Start Learning
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                  </a>
                  <button className="border-2 border-secondary-gray dark:border-primary-white/20 text-primary-purple dark:text-primary-white px-8 py-4 rounded-lg text-lg font-semibold hover:border-accent-skyblue hover:text-accent-skyblue dark:hover:border-accent-skyblue dark:hover:text-accent-skyblue transition-colors inline-flex items-center">
                    Watch Demo
                    <Play className="ml-2 w-5 h-5" />
                  </button>
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                      <img
                        key={i}
                        src={`https://randomuser.me/api/portraits/men/${i % 50}.jpg`}
                        alt={`Student ${i}`}
                        className="w-12 h-12 rounded-full border-4 border-primary-white dark:border-primary-purple"
                      />
                    ))}
                  </div>
                  <div className="text-sm text-secondary-gray/200 dark:text-primary-white/80">
                    Join{" "}
                    <span className="font-bold text-primary-purple dark:text-accent-yellow">
                      2,000+
                    </span>{" "}
                    students
                    <br />
                    already learning with us
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                    alt="Students learning"
                    className="w-full h-auto"
                  />
                </div>
                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -left-6 bg-primary-white dark:bg-primary-purple p-6 rounded-xl shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent-yellow/20 dark:bg-accent-yellow/30 rounded-lg">
                      <Trophy className="w-8 h-8 text-primary-purple dark:text-accent-yellow" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold dark:text-primary-white">
                        15K+
                      </div>
                      <div className="text-secondary-gray dark:text-primary-white/80">
                        Course Completed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 dark:text-primary-white">
                Why Students Choose{" "}
                <span className="text-primary-purple dark:text-accent-yellow">
                TeacherTech
                </span>
              </h2>
              <p className="text-xl text-secondary-gray/120 dark:text-primary-white/80 max-w-2xl mx-auto">
                Experience the future of education with our innovative learning
                platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 bg-primary-white dark:bg-primary-purple rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="p-4 bg-accent-yellow/20 dark:bg-accent-yellow/30 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-primary-purple dark:text-accent-yellow" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 dark:text-primary-white">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-gray/120 dark:text-primary-white/80 mb-6">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-primary-purple dark:text-accent-yellow font-semibold">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {feature.stats}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-purple to-accent-skyblue opacity-90" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h20v20H0z%22%20fill%3D%22%23fff%22%20fill-opacity%3D%22.05%22%2F%3E%3C%2Fsvg%3E')] opacity-20" />
          </div>

          <div className="container mx-auto text-center relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-primary-white drop-shadow-xl">
              Start Your Learning Journey Today
            </h2>

            <p className="text-xl dark:text-primary-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are already transforming their
              careers with TeacherTech.
            </p>
            <button className="bg-gray-100 dark:bg-primary-white text-primary-purple px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-white/90 transition-colors inline-flex items-center">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;