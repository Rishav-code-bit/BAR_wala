const clock = document.querySelector('#clock');
const audioFile = document.querySelector('#audio-file');
const audioPreview = document.querySelector('#audio-preview');
const uploadForm = document.querySelector('#upload-form');
const uploadResult = document.querySelector('#upload-result');
const uploadButton = document.querySelector('.upload-submit');
const lyricsField = document.querySelector('#lyrics');
const SUPABASE_URL = 'https://zptawselvorzmatszeyi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7Av0eqaAcDelCQ1cMoaQYw_W0VMcyHR';
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
  const storage = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY).storage.from('songs');

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
    await storage.remove([filePath]);
    uploadResult.textContent = `Lyrics upload failed: ${lyricsUpload.error.message}`;
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
