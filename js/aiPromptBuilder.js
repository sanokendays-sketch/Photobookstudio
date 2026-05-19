(function () {
  const PROMPT_TYPES = [
    ['starter', 'スターターパッケージ10枚構成 調整プロンプト'],
    ['story', 'DRM型 全体ストーリー設計プロンプト'],
    ['cover', 'DRM型 表紙コピー生成プロンプト'],
    ['chapter', 'DRM型 章タイトル生成プロンプト'],
    ['caption', 'DRM型 キャプション生成プロンプト'],
    ['gratitude', 'DRM型 感謝メッセージ生成プロンプト'],
    ['respectCheck', '失礼チェックプロンプト'],
    ['rehearsalCheck', '本番上映前チェックプロンプト']
  ];

  function buildPrompt(type, state) {
    const title = PROMPT_TYPES.find((item) => item[0] === type)?.[1] || 'プロンプト';
    return [
      `# ${title}`,
      '',
      'あなたは、会社の役職者への送別フォトアルバムを、敬意と感謝が伝わる文章に整える編集者です。',
      '売り込みや煽りではなく、DRM型の構成力を「感謝を自然に届ける」ために使ってください。',
      '',
      '## DRM型 感謝メッセージ構成',
      '1. Hook: 最初の一文で心を止める',
      '2. Empathy: 見ている人の気持ちを代弁する',
      '3. Memory: 具体的な場面を思い出させる',
      '4. Meaning: その出来事の意味を言語化する',
      '5. Gratitude: 感謝をまっすぐ伝える',
      '6. Future: 新天地へのエールで締める',
      '7. Afterglow: 余韻を残す',
      '',
      '## 基本情報',
      infoBlock(state.basic),
      '',
      '## テーマ一覧',
      themeBlock(state),
      '',
      '## スライド構成',
      slideBlock(state),
      '',
      '## 写真情報',
      photoBlock(state),
      '',
      '## 伝えたい感情',
      '敬意、感謝、あたたかさ、現場に残してくださったものへの実感、前向きな送り出し。',
      '',
      '## 避けたい表現',
      state.basic.avoidExpressions || '上から目線、軽すぎる言い回し、内輪ネタが強い表現、泣かせに行きすぎる表現。',
      '',
      instructionFor(type)
    ].join('\n');
  }

  function infoBlock(info) {
    return [
      `- アルバムの目的: ${info.purpose || ''}`,
      `- 贈る相手: ${info.recipient || ''}`,
      `- 役職: ${info.position || ''}`,
      `- 日付: ${info.date || ''}`,
      `- 作成者: ${info.creator || ''}`,
      `- 全体トーン: ${info.tone || ''}`,
      `- 感謝メッセージ下書き: ${info.gratitudeMessage || ''}`
    ].join('\n');
  }

  function themeBlock(state) {
    return state.themes.map((theme, index) => [
      `${index + 1}. ${theme.title}`,
      `   - 感情的役割: ${theme.emotionalRole}`,
      `   - レイアウト: ${theme.layoutType}`,
      `   - メッセージ: ${theme.message || ''}`
    ].join('\n')).join('\n');
  }

  function slideBlock(state) {
    if (state.creationMode !== 'manual' || !state.manualSlides?.length) {
      return 'まだ手動スライド構成はありません。';
    }
    return state.manualSlides.map((slide, index) => [
      `${index + 1}. ${slide.autoText?.title || `スライド${index + 1}`}`,
      `   - スライド種別: ${slideTypeLabel(slide.slideType)}`,
      `   - 感情役割: ${slide.emotionRole || ''}`,
      `   - レイアウト: ${slide.layoutType || ''}`,
      `   - 写真枚数: ${slide.photoCount || '0'}`,
      `   - フレーム配置: ${slide.frameLayoutId || ''}`,
      `   - 仮サブタイトル: ${slide.autoText?.subtitle || ''}`,
      `   - 仮メッセージ: ${slide.autoText?.message || ''}`,
      `   - 仮キャプション: ${slide.autoText?.caption || ''}`,
      `   - 写真プレースホルダー: ${placeholderText(slide)}`
    ].join('\n')).join('\n');
  }

  function slideTypeLabel(type) {
    const map = {
      cover: '表紙',
      intro: '導入',
      theme: 'テーマ',
      photo: '写真',
      photoMessage: '写真＋メッセージ',
      themeMessage: 'テーマメッセージ',
      gratitude: '感謝',
      cheer: 'エール',
      ending: 'エンディング'
    };
    return map[type] || type || '写真';
  }

  function placeholderText(slide) {
    if (Array.isArray(slide.placeholderText)) return slide.placeholderText.join(' / ');
    return slide.placeholderText || (slide.frames || []).map((frame) => frame.placeholderText).filter(Boolean).join(' / ');
  }

  function photoBlock(state) {
    return state.photos.map((photo) => {
      const theme = state.themes.find((item) => item.id === photo.themeId);
      return `- ${photo.fileName} / テーマ: ${theme ? theme.title : '未整理'} / 役割: ${photo.role} / 重要度: ${photo.importance} / メモ: ${photo.memo || ''} / キャプション案: ${photo.caption || ''}`;
    }).join('\n');
  }

  function instructionFor(type) {
    const common = '職場で失礼がなく、役職者への敬意があり、読み上げても自然な日本語で提案してください。';
    const map = {
      story: '全体の章立て、導入、感情の流れ、最後の余韻までを設計してください。',
      starter: '以下の10枚構成を、職場の送別フォトアルバムとして、DRM型の感情導線を保ちながら、言葉の重複を避けて整えてください。各スライドの役割は残しつつ、タイトル、メッセージ、キャプション案を上品に改善してください。',
      cover: '表紙コピーを10案ください。短く、品があり、映画的な余白を感じる表現にしてください。',
      chapter: '各テーマの章タイトルを、写真アルバムに入れやすい長さで提案してください。',
      caption: '各写真のメモをもとに、短く自然なキャプション案を作ってください。',
      gratitude: '最後の感謝メッセージを、丁寧で前向きな文章に整えてください。',
      respectCheck: '上から目線でないか、軽すぎないか、泣かせに行きすぎていないか、内輪ネタが強すぎないか、役職者への敬意があるか、異動先への表現が自然か、名前や役職に誤りがないか、誤字脱字がないか、感謝が伝わるか、最後が前向きに終わっているかをチェックし、修正案を出してください。',
      rehearsalCheck: '本番上映前の確認観点として、構成、文章、写真、上映操作、PDF保存、予備ファイル準備のリスクをチェックしてください。'
    };
    return `## 依頼\n${map[type] || map.story}\n${common}`;
  }

  window.AiPromptBuilder = {
    PROMPT_TYPES,
    buildPrompt
  };
})();
