import React, { useState, useRef, useEffect } from 'react';
import { IconMicrophone, IconX, IconPlayerPlay, IconPlayerPause, IconTrash } from '../Icons';

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob, duration: number) => void;
  onCancel: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSend, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    startRecording();
    return () => {
      stopTimer();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      startTimer();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
      onCancel();
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePauseResume = () => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      startTimer();
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      stopTimer();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onSend(audioBlob, duration);
    }
  };

  const handleDelete = () => {
    if (confirm('Delete this recording?')) {
      onCancel();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Voice Message</h3>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            aria-label="Close"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Waveform Visualization */}
        <div className="mb-6 bg-gray-100 dark:bg-gray-900 rounded-lg p-8 flex items-center justify-center">
          {isRecording ? (
            <div className="flex items-center gap-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-red-500 rounded-full animate-pulse ${
                    isPaused ? 'opacity-50' : ''
                  }`}
                  style={{
                    height: `${Math.random() * 40 + 20}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-blue-500 rounded-full"
                  style={{ height: `${Math.random() * 40 + 20}px` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="text-center mb-6">
          <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white">
            {formatDuration(duration)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isRecording ? (isPaused ? 'Paused' : 'Recording...') : 'Ready to send'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {isRecording ? (
            <>
              <button
                type="button"
                onClick={handlePauseResume}
                className="p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors"
                aria-label={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <IconPlayerPlay className="w-6 h-6" /> : <IconPlayerPause className="w-6 h-6" />}
              </button>
              <button
                type="button"
                onClick={handleStop}
                className="p-6 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
                aria-label="Stop recording"
              >
                <div className="w-6 h-6 bg-white rounded-sm" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="p-4 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors"
                aria-label="Delete"
              >
                <IconTrash className="w-6 h-6" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handlePlayPause}
                className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <IconPlayerPause className="w-6 h-6" /> : <IconPlayerPlay className="w-6 h-6" />}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="p-4 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors"
                aria-label="Delete"
              >
                <IconTrash className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Audio Element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {/* Send Button */}
        {!isRecording && audioBlob && (
          <button
            type="button"
            onClick={handleSend}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Send Voice Message
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
