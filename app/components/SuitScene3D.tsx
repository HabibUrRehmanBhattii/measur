"use client";

import { useEffect, useRef, useState } from "react";

export default function SuitScene3D({ className = "" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
    script.type = "module";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  useEffect(() => {
    if (!loaded || !containerRef.current) return;

    const el = document.createElement("model-viewer");
    el.setAttribute("src", "/models/test-avatar.glb");
    el.setAttribute("alt", "3D Avatar");
    el.setAttribute("auto-rotate", "");
    el.setAttribute("rotation-per-second", "20deg");
    el.setAttribute("camera-controls", "");
    el.setAttribute("touch-action", "pan-y");
    el.setAttribute("shadow-intensity", "0.8");
    el.setAttribute("exposure", "1");
    el.setAttribute("bounds", "tight");
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.background = "transparent";

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(el);

    el.addEventListener("load", () => {
      el.cameraOrbit = "45deg 70deg auto";
      el.fieldOfView = "35deg";
      el.jumpCameraToGoal(0);
    });
  }, [loaded]);

  return (
    <div className={className}>
      <div ref={containerRef} className="w-full h-full">
        {!loaded && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="font-data text-xs text-foreground-secondary animate-pulse">Loading 3D viewer...</div>
          </div>
        )}
      </div>
    </div>
  );
}
