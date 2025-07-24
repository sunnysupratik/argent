import React from 'react';
import { motion } from 'framer-motion';
import ChatContainer from './ChatContainer';

const Chat: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col relative bg-gray-50 overflow-hidden">
      {/* Main Chat Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 relative"
        style={{ 
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <ChatContainer />
      </motion.div>
    </div>
  );
};

export default Chat;