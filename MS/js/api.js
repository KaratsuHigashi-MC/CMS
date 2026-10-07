/**
 * 譜面台管理システム
 * 共通API通信
 *
 * index.html
 * list.html
 * edit.html
 *
 * から共通して使用する。
 */


/* ==================================================
 * 設定
 * ================================================== */

/**
 * WebアプリのURL
 *
 * ↓ここを自分のWebアプリURLに変更
 */
const API_URL = "ここにWebアプリのURL";


/**
 * 使用するシート名
 */
const SHEET_NAME = "譜面台";


/* ==================================================
 * 基本通信
 * ================================================== */

/**
 * GAS Webアプリへリクエストを送信する
 *
 * @param {Object} request
 * @return {Promise<Object>}
 */
async function api(request) {

  // ----------------------------------------
  // シート名を自動設定
  // ----------------------------------------

  const data = {
    ...request,
    sheet: SHEET_NAME
  };


  // ----------------------------------------
  // POST
  // ----------------------------------------

  let response;

  try {

    response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)

    });

  } catch (error) {

    throw new Error(
      "GASとの通信に失敗しました"
    );

  }


  // ----------------------------------------
  // HTTPエラー
  // ----------------------------------------

  if (!response.ok) {

    throw new Error(
      "サーバーエラー: HTTP " + response.status
    );

  }


  // ----------------------------------------
  // JSON取得
  // ----------------------------------------

  let result;

  try {

    result = await response.json();

  } catch (error) {

    throw new Error(
      "サーバーから正しいデータを受信できませんでした"
    );

  }


  // ----------------------------------------
  // SCLib側エラー
  // ----------------------------------------

  if (!result.success) {

    throw new Error(
      result.error || "Unknown error"
    );

  }


  // ----------------------------------------
  // 成功
  // ----------------------------------------

  return result;

}


/* ==================================================
 * 接続確認
 * ================================================== */

/**
 * GASとの接続を確認
 *
 * @return {Promise<Object>}
 */
async function testApi() {

  return await api({
    cmd: "test"
  });

}


/* ==================================================
 * 譜面台一覧
 * ================================================== */

/**
 * 譜面台を全件取得
 *
 * @return {Promise<Array>}
 */
async function getStandList() {

  const result = await api({

    cmd: "list"

  });


  return result.data || [];

}


/* ==================================================
 * 譜面台1件取得
 * ================================================== */

/**
 * IDから譜面台を取得
 *
 * @param {string} id
 * @return {Promise<Object>}
 */
async function getStandById(id) {

  if (!id) {

    throw new Error(
      "譜面台IDが指定されていません"
    );

  }


  const result = await api({

    cmd: "getById",

    id: id

  });


  return result.data;

}


/* ==================================================
 * 譜面台追加
 * ================================================== */

/**
 * 新しい譜面台を追加
 *
 * @param {string} type
 * @param {Object} data
 * @return {Promise<Object>}
 */
async function addStand(type, data) {

  if (!type) {

    throw new Error(
      "タイプが指定されていません"
    );

  }


  if (!data) {

    throw new Error(
      "譜面台データがありません"
    );

  }


  const result = await api({

    cmd: "add",

    type: type,

    data: data

  });


  return result.data;

}


/* ==================================================
 * 譜面台更新
 * ================================================== */

/**
 * 譜面台情報を更新
 *
 * @param {string} id
 * @param {Object} data
 * @return {Promise<Object>}
 */
async function updateStand(id, data) {

  if (!id) {

    throw new Error(
      "譜面台IDが指定されていません"
    );

  }


  if (!data) {

    throw new Error(
      "更新データがありません"
    );

  }


  const result = await api({

    cmd: "update",

    id: id,

    data: data

  });


  return result.data;

}


/* ==================================================
 * 次のID取得
 * ================================================== */

/**
 * 指定タイプの次のIDを取得
 *
 * @param {string} type
 * @return {Promise<string>}
 */
async function getNextId(type) {

  if (!type) {

    throw new Error(
      "タイプが指定されていません"
    );

  }


  const result = await api({

    cmd: "nextId",

    type: type

  });


  return result.data.id;

}
