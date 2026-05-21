(function () {
  const BASE_WIDTH = 1920;
  const BASE_HEIGHT = 1080;

  function renderSlide(slide, options = {}) {
    const article = document.createElement('article');
    const sizeClass = slide.photoScale ? `photo-scale-${layoutClass(slide.photoScale)}` : '';
    const volumeClass = slide.messageVolume ? `message-volume-${layoutClass(slide.messageVolume)}` : '';
    const frameCount = slide.frames?.length || slide.photos?.length || 0;
    const definition = window.LayoutEngine.frameLayoutDefinition(slide.frameLayoutId || slide.layoutType, frameCount);
    article.className = `slide slide-renderer ${layoutClass(slide.layoutType)} ${layoutClass(slide.frameLayoutId || '')} ${slide.kind || ''} ${sizeClass} ${volumeClass}`;
    article.dataset.baseWidth = BASE_WIDTH;
    article.dataset.baseHeight = BASE_HEIGHT;
    if (definition.variant) article.classList.add(`renderer-${definition.variant}`);
    if (options.print) article.classList.add('print-page');
    if (options.exporting) article.classList.add('export-slide');

    article.innerHTML = `
      <div class="slide-background" aria-hidden="true"></div>
      <div class="slide-copy-layer">
        ${textAreaMarkup('subtitle', slide.subtitle, definition.textAreas?.subtitle, 'slide-kicker')}
        ${textAreaMarkup('title', slide.title, definition.textAreas?.title, 'slide-title')}
        ${textAreaMarkup('message', slide.message, definition.textAreas?.message, 'slide-message')}
        ${textAreaMarkup('supplemental', slide.supplemental, definition.textAreas?.supplemental, 'slide-supplemental')}
        ${textAreaMarkup('endingCopy', slide.endingCopy, definition.textAreas?.endingCopy, 'slide-ending-copy')}
      </div>
      <div class="slide-frame-layer">
        ${slide.frames ? renderManualFrames(slide, definition) : renderAutoFrames(slide, definition)}
      </div>
      ${options.showPageNumber ? `<div class="slide-footer">${options.pageNumber || ''}</div>` : `<div class="slide-footer">${escapeHtml(slide.layoutType || '')}</div>`}
    `;
    return article;
  }

  function textAreaMarkup(name, value, rect, className) {
    if (!rect || !String(value || '').trim()) return '';
    return `<div class="slide-text-area ${className}" data-text-area="${name}" style="${rectStyle(rect)}">${escapeHtml(value).replace(/\n/g, '<br>')}</div>`;
  }

  function renderManualFrames(slide, definition) {
    const frames = slide.frames || [];
    return frames.map((frame, index) => {
      const rect = definition.frames[index] || definition.frames[definition.frames.length - 1];
      return frameMarkup(slide, frame, index, rect);
    }).join('');
  }

  function renderAutoFrames(slide, definition) {
    const photos = slide.photos || [];
    if (!photos.length) return '';
    return photos.map((photo, index) => {
      const rect = definition.frames[index] || definition.frames[definition.frames.length - 1];
      const frame = {
        frameId: `${slide.slideId || 'slide'}-auto-${index + 1}`,
        photoId: photo.id,
        fitMode: 'cover',
        x: 0,
        y: 0,
        scale: 1,
        rotation: Number(photo.rotation) || 0
      };
      return frameMarkup({ ...slide, photos }, frame, index, rect);
    }).join('');
  }

  function frameMarkup(slide, frame, index, rect) {
    const photo = (slide.photos || []).find((item) => item.id === frame.photoId);
    const caption = captionForFrame(slide.caption, index, photo);
    const placeholder = frame.placeholderText || slide.placeholderText || '写真を入れてください';
    const fitMode = frame.fitMode || 'cover';
    return `
      <figure class="slide-frame ${fitMode === 'contain' ? 'fit-contain' : 'fit-cover'}" data-frame-id="${escapeHtml(frame.frameId || '')}" style="${rectStyle(rect)}">
        <div class="slide-frame-photo">
          ${photo?.displaySrc
            ? `<img src="${photo.displaySrc}" alt="${escapeHtml(caption || photo.fileName)}" style="--frame-x:${Number(frame.x) || 0}px; --frame-y:${Number(frame.y) || 0}px; --frame-scale:${Number(frame.scale) || 1}; --frame-rotation:${Number(frame.rotation) || 0}deg;">`
            : `<div class="slide-photo-missing">${escapeHtml(placeholder)}</div>`}
        </div>
        ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}
      </figure>
    `;
  }

  function captionForFrame(slideCaption, index, photo) {
    const parts = String(slideCaption || '').split('/').map((item) => item.trim()).filter(Boolean);
    return parts[index] || photo?.caption || '';
  }

  function rectStyle(rect = {}) {
    return `left:${percent(rect.x)};top:${percent(rect.y)};width:${percent(rect.w)};height:${percent(rect.h)};`;
  }

  function percent(value) {
    return `${(Number(value) || 0) * 100}%`;
  }

  function layoutClass(layoutType) {
    return String(layoutType || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff-]/g, '');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  window.SlideRenderer = {
    BASE_WIDTH,
    BASE_HEIGHT,
    renderSlide,
    escapeHtml,
    layoutClass
  };
})();
