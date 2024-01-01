const cssUrl = chrome.runtime.getURL("/css/content-script.css");

// ------------------------ Grab Title--------------------

const TitleWrapper = document.querySelector(".breadcrumb");
if (TitleWrapper) {
  const titleRoot = document.createElement("div");
  titleRoot.style.position = "relative";
  const shadowTitleRoot = titleRoot.attachShadow({ mode: "open" });

  shadowTitleRoot.innerHTML = `<link rel="stylesheet" href=${cssUrl} />`;
  // обворачиваем в шадов дом елемент (чтобы стили сайта не применялись к нашей кнопки)
  const copyTitleBtn = document.createElement("button");
  copyTitleBtn.className = "title_btn";
  copyTitleBtn.innerText = "Copy";
  copyTitleBtn.type = "button";

  shadowTitleRoot.prepend(copyTitleBtn);
  TitleWrapper.prepend(titleRoot);

  let lastLi = document
    .querySelector(".breadcrumb")
    .querySelector("li:last-child");

  let titleSpanElement = lastLi.querySelector("span");

  copyTitleBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(titleSpanElement.innerText);
      chrome.runtime.sendMessage({ action: "show title copy notification" });
    } catch (error) {
      console.log(error);
    }
  });
}

// ------------------------ Grab Product ID--------------------

const IdWrapper = document.querySelector(".product-page__info-top");

if (IdWrapper) {
  const idRoot = document.createElement("div");
  idRoot.style.position = "relative";
  const shadowIdRoot = idRoot.attachShadow({ mode: "open" });

  shadowIdRoot.innerHTML = `<link rel="stylesheet" href=${cssUrl} />`;
  // обворачиваем в шадов дом елемент (чтобы стили сайта не применялись к нашей кнопки)
  const copyIdBtn = document.createElement("button");
  copyIdBtn.className = "id_btn";
  copyIdBtn.innerText = "Copy";
  copyIdBtn.type = "button";

  shadowIdRoot.prepend(copyIdBtn);
  IdWrapper.prepend(idRoot);

  let productArticleElement = document.querySelector(".product-page__article");
  let IdSpanElement = productArticleElement.querySelector("span");

  copyIdBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(IdSpanElement.innerText);
      chrome.runtime.sendMessage({ action: "show id copy notification" });
    } catch (error) {
      console.log(error);
    }
  });
}

// ------------------------ Grab Description--------------------

const DescriptionWrapper = document.querySelector(
  ".product-block__title.product-acardion__title"
);

if (DescriptionWrapper) {
  const descrRoot = document.createElement("div");
  descrRoot.style.position = "relative";
  const shadowDescrRoot = descrRoot.attachShadow({ mode: "open" });

  shadowDescrRoot.innerHTML = `<link rel="stylesheet" href=${cssUrl} />`;
  // обворачиваем в шадов дом елемент (чтобы стили сайта не применялись к нашей кнопки)
  const copyDescrBtn = document.createElement("button");
  copyDescrBtn.className = "descr_btn";
  copyDescrBtn.innerText = "Copy";
  copyDescrBtn.type = "button";

  shadowDescrRoot.prepend(copyDescrBtn);
  DescriptionWrapper.prepend(descrRoot);

  let productBlock = document.querySelector(".product-block__inner");
  let textarea = document.createElement("textarea");
  textarea.value = productBlock.innerHTML;

  copyDescrBtn.addEventListener("click", async () => {
    try {
      // Добавляем textarea на страницу (даже если он не виден)
      document.body.appendChild(textarea);
      // Выделяем весь текст внутри textarea
      textarea.select();
      // Копируем выделенный текст в буфер обмена
      document.execCommand("copy");
      // Удаляем временный элемент textarea
      document.body.removeChild(textarea);
      // Выводим сообщение об успешном копировании (опционально)
      // await navigator.clipboard.writeText(IdSpanElement.innerText);
      chrome.runtime.sendMessage({
        action: "show description copy notification",
      });
    } catch (error) {
      console.log(error);
    }
  });
}

// // ------------------------ Search --------------------

// const searchRoot = document.createElement("div");
// searchRoot.style.position = "relative";
// const shadowSearchRoot = searchRoot.attachShadow({ mode: "open" });

// shadowSearchRoot.innerHTML = `<link rel="stylesheet" href=${cssUrl} />`;
// // обворачиваем в шадов дом елемент (чтобы стили сайта не применялись к нашей кнопки)
// const searchBtn = document.createElement("button");
// searchBtn.className = "descr_btn";
// searchBtn.innerText = "Copy";
// searchBtn.type = "button";

// shadowSearchRoot.prepend(searchBtn);
// document.querySelector(".bx-searchtitle").prepend(descrRoot);

// const titleSearchInput = document.getElementById("title-search-input");

// copyDescrBtn.addEventListener("click", async () => {
//   try {
//     const userInput = prompt("Insert your search query");
//     titleSearchInput.value = userInput;
//   } catch (error) {
//     console.log(error);
//   }
// });
