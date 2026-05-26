(function () {
  const defaultThemes = [
    ['これまでの歩み', '導入', 'ここから、これまで積み重ねてくださった時間を振り返ります。'],
    ['現場での姿', '共感', 'いつも現場に目を向け、私たちに大切な基準を示してくださいました。'],
    ['ご指導いただいた時間', '意味づけ', 'いただいた言葉や姿勢は、これからの仕事の中にも残っていきます。'],
    ['何気ない日常', '思い出', '特別な場面だけでなく、日々の中にも忘れられない時間がありました。'],
    ['みんなとの時間', '思い出', '一緒に過ごした時間が、チームの記憶として残っています。'],
    ['残してくださったもの', '意味づけ', '判断、姿勢、言葉。その一つひとつが、現場の財産です。'],
    ['感謝', '感謝', 'これまでのご尽力とご指導に、心より感謝申し上げます。'],
    ['新天地へのエール', '未来へのエール', '新天地でのさらなるご活躍を、私たち一同心よりお祈りしています。'],
    ['余韻', '余韻', 'この感謝が、これからの日々にも静かに届き続けますように。']
  ];

  const checklist = [
    '写真の順番は自然か',
    '名前と役職に誤りはないか',
    '日付は正しいか',
    'キャプションに誤字脱字はないか',
    '軽すぎる表現がないか',
    '内輪ネタが強すぎないか',
    '最後の感謝メッセージは失礼がないか',
    '写真に問題のある情報が写っていないか',
    'フルスクリーンで再生できるか',
    'PDF保存したか',
    '本番用PCで動作確認したか',
    '予備ファイルをUSB等に保存したか'
  ];

  const PDF_MODES = {
    '169': {
      className: 'print-mode-169',
      label: '16:9ブラウザ印刷PDF',
      description: 'ブラウザ印刷で16:9ページを指定します。余白なしを優先する場合は、左の「16:9画像PDFとして保存」を使ってください。'
    },
    'a4-center': {
      className: 'print-mode-a4-center',
      label: 'A4横・中央配置',
      description: '紙印刷向け。16:9スライドをA4横ページの中央に置き、上下の余白が偏らないようにします。'
    },
    'a4-fill': {
      className: 'print-mode-a4-fill',
      label: 'A4横・余白少なめ',
      description: '余白なし優先・一部トリミングあり。A4横ページいっぱいに黒背景を敷き、スライドを拡大します。'
    }
  };

  const starterPackages = {
    goldenLegacy10: {
      name: 'Golden Legacy 10枚パッケージ',
      description: '感謝と敬意を上品に伝える、黒とゴールド基調の送別アルバム構成',
      slides: [
        starterSlide('cover', 'Hook', '1', 'one-golden-frame', 'Legacy Layout', 'THE GOLDEN LEGACY', 'これまでの感謝を込めて', 'あなたが残してくださったものは、これからも私たちの中に残り続けます。', '主役写真を入れてください'),
        starterSlide('intro', 'Empathy', '0', 'text-center', 'Message Layout', '何気ない日々の中に', '', '振り返ると、当たり前のように過ぎていた時間の中に、たくさんのご指導とあたたかさがありました。', '導入に合う静かな写真を入れてください'),
        starterSlide('photo', 'Memory', '3', 'three-story', 'Story Layout', '共に歩んだ時間', '', '一つひとつの場面に、これまで積み重ねてきた時間が残っています。', ['歩みが伝わる写真を入れてください', '流れをつなぐ写真を入れてください', '次の場面へつながる写真を入れてください']),
        starterSlide('photo', 'Memory', '2', 'two-main-sub', 'Split Layout', '現場に残る背中', '', '言葉だけではなく、その姿から教えていただいたことがありました。', ['現場での写真を入れてください', '人柄が伝わる写真を入れてください']),
        starterSlide('photoMessage', 'Meaning', '3', 'three-main-left-two-right', 'Split Layout', 'その一言が、支えになりました', '', '迷った時、立ち止まりそうな時、いただいた言葉が前に進む力になりました。', ['ご指導の場面を入れてください', '話している写真を入れてください', '意味づけを添える写真を入れてください']),
        starterSlide('photo', 'Memory', '5-8', 'multi-mosaic', 'Mosaic Layout', '共に過ごした、たくさんの場面', '', '笑顔も、何気ない会話も、今では大切な記憶の一部です。', 'みんなとの写真を入れてください'),
        starterSlide('themeMessage', 'Meaning', '1', 'one-left-message', 'Legacy Layout', '残してくださったもの', '', '写真に写っているのは、場面だけではありません。そこには、私たちが受け取った姿勢や想いがあります。', '余韻に合う写真を入れてください'),
        starterSlide('gratitude', 'Gratitude', '0', 'text-center', 'Message Layout', '心より、感謝申し上げます', '', 'たくさんのご指導と、あたたかいお心遣いを本当にありがとうございました。', '感謝が伝わる写真を入れてください'),
        starterSlide('cheer', 'Future', '1', 'one-background-words', 'Ending Layout', '新しい場所でのご活躍を', '', 'いただいたものを大切にしながら、私たちもまた前に進んでまいります。これからの日々が、実り多いものとなりますようお祈りしております。', '送り出しに合う写真を入れてください'),
        starterSlide('ending', 'Afterglow', '1', 'one-golden-frame', 'Ending Layout', 'ありがとうございました', '', 'この時間とご縁に、心を込めて。', '集合写真を入れてください')
      ]
    }
  };

  const state = {
    id: 'current',
    basic: {
      title: 'THE GOLDEN LEGACY',
      subtitle: 'これまでの感謝を込めて',
      recipient: '〇〇本部長へ',
      position: '本部長',
      date: new Date().toISOString().slice(0, 10),
      creator: '一同',
      purpose: 'これまでのご指導と現場に残してくださったものへの感謝を、写真と言葉で丁寧にお伝えする。',
      tone: '上品',
      template: 'Golden Legacy',
      gratitudeMessage: 'これまで私たちを導いてくださり、本当にありがとうございました。新天地でのさらなるご活躍を、心よりお祈りしています。',
      avoidExpressions: ''
    },
    themes: defaultThemes.map(([title, emotionalRole, message]) => createTheme(title, emotionalRole, message)),
    photos: [],
    creationMode: 'manual',
    manualSlides: [],
    slideEdits: {},
    aiReturnText: '',
    currentThemeId: null,
    currentSlideEditId: null,
    currentSlideIndex: 0,
    slides: [],
    showLayoutGuides: false,
    pdfMode: '169',
    exportQuality: 'standard',
    playing: null
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    bindNavigation();
    bindBasicForm();
    bindPhotoImport();
    bindThemeActions();
    bindAi();
    bindSlideEdit();
    bindPreview();
    bindProjectActions();
    renderAll();
  }

  function createTheme(title = '新しいテーマ', emotionalRole = '思い出', message = '') {
    return {
      id: crypto.randomUUID(),
      title,
      emotionalRole,
      message,
      layoutType: 'Story Layout',
      messageVolume: '標準',
      photoScale: '標準'
    };
  }

  function starterSlide(slideType, emotionRole, photoCount, frameLayoutId, layoutType, title, subtitle, message, placeholderText) {
    return {
      slideType,
      emotionRole,
      photoCount,
      frameLayoutId,
      layoutType,
      placeholderText,
      autoText: {
        title,
        subtitle,
        message,
        caption: '',
        supplemental: '',
        endingCopy: ''
      },
      manualText: {
        title: '',
        subtitle: '',
        message: '',
        caption: '',
        supplemental: '',
        endingCopy: '',
        emotionalRole: '',
        layoutType: ''
      }
    };
  }

  function bindNavigation() {
    $$('.step-link').forEach((button) => {
      button.addEventListener('click', () => showView(button.dataset.view));
    });
    $('#newAlbumBtn').addEventListener('click', () => {
      $('#startMethodPanel').hidden = false;
      $('#startMethodPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('#goldenLegacyStarterBtn').addEventListener('click', () => startFromPackage('goldenLegacy10'));
    $('#blankAlbumBtn').addEventListener('click', startBlankAlbum);
    $('#autoThemeAlbumBtn').addEventListener('click', startAutoThemeAlbum);
  }

  function startFromPackage(packageId) {
    const starterPackage = starterPackages[packageId];
    if (!starterPackage) return;
    state.creationMode = 'manual';
    state.manualSlides = starterPackage.slides.map((slide, index) => createManualSlide({
      ...slide,
      slideId: `starter-${packageId}-${index + 1}-${crypto.randomUUID()}`
    }));
    state.currentSlideEditId = state.manualSlides[0]?.slideId || null;
    state.currentSlideIndex = 0;
    state.slideEdits = {};
    renderAll();
    showView('slideEdit');
  }

  function startBlankAlbum() {
    state.creationMode = 'manual';
    state.manualSlides = [createManualSlide()];
    state.currentSlideEditId = state.manualSlides[0].slideId;
    state.currentSlideIndex = 0;
    state.slideEdits = {};
    renderAll();
    showView('slideEdit');
  }

  function startAutoThemeAlbum() {
    state.creationMode = 'auto';
    state.currentSlideEditId = null;
    renderAll();
    showView('photos');
  }

  function showView(viewId) {
    $$('.view').forEach((view) => view.classList.toggle('active', view.id === viewId));
    $$('.step-link').forEach((button) => button.classList.toggle('active', button.dataset.view === viewId));
    if (viewId === 'preview') renderSlides();
    if (viewId === 'slideEdit') renderSlideEdit();
  }

  function bindBasicForm() {
    const form = $('#basicForm');
    Object.entries(state.basic).forEach(([key, value]) => {
      const input = form.elements[key];
      if (input) input.value = value;
    });
    form.addEventListener('input', () => {
      Array.from(form.elements).forEach((field) => {
        if (field.name) state.basic[field.name] = field.value;
      });
      renderSlides();
    });
  }

  function bindPhotoImport() {
    const input = $('#photoInput');
    const dropZone = $('#dropZone');
    input.addEventListener('change', () => importFiles(input.files));
    ['dragenter', 'dragover'].forEach((eventName) => {
      dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropZone.classList.add('is-dragging');
      });
    });
    ['dragleave', 'drop'].forEach((eventName) => {
      dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropZone.classList.remove('is-dragging');
      });
    });
    dropZone.addEventListener('drop', (event) => importFiles(event.dataTransfer.files));
  }

  async function importFiles(files) {
    if (!files || !files.length) return;
    $('#errorList').innerHTML = '';
    $('#importProgress').value = 0;
    const { photos, errors } = await window.ImageProcessor.processFiles(files, (progress) => {
      $('#importProgress').value = progress;
    });
    state.photos.push(...photos);
    assignUnassignedPhotos();
    renderPhotoGrid();
    renderThemes();
    renderErrors(errors);
  }

  function renderErrors(errors) {
    $('#errorList').innerHTML = errors.map((error) => `<div>${window.SlideBuilder.escapeHtml(error)}</div>`).join('');
  }

  function bindThemeActions() {
    $('#addThemeBtn').addEventListener('click', () => {
      const theme = createTheme();
      state.themes.push(theme);
      state.currentThemeId = theme.id;
      renderThemes();
    });
    $('#autoAssignBtn').addEventListener('click', () => {
      assignUnassignedPhotos();
      renderAll();
    });
    $('#autoLayoutBtn').addEventListener('click', () => {
      window.LayoutEngine.applyAutoLayouts(state);
      renderThemes();
      renderSlides();
    });
  }

  function assignUnassignedPhotos() {
    const targetThemes = state.themes.filter((theme) => !['感謝', '新天地へのエール', '余韻'].includes(theme.title));
    const themes = targetThemes.length ? targetThemes : state.themes;
    state.photos.forEach((photo, index) => {
      if (!photo.themeId && themes.length) photo.themeId = themes[index % themes.length].id;
    });
  }

  function renderAll() {
    renderPhotoGrid();
    renderThemes();
    renderAiButtons();
    renderSlideEdit();
    renderChecklist();
    renderSlides();
  }

  function renderPhotoGrid() {
    $('#photoCount').textContent = `写真 ${state.photos.length}枚`;
    const usage = photoUsageMap();
    $('#photoGrid').innerHTML = state.photos.map((photo) => {
      const themeOptions = state.themes.map((theme) => `<option value="${theme.id}" ${theme.id === photo.themeId ? 'selected' : ''}>${theme.title}</option>`).join('');
      const usageText = usage.get(photo.id)?.join('、') || '未使用写真';
      const usageClass = usage.has(photo.id) ? 'is-used' : 'is-unused';
      const preview = photo.thumbSrc
        ? `<img src="${photo.thumbSrc}" alt="${window.SlideBuilder.escapeHtml(photo.fileName)}">`
        : `<div class="photo-placeholder">${window.SlideBuilder.escapeHtml(photo.fileName)}<br>画像なし保存から読み込まれています</div>`;
      return `
        <article class="photo-card" data-photo-id="${photo.id}">
          ${preview}
          <div class="photo-meta">
            <strong title="${window.SlideBuilder.escapeHtml(photo.fileName)}">${window.SlideBuilder.escapeHtml(photo.fileName)}</strong>
            <span class="photo-usage ${usageClass}">${window.SlideBuilder.escapeHtml(usageText)}</span>
            <label>テーマ<select data-field="themeId">${themeOptions}</select></label>
            <label>役割<select data-field="role">${photoRoles().map((role) => `<option ${role === photo.role ? 'selected' : ''}>${role}</option>`).join('')}</select></label>
            <label>重要度<input data-field="importance" type="range" min="1" max="5" value="${photo.importance}"></label>
            <label>キャプション<input data-field="caption" value="${window.SlideBuilder.escapeHtml(photo.caption)}"></label>
            <label>写真メモ<textarea data-field="memo">${window.SlideBuilder.escapeHtml(photo.memo)}</textarea></label>
            <div class="inline-controls">
              <label><input data-field="use" type="checkbox" ${photo.use ? 'checked' : ''}> 使用する</label>
              <button class="secondary rotate-photo" type="button">回転</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
    $$('#photoGrid [data-field]').forEach((field) => {
      field.addEventListener('input', onPhotoFieldChange);
      field.addEventListener('change', onPhotoFieldChange);
    });
    $$('.rotate-photo').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.closest('.photo-card').dataset.photoId;
        const photo = state.photos.find((item) => item.id === id);
        photo.rotation = ((Number(photo.rotation) || 0) + 90) % 360;
        renderSlides();
      });
    });
  }

  function photoUsageMap() {
    const usage = new Map();
    (state.manualSlides || []).forEach((slide, slideIndex) => {
      (slide.frames || []).forEach((frame, frameIndex) => {
        if (!frame.photoId) return;
        const entries = usage.get(frame.photoId) || [];
        entries.push(`Slide ${slideIndex + 1} / Frame ${frameIndex + 1}`);
        usage.set(frame.photoId, entries);
      });
    });
    return usage;
  }

  function onPhotoFieldChange(event) {
    const id = event.target.closest('.photo-card').dataset.photoId;
    const photo = state.photos.find((item) => item.id === id);
    const field = event.target.dataset.field;
    photo[field] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    renderThemes(false);
    renderSlides();
  }

  function photoRoles() {
    return ['主役写真', '補助写真', '雰囲気写真', '集合写真', '感謝ページ用', 'エンディング用', '使わない候補'];
  }

  function renderThemes(resetEditor = true) {
    if (!state.currentThemeId && state.themes.length) state.currentThemeId = state.themes[0].id;
    $('#themeList').innerHTML = state.themes.map((theme, index) => {
      const count = state.photos.filter((photo) => photo.themeId === theme.id).length;
      return `
        <button class="theme-pill ${theme.id === state.currentThemeId ? 'active' : ''}" data-theme-id="${theme.id}">
          <span>${index + 1}. ${window.SlideBuilder.escapeHtml(theme.title)}</span>
          <small>${count}枚 / ${window.SlideBuilder.escapeHtml(theme.layoutType)}</small>
        </button>
      `;
    }).join('');
    $$('.theme-pill').forEach((button) => {
      button.addEventListener('click', () => {
        state.currentThemeId = button.dataset.themeId;
        renderThemes();
      });
    });
    if (resetEditor) renderThemeEditor();
  }

  function renderThemeEditor() {
    const theme = state.themes.find((item) => item.id === state.currentThemeId);
    if (!theme) return;
    const photos = state.photos.filter((photo) => photo.themeId === theme.id);
    $('#themeEditor').classList.remove('empty');
    $('#themeEditor').innerHTML = `
      <div class="editor-grid">
        <label>テーマタイトル<input data-theme-field="title" value="${window.SlideBuilder.escapeHtml(theme.title)}"></label>
        <label>感情的役割<select data-theme-field="emotionalRole">${emotionalRoles().map((role) => `<option ${role === theme.emotionalRole ? 'selected' : ''}>${role}</option>`).join('')}</select></label>
        <label>レイアウトタイプ<select data-theme-field="layoutType">${window.LayoutEngine.LAYOUTS.map((layout) => `<option ${layout === theme.layoutType ? 'selected' : ''}>${layout}</option>`).join('')}</select></label>
        <label>メッセージ量<select data-theme-field="messageVolume"><option>少なめ</option><option ${theme.messageVolume === '標準' ? 'selected' : ''}>標準</option><option ${theme.messageVolume === '多め' ? 'selected' : ''}>多め</option></select></label>
        <label>写真の大小<select data-theme-field="photoScale"><option>控えめ</option><option ${theme.photoScale === '標準' ? 'selected' : ''}>標準</option><option ${theme.photoScale === '大きめ' ? 'selected' : ''}>大きめ</option></select></label>
        <label class="wide">テーマメッセージ<textarea data-theme-field="message">${window.SlideBuilder.escapeHtml(theme.message)}</textarea></label>
      </div>
      <div class="theme-photo-list">
        ${photos.map((photo) => `
          <div class="theme-photo-row" data-photo-id="${photo.id}">
            <img src="${photo.thumbSrc}" alt="">
            <span>${window.SlideBuilder.escapeHtml(photo.fileName)}</span>
            <button class="secondary move-photo-up" type="button">上へ</button>
            <button class="secondary move-photo-down" type="button">下へ</button>
            <button class="secondary make-hero" type="button">主役</button>
          </div>
        `).join('') || '<p>このテーマにはまだ写真がありません。</p>'}
      </div>
    `;
    $$('#themeEditor [data-theme-field]').forEach((field) => {
      field.addEventListener('input', () => updateThemeField(theme.id, field));
      field.addEventListener('change', () => updateThemeField(theme.id, field));
    });
    $$('.make-hero').forEach((button) => {
      button.addEventListener('click', () => {
        const photo = state.photos.find((item) => item.id === button.closest('.theme-photo-row').dataset.photoId);
        photo.role = '主役写真';
        renderAll();
      });
    });
    $$('.move-photo-up').forEach((button) => {
      button.addEventListener('click', () => movePhotoWithinTheme(button.closest('.theme-photo-row').dataset.photoId, -1));
    });
    $$('.move-photo-down').forEach((button) => {
      button.addEventListener('click', () => movePhotoWithinTheme(button.closest('.theme-photo-row').dataset.photoId, 1));
    });
  }

  function emotionalRoles() {
    return ['導入', '共感', '思い出', '意味づけ', '感謝', '未来へのエール', '余韻'];
  }

  function updateThemeField(themeId, field) {
    const theme = state.themes.find((item) => item.id === themeId);
    theme[field.dataset.themeField] = field.value;
    renderThemes(false);
    renderSlides();
  }

  function movePhotoWithinTheme(photoId, direction) {
    const photo = state.photos.find((item) => item.id === photoId);
    if (!photo) return;
    const themePhotos = state.photos.filter((item) => item.themeId === photo.themeId);
    const themeIndex = themePhotos.findIndex((item) => item.id === photoId);
    const targetIndex = themeIndex + direction;
    if (targetIndex >= 0 && targetIndex < themePhotos.length) {
      const targetPhoto = themePhotos[targetIndex];
      const sourceGlobalIndex = state.photos.findIndex((item) => item.id === photo.id);
      const targetGlobalIndex = state.photos.findIndex((item) => item.id === targetPhoto.id);
      state.photos[sourceGlobalIndex] = targetPhoto;
      state.photos[targetGlobalIndex] = photo;
      renderAll();
    }
  }

  function bindAi() {
    $('#copyPromptBtn').addEventListener('click', async () => {
      const copied = await copyText($('#promptOutput').value);
      $('#copyPromptBtn').textContent = copied ? 'コピーしました' : '選択しました';
      setTimeout(() => { $('#copyPromptBtn').textContent = 'プロンプトをコピー'; }, 1400);
    });
    $('#saveAiReturnBtn').addEventListener('click', () => {
      state.aiReturnText = $('#aiReturnText').value;
    });
  }

  function bindSlideEdit() {
    $('#autoModeBtn').addEventListener('click', () => {
      state.creationMode = 'auto';
      state.currentSlideEditId = null;
      renderSlideEdit();
    });
    $('#manualModeBtn').addEventListener('click', () => {
      state.creationMode = 'manual';
      ensureManualSlide();
      renderSlideEdit();
    });
    $('#addManualSlideBtn').addEventListener('click', () => {
      state.creationMode = 'manual';
      const slide = createManualSlide();
      state.manualSlides.push(slide);
      state.currentSlideEditId = slide.slideId;
      renderSlideEdit();
    });
    $('#duplicateManualSlideBtn').addEventListener('click', duplicateCurrentManualSlide);
    $('#deleteManualSlideBtn').addEventListener('click', deleteCurrentManualSlide);
    $('#moveManualSlideUpBtn').addEventListener('click', () => moveCurrentManualSlide(-1));
    $('#moveManualSlideDownBtn').addEventListener('click', () => moveCurrentManualSlide(1));
    $('#refreshSlideEditBtn').addEventListener('click', () => {
      renderSlides();
      renderSlideEdit();
    });
    $('#duplicateCheckBtn').addEventListener('click', () => {
      const results = checkDuplicateWords();
      renderDuplicateResults(results);
    });
    $('#rewritePromptBtn').addEventListener('click', () => {
      const results = checkDuplicateWords();
      renderDuplicateResults(results);
      $('#rewritePromptOutput').value = buildRewritePrompt(results);
    });
    $('#copyRewritePromptBtn').addEventListener('click', async () => {
      const copied = await copyTextFromElement($('#rewritePromptOutput'));
      $('#copyRewritePromptBtn').textContent = copied ? 'コピーしました' : '選択しました';
      setTimeout(() => { $('#copyRewritePromptBtn').textContent = '言い換えプロンプトをコピー'; }, 1400);
    });
    $('#layoutGuideToggle')?.addEventListener('change', (event) => {
      state.showLayoutGuides = event.target.checked;
      renderSlideEditPreview();
    });
    $('#openCurrentSlidePreviewBtn').addEventListener('click', openCurrentSlideInPreview);
    $('#expandEditPreviewBtn').addEventListener('click', toggleEditPreviewSize);
    window.addEventListener('resize', scaleRenderedSlides);
  }

  function renderSlideEdit() {
    if (state.creationMode === 'manual') ensureManualSlide();
    state.slides = window.SlideBuilder.buildSlides(state);
    if (!state.currentSlideEditId && state.slides.length) state.currentSlideEditId = state.slides[0].slideId;
    updateModeButtons();
    if ($('#layoutGuideToggle')) $('#layoutGuideToggle').checked = state.showLayoutGuides;
    renderSlideEditList();
    renderSlideEditForm();
    renderSlideEditPreview();
  }

  function updateModeButtons() {
    $('#autoModeBtn').classList.toggle('primary', state.creationMode === 'auto');
    $('#autoModeBtn').classList.toggle('secondary', state.creationMode !== 'auto');
    $('#manualModeBtn').classList.toggle('primary', state.creationMode === 'manual');
    $('#manualModeBtn').classList.toggle('secondary', state.creationMode !== 'manual');
  }

  function ensureManualSlide() {
    if (!state.manualSlides.length) {
      const slide = createManualSlide();
      state.manualSlides.push(slide);
      state.currentSlideEditId = slide.slideId;
    }
  }

  function createManualSlide(overrides = {}) {
    const slideId = overrides.slideId || `manual-${crypto.randomUUID()}`;
    const photoCount = normalizePhotoCountValue(overrides.photoCount ?? '1');
    const frameLayoutId = window.LayoutEngine.isFrameLayoutValid(photoCount, overrides.frameLayoutId)
      ? overrides.frameLayoutId
      : window.LayoutEngine.defaultFrameLayoutId(photoCount);
    const frameArchive = normalizeFrameArchive(overrides.frameArchive || overrides.frames || [], slideId);
    return {
      slideId,
      slideType: overrides.slideType || 'photo',
      photoCount,
      frameLayoutId,
      layoutType: overrides.layoutType || layoutTypeSuggestion(photoCount),
      emotionRole: overrides.emotionRole || 'Memory',
      placeholderText: overrides.placeholderText || '',
      frameArchive,
      frames: normalizeFrames(frameArchive, photoCount, slideId, overrides.placeholderText || ''),
      manualText: {
        title: '',
        subtitle: '',
        message: '',
        caption: '',
        supplemental: '',
        endingCopy: '',
        emotionalRole: '',
        layoutType: '',
        ...(overrides.manualText || {})
      },
      autoText: overrides.autoText || {
        title: '新しいスライド',
        subtitle: '',
        message: '写真と言葉で、この場面の意味を丁寧に伝えます。',
        caption: '',
        supplemental: '',
        endingCopy: ''
      }
    };
  }

  function normalizeFrameArchive(frames, slideId) {
    return (frames || []).map((frame, index) => ({
      frameId: frame.frameId && String(frame.frameId).startsWith(`${slideId}-frame-`) ? frame.frameId : `${slideId}-frame-${index + 1}`,
      photoId: frame.photoId || '',
      placeholderText: frame.placeholderText || '',
      fitMode: frame.fitMode || 'cover',
      x: Number(frame.x) || 0,
      y: Number(frame.y) || 0,
      scale: Number(frame.scale) || 1,
      rotation: Number(frame.rotation) || 0
    }));
  }

  function normalizeFrames(frames, photoCount, slideId, placeholderText = '') {
    const count = window.LayoutEngine.frameCountForPhotoCount(photoCount);
    const result = [];
    for (let index = 0; index < count; index += 1) {
      const placeholder = Array.isArray(placeholderText) ? placeholderText[index] : placeholderText;
      result.push({
        frameId: frames[index]?.frameId && String(frames[index].frameId).startsWith(`${slideId}-frame-`) ? frames[index].frameId : `${slideId}-frame-${index + 1}`,
        photoId: frames[index]?.photoId || '',
        placeholderText: frames[index]?.placeholderText || placeholder || '',
        fitMode: frames[index]?.fitMode || 'cover',
        x: Number(frames[index]?.x) || 0,
        y: Number(frames[index]?.y) || 0,
        scale: Number(frames[index]?.scale) || 1,
        rotation: Number(frames[index]?.rotation) || 0
      });
    }
    return result;
  }

  function layoutTypeSuggestion(photoCount) {
    const count = window.LayoutEngine.frameCountForPhotoCount(photoCount);
    if (count === 0) return 'Message Layout';
    if (count === 1) return 'Hero Layout';
    if (count <= 3) return 'Story Layout';
    if (count <= 8) return 'Mosaic Layout';
    return 'Gallery Layout';
  }

  function renderSlideEditList() {
    const list = $('#slideEditList');
    if (!list) return;
    list.innerHTML = state.slides.map((slide, index) => {
      const warnings = slideTextWarnings(slide);
      return `
      <button class="slide-edit-item ${slide.slideId === state.currentSlideEditId ? 'active' : ''}" data-slide-id="${slide.slideId}">
        <span class="slide-edit-no">Slide ${index + 1}</span>
        <strong>${window.SlideBuilder.escapeHtml(slide.typeLabel || slide.kind)}</strong>
        <small>${window.SlideBuilder.escapeHtml(slide.title || 'タイトルなし')}</small>
        <span class="mini-preview">${window.SlideBuilder.escapeHtml((slide.message || '').slice(0, 44))}</span>
        ${warnings.length ? `<span class="slide-list-warning">文字量を確認</span>` : ''}
      </button>
    `;
    }).join('');
    $$('.slide-edit-item').forEach((button) => {
      button.addEventListener('click', () => {
        state.currentSlideEditId = button.dataset.slideId;
        renderSlideEdit();
      });
    });
  }

  function renderSlideEditForm() {
    const form = $('#slideEditForm');
    if (!form) return;
    const slide = state.slides.find((item) => item.slideId === state.currentSlideEditId);
    const manualSlide = getCurrentManualSlide();
    if (!slide) {
      form.className = 'slide-edit-form empty';
      form.textContent = '左のスライドを選択してください。';
      return;
    }
    const manual = slide.manualText || {};
    form.className = 'slide-edit-form';
    form.innerHTML = `
      <div class="selected-slide-head">
        <p class="eyebrow">Slide ${state.slides.findIndex((item) => item.slideId === slide.slideId) + 1} / ${window.SlideBuilder.escapeHtml(slide.typeLabel || slide.kind)}</p>
        <h3>${window.SlideBuilder.escapeHtml(slide.title || 'タイトルなし')}</h3>
      </div>
      <div class="manual-note">まずスライド種別、写真枚数、フレーム配置、感情役割を決めます。そのあと、このスライドに必要な写真だけを各フレームへ追加します。</div>
      <div id="textFitWarning" class="text-fit-warning" hidden></div>
      <div class="editor-grid">
        ${state.creationMode === 'manual' ? manualSlideSettingsMarkup(manualSlide) : ''}
        ${textFieldMarkup('title', 'スライドタイトル', 'input', manual.title, slide.autoText?.title)}
        ${textFieldMarkup('subtitle', 'サブタイトル', 'input', manual.subtitle, slide.autoText?.subtitle)}
        ${textFieldMarkup('message', 'メインメッセージ', 'textarea', manual.message, slide.autoText?.message, 'wide')}
        ${textFieldMarkup('caption', 'キャプション入力欄', 'textarea', manual.caption, slide.autoText?.caption, 'wide')}
        ${textFieldMarkup('supplemental', '補足メッセージ', 'textarea', manual.supplemental, slide.autoText?.supplemental, 'wide')}
        ${textFieldMarkup('endingCopy', 'エンディングコピー', 'input', manual.endingCopy, slide.autoText?.endingCopy)}
        <label>感情役割<select data-slide-field="emotionalRole">${emotionRolesD().map((role) => `<option ${((manual.emotionalRole || slide.emotionalRole) === role) ? 'selected' : ''}>${role}</option>`).join('')}</select></label>
        <label>レイアウトタイプ<select data-slide-field="layoutType">${window.LayoutEngine.LAYOUTS.map((layout) => `<option ${((manual.layoutType || slide.layoutType) === layout) ? 'selected' : ''}>${layout}</option>`).join('')}</select></label>
      </div>
      ${state.creationMode === 'manual' ? frameEditorMarkup(manualSlide) : ''}
      <div class="slide-edit-buttons">
        <button id="saveSlideTextBtn" class="primary" type="button">保存</button>
        <button id="applySlidePreviewBtn" class="secondary" type="button">プレビュー反映</button>
        <button id="clearSlideManualBtn" class="secondary" type="button">手動編集文をクリア</button>
      </div>
      <div class="auto-text-panel">
        <h3>自動生成文</h3>
        <p><strong>タイトル:</strong> ${window.SlideBuilder.escapeHtml(slide.autoText?.title || '')}</p>
        <p><strong>サブタイトル:</strong> ${window.SlideBuilder.escapeHtml(slide.autoText?.subtitle || '')}</p>
        <p><strong>メッセージ:</strong> ${window.SlideBuilder.escapeHtml(slide.autoText?.message || '').replace(/\n/g, '<br>')}</p>
      </div>
    `;
    bindManualSlideFields(manualSlide);
    bindSlideTextFields(slide);
    bindFrameFields(manualSlide);
    renderTextFitWarning(slide);
    $('#saveSlideTextBtn').addEventListener('click', () => saveSlideEditFromForm(slide.slideId, false));
    $('#applySlidePreviewBtn').addEventListener('click', () => saveSlideEditFromForm(slide.slideId, true));
    $('#clearSlideManualBtn').addEventListener('click', () => {
      delete state.slideEdits[slide.slideId];
      renderSlides();
      renderSlideEdit();
    });
  }

  function textFieldMarkup(field, label, type, value, placeholder, extraClass = '') {
    const current = value || '';
    const hint = textLengthHint(field, current);
    const escapedValue = window.SlideBuilder.escapeHtml(current);
    const escapedPlaceholder = window.SlideBuilder.escapeHtml(placeholder || '');
    const control = type === 'textarea'
      ? `<textarea data-slide-field="${field}" placeholder="${escapedPlaceholder}">${escapedValue}</textarea>`
      : `<input data-slide-field="${field}" value="${escapedValue}" placeholder="${escapedPlaceholder}">`;
    return `<label class="${extraClass}">${label}${control}<span class="text-length-hint ${hint.long ? 'is-long' : ''}" data-length-hint="${field}">${window.SlideBuilder.escapeHtml(hint.message)}</span></label>`;
  }

  function textLengthHint(field, value) {
    const limits = { title: 20, subtitle: 20, message: 60, caption: 25, supplemental: 45, endingCopy: 40 };
    const labels = { title: 'タイトル', subtitle: 'サブタイトル', message: '本文', caption: 'キャプション', supplemental: '補足', endingCopy: 'エンディング' };
    const length = String(value || '').replace(/\s+/g, '').length;
    const limit = limits[field] || 40;
    const base = `${labels[field] || '文字'}：推奨 ${limit}文字以内`;
    return {
      long: length > limit,
      message: length > limit ? `${base}。少し長めです。文字が小さくなる可能性があります` : base
    };
  }

  function bindSlideTextFields(slide) {
    $$('#slideEditForm [data-slide-field]').forEach((field) => {
      field.addEventListener('input', () => updateSlideTextDraft(slide.slideId));
      field.addEventListener('change', () => updateSlideTextDraft(slide.slideId));
    });
  }

  function updateSlideTextDraft(slideId) {
    const manualText = {};
    $$('#slideEditForm [data-slide-field]').forEach((field) => {
      manualText[field.dataset.slideField] = field.value;
      updateLengthHint(field.dataset.slideField, field.value);
    });
    const currentEdit = state.slideEdits[slideId] || {};
    state.slideEdits[slideId] = {
      ...currentEdit,
      slideId,
      manualText
    };
    const manualSlide = getCurrentManualSlide();
    if (manualSlide && manualSlide.slideId === slideId) {
      manualSlide.manualText = {
        ...manualSlide.manualText,
        ...manualText
      };
      manualSlide.emotionRole = manualText.emotionalRole || manualSlide.emotionRole;
      manualSlide.layoutType = manualText.layoutType || manualSlide.layoutType;
    }
    state.slides = window.SlideBuilder.buildSlides(state);
    renderSlideEditPreview();
  }

  function updateLengthHint(field, value) {
    const hintEl = $(`[data-length-hint="${field}"]`);
    if (!hintEl) return;
    const hint = textLengthHint(field, value);
    hintEl.textContent = hint.message;
    hintEl.classList.toggle('is-long', hint.long);
  }

  function renderTextFitWarning(slide, renderedSlide) {
    const warningBox = $('#textFitWarning');
    if (!warningBox || !slide) return;
    const warnings = renderedSlide
      ? JSON.parse(renderedSlide.dataset.textWarnings || '[]')
      : slideTextWarnings(slide);
    if (!warnings.length) {
      warningBox.hidden = true;
      warningBox.innerHTML = '';
      return;
    }
    warningBox.hidden = false;
    const slideNo = state.slides.findIndex((item) => item.slideId === slide.slideId) + 1;
    const recommendation = layoutRecommendationForSlide(slide, warnings);
    warningBox.innerHTML = `
      <strong>文字量を確認してください</strong>
      ${warnings.map((warning) => `<span>スライド${slideNo}：${window.SlideBuilder.escapeHtml(warning.message)}</span>`).join('')}
      ${recommendation ? `<span>${window.SlideBuilder.escapeHtml(recommendation)}</span>` : ''}
    `;
  }

  function slideTextWarnings(slide) {
    const frameCount = slide.frames?.length || slide.photos?.length || 0;
    const baseDefinition = window.LayoutEngine.frameLayoutDefinition(slide.frameLayoutId || slide.layoutType, frameCount);
    const definition = window.LayoutEngine.adjustDefinitionForText
      ? window.LayoutEngine.adjustDefinitionForText(baseDefinition, slide)
      : baseDefinition;
    return window.SlideRenderer.textWarnings(slide, definition);
  }

  function allTextWarnings() {
    return state.slides.flatMap((slide, index) => slideTextWarnings(slide).map((warning) => ({
      ...warning,
      slideNo: index + 1,
      slide
    })));
  }

  function layoutRecommendationForSlide(slide, warnings) {
    const messageLength = String(slide.message || '').replace(/\s+/g, '').length;
    if (messageLength >= 90) return 'この文章量には Message Wide Top がおすすめです。さらに長い場合は Text Focus with Bottom Photo または Legacy Message First も確認してください。';
    if (warnings.some((warning) => warning.area === 'message')) return '本文を主役にする場合は Text Focus with Bottom Photo がおすすめです。';
    if (warnings.some((warning) => warning.area === 'title')) return '長いタイトルには Message Wide Top がおすすめです。';
    return '';
  }

  function renderSlideEditPreview() {
    const preview = $('#slideEditPreview');
    if (!preview) return;
    const slide = state.slides.find((item) => item.slideId === state.currentSlideEditId);
    preview.innerHTML = '';
    if (slide) {
      const rendered = renderScaledSlide(slide, { showGuides: state.showLayoutGuides, context: 'edit' });
      preview.appendChild(rendered);
      renderTextFitWarning(slide, rendered);
    }
    const manualSlide = getCurrentManualSlide();
    $('#frameSuggestion').textContent = manualSlide ? suggestionForPhotoCount(manualSlide.photoCount) : '自動テーマ構成モードでは、テーマと写真の役割からレイアウトを自動提案します。';
  }

  function toggleEditPreviewSize() {
    const preview = $('#slideEditPreview');
    const button = $('#expandEditPreviewBtn');
    const expanded = preview.classList.toggle('is-expanded');
    button.textContent = expanded ? '拡大を閉じる' : 'プレビュー拡大';
    requestAnimationFrame(scaleRenderedSlides);
  }

  function openCurrentSlideInPreview() {
    state.slides = window.SlideBuilder.buildSlides(state);
    const index = Math.max(0, state.slides.findIndex((item) => item.slideId === state.currentSlideEditId));
    state.currentSlideIndex = index;
    showView('preview');
    setSlide(index);
  }

  function manualSlideSettingsMarkup(manualSlide) {
    if (!manualSlide) return '';
    const countOptions = [
      ['0', '写真なし'],
      ['1', '1枚'],
      ['2', '2枚'],
      ['3', '3枚'],
      ['4', '4枚'],
      ['5-8', '5〜8枚'],
      ['9+', '9枚以上']
    ].map(([value, label]) => `<option value="${value}" ${String(manualSlide.photoCount) === value ? 'selected' : ''}>${label}</option>`).join('');
    const layouts = window.LayoutEngine.frameLayoutsForCount(manualSlide.photoCount);
    const layoutOptions = layouts.map((layout) => `<option value="${layout.id}" ${manualSlide.frameLayoutId === layout.id ? 'selected' : ''}>${layout.label}</option>`).join('');
    return `
      <label>スライド種別<select data-manual-field="slideType">${slideTypeOptions(manualSlide.slideType)}</select></label>
      <section class="photo-count-control wide">
        <label for="slidePhotoCount">このスライドに入れる写真枚数<select id="slidePhotoCount" data-manual-field="photoCount">${countOptions}</select></label>
      </section>
      <section class="frame-layout-control wide">
        <label for="frameLayoutSelect">フレーム配置を選択<select id="frameLayoutSelect" data-manual-field="frameLayoutId">${layoutOptions}</select></label>
        <p class="layout-guide">${window.SlideBuilder.escapeHtml(layoutGuideForManualSlide(manualSlide))}</p>
        <div id="frameLayoutCards" class="frame-layout-cards">
          ${layouts.map((layout) => `
            <button type="button" class="frame-layout-card ${manualSlide.frameLayoutId === layout.id ? 'active' : ''}" data-layout-id="${layout.id}">
              <strong>${layout.label}</strong>
              <span>${layout.description}</span>
            </button>
          `).join('')}
        </div>
      </section>
    `;
  }

  function slideTypeOptions(current) {
    const types = [
      ['cover', '表紙'],
      ['intro', '導入'],
      ['theme', 'テーマ'],
      ['photo', '写真'],
      ['photoMessage', '写真＋メッセージ'],
      ['themeMessage', 'テーマメッセージ'],
      ['gratitude', '感謝'],
      ['cheer', 'エール'],
      ['ending', 'エンディング']
    ];
    return types.map(([value, label]) => `<option value="${value}" ${current === value ? 'selected' : ''}>${label}</option>`).join('');
  }

  function frameEditorMarkup(manualSlide) {
    if (!manualSlide) return '';
    if (!manualSlide.frames.length) {
      return '<div class="frame-editor"><h3>このスライドの写真</h3><p>このスライドは写真なしのMessage Layoutです。言葉を主役にして見せます。</p></div>';
    }
    return `
      <div class="frame-editor">
        <h3>このスライドの写真</h3>
        <p class="save-hint">このスライドに写真をまとめて追加すると、空いているフレームへ順番に仮配置します。各フレームごとの追加、差し替え、削除もできます。</p>
        <label class="file-button primary slide-bulk-photo-button">このスライドに写真をまとめて追加<input id="slideBulkPhotoInput" type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple></label>
        ${slidePhotoLibraryMarkup(manualSlide)}
        ${manualSlide.frames.map((frame, index) => frameRowMarkup(frame, index)).join('')}
      </div>
    `;
  }

  function frameRowMarkup(frame, index) {
    const photo = state.photos.find((item) => item.id === frame.photoId);
    const photoOptions = ['<option value="">写真未設定</option>'].concat(state.photos.map((photo) => (
      `<option value="${photo.id}" ${photo.id === frame.photoId ? 'selected' : ''}>${window.SlideBuilder.escapeHtml(photo.fileName)}</option>`
    ))).join('');
    return `
      <div class="frame-row" data-frame-index="${index}">
        <strong>Frame ${index + 1}</strong>
        <div class="frame-thumb">${photo?.thumbSrc ? `<img src="${photo.thumbSrc}" alt="">` : `<span>${window.SlideBuilder.escapeHtml(frame.placeholderText || '写真未設定')}</span>`}</div>
        <select data-frame-field="photoId">${photoOptions}</select>
        <label class="file-button secondary">${photo ? '写真差し替え' : '写真追加'}<input data-frame-file="${index}" type="file" accept="image/jpeg,image/jpg,image/png,image/webp"></label>
        <label>表示<select data-frame-field="fitMode"><option value="cover" ${frame.fitMode === 'cover' ? 'selected' : ''}>フレームいっぱいに切り抜く</option><option value="contain" ${frame.fitMode === 'contain' ? 'selected' : ''}>全体を収める</option></select></label>
        <label>横位置<input data-frame-field="x" type="range" min="-120" max="120" value="${frame.x}"></label>
        <label>縦位置<input data-frame-field="y" type="range" min="-120" max="120" value="${frame.y}"></label>
        <label>拡大<input data-frame-field="scale" type="range" min="0.7" max="2.2" step="0.05" value="${frame.scale}"></label>
        <label>回転<input data-frame-field="rotation" type="range" min="-20" max="20" step="1" value="${frame.rotation}"></label>
        <button class="secondary clear-frame-photo" type="button">写真削除</button>
        <button class="secondary swap-frame-prev" type="button">前と入替</button>
        <button class="secondary swap-frame-next" type="button">次と入替</button>
      </div>
    `;
  }

  function slidePhotoLibraryMarkup(manualSlide) {
    const currentIds = new Set((manualSlide.frames || []).map((frame) => frame.photoId).filter(Boolean));
    const current = state.photos.filter((photo) => currentIds.has(photo.id));
    const usedAnywhere = new Set();
    (state.manualSlides || []).forEach((slide) => {
      (slide.frames || []).forEach((frame) => {
        if (frame.photoId) usedAnywhere.add(frame.photoId);
      });
    });
    const unused = state.photos.filter((photo) => !usedAnywhere.has(photo.id)).slice(0, 8);
    return `
      <div class="slide-photo-library">
        <div>
          <strong>このスライドで使った写真</strong>
          <div class="library-strip">${current.map(libraryThumbMarkup).join('') || '<span>まだありません</span>'}</div>
        </div>
        <div>
          <strong>未使用写真から選ぶ</strong>
          <div class="library-strip">${unused.map(libraryThumbMarkup).join('') || '<span>未使用写真はありません</span>'}</div>
        </div>
      </div>
    `;
  }

  function libraryThumbMarkup(photo) {
    return `
      <button type="button" class="library-thumb" data-library-photo-id="${photo.id}" title="${window.SlideBuilder.escapeHtml(photo.fileName)}">
        ${photo.thumbSrc ? `<img src="${photo.thumbSrc}" alt="">` : '<span>画像なし</span>'}
      </button>
    `;
  }

  function bindManualSlideFields(manualSlide) {
    if (!manualSlide) return;
    $$('#slideEditForm [data-manual-field]').forEach((field) => {
      field.addEventListener('change', () => {
        if (field.dataset.manualField === 'photoCount') {
          manualSlide.frameArchive = mergeFrameArchive(manualSlide);
          manualSlide.photoCount = normalizePhotoCountValue(field.value);
          if (!window.LayoutEngine.isFrameLayoutValid(manualSlide.photoCount, manualSlide.frameLayoutId)) {
            manualSlide.frameLayoutId = window.LayoutEngine.defaultFrameLayoutId(manualSlide.photoCount);
          }
          manualSlide.frames = normalizeFrames(manualSlide.frameArchive, manualSlide.photoCount, manualSlide.slideId, manualSlide.placeholderText);
          manualSlide.layoutType = layoutTypeSuggestion(manualSlide.photoCount);
        } else {
          manualSlide[field.dataset.manualField] = field.value;
          if (field.dataset.manualField === 'frameLayoutId') {
            manualSlide.frameArchive = mergeFrameArchive(manualSlide);
            manualSlide.frames = normalizeFrames(manualSlide.frameArchive, manualSlide.photoCount, manualSlide.slideId, manualSlide.placeholderText);
          }
        }
        renderSlides();
        renderSlideEdit();
      });
    });
    $$('#frameLayoutCards .frame-layout-card').forEach((button) => {
      button.addEventListener('click', () => {
        manualSlide.frameLayoutId = button.dataset.layoutId;
        manualSlide.frameArchive = mergeFrameArchive(manualSlide);
        manualSlide.frames = normalizeFrames(manualSlide.frameArchive, manualSlide.photoCount, manualSlide.slideId, manualSlide.placeholderText);
        renderSlides();
        renderSlideEdit();
      });
    });
  }

  function bindFrameFields(manualSlide) {
    if (!manualSlide) return;
    $$('#slideEditForm .frame-row').forEach((row) => {
      row.addEventListener('dragover', (event) => event.preventDefault());
      row.addEventListener('drop', async (event) => {
        event.preventDefault();
        const index = Number(row.dataset.frameIndex);
        await addFilesToFrame(event.dataTransfer.files, manualSlide, index);
      });
    });
    $$('#slideEditForm [data-frame-field]').forEach((field) => {
      field.addEventListener('input', () => updateFrameField(field, manualSlide));
      field.addEventListener('change', () => updateFrameField(field, manualSlide));
    });
    $$('#slideEditForm .library-thumb').forEach((button) => {
      button.addEventListener('click', () => assignLibraryPhotoToFirstEmptyFrame(manualSlide, button.dataset.libraryPhotoId));
    });
    $$('#slideEditForm [data-frame-file]').forEach((input) => {
      input.addEventListener('change', async () => {
        await addFilesToFrame(input.files, manualSlide, Number(input.dataset.frameFile));
      });
    });
    const bulkInput = $('#slideBulkPhotoInput');
    if (bulkInput) {
      bulkInput.addEventListener('change', async () => {
        await addFilesToSlide(bulkInput.files, manualSlide);
      });
    }
    $$('.clear-frame-photo').forEach((button) => {
      button.addEventListener('click', () => {
        manualSlide.frames[Number(button.closest('.frame-row').dataset.frameIndex)].photoId = '';
        manualSlide.frameArchive = mergeFrameArchive(manualSlide);
        renderSlides();
        renderSlideEdit();
      });
    });
    $$('.swap-frame-prev').forEach((button) => {
      button.addEventListener('click', () => swapFramePhotos(manualSlide, Number(button.closest('.frame-row').dataset.frameIndex), -1));
    });
    $$('.swap-frame-next').forEach((button) => {
      button.addEventListener('click', () => swapFramePhotos(manualSlide, Number(button.closest('.frame-row').dataset.frameIndex), 1));
    });
  }

  function updateFrameField(field, manualSlide) {
    const index = Number(field.closest('.frame-row').dataset.frameIndex);
    const frame = manualSlide.frames[index];
    const value = ['x', 'y', 'scale', 'rotation'].includes(field.dataset.frameField) ? Number(field.value) : field.value;
    frame[field.dataset.frameField] = value;
    manualSlide.frameArchive = mergeFrameArchive(manualSlide);
    state.slides = window.SlideBuilder.buildSlides(state);
    renderSlideEditPreview();
  }

  function mergeFrameArchive(manualSlide) {
    const archive = [...(manualSlide.frameArchive || [])];
    (manualSlide.frames || []).forEach((frame, index) => {
      archive[index] = { ...frame };
    });
    return normalizeFrameArchive(archive, manualSlide.slideId);
  }

  async function addFilesToFrame(files, manualSlide, frameIndex) {
    if (!files || !files.length) return;
    const { photos, errors } = await window.ImageProcessor.processFiles(files, () => {});
    if (errors.length) renderErrors(errors);
    state.photos.push(...photos);
    if (photos[0]) manualSlide.frames[frameIndex].photoId = photos[0].id;
    manualSlide.frameArchive = mergeFrameArchive(manualSlide);
    renderAll();
    showView('slideEdit');
  }

  async function addFilesToSlide(files, manualSlide) {
    if (!files || !files.length) return;
    const { photos, errors } = await window.ImageProcessor.processFiles(files, () => {});
    if (errors.length) renderErrors(errors);
    state.photos.push(...photos);
    let nextPhotoIndex = 0;
    manualSlide.frames.forEach((frame) => {
      if (frame.photoId || !photos[nextPhotoIndex]) return;
      frame.photoId = photos[nextPhotoIndex].id;
      nextPhotoIndex += 1;
    });
    manualSlide.frameArchive = mergeFrameArchive(manualSlide);
    renderAll();
    showView('slideEdit');
  }

  function assignLibraryPhotoToFirstEmptyFrame(manualSlide, photoId) {
    const frame = manualSlide.frames.find((item) => !item.photoId) || manualSlide.frames[0];
    if (!frame) return;
    frame.photoId = photoId;
    manualSlide.frameArchive = mergeFrameArchive(manualSlide);
    renderSlides();
    renderSlideEdit();
  }

  function swapFramePhotos(manualSlide, frameIndex, direction) {
    const target = frameIndex + direction;
    if (target < 0 || target >= manualSlide.frames.length) return;
    const currentPhoto = manualSlide.frames[frameIndex].photoId;
    manualSlide.frames[frameIndex].photoId = manualSlide.frames[target].photoId;
    manualSlide.frames[target].photoId = currentPhoto;
    manualSlide.frameArchive = mergeFrameArchive(manualSlide);
    renderSlides();
    renderSlideEdit();
  }

  function suggestionForPhotoCount(photoCount) {
    const bucket = window.LayoutEngine.photoCountBucket(photoCount);
    if (bucket === '0') return '写真なし: 導入、感謝、余韻に向いた言葉中心のスライドがおすすめです。';
    if (bucket === '1') return '写真1枚: 主役写真として大きく見せるレイアウトがおすすめです。';
    if (bucket === '3') return '写真3枚: 流れを見せるStory Layoutがおすすめです。';
    if (bucket === '5-8') return '写真5〜8枚: Mosaic Layoutで思い出のまとまりとして見せるのがおすすめです。';
    if (bucket === '9+') return '写真9枚以上: 1枚に詰め込むより、複数スライドに分けることをおすすめします。';
    return `写真${bucket}枚: 写真と言葉のバランスを見ながら、場面の関係性が伝わる配置がおすすめです。`;
  }

  function layoutGuideForManualSlide(manualSlide) {
    return window.LayoutEngine.photoSelectionGuide(manualSlide.photoCount);
  }

  function normalizePhotoCountValue(value) {
    if (value === '5-8' || value === '9+') return value;
    const number = Number(value);
    if (number >= 9) return '9+';
    if (number >= 5) return '5-8';
    if ([0, 1, 2, 3, 4].includes(number)) return String(number);
    return '1';
  }

  function getCurrentManualSlide() {
    return state.manualSlides.find((slide) => slide.slideId === state.currentSlideEditId) || null;
  }

  function duplicateCurrentManualSlide() {
    if (state.creationMode !== 'manual') return;
    const current = getCurrentManualSlide();
    if (!current) return;
    const copy = JSON.parse(JSON.stringify(current));
    copy.slideId = `manual-${crypto.randomUUID()}`;
    copy.frameArchive = normalizeFrameArchive(copy.frameArchive || copy.frames || [], copy.slideId);
    copy.frames = normalizeFrames(copy.frameArchive, copy.photoCount, copy.slideId, copy.placeholderText);
    const index = state.manualSlides.findIndex((slide) => slide.slideId === current.slideId);
    state.manualSlides.splice(index + 1, 0, copy);
    state.currentSlideEditId = copy.slideId;
    renderSlideEdit();
  }

  function deleteCurrentManualSlide() {
    if (state.creationMode !== 'manual') return;
    const index = state.manualSlides.findIndex((slide) => slide.slideId === state.currentSlideEditId);
    if (index < 0) return;
    const deleted = state.manualSlides[index];
    delete state.slideEdits[deleted.slideId];
    if (state.manualSlides.length === 1) {
      state.manualSlides[0] = createManualSlide();
      state.currentSlideEditId = state.manualSlides[0].slideId;
    } else {
      state.manualSlides.splice(index, 1);
      state.currentSlideEditId = state.manualSlides[Math.max(0, index - 1)].slideId;
    }
    renderSlideEdit();
  }

  function moveCurrentManualSlide(direction) {
    if (state.creationMode !== 'manual') return;
    const index = state.manualSlides.findIndex((slide) => slide.slideId === state.currentSlideEditId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= state.manualSlides.length) return;
    const current = state.manualSlides[index];
    state.manualSlides[index] = state.manualSlides[target];
    state.manualSlides[target] = current;
    renderSlideEdit();
  }

  function emotionRolesD() {
    return ['Hook', 'Empathy', 'Memory', 'Meaning', 'Gratitude', 'Future', 'Afterglow'];
  }

  function saveSlideEditFromForm(slideId, goPreview) {
    const slide = state.slides.find((item) => item.slideId === slideId);
    if (!slide) return;
    const manualText = {};
    $$('#slideEditForm [data-slide-field]').forEach((field) => {
      manualText[field.dataset.slideField] = field.value;
    });
    state.slideEdits[slideId] = {
      slideId,
      type: slide.kind,
      themeId: slide.themeId || null,
      autoText: slide.autoText,
      manualText
    };
    const manualSlide = getCurrentManualSlide();
    if (manualSlide && manualSlide.slideId === slideId) {
      manualSlide.manualText = manualText;
      manualSlide.emotionRole = manualText.emotionalRole || manualSlide.emotionRole;
      manualSlide.layoutType = manualText.layoutType || manualSlide.layoutType;
    }
    renderSlides();
    renderSlideEdit();
    if (goPreview) {
      state.currentSlideIndex = Math.max(0, state.slides.findIndex((item) => item.slideId === slideId));
      showView('preview');
    }
  }

  function checkDuplicateWords() {
    state.slides = window.SlideBuilder.buildSlides(state);
    const issues = [];
    checkConsecutiveTitles(issues);
    checkDuplicateCaptions(issues);
    checkThanksOveruse(issues);
    checkWordBias(issues);
    checkSimilarMessages(issues);
    checkLengthVariance(issues);
    checkConsecutiveEmotionRoles(issues);
    if (!issues.length) {
      issues.push({ level: '問題なし', message: '大きな重複や偏りは見つかりませんでした。' });
    }
    return issues;
  }

  function checkConsecutiveTitles(issues) {
    for (let i = 1; i < state.slides.length; i += 1) {
      const prev = normalizeText(state.slides[i - 1].title);
      const current = normalizeText(state.slides[i].title);
      if (current && prev && current === prev) {
        issues.push({ level: '問題あり', message: `スライド${i}、${i + 1}で同じタイトル「${state.slides[i].title}」が続いています。` });
      }
    }
  }

  function checkDuplicateCaptions(issues) {
    const counts = new Map();
    state.slides.forEach((slide, index) => {
      normalizeText(slide.caption).split('/').map((item) => item.trim()).filter(Boolean).forEach((caption) => {
        const entry = counts.get(caption) || [];
        entry.push(index + 1);
        counts.set(caption, entry);
      });
    });
    counts.forEach((indexes, caption) => {
      if (indexes.length >= 2) {
        issues.push({ level: '注意', message: `キャプション「${caption}」がスライド${indexes.join('、')}で複数回使われています。` });
      }
    });
  }

  function checkThanksOveruse(issues) {
    const hits = state.slides.map((slide, index) => ({ index: index + 1, hit: /ありがとう|ありがとうございました/.test(textOfSlide(slide)) }));
    let streak = [];
    hits.forEach((item) => {
      if (item.hit) {
        streak.push(item.index);
      } else {
        if (streak.length >= 3) issues.push({ level: '注意', message: `スライド${streak.join('、')}で「ありがとうございました」に近い表現が連続しています。別表現を混ぜると余韻が出ます。` });
        streak = [];
      }
    });
    if (streak.length >= 3) issues.push({ level: '注意', message: `スライド${streak.join('、')}で「ありがとうございました」に近い表現が連続しています。別表現を混ぜると余韻が出ます。` });
  }

  function checkWordBias(issues) {
    const words = ['思い出', '感謝', '支え', '新天地'];
    const all = state.slides.map(textOfSlide).join('\n');
    words.forEach((word) => {
      const count = (all.match(new RegExp(word, 'g')) || []).length;
      if (count >= 6) {
        issues.push({ level: '注意', message: `「${word}」が${count}回使われています。言い換えを入れると流れが単調になりにくくなります。` });
      }
    });
  }

  function checkSimilarMessages(issues) {
    for (let i = 1; i < state.slides.length; i += 1) {
      const a = state.slides[i - 1].message || '';
      const b = state.slides[i].message || '';
      if (similarity(a, b) > 0.72 && normalizeText(a).length > 18) {
        issues.push({ level: '注意', message: `スライド${i}、${i + 1}のメッセージが似ています。片方を具体的な場面や意味づけに寄せると自然です。` });
      }
    }
  }

  function checkLengthVariance(issues) {
    const lengths = state.slides.map((slide) => normalizeText(slide.message).length).filter((length) => length > 0);
    if (lengths.length < 3) return;
    const max = Math.max(...lengths);
    const min = Math.min(...lengths);
    if (max >= min * 4 && max - min > 80) {
      issues.push({ level: '注意', message: `メッセージの長さにばらつきがあります。最短${min}文字、最長${max}文字です。上映時の読みやすさを確認してください。` });
    }
  }

  function checkConsecutiveEmotionRoles(issues) {
    let streak = [];
    state.slides.forEach((slide, index) => {
      if (index === 0 || slide.emotionalRole === state.slides[index - 1].emotionalRole) {
        streak.push(index + 1);
      } else {
        if (streak.length >= 4) issues.push({ level: '注意', message: `${state.slides[index - 1].emotionalRole}役割のスライドが${streak.length}枚連続しています。途中にMeaningまたはGratitudeなどを挟むと流れが自然になります。` });
        streak = [index + 1];
      }
    });
    if (streak.length >= 4) {
      const role = state.slides[streak[0] - 1].emotionalRole;
      issues.push({ level: '注意', message: `${role}役割のスライドが${streak.length}枚連続しています。途中にMeaningまたはGratitudeなどを挟むと流れが自然になります。` });
    }
  }

  function renderDuplicateResults(results) {
    $('#duplicateResults').innerHTML = results.map((item) => `
      <div class="duplicate-result ${resultClass(item.level)}">
        <strong>${item.level}</strong>
        <span>${window.SlideBuilder.escapeHtml(item.message)}</span>
      </div>
    `).join('');
  }

  function resultClass(level) {
    if (level === '問題あり') return 'is-problem';
    if (level === '注意') return 'is-warning';
    return 'is-ok';
  }

  function buildRewritePrompt(results) {
    state.slides = window.SlideBuilder.buildSlides(state);
    return [
      '# 送別フォトアルバム 言い換え支援プロンプト',
      '',
      'あなたは、会社の役職者へ贈る送別フォトアルバムの編集者です。',
      '同じような表現が続いているスライドの言葉を、感情の流れを壊さずに言い換えてください。',
      '',
      '## 条件',
      '- 職場の送別アルバム向け',
      '- 上品',
      '- 失礼がない',
      '- 泣かせに行きすぎない',
      '- 同じ言葉を繰り返さない',
      '- 写真と思い出が主役',
      '- DRM型の感情導線を保つ',
      '- Hook、Memory、Meaning、Gratitude、Future、Afterglowの役割が重複しすぎないようにする',
      '',
      '## 重複チェック結果',
      results.map((item) => `- ${item.level}: ${item.message}`).join('\n'),
      '',
      '## スライド一覧',
      state.slides.map((slide, index) => [
        `### スライド${index + 1} ${slide.typeLabel || slide.kind}`,
        `- 感情役割: ${slide.emotionalRole}`,
        `- タイトル: ${slide.title || ''}`,
        `- サブタイトル: ${slide.subtitle || ''}`,
        `- メインメッセージ: ${slide.message || ''}`,
        `- キャプション: ${slide.caption || ''}`,
        `- 補足メッセージ: ${slide.supplemental || ''}`,
        `- エンディングコピー: ${slide.endingCopy || ''}`
      ].join('\n')).join('\n\n'),
      '',
      '## 依頼',
      '問題のあるスライドだけを対象に、変更前と変更後が分かる形で、上品な言い換え案を提案してください。'
    ].join('\n');
  }

  function textOfSlide(slide) {
    return [slide.title, slide.subtitle, slide.message, slide.caption, slide.supplemental, slide.endingCopy].join('\n');
  }

  function normalizeText(text) {
    return String(text || '').replace(/\s+/g, '').trim();
  }

  function similarity(a, b) {
    const left = new Set(normalizeText(a).split(''));
    const right = new Set(normalizeText(b).split(''));
    if (!left.size || !right.size) return 0;
    const intersection = Array.from(left).filter((char) => right.has(char)).length;
    return intersection / Math.max(left.size, right.size);
  }

  function renderAiButtons() {
    $('#promptButtons').innerHTML = window.AiPromptBuilder.PROMPT_TYPES.map(([type, label]) => (
      `<button class="secondary" data-prompt-type="${type}">${label}</button>`
    )).join('');
    $$('#promptButtons button').forEach((button) => {
      button.addEventListener('click', () => {
        $('#promptOutput').value = window.AiPromptBuilder.buildPrompt(button.dataset.promptType, state);
      });
    });
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        // Fall through to manual selection for stricter company PC settings.
      }
    }
    const textarea = $('#promptOutput');
    return copyTextFromElement(textarea);
  }

  function copyTextFromElement(textarea) {
    textarea.focus();
    textarea.select();
    return document.execCommand ? document.execCommand('copy') : false;
  }

  function bindPreview() {
    $('#firstSlideBtn').addEventListener('click', () => setSlide(0));
    $('#prevSlideBtn').addEventListener('click', () => setSlide(state.currentSlideIndex - 1));
    $('#nextSlideBtn').addEventListener('click', () => setSlide(state.currentSlideIndex + 1));
    $('#lastSlideBtn').addEventListener('click', () => setSlide(state.slides.length - 1));
    $('#playBtn').addEventListener('click', playSlides);
    $('#stopBtn').addEventListener('click', stopSlides);
    $('#fullscreenBtn').addEventListener('click', () => $('#slideStage').requestFullscreen?.());
    $('#pdfModeSelect').addEventListener('change', (event) => {
      state.pdfMode = event.target.value;
      renderPdfModeHint();
    });
    $('#exportQualitySelect').addEventListener('change', (event) => {
      state.exportQuality = event.target.value;
      renderPdfModeHint();
    });
    $('#imagePdfBtn').addEventListener('click', async () => {
      try {
        setExportStatus('info', '16:9画像PDFを作成しています。写真枚数が多い場合は少し時間がかかります。');
        state.slides = window.SlideBuilder.buildSlides(state);
        if (!confirmTextWarnings('16:9画像PDF出力')) return;
        await window.Exporter.exportImagePdf(state.slides, 'gratitude-photo-album.pdf', { quality: state.exportQuality });
        setExportStatus('success', '16:9画像PDFを保存しました。余白なしの上映・共有向けPDFです。');
      } catch (error) {
        setExportStatus('error', exportErrorMessage('画像PDF出力', error));
      }
    });
    $('#printBtn').addEventListener('click', () => {
      state.slides = window.SlideBuilder.buildSlides(state);
      renderSlides();
      if (!confirmTextWarnings('PDF出力')) return;
      printPdf();
    });
    $('#pptxBtn').addEventListener('click', async () => {
      try {
        setExportStatus('info', 'PPTXを作成しています。各スライドを画像化してPowerPointへ貼り付けます。');
        state.slides = window.SlideBuilder.buildSlides(state);
        if (!confirmTextWarnings('PPTX出力')) return;
        await window.Exporter.exportPptx(state.slides, 'gratitude-photo-album.pptx', { skipTextWarningConfirm: true, quality: state.exportQuality });
        setExportStatus('success', 'PPTXを保存しました。PowerPointで開いて上映確認してください。');
      } catch (error) {
        setExportStatus('error', exportErrorMessage('PPTX出力', error));
        alert(exportErrorMessage('PPTX出力', error));
      }
    });
    window.addEventListener('beforeprint', applyPrintModeClass);
    window.addEventListener('afterprint', clearPrintModeClass);
    document.addEventListener('keydown', (event) => {
      if (!$('#preview').classList.contains('active')) return;
      if (event.key === 'ArrowRight') setSlide(state.currentSlideIndex + 1);
      if (event.key === 'ArrowLeft') setSlide(state.currentSlideIndex - 1);
      if (event.code === 'Space') {
        event.preventDefault();
        state.playing ? stopSlides() : playSlides();
      }
    });
  }

  function renderPdfModeHint() {
    const select = $('#pdfModeSelect');
    const hint = $('#pdfModeHint');
    if (!select || !hint) return;
    select.value = state.pdfMode || '169';
    const qualitySelect = $('#exportQualitySelect');
    if (qualitySelect) qualitySelect.value = state.exportQuality || 'standard';
    const mode = PDF_MODES[state.pdfMode] || PDF_MODES['169'];
    const deps = window.Exporter?.checkExportDependencies?.('all');
    const libraryNote = deps
      ? `画像化は${deps.html2canvas ? 'html2canvas' : '内蔵レンダラー'}、PDFは${deps.jspdf ? 'jsPDF' : '内蔵PDF生成'}、PPTXは${deps.pptxgen ? 'PptxGenJS' : '内蔵PPTX生成'}を使います。`
      : '';
    hint.textContent = `${mode.label}：${mode.description} 余白を出したくない場合は、16:9画像PDFとして保存を使ってください。紙に印刷する場合は、ブラウザ印刷PDFを使ってください。${libraryNote}`;
  }

  function setExportStatus(type, message) {
    const box = $('#exportStatus');
    if (!box) return;
    box.hidden = false;
    box.className = `export-status no-print is-${type}`;
    box.textContent = message;
  }

  function exportErrorMessage(label, error) {
    const detail = error?.message || String(error || '');
    if (/memory|allocation|canvas|画像化|out of memory/i.test(detail)) {
      return `${label}に失敗しました。会社PCのブラウザでメモリ不足が発生した可能性があります。出力品質を「軽量」にして再試行してください。\n${detail}`;
    }
    if (/library|lib|読み込まれていません|undefined|PptxGen|html2canvas|jsPDF/i.test(detail)) {
      return `${label}に失敗しました。必要なライブラリが読み込まれていない可能性があります。lib フォルダ、または内蔵出力処理を確認してください。\n${detail}`;
    }
    return `${label}に失敗しました。写真の読み込み状態を確認し、必要なら出力品質を「軽量」にして再試行してください。\n${detail}`;
  }

  function printPdf() {
    applyPrintModeClass();
    window.print();
  }

  function applyPrintModeClass() {
    const mode = PDF_MODES[state.pdfMode] || PDF_MODES['169'];
    const classes = Object.values(PDF_MODES).map((item) => item.className);
    document.body.classList.remove(...classes);
    document.body.classList.add(mode.className);
  }

  function clearPrintModeClass() {
    document.body.classList.remove(...Object.values(PDF_MODES).map((item) => item.className));
  }

  function confirmTextWarnings(actionLabel) {
    const warnings = allTextWarnings();
    if (!warnings.length) return true;
    const slideNos = [...new Set(warnings.map((warning) => warning.slideNo))].join('、');
    const details = warnings.slice(0, 6).map((warning) => `スライド${warning.slideNo}：${warning.message}`).join('\n');
    return confirm(`文字が収まっていない可能性のあるスライドがあります。\nスライド${slideNos}を確認してください。\n\n${details}\n\nこのまま${actionLabel}しますか？`);
  }

  function renderSlides() {
    state.slides = window.SlideBuilder.buildSlides(state);
    setSlide(Math.min(state.currentSlideIndex, state.slides.length - 1));
    $('#printSlides').innerHTML = '';
    state.slides.forEach((slide) => $('#printSlides').appendChild(renderPrintPage(slide)));
    renderPdfModeHint();
  }

  function renderPrintPage(slide) {
    const page = document.createElement('section');
    page.className = 'print-page';
    page.appendChild(window.SlideRenderer.renderSlide(slide, { print: true }));
    return page;
  }

  function renderScaledSlide(slide, options = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = `slide-scale-wrapper slide-scale-${options.context || 'preview'}`;
    wrapper.dataset.slideId = slide.slideId || '';
    const inner = document.createElement('div');
    inner.className = 'slide-scale-inner';
    const rendered = window.SlideRenderer.renderSlide(slide, {
      showGuides: Boolean(options.showGuides),
      showPageNumber: options.showPageNumber,
      pageNumber: options.pageNumber
    });
    rendered.dataset.renderContext = options.context || 'preview';
    wrapper.dataset.textWarnings = rendered.dataset.textWarnings || '[]';
    inner.appendChild(rendered);
    wrapper.appendChild(inner);
    requestAnimationFrame(() => scaleSlideWrapper(wrapper));
    return wrapper;
  }

  function scaleRenderedSlides() {
    $$('.slide-scale-wrapper').forEach(scaleSlideWrapper);
  }

  function scaleSlideWrapper(wrapper) {
    const width = wrapper.clientWidth || 0;
    const scale = width / window.SlideRenderer.BASE_WIDTH;
    wrapper.style.setProperty('--slide-scale', String(scale || 1));
  }

  function setSlide(index) {
    if (!state.slides.length) return;
    state.currentSlideIndex = Math.max(0, Math.min(index, state.slides.length - 1));
    $('#slideStage').innerHTML = '';
    $('#slideStage').appendChild(renderScaledSlide(state.slides[state.currentSlideIndex], { context: 'stage' }));
    $('#slideCounter').textContent = `${state.currentSlideIndex + 1} / ${state.slides.length}`;
  }

  function playSlides() {
    stopSlides();
    state.playing = setInterval(() => {
      if (state.currentSlideIndex >= state.slides.length - 1) {
        stopSlides();
      } else {
        setSlide(state.currentSlideIndex + 1);
      }
    }, 5200);
  }

  function stopSlides() {
    if (state.playing) clearInterval(state.playing);
    state.playing = null;
  }

  function bindProjectActions() {
    $('#saveLightProjectBtn').addEventListener('click', async () => {
      const project = serializeProject(false);
      await window.StorageService.saveProject(project);
      window.StorageService.downloadJson(project, 'light');
    });
    $('#saveBackupProjectBtn').addEventListener('click', async () => {
      const photoCount = state.photos.length;
      if (photoCount >= 50) {
        const ok = confirm(`画像込みバックアップはファイルサイズが大きくなります。現在 ${photoCount} 枚の写真があります。保存を続けますか？`);
        if (!ok) return;
      }
      const project = serializeProject(true);
      await window.StorageService.saveProject(project);
      window.StorageService.downloadJson(project, 'with-images-backup');
    });
    [$('#projectFileInput'), $('#projectFileInputStart')].forEach((input) => {
      input.addEventListener('change', async () => {
        if (!input.files.length) return;
        try {
          const project = await window.StorageService.readProjectFile(input.files[0]);
          loadState(project);
          renderAll();
          showView('basic');
        } catch (error) {
          alert(error.message);
        }
      });
    });
    $('#exportMarkdownBtn').addEventListener('click', () => window.Exporter.exportMarkdown(state));
    $('#exportCsvBtn').addEventListener('click', () => window.Exporter.exportCsv(state));
  }

  function serializeProject(includeImages) {
    return {
      id: state.id,
      saveMode: includeImages ? 'with-images-backup' : 'light',
      imageDataIncluded: includeImages,
      creationMode: state.creationMode,
      basic: state.basic,
      themes: state.themes,
      photos: state.photos.map((photo) => serializePhoto(photo, includeImages)),
      manualSlides: state.manualSlides.map(serializeManualSlide),
      slideEdits: state.slideEdits,
      aiReturnText: state.aiReturnText,
      pdfMode: state.pdfMode,
      exportQuality: state.exportQuality
    };
  }

  function serializePhoto(photo, includeImages) {
    const base = {
      id: photo.id,
      fileName: photo.fileName,
      width: photo.width,
      height: photo.height,
      aspectRatio: photo.aspectRatio,
      caption: photo.caption,
      memo: photo.memo,
      importance: photo.importance,
      role: photo.role,
      use: photo.use,
      rotation: photo.rotation,
      themeId: photo.themeId
    };
    if (includeImages) {
      base.displaySrc = photo.displaySrc;
      base.thumbSrc = photo.thumbSrc;
    }
    return base;
  }

  function serializeManualSlide(slide) {
    const frameArchive = slide.frameArchive?.length ? slide.frameArchive : slide.frames;
    return {
      ...slide,
      slideType: slide.slideType,
      photoCount: slide.photoCount,
      frameLayoutId: slide.frameLayoutId,
      placeholderText: slide.placeholderText || '',
      frameData: slide.frames,
      frameArchive,
      assignedPhotoIds: (slide.frames || []).map((frame) => frame.photoId).filter(Boolean),
      photoPositionSettings: (slide.frames || []).reduce((settings, frame) => {
        settings[frame.frameId] = {
          fitMode: frame.fitMode,
          x: frame.x,
          y: frame.y,
          scale: frame.scale,
          rotation: frame.rotation
        };
        return settings;
      }, {}),
      textData: slide.autoText || {},
      manualText: slide.manualText || {},
      emotionRole: slide.emotionRole
    };
  }

  function loadState(project) {
    state.basic = { ...state.basic, ...(project.basic || {}) };
    state.themes = project.themes || state.themes;
    state.photos = (project.photos || []).map(normalizeLoadedPhoto);
    state.creationMode = project.creationMode || 'manual';
    state.manualSlides = (project.manualSlides || []).map(normalizeManualSlide);
    state.slideEdits = project.slideEdits || {};
    state.aiReturnText = project.aiReturnText || '';
    state.pdfMode = PDF_MODES[project.pdfMode] ? project.pdfMode : '169';
    state.exportQuality = ['light', 'standard', 'high'].includes(project.exportQuality) ? project.exportQuality : 'standard';
    state.currentThemeId = state.themes[0]?.id || null;
    $('#aiReturnText').value = state.aiReturnText;
    bindBasicForm();
    if (project.imageDataIncluded === false && state.photos.length) {
      alert('軽量JSONを読み込みました。写真のメモや構成は復元されますが、画像データは含まれていません。上映やPDF保存には、画像込みバックアップを読み込むか、写真を再度取り込んでください。');
    }
  }

  function normalizeManualSlide(slide) {
    const photoCount = normalizePhotoCountValue(slide.photoCount || '0');
    const loadedFrames = slide.frameArchive?.length ? slide.frameArchive : (slide.frames || slide.frameData || []);
    return createManualSlide({
      ...slide,
      photoCount,
      frameArchive: normalizeFrameArchive(loadedFrames, slide.slideId),
      frames: normalizeFrames(loadedFrames, photoCount, slide.slideId, slide.placeholderText || ''),
      manualText: slide.manualText || {},
      autoText: slide.autoText || slide.textData || {}
    });
  }

  function normalizeLoadedPhoto(photo) {
    return {
      id: photo.id || crypto.randomUUID(),
      fileName: photo.fileName || '名称未設定の写真',
      displaySrc: photo.displaySrc || '',
      thumbSrc: photo.thumbSrc || '',
      width: photo.width || 0,
      height: photo.height || 0,
      aspectRatio: photo.aspectRatio || 1,
      caption: photo.caption || '',
      memo: photo.memo || '',
      importance: photo.importance || 3,
      role: photo.role || '補助写真',
      use: photo.use !== false,
      rotation: photo.rotation || 0,
      themeId: photo.themeId || null
    };
  }

  function renderChecklist() {
    $('#checklistItems').innerHTML = checklist.map((item, index) => `
      <label class="check-item">
        <input type="checkbox">
        <span>${index + 1}. ${item}</span>
      </label>
    `).join('');
  }
})();
