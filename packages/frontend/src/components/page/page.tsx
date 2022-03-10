import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface pageProps {
  height: number;
  width: number;
  left: number;
  top: number;
}

const StyledPage = styled.div<pageProps>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  // Position styles
  position: absolute;
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
`;

const StyledPageManager = styled.div`
  position: relative;
`;

export const PageManager = ({ children }) => {
  return <StyledPageManager>{children}</StyledPageManager>;
};

export const Page = ({ children, index = 0 }) => {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const makePosition = () => {
    const margin = index * window.innerWidth * 0.3;
    return {
      top: 0,
      left: index * dimensions.width + margin,
    };
  };
  const [position, setPosition] = useState(makePosition());

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      setDimensions({ height: window.innerHeight, width: window.innerWidth });
      setPosition(makePosition());
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <StyledPage {...position} {...dimensions}>
      {children}
    </StyledPage>
  );
};
