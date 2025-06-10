import React from 'react';
import Avatar from '../components/Avatar';
import ChatBox from '../components/ChatBox';

const HomePage = () => {
  return (
    <div className="relative py-8 w-full min-h-screen">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 " 
        style={{
          backgroundImage: 'url(https://res.cloudinary.com/dusaihqut/image/upload/v1746344363/ingeniero-gonzalez/avatar/bg_kvbye9.jpg)'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-500/30"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Avatar space (left, symmetrical to chat box right margin) */}
          <div className="hidden lg:block lg:basis-2/5 lg:shrink-0"></div>
          {/* Chat box section (right, symmetrical to avatar) */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full mx-auto z-20">
              <h1 className="text-2xl font-bold text-center text-white my-4 rounded-t-lg">Tu Proveedor de Equipo Electrico en México</h1>
            </div>
            <div className="w-full rounded-b-lg overflow-hidden min-h-[70vh] bg-white shadow-md">
              <ChatBox />
            </div>
          </div>
        </div>
      </div>
      
      {/* Fixed Avatar container at bottom of viewport */}
      <div className="fixed bottom-0 left-0 w-full lg:w-2/5 h-[550px] pointer-events-none">
        <div className="h-full w-full pt-8">
          <Avatar />
        </div>
      </div>
    </div>
  );
};

export default HomePage; 