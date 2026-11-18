import { useLocation, useNavigate } from "react-router";
import { ErrorCmp } from "@/components";

const NoRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ErrorCmp
      icon="🔍"
      title="Page Not Found (404)"
      text="We couldn't locate the requested page:"
      path={location.pathname}
      desc="The link you clicked may be broken or the URL may have been mistyped."
      btnText="Back to Home"
      btnAction={() => navigate("/")}
      secondaryBtnText="Explore Posts"
      secondaryBtnAction={() => navigate("/posts")}
    />
  );
};

export default NoRoute;
