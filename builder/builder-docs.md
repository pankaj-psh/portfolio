# Local Portfolio Studio (`builder/`)

A standalone, 100% isolated local development studio built strictly with **Pure HTML, Vanilla CSS, and JavaScript**.

---

## 🔒 Production Security & Zero Build Leakage
- This `builder/` directory is situated **outside** of `src/`.
- Running `npm run build` will **never** include, compile, or deploy this tooling to your public GitHub Pages site.
- It is dedicated strictly for local experimentation and reference.

---

## 📂 Structure
- **`shared/studio.js`**: Figma-like selection engine, arrow key nudging, dragging, and live CSS generation.
- **`shared/studio.css`**: Floating inspector panel, sliders, dimension badges.
- **`main/index.html` & `main/main.css`**: Full page reference (Hero, About preview, and dividers).
- **`about/index.html` & `about/about.css`**: Dedicated special About page reference.

---

## 🚀 How to Run Locally
Run in your terminal:
```bash
npm run builder
```
Then visit:
- **Main Canvas:** `http://localhost:3000/main/`
- **About Page:** `http://localhost:3000/about/`

### Studio Controls:
1. **Click any element:** Shows Figma blue selection box, dimensions (`W × H`), and coordinates (`Y: ...px`).
2. **Keyboard Arrow Keys:**
   - `↑` / `↓` nudges by **1px**.
   - `Shift + ↑` / `Shift + ↓` nudges by **10px**.
3. **Mouse Drag:** Drag selected elements up or down smoothly.
4. **Double-click:** Edit any text directly on screen (`contenteditable`).
5. **Inspector (Right Side):**
   - Live Y-position and Font-size sliders.
   - Click **"Copy"** on the generated CSS box to paste into your Astro project.
