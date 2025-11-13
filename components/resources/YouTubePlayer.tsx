"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Clock, CheckCircle2 } from "lucide-react";

interface YouTubePlayerProps {
  videoId: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail?: string;
  duration?: number;
  initialProgress?: number;
  initialTimestamp?: number;
  onProgressUpdate?: (progress: number, timestamp: number) => void;
}

export default function YouTubePlayer({
  videoId,
  courseId,
  courseTitle,
  courseThumbnail,
  duration,
  initialProgress = 0,
  initialTimestamp = 0,
  onProgressUpdate,
}: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTimestamp);
  const [progress, setProgress] = useState(initialProgress);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [completed, setCompleted] = useState(initialProgress >= 90);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      // Player will be initialized when component mounts
    };

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Update progress periodically
    if (isPlaying && duration) {
      progressIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = Math.min(prev + 1, duration);
          const newProgress = (newTime / duration) * 100;
          setProgress(newProgress);
          
          if (newProgress >= 90 && !completed) {
            setCompleted(true);
          }

          // Call progress update callback
          if (onProgressUpdate) {
            onProgressUpdate(newProgress, newTime);
          }

          return newTime;
        });
      }, 1000);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, duration, onProgressUpdate, completed]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    setCurrentTime(newTime);
    setProgress(percentage * 100);
    
    if (onProgressUpdate) {
      onProgressUpdate(percentage * 100, newTime);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      playerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="bg-black rounded-xl overflow-hidden">
      {/* YouTube Embed */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          ref={playerRef}
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${Math.floor(initialTimestamp)}&autoplay=0`}
          title={courseTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Video Controls */}
      <div className="bg-gray-900 p-4 space-y-3">
        {/* Progress Bar */}
        <div
          className="w-full h-2 bg-gray-700 rounded-full cursor-pointer group"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-primary-600 rounded-full transition-all group-hover:bg-primary-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlayPause}
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              {isPlaying ? (
                <Pause size={20} className="text-white" />
              ) : (
                <Play size={20} className="text-white" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              {isMuted ? (
                <VolumeX size={20} className="text-white" />
              ) : (
                <Volume2 size={20} className="text-white" />
              )}
            </button>

            <div className="text-white text-sm flex items-center gap-2">
              <Clock size={16} />
              <span>
                {formatTime(currentTime)} / {duration ? formatTime(duration) : "0:00"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {completed && (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 size={20} />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}

            <div className="text-white text-sm">
              {Math.round(progress)}% watched
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <Maximize size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

