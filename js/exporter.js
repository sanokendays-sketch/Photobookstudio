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

  async function exportPptx(slides, fileName = 'gratitude-photo-album.pptx') {
    if (!slides?.length) throw new Error('出力するスライドがありません。');
    const images = [];
    for (const slide of slides) {
      images.push(await slideToPng(slide));
    }
    const entries = buildPptxEntries(images);
    const blob = createZip(entries, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    saveBlob(fileName, blob);
  }

  async function slideToPng(slide) {
    const width = window.SlideRenderer.BASE_WIDTH;
    const height = window.SlideRenderer.BASE_HEIGHT;
    const node = window.SlideRenderer.renderSlide(slide, { exporting: true });
    node.style.width = `${width}px`;
    node.style.height = `${height}px`;
    node.style.position = 'fixed';
    node.style.left = '-10000px';
    node.style.top = '0';
    document.body.appendChild(node);
    await waitForImages(node);
    const css = Array.from(document.styleSheets).map((sheet) => {
      try {
        return Array.from(sheet.cssRules).map((rule) => rule.cssText).join('\n');
      } catch (error) {
        return '';
      }
    }).join('\n');
    const html = new XMLSerializer().serializeToString(node);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <style>${css}</style>
            ${html}
          </div>
        </foreignObject>
      </svg>
    `;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    const image = new Image();
    image.decoding = 'async';
    const loaded = new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error('スライド画像化に失敗しました。'));
    });
    image.src = url;
    await loaded;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    URL.revokeObjectURL(url);
    node.remove();
    const dataUrl = canvas.toDataURL('image/png');
    return base64ToUint8(dataUrl.split(',')[1]);
  }

  function waitForImages(node) {
    const images = Array.from(node.querySelectorAll('img'));
    return Promise.all(images.map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.onload = resolve;
        image.onerror = resolve;
      });
    }));
  }

  function buildPptxEntries(images) {
    const entries = [];
    const slideIds = images.map((_, index) => 256 + index);
    entries.push(['[Content_Types].xml', contentTypes(images.length)]);
    entries.push(['_rels/.rels', rootRels()]);
    entries.push(['docProps/app.xml', appProps(images.length)]);
    entries.push(['docProps/core.xml', coreProps()]);
    entries.push(['ppt/presentation.xml', presentationXml(slideIds)]);
    entries.push(['ppt/_rels/presentation.xml.rels', presentationRels(images.length)]);
    entries.push(['ppt/theme/theme1.xml', themeXml()]);
    entries.push(['ppt/slideMasters/slideMaster1.xml', slideMasterXml()]);
    entries.push(['ppt/slideMasters/_rels/slideMaster1.xml.rels', slideMasterRels()]);
    entries.push(['ppt/slideLayouts/slideLayout1.xml', slideLayoutXml()]);
    entries.push(['ppt/slideLayouts/_rels/slideLayout1.xml.rels', slideLayoutRels()]);
    images.forEach((image, index) => {
      const n = index + 1;
      entries.push([`ppt/slides/slide${n}.xml`, slideXml(n)]);
      entries.push([`ppt/slides/_rels/slide${n}.xml.rels`, slideRels(n)]);
      entries.push([`ppt/media/image${n}.png`, image]);
    });
    return entries;
  }

  function contentTypes(count) {
    const slides = Array.from({ length: count }, (_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join('');
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>${slides}</Types>`;
  }

  function rootRels() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`;
  }

  function appProps(count) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Gratitude Photo Album Studio</Application><PresentationFormat>On-screen Show (16:9)</PresentationFormat><Slides>${count}</Slides></Properties>`;
  }

  function coreProps() {
    const now = new Date().toISOString();
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Gratitude Photo Album</dc:title><dc:creator>Gratitude Photo Album Studio</dc:creator><cp:lastModifiedBy>Gratitude Photo Album Studio</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`;
  }

  function presentationXml(slideIds) {
    const ids = slideIds.map((id, index) => `<p:sldId id="${id}" r:id="rId${index + 2}"/>`).join('');
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>${ids}</p:sldIdLst><p:sldSz cx="12192000" cy="6858000" type="wide"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`;
  }

  function presentationRels(count) {
    const slides = Array.from({ length: count }, (_, i) => `<Relationship Id="rId${i + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`).join('');
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>${slides}</Relationships>`;
  }

  function slideXml(n) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr><p:pic><p:nvPicPr><p:cNvPr id="2" name="Slide ${n}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="rId2"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="12192000" cy="6858000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
  }

  function slideRels(n) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${n}.png"/></Relationships>`;
  }

  function themeXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Gratitude"><a:themeElements><a:clrScheme name="Gratitude"><a:dk1><a:srgbClr val="000000"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F1F1F"/></a:dk2><a:lt2><a:srgbClr val="F8F1DF"/></a:lt2><a:accent1><a:srgbClr val="D8B766"/></a:accent1><a:accent2><a:srgbClr val="F0D98C"/></a:accent2><a:accent3><a:srgbClr val="B8AE99"/></a:accent3><a:accent4><a:srgbClr val="7F6B36"/></a:accent4><a:accent5><a:srgbClr val="40351F"/></a:accent5><a:accent6><a:srgbClr val="EFE8D7"/></a:accent6><a:hlink><a:srgbClr val="D8B766"/></a:hlink><a:folHlink><a:srgbClr val="B8AE99"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Yu Gothic"/></a:majorFont><a:minorFont><a:latin typeface="Yu Gothic"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>`;
  }

  function slideMasterXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>`;
  }

  function slideMasterRels() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>`;
  }

  function slideLayoutXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`;
  }

  function slideLayoutRels() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`;
  }

  function csvEscape(value) {
    return `"${String(value || '').replace(/"/g, '""')}"`;
  }

  function md(value) {
    return String(value || '').replace(/\|/g, '/').replace(/\n/g, '<br>');
  }

  function download(fileName, content, type) {
    const blob = new Blob([content], { type });
    saveBlob(fileName, blob);
  }

  function saveBlob(fileName, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  function base64ToUint8(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function createZip(entries, type) {
    const encoder = new TextEncoder();
    const files = entries.map(([name, content]) => {
      const data = content instanceof Uint8Array ? content : encoder.encode(content);
      return { name, data, crc: crc32(data) };
    });
    const chunks = [];
    const central = [];
    let offset = 0;
    files.forEach((file) => {
      const nameBytes = encoder.encode(file.name);
      const local = new Uint8Array(30 + nameBytes.length);
      const view = new DataView(local.buffer);
      view.setUint32(0, 0x04034b50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 0, true);
      view.setUint16(8, 0, true);
      view.setUint16(10, 0, true);
      view.setUint16(12, 0, true);
      view.setUint32(14, file.crc, true);
      view.setUint32(18, file.data.length, true);
      view.setUint32(22, file.data.length, true);
      view.setUint16(26, nameBytes.length, true);
      local.set(nameBytes, 30);
      chunks.push(local, file.data);

      const header = new Uint8Array(46 + nameBytes.length);
      const h = new DataView(header.buffer);
      h.setUint32(0, 0x02014b50, true);
      h.setUint16(4, 20, true);
      h.setUint16(6, 20, true);
      h.setUint16(8, 0, true);
      h.setUint16(10, 0, true);
      h.setUint16(12, 0, true);
      h.setUint16(14, 0, true);
      h.setUint32(16, file.crc, true);
      h.setUint32(20, file.data.length, true);
      h.setUint32(24, file.data.length, true);
      h.setUint16(28, nameBytes.length, true);
      h.setUint32(42, offset, true);
      header.set(nameBytes, 46);
      central.push(header);
      offset += local.length + file.data.length;
    });
    const centralSize = central.reduce((sum, item) => sum + item.length, 0);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(8, files.length, true);
    endView.setUint16(10, files.length, true);
    endView.setUint32(12, centralSize, true);
    endView.setUint32(16, offset, true);
    return new Blob([...chunks, ...central, end], { type });
  }

  function crc32(data) {
    let crc = -1;
    for (let i = 0; i < data.length; i += 1) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i += 1) {
      let c = i;
      for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[i] = c >>> 0;
    }
    return table;
  })();

  window.Exporter = {
    exportCsv,
    exportMarkdown,
    exportPptx
  };
})();
