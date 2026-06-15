/** Hide the server-rendered cover that prevents white flash on hard refresh. */
export function dismissSSRCover() {
  const cover = document.getElementById("__ssr_cover");
  if (!cover || cover.classList.contains("hidden")) return;
  cover.classList.add("hidden");
}
