import { useEffect, useRef } from "react";

export const useIsMounted = (): { current: boolean } => {
  const componentIsMounted = useRef(true);
  useEffect(
    () => () => {
      componentIsMounted.current = false;
    },
    []
  );
  return componentIsMounted;
};
