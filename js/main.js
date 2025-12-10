/**
 * ビューポートの設定を切り替え
 * 画面の幅が380px未満の場合：ビューポートを380pxに固定
 * それ以上の場合：デバイスの幅に基づいてビューポートを設定
 */
const switchViewport = () => {
  // ビューポート要素を取得
  const viewportMeta = document.querySelector('meta[name="viewport"]');

  // 条件に基づいて適用するビューポートの設定を決定
  const viewportContent =
    window.outerWidth > 380
      ? "width=device-width, initial-scale=1"
      : "width=380";

  // ビューポート要素が存在しない場合はreturn
  if (!viewportMeta) return;

  // 現在のビューポートの設定が目的の設定と異なる場合にのみ、新しい設定を適用します。
  if (viewportMeta.getAttribute("content") !== viewportContent) {
    viewportMeta.setAttribute("content", viewportContent);
  }
};
switchViewport();
window.addEventListener("resize", switchViewport);

/**
 * Accordionの説明
 */
const initializeAccordion = () => {
  console.log("accordion");
};
initializeAccordion();

/**
 * dropdownmenuの説明
 */
const initializeDropdownMenu = () => {
  console.log("dropdownmenu");
};
initializeDropdownMenu();

/**
 * hamburgermenuの説明
 */
const initializeHamburgerMenu = () => {
  console.log("hamburgermenu");
};
initializeHamburgerMenu();

/**
 * modalの説明
 */
const initializeModal = () => {
  const modal = document.querySelector(".js-modal");
  const openButton = document.querySelector(".js-modal-open-button");
  const closeButton = document.querySelector(".js-modal-close-button");

  // modal / openButton / closeButtonがページ内にない場合returnする
  if (!modal || !openButton || !closeButton) return;

  openButton.addEventListener("click", () => {
    console.log("modal");
  });
};
initializeModal();

/**
 * tabmenuの説明
 */
const initializeTabMenu = () => {
  console.log("tabmenu");
};
initializeTabMenu();
