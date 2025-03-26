import { createBrowserRouter } from "react-router";

import NoRoute from "../pages/NoRoute";
import MainLayout from "../layout/MainLayout";
import { lazyLoad } from "./lazy/lazy.component";


export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: lazyLoad("Homepage")(),
      },
      {
        path: "/login",
        element: lazyLoad("Login")(),
      },
      {
        path: "/register",
        element: lazyLoad("Register")(),
      },
      {
        path: "/posts",
        element: lazyLoad("PostLists")(),
      },
      {
        path: "/posts/:slug",
        element: lazyLoad("SinglePost")(),
      },
      {
        path: "/create",
        element: lazyLoad("NewPost")(),
      },

      {
        path: "*",
        element: <NoRoute />,
      },
    ],
  },
]);
