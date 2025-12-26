import api from "@/api";
import * as qiniu from "qiniu-js";
import utils from ".";

// 上传到七牛云
export async function qiniuUpload({ file, onProgress, onFinish, onError }, fn) {
  const { message } = utils;
  if (!file || !file.type) {
    message.error("请选择文件");
    return;
  }
  // console.log(file.file);

  message.info("上传中...");
  try {
    const resourceFile = file.file;
    const { data } = await api.getQiniuPutObject({
      name: resourceFile.name,
      size: resourceFile.size,
    });
    const { token, name, url } = data;
    // console.log(data);
    // return

    const observable = qiniu.upload(resourceFile, name, token);

    observable.subscribe({
      next: ({ total }) => {
        console.log("上传进度", total);
        onProgress && onProgress({ percent: Math.ceil(total.percent) });
      },
      error: (err) => {
        throw new Error(err);
      },
      complete: () => {
        fn && fn(file, data);
        // message.success("上传成功");
        file.url = url;
        file.thumbnailUrl = url;
        onFinish && onFinish();
      },
    });
  } catch (error) {
    message.error("上传失败");
    console.error(error);
    onError && onError();
  }

  // return
  // // 模拟上传
  // setTimeout(() => {
  //     message.success('上传成功')
  //     imgList.value.push({ fileName: file.name, url: URL.createObjectURL(file.file), status: "finished" })
  //     model.value.cover = URL.createObjectURL(file.file);
  //     onFinish()
  // }, 1500)
}
// 上传到本地服务器
export async function upload({ file, onProgress, onFinish, onError }, fn) {
  const { message } = utils;
  if (!file || !file.type) {
    message.error("请选择文件");
    return false;
  }
  message.info("上传中...");
  const formData = new FormData();
  formData.append("file", file.file);
  const fileHost = import.meta.env.VITE_FILE_HOST;
  onProgress && onProgress({ percent: 1 });
  try {
    const res = await api.uploadFile(formData);
    const { code, data } = res;
    // console.log(code, data);
    // code 是20开头
    if (`${code}`.startsWith("20")) {
      onProgress && onProgress({ percent: 100 });
      // console.log(data);
      // message.success("上传成功");
      // 替换http(s)://localhost开头任意端口号
      // 替换为fileHost
      const fileURL = data.url.replace(/http(s)?:\/\/localhost:\d+/, fileHost);
      file.url = fileURL;
      file.thumbnailUrl = fileURL;
      onFinish && onFinish();
      fn && fn(file, data);
      return { file, data };
    }
  } catch (error) {
    message.error("上传失败");
    console.log(error);
    onError && onError();
    return false;
  }
}

// 大文件分片上传
export async function uploadLargeFile(
  { file, onProgress, onFinish, onError },
  { size = 5, fn, params = {} }
) {
  const { message } = utils;
  if (!file || !file.type) {
    message.error("请选择文件");
    return false;
  }
  message.info("上传中...");
  // 分片
  const chunkSize = 1024 * 1024 * size; // size MB
  // 根据文件大小计算分片数量 返回文件blob数组
  const chunks = utils.sliceFile(file.file, chunkSize);

  // console.log(chunks);

  // 计算文件md5
  // const fileMd5 = await utils.getChunksMd5(chunks);

  const wk = utils.createWorker(`
    importScripts("http://localhost:5678/spark-md5.min.js");
    self.onmessage = function (e) {
      const chunks = e.data;
      new Promise((resolve, reject) => {
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
      }).then(md5=>{
        self.postMessage(md5);
      })
    }
  `);

  wk.postMessage(chunks);

  wk.onmessage = function (e) {
    const fileMd5 = e.data;
    console.log(fileMd5);
    wk.terminate(); // 关闭worker
    let upDoneLength = 0;
    // 循环上传
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("chunkNumber", i);
      formData.append("totalChunks", chunks.length);
      formData.append("fileMd5", fileMd5);
      formData.append("originFileName", file.file.name);
      // 增加自定义字段
      for (const key in params) {
        formData.append(key, params[key]);
      }
      // 用entries()输出formdata的内容
      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }
      const fileHost = import.meta.env.VITE_FILE_HOST;

      new Promise((resolve, reject) => {
        // 上传请求
        setTimeout(() => {
          // 模拟上传
          resolve({ file, data: {} });
        }, 1000 * i);

        // api.uploadFile(formData).then(res => {
        //   const { code, data } = res;
        //   // code 是20开头
        //   if (`${code}`.startsWith("20")) {
        //     // console.log(data);
        //     // 替换http(s)://localhost开头任意端口号
        //     // 替换为fileHost
        //     const fileURL = data.url.replace(/http(s)?:\/\/localhost:\d+/, fileHost);
        //     file.url = fileURL;
        //     file.thumbnailUrl = fileURL;
        //     resolve({file,data});
        //   } else {
        //     reject(res);
        //   }
        // })
      })
        .then((res) => {
          upDoneLength++;
          console.log(upDoneLength,chunks.length);
          onProgress &&
            onProgress({
              percent: Math.ceil((upDoneLength / chunks.length) * 100),
            });

          if(upDoneLength == chunks.length) {
            onFinish && onFinish();
            fn && fn(res);
          }
        })
        .catch((error) => {
          message.error("上传失败");
          console.error(error);
          onError && onError();
        });
    }
  };
}
