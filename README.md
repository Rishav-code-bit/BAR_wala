Markdown
# 🍸 BAR WALA (बार वाला)

> **"Good drinks. Loud stories. One more song."**

BAR WALA is an interactive, atmospheric web-based music experience designed to recreate the cozy, ambient vibe of late-night rooftop hangouts. Featuring real-time listener tracking, custom audio upload capabilities, synced lyrics support, and integrations with external music platforms[cite: 1, 2].

---

## ✨ Features

* **Rooftop Ambience & Music Player:** Embedded audio player with playback controls, current track information, and community-driven music playback[cite: 1].
* **Real-time Online Counter:** Live tracking displaying the number of active listeners tuned into the room[cite: 1].
* **Community Music Uploads:** Users can upload custom MP3 tracks along with synchronized lyrics stored directly via Supabase backend integration[cite: 2].
* **Synced Lyrics Support:** Displays synced lyrics dynamically with track playback[cite: 2].
* **Streaming Links Integration:** Direct links out to Spotify and YouTube Music playlists[cite: 1].

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Backend / Storage:** Supabase (for song bucket storage and community uploads)[cite: 2]
* **Hosting / Deployment:** Netlify[cite: 1, 2]

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v16.0 or higher recommended)
* A [Supabase](https://supabase.com/) account and project setup for audio file storage[cite: 2].

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/barwala.git](https://github.com/your-username/barwala.git)
   cd barwala
Install dependencies:

```bash
npm install
Set up Environment Variables:
Create a .env file in the root directory and configure your Supabase keys:

Code snippet
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Run local development server:

```bash
npm run dev

🌐 Live Demo
Check out the live website hosted on Netlify:
👉 [barwala](https://barwala.netlify.app/)

![image](https://github.com/user-attachments/assets/image_2a1fa0.jpg)
<br/>

![image](https://github.com/user-attachments/assets/image_2a717f.jpg)

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

📜 License
This project is open source and available under the MIT License.
