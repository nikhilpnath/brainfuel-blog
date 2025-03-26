import { useLocation, useNavigate } from "react-router";
import { ErrorCmp } from "../components";

const NoRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ErrorCmp
      text="Oops! We couldn't find the page "
      path={location.pathname}
      btnAction={() => navigate(-1)}
    />
  );
};

export default NoRoute;
