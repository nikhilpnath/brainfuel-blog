import { Link } from "react-router";
import { CategoriesColl } from "@/utils/data";

const About = () => {
  return (
    <div className="flex flex-col gap-10 mt-6 max-w-4xl mx-auto mb-16">
      {/* Hero section */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
          About BrainFuel
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          BrainFuel is a modern publication dedicated to curious minds, software
          engineers, designers, and creators who believe in continuous learning.
        </p>
      </div>

      {/* Mission statement */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Our Mission
        </h2>
        <p className="text-gray-600 leading-relaxed">
          The internet is flooded with superficial noise. At BrainFuel, our mission
          is simple: provide clear, in-depth, and well-researched insights that
          empower developers to build better products, master emerging technologies,
          and cultivate sustainable engineering practices.
        </p>
      </div>

      {/* Topics covered */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Explore by Topic
        </h2>
        <div className="flex flex-wrap gap-3">
          {CategoriesColl.map((cat) => (
            <Link
              key={cat}
              to={`/posts?cat=${cat}`}
              className="px-4 py-2 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 text-sm font-medium rounded-2xl transition-colors capitalize"
            >
              {cat.split("-").join(" ")}
            </Link>
          ))}
        </div>
      </div>

      {/* Write for BrainFuel CTA */}
      <div className="bg-blue-800 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">Have a story to tell?</h3>
          <p className="text-blue-100 text-sm md:text-base">
            Share your technical expertise, architectural design patterns, or lessons
            learned with our growing community.
          </p>
        </div>
        <Link
          to="/create"
          className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-2xl hover:bg-blue-50 transition-colors whitespace-nowrap shrink-0"
        >
          Write a Post →
        </Link>
      </div>
    </div>
  );
};

export default About;
