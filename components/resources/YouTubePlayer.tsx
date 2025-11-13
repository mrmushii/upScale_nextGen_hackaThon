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

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
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
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
        } catch (e) {
          console.error("Error destroying player:", e);
        }
      }
    };
  }, [videoId]);

  const initializePlayer = () => {
    if (!playerRef.current || !window.YT) return;

    try {
      playerInstanceRef.current = new window.YT.Player(playerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          start: Math.floor(initialTimestamp),
          controls: 0,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            setPlayerReady(true);
            if (initialTimestamp > 0) {
              event.target.seekTo(initialTimestamp, true);
            }
            // Start tracking progress
            startProgressTracking(event.target);
          },
          onStateChange: (event: any) => {
            // 0 = ended, 1 = playing, 2 = paused
            if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 2 || event.data === 0) {
              setIsPlaying(false);
            }
            if (event.data === 0) {
              // Video ended
              setCompleted(true);
              if (onProgressUpdate) {
                onProgressUpdate(100, duration || 0);
              }
            }
          },
        },
      });
    } catch (error) {
      console.error("Error initializing YouTube player:", error);
    }
  };

  const startProgressTracking = (player: any) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      try {
        if (player && player.getCurrentTime && player.getDuration) {
          const time = player.getCurrentTime();
          const totalDuration = player.getDuration() || duration || 0;
          
          if (totalDuration > 0) {
            const newProgress = (time / totalDuration) * 100;
            setCurrentTime(time);
            setProgress(newProgress);

            if (newProgress >= 90 && !completed) {
              setCompleted(true);
            }

            if (onProgressUpdate) {
              onProgressUpdate(newProgress, time);
            }
          }
        }
      } catch (error) {
        console.error("Error tracking progress:", error);
      }
    }, 1000);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerInstanceRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * (duration || 0);

    try {
      playerInstanceRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
      setProgress(percentage * 100);
    } catch (error) {
      console.error("Error seeking:", error);
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
    if (!playerInstanceRef.current) return;
    try {
      if (isPlaying) {
        playerInstanceRef.current.pauseVideo();
      } else {
        playerInstanceRef.current.playVideo();
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  };

  const toggleMute = () => {
    if (!playerInstanceRef.current) return;
    try {
      if (isMuted) {
        playerInstanceRef.current.unMute();
        setIsMuted(false);
      } else {
        playerInstanceRef.current.mute();
        setIsMuted(true);
      }
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    try {
      if (!isFullscreen) {
        if (playerRef.current.requestFullscreen) {
          playerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  return (
    <div className="bg-black rounded-xl overflow-hidden">
      {/* YouTube Embed */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div
          ref={playerRef}
          className="absolute top-0 left-0 w-full h-full"
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
              disabled={!playerReady}
              className="p-2 hover:bg-gray-800 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? (
                <Pause size={20} className="text-white" />
              ) : (
                <Play size={20} className="text-white" />
              )}
            </button>

            <button
              onClick={toggleMute}
              disabled={!playerReady}
              className="p-2 hover:bg-gray-800 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
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
