import { lazy } from "react";
import { Suspense } from "react";

const pathToModuleMap = {
  Homepage: () => import("../../pages/Homepage"),
  Login: () => import("../../pages/Login"),
  Register: () => import("../../pages/Register"),
  SinglePost: () => import("../../pages/SinglePost"),
  PostLists: () => import("../../pages/PostLists"),
  NewPost: () => import("../../pages/NewPost"),
} as const;

type ComponentKey = keyof typeof pathToModuleMap;

export const lazyLoad = (
  path: ComponentKey,
  namedExport?: keyof Awaited<
    ReturnType<(typeof pathToModuleMap)[ComponentKey]>
  >
) => {
  const LazyComponent = lazy(() => {
    const promise = pathToModuleMap[path]();
    if (!namedExport) {
      return promise;
    } else {
      return promise.then((module) => ({ default: module[namedExport] }));
    }
  });

  return function LazyWrapper() {
    return (
      <Suspense fallback={<h2>Loading...</h2>}>
        <LazyComponent />
      </Suspense>
    );
  };
};

// namedExport - For componets who dont have a default export
// This approach enables tree-shaking & preloading optimizations. (vite)
// Also Better Type Safety
