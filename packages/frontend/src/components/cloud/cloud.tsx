import { Cloud } from "@react-three/drei";

export const CloudGroup = () => {
  return (
    <group position={[0, -0.43, -11.35]}>
      <Cloud depth={10} position={[-4, -2, 0]} args={[3, 2]} />
    </group>
  );
};
