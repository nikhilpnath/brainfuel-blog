import { useLocation, useNavigate, useSearchParams } from "react-router";

import { SearchBar } from "../";
import { CategoriesColl, sort } from "../../utils/data";
import { updateSearchParams } from "../../utils/updateSearchParams";

const Sidemenu = ({ showFilter = true }: { showFilter?: boolean }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();

  const sortParam = params.get("sort");
  const catParam = params.get("cat");

  //currying
  const handleParams = (key: string) => (value: string) => {
    if (location.pathname === "/posts") {
      updateSearchParams({ [key]: value, navigate });
    } else {
      const url = value ? `/posts?${key}=${value}` : `/posts`;
      navigate(url);
    }
  };

  return (
    <>
      <h1 className="mb-4 text-sm font-medium">Search</h1>
      <SearchBar />

      <div className={`${showFilter ? "block" : "hidden"}`}>
        <h1 className="mb-4 mt-8 text-sm font-medium">Filter</h1>
        <div className="flex flex-col gap-2 text-sm">
          {sort.map((sortItem, index) => (
            <label
              htmlFor="sort"
              className="flex items-center gap-2 cursor-pointer"
              key={sortItem + index}
            >
              <input
                type="radio"
                name="sort"
                id="sort"
                checked={sortParam ? sortParam === sortItem : false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleParams("sort")(e.target.value)
                }
                value={sortItem}
                className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
              />
              {sortItem.charAt(0).toUpperCase() + sortItem.slice(1)}
              {index === sort.length - 1 && sortParam === "trending" && (
                <span className="text-xs">(last 7 days)</span>
              )}
            </label>
          ))}
        </div>
      </div>

      <h1 className="mb-4 mt-8 text-sm font-medium">Categories</h1>
      <div className="flex flex-wrap gap-1 text-sm items-start ">
        <button
          className="hover:bg-blue-200 rounded-full px-4 py-2"
          onClick={() => handleParams("cat")("")}
        >
          All
        </button>
        {CategoriesColl.map((category, index) => (
          <button
            className={`hover:bg-blue-200 rounded-full px-3 py-2 ${
              catParam === category && "bg-blue-200"
            }`}
            onClick={() => handleParams("cat")(category)}
            key={category + index}
          >
            {category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidemenu;
