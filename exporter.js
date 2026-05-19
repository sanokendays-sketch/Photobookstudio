(function () {
  function buildRows(state) {
    const slides = window.SlideBuilder.buildSlides(state);
    return slides.map((slide, index) => {
      const theme = state.themes.find((item) => item.id === slide.themeId);
      return {
        slideNo: index + 1,
        themeName: theme ? theme.title : slide.kind,
        layoutType: slide.layoutType,
        fileNames: (slide.photos || []).map((photo) => photo.fileName).join(' / '),
        captions: slide.caption || (slide.photos || []).map((photo) => photo.caption).filter(Boolean).join(' / '),
        message: slide.message || '',
        note: slide.title || ''
      };
    });
  }

  function exportCsv(state) {
    const header = ['スライド番号', 'テーマ名', 'レイアウトタイプ', '使用写真ファイル名', 'キャプション', 'テーマメッセージ', '備考'];
    const rows = buildRows(state).map((row) => [
      row.slideNo,
      row.themeName,
      row.layoutType,
      row.fileNames,
      row.captions,
      row.message,
      row.note
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
    download(`album-structure-${Date.now()}.csv`, '\ufeff' + csv, 'text/csv;charset=utf-8');
  }

  function exportMarkdown(state) {
    const lines = [
      `# ${state.basic.title || '感謝フォトアルバム'} 構成表`,
      '',
      '| スライド番号 | テーマ名 | レイアウトタイプ | 使用写真ファイル名 | キャプション | テーマメッセージ | 備考 |',
      '| --- | --- | --- | --- | --- | --- | --- |'
    ];
    buildRows(state).forEach((row) => {
      lines.push(`| ${row.slideNo} | ${md(row.themeName)} | ${md(row.layoutType)} | ${md(row.fileNames)} | ${md(row.captions)} | ${md(row.message)} | ${md(row.note)} |`);
    });
    download(`album-structure-${Date.now()}.md`, lines.join('\n'), 'text/markdown;charset=utf-8');
  }

  function csvEscape(value) {
    return `"${String(value || '').replace(/"/g, '""')}"`;
  }

  function md(value) {
    return String(value || '').replace(/\|/g, '/').replace(/\n/g, '<br>');
  }

  function download(fileName, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  window.Exporter = {
    exportCsv,
    exportMarkdown
  };
})();
