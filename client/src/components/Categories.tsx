import { Link } from "react-router";

import { SearchBar } from "./";
import { CategoriesColl } from "../utils/data";

//For home page
const Categories = () => {

  return (
    <div className="hidden md:flex gap-4 items-center justify-center bg-white p-4 rounded-3xl xl:rounded-full shadow-lg ">
      {/* LINKS */}
      <div className="flex-1 flex items-center flex-wrap ">
        <Link
          to="/posts"
          className="bg-blue-800 text-white rounded-full px-4 py-2 mr-1"
        >
          All Posts
        </Link>

        {CategoriesColl.slice(1,7).map((category, index) => (
          <Link
            to={`/posts?cat=${category}`}
            className="hover:bg-blue-50 rounded-full px-4 py-2"
            key={category + index}
          >
            {category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Link>
        ))}
      </div>

      <div className="hidden md:block text-xl font-medium">|</div>
      {/* SEARCH */}
      <SearchBar />
    </div>
  );
};

export default Categories;
