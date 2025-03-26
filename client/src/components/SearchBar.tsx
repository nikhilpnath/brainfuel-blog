import { useLocation, useNavigate } from "react-router";
import { updateSearchParams } from "../utils/updateSearchParams";

const SearchBar = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    
    if (e.key === "Enter") {
      const data = e.currentTarget.value.trim();
      if (location.pathname === "/posts") {
        updateSearchParams({ search: data, navigate });
      } else {
        navigate(`/posts?search=${data}`);
      }
    }
  };
  
  return (
    <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-full w-fit">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="gray"
      >
        <circle cx="10.5" cy="10.5" r="7.5" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>
      <input
        type="text"
        placeholder="Search a post"
        className="bg-transparent focus:outline-none"
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

export default SearchBar;
