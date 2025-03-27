import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";

import { router } from "@/routes/Routes";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        autoClose={3000}
        closeOnClick={true}
        pauseOnHover={false}
        position="bottom-right"
        draggable
      />
    </>
  );
};

export default App;
