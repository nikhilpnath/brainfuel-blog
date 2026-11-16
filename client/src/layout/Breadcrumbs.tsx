import { Link, useLocation } from "react-router";

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const paths = pathname.split("/").filter(Boolean);

  if (paths.length === 0) return null;

  let breadcrumbPath = "";

  return (
    <nav aria-label="Breadcrumbs" className="mb-4 text-sm">
      <ol className="flex flex-wrap items-center gap-2 list-none p-0 m-0">
        <li>
          <Link to="/" className="text-blue-800 hover:underline">
            Home
          </Link>
        </li>
        {paths.map((path, index) => {
          breadcrumbPath += `/${path}`;
          const isLast = index === paths.length - 1;
          const formattedName = decodeURIComponent(path)
            .split("-")
            .join(" ");

          return (
            <li
              key={breadcrumbPath}
              className="flex items-center gap-2 capitalize before:content-['/'] before:text-gray-400 before:select-none"
            >
              {isLast ? (
                <Link
                  to={breadcrumbPath}
                  aria-current="page"
                  className="font-medium text-gray-700"
                >
                  {formattedName}
                </Link>
              ) : (
                <Link
                  to={breadcrumbPath}
                  className="text-blue-800 hover:underline"
                >
                  {formattedName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
