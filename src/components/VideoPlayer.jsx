import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import ReactPlayer from 'react-player'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const VideoPlayer = ({ videoUrl, title, onProgress, onEnded, className = "" }) => {
  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const playerRef = useRef(null)
  const playerContainerRef = useRef(null)

  const handlePlayPause = () => {
    setPlaying(!playing)
    toast.info(playing ? 'Video paused' : 'Video playing')
  }

  const handleProgress = (state) => {
    setPlayed(state.played)
    if (onProgress) {
      onProgress(state)
    }
  }

  const handleSeekChange = (e) => {
    const seekTo = parseFloat(e.target.value)
    setPlayed(seekTo)
    if (playerRef.current) {
      playerRef.current.seekTo(seekTo)
    }
  }

  const handleRewind = () => {
    const seekTo = Math.max(0, played - 0.1)
    setPlayed(seekTo)
    if (playerRef.current) {
      playerRef.current.seekTo(seekTo)
    }
    toast.info('Rewound 10 seconds')
  }

  const handleFastForward = () => {
    const seekTo = Math.min(1, played + 0.1)
    setPlayed(seekTo)
    if (playerRef.current) {
      playerRef.current.seekTo(seekTo)
    }
    toast.info('Fast forwarded 10 seconds')
  }

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value))
  }

  const toggleMute = () => {
    setMuted(!muted)
    toast.info(muted ? 'Video unmuted' : 'Video muted')
  }

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed)
    toast.info(`Playback speed: ${speed}x`)
  }

  const toggleFullscreen = () => {
    if (!fullscreen) {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setFullscreen(!fullscreen)
  }

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` 
                 : `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className={`relative bg-black rounded-xl overflow-hidden ${className}`}>
      <div 
        ref={playerContainerRef}
        className="relative w-full aspect-video"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          onProgress={handleProgress}
          onDuration={setDuration}
          onEnded={() => {
            setPlaying(false)
            toast.success('Video completed!')
            if (onEnded) onEnded()
          }}
          onError={() => toast.error('Error loading video')}
          config={{
            youtube: {
              playerVars: {
                showinfo: 0,
                controls: 0,
                modestbranding: 1
              }
            }
          }}
        />

        {/* Custom Controls Overlay */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
        >
          {/* Progress Bar */}
          <div className="mb-3">
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={played}
              onChange={handleSeekChange}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center space-x-3">
              <button onClick={handlePlayPause} className="text-white hover:text-primary transition-colors">
                <ApperIcon name={playing ? "Pause" : "Play"} className="h-6 w-6" />
              </button>
              <button onClick={handleRewind} className="text-white hover:text-primary transition-colors">
                <ApperIcon name="RotateCcw" className="h-5 w-5" />
              </button>
              <button onClick={handleFastForward} className="text-white hover:text-primary transition-colors">
                <ApperIcon name="RotateCw" className="h-5 w-5" />
              </button>
              <span className="text-white text-sm">
                {formatTime(played * duration)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
                <ApperIcon name={muted ? "VolumeX" : "Volume2"} className="h-5 w-5" />
              </button>
              <button onClick={toggleFullscreen} className="text-white hover:text-primary transition-colors">
                <ApperIcon name={fullscreen ? "Minimize" : "Maximize"} className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VideoPlayer