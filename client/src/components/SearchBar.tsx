import { useLocation, useNavigate } from "react-router";
import { updateSearchParams } from "@/utils/updateSearchParams";

type TSearchBarProps = {
  className?: string;
};

const SearchBar = ({ className = "" }: TSearchBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = (formData.get("search") as string)?.trim() ?? "";
    if (location.pathname === "/posts") {
      updateSearchParams({ search: data, navigate });
    } else {
      navigate(`/posts?search=${data}`);
    }
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`flex items-center gap-2.5 bg-gray-100 hover:bg-gray-100/90 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-800/20 focus-within:border-blue-800/30 border border-transparent px-3.5 py-2 rounded-full w-full transition-all ${className}`}
    >
      <button
        type="submit"
        aria-label="Search"
        className="text-gray-400 hover:text-blue-800 transition-colors shrink-0 cursor-pointer flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
      <input
        type="search"
        name="search"
        aria-label="Search posts"
        placeholder="Search a post..."
        className="bg-transparent focus:outline-none w-full text-sm text-gray-800 placeholder:text-gray-400"
      />
    </form>
  );
};

export default SearchBar;
