import { Link, useLocation } from "react-router";

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const paths = pathname.split("/").filter((x) => x);

  let breadcrumbPath = "";

  return (
    <div className="mb-4">
      {paths.length > 0 && <Link to="/" className="text-blue-800">Home</Link>}
      {paths.map((path, index) => {
        breadcrumbPath += `/${path}`;
        const isLast = index === paths.length - 1;
        return isLast ? (
          <span key={breadcrumbPath} className="capitalize" >
            <span className="px-3">|</span>
            {path}
          </span>
        ) : (
          <span key={breadcrumbPath} className="capitalize">
            <span className="px-3">|</span>
            <Link to={breadcrumbPath} className="text-blue-800">
              {path}
            </Link>
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
