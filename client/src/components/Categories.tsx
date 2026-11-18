import { Link } from "react-router";

import { SearchBar } from "./";
import { CategoriesColl } from "@/utils/data";

// For home page
const Categories = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white/95 backdrop-blur-sm p-3 md:p-4 rounded-3xl xl:rounded-full shadow-md border border-slate-100">
      {/* Scrollable Chips */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        <Link
          to="/posts"
          className="bg-blue-800 hover:bg-blue-900 text-white font-medium text-sm rounded-full px-4 py-2 shrink-0 transition-colors shadow-sm"
        >
          All Posts
        </Link>

        {CategoriesColl.slice(0, 8).map((category, index) => (
          <Link
            to={`/posts?cat=${category}`}
            className="hover:bg-blue-50 text-gray-700 hover:text-blue-800 font-medium text-sm rounded-full px-4 py-2 shrink-0 transition-colors whitespace-nowrap"
            key={category + index}
          >
            {category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Link>
        ))}
      </div>

      <div className="hidden md:block text-gray-300 font-light select-none">|</div>

      {/* Search */}
      <div className="w-full md:w-64 shrink-0">
        <SearchBar />
      </div>
    </div>
  );
};

export default Categories;
