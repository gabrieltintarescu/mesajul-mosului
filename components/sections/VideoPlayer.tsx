'use client';

import { motion } from 'framer-motion';
import {
    AlertCircle,
    Download,
    Maximize,
    Pause,
    Play,
    RefreshCw,
    Volume2,
    VolumeX
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    title?: string;
}

export function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [videoError, setVideoError] = useState<string | null>(null);
    const [isRetrying, setIsRetrying] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const maxRetries = 5;
    const retryDelay = 3000; // 3 seconds

    // Reset error state when src changes
    useEffect(() => {
        setVideoError(null);
        setRetryCount(0);
    }, [src]);

    const handleVideoError = useCallback(() => {
        if (retryCount < maxRetries) {
            setVideoError('Se încarcă videoclipul...');
            setIsRetrying(true);

            // Auto-retry after delay
            setTimeout(() => {
                if (videoRef.current) {
                    setRetryCount(prev => prev + 1);
                    videoRef.current.load();
                    setIsRetrying(false);
                }
            }, retryDelay);
        } else {
            setVideoError('Videoclipul nu poate fi redat momentan. Încearcă din nou în câteva secunde.');
            setIsRetrying(false);
        }
    }, [retryCount]);

    const handleRetry = () => {
        setVideoError(null);
        setRetryCount(0);
        setIsRetrying(true);
        if (videoRef.current) {
            videoRef.current.load();
            setTimeout(() => setIsRetrying(false), 1000);
        }
    };

    const handleCanPlay = () => {
        setVideoError(null);
        setIsRetrying(false);
    };

    const togglePlay = async () => {
        if (videoRef.current) {
            try {
                if (isPlaying) {
                    videoRef.current.pause();
                    setIsPlaying(false);
                } else {
                    await videoRef.current.play();
                    setIsPlaying(true);
                }
            } catch (error) {
                console.error('Error playing video:', error);
                handleVideoError();
            }
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

    const handleFullscreen = async () => {
        const container = containerRef.current;
        const video = videoRef.current;

        if (!container && !video) return;

        try {
            // Check if already in fullscreen
            if (document.fullscreenElement) {
                await document.exitFullscreen();
                return;
            }

            // Try container first, then video element
            const element = container || video;

            if (element) {
                // Standard API
                if (element.requestFullscreen) {
                    await element.requestFullscreen();
                }
                // Safari on iOS - use webkitEnterFullscreen on video element
                else if (video && 'webkitEnterFullscreen' in video) {
                    (video as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
                }
                // Older Safari
                else if ('webkitRequestFullscreen' in element) {
                    (element as HTMLElement & { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
                }
                // MS Edge legacy
                else if ('msRequestFullscreen' in element) {
                    (element as HTMLElement & { msRequestFullscreen: () => void }).msRequestFullscreen();
                }
            }
        } catch (error) {
            // Fullscreen not supported or blocked - fail silently
            console.warn('Fullscreen not available:', error);
        }
    };

    return (
        <motion.div
            ref={containerRef}
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
                onError={handleVideoError}
                onCanPlay={handleCanPlay}
                playsInline
                preload="auto"
            />

            {/* Error overlay */}
            {videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center p-6">
                        {isRetrying ? (
                            <>
                                <RefreshCw className="w-12 h-12 text-white/60 mx-auto mb-4 animate-spin" />
                                <p className="text-white/80 text-sm">{videoError}</p>
                                <p className="text-white/50 text-xs mt-2">
                                    Încercare {retryCount + 1} din {maxRetries}
                                </p>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                <p className="text-white/80 text-sm mb-4">{videoError}</p>
                                <button
                                    onClick={handleRetry}
                                    className="px-4 py-2 bg-christmas-red text-white rounded-lg hover:bg-christmas-red/80 transition-colors flex items-center gap-2 mx-auto"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Încearcă din nou
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Play button overlay */}
            {!isPlaying && !videoError && (
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
