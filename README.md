# ImgForge 🚀

**The fastest, private web-first image toolkit for modern creators.**

ImgForge is an all-in-one, 100% client-side image processing toolkit featuring over 150+ free tools. Everything runs entirely within your browser using open-source libraries—your files never leave your device.

## ✨ Features

- **🔒 100% Privacy-First:** No backend, no APIs, no uploads. Everything is processed directly in your browser using Canvas and Web Workers.
- **🎯 Exact-Size Compression:** Advanced binary-search compression algorithm to hit precise target KB/MB sizes for strict upload limits (e.g., exactly 50KB).
- **🗃️ Local Storage & Session Restore:** Powered by IndexedDB, the app caches your recent files and tools, auto-cleaning old files while restoring your active session perfectly on reload.
- **🛠️ 150+ Powerful Tools:**
  - **Editing:** Freehand crop, rotate, flip, round corners, watermark, text overlays.
  - **Passport & ID:** A4/4x6 print sheets with auto-fill and exact standard sizes.
  - **Converters:** Seamless HEIC, WebP, AVIF, JPG, PNG, and ICO conversion.
  - **Resize & DPI:** Resize by cm, mm, in, or px with DPI conversion.
  - **PDF & GIF:** Client-side Image-to-PDF compilation and GIF processing.
- **📱 PWA & Offline Support:** Installable as an app. Works in Airplane Mode!
- **🎨 Premium Design:** Sleek, modern UI with Tailwind CSS, 60fps Framer Motion animations, dark mode, and an intuitive Command Palette (Ctrl+K).

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Framer Motion
- **Core Processing Engine:**
  - `browser-image-compression` (Optimization)
  - `cropperjs` (Image cropping)
  - `jspdf` & `pdf-lib` (PDF manipulation)
  - `heic2any` (Apple HEIC conversion)
  - `tesseract.js` (Browser OCR)
  - `jszip` & `file-saver` (Batch downloading)
  - `idb` (IndexedDB File Caching)

## 🚀 Deployment (Vercel / Netlify)

This project is completely static and ready for 1-click deployment to Vercel or Netlify!

1. Fork or clone this repository.
2. Link it to Vercel or Netlify.
3. The platform will automatically detect the **Vite** framework.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy! Your app will go live globally for free.

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

## 🤝 Contributing
Contributions, issues and feature requests are welcome! Feel free to check [issues page](#).

## 📝 License
This project is open-source. Made with ❤️ for creators worldwide.
