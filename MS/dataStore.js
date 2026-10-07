/**
 * ========================================
 * 譜面台管理システム
 * データストア
 * ========================================
 *
 * 役割
 *
 * ・localStorageへのデータ保存
 * ・localStorageからのデータ読み込み
 * ・最終更新時刻の管理
 * ・キャッシュ期限の判定
 * ・必要に応じたGASからのデータ取得
 * ・強制更新
 *
 * GAS通信そのものは api.js に任せる。
 */


/**
 * ========================================
 * 内部設定
 * ========================================
 */


/**
 * 譜面台データ保存用キー
 */
const STORAGE_KEY_STAND_DATA =
  "standManagementData";


/**
 * 最終更新時刻保存用キー
 */
const STORAGE_KEY_LAST_UPDATED =
  "standManagementLastUpdated";


/**
 * ========================================
 * localStorage
 * ========================================
 */


/**
 * 譜面台データを保存
 *
 * @param {Array} data
 */
function saveStandData(data) {

  if (!Array.isArray(data)) {

    throw new Error(
      "保存する譜面台データが正しくありません"
    );

  }


  localStorage.setItem(
    STORAGE_KEY_STAND_DATA,
    JSON.stringify(data)
  );


  /**
   * データを保存した時刻ではなく、
   * 「GASから取得した時刻」を保存する。
   */
  localStorage.setItem(
    STORAGE_KEY_LAST_UPDATED,
    new Date().toISOString()
  );

}


/**
 * 譜面台データを取得
 *
 * @returns {Array|null}
 */
function loadStoredStandData() {

  const raw =
    localStorage.getItem(
      STORAGE_KEY_STAND_DATA
    );


  if (!raw) {
    return null;
  }


  try {

    const data =
      JSON.parse(raw);


    if (!Array.isArray(data)) {

      return null;

    }


    return data;

  } catch (error) {

    console.error(
      "保存データの読み込みに失敗しました:",
      error
    );


    return null;

  }

}


/**
 * 最終更新時刻を取得
 *
 * @returns {Date|null}
 */
function getLastUpdated() {

  const raw =
    localStorage.getItem(
      STORAGE_KEY_LAST_UPDATED
    );


  if (!raw) {

    return null;

  }


  const date =
    new Date(raw);


  if (Number.isNaN(
    date.getTime()
  )) {

    return null;

  }


  return date;

}


/**
 * 保存されているデータを削除
 *
 * 通常運用では使用しない。
 *
 * 開発・デバッグ用。
 */
function clearStoredStandData() {

  localStorage.removeItem(
    STORAGE_KEY_STAND_DATA
  );


  localStorage.removeItem(
    STORAGE_KEY_LAST_UPDATED
  );

}


/**
 * ========================================
 * キャッシュ判定
 * ========================================
 */


/**
 * 指定時間以上経過しているか
 *
 * @param {number} hours
 * @returns {boolean}
 */
function isCacheExpired(hours) {

  const lastUpdated =
    getLastUpdated();


  /**
   * 一度も取得していない
   */
  if (!lastUpdated) {

    return true;

  }


  const now =
    Date.now();


  const lastTime =
    lastUpdated.getTime();


  const elapsed =
    now - lastTime;


  const limit =
    hours *
    60 *
    60 *
    1000;


  return elapsed >= limit;

}


/**
 * 保存データが存在するか
 *
 * @returns {boolean}
 */
function hasStoredStandData() {

  const data =
    loadStoredStandData();


  return Array.isArray(data);

}


/**
 * ========================================
 * GASからの取得
 * ========================================
 */


/**
 * GASから譜面台一覧を取得して保存
 *
 * @returns {Promise<Array>}
 */
async function fetchAndStoreStandData() {

  const data =
    await getStandList();


  saveStandData(data);


  return data;

}


/**
 * ========================================
 * 通常データ取得
 * ========================================
 */


/**
 * 必要ならGASから更新して
 * 譜面台データを返す。
 *
 * 画面ごとに設定された
 * キャッシュ時間を使用する。
 *
 * @param {number} cacheHours
 * @returns {Promise<Array>}
 */
async function getStandData(
  cacheHours
) {

  /**
   * 保存データが存在しない
   *
   * → 必ず取得
   */
  if (!hasStoredStandData()) {

    return await fetchAndStoreStandData();

  }


  /**
   * キャッシュ期限切れ
   *
   * → GASから取得
   */
  if (
    isCacheExpired(
      cacheHours
    )
  ) {

    return await fetchAndStoreStandData();

  }


  /**
   * まだ有効
   *
   * → GAS通信しない
   */
  return loadStoredStandData();

}


/**
 * ========================================
 * 強制更新
 * ========================================
 */


