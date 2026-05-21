(function () {
  const LAYOUTS = [
    'Hero Layout',
    'Story Layout',
    'Mosaic Layout',
    'Gallery Layout',
    'Split Layout',
    'Message Layout',
    'Ending Layout',
    'Legacy Layout'
  ];

  const FRAME_LAYOUTS = {
    '0': [
      { id: 'text-center', label: '中央メッセージ', description: '言葉を中央に置き、余白で余韻を作ります。' },
      { id: 'text-left', label: '左寄せメッセージ', description: '落ち着いた語り出しに向いた配置です。' },
      { id: 'headline-short', label: '大見出し＋短文', description: '印象的な章タイトルや導入に使います。' },
      { id: 'cinematic-space', label: '余白多めの映画的レイアウト', description: '静かな感謝や締めの余韻に向いています。' }
    ],
    '1': [
      { id: 'one-full-caption', label: '全面写真', description: '1枚の写真を主役として大きく見せます。' },
      { id: 'text-top-image-bottom', label: 'Text Top / Image Bottom', description: '上にタイトルとメッセージ、下に1枚写真を置きます。' },
      { id: 'golden-legacy-text-first', label: 'Golden Legacy Text First', description: '黒背景、上部ゴールド文字、下部に額縁写真を置きます。' },
      { id: 'one-center-space', label: '中央写真', description: '上下に余白を取り、品よく見せます。' },
      { id: 'one-left-message', label: '左写真＋右メッセージ', description: '写真と言葉を同じ重さで見せます。' },
      { id: 'one-background-words', label: '背景写真＋言葉', description: '写真を薄く敷き、言葉を前面に置きます。' },
      { id: 'one-golden-frame', label: 'Golden Legacy 額縁', description: '黒とゴールドの額縁で印象的に見せます。' }
    ],
    '2': [
      { id: 'two-split-horizontal', label: '左右2分割', description: '2つの場面を対等に見せます。' },
      { id: 'text-top-two-images-bottom', label: 'Text Top / Two Images Bottom', description: '上に言葉、下に2枚写真を横並びで置きます。' },
      { id: 'two-split-vertical', label: '上下2分割', description: '上下の流れで場面を見せます。' },
      { id: 'two-main-sub', label: '大小2枚', description: '主役写真と補足写真を分けます。' },
      { id: 'two-before-after', label: 'メイン＋サブ', description: '変化や対比を自然に見せます。' }
    ],
    '3': [
      { id: 'three-main-left-two-right', label: '大1枚＋小2枚', description: '主役写真を大きく、補助写真で流れを作ります。' },
      { id: 'text-top-gallery-bottom', label: 'Text Top / Gallery Bottom', description: '上にメッセージ、下に3枚写真を均等に並べます。' },
      { id: 'three-row', label: '横並び3枚', description: '3つの場面を同じリズムで見せます。' },
      { id: 'three-column', label: '縦並び3枚', description: '落ち着いた時系列に向いています。' },
      { id: 'three-story', label: 'ストーリー順', description: '写真の流れを読みやすく配置します。' }
    ],
    '4': [
      { id: 'four-grid', label: '2×2グリッド', description: 'まとまりのある思い出を整えて見せます。' },
      { id: 'text-top-gallery-bottom-4', label: 'Text Top / 4 Image Gallery', description: '上に言葉、下に4枚写真を2×2で整列します。' },
      { id: 'four-main-three', label: '大1枚＋小3枚', description: '代表写真と周辺の場面を組み合わせます。' },
      { id: 'four-wide-bottom', label: '横長1枚＋下3枚', description: '広い場面と細かな表情を一緒に見せます。' },
      { id: 'four-golden-frames', label: 'Golden Legacy 4フレーム', description: '4枚を上品な額縁でそろえます。' }
    ],
    '5-8': [
      { id: 'multi-mosaic', label: 'モザイク', description: '複数の思い出をリズムよく見せます。' },
      { id: 'text-top-mosaic-bottom', label: 'Text Top / Mosaic Bottom', description: '上にメッセージ、下に5〜8枚写真を均一に並べます。' },
      { id: 'multi-gallery', label: 'ギャラリー', description: '写真を整然と並べて見せます。' },
      { id: 'multi-main-cluster', label: 'メイン写真＋小写真群', description: '主役写真を置きつつ、周辺の場面を添えます。' },
      { id: 'multi-collage', label: '思い出コラージュ', description: 'たくさんの場面を贈り物らしくまとめます。' }
    ],
    '9+': [
      { id: 'many-memory-wall', label: 'サムネイルウォール', description: '多くの写真を壁面のように見せます。' },
      { id: 'many-split-suggestion', label: '自動分割提案', description: '複数スライド化を検討するための配置です。' },
      { id: 'many-thumbnail-gallery', label: 'ギャラリー密集', description: '多めの写真を一覧性高く見せます。' },
      { id: 'many-random-collage', label: '複数スライド化推奨', description: '詰め込みすぎを避ける判断に使います。' }
    ]
  };

  function photoCountBucket(photoCount) {
    if (photoCount === '5-8' || photoCount === '9+') return photoCount;
    const count = Number(photoCount) || 0;
    if (count >= 9) return '9+';
    if (count >= 5) return '5-8';
    return String(count);
  }

  function frameCountForPhotoCount(photoCount) {
    const bucket = photoCountBucket(photoCount);
    if (bucket === '5-8') return 8;
    if (bucket === '9+') return 9;
    return Number(bucket) || 0;
  }

  function frameLayoutsForCount(photoCount) {
    return FRAME_LAYOUTS[photoCountBucket(photoCount)] || FRAME_LAYOUTS['1'];
  }

  function defaultFrameLayoutId(photoCount) {
    return frameLayoutsForCount(photoCount)[0].id;
  }

  function photoSelectionGuide(photoCount) {
    const bucket = photoCountBucket(photoCount);
    if (bucket === '0') return 'Message Layout: 写真なし、または少なめで言葉を主役にします。';
    if (bucket === '1') return 'Hero Layout: 主役として見せたい写真を1枚選んでください。';
    if (bucket === '2') return 'Split Layout: 対比や組み合わせを見せたい2枚を選んでください。';
    if (bucket === '3') return 'Story Layout: 流れが伝わる3枚を選んでください。';
    if (bucket === '5-8' || bucket === '9+') return 'Mosaic Layout: 同じテーマに属する写真を複数選んでください。';
    return 'Story Layout: 写真同士の関係が自然に伝わる組み合わせを選んでください。';
  }

  function isFrameLayoutValid(photoCount, frameLayoutId) {
    return frameLayoutsForCount(photoCount).some((layout) => layout.id === frameLayoutId);
  }

  function gridFrames(count, columns, x, y, w, h, gap) {
    const rows = Math.ceil(count / columns);
    const cellW = (w - gap * (columns - 1)) / columns;
    const cellH = (h - gap * (rows - 1)) / rows;
    return Array.from({ length: count }, (_, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      return { x: x + col * (cellW + gap), y: y + row * (cellH + gap), w: cellW, h: cellH };
    });
  }

  function textAreas(overrides = {}) {
    return {
      subtitle: { x: 0.12, y: 0.08, w: 0.76, h: 0.05 },
      title: { x: 0.12, y: 0.14, w: 0.76, h: 0.12 },
      message: { x: 0.13, y: 0.27, w: 0.74, h: 0.12 },
      supplemental: { x: 0.14, y: 0.40, w: 0.72, h: 0.08 },
      endingCopy: { x: 0.14, y: 0.80, w: 0.72, h: 0.08 },
      ...overrides
    };
  }

  function frameLayoutDefinition(layoutId, frameCount) {
    const count = frameCount || 1;
    const definitions = {
      'text-top-image-bottom': {
        frames: [{ x: 0.15, y: 0.43, w: 0.70, h: 0.42 }],
        textAreas: textAreas({ message: { x: 0.14, y: 0.26, w: 0.72, h: 0.11 } })
      },
      'golden-legacy-text-first': {
        variant: 'golden',
        frames: [{ x: 0.18, y: 0.46, w: 0.64, h: 0.38 }],
        textAreas: textAreas({ title: { x: 0.12, y: 0.11, w: 0.76, h: 0.12 }, message: { x: 0.16, y: 0.27, w: 0.68, h: 0.10 } })
      },
      'text-top-two-images-bottom': {
        frames: gridFrames(2, 2, 0.10, 0.45, 0.80, 0.38, 0.025),
        textAreas: textAreas()
      },
      'text-top-gallery-bottom': {
        frames: gridFrames(3, 3, 0.08, 0.45, 0.84, 0.36, 0.02),
        textAreas: textAreas()
      },
      'text-top-gallery-bottom-4': {
        frames: gridFrames(4, 2, 0.16, 0.42, 0.68, 0.44, 0.025),
        textAreas: textAreas({ message: { x: 0.14, y: 0.25, w: 0.72, h: 0.10 } })
      },
      'text-top-mosaic-bottom': {
        frames: gridFrames(count, count <= 6 ? 3 : 4, 0.08, 0.40, 0.84, 0.46, 0.018),
        textAreas: textAreas({ title: { x: 0.10, y: 0.09, w: 0.80, h: 0.10 }, message: { x: 0.13, y: 0.22, w: 0.74, h: 0.10 } })
      },
      'two-split-horizontal': { frames: gridFrames(2, 2, 0.08, 0.31, 0.84, 0.50, 0.025), textAreas: textAreas({ title: { x: 0.10, y: 0.10, w: 0.80, h: 0.10 }, message: { x: 0.12, y: 0.22, w: 0.76, h: 0.07 } }) },
      'three-story': { frames: gridFrames(3, 3, 0.08, 0.36, 0.84, 0.42, 0.02), textAreas: textAreas({ message: { x: 0.14, y: 0.24, w: 0.72, h: 0.08 } }) },
      'four-grid': { frames: gridFrames(4, 2, 0.18, 0.29, 0.64, 0.54, 0.025), textAreas: textAreas({ title: { x: 0.10, y: 0.08, w: 0.80, h: 0.09 }, message: { x: 0.14, y: 0.19, w: 0.72, h: 0.07 } }) },
      'four-golden-frames': { variant: 'golden', frames: gridFrames(4, 2, 0.17, 0.31, 0.66, 0.52, 0.03), textAreas: textAreas({ title: { x: 0.10, y: 0.08, w: 0.80, h: 0.10 }, message: { x: 0.14, y: 0.20, w: 0.72, h: 0.08 } }) },
      'multi-mosaic': { frames: gridFrames(count, count <= 6 ? 3 : 4, 0.07, 0.28, 0.86, 0.58, 0.018), textAreas: textAreas({ title: { x: 0.10, y: 0.07, w: 0.80, h: 0.09 }, message: { x: 0.13, y: 0.18, w: 0.74, h: 0.07 } }) },
      'multi-gallery': { frames: gridFrames(count, 3, 0.10, 0.30, 0.80, 0.54, 0.02), textAreas: textAreas({ title: { x: 0.10, y: 0.07, w: 0.80, h: 0.09 }, message: { x: 0.13, y: 0.18, w: 0.74, h: 0.07 } }) }
    };
    if (definitions[layoutId]) return definitions[layoutId];
    return {
      frames: gridFrames(count, count <= 1 ? 1 : count <= 4 ? 2 : 3, count <= 1 ? 0.16 : 0.10, count <= 1 ? 0.34 : 0.30, count <= 1 ? 0.68 : 0.80, count <= 1 ? 0.48 : 0.54, 0.025),
      textAreas: textAreas({ title: { x: 0.10, y: 0.08, w: 0.80, h: 0.10 }, message: { x: 0.13, y: 0.20, w: 0.74, h: 0.08 } })
    };
  }

  function chooseLayout(theme, photos, isLast) {
    const activePhotos = photos.filter((photo) => photo.use);
    const hero = activePhotos.find((photo) => photo.role === '主役写真' || Number(photo.importance) >= 5);
    const hasGroup = activePhotos.some((photo) => photo.role === '集合写真');
    const textHeavy = (theme.message || '').length > 90 || theme.messageVolume === '多め';

    if (isLast || theme.emotionalRole === '余韻') return 'Ending Layout';
    if (/歩み|功績|残して|legacy|レガシー/i.test(theme.title)) return 'Legacy Layout';
    if (theme.emotionalRole === '感謝' && textHeavy) return 'Message Layout';
    if (hero && !hasGroup) return 'Hero Layout';
    if (activePhotos.length <= 1 && textHeavy) return 'Split Layout';
    if (activePhotos.length >= 2 && activePhotos.length <= 4) return textHeavy ? 'Split Layout' : 'Story Layout';
    if (activePhotos.length >= 5 && activePhotos.length <= 12) return hasGroup ? 'Gallery Layout' : 'Mosaic Layout';
    if (activePhotos.length > 12) return 'Gallery Layout';
    return 'Message Layout';
  }

  function splitPhotosForSlides(photos, layoutType) {
    const active = photos.filter((photo) => photo.use);
    if (layoutType === 'Hero Layout' || layoutType === 'Split Layout' || layoutType === 'Legacy Layout') return chunk(active, 5);
    if (layoutType === 'Mosaic Layout') return chunk(active, 10);
    if (layoutType === 'Gallery Layout') return chunk(active, 12);
    if (layoutType === 'Story Layout') return chunk(active, 4);
    if (layoutType === 'Ending Layout') return chunk(active, 3);
    return chunk(active, 2);
  }

  function chunk(items, size) {
    if (!items.length) return [[]];
    const result = [];
    for (let i = 0; i < items.length; i += size) {
      result.push(items.slice(i, i + size));
    }
    return result;
  }

  function applyAutoLayouts(state) {
    state.themes.forEach((theme, index) => {
      const photos = state.photos.filter((photo) => photo.themeId === theme.id);
      theme.layoutType = chooseLayout(theme, photos, index === state.themes.length - 1);
    });
  }

  window.LayoutEngine = {
    LAYOUTS,
    FRAME_LAYOUTS,
    chooseLayout,
    splitPhotosForSlides,
    applyAutoLayouts,
    photoCountBucket,
    frameCountForPhotoCount,
    frameLayoutsForCount,
    defaultFrameLayoutId,
    photoSelectionGuide,
    isFrameLayoutValid,
    frameLayoutDefinition
  };
})();
