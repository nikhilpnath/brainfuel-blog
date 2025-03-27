import { Outlet } from "react-router";

import Navbar from "./Navbar";
import Breadcrumbs from "./Breadcrumbs";
import {useNetworkStatus} from "@/hooks";
import ErrorBoundary from "@/errorBoundary";

const MainLayout = () => {
  useNetworkStatus(true); // to show offline and online status
  
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 pb-20">
      <Navbar />
      <Breadcrumbs />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};

export default MainLayout;
