// ------------------------ Search --------------------

const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tab = tabs[0];
    if (tab) {
      execSearchInputScript(tab);
    } else {
      alert("There are no active tabs");
    }
  });
});

function execSearchInputScript(tab) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id, allFrames: true },
      func: putText,
    },
    onSearchInputResult
  );
}

const putText = async () => {
  const titleSearchInput = document.getElementById("title-search-input");

  if (titleSearchInput) {
    const userInput = prompt("Insert your search query");

    titleSearchInput.value = userInput;
  } else {
    alert("Staleks search element not found");
    return;
  }
};

function onSearchInputResult() {
  // window is clossed
  window.close();
}

// ------------------------ Grab Product ID--------------------

const grabIDBtn = document.getElementById("grabIDBtn");

grabIDBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tab = tabs[0];
    if (tab) {
      execGrabProductIdScript(tab);
    } else {
      alert("There are no active tabs");
    }
  });
});

function execGrabProductIdScript(tab) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id, allFrames: true },
      func: takeProductID,
    },
    onProductIDResult
  );
}

function takeProductID() {
  console.log("takeProductId is called");
  let productArticleElement = document.querySelector(".product-page__article");
  if (productArticleElement) {
    let spanElement = productArticleElement.querySelector("span");
    let spanText = spanElement.innerText || spanElement.textContent;
    navigator.clipboard.writeText(spanText);
    alert("succefuly copied:\n" + spanText);
    // return [spanText];
  } else {
    alert("Staleks search element not found");
    return;
  }
}

function onProductIDResult(frames) {
  // alert close window before
  // if (!frames || frames.length === 0) {
  //   alert("Could not copy product id");
  //   return;
  // }
  // const spanTextArray = [];
  // // Обходим все фреймы и извлекаем значения
  // frames.forEach(frame => {
  //   if (frame.result && Array.isArray(frame.result)) {
  //     spanTextArray.push(...frame.result);
  //   }
  // });
  // if (spanTextArray.length > 0) {
  //   console.log("Values found:", spanTextArray.join(", "));
  //   const combinedText = spanTextArray.join("\n");
  //   navigator.clipboard.writeText(combinedText).then(() => {
  //     // alert("succefuly copied:\n" + combinedText);
  //     window.close();
  //   });
  // } else {
  //   console.error("No values found in frames");
  // }
}

// ------------------------ Grab Title--------------------

const grabTitleBtn = document.getElementById("grabTitleBtn");

grabTitleBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tab = tabs[0];
    if (tab) {
      execGrabProductTitleScript(tab);
    } else {
      alert("There are no active tabs");
    }
  });
});

function execGrabProductTitleScript(tab) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id, allFrames: true },
      func: takeProductTitle,
    },
    onProductTitleResult
  );
}

function takeProductTitle() {
  console.log("takeProductTitle is called");
  let breadcrumbList = document.querySelector(".breadcrumb");
  if (breadcrumbList) {
    let lastLi = breadcrumbList.querySelector("li:last-child");
    let spanElement = lastLi.querySelector("span");
    let spanText = spanElement.textContent || spanElement.innerText;
    navigator.clipboard.writeText(spanText);
    alert("succefuly copied:\n" + spanText);
    // return [spanText];
  } else {
    alert("Staleks Title element not found");
    return;
  }
}

function onProductTitleResult(frames) {
  // alert close window before
}

// ------------------------ Grab Description--------------------

const grabDescriptionBtn = document.getElementById("grabDescriptionBtn");

grabDescriptionBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tab = tabs[0];
    if (tab) {
      execGrabProductDescriptionScript(tab);
    } else {
      alert("There are no active tabs");
    }
  });
});

function execGrabProductDescriptionScript(tab) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id, allFrames: true },
      func: takeProductDescription,
    },
    onProducDescriptionResult
  );
}

function takeProductDescription() {
  console.log("takeProductDescription is called");
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

function onProducDescriptionResult(frames) {
  // alert close window before
}

// Grab images

const grabImgBtn = document.getElementById("grabImgBtn");
grabImgBtn.addEventListener("click", () => {
  // Получить активную вкладку браузера
  chrome.tabs.query({ active: true }, function (tabs) {
    var tab = tabs[0];
    if (tab) {
      execScript(tab);
    } else {
      alert("There are no active tabs");
    }
  });
});

function execScript(tab) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id, allFrames: true },
      func: grabImages,
    },
    onResult
  );
}

function grabImages() {
  const images = document.querySelectorAll("img");
  const imageUrls = Array.from(images).map(image => image.src);

  return imageUrls;
}

function onResult(frames) {
  if (!frames || !frames.length) {
    alert("Could not retrieve images from specified page");
    return;
  }
  const imageUrls = frames
    .map(frame => frame.result)
    .reduce((r1, r2) => r1.concat(r2));
  openImagesPage(imageUrls);
}

function openImagesPage(urls) {
  //  вначале деактивируем и потом активируем (чтобы сработал кода дальше)) открываем новую вкладку но не активируем ее сразу, чтобы сработал код
  chrome.tabs.create({ url: "html/page.html", active: false }, tab => {
    setTimeout(() => {
      // отправить список URL в новую вкладку (ловим в page.js)
      chrome.tabs.sendMessage(tab.id, urls, resp => {
        // сделать вкладку активной
        chrome.tabs.update(tab.id, { active: true });
      });
    }, 500);
  });
}
