const clock = document.querySelector('#clock');
const audioFile = document.querySelector('#audio-file');
const audioPreview = document.querySelector('#audio-preview');
const uploadForm = document.querySelector('#upload-form');
const uploadResult = document.querySelector('#upload-result');
const uploadButton = document.querySelector('.upload-submit');
const syncButton = document.querySelector('#sync-library');
const lyricsField = document.querySelector('#lyrics');
const SUPABASE_URL = 'https://zptawselvorzmatszeyi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7Av0eqaAcDelCQ1cMoaQYw_W0VMcyHR';
const supabaseClient = window.supabase && !SUPABASE_URL.startsWith('PASTE_') && !SUPABASE_ANON_KEY.startsWith('PASTE_')
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
const bundledTracks = [
  { id: 'library-aadat', title: 'Aadat (Juda Hoke Bhi)', artist: 'Atif Aslam · Kalyug', file: 'aadat.mp3', slug: 'aadat' },
  { id: 'library-aaj-phir', title: 'Aaj Phir', artist: 'Arijit Singh · Hate Story 2', file: 'Aaj Phir.mp3', slug: 'aaj-phir' },
  { id: 'library-chhod-diya', title: 'Chhod Diya', artist: 'Arijit Singh, Kanika Kapoor · Baazaar', file: 'Chhod Diya.mp3', slug: 'chhod-diya' },
  { id: 'library-dil-ibaadat', title: 'Dil Ibaadat Kar Raha Hai', artist: 'KK · Tum Mile', file: 'Dil Ibaadat.mp3', slug: 'dil-ibaadat' },
  { id: 'library-labon-ko', title: 'Labon Ko', artist: 'K.K. · Bhool Bhulaiyaa', file: 'Labon Ko.mp3', slug: 'labon-ko' },
  { id: 'library-tera-mera', title: 'Tera Mera Rishta Continues', artist: 'Emraan Hashmi · Awarapan 2', file: 'Tera Mera.mp3', slug: 'tera-mera' }
];
let audioUrl;

const updateClock = () => {
  clock.textContent = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date()).toLowerCase();
};

updateClock();
setInterval(updateClock, 30000);

audioFile.addEventListener('change', () => {
  const file = audioFile.files[0];
  if (!file) return;
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioUrl = URL.createObjectURL(file);
  audioPreview.src = audioUrl;
  audioPreview.classList.add('visible');
  uploadResult.textContent = `Ready: ${file.name}`;
});

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const file = audioFile.files[0];
  const lyrics = lyricsField.value.trim();

  if (!file || !file.name.toLowerCase().endsWith('.mp3')) {
    uploadResult.textContent = 'Please choose an MP3 audio file.';
    return;
  }

  if (!lyrics) {
    uploadResult.textContent = 'Please add the lyrics before previewing.';
    return;
  }

  if (!window.supabase || SUPABASE_URL.startsWith('PASTE_') || SUPABASE_ANON_KEY.startsWith('PASTE_')) {
    uploadResult.textContent = 'Supabase is not configured for uploads yet.';
    return;
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const filePath = `${Date.now()}-${safeName}`;
  const lyricsPath = filePath.replace(/\.mp3$/i, '.txt');
  const storage = supabaseClient.storage.from('songs');

  uploadButton.disabled = true;
  uploadButton.textContent = 'UPLOADING...';
  uploadResult.textContent = '';

  const audioUpload = await storage.upload(filePath, file, { contentType: 'audio/mpeg', upsert: false });
  if (audioUpload.error) {
    uploadResult.textContent = `Upload failed: ${audioUpload.error.message}`;
    uploadButton.disabled = false;
    uploadButton.innerHTML = 'UPLOAD <span>↗</span>';
    return;
  }

  const lyricsUpload = await storage.upload(lyricsPath, new Blob([lyrics], { type: 'text/plain' }), { contentType: 'text/plain', upsert: false });
  if (lyricsUpload.error) {
    uploadResult.textContent = `Lyrics upload failed: ${lyricsUpload.error.message}`;
    uploadButton.disabled = false;
    uploadButton.innerHTML = 'UPLOAD <span>↗</span>';
    return;
  }

  const { error: trackError } = await supabaseClient.from('tracks').insert({
    title: file.name.replace(/\.mp3$/i, '').replace(/[-_]/g, ' '),
    artist: 'Community upload',
    audio_path: filePath,
    lyrics_path: lyricsPath,
    sort_order: 1000
  });
  if (trackError) {
    uploadResult.textContent = `Catalog update failed: ${trackError.message}`;
    uploadButton.disabled = false;
    uploadButton.innerHTML = 'UPLOAD <span>↗</span>';
    return;
  }

  uploadResult.textContent = `Uploaded successfully: ${filePath}`;
  uploadForm.reset();
  audioPreview.removeAttribute('src');
  audioPreview.classList.remove('visible');
  uploadButton.disabled = false;
  uploadButton.innerHTML = 'UPLOAD <span>↗</span>';
});

syncButton.addEventListener('click', async () => {
  if (!supabaseClient) {
    uploadResult.textContent = 'Supabase is not configured for uploads yet.';
    return;
  }

  const storage = supabaseClient.storage.from('songs');
  syncButton.disabled = true;
  syncButton.textContent = 'SYNCING LIBRARY...';
  let synced = 0;

  try {
    for (const [index, track] of bundledTracks.entries()) {
      const { data: existing, error: lookupError } = await supabaseClient
        .from('tracks')
        .select('id')
        .eq('id', track.id)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (existing) continue;

      const audioPath = `library/${track.slug}.mp3`;
      const lyricsPath = `library/${track.slug}.txt`;
      const [audioResponse, lyricsResponse] = await Promise.all([
        fetch(`songs/${encodeURIComponent(track.file)}`),
        fetch(`lyrics/${encodeURIComponent(track.file.replace(/\.mp3$/i, '.txt'))}`)
      ]);
      if (!audioResponse.ok || !lyricsResponse.ok) throw new Error(`Could not read local files for ${track.title}.`);

      const [audioBlob, lyricsBlob] = await Promise.all([audioResponse.blob(), lyricsResponse.blob()]);
      const { error: audioError } = await storage.upload(audioPath, audioBlob, { contentType: 'audio/mpeg' });
      if (audioError) throw audioError;

      const { error: lyricsError } = await storage.upload(lyricsPath, lyricsBlob, { contentType: 'text/plain' });
      if (lyricsError) {
        throw lyricsError;
      }

      const { error: insertError } = await supabaseClient.from('tracks').insert({
        id: track.id,
        title: track.title,
        artist: track.artist,
        audio_path: audioPath,
        lyrics_path: lyricsPath,
        sort_order: index + 1
      });
      if (insertError) {
        throw insertError;
      }
      synced += 1;
    }
    uploadResult.textContent = synced
      ? `Synced ${synced} bundled song${synced === 1 ? '' : 's'} with lyrics.`
      : 'The bundled library is already synced.';
  } catch (error) {
    uploadResult.textContent = `Library sync failed: ${error.message}`;
  } finally {
    syncButton.disabled = false;
    syncButton.innerHTML = 'SYNC BUNDLED LIBRARY <span>↗</span>';
  }
});
