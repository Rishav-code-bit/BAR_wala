# 🍻 Bar Wala

> **Good drinks. Loud stories. One more song.**

**Bar Wala** is a fun, immersive web-based music experience designed for late-night vibes, drinks, parties, and everything that happens after the first song.

🌐 **Live Website:** https://barwala.netlify.app/

---

## 🎵 About

**Bar Wala** is more than just a music player — it's a digital **after-dark jukebox**.

The project creates a bar-inspired atmosphere where users can enjoy music, interact with the interface, explore playlists, view lyrics, and connect with external music platforms.

The design is inspired by the chaotic, fun, and familiar **"wala" culture** — *Theka Wala, Truck Wala, Auto Wala, Bar Wala* — turning it into a playful digital experience.

---

## ✨ Features

* 🎧 **Music Player**

  * Play and pause tracks
  * Previous/next track controls
  * Track progress and duration
  * Currently playing information

* 🍻 **Cheers Interaction**

  * Interactive "Cheers" button
  * Button sound effects and visual feedback
  * Designed to make the interface feel more alive

* 🎶 **Playlist Experience**

  * Dedicated Bar Wala playlist
  * Track-based music experience
  * "Now Playing" section

* 📝 **Lyrics Panel**

  * Displays lyrics for the currently selected track
  * Expandable lyrics interface
  * Track-specific lyrics support

* 🎵 **External Music Platforms**

  * Spotify integration/link
  * YouTube Music integration/link

* 📤 **Music Upload**

  * Upload interface for adding music to the experience

* 🌙 **After-Dark UI**

  * Bar/nightlife-inspired visual design
  * Responsive layout
  * Interactive animations and transitions
  * Immersive music-focused interface

---

## 🖥️ Preview

### Bar Wala

**BAR WALA FM — 24 / 7**

> GOOD VIBES ONLY
> LIVE FROM THE ROOFTOP

**Now Playing**

`Aadat (Juda Hoke Bhi)`
*Atif Aslam · Kalyug*

---

## 🛠️ Tech Stack

The project is built as a lightweight web experience using modern frontend technologies.

* **HTML5** — Structure
* **CSS3** — Styling, animations & responsive design
* **JavaScript** — Interactions and music-player functionality
* **Audio API / HTML Audio** — Music playback
* **Netlify** — Deployment

---

## 📂 Project Structure

```text
Bar-Wala/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── sounds/
│
├── music/
│   └── *.mp3
│
├── lyrics/
│   └── *.txt
│
└── README.md
```

> Update the structure above if your repository uses different filenames/folders.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

### 2. Navigate to the project

```bash
cd Bar-Wala
```

### 3. Run locally

Since Bar Wala is a frontend project, you can simply open:

```text
index.html
```

Or use a local development server such as **VS Code Live Server**.

---

## 🎧 Adding Music

To add a new track:

1. Add the audio file to the music directory.
2. Add the track information to the playlist configuration.
3. Add the corresponding lyrics file if available.
4. Update the player configuration.

Example:

```javascript
{
    title: "Song Name",
    artist: "Artist Name",
    album: "Album Name",
    audio: "music/song-name.mp3",
    lyrics: "lyrics/song-name.txt"
}
```

---

## 📝 Lyrics

Lyrics can be maintained separately using `.txt` files.

Example:

```text
lyrics/
├── aadat.txt
├── song-02.txt
└── song-03.txt
```

The player can load the corresponding lyrics when a track is selected.

---

## 🎨 Design Philosophy

Bar Wala intentionally avoids looking like a traditional music-streaming application.

The interface takes inspiration from:

* 🍺 Bars
* 🎧 Late-night music
* 🚕 "Wala" culture
* 🌃 Rooftop nights
* 🍻 Drinking sessions
* 🔊 Loud music
* 🕺 Party environments
* 📻 Old-school radio experiences

The goal is to make the website feel like a **place**, rather than just another music player.

---

## 🔮 Future Ideas

Possible improvements for future versions:

* [ ] 🔥 More playlists
* [ ] 🎤 Real-time lyrics synchronization
* [ ] 🎵 Shuffle & repeat modes
* [ ] 🔊 Volume controls
* [ ] 🎚️ Audio visualizer
* [ ] 🎨 Multiple bar themes
* [ ] 📱 Improved mobile experience
* [ ] 🗂️ Playlist categories
* [ ] 💾 Local playlist persistence
* [ ] 🎤 Karaoke mode
* [ ] 🍻 More interactive bar buttons
* [ ] 🌐 PWA support
* [ ] 🌓 More visual themes

---

## 🌐 Live Demo

Experience Bar Wala here:

**https://barwala.netlify.app/**

---

## 👨‍💻 Project

**Bar Wala — After Dark**

> *Good drinks. Loud stories. One more song.*

Made with 🎵 + 🍻 + ❤️

---

## 📄 License

This project is created for personal/educational/experimental purposes.

Music and other third-party assets remain the property of their respective owners.
