import SparkMD5 from "spark-md5";
import hostFS from "./host-fs";

// 下载文件流
export function saveBlobFile(blob, fileName) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName);
  } else {
    triggerDownload(blob, fileName);
  }
}

/**
 * 用 a 标签触发一次下载。
 *
 * 两个坑：
 * 1. remove() 而不是 removeChild()：节点在点击过程中被页面重排摘掉时，
 *    removeChild 会抛 NotFoundError，remove() 是空操作。
 * 2. revoke 延后：同一 tick 撤销 URL 有可能把还没开始的下载直接掐掉。
 */
function triggerDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const aEle = document.createElement("a");
  aEle.href = url;
  aEle.download = fileName;
  aEle.style.display = "none";

  document.body.appendChild(aEle);
  try {
    aEle.click();
  } finally {
    aEle.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

// * 前端导出, 传入文件内容（文本或 Blob）和文件名称
export function downloadFile(content, fileName) {
  const blob =
    content instanceof Blob
      ? content
      : new Blob([content], { type: "application/json;charset=utf-8" });

  triggerDownload(blob, fileName);
}

/**
 * 保存一段文本为文件。
 *
 * 壁纸宿主里页面下载会被一律拦掉（WebView2 的 DownloadStarting 策略），
 * 所以跑在自己的宿主里时走宿主弹窗落盘；普通浏览器里退回 a 标签下载。
 *
 * @param {string} fileName 建议文件名
 * @param {string} text 文件内容
 * @returns {Promise<{ok:boolean, canceled?:boolean, path?:string, error?:string, mode:'host'|'browser'}>}
 */
export async function saveTextFile(fileName, text) {
  const result = await hostFS.save(fileName, text);

  // 对面不是我们的宿主（或宿主版本太旧没这条能力），退回浏览器下载
  if (!result) {
    downloadFile(text, fileName);
    return { ok: true, mode: "browser" };
  }

  return { ...result, mode: "host" };
}

// base64转Blob
export function dataURLtoBlob(dataUrl) {
  var arr = dataUrl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

//将blob转换为file
export function blobToFile(theBlob, fileName) {
  return new File([theBlob], fileName, { type: theBlob.type });
}

// 文件分片
export function sliceFile(file, chunkSize = 1024 * 1024 * 5) {
  const chunks = [];
  let cur = 0;
  while (cur < file.size) {
    chunks.push(file.slice(cur, cur + chunkSize));
    cur += chunkSize;
  }
  return chunks;
}

// 计算文件Md5
export function getFileMd5(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    const spark = new SparkMD5.ArrayBuffer();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      spark.append(e.target.result);
      const md5 = spark.end();
      resolve(md5);
    };
  });
}

// 计算chunks[blob]的Md5
export function getChunksMd5(chunks) {
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    let cur = 0;
    const loadNext = () => {
      const file = chunks[cur];
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        spark.append(e.target.result);
        cur++;
        if (cur < chunks.length) {
          loadNext();
        } else {
          const md5 = spark.end();
          resolve(md5);
        }
      }
    }
    loadNext();
  })
}