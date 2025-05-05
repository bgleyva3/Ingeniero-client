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
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Electrical Products Store</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Empty space for Avatar (2/5) - Avatar is fixed position now */}
          <div className="lg:col-span-2 h-[550px]"></div>
          
          {/* Product list section (3/5) */}
          <div id="chat-box" className="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden min-h-[550px]">
            <ChatBox />
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