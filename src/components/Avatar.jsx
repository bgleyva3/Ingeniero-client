import React, { useRef, useEffect } from 'react';

const Avatar = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Auto play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Error playing the video:", error);
      });
    }
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <video 
        ref={videoRef}
        className="max-h-full max-w-full object-contain"
        src="https://res.cloudinary.com/dusaihqut/video/upload/v1746341197/ingeniero-gonzalez/avatar/STANDING_MOV_ax9oeo.webm"
        muted
        autoPlay
        loop
        playsInline
      />
    </div>
  );
};

export default Avatar; 