/**
 * キャッシュ期限を無視して
 * GASから最新データを取得する。
 *
 * @returns {Promise<Array>}
 */
async function refreshStandData() {

  return await fetchAndStoreStandData();

}


/**
 * ========================================
 * データ検索
 * ========================================
 */


/**
 * 保存されている譜面台データから
 * IDで検索する。
 *
 * GAS通信は行わない。
 *
 * @param {string} id
 * @returns {object|null}
 */
function findStandById(
  id
) {

  if (!id) {

    return null;

  }


  const data =
    loadStoredStandData();


  if (!data) {

    return null;

  }


  const targetId =
    String(id)
      .trim()
      .toUpperCase();


  return (
    data.find(
      stand =>
        String(
          stand.ID || ""
        )
        .trim()
        .toUpperCase() ===
        targetId
    )
    || null
  );

}


/**
 * ========================================
 * データ更新
 * ========================================
 */


/**
 * 保存済みデータの中の
 * 譜面台1件を更新する。
 *
 * GAS通信は行わない。
 *
 * GASで更新成功したあとに呼び出す。
 *
 * @param {object} updatedStand
 */
function updateStoredStand(
  updatedStand
) {

  if (
    !updatedStand ||
    !updatedStand.ID
  ) {

    throw new Error(
      "更新する譜面台データが正しくありません"
    );

  }


  const data =
    loadStoredStandData();


  if (!data) {

    return;

  }


  const targetId =
    String(
      updatedStand.ID
    )
    .trim()
    .toUpperCase();


  const index =
    data.findIndex(
      stand =>
        String(
          stand.ID || ""
        )
        .trim()
        .toUpperCase() ===
        targetId
    );


  /**
   * 存在していれば置き換える
   */
  if (index !== -1) {

    data[index] =
      updatedStand;

  }


  /**
   * 存在しなければ追加
   *
   * 例えば別画面から新規登録した場合など。
   */
  else {

    data.push(
      updatedStand
    );

  }


  localStorage.setItem(
    STORAGE_KEY_STAND_DATA,
    JSON.stringify(data)
  );


  /**
   * 更新操作を行ったので、
   * このブラウザ上のデータは
   * 最新状態とみなす。
   */
  localStorage.setItem(
    STORAGE_KEY_LAST_UPDATED,
    new Date().toISOString()
  );

}


/**
 * ========================================
 * 新規追加データ
 * ========================================
 */


/**
 * 保存済みデータに
 * 新しく追加された譜面台を登録する。
 *
 * GAS通信は行わない。
 *
 * GASでadd成功したあとに呼び出す。
 *
 * @param {object} newStand
 */
function addStoredStand(
  newStand
) {

  if (
    !newStand ||
    !newStand.ID
  ) {

    throw new Error(
      "追加する譜面台データが正しくありません"
    );

  }


  const data =
    loadStoredStandData();


  /**
   * まだローカルデータがない場合
   *
   * → 今回は新しいデータだけ保存する。
   */
  if (!data) {

    saveStandData([
      newStand
    ]);

    return;

  }


  const targetId =
    String(
      newStand.ID
    )
    .trim()
    .toUpperCase();


  /**
   * 同じIDがすでに存在するか確認
   */
  const index =
    data.findIndex(
      stand =>
        String(
          stand.ID || ""
        )
        .trim()
        .toUpperCase() ===
        targetId
    );


  /**
   * 存在する場合は置き換え
   */
  if (index !== -1) {

    data[index] =
      newStand;

  }


  /**
   * 存在しない場合は追加
   */
  else {

    data.push(
      newStand
    );

  }


  localStorage.setItem(
    STORAGE_KEY_STAND_DATA,
    JSON.stringify(data)
  );


  localStorage.setItem(
    STORAGE_KEY_LAST_UPDATED,
    new Date().toISOString()
  );

}


/**
 * ========================================
 * 更新日時表示用
 * ========================================
 */


/**
 * 最終更新日時を画面表示用に整形
 *
 * 例：
 * 2026/10/08 00:15:32
 *
 * @returns {string}
 */
function getLastUpdatedText() {

  const date =
    getLastUpdated();


  if (!date) {

    return "未取得";

  }


  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() + 1
    )
    .padStart(2, "0");


  const day =
    String(
      date.getDate()
    )
    .padStart(2, "0");


  const hours =
    String(
      date.getHours()
    )
    .padStart(2, "0");


  const minutes =
    String(
      date.getMinutes()
    )
    .padStart(2, "0");


  const seconds =
    String(
      date.getSeconds()
    )
    .padStart(2, "0");


  return (
    year +
    "/" +
    month +
    "/" +
    day +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds
  );

}
