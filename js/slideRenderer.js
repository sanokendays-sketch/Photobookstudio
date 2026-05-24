(function () {
  const BASE_WIDTH = 1920;
  const BASE_HEIGHT = 1080;
  const TEXT_RULES = {
    title: { maxFontSize: 54, minFontSize: 30, lineHeight: 1.18, minLineHeight: 1.08, recommended: 20 },
    subtitle: { maxFontSize: 26, minFontSize: 16, lineHeight: 1.35, minLineHeight: 1.18, recommended: 20 },
    message: { maxFontSize: 24, minFontSize: 15, lineHeight: 1.62, minLineHeight: 1.35, recommended: 60 },
    caption: { maxFontSize: 18, minFontSize: 12, lineHeight: 1.38, minLineHeight: 1.22, recommended: 25 },
    supplemental: { maxFontSize: 20, minFontSize: 13, lineHeight: 1.45, minLineHeight: 1.25, recommended: 45 },
    endingCopy: { maxFontSize: 22, minFontSize: 14, lineHeight: 1.45, minLineHeight: 1.25, recommended: 40 }
  };

  function renderSlide(slide, options = {}) {
    const article = document.createElement('article');
    const sizeClass = slide.photoScale ? `photo-scale-${layoutClass(slide.photoScale)}` : '';
    const volumeClass = slide.messageVolume ? `message-volume-${layoutClass(slide.messageVolume)}` : '';
    const frameCount = slide.frames?.length || slide.photos?.length || 0;
    const baseDefinition = window.LayoutEngine.frameLayoutDefinition(slide.frameLayoutId || slide.layoutType, frameCount);
    const definition = window.LayoutEngine.adjustDefinitionForText
      ? window.LayoutEngine.adjustDefinitionForText(baseDefinition, slide)
      : baseDefinition;
    const warnings = textWarnings(slide, definition);
    article.className = `slide slide-renderer ${layoutClass(slide.layoutType)} ${layoutClass(slide.frameLayoutId || '')} ${slide.kind || ''} ${sizeClass} ${volumeClass}`;
    article.dataset.baseWidth = BASE_WIDTH;
    article.dataset.baseHeight = BASE_HEIGHT;
    article.dataset.textWarnings = JSON.stringify(warnings);
    if (definition.variant) article.classList.add(`renderer-${definition.variant}`);
    if (options.print) article.classList.add('print-slide');
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
    const lines = fit.lines.map((line) => `<span>${escapeHtml(line || ' ')}</span>`).join('');
    return `<div class="slide-text-area ${className} ${tooLong ? 'is-text-overflow' : ''}" data-text-area="${name}" data-fit-overflow="${fit.overflow ? 'true' : 'false'}" style="${rectStyle(rect)}--fit-font-size:${fit.fontSize}px;--fit-line-height:${fit.lineHeight};--fit-letter-spacing:${fit.letterSpacing}em;">${lines}</div>`;
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
      recommendedLayout: recommendedLayoutForArea(area),
      message: `${areaLabel(area)}が長いため、文字が収まりにくくなっています。文字優先レイアウトへの変更をおすすめします。`
    };
  }

  function textFit(area, value, rect) {
    return fitTextToArea(value, rect, { area });
  }

  function fitTextToArea(text, area, options = {}) {
    const areaName = options.area || 'message';
    const rule = { ...(TEXT_RULES[areaName] || TEXT_RULES.message), ...options };
    const box = {
      width: Math.max(1, (Number(area?.w) || 0) * BASE_WIDTH),
      height: Math.max(1, (Number(area?.h) || 0) * BASE_HEIGHT)
    };
    const letterSpacing = titleLetterSpacing(areaName, text);
    let lastLines = [];
    for (let fontSize = rule.maxFontSize; fontSize >= rule.minFontSize; fontSize -= 1) {
      const progress = (rule.maxFontSize - fontSize) / Math.max(1, rule.maxFontSize - rule.minFontSize);
      const lineHeight = Number((rule.lineHeight - (rule.lineHeight - rule.minLineHeight) * progress).toFixed(3));
      const lines = wrapText(text, box.width - fontSize * 0.8, fontSize, { letterSpacing });
      lastLines = lines;
      const height = lines.length * fontSize * lineHeight + fontSize * 0.3;
      if (height <= box.height) {
        return { fontSize, lines, lineHeight, letterSpacing, overflow: false };
      }
    }
    return {
      fontSize: rule.minFontSize,
      lines: lastLines.length ? lastLines : wrapText(text, box.width - rule.minFontSize * 0.8, rule.minFontSize, { letterSpacing }),
      lineHeight: rule.minLineHeight,
      letterSpacing,
      overflow: true
    };
  }

  function wrapText(text, width, fontSize, options = {}) {
    const maxWidth = Math.max(fontSize * 3, width);
    const paragraphs = String(text || '').replace(/\r\n/g, '\n').split('\n');
    const lines = [];
    paragraphs.forEach((paragraph) => {
      const tokens = tokenize(paragraph);
      let line = '';
      let lineWidth = 0;
      tokens.forEach((token) => {
        const tokenWidth = measureTextWidth(token, fontSize, options.letterSpacing);
        if (line && lineWidth + tokenWidth > maxWidth) {
          lines.push(line.trimEnd());
          line = '';
          lineWidth = 0;
        }
        if (tokenWidth > maxWidth) {
          Array.from(token).forEach((char) => {
            const charWidth = measureTextWidth(char, fontSize, options.letterSpacing);
            if (line && lineWidth + charWidth > maxWidth) {
              lines.push(line.trimEnd());
              line = '';
              lineWidth = 0;
            }
            line += char;
            lineWidth += charWidth;
          });
          return;
        }
        line += token;
        lineWidth += tokenWidth;
      });
      lines.push(line.trimEnd());
    });
    return lines.length ? lines : [''];
  }

  function tokenize(text) {
    const result = [];
    let ascii = '';
    Array.from(String(text || '')).forEach((char) => {
      if (/[\w\d.,!?;:'"()\- ]/.test(char)) {
        ascii += char;
        if (char === ' ') {
          result.push(ascii);
          ascii = '';
        }
      } else {
        if (ascii) result.push(ascii);
        ascii = '';
        result.push(char);
      }
    });
    if (ascii) result.push(ascii);
    return result;
  }

  function measureTextWidth(text, fontSize, letterSpacing = 0) {
    return Array.from(String(text || '')).reduce((sum, char) => {
      const base = /[A-Za-z0-9]/.test(char) ? 0.58 : /\s/.test(char) ? 0.35 : /[.,!?;:'"()\-]/.test(char) ? 0.35 : 1;
      return sum + fontSize * (base + letterSpacing);
    }, 0);
  }

  function titleLetterSpacing(area, text) {
    if (area !== 'title') return 0;
    const length = normalizedLength(text);
    if (length > 34) return 0;
    if (length > 22) return 0.02;
    return 0.08;
  }

  function normalizedLength(value) {
    return String(value || '').replace(/\s+/g, '').length;
  }

  function areaLabel(area) {
    return {
      title: 'タイトル',
      subtitle: 'サブタイトル',
      message: '本文',
      caption: 'キャプション',
      supplemental: '補足メッセージ',
      endingCopy: 'エンディングコピー'
    }[area] || '文字';
  }

  function recommendedLayoutForArea(area) {
    if (area === 'title' || area === 'message' || area === 'supplemental') return 'Message Wide Top';
    if (area === 'caption') return 'Text Focus with Bottom Photo';
    return 'Legacy Message First';
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
    TEXT_RULES,
    renderSlide,
    textWarnings,
    textFit,
    fitTextToArea,
    wrapText,
    escapeHtml,
    layoutClass
  };
})();
