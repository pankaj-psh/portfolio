/**
 * Studio Engine (builder/shared/studio.js)
 * Features:
 * 1. Topbar removed completely (clean viewport)
 * 2. Draggable Controller Panel (drag by its header anywhere on screen)
 * 3. 1-Click Sync from Live Astro Site (fetch from http://localhost:4321/portfolio/)
 * 4. Click & Select with blue border and dimension badge
 * 5. Drag/Nudge elements with Arrow keys (1px / 10px with Shift)
 * 6. Sliders for Top (Y), Left (X), Font Size, Line Height
 * 7. 1-Click Copy CSS
 */

class PortfolioStudio {
  constructor() {
    this.selectedElement = null;
    this.badge = null;
    this.inspector = null;
    this.isDraggingElement = false;
    this.dragStartY = 0;
    this.dragStartX = 0;
    this.elementStartY = 0;
    this.elementStartX = 0;

    this.init();
  }

  init() {
    this.createBadge();
    this.createDraggableInspector();
    this.createToast();
    this.bindGlobalEvents();
  }

  createBadge() {
    this.badge = document.createElement('div');
    this.badge.className = 'studio-badge';
    this.badge.style.display = 'none';
    document.body.appendChild(this.badge);
  }

  createToast() {
    this.toast = document.createElement('div');
    this.toast.className = 'studio-toast';
    this.toast.textContent = 'Notification';
    document.body.appendChild(this.toast);
  }

  showToast(message) {
    this.toast.textContent = message;
    this.toast.classList.add('show');
    setTimeout(() => this.toast.classList.remove('show'), 2400);
  }

