const v = document.getElementById('myVideo');
const a = document.getElementById('myAudio');

document.getElementById('playBtn').onclick   = () => v.play();
document.getElementById('pauseBtn').onclick  = () => v.pause();
document.getElementById('rewindBtn').onclick = () => v.currentTime = Math.max(0, v.currentTime - 5);
document.getElementById('forwardBtn').onclick= () => v.currentTime += 5;
document.getElementById('slowBtn').onclick   = () => v.playbackRate = 0.5;
document.getElementById('normalBtn').onclick = () => v.playbackRate = 1;

//audio
document.getElementById('aPlay').onclick    = () => a.play();
document.getElementById('aPause').onclick   = () => a.pause();
document.getElementById('aRewind').onclick  = () => { a.currentTime = Math.max(0, a.currentTime - 5); };
document.getElementById('aForward').onclick = () => {
  const end = Number.isFinite(a.duration) ? a.duration : a.currentTime + 5;
  a.currentTime = Math.min(end, a.currentTime + 5);
};
document.getElementById('aSlow').onclick    = () => { a.playbackRate = 0.5; };
document.getElementById('aNormal').onclick  = () => { a.playbackRate = 1; };

// Example: change background at 10 s
v.addEventListener('timeupdate', () => {
  if (v.currentTime >= 5 && v.currentTime < 12) {
    document.body.style.backgroundColor = '#6994cdff';
  } else {
    document.body.style.backgroundColor = '#111';
  }
});

// reset at end
v.addEventListener('ended', () => alert('Thanks for watching!'));

// subtitles (optional)
v.addEventListener('loadedmetadata', () => {
  for (const t of v.textTracks) t.mode = 'disabled';
  v.textTracks[0].mode = 'showing';
});
