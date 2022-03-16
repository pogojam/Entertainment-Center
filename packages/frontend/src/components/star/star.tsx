import { useSpring } from "@react-spring/three";
import { Stars, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

export const StarGroup = () => {
  const ref = useRef<any>();
  const [showStars, setShowStars] = useState(false);

  const [checkpoint, setCheckpoint] = useState(false);
  const renderer = useThree();
  const scroll = useScroll();
  const { color } = useSpring({ color: 0, loop: true });

  useEffect(() => {
    const canvasNode = document.getElementById("Background_Canvas");
    if (canvasNode) {
      if (showStars) {
        canvasNode.style.backgroundColor = "rgba(0, 0, 0, .95)";
      } else {
        canvasNode.style.backgroundColor = "rgba(0, 0, 0, .0)";
      }
    }
  }, [showStars]);

  useFrame(() => {
    const scrollLimit = scroll.range(0, 1 / 3);
    if (scrollLimit > 0.8 && !showStars) {
      setShowStars(true);
    }
    if (scrollLimit < 0.8 && showStars) {
      setShowStars(false);
    }
  });

  return (
    <Stars
      radius={100} // Radius of the inner sphere (default=100)
      depth={2} // Depth of area where stars should fit (default=50)
      count={10000} // Amount of stars (default=5000)
      factor={13} // Size factor (default=4)
      saturation={0.4} // Saturation 0-1 (default=0)
      fade
      ref={ref}
    />
  );
};
