/**
 * 譜面台管理システム
 * 共通設定
 *
 * index.html
 * list.html
 * edit.html
 *
 * すべての画面から読み込んで使用する。
 */


/* ==================================================
 * 譜面台タイプ
 * ==================================================
 *
 * ここに存在するタイプを登録する。
 *
 * A・Bは一時的な分類なので、
 * 必要に応じて自由に追加・削除する。
 *
 * 例：
 *
 * "A"
 * "B"
 * "C"
 *
 * など。
 */

const STAND_TYPES = [
  "A",
  "B"
];


/* ==================================================
 * 管理パート
 * ==================================================
 *
 * 譜面台を管理するパート。
 *
 * ここに追加したものが
 * 各画面のプルダウンに反映される。
 */

const MANAGEMENT_PARTS = [
  "Fl",
  "Ob",
  "Cl",
  "Fg",
  "Sax",
  "Tp",
  "Hr",
  "Tb",
  "Euph",
  "Tuba",
  "Perc",
  "String",
  "Other"
];


/* ==================================================
 * 使用状況
 * ==================================================
 */

const USAGE_STATUS = [
  "空き",
  "使用中"
];


/* ==================================================
 * 使用可否
 * ==================================================
 */

const AVAILABILITY_STATUS = [
  "可能",
  "注意",
  "不可"
];


/* ==================================================
 * シート設定
 * ==================================================
 */

const SHEET_NAME = "譜面台";


/* ==================================================
 * API設定
 * ==================================================
 *
 * GAS WebアプリのURL。
 */

const API_URL =
  "ここにWebアプリのURL";


/* ==================================================
 * ID設定
 * ==================================================
 *
 * IDの番号部分。
 *
 * 例：
 *
 * A-001
 * A-002
 * A-003
 *
 * のように3桁で表示する。
 */

const ID_NUMBER_DIGITS = 3;


/* ==================================================
 * 共通ヘルパー
 * ==================================================
 */


/**
 * 配列からselect要素のoptionを生成する
 *
 * @param {HTMLSelectElement} select
 * @param {Array<string>} items
 * @param {string} placeholder
 */
function populateSelect(
  select,
  items,
  placeholder = "選択してください"
) {

  if (!select) {
    return;
  }


  // ----------------------------------------
  // 一旦クリア
  // ----------------------------------------

  select.innerHTML = "";


  // ----------------------------------------
  // プレースホルダー
  // ----------------------------------------

  if (placeholder !== null) {

    const option =
      document.createElement("option");

    option.value = "";

    option.textContent =
      placeholder;

    select.appendChild(option);

  }


  // ----------------------------------------
  // 選択肢
  // ----------------------------------------

  items.forEach(function(item) {

    const option =
      document.createElement("option");

    option.value = item;

    option.textContent = item;

    select.appendChild(option);

  });

}


/**
 * 譜面台タイプのselectを設定
 *
 * @param {HTMLSelectElement} select
 */
function setupStandTypeSelect(select) {

  populateSelect(
    select,
    STAND_TYPES,
    "選択してください"
  );

}


/**
 * 管理パートのselectを設定
 *
 * @param {HTMLSelectElement} select
 */
function setupManagementPartSelect(select) {

  populateSelect(
    select,
    MANAGEMENT_PARTS,
    "選択してください"
  );

}


/**
 * 使用状況のselectを設定
 *
 * @param {HTMLSelectElement} select
 */
function setupUsageStatusSelect(select) {

  populateSelect(
    select,
    USAGE_STATUS,
    null
  );

}


/**
 * 使用可否のselectを設定
 *
 * @param {HTMLSelectElement} select
 */
function setupAvailabilitySelect(select) {

  populateSelect(
    select,
    AVAILABILITY_STATUS,
    null
  );

}
