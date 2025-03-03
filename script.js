let currentAudio = null;
let audioContext;
let analyser;
let dataArray;
let source;
let animationId;

// Initialise the AudioContext and connect the analyser node.
function initAudioContext(audio) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    // Using a larger FFT size for better resolution
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }
  
  // Create a media element source and connect it.
  // This needs to be recreated for each new audio element
  source = audioContext.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioContext.destination);
}

function togglePlay(button) {
  const trackElement = button.closest('.track');
  const audioSrc = trackElement.getAttribute('data-src');
  
  // If a different track is selected, pause the current one.
  if (!currentAudio || currentAudio.src !== audioSrc) {
    if (currentAudio && !currentAudio.paused) {
      currentAudio.pause();
      // Find and update the previous playing button
      document.querySelectorAll('.track button.playing').forEach(btn => {
        btn.classList.remove('playing');
      });
    }
    
    // Stop any ongoing animation
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    
    // Create new audio element
    currentAudio = new Audio(audioSrc);
    
    // Reset AudioContext when switching audio sources to avoid multiple connections
    if (audioContext) {
      if (source) {
        source.disconnect();
      }
    }
    
    initAudioContext(currentAudio);
    
    // Initialize the waveform display
    initializeWaveform(trackElement);
  }
  
  if (currentAudio.paused) {
    // Resume AudioContext if it was suspended (needed for some browsers)
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    currentAudio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
    
    button.classList.add('playing');
    drawProgressiveWaveform(trackElement);
  } else {
    currentAudio.pause();
    button.classList.remove('playing');
    
    // Pause the animation
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
}

function initializeWaveform(trackElement) {
  const waveform = trackElement.querySelector('.waveform');
  if (!waveform) {
    console.error('Waveform element not found');
    return;
  }
  
  // Clear any existing bars
  waveform.innerHTML = '';
  
  // Create a fixed number of bars for the waveform
  const totalBars = 100; // You can adjust this number
  
  for (let i = 0; i < totalBars; i++) {
    const bar = document.createElement('div');
    bar.className = 'waveform-bar';
    bar.style.height = '0%';
    bar.style.backgroundColor = '#3498db'; // Default color
    waveform.appendChild(bar);
  }
}

function drawProgressiveWaveform(trackElement) {
  const waveform = trackElement.querySelector('.waveform');
  if (!waveform) {
    console.error('Waveform element not found');
    return;
  }
  
  const bars = waveform.querySelectorAll('.waveform-bar');
  if (bars.length === 0) {
    console.error('No waveform bars found');
    return;
  }
  
  function draw() {
    if (!currentAudio || currentAudio.paused) {
      return; // Stop the animation when audio is paused.
    }
    
    // Populate the dataArray with frequency data.
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate current playback position as a percentage
    const currentPosition = currentAudio.currentTime / currentAudio.duration;
    
    // Determine which bar corresponds to the current playback position
    const currentBarIndex = Math.floor(currentPosition * bars.length);
    
    // Update bars
    bars.forEach((bar, index) => {
      if (index < currentBarIndex) {
        // Bars before the current position - show as played (filled)
        const binIndex = Math.floor(index * dataArray.length / bars.length);
        const value = dataArray[binIndex] || 0;
        const heightPercent = Math.max(10, (value / 255) * 100); // Ensure a minimum height
        bar.style.height = heightPercent + '%';
        bar.style.backgroundColor = '#27ae60'; // Green for played portion
        bar.style.opacity = '0.7';
      } else if (index === currentBarIndex) {
        // Current playback position - highlight
        const binIndex = Math.floor(index * dataArray.length / bars.length);
        const value = dataArray[binIndex] || 0;
        const heightPercent = Math.max(15, (value / 255) * 100);
        bar.style.height = heightPercent + '%';
        bar.style.backgroundColor = '#e74c3c'; // Red for current position
        bar.style.opacity = '1';
      } else {
        // Future bars - lower opacity
        const binIndex = Math.floor(index * dataArray.length / bars.length);
        const value = dataArray[binIndex] || 0;
        const heightPercent = Math.max(5, (value / 255) * 100);
        bar.style.height = heightPercent + '%';
        bar.style.backgroundColor = '#3498db'; // Blue for unplayed
        bar.style.opacity = '0.4';
      }
    });
    
    // Continue updating the bars on the next animation frame.
    animationId = requestAnimationFrame(draw);
  }
  
  // Start the animation
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  animationId = requestAnimationFrame(draw);
}

// Add an event listener for when the audio ends
function setupAudioEndListener(audio, button) {
  audio.addEventListener('ended', function() {
    button.classList.remove('playing');
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  });
}