import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function PortraitControls({ bodyRef, headRef, reducedMotion, hovered }) {
  const { invalidate } = useThree();

  useEffect(() => {
    invalidate();
  }, [hovered, invalidate, reducedMotion]);

  useFrame(({ pointer, clock }, delta) => {
    if (!bodyRef.current || !headRef.current) return;

    const ease = 1 - Math.exp(-delta * 3.2);
    const targetX = -pointer.y * 0.1;
    const targetY = pointer.x * 0.2;
    const targetScale = hovered ? 1.012 : 1;

    headRef.current.rotation.x += (targetX - headRef.current.rotation.x) * ease;
    headRef.current.rotation.y += (targetY - headRef.current.rotation.y) * ease;
    bodyRef.current.scale.x += (targetScale - bodyRef.current.scale.x) * ease;
    bodyRef.current.scale.z += (targetScale - bodyRef.current.scale.z) * ease;
    bodyRef.current.position.y = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.72) * 0.018;

    if (
      reducedMotion
      && (
        Math.abs(targetX - headRef.current.rotation.x) > 0.001
        || Math.abs(targetY - headRef.current.rotation.y) > 0.001
        || Math.abs(targetScale - bodyRef.current.scale.x) > 0.001
      )
    ) {
      invalidate();
    }
  });

  return null;
}
