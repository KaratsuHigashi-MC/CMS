/**
 * ========================================
 * 譜面台管理システム
 * 共通API通信
 * ========================================
 */

let activeApiRequestCount = 0;

function ensureApiLoadingOverlay() {
  let overlay = document.getElementById("apiLoadingOverlay");

  if (overlay) {
    return overlay;
  }

  const style = document.createElement("style");

  style.textContent = `
    .api-loading-overlay {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: grid;
      place-items: center;
      background: rgba(70, 74, 78, 0.48);
      cursor: wait;
    }

    .api-loading-overlay[hidden] {
      display: none;
    }

    .api-loading-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 6px;
      background: #fff;
      color: #222;
      font: 600 14px sans-serif;
    }

    .api-loading-spinner {
      width: 36px;
      height: 36px;
      flex: 0 0 auto;
      border: 4px solid #d7dadd;
      border-top-color: #333;
      border-radius: 50%;
      animation: api-loading-spin 0.8s linear infinite;
    }

    @keyframes api-loading-spin {
      to { transform: rotate(360deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .api-loading-spinner { animation-duration: 1.8s; }
    }
  `;

  document.head.appendChild(style);

  overlay = document.createElement("div");
  overlay.id = "apiLoadingOverlay";
  overlay.className = "api-loading-overlay";
  overlay.hidden = true;
  overlay.setAttribute("role", "status");
  overlay.setAttribute("aria-live", "polite");

  const indicator = document.createElement("div");
  indicator.className = "api-loading-indicator";

  const spinner = document.createElement("span");
  spinner.className = "api-loading-spinner";
  spinner.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.textContent = "データを受信中...";

  indicator.append(spinner, text);
  overlay.appendChild(indicator);
  document.body.appendChild(overlay);

  return overlay;
}

function beginApiRequest() {
  activeApiRequestCount += 1;
  ensureApiLoadingOverlay().hidden = false;
}

function finishApiRequest() {
  activeApiRequestCount = Math.max(0, activeApiRequestCount - 1);

  const overlay = document.getElementById("apiLoadingOverlay");

  if (overlay && activeApiRequestCount === 0) {
    overlay.hidden = true;
  }
}

/**
 * GAS APIへリクエスト
 */
async function api(request) {
  const data = {
    ...request,
    sheet: SHEET_NAME,
  };

  beginApiRequest();

  try {
    let response;

    try {
      response = await fetch(API_URL, {
        method: "POST",

        /*
         * application/json にすると
         * GAS WebアプリへのOPTIONS
         * preflightが発生するため、
         * text/plainで送信する。
         */
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },

        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("GAS通信エラー:", error);

      throw new Error("GASとの通信に失敗しました");
    }

    /**
     * HTTPエラー
     */
    if (!response.ok) {
      throw new Error("サーバーエラー: HTTP " + response.status);
    }

    /**
     * JSON解析
     */
    let result;

    try {
      result = await response.json();
    } catch (error) {
      console.error("JSON解析エラー:", error);

      throw new Error("サーバーから正しいデータを受信できませんでした");
    }

    /**
     * GAS側エラー
     */
    if (!result.success) {
      throw new Error(result.error || "Unknown error");
    }

    return result;
  } finally {
    finishApiRequest();
  }
}

/**
 * ========================================
 * API
 * ========================================
 */

/**
 * API通信テスト
 */
async function testApi() {
  return await api({
    cmd: "test",
  });
}

/**
 * 譜面台一覧取得
 */
async function getStandList() {
  const result = await api({
    cmd: "list",
  });

  return result.data || [];
}

/**
 * 譜面台1件取得
 */
async function getStandById(id) {
  if (!id) {
    throw new Error("譜面台IDが指定されていません");
  }

  const result = await api({
    cmd: "getById",
    id: id,
  });

  return result.data;
}

/**
 * 譜面台追加
 *
 * @param {string} type
 * @param {object} data
 */
async function addStand(type, data) {
  if (!type) {
    throw new Error("タイプが指定されていません");
  }

  if (!data) {
    throw new Error("譜面台データがありません");
  }

  const result = await api({
    cmd: "add",

    type: type,

    data: data,
  });

  return result.data;
}

/**
 * 譜面台更新
 *
 * IDは変更しない。
 */
async function updateStand(id, data) {
  if (!id) {
    throw new Error("譜面台IDが指定されていません");
  }

  if (!data) {
    throw new Error("更新データがありません");
  }

  const result = await api({
    cmd: "update",

    id: id,

    data: data,
  });

  return result.data;
}

/**
 * 次のIDを取得
 *
 * ※これは表示用のプレビュー。
 * 実際の登録時のID生成は
 * GAS側で行う。
 */
async function getNextId(type) {
  if (!type) {
    throw new Error("タイプが指定されていません");
  }

  const result = await api({
    cmd: "nextId",

    type: type,
  });

  return result.data.id;
}
