/**
 * ========================================
 * 譜面台管理システム 共通設定
 * ========================================
 */


/**
 * 譜面台のタイプ一覧
 *
 * ※現在は仮で A / B
 * 実際の運用に合わせてここを書き換える
 *
 * 例：
 * [
 *   "A",
 *   "B",
 *   "C",
 *   "D"
 * ]
 */
const STAND_TYPES = [
  "A",
  "B"
];


/**
 * 管理パート一覧
 *
 * ここに追加・削除すれば、
 * 各画面のプルダウンに反映できる。
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


/**
 * 使用状況
 */
const USAGE_STATUS = [
  "空き",
  "使用中"
];


/**
 * 使用可否
 */
const AVAILABILITY_STATUS = [
  "可能",
  "注意",
  "不可"
];


/**
 * スプレッドシートのシート名
 */
const SHEET_NAME = "譜面台";


/**
 * GAS WebアプリURL
 *
 * ↓ここにWebアプリのURLを入れる
 */
const API_URL =
  "ここにWebアプリのURL";


/**
 * IDの数字部分の桁数
 *
 * A-001
 * A-002
 * A-003
 *
 * → 3桁
 */
const ID_NUMBER_DIGITS = 3;


/**
 * ========================================
 * 共通プルダウン設定
 * ========================================
 */


/**
 * select要素に選択肢をセット
 *
 * @param {string|HTMLElement} target
 * @param {string[]} items
 * @param {string} placeholder
 */
function populateSelect(
  target,
  items,
  placeholder = ""
) {

  const select =
    typeof target === "string"
      ? document.getElementById(target)
      : target;

  if (!select) {
    console.warn(
      "select要素が見つかりません:",
      target
    );

    return;
  }


  // 一旦クリア
  select.innerHTML = "";


  // プレースホルダー
  if (placeholder) {

    const option =
      document.createElement("option");

    option.value = "";
    option.textContent = placeholder;

    select.appendChild(option);
  }


  // 選択肢追加
  items.forEach(item => {

    const option =
      document.createElement("option");

    option.value = item;
    option.textContent = item;

    select.appendChild(option);

  });

}


/**
 * 譜面台タイプのプルダウンを設定
 */
function setupStandTypeSelect(
  target,
  placeholder = "タイプを選択"
) {

  populateSelect(
    target,
    STAND_TYPES,
    placeholder
  );

}


/**
 * 管理パートのプルダウンを設定
 */
function setupManagementPartSelect(
  target,
  placeholder = "管理パートを選択"
) {

  populateSelect(
    target,
    MANAGEMENT_PARTS,
    placeholder
  );

}


/**
 * 使用状況のプルダウンを設定
 */
function setupUsageStatusSelect(
  target,
  placeholder = "使用状況を選択"
) {

  populateSelect(
    target,
    USAGE_STATUS,
    placeholder
  );

}


/**
 * 使用可否のプルダウンを設定
 */
function setupAvailabilitySelect(
  target,
  placeholder = "使用可否を選択"
) {

  populateSelect(
    target,
    AVAILABILITY_STATUS,
    placeholder
  );

}
