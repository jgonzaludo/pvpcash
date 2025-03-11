import React from "react";

export const AuroraBackground: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen w-full bg-black relative flex items-center justify-center overflow-hidden">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center">
        {/* Aurora blobs that create the effect */}
        <div className="absolute h-[50rem] w-[50rem] rotate-12">
          <div className="absolute inset-0 blur-[100px]">
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[25rem] h-[25rem] rounded-full bg-indigo-500/50"></div>
            <div className="absolute bottom-1/2 translate-y-1/2 left-1/2 -translate-x-1/2 w-[25rem] h-[25rem] rounded-full bg-violet-500/50 mix-blend-multiply"></div>
            <div className="absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2 w-[25rem] h-[25rem] rounded-full bg-fuchsia-500/50 mix-blend-multiply"></div>
          </div>
        </div>
      </div>
      <div className="relative w-full">{children}</div>
    </div>
  );
};

export default AuroraBackground; 