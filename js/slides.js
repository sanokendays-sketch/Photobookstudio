(function () {
  function buildSlides(state) {
    if (state.creationMode === 'manual' && state.manualSlides?.length) {
      return state.manualSlides.map((manualSlide, index) => buildManualSlide(manualSlide, state, index));
    }

    const info = state.basic;
    const slides = [
      {
        slideId: 'cover',
        kind: 'cover',
        typeLabel: '表紙',
        title: info.title,
        subtitle: info.subtitle,
        message: `${info.recipient || ''}\n${info.creator || ''}`,
        caption: '',
        supplemental: '',
        endingCopy: '',
        emotionalRole: 'Hook',
        layoutType: 'Legacy Layout',
        photos: featuredPhotos(state, 1)
      },
      {
        slideId: 'intro',
        kind: 'intro',
        typeLabel: '導入',
        title: 'これまでの歩みに、心からの感謝を込めて',
        subtitle: info.purpose,
        message: drmOpening(info),
        caption: '',
        supplemental: '',
        endingCopy: '',
        emotionalRole: 'Empathy',
        layoutType: 'Message Layout',
        photos: []
      }
    ];

    state.themes.forEach((theme, index) => {
      const themePhotos = state.photos.filter((photo) => photo.themeId === theme.id && photo.use);
      slides.push({
        slideId: `theme-${theme.id}`,
        kind: 'theme-title',
        typeLabel: 'テーマ',
        themeId: theme.id,
        title: theme.title,
        subtitle: theme.emotionalRole,
        message: theme.message,
        caption: '',
        supplemental: '',
        endingCopy: '',
        emotionalRole: mapThemeRole(theme.emotionalRole),
        layoutType: 'Legacy Layout',
        messageVolume: theme.messageVolume,
        photoScale: theme.photoScale,
        photos: themePhotos.slice(0, 1)
      });

      if (themePhotos.length) {
        const chunks = window.LayoutEngine.splitPhotosForSlides(themePhotos, theme.layoutType || 'Story Layout');
        chunks.forEach((photos, chunkIndex) => {
          slides.push({
            slideId: `photos-${theme.id}-${chunkIndex + 1}`,
            kind: 'photos',
            typeLabel: '写真',
            themeId: theme.id,
            title: theme.title,
            subtitle: chunkIndex > 0 ? `${chunkIndex + 1}` : '',
            message: theme.message,
            caption: photos.map((photo) => photo.caption).filter(Boolean).join(' / '),
            supplemental: '',
            endingCopy: '',
            emotionalRole: mapThemeRole(theme.emotionalRole),
            layoutType: theme.layoutType || 'Story Layout',
            messageVolume: theme.messageVolume,
            photoScale: theme.photoScale,
            photos
          });
        });
      }

      if (theme.message) {
        slides.push({
          slideId: `message-${theme.id}`,
          kind: 'theme-message',
          typeLabel: '感謝',
          themeId: theme.id,
          title: theme.title,
          subtitle: '',
          message: theme.message,
          caption: '',
          supplemental: '',
          endingCopy: '',
          emotionalRole: mapThemeRole(theme.emotionalRole),
          layoutType: 'Message Layout',
          messageVolume: theme.messageVolume,
          photoScale: theme.photoScale,
          photos: themePhotos.slice(0, 2)
        });
      }
      if (index === state.themes.length - 1) {
        slides.push({
          slideId: 'ending',
          kind: 'ending',
          typeLabel: 'エンディング',
          themeId: theme.id,
          title: 'ありがとうございました',
          subtitle: info.subtitle,
          message: info.gratitudeMessage,
          caption: '',
          supplemental: '',
          endingCopy: 'この感謝が、これからの日々にも静かに届き続けますように。',
          emotionalRole: 'Afterglow',
          layoutType: 'Ending Layout',
          messageVolume: theme.messageVolume,
          photoScale: theme.photoScale,
          photos: themePhotos.slice(0, 3)
        });
      }
    });

    slides.push({
      slideId: 'gratitude',
      kind: 'gratitude',
      typeLabel: '感謝',
      title: info.recipient || '感謝を込めて',
      subtitle: info.date || '',
      message: info.gratitudeMessage,
      caption: '',
      supplemental: '',
      endingCopy: '',
      emotionalRole: 'Gratitude',
      layoutType: 'Message Layout',
      photos: featuredPhotos(state, 2)
    });

    return slides.map((slide) => applySlideEdit(slide, state.slideEdits?.[slide.slideId]));
  }

  function buildManualSlide(manualSlide, state, index) {
    const autoText = {
      title: manualSlide.autoText?.title || defaultManualTitle(manualSlide, index),
      subtitle: manualSlide.autoText?.subtitle || '',
      message: manualSlide.autoText?.message || '',
      caption: manualSlide.autoText?.caption || '',
      supplemental: manualSlide.autoText?.supplemental || '',
      endingCopy: manualSlide.autoText?.endingCopy || '',
      emotionalRole: manualSlide.emotionRole || 'Memory'
    };
    const merged = applySlideEdit({
      slideId: manualSlide.slideId,
      kind: manualSlide.slideType || 'photos',
      typeLabel: slideTypeLabel(manualSlide.slideType),
      title: autoText.title,
      subtitle: autoText.subtitle,
      message: autoText.message,
      caption: autoText.caption,
      supplemental: autoText.supplemental,
      endingCopy: autoText.endingCopy,
      emotionalRole: manualSlide.emotionRole || autoText.emotionalRole,
      layoutType: manualSlide.layoutType || layoutTypeForPhotoCount(manualSlide.photoCount),
      photoCount: manualSlide.photoCount || 0,
      frameLayoutId: manualSlide.frameLayoutId || defaultLayoutId(manualSlide.photoCount || 0),
      frames: manualSlide.frames || [],
      photos: photosFromFrames(manualSlide.frames || [], state)
    }, state.slideEdits?.[manualSlide.slideId] || {
      manualText: manualSlide.manualText || {}
    });
    merged.frames = manualSlide.frames || [];
    merged.frameLayoutId = manualSlide.frameLayoutId || defaultLayoutId(manualSlide.photoCount || 0);
    merged.photoCount = manualSlide.photoCount || 0;
    merged.manualText = {
      ...merged.manualText,
      ...(manualSlide.manualText || {})
    };
    return merged;
  }

  function defaultManualTitle(slide, index) {
    if (slide.slideType === 'cover') return 'THE GOLDEN LEGACY';
    if (slide.slideType === 'ending') return 'ありがとうございました';
    return `スライド ${index + 1}`;
  }

  function slideTypeLabel(type) {
    const map = {
      cover: '表紙',
      intro: '導入',
      theme: 'テーマ',
      photo: '写真',
      photos: '写真',
      gratitude: '感謝',
      ending: 'エンディング'
    };
    return map[type] || '写真';
  }

  function layoutTypeForPhotoCount(photoCount) {
    const frameCount = window.LayoutEngine.frameCountForPhotoCount(photoCount);
    if (frameCount === 0) return 'Message Layout';
    if (frameCount === 1) return 'Hero Layout';
    if (frameCount <= 3) return 'Story Layout';
    if (frameCount <= 8) return 'Mosaic Layout';
    return 'Gallery Layout';
  }

  function defaultLayoutId(photoCount) {
    return window.LayoutEngine.defaultFrameLayoutId(photoCount);
  }

  function frameLayoutsForCount(photoCount) {
    return window.LayoutEngine.frameLayoutsForCount(photoCount).map((layout) => [layout.id, layout.label]);
  }

  function photoCountBucket(photoCount) {
    return window.LayoutEngine.photoCountBucket(photoCount);
  }

  function photosFromFrames(frames, state) {
    return frames
      .map((frame) => state.photos.find((photo) => photo.id === frame.photoId))
      .filter(Boolean);
  }

  function applySlideEdit(slide, edit) {
    const autoText = {
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      message: slide.message || '',
      caption: slide.caption || '',
      supplemental: slide.supplemental || '',
      endingCopy: slide.endingCopy || '',
      emotionalRole: slide.emotionalRole || 'Memory'
    };
    const manualText = edit?.manualText || {};
    const merged = {
      ...slide,
      autoText,
      manualText: {
        title: manualText.title || '',
        subtitle: manualText.subtitle || '',
        message: manualText.message || '',
        caption: manualText.caption || '',
        supplemental: manualText.supplemental || '',
        endingCopy: manualText.endingCopy || '',
        emotionalRole: manualText.emotionalRole || '',
        layoutType: manualText.layoutType || ''
      }
    };
    merged.title = pickText(merged.manualText.title, autoText.title);
    merged.subtitle = pickText(merged.manualText.subtitle, autoText.subtitle);
    merged.message = pickText(merged.manualText.message, autoText.message);
    merged.caption = pickText(merged.manualText.caption, autoText.caption);
    merged.supplemental = pickText(merged.manualText.supplemental, autoText.supplemental);
    merged.endingCopy = pickText(merged.manualText.endingCopy, autoText.endingCopy);
    merged.emotionalRole = pickText(merged.manualText.emotionalRole, autoText.emotionalRole);
    merged.layoutType = pickText(merged.manualText.layoutType, slide.layoutType);
    return merged;
  }

  function pickText(manual, auto) {
    return String(manual || '').trim() ? manual : auto;
  }

  function mapThemeRole(role) {
    const map = {
      '導入': 'Hook',
      '共感': 'Empathy',
      '思い出': 'Memory',
      '意味づけ': 'Meaning',
      '感謝': 'Gratitude',
      '未来へのエール': 'Future',
      '余韻': 'Afterglow'
    };
    return map[role] || 'Memory';
  }

  function featuredPhotos(state, count) {
    return state.photos
      .filter((photo) => photo.use)
      .sort((a, b) => Number(b.importance) - Number(a.importance))
      .slice(0, count);
  }

  function drmOpening(info) {
    return [
      'ふと振り返ると、たくさんの場面にその背中がありました。',
      `${info.position || '役職者'}として示してくださった判断と姿勢は、今も現場の中に残っています。`,
      'このアルバムは、その時間を写真と言葉でたどり、感謝をまっすぐお届けするためのものです。'
    ].join('\n');
  }

  function renderSlide(slide, all = false) {
    const article = document.createElement('article');
    const sizeClass = slide.photoScale ? `photo-scale-${layoutClass(slide.photoScale)}` : '';
    const volumeClass = slide.messageVolume ? `message-volume-${layoutClass(slide.messageVolume)}` : '';
    article.className = `slide ${layoutClass(slide.layoutType)} ${slide.kind} ${sizeClass} ${volumeClass}`;
    article.innerHTML = `
      <div class="slide-inner">
        <div class="slide-copy">
          <p class="slide-kicker">${escapeHtml(slide.subtitle || '')}</p>
          <h2>${escapeHtml(slide.title || '')}</h2>
          <p class="slide-message">${escapeHtml(slide.message || '').replace(/\n/g, '<br>')}</p>
          ${slide.supplemental ? `<p class="slide-supplemental">${escapeHtml(slide.supplemental).replace(/\n/g, '<br>')}</p>` : ''}
          ${slide.endingCopy ? `<p class="slide-ending-copy">${escapeHtml(slide.endingCopy).replace(/\n/g, '<br>')}</p>` : ''}
        </div>
        ${slide.frames ? renderFrames(slide, slide.frames || []) : renderPhotos(slide.photos || [], slide.layoutType, slide.caption)}
      </div>
      <div class="slide-footer">${escapeHtml(slide.layoutType || '')}</div>
    `;
    if (all) article.classList.add('print-page');
    return article;
  }

  function renderPhotos(photos, layoutType, slideCaption) {
    if (!photos.length && layoutType === 'Manual Frame Layout') return '';
    if (!photos.length) return '<div class="slide-photo-empty"></div>';
    const items = photos.map((photo, index) => `
      <figure class="slide-photo-item ${photo.role === '主役写真' ? 'is-hero' : ''}">
        ${photo.displaySrc
          ? `<img src="${photo.displaySrc}" alt="${escapeHtml(photo.caption || photo.fileName)}" style="transform: rotate(${Number(photo.rotation) || 0}deg)">`
          : `<div class="slide-photo-missing">${escapeHtml(photo.fileName)}<br>軽量JSONから読み込まれたため、画像データは含まれていません。</div>`}
        ${captionForPhoto(photo, slideCaption, index, photos.length) ? `<figcaption>${escapeHtml(captionForPhoto(photo, slideCaption, index, photos.length))}</figcaption>` : ''}
      </figure>
    `).join('');
    return `<div class="slide-photos ${layoutClass(layoutType)}">${items}</div>`;
  }

  function renderFrames(slide, frames) {
    if (!frames.length) return '';
    const items = frames.map((frame, index) => {
      const photo = (slide.photos || []).find((item) => item.id === frame.photoId);
      const caption = captionForManualFrame(slide.caption, index, photo);
      return `
        <figure class="manual-frame-item" data-frame-id="${escapeHtml(frame.frameId)}">
          ${photo?.displaySrc
            ? `<img src="${photo.displaySrc}" alt="${escapeHtml(caption || photo.fileName)}" class="fit-${frame.fitMode || 'cover'}" style="--frame-x:${Number(frame.x) || 0}px; --frame-y:${Number(frame.y) || 0}px; --frame-scale:${Number(frame.scale) || 1}; --frame-rotation:${Number(frame.rotation) || 0}deg;">`
            : `<div class="slide-photo-missing">写真未設定</div>`}
          ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}
        </figure>
      `;
    }).join('');
    return `<div class="manual-frame-layout ${layoutClass(slide.frameLayoutId)}">${items}</div>`;
  }

  function captionForManualFrame(slideCaption, index, photo) {
    const parts = String(slideCaption || '').split('/').map((item) => item.trim()).filter(Boolean);
    return parts[index] || photo?.caption || '';
  }

  function captionForPhoto(photo, slideCaption, index, total) {
    if (String(slideCaption || '').trim()) {
      if (total === 1) return slideCaption;
      const parts = String(slideCaption).split('/').map((item) => item.trim()).filter(Boolean);
      return parts[index] || photo.caption || '';
    }
    return photo.caption || '';
  }

  function layoutClass(layoutType) {
    return String(layoutType || 'Story Layout').toLowerCase().replace(/\s+/g, '-');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  window.SlideBuilder = {
    buildSlides,
    renderSlide,
    mapThemeRole,
    frameLayoutsForCount,
    photoCountBucket,
    defaultLayoutId,
    slideTypeLabel,
    escapeHtml
  };
})();
