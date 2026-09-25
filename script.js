const toast = document.querySelector('#toast');
let toastTimer;

const SUPABASE_URL = '**************';
const SUPABASE_ANON_KEY = '*****************';
const supabaseClient = window.supabase && !SUPABASE_URL.startsWith('PASTE_') && !SUPABASE_ANON_KEY.startsWith('PASTE_')
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
const onlineCount = document.querySelector('#online-count');

const updateOnlineCount = (presenceState) => {
  const count = Object.values(presenceState)
    .reduce((total, presences) => total + presences.length, 0);
  onlineCount.textContent = count;
};

const startPresence = async () => {
  if (!supabaseClient) return;

  const channel = supabaseClient.channel('bar-wala-online', { config: { presence: { key: crypto.randomUUID() } } });

  channel
    .on('presence', { event: 'sync' }, () => updateOnlineCount(channel.presenceState()))
    .on('presence', { event: 'join' }, () => updateOnlineCount(channel.presenceState()))
    .on('presence', { event: 'leave' }, () => updateOnlineCount(channel.presenceState()));

  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') await channel.track({ onlineAt: new Date().toISOString() });
  });
};

startPresence();

const localTracks = [
  { id: 'library-aadat', title: 'Aadat (Juda Hoke Bhi)', artist: 'Atif Aslam · Kalyug', file: 'aadat.mp3' },
  { id: 'library-aaj-phir', title: 'Aaj Phir', artist: 'Arijit Singh · Hate Story 2', file: 'Aaj Phir.mp3' },
  { id: 'library-chhod-diya', title: 'Chhod Diya', artist: 'Arijit Singh, Kanika Kapoor · Baazaar', file: 'Chhod Diya.mp3' },
  { id: 'library-dil-ibaadat', title: 'Dil Ibaadat Kar Raha Hai', artist: 'KK · Tum Mile', file: 'Dil Ibaadat.mp3' },
  { id: 'library-labon-ko', title: 'Labon Ko', artist: 'K.K. · Bhool Bhulaiyaa', file: 'Labon Ko.mp3' },
  { id: 'library-tera-mera', title: 'Tera Mera Rishta Continues', artist: 'Emraan Hashmi · Awarapan 2', file: 'Tera Mera.mp3' }
];
let tracks = localTracks;
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

let currentLyricLines = [];

const syncLyrics = () => {
  const lyricsContent = document.querySelector('#lyrics-content');
  if (!lyricsContent || !currentLyricLines.length || !Number.isFinite(songAudio.duration) || songAudio.duration <= 0) return;

  const hasTimestamps = currentLyricLines.some((line) => Number.isFinite(line.start));
  const activeIndex = hasTimestamps
    ? currentLyricLines.reduce((lastIndex, line, index) => (
      line.start <= songAudio.currentTime ? index : lastIndex
    ), 0)
    : Math.min(
      currentLyricLines.length - 1,
      Math.max(0, Math.floor((songAudio.currentTime / songAudio.duration) * currentLyricLines.length))
    );

  const lines = lyricsContent.querySelectorAll('.lyrics-line');
  lines.forEach((line, index) => {
    line.classList.toggle('active', index === activeIndex);
  });

  const activeLine = lines[activeIndex];
  if (activeLine && lyricsPanel.classList.contains('open')) {
    activeLine.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
};

const renderLyrics = (lyricsText) => {
  const lyricsContent = document.querySelector('#lyrics-content');
  if (!lyricsContent) return;

  const rawLines = (lyricsText || '')
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const timestampedLines = rawLines
    .map((line) => {
      const match = line.match(/^\[(\d{1,2}):(\d{2}(?:\.\d+)?)\]\s*(.*)$/);
      if (!match) return null;
      return { start: Number(match[1]) * 60 + Number(match[2]), text: match[3].trim() };
    })
    .filter((line) => line && line.text);

  currentLyricLines = timestampedLines.length === rawLines.length
    ? timestampedLines
    : rawLines.map((text) => ({ text, start: Number.NaN }));

  if (!currentLyricLines.length) {
    lyricsContent.innerHTML = 'No lyrics added for this track yet.';
    return;
  }

  lyricsContent.replaceChildren(...currentLyricLines.map((line) => {
    const element = document.createElement('span');
    element.className = 'lyrics-line';
    element.textContent = line.text;
    return element;
  }));

  syncLyrics();
};

const loadLyrics = async (track) => {
  const requestId = ++lyricsRequestId;
  const lyricsContent = document.querySelector('#lyrics-content');
  lyricsContent.textContent = 'Loading lyrics...';
  currentLyricLines = [];

  const lyricsFile = track.file?.replace(/\.mp3$/i, '.txt');
  try {
    const response = await fetch(track.lyricsUrl || `lyrics/${encodeURIComponent(lyricsFile)}`);
    if (!response.ok) throw new Error('Lyrics file not found');
    const lyrics = await response.text();
    if (requestId === lyricsRequestId) renderLyrics(lyrics.trim());
  } catch {
    if (track.file && track.lyricsUrl) {
      try {
        const response = await fetch(`lyrics/${encodeURIComponent(lyricsFile)}`);
        if (!response.ok) throw new Error('Local lyrics file not found');
        const lyrics = await response.text();
        if (requestId === lyricsRequestId) renderLyrics(lyrics.trim());
      } catch {
        if (requestId === lyricsRequestId) renderLyrics('');
      }
    } else if (requestId === lyricsRequestId) {
      renderLyrics('');
    }
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
  songAudio.dataset.localFallbackTried = 'false';
  songAudio.src = tracks[currentTrack].audioUrl || `songs/${encodeURIComponent(tracks[currentTrack].file)}`;
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
songAudio.addEventListener('loadedmetadata', () => {
  duration.textContent = formatTime(songAudio.duration);
  syncLyrics();
});
songAudio.addEventListener('timeupdate', () => {
  currentTime.textContent = formatTime(songAudio.currentTime);
  progressFill.style.width = `${songAudio.duration ? (songAudio.currentTime / songAudio.duration) * 100 : 0}%`;
  syncLyrics();
});
songAudio.addEventListener('seeking', syncLyrics);
songAudio.addEventListener('ended', () => loadTrack(currentTrack + 1, true));
songAudio.addEventListener('error', () => {
  const track = tracks[currentTrack];
  if (!track.audioUrl || !track.file || songAudio.dataset.localFallbackTried === 'true') return;
  songAudio.dataset.localFallbackTried = 'true';
  songAudio.src = `songs/${encodeURIComponent(track.file)}`;
});

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
// async function loadLyrics(songName) {
//     const lyricsElement = document.getElementById("lyrics-content");

//     try {
//         const response = await fetch(`lyrics/${songName}.txt`);

//         if (!response.ok) {
//             throw new Error();
//         }

//         lyricsElement.textContent = await response.text();

//     } catch {
//         lyricsElement.textContent = "No lyrics added for this track yet.";
//     }
// }
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

const loadOnlineCatalog = async () => {
  if (!supabaseClient) return;

  const { data, error } = await supabaseClient
    .from('tracks')
    .select('id, title, artist, audio_path, lyrics_path')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error || !data?.length) return;

  tracks = data.map((track) => ({
    ...track,
    file: localTracks.find((localTrack) => localTrack.id === track.id)?.file,
    audioUrl: supabaseClient.storage.from('songs').getPublicUrl(track.audio_path).data.publicUrl,
    lyricsUrl: supabaseClient.storage.from('songs').getPublicUrl(track.lyrics_path).data.publicUrl
  }));
  loadTrack(0);
};

loadOnlineCatalog();
