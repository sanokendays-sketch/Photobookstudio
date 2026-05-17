(function () {
  const DISPLAY_MAX_WIDTH = 1600;
  const THUMB_MAX_WIDTH = 320;
  const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  function isSupported(file) {
    return SUPPORTED_TYPES.includes(file.type);
  }

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`${file.name} は画像として読み込めませんでした。`));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error(`${file.name} の読み込みに失敗しました。`));
      reader.readAsDataURL(file);
    });
  }

  function resizeToDataUrl(img, maxWidth, quality = 0.86) {
    const ratio = Math.min(1, maxWidth / img.naturalWidth);
    const width = Math.round(img.naturalWidth * ratio);
    const height = Math.round(img.naturalHeight * ratio);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    return {
      dataUrl: canvas.toDataURL('image/jpeg', quality),
      width,
      height,
      aspectRatio: width / height
    };
  }

  async function processFiles(files, onProgress) {
    const sorted = Array.from(files).sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    const photos = [];
    const errors = [];

    for (let index = 0; index < sorted.length; index += 1) {
      const file = sorted[index];
      try {
        if (!isSupported(file)) {
          throw new Error(`${file.name} は対応形式ではありません。jpg / png / webp を使用してください。HEICはJPG変換を推奨します。`);
        }
        const img = await loadImage(file);
        const display = resizeToDataUrl(img, DISPLAY_MAX_WIDTH, 0.88);
        const thumb = resizeToDataUrl(img, THUMB_MAX_WIDTH, 0.78);
        photos.push({
          id: crypto.randomUUID(),
          fileName: file.name,
          displaySrc: display.dataUrl,
          thumbSrc: thumb.dataUrl,
          width: display.width,
          height: display.height,
          aspectRatio: display.aspectRatio,
          caption: '',
          memo: '',
          importance: 3,
          role: '補助写真',
          use: true,
          rotation: 0,
          themeId: null
        });
      } catch (error) {
        errors.push(error.message);
      }
      if (onProgress) onProgress(Math.round(((index + 1) / sorted.length) * 100));
    }

    return { photos, errors };
  }

  window.ImageProcessor = {
    processFiles
  };
})();
