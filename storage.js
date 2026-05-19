(function () {
  const DB_NAME = 'gratitude-photo-album-studio';
  const DB_VERSION = 1;
  const STORE = 'projects';

  function openDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveProject(project) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put({
        ...project,
        id: project.id || 'current',
        savedAt: new Date().toISOString()
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function loadProject(id = 'current') {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const request = tx.objectStore(STORE).get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  function downloadJson(project, label = 'project') {
    const safeProject = {
      ...project,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(safeProject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gratitude-photo-album-${label}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function readProjectFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          resolve(JSON.parse(reader.result));
        } catch (error) {
          reject(new Error('プロジェクトファイルを読み込めませんでした。JSON形式を確認してください。'));
        }
      };
      reader.onerror = () => reject(new Error('プロジェクトファイルの読み込みに失敗しました。'));
      reader.readAsText(file, 'utf-8');
    });
  }

  window.StorageService = {
    saveProject,
    loadProject,
    downloadJson,
    readProjectFile
  };
})();
