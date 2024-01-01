chrome.runtime.onInstalled.addListener(async () => {
  let url = chrome.runtime.getURL("html/hello.html");
  let tab = await chrome.tabs.create({ url });

  chrome.storage.sync.get(["showClock"], result => {
    console.log(result, `result`);
    // получаем значения из хранилища и востанавливаем настройки приложения по сохраненым данным
    if (result.showClock) {
      chrome.action.setBadgeText({ text: "ON" });
      // Если result.showClock является истинным, эта строка устанавливает текст значка расширения в "ON". Значок - это небольшой текст, отображаемый поверх значка расширения.
    }
  });

  chrome.storage.sync.get(["timer"], result => {
    console.log("result", result);
    if (!result.timer) {
      chrome.storage.sync.set({ timer: 1 });
      // устанавливаем значения в хранилище
      //
    }
  });
});
// вызывается после установки расширения и его обновления

chrome.commands.onCommand.addListener(command => {
  chrome.tabs.update({}, async tab => {
    debugger;
    if (command == "search-input") {
      execSearchInputScript(tab);
      function execSearchInputScript(tab) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          func: putText,
        });
      }

      function putText() {
        const titleSearchInput = document.getElementById("title-search-input");

        if (titleSearchInput) {
          const userInput = prompt("Insert your search query");

          titleSearchInput.value = userInput;
        } else {
          alert("Staleks search element not found");
          return;
        }
      }
    } else if (command == "copy-product-id") {
      execGrabProductIdScript(tab);
      function execGrabProductIdScript(tab) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          func: takeProductID,
        });
      }

      function takeProductID() {
        let productArticleElement = document.querySelector(
          ".product-page__article"
        );
        if (productArticleElement) {
          let spanElement = productArticleElement.querySelector("span");
          let spanText = spanElement.innerText || spanElement.textContent;
          navigator.clipboard.writeText(spanText);
          alert("succefuly copied:\n" + spanText);
        } else {
          alert("Staleks search element not found");
          return;
        }
      }
    } else if (command == "copy-product-title") {
      execGrabProductTitleScript(tab);
      function execGrabProductTitleScript(tab) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          func: takeProductTitle,
        });
      }

      function takeProductTitle() {
        let breadcrumbList = document.querySelector(".breadcrumb");
        if (breadcrumbList) {
          let lastLi = breadcrumbList.querySelector("li:last-child");
          let spanElement = lastLi.querySelector("span");
          let spanText = spanElement.textContent || spanElement.innerText;
          navigator.clipboard.writeText(spanText);
          alert("succefuly copied:\n" + spanText);
        } else {
          alert("Staleks Title element not found");
          return;
        }
      }
    } else if (command == "copy-product-description") {
      execGrabProductDescriptionScript(tab);
      function execGrabProductDescriptionScript(tab) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          func: takeProductDescription,
        });
      }

      function takeProductDescription() {
        let productBlock = document.querySelector(".product-block__inner");

        if (productBlock) {
          let textarea = document.createElement("textarea");
          textarea.value = productBlock.innerHTML;

          // Добавляем textarea на страницу (даже если он не виден)
          document.body.appendChild(textarea);
          // Выделяем весь текст внутри textarea
          textarea.select();
          // Копируем выделенный текст в буфер обмена
          document.execCommand("copy");
          // Удаляем временный элемент textarea
          document.body.removeChild(textarea);
          // Выводим сообщение об успешном копировании (опционально)
          setTimeout(() => {
            alert("The html element have been copied to the clipboard!");
          }, 100);
        } else {
          alert("Staleks Description element not found.");
        }
      }
    }
  });
});

function notify(message) {
  const notificationOptions = {
    type: "basic",
    title: "Staleks helper",
    message,
    iconUrl: chrome.runtime.getURL("icons/32.png"),
  };

  chrome.notifications.create(notificationOptions, notificationId => {
    // Automatically close the notification after 2000 milliseconds (2 seconds)
    setTimeout(() => {
      chrome.notifications.clear(notificationId, () => {});
    }, 2000);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action } = message;

  switch (action) {
    case "show title copy notification":
      notify("The title was successfully copied");
      break;

    case "show id copy notification":
      notify("The productID was successfully copied");
      break;

    case "show description copy notification":
      notify("The description was successfully copied");
      break;

    default:
      break;
  }
});
