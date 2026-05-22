(function () {
  const BASE_WIDTH = 1920;
  const BASE_HEIGHT = 1080;

  function renderSlide(slide, options = {}) {
    const article = document.createElement('article');
    const sizeClass = slide.photoScale ? `photo-scale-${layoutClass(slide.photoScale)}` : '';
    const volumeClass = slide.messageVolume ? `message-volume-${layoutClass(slide.messageVolume)}` : '';
    const frameCount = slide.frames?.length || slide.photos?.length || 0;
    const definition = window.LayoutEngine.frameLayoutDefinition(slide.frameLayoutId || slide.layoutType, frameCount);
    const warnings = textWarnings(slide, definition);
    article.className = `slide slide-renderer ${layoutClass(slide.layoutType)} ${layoutClass(slide.frameLayoutId || '')} ${slide.kind || ''} ${sizeClass} ${volumeClass}`;
    article.dataset.baseWidth = BASE_WIDTH;
    article.dataset.baseHeight = BASE_HEIGHT;
    article.dataset.textWarnings = JSON.stringify(warnings);
    if (definition.variant) article.classList.add(`renderer-${definition.variant}`);
    if (options.print) article.classList.add('print-page');
    if (options.exporting) article.classList.add('export-slide');
    if (options.showGuides) article.classList.add('show-layout-guides');

    article.innerHTML = `
      <div class="slide-background" aria-hidden="true"></div>
      <div class="slide-copy-layer">
        ${textAreaMarkup('subtitle', slide.subtitle, definition.textAreas?.subtitle, 'slide-kicker', warnings)}
        ${textAreaMarkup('title', slide.title, definition.textAreas?.title, 'slide-title', warnings)}
        ${textAreaMarkup('message', slide.message, definition.textAreas?.message, 'slide-message', warnings)}
        ${textAreaMarkup('caption', slide.caption, definition.textAreas?.caption, 'slide-caption', warnings)}
        ${textAreaMarkup('supplemental', slide.supplemental, definition.textAreas?.supplemental, 'slide-supplemental', warnings)}
        ${textAreaMarkup('endingCopy', slide.endingCopy, definition.textAreas?.endingCopy, 'slide-ending-copy', warnings)}
      </div>
      <div class="slide-frame-layer">
        ${slide.frames ? renderManualFrames(slide, definition) : renderAutoFrames(slide, definition)}
      </div>
      ${options.showGuides ? guideMarkup(definition) : ''}
      ${options.showPageNumber ? `<div class="slide-footer">${options.pageNumber || ''}</div>` : `<div class="slide-footer">${escapeHtml(slide.layoutType || '')}</div>`}
    `;
    return article;
  }

  function textAreaMarkup(name, value, rect, className, warnings) {
    if (!rect || !String(value || '').trim()) return '';
    const fit = textFit(name, value, rect);
    const tooLong = warnings.some((warning) => warning.area === name);
    return `<div class="slide-text-area ${className} ${tooLong ? 'is-text-overflow' : ''}" data-text-area="${name}" style="${rectStyle(rect)}--fit-scale:${fit.scale};--fit-lines:${fit.lines};">${escapeHtml(value).replace(/\n/g, '<br>')}</div>`;
  }

  function renderManualFrames(slide, definition) {
    const frames = slide.frames || [];
    return frames.map((frame, index) => {
      const rect = definition.photoFrames[index] || definition.photoFrames[definition.photoFrames.length - 1] || definition.frames[index] || definition.frames[definition.frames.length - 1];
      return frameMarkup(slide, frame, index, rect);
    }).join('');
  }

  function renderAutoFrames(slide, definition) {
    const photos = slide.photos || [];
    if (!photos.length) return '';
    return photos.map((photo, index) => {
      const rect = definition.photoFrames[index] || definition.photoFrames[definition.photoFrames.length - 1] || definition.frames[index] || definition.frames[definition.frames.length - 1];
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
    const placeholder = frame.placeholderText || slide.placeholderText || '写真を入れてください';
    const fitMode = frame.fitMode || 'cover';
    return `
      <figure class="slide-frame ${fitMode === 'contain' ? 'fit-contain' : 'fit-cover'}" data-frame-id="${escapeHtml(frame.frameId || '')}" style="${rectStyle(rect)}">
        <div class="slide-frame-photo">
          ${photo?.displaySrc
            ? `<img src="${photo.displaySrc}" alt="${escapeHtml(captionForFrame(slide.caption, index, photo) || photo.fileName)}" style="--frame-x:${Number(frame.x) || 0}px; --frame-y:${Number(frame.y) || 0}px; --frame-scale:${Number(frame.scale) || 1}; --frame-rotation:${Number(frame.rotation) || 0}deg;">`
            : `<div class="slide-photo-missing">${escapeHtml(placeholder)}</div>`}
        </div>
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

  function guideMarkup(definition) {
    const textGuides = Object.entries(definition.textAreas || {}).map(([name, rect]) => (
      `<div class="layout-guide-box layout-guide-text" style="${rectStyle(rect)}"><span>${guideLabel(name)}</span></div>`
    )).join('');
    const frameGuides = (definition.photoFrames || []).map((rect, index) => (
      `<div class="layout-guide-box layout-guide-photo" style="${rectStyle(rect)}"><span>写真${index + 1}</span></div>`
    )).join('');
    return `<div class="layout-guide-layer" aria-hidden="true">${textGuides}${frameGuides}</div>`;
  }

  function guideLabel(name) {
    const labels = {
      title: 'タイトル',
      subtitle: 'サブタイトル',
      message: 'メッセージ',
      caption: 'キャプション',
      supplemental: '補足',
      endingCopy: 'エンディング'
    };
    return labels[name] || name;
  }

  function textWarnings(slide, definition) {
    return [
      warningForArea('title', slide.title, definition.textAreas?.title),
      warningForArea('subtitle', slide.subtitle, definition.textAreas?.subtitle),
      warningForArea('message', slide.message, definition.textAreas?.message),
      warningForArea('caption', slide.caption, definition.textAreas?.caption),
      warningForArea('supplemental', slide.supplemental, definition.textAreas?.supplemental),
      warningForArea('endingCopy', slide.endingCopy, definition.textAreas?.endingCopy)
    ].filter(Boolean);
  }

  function warningForArea(area, value, rect) {
    if (!rect || !String(value || '').trim()) return null;
    const fit = textFit(area, value, rect);
    if (!fit.overflow) return null;
    return {
      area,
      message: 'このメッセージは長すぎるため、レイアウト内に収まりません。文字数を減らすか、文字エリアの大きいレイアウトを選んでください。'
    };
  }

  function textFit(area, value, rect) {
    const text = String(value || '').replace(/\s+/g, '');
    const manualLines = String(value || '').split('\n').length;
    const areaScore = Math.max(0.01, (Number(rect.w) || 0) * (Number(rect.h) || 0));
    const weight = area === 'title' ? 1000 : area === 'message' ? 1550 : 1750;
    const capacity = Math.max(8, Math.floor(areaScore * weight));
    const lineCapacity = Math.max(6, Math.floor((Number(rect.w) || 0.5) * (area === 'title' ? 26 : 34)));
    const estimatedLines = Math.max(manualLines, Math.ceil(text.length / lineCapacity));
    const maxLines = area === 'title' ? 3 : area === 'caption' ? 2 : 4;
    const overRatio = capacity / Math.max(1, text.length);
    return {
      lines: Math.min(maxLines, Math.max(1, estimatedLines)),
      scale: Math.max(0.72, Math.min(1, overRatio)),
      overflow: text.length > capacity * 1.18 || estimatedLines > maxLines + 1
    };
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
    textWarnings,
    escapeHtml,
    layoutClass
  };
})();
