const clock = document.querySelector('#clock');
const audioFile = document.querySelector('#audio-file');
const audioPreview = document.querySelector('#audio-preview');
const uploadForm = document.querySelector('#upload-form');
const uploadResult = document.querySelector('#upload-result');
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

uploadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const file = audioFile.files[0];
  const lyrics = document.querySelector('#lyrics').value.trim();

  if (!file || !file.name.toLowerCase().endsWith('.mp3')) {
    uploadResult.textContent = 'Please choose an MP3 audio file.';
    return;
  }

  if (!lyrics) {
    uploadResult.textContent = 'Please add the lyrics before previewing.';
    return;
  }

  uploadResult.textContent = `Preview ready for ${file.name}. The audio and lyrics are available in this browser session.`;
});
