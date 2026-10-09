<div align="center">
  <img src="public/favicon.jpg" alt="ImgForge Logo" width="120" style="border-radius: 20px" />
  <h1>ImgForge 🚀</h1>
  <p><b>The fastest, private web-first image toolkit for modern creators.</b></p>
  <p>
    <a href="https://github.com/kecrwn/ImgForge/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
    <img src="https://img.shields.io/badge/privacy-100%25_client--side-success.svg" alt="Privacy First" />
    <img src="https://img.shields.io/badge/React-18-61DAFB.svg?logo=react" alt="React 18" />
    <img src="https://img.shields.io/badge/Vite-6-646CFF.svg?logo=vite" alt="Vite 6" />
  </p>
</div>

<hr />

**ImgForge** is an all-in-one, blazing-fast image processing toolkit featuring over **150+ free tools**. Everything runs entirely within your browser using open-source libraries—your files never leave your device. Designed for creators, photographers, and developers who need uncompromising speed and absolute privacy.

## ✨ Why ImgForge?

- **🔒 100% Privacy-First:** No backend, no APIs, no uploads. Everything is processed directly in your browser using Canvas and Web Workers.
- **⚡ Lightning Fast:** Powered by Vite, React, and highly-optimized WASM/JS libraries.
- **📱 PWA & Offline Support:** Installable as an app. Works completely offline—even in Airplane Mode!
- **🎨 Premium Design:** Sleek, modern UI with Tailwind CSS, 60fps Framer Motion animations, automatic dark mode, and an intuitive Command Palette (`Ctrl+K`).
- **🗃️ Local Storage Session Restore:** Powered by IndexedDB, the app caches your recent files and tools, auto-cleaning old files while restoring your active session perfectly on reload.

## 🛠️ The 150+ Tool Arsenal

### 🎯 Exact-Size Compression
Our crown jewel. We use an advanced binary-search compression algorithm to intelligently adjust image quality and dimensions to hit your **precise target KB/MB sizes** for strict upload limits (e.g., exactly 50KB).

### 📐 Editing & Transformation
- **Crop:** Freehand, square, circle, and strict aspect ratios.
- **Adjust:** Rotate, flip, add rounded corners, and remove metadata.
- **Overlay:** Apply watermarks, text overlays, and combine images.

### 📸 Passport & ID Generator
Create perfect, standard-compliant passport photos. Generate A4 and 4x6 print sheets with auto-fill logic and exact millimeter dimensioning.

### 🔄 Format Converters
Seamless, client-side conversion for next-gen formats. We support Apple `HEIC`, `WebP`, `AVIF`, `JPG`, `PNG`, and `ICO`.

### 🖨️ PDF & GIF Utilities
Convert stacks of images directly into optimized PDF documents, or process and compress GIF animations without leaving the page.

---

## 🏗️ Tech Stack

ImgForge is built on the shoulders of giants:
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Framer Motion
- **Core Processing Engines:**
  - `browser-image-compression` (Optimization)
  - `cropperjs` (Image cropping)
  - `jspdf` & `pdf-lib` (PDF manipulation)
  - `heic2any` (Apple HEIC conversion)
  - `tesseract.js` (Browser OCR)
  - `jszip` & `file-saver` (Batch downloading)
  - `idb` (IndexedDB File Caching)

---

## 🚀 One-Click Deployment

This project is completely static and ready for instant deployment to Vercel or Netlify! 

1. Link your repository to your Vercel or Netlify dashboard.
2. The platform will automatically detect the **Vite** framework.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Click **Deploy**. Your app will go live globally for free, leveraging global CDN caching!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the [issues page](https://github.com/kecrwn/ImgForge/issues). 

## 📝 License

This project is open-source and available under the [MIT License](LICENSE). Made with ❤️ for creators worldwide.
