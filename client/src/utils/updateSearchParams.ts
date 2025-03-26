import { NavigateFunction } from "react-router";

type TCustomParamsProps = {
  search?: string;
  sort?: string;
  author?: string;
  cat?: string;
  navigate: NavigateFunction;
};
export const updateSearchParams = ({ navigate, ...newParams }: TCustomParamsProps) => {
  const params = new URLSearchParams(window.location.search);

  Object.entries(newParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
  });

  const newURL = `/posts?${params.toString()}`;
  navigate(newURL, { replace: true });
};
