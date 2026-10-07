/**
 * ========================================
 * 譜面台管理システム
 * 共通API通信
 * ========================================
 */


/**
 * GAS APIへリクエスト
 */
async function api(request) {

  const data = {
    ...request,
    sheet: SHEET_NAME
  };


  let response;


  try {

    response = await fetch(
      API_URL,
      {
        method: "POST",

        /*
         * application/json にすると
         * GAS WebアプリへのOPTIONS
         * preflightが発生するため、
         * text/plainで送信する。
         */
        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body:
          JSON.stringify(data)
      }
    );

  } catch (error) {

    console.error(
      "GAS通信エラー:",
      error
    );

    throw new Error(
      "GASとの通信に失敗しました"
    );

  }


  /**
   * HTTPエラー
   */
  if (!response.ok) {

    throw new Error(
      "サーバーエラー: HTTP " +
      response.status
    );

  }


  /**
   * JSON解析
   */
  let result;

  try {

    result =
      await response.json();

  } catch (error) {

    console.error(
      "JSON解析エラー:",
      error
    );

    throw new Error(
      "サーバーから正しいデータを受信できませんでした"
    );

  }


  /**
   * GAS側エラー
   */
  if (!result.success) {

    throw new Error(
      result.error ||
      "Unknown error"
    );

  }


  return result;

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
    cmd: "test"
  });

}


/**
 * 譜面台一覧取得
 */
async function getStandList() {

  const result =
    await api({
      cmd: "list"
    });

  return result.data || [];

}


/**
 * 譜面台1件取得
 */
async function getStandById(id) {

  if (!id) {

    throw new Error(
      "譜面台IDが指定されていません"
    );

  }


  const result =
    await api({
      cmd: "getById",
      id: id
    });


  return result.data;

}


/**
 * 譜面台追加
 *
 * @param {string} type
 * @param {object} data
 */
async function addStand(
  type,
  data
) {

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


  const result =
    await api({

      cmd: "add",

      type: type,

      data: data

    });


  return result.data;

}


/**
 * 譜面台更新
 *
 * IDは変更しない。
 */
async function updateStand(
  id,
  data
) {

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


  const result =
    await api({

      cmd: "update",

      id: id,

      data: data

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

    throw new Error(
      "タイプが指定されていません"
    );

  }


  const result =
    await api({

      cmd: "nextId",

      type: type

    });


  return result.data.id;

}
