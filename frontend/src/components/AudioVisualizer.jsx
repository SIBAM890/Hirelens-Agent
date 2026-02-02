import React from 'react';
import { motion } from 'framer-motion';

const AudioVisualizer = ({ state }) => {
    // state options: "IDLE", "LISTENING", "SPEAKING", "THINKING"

    // Create 5 bars for the visualization
    const bars = [1, 2, 3, 4, 5];

    // Define colors based on state
    const getColor = () => {
        switch (state) {
            case 'SPEAKING': return 'bg-neon-blue shadow-[0_0_15px_#00f3ff]';
            case 'LISTENING': return 'bg-green-500 shadow-[0_0_15px_#22c55e]';
            case 'THINKING': return 'bg-neon-purple shadow-[0_0_15px_#bc13fe]';
            default: return 'bg-gray-600';
        }
    };

    return (
        <div className="flex items-center gap-2 h-16">
            {bars.map((bar) => (
                <motion.div
                    key={bar}
                    className={`w-3 rounded-full ${getColor()}`}
                    animate={state === 'SPEAKING' || state === 'LISTENING' ? {
                        height: [10, 40, 20, 50, 15], // Random heights for wave effect
                    } : state === 'THINKING' ? {
                        height: [20, 20, 20], // Steady pulse
                        opacity: [0.5, 1, 0.5]
                    } : {
                        height: 8 // Idle flat line
                    }}
                    transition={{
                        duration: state === 'THINKING' ? 1.5 : 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: bar * 0.1, // Stagger effect to make it look like a wave
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

export default AudioVisualizer;