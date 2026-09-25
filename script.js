const toast = document.querySelector('#toast');
let toastTimer;

const SUPABASE_URL = 'https://zptawselvorzmatszeyi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7Av0eqaAcDelCQ1cMoaQYw_W0VMcyHR';
const onlineCount = document.querySelector('#online-count');

const updateOnlineCount = (presenceState) => {
  const count = Object.values(presenceState)
    .reduce((total, presences) => total + presences.length, 0);
  onlineCount.textContent = count;
};

const startPresence = async () => {
  if (!window.supabase || SUPABASE_URL.startsWith('PASTE_') || SUPABASE_ANON_KEY.startsWith('PASTE_')) return;

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const channel = client.channel('bar-wala-online', { config: { presence: { key: crypto.randomUUID() } } });

  channel
    .on('presence', { event: 'sync' }, () => updateOnlineCount(channel.presenceState()))
    .on('presence', { event: 'join' }, () => updateOnlineCount(channel.presenceState()))
    .on('presence', { event: 'leave' }, () => updateOnlineCount(channel.presenceState()));

  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') await channel.track({ onlineAt: new Date().toISOString() });
  });
};

startPresence();

const tracks = [
  { title: 'Aadat (Juda Hoke Bhi)', artist: 'Atif Aslam · Kalyug', file: 'Aadat (Juda Hoke Bhi) Atif Aslam Kunal Khemu Kalyug Sayeed Q Emraan Hashmi.mp3' },
  { title: 'Aaj Phir', artist: 'Arijit Singh · Hate Story 2', file: 'Aaj Phir Full Video Song Hate Story 2 Arijit Singh Jay Bhanushali Surveen Chawla.mp3' },
  { title: 'Chhod Diya', artist: 'Arijit Singh, Kanika Kapoor · Baazaar', file: 'Chhod Diya (Lyrics) - Arijit Singh, Kanika Kapoor Baazaar.mp3' },
  { title: 'Dil Ibaadat Kar Raha Hai', artist: 'KK · Tum Mile', file: 'KK Dil Ibaadat Kar Raha Hai (Lyrical Video) Emraan Hashmi Soha Ali Khan Pritam Tum Mile.mp3' },
  { title: 'Labon Ko', artist: 'K.K. · Bhool Bhulaiyaa', file: 'Lyrical Labon Ko Bhool Bhulaiyaa Pritam K.K. Akshay Kumar, Shiney Ahuja, Vidya Balan.mp3' },
  { title: 'Tera Mera Rishta Continues', artist: 'Emraan Hashmi · Awarapan 2', file: 'Tera Mera Rishta Continues (Film Ballad) Awarapan 2 Emraan, Disha Mithoon, Saaj, Sayeed, Mustafa.mp3' }
];
const songAudio = document.querySelector('#songAudio');
const miniPlayer = document.querySelector('.mini-player');
const miniPlay = document.querySelector('[data-action="mini-play"]');
const progressFill = document.querySelector('#progress-fill');
const currentTime = document.querySelector('#current-time');
const duration = document.querySelector('#duration');
let currentTrack = 0;
let lyricsRequestId = 0;

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
};

const loadLyrics = async (track) => {
  const requestId = ++lyricsRequestId;
  const lyricsContent = document.querySelector('#lyrics-content');
  lyricsContent.textContent = 'Loading lyrics...';

  const lyricsFile = track.file.replace(/\.mp3$/i, '.txt');
  try {
    const response = await fetch(`lyrics/${encodeURIComponent(lyricsFile)}`);
    if (!response.ok) throw new Error('Lyrics file not found');
    const lyrics = await response.text();
    if (requestId === lyricsRequestId) lyricsContent.textContent = lyrics.trim() || 'No lyrics added for this track yet.';
  } catch {
    if (requestId === lyricsRequestId) lyricsContent.textContent = 'No lyrics added for this track yet.';
  }
};

const updateTrackText = () => {
  const track = tracks[currentTrack];
  document.querySelector('#track-title').textContent = track.title;
  document.querySelector('#track-artist').textContent = track.artist;
  document.querySelector('#lyrics-title').textContent = track.title;
  document.querySelector('#lyrics-artist').textContent = track.artist;
  loadLyrics(track);
};

const loadTrack = (index, play = false) => {
  currentTrack = (index + tracks.length) % tracks.length;
  songAudio.src = `songs/${encodeURIComponent(tracks[currentTrack].file)}`;
  updateTrackText();
  if (play) songAudio.play().catch(() => showToast('Press play to start the song.'));
};

const setPlaying = (playing) => {
  miniPlayer.classList.toggle('playing', playing);
  miniPlay.querySelector('span').textContent = playing ? 'Ⅱ' : '▶';
  miniPlay.setAttribute('aria-label', playing ? 'Pause' : 'Play');
};

songAudio.addEventListener('play', () => setPlaying(true));
songAudio.addEventListener('pause', () => setPlaying(false));
songAudio.addEventListener('loadedmetadata', () => { duration.textContent = formatTime(songAudio.duration); });
songAudio.addEventListener('timeupdate', () => {
  currentTime.textContent = formatTime(songAudio.currentTime);
  progressFill.style.width = `${songAudio.duration ? (songAudio.currentTime / songAudio.duration) * 100 : 0}%`;
});
songAudio.addEventListener('ended', () => loadTrack(currentTrack + 1, true));

const clock = document.querySelector('#clock');
const updateClock = () => {
  clock.textContent = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date()).toLowerCase();
};
updateClock();
setInterval(updateClock, 30000);

const showToast = (message) => {
  toast.innerHTML = `<span>✦</span> ${message}`;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
};

document.querySelector('[data-action="cheers"]').addEventListener('click', () => showToast('Cheers! Offline music is ready.'));

miniPlay.addEventListener('click', () => {
  if (songAudio.paused) songAudio.play().catch(() => showToast('Press play again to start the song.'));
  else songAudio.pause();
});
document.querySelector('[data-action="previous"]').addEventListener('click', () => loadTrack(currentTrack - 1, true));
document.querySelector('[data-action="next"]').addEventListener('click', () => loadTrack(currentTrack + 1, true));

const lyricsButton = document.querySelector('[data-action="lyrics"]');
const lyricsPanel = document.querySelector('#lyrics-panel');
const closeLyrics = () => {
  lyricsPanel.classList.remove('open');
  lyricsPanel.setAttribute('aria-hidden', 'true');
  lyricsButton.setAttribute('aria-expanded', 'false');
};

lyricsButton.addEventListener('click', () => {
  const isOpen = lyricsPanel.classList.toggle('open');
  lyricsPanel.setAttribute('aria-hidden', String(!isOpen));
  lyricsButton.setAttribute('aria-expanded', String(isOpen));
});
document.querySelector('[data-action="close-lyrics"]').addEventListener('click', closeLyrics);

loadTrack(0);
