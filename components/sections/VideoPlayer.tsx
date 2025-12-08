'use client';

import { motion } from 'framer-motion';
import { Download, Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    title?: string;
}

export function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showControls, setShowControls] = useState(true);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(progress);
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = pos * videoRef.current.duration;
        }
    };

    const handleFullscreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl overflow-hidden bg-black shadow-2xl group"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(isPlaying ? false : true)}
        >
            {/* Video */}
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full aspect-video"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
            />

            {/* Play button overlay */}
            {!isPlaying && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30"
                >
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
                    >
                        <Play className="w-8 h-8 text-christmas-red ml-1" fill="currentColor" />
                    </motion.div>
                </motion.button>
            )}

            {/* Controls */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showControls ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
            >
                {/* Progress bar */}
                <div
                    className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer mb-4 group/progress"
                    onClick={handleProgressClick}
                >
                    <motion.div
                        className="h-full bg-christmas-red rounded-full relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 
              bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                    </motion.div>
                </div>

                {/* Control buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={togglePlay}
                            className="text-white hover:text-christmas-gold transition-colors"
                        >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </button>

                        <button
                            onClick={toggleMute}
                            className="text-white hover:text-christmas-gold transition-colors"
                        >
                            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                        </button>

                        {title && (
                            <span className="text-white text-sm font-medium">{title}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href={src}
                            download
                            className="text-white hover:text-christmas-gold transition-colors"
                        >
                            <Download className="w-5 h-5" />
                        </a>

                        <button
                            onClick={handleFullscreen}
                            className="text-white hover:text-christmas-gold transition-colors"
                        >
                            <Maximize className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Christmas decoration */}
            <div className="absolute top-4 right-4 text-2xl opacity-80">🎄</div>
        </motion.div>
    );
}
