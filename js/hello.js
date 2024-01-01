const onClick = async e => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  // ищем текущую активную вкладку
  chrome.tabs.remove(tab.id);
};

const btn = document.querySelector(".ok-button");
if (btn) {
  btn.addEventListener("click", onClick);
}