  createDraggableInspector() {
    this.inspector = document.createElement('aside');
    this.inspector.className = 'studio-inspector';
    this.inspector.innerHTML = `
      <div class="studio-inspector-header" id="inspector-drag-handle" title="Drag to move panel anywhere">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="cursor:grab; font-size:14px;">⠿</span>
          <span id="inspector-title" style="font-weight:700;">UI STUDIO</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <button id="btn-sync-astro" class="studio-sync-btn" title="Sync live content & styles from http://localhost:4321/portfolio/">
            ⟳ Sync Astro
          </button>
        </div>
      </div>
      <div class="studio-inspector-body">
        <div id="inspector-empty" style="color:var(--studio-muted); text-align:center; padding: 18px 0; font-size:11px;">
          Click any element to inspect, nudge or drag
        </div>
        <div id="inspector-content" style="display:none; flex-direction:column; gap:12px;">
          <div class="studio-prop-row">
            <span class="studio-prop-label">Top (Y)</span>
            <div class="studio-prop-input-wrap">
              <input type="number" id="prop-top" class="studio-prop-input" />
              <span style="color:var(--studio-muted); font-size:11px;">px</span>
            </div>
          </div>
          <input type="range" id="slider-top" class="studio-slider" min="0" max="3000" />

          <div class="studio-prop-row">
            <span class="studio-prop-label">Left (X)</span>
            <div class="studio-prop-input-wrap">
              <input type="number" id="prop-left" class="studio-prop-input" />
              <span style="color:var(--studio-muted); font-size:11px;">px</span>
            </div>
          </div>
          <input type="range" id="slider-left" class="studio-slider" min="0" max="1440" />

          <div class="studio-prop-row">
            <span class="studio-prop-label">Font Size</span>
            <div class="studio-prop-input-wrap">
              <input type="number" id="prop-font-size" class="studio-prop-input" />
              <span style="color:var(--studio-muted); font-size:11px;">px</span>
            </div>
          </div>
          <input type="range" id="slider-font-size" class="studio-slider" min="10" max="110" />

          <div class="studio-prop-row">
            <span class="studio-prop-label">Line Height</span>
            <div class="studio-prop-input-wrap">
              <input type="number" step="0.05" id="prop-line-height" class="studio-prop-input" />
            </div>
          </div>

          <div style="border-top:1px solid var(--studio-border); padding-top:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span class="studio-prop-label" style="font-weight:600; color:var(--studio-text);">Generated CSS</span>
              <button id="btn-copy-css" class="studio-btn-primary" style="padding:2px 8px; font-size:11px;">Copy</button>
            </div>
            <pre id="studio-css-box" class="studio-code-preview"></pre>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(this.inspector);

    // Make Inspector Panel Draggable Anywhere
    this.makePanelDraggable(this.inspector, this.inspector.querySelector('#inspector-drag-handle'));

    // Bind Controls
    const topInput = this.inspector.querySelector('#prop-top');
    const topSlider = this.inspector.querySelector('#slider-top');
    const leftInput = this.inspector.querySelector('#prop-left');
    const leftSlider = this.inspector.querySelector('#slider-left');
    const fsInput = this.inspector.querySelector('#prop-font-size');
    const fsSlider = this.inspector.querySelector('#slider-font-size');
    const lhInput = this.inspector.querySelector('#prop-line-height');
    const copyBtn = this.inspector.querySelector('#btn-copy-css');
    const syncBtn = this.inspector.querySelector('#btn-sync-astro');

    topInput.addEventListener('input', (e) => this.updateProperty('top', `${e.target.value}px`));
    topSlider.addEventListener('input', (e) => {
      topInput.value = e.target.value;
      this.updateProperty('top', `${e.target.value}px`);
    });

    leftInput.addEventListener('input', (e) => this.updateProperty('left', `${e.target.value}px`));
    leftSlider.addEventListener('input', (e) => {
      leftInput.value = e.target.value;
      this.updateProperty('left', `${e.target.value}px`);
    });

    fsInput.addEventListener('input', (e) => this.updateProperty('fontSize', `${e.target.value}px`));
    fsSlider.addEventListener('input', (e) => {
      fsInput.value = e.target.value;
      this.updateProperty('fontSize', `${e.target.value}px`);
    });

    lhInput.addEventListener('input', (e) => this.updateProperty('lineHeight', e.target.value));

    copyBtn.addEventListener('click', () => {
      const code = this.inspector.querySelector('#studio-css-box').textContent;
      navigator.clipboard.writeText(code).then(() => {
        this.showToast('CSS copied to clipboard!');
      });
    });

    syncBtn.addEventListener('click', () => this.syncFromAstro());
  }

  makePanelDraggable(panel, handle) {
    let isDraggingPanel = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    handle.addEventListener('mousedown', (e) => {
      if (e.target.closest('#btn-sync-astro')) return;
      isDraggingPanel = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = panel.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      panel.style.right = 'auto'; // release right lock
      panel.style.left = `${startLeft}px`;
      panel.style.top = `${startTop}px`;
      handle.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDraggingPanel) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      panel.style.left = `${Math.max(10, Math.min(window.innerWidth - 320, startLeft + dx))}px`;
      panel.style.top = `${Math.max(10, Math.min(window.innerHeight - 100, startTop + dy))}px`;
    });

    document.addEventListener('mouseup', () => {
      if (isDraggingPanel) {
        isDraggingPanel = false;
        handle.style.cursor = 'grab';
      }
    });
  }

  async syncFromAstro() {
    this.showToast('Syncing from Astro (http://localhost:4321/portfolio/)...');
    try {
      const res = await fetch('http://localhost:4321/portfolio/');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const htmlText = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      // Sync Bio
      const srcBio = doc.querySelector('.hero-bio');
      const targetBio = document.querySelector('.hero-bio');
      if (srcBio && targetBio) targetBio.textContent = srcBio.textContent;

      // Sync Headline
      const srcHeadline = doc.querySelector('.hero-headline');
      const targetHeadline = document.querySelector('.hero-headline');
      if (srcHeadline && targetHeadline) targetHeadline.innerHTML = srcHeadline.innerHTML;

      // Sync About Heading
      const srcAboutHeading = doc.querySelector('.about-heading');
      const targetAboutHeading = document.querySelector('.about-heading');
      if (srcAboutHeading && targetAboutHeading) targetAboutHeading.textContent = srcAboutHeading.textContent;

      // Sync About Paragraphs
      const srcAboutSection = doc.querySelector('.about-section');
      const targetAboutSection = document.querySelector('.about-section');
      if (srcAboutSection && targetAboutSection) {
        const pTags = srcAboutSection.querySelectorAll('.about-text');
        targetAboutSection.innerHTML = '';
        pTags.forEach(p => {
          const clone = p.cloneNode(true);
          clone.className = 'about-text studio-selectable';
          clone.dataset.selector = 'about-text';
          targetAboutSection.appendChild(clone);
        });
      }

      this.showToast('✓ Successfully synced with Astro!');
      if (this.selectedElement) this.updateBadgePosition();
    } catch (err) {
      console.error('Astro sync error:', err);
      this.showToast('Could not reach Astro dev server on port 4321.');
    }
  }

  bindGlobalEvents() {
    // Select elements
    document.addEventListener('click', (e) => {
      if (e.target.closest('.studio-inspector')) return;
      const target = e.target.closest('.studio-selectable');
      if (target) {
        this.select(target);
      } else {
        this.deselect();
      }
    });

    // Double-click to edit text directly
    document.addEventListener('dblclick', (e) => {
      const target = e.target.closest('.studio-selectable');
      if (target && !target.hasAttribute('contenteditable')) {
        target.contentEditable = 'true';
        target.focus();
        this.showToast('Editing text: Type directly');
        const blurHandler = () => {
          target.removeAttribute('contenteditable');
          this.updateBadgePosition();
          target.removeEventListener('blur', blurHandler);
        };
        target.addEventListener('blur', blurHandler);
      }
    });

    // Keyboard Arrow Nudging
    window.addEventListener('keydown', (e) => {
      if (!this.selectedElement || this.selectedElement.isContentEditable) return;

      const step = e.shiftKey ? 10 : 1;
      let handled = false;

      if (e.key === 'ArrowUp') {
        const cur = parseFloat(window.getComputedStyle(this.selectedElement).top) || 0;
        this.updateProperty('top', `${cur - step}px`);
        handled = true;
      } else if (e.key === 'ArrowDown') {
        const cur = parseFloat(window.getComputedStyle(this.selectedElement).top) || 0;
        this.updateProperty('top', `${cur + step}px`);
        handled = true;
      } else if (e.key === 'ArrowLeft') {
        const cur = parseFloat(window.getComputedStyle(this.selectedElement).left) || 0;
        this.updateProperty('left', `${cur - step}px`);
        handled = true;
      } else if (e.key === 'ArrowRight') {
        const cur = parseFloat(window.getComputedStyle(this.selectedElement).left) || 0;
        this.updateProperty('left', `${cur + step}px`);
        handled = true;
      } else if (e.key === 'Escape') {
        this.deselect();
        handled = true;
      }

      if (handled) {
        e.preventDefault();
      }
    });

    // Mouse Dragging for Canvas Elements
    document.addEventListener('mousedown', (e) => {
      if (e.target === this.selectedElement && !this.selectedElement.isContentEditable) {
        this.isDraggingElement = true;
        this.dragStartY = e.clientY;
        this.dragStartX = e.clientX;
        this.elementStartY = parseFloat(window.getComputedStyle(this.selectedElement).top) || 0;
        this.elementStartX = parseFloat(window.getComputedStyle(this.selectedElement).left) || 0;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (this.isDraggingElement && this.selectedElement) {
        const deltaY = e.clientY - this.dragStartY;
        const newTop = Math.round(this.elementStartY + deltaY);
        this.updateProperty('top', `${newTop}px`);

        if (window.getComputedStyle(this.selectedElement).position === 'absolute') {
          const deltaX = e.clientX - this.dragStartX;
          const newLeft = Math.round(this.elementStartX + deltaX);
          this.updateProperty('left', `${newLeft}px`);
        }
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.isDraggingElement) {
        this.isDraggingElement = false;
      }
    });

    window.addEventListener('resize', () => {
      if (this.selectedElement) {
        this.updateBadgePosition();
      }
    });
  }

  select(element) {
    if (this.selectedElement) {
      this.selectedElement.classList.remove('studio-selected');
    }
    this.selectedElement = element;
    this.selectedElement.classList.add('studio-selected');

    this.badge.style.display = 'block';
    this.updateBadgePosition();

    // Populate Inspector
    this.inspector.querySelector('#inspector-empty').style.display = 'none';
    const content = this.inspector.querySelector('#inspector-content');
    content.style.display = 'flex';

    const cs = window.getComputedStyle(element);
    const top = Math.round(parseFloat(cs.top) || 0);
    const left = Math.round(parseFloat(cs.left) || 0);
    const fontSize = Math.round(parseFloat(cs.fontSize) || 0);
    const lineHeight = parseFloat(cs.lineHeight) ? (parseFloat(cs.lineHeight) / fontSize).toFixed(2) : 1.35;

    this.inspector.querySelector('#prop-top').value = top;
    this.inspector.querySelector('#slider-top').value = top;
    this.inspector.querySelector('#prop-left').value = left;
    this.inspector.querySelector('#slider-left').value = left;
    this.inspector.querySelector('#prop-font-size').value = fontSize;
    this.inspector.querySelector('#slider-font-size').value = fontSize;
    this.inspector.querySelector('#prop-line-height').value = lineHeight;

    this.refreshCodeBox();
  }

  deselect() {
    if (this.selectedElement) {
      this.selectedElement.classList.remove('studio-selected');
      this.selectedElement = null;
    }
    this.badge.style.display = 'none';
    this.inspector.querySelector('#inspector-empty').style.display = 'block';
    this.inspector.querySelector('#inspector-content').style.display = 'none';
  }

  updateProperty(prop, value) {
    if (!this.selectedElement) return;

    this.selectedElement.style[prop] = value;
    this.updateBadgePosition();

    // Update inspector input fields
    const cs = window.getComputedStyle(this.selectedElement);
    if (prop === 'top') {
      const topVal = Math.round(parseFloat(cs.top) || 0);
      this.inspector.querySelector('#prop-top').value = topVal;
      this.inspector.querySelector('#slider-top').value = topVal;
    } else if (prop === 'left') {
      const leftVal = Math.round(parseFloat(cs.left) || 0);
      this.inspector.querySelector('#prop-left').value = leftVal;
      this.inspector.querySelector('#slider-left').value = leftVal;
    } else if (prop === 'fontSize') {
      const fsVal = Math.round(parseFloat(cs.fontSize) || 0);
      this.inspector.querySelector('#prop-font-size').value = fsVal;
      this.inspector.querySelector('#slider-font-size').value = fsVal;
    }

    this.refreshCodeBox();
  }

  updateBadgePosition() {
    if (!this.selectedElement) return;
    const rect = this.selectedElement.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    const cs = window.getComputedStyle(this.selectedElement);
    const top = Math.round(parseFloat(cs.top) || 0);
    const left = Math.round(parseFloat(cs.left) || 0);

    this.badge.textContent = `Y: ${top}px, X: ${left}px | ${w} × ${h}px`;
    this.badge.style.top = `${window.scrollY + rect.top - 24}px`;
    this.badge.style.left = `${window.scrollX + rect.left}px`;
  }

  refreshCodeBox() {
    if (!this.selectedElement) return;
    const cs = window.getComputedStyle(this.selectedElement);
    const top = Math.round(parseFloat(cs.top) || 0);
    const left = Math.round(parseFloat(cs.left) || 0);
    const fontSize = Math.round(parseFloat(cs.fontSize) || 0);
    const lineHeight = parseFloat(cs.lineHeight) ? (parseFloat(cs.lineHeight) / fontSize).toFixed(2) : 1.35;

    const selector = this.selectedElement.dataset.selector || this.selectedElement.className.split(' ')[0] || 'element';

    const cssCode = `.${selector} {
  top: ${top}px;
  left: ${left}px;
  font-size: ${fontSize}px;
  line-height: ${lineHeight};
}`;
    this.inspector.querySelector('#studio-css-box').textContent = cssCode;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.studio = new PortfolioStudio();
});
