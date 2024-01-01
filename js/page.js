// За прием сообщений отвечает событие chrome.runtime.onMessage, позволяет установить функцию для реакции на новые сообщения
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  addImagesToContainer(message);
  sendResponse("OK");
  // Функция, которую можно вызвать, чтобы отправить ответ объекту отправителю
});

function addImagesToContainer(urls) {
  if (!urls || !urls.length) {
    return;
  }
  const container = document.querySelector(".container");
  urls.forEach(url => addImageNode(container, url));
}

function addImageNode(container, url) {
  const div = document.createElement("div");
  div.className = "imageDiv";
  const img = document.createElement("img");
  img.src = url;
  div.appendChild(img);
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.setAttribute("url", url);
  div.appendChild(checkbox);
  container.appendChild(div);
}

// ставит все вкл
document.getElementById("selectAll").addEventListener("change", event => {
  const items = document.querySelectorAll(".container input");
  for (let item of items) {
    item.checked = event.target.checked;
  }
});

document.getElementById("downloadBtn").addEventListener("click", async () => {
  try {
    const urls = getSelectedUrls();
    const archive = await createArchive(urls);
    downloadArchive(archive);
  } catch (err) {
    alert(err.message);
  }
});

function getSelectedUrls() {
  // TODO: Получить список всех включенных флажков,
  // извлечь из каждого из них значение атрибута "url"
  // и вернуть массив этих значений

  const urls = Array.from(document.querySelectorAll(".container input"))
    .filter(item => item.checked)
    .map(item => item.getAttribute("url"));
  if (!urls || !urls.length) {
    throw new Error("Please, select at least one image");
  }
  return urls;
}

async function createArchive(urls) {
  // TODO: Создать пустой ZIP-архив, затем используя
  // массив "urls", скачать каждое изображение, поместить
  // его в виде файла в этот ZIP-архив и в конце
  // вернуть этот ZIP-архив
  const zip = new JSZip();
  for (let index in urls) {
    try {
      const url = urls[index];
      console.log(url, `url`);
      const response = await fetch(url, { mode: "no-cors" });
      // const response = await fetch(url);
      console.log(response, `response`);
      const blob = await response.blob();
      zip.file(checkAndGetFileName(index, blob), blob);
    } catch (err) {
      console.error(err);
    }
  }
  return zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9,
    },
  });
}

function checkAndGetFileName(index, blob) {
  let name = parseInt(index) + 1;
  const [type, extension] = blob.type.split("/");
  if (type != "image" || blob.size <= 0) {
    throw Error("Incorrect content");
  }
  return name + "." + extension;
}

function downloadArchive(archive) {
  // TODO: Создать невидимую ссылку (тег <a>),
  // которая будет указывать на переданный ZIP-архив "archive"
  // и автоматически нажать на эту ссылку. Таким образом
  // браузер откроет окно сохранения загруженного файла или
  // автоматически загрузит его (зависит от типа ОС)
  const link = document.createElement("a");
  // Чтобы дать пользователю возможность скачать файл, нужно создать ссылку на этот файл.
  // В нашем случае нужно создать ссылку не на файл, а на BLOB. (создаем, кликаем, удаляем)
  link.href = URL.createObjectURL(archive);
  link.download = "images.zip";
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
}
