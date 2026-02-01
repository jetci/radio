import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

interface OnlineCounterProps {
  className?: string;
}

const OnlineCounter: React.FC<OnlineCounterProps> = ({ className = '' }) => {
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate getting online count
    // In production, this would connect to a real-time database
    const updateCount = () => {
      // For demo: random number between 1-50
      const count = Math.floor(Math.random() * 50) + 1;
      setOnlineCount(count);
      setIsLoading(false);
    };

    // Initial load
    updateCount();

    // Update every 30 seconds
    const interval = setInterval(updateCount, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <Users className="w-4 h-4 text-green-500" />
        <span className="text-sm font-medium text-green-500">
          {onlineCount}
        </span>
      </div>
    </div>
  );
};

export default OnlineCounter;
