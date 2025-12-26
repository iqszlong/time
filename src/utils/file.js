import SparkMD5 from "spark-md5";
// 下载文件流
export function saveBlobFile(blob, fileName) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName);
  } else {
    var a = document.createElement("a");
    var downUrl = window.URL.createObjectURL(blob);
    a.href = downUrl;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(downUrl);
  }
}

// * 前端导出, 传入文件内容和文件名称
export function downloadFile(content, fileName) {
  const aEle = document.createElement("a"); // 创建下载链接
  aEle.download = fileName; // 设置下载的名称
  aEle.style.display = "none"; // 隐藏的可下载链接
  // 字符内容转变成 blob 地址
  const blob = new Blob([content]);
  aEle.href = URL.createObjectURL(blob);
  // 绑定点击时间
  document.body.appendChild(aEle);
  aEle.click();
  // 然后移除
  document.body.removeChild(aEle);
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