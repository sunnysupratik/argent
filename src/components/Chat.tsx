import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChatContainer from './ChatContainer';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Maximize2 } from 'lucide-react';

const Chat: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="h-full w-full flex flex-col relative bg-gray-50 rounded-xl overflow-hidden">
      {/* Main Chat Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 overflow-hidden relative"
        style={{ 
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Fullscreen Dialog Trigger */}
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="absolute top-4 right-4 z-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 size={18} />
              <span className="sr-only">Fullscreen</span>
            </Button>
          </DialogTrigger>
          
          <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[90vh] sm:max-w-5xl w-[95vw] h-[90vh] [&>button:last-child]:hidden">
            <div className="h-full overflow-hidden">
              <ChatContainer />
            </div>
          </DialogContent>
        </Dialog>

        <ChatContainer />
      </motion.div>
    </div>
  );
};

export default Chat;