'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Snowflake {
    id: number;
    x: number;
    delay: number;
    duration: number;
    size: number;
}

export function SnowfallBackground() {
    const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

    useEffect(() => {
        const flakes: Snowflake[] = [];
        for (let i = 0; i < 50; i++) {
            flakes.push({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 5,
                duration: 5 + Math.random() * 10,
                size: 4 + Math.random() * 8,
            });
        }
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {snowflakes.map((flake) => (
                <motion.div
                    key={flake.id}
                    className="absolute text-white opacity-60"
                    style={{
                        left: `${flake.x}%`,
                        fontSize: `${flake.size}px`,
                    }}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{
                        y: '100vh',
                        opacity: [0, 0.8, 0.8, 0],
                        x: [0, 30, -30, 0],
                    }}
                    transition={{
                        duration: flake.duration,
                        delay: flake.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    ❄
                </motion.div>
            ))}
        </div>
    );
}
