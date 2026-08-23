"use client";

import { useState } from "react";
import { ProgressActivity } from "relume-icons";
import { cn } from "@/lib/utils";

const VideoIframe = ({ video }: { video: string }) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  return (
    <>
      {!isIframeLoaded && <ProgressActivity className="mx-auto size-16 animate-spin text-white" />}
      <iframe
        className={cn(
          "z-0 mx-auto aspect-video size-full md:w-[738px] lg:w-[940px]",
          isIframeLoaded ? "visible" : "hidden",
        )}
        src={video}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsIframeLoaded(true)}
      />
    </>
  );
};

export { VideoIframe };
