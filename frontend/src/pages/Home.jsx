
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Chatbot from "../components/Chatbot";
const Home = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 overflow-hidden">
      <Chatbot/>
      {/* Hero Section */}
      <section className="text-center lg:flex lg:items-center lg:justify-between mb-24">
        <div className="lg:w-1/2 text-left fade-in transition-all duration-700 transform translate-y-8 opacity-0">
          <h1 className="text-5xl font-bold mb-6 text-gray-800 leading-tight">
            Streamline Your Tasks{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              with AI Assistance
            </span>
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Experience unparalleled efficiency with our task management app,
            optimize your workflow effortlessly.
          </p>
          <Link
            to="/register"
            className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block"
          >
            Get Started
          </Link>
        </div>
        <div className="lg:w-1/2 mt-10 lg:mt-0 fade-in transition-all duration-700 delay-200 transform translate-y-8 opacity-0">
          <img
            src="task.png"
            alt="Task Manager"
            className="mx-auto rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
          />
        </div>
      </section>

      {/* Features Section */}
      <SectionTitle title="Discover Our Top Features for Productivity" />
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          title="Smart Task Prioritization"
          desc="AI-driven prioritization to maximize efficiency."
        />
        <FeatureCard
          title="AI-Powered Reminders"
          desc="Never miss a deadline with intelligent reminders."
        />
        <FeatureCard
          title="Collaborative Features"
          desc="Enhance teamwork with seamless coordination."
        />
      </div>

      {/* Testimonials Section */}
      <SectionTitle title="Customer Testimonials" />
      <div className="grid md:grid-cols-3 gap-8 ">
        <TestimonialCard
          text="The AI assistant has made my life so much easier!"
          name="John Doe"
          company="Tech Solutions"
        />
        <TestimonialCard
          text="I can't imagine working without this tool!"
          name="Sarah Lee"
          company="WebCo"
        />
        <TestimonialCard
          text="This app has streamlined my workflow significantly!"
          name="Daniel Smith"
          company="Automation LLC"
        />
      </div>

      {/* Final CTA Section */}
      <section className="mt-32 text-center lg:flex lg:items-center lg:justify-between py-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-inner my-16 fade-in transition-all duration-700 transform translate-y-8 opacity-0">
        <div className="lg:w-1/2 text-left px-8">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            Transform Your Productivity Today
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join now and experience next-level task management with AI.
          </p>
          <Link
            to="/register"
            className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block"
          >
            Get Started
          </Link>
        </div>
        <div className="lg:w-1/2 mt-10 lg:mt-0 px-8">
          <img
            src="task2.jpg"
            alt="CTA"
            className="mx-auto rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
          />
        </div>
      </section>
    </div>
  );
};

const SectionTitle = ({ title }) => (
  <h2 className="text-3xl font-bold text-center mb-12 fade-in transition-all duration-700 transform translate-y-8 opacity-0 relative">
    <span className="relative z-10">{title}</span>
    <span className="absolute w-24 h-2 bg-blue-500 bottom-0 left-1/2 transform -translate-x-1/2 rounded-full"></span>
  </h2>
);

const FeatureCard = ({ title, desc }) => (
  <div className="text-center border p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105 fade-in transition-all duration-700 transform translate-y-8 opacity-0 bg-white">
    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
      <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

const TestimonialCard = ({ text, name, company }) => (
  <div className="text-center border p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105 fade-in transition-all duration-700 transform translate-y-8 opacity-0 bg-white">
    <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-full"></div>
    <p className="text-gray-700 italic mb-6">"{text}"</p>
    <h4 className="font-bold text-lg">{name}</h4>
    <p className="text-gray-500">{company}</p>
  </div>
);

export default Home;
