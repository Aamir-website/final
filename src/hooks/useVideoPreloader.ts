import { useEffect, useRef, useState } from 'react';

interface VideoLoadState {
  [src: string]: {
    loaded: boolean;
    loading: boolean;
    element?: HTMLVideoElement;
  };
}

export function useVideoPreloader(videoSources: string[]) {
  const [loadStates, setLoadStates] = useState<VideoLoadState>({});
  const loadQueueRef = useRef<string[]>([]);
  const isLoadingRef = useRef(false);

  const loadNextVideo = async () => {
    if (isLoadingRef.current || loadQueueRef.current.length === 0) return;
    
    const nextSrc = loadQueueRef.current.shift();
    if (!nextSrc) return;

    isLoadingRef.current = true;
    
    setLoadStates(prev => ({
      ...prev,
      [nextSrc]: { ...prev[nextSrc], loading: true }
    }));

    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = nextSrc;
      
      await new Promise((resolve, reject) => {
        video.onloadeddata = resolve;
        video.onerror = reject;
        video.load();
      });

      setLoadStates(prev => ({
        ...prev,
        [nextSrc]: { loaded: true, loading: false, element: video }
      }));

    } catch (error) {
      console.error('Failed to preload video:', nextSrc, error);
      setLoadStates(prev => ({
        ...prev,
        [nextSrc]: { loaded: false, loading: false }
      }));
    }

    isLoadingRef.current = false;
    
    // Load next video after a small delay
    setTimeout(() => {
      loadNextVideo();
    }, 100);
  };

  const preloadVideo = (src: string) => {
    if (loadStates[src]?.loaded || loadStates[src]?.loading) return;
    
    if (!loadQueueRef.current.includes(src)) {
      loadQueueRef.current.push(src);
    }
    
    if (!isLoadingRef.current) {
      loadNextVideo();
    }
  };

  const getVideoElement = (src: string): HTMLVideoElement | null => {
    return loadStates[src]?.element || null;
  };

  const isVideoLoaded = (src: string): boolean => {
    return loadStates[src]?.loaded || false;
  };

  const isVideoLoading = (src: string): boolean => {
    return loadStates[src]?.loading || false;
  };

  // Initialize load states for all videos
  useEffect(() => {
    const initialStates: VideoLoadState = {};
    videoSources.forEach(src => {
      initialStates[src] = { loaded: false, loading: false };
    });
    setLoadStates(initialStates);
  }, [videoSources]);

  // Start preloading videos immediately
  useEffect(() => {
    if (videoSources.length > 0) {
      // Start loading the first few videos immediately
      videoSources.slice(0, 3).forEach(src => {
        preloadVideo(src);
      });
    }
  }, [videoSources]);

  return {
    preloadVideo,
    getVideoElement,
    isVideoLoaded,
    isVideoLoading,
    loadStates
  };
}