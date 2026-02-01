import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

interface OnlineCounterProps {
  className?: string;
}

const OnlineCounter: React.FC<OnlineCounterProps> = ({ className = '' }) => {
  const [onlineCount, setOnlineCount] = useState<number>(() => {
    // Initial random count
    return Math.floor(Math.random() * 50) + 1;
  });

  useEffect(() => {
    // Update every 30 seconds
    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * 50) + 1;
      setOnlineCount(count);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center gap-1.5 md:gap-2 ${className}`}>
      <div className="flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
        <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
        <span className="text-[10px] md:text-sm font-medium text-green-500">
          {onlineCount}
        </span>
      </div>
    </div>
  );
};

export default OnlineCounter;
