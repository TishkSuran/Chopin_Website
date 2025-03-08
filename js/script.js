/**
 * Chopin Music Player
 * Features:
 * - Play/pause functionality
 * - Seeking through tracks
 * - Time display
 */

// Global variable to store the currently playing audio
let currentAudio = null;

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set up play buttons
  document.querySelectorAll('.play-btn').forEach(button => {
    button.addEventListener('click', function() {
      const track = this.closest('.track');
      togglePlay(track);
    });
  });
  
  // Set up progress bar seeking
  document.querySelectorAll('.progress-bar').forEach(progressBar => {
    progressBar.addEventListener('click', function(event) {
      const track = this.closest('.track');
      seekAudio(track, event);
    });
  });
});

/**
 * Toggle play/pause for a track
 * @param {HTMLElement} track - The track element to play/pause
 */
function togglePlay(track) {
  const audioSrc = track.getAttribute('data-src');
  const playBtn = track.querySelector('.play-btn');
  
  // If we already have a different audio playing, stop it
  if (currentAudio && currentAudio.getAttribute('data-track-id') !== track.id) {
    const previousTrack = document.getElementById(currentAudio.getAttribute('data-track-id'));
    if (previousTrack) {
      resetPlayButton(previousTrack);
    }
    currentAudio.pause();
  }
  
  // Get or create the audio element for this track
  let audio = track.querySelector('audio');
  if (!audio) {
    audio = document.createElement('audio');
    audio.src = audioSrc;
    audio.setAttribute('data-track-id', track.id);
    
    // Set up audio event listeners
    audio.addEventListener('timeupdate', () => updateProgress(track));
    audio.addEventListener('loadedmetadata', () => updateDuration(track));
    audio.addEventListener('ended', () => resetPlayButton(track));
    
    // Add loading indicator
    audio.addEventListener('waiting', () => track.classList.add('loading'));
    audio.addEventListener('canplaythrough', () => track.classList.remove('loading'));
    
    track.appendChild(audio);
  }
  
  // Toggle play/pause
  if (audio.paused) {
    // Show loading indicator until audio starts playing
    track.classList.add('loading');
    
    // Pause any currently playing audio
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
    }
    
    // Update current audio reference
    currentAudio = audio;
    
    // Play the audio
    audio.play()
      .then(() => {
        // Remove loading indicator once playing
        track.classList.remove('loading');
        
        // Update button to show pause icon
        playBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor"/>
          </svg>
        `;
      })
      .catch(error => {
        console.error('Error playing audio:', error);
        track.classList.remove('loading');
        alert('Error playing audio. Please check if the file exists at the correct path.');
      });
  } else {
    // Pause the audio
    audio.pause();
    
    // Update button to show play icon
    resetPlayButton(track);
  }
}

/**
 * Update the progress bar for a track
 * @param {HTMLElement} track - The track element
 */
function updateProgress(track) {
  const audio = track.querySelector('audio');
  const progressFill = track.querySelector('.progress-fill');
  const currentTimeEl = track.querySelector('.current-time');
  
  if (audio && progressFill && currentTimeEl) {
    // Calculate progress percentage
    const progress = (audio.currentTime / audio.duration) * 100;
    
    // Update progress bar width
    progressFill.style.width = `${progress}%`;
    
    // Update time display
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
}

/**
 * Update the duration display for a track
 * @param {HTMLElement} track - The track element
 */
function updateDuration(track) {
  const audio = track.querySelector('audio');
  const durationEl = track.querySelector('.duration');
  
  if (audio && durationEl && !isNaN(audio.duration)) {
    durationEl.textContent = formatTime(audio.duration);
  }
}

/**
 * Reset the play button to show play icon
 * @param {HTMLElement} track - The track element
 */
function resetPlayButton(track) {
  const playBtn = track.querySelector('.play-btn');
  if (playBtn) {
    playBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
      </svg>
    `;
  }
}

/**
 * Seek to a position in the audio when clicking the progress bar
 * @param {HTMLElement} track - The track element
 * @param {Event} event - The click event
 */
function seekAudio(track, event) {
  const audio = track.querySelector('audio');
  const progressBar = track.querySelector('.progress-bar');
  
  if (audio && progressBar) {
    // Get click position relative to progress bar
    const rect = progressBar.getBoundingClientRect();
    const clickPos = (event.clientX - rect.left) / rect.width;
    
    // Set the audio time based on click position
    audio.currentTime = clickPos * audio.duration;
    
    // Update progress display
    updateProgress(track);
  }
}

/**
 * Format time in MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}