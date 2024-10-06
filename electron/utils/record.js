const { app } = require("electron");
const ffmpeg = require("fluent-ffmpeg");
const ffprobe = require("@ffprobe-installer/ffprobe");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const Conf = require("ee-core/config");
const UtilsHelper = require("ee-core/utils/helper");

const path = require("path");
const fs = require("fs");

ffmpeg.setFfprobePath(ffprobe.path);
ffmpeg.setFfmpegPath(ffmpegPath);

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，需要加 1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`;
}
// 开始录制
function startRecording(params) {
  const config = Conf.getValue('recordSavePath')
  console.log(config)
  let defaultSavePath = app.getPath("downloads")
  if(config && ('savedir' in config) && config.savedir!==''){
    defaultSavePath = config.savedir
  }
  const { name, title, id: streamId, streamUrl, recordType } = params;
  const now = new Date();
  const formattedDate = formatDate(now);
  const savePath = path.join(defaultSavePath, "wuju", name.replaceAll('/',''));
  UtilsHelper.mkdir(savePath);
  const fileExtension = recordType == "video" ? ".flv" : ".wav";
  console.log(`recordType:${recordType}`);
  const titleTem = sanitizeFileName(title)
  const outputFilePath = `${savePath}/${titleTem}_${formattedDate}${fileExtension}`;
  const outputStream = fs.createWriteStream(outputFilePath);
  const recordingProcess = ffmpeg(streamUrl).output(outputStream);
  if (recordType == "video") {
    recordingProcess.videoCodec("copy").audioCodec("copy").format('flv')
  }
  if (recordType == "audio") {
    recordingProcess
      .outputOptions([
        "-vn", // 禁用视频流
        "-acodec pcm_s16le", // 设置音频编码为 16-bit PCM
      ])
      .format("wav");
  }
  // recordingProcess.duration(60)
  recordingProcess
    .on("start", function (commandLine) {
      console.log(`Spawned Ffmpeg with command: ${commandLine}`);
    })
    .on("progress", function (progress) {
      console.log(`Processing ${streamId}: ${progress.percent}% done`);
    })
    .on("end", function () {
      console.log(`Recording ${streamId} finished!`);
    })
    .on("error", function (err) {
      console.error(`Error recording ${streamId}:- ${err}`);
    });
  recordingProcess.run();
  global.recordingProcesses[streamId] = recordingProcess;
}

function stopRecording(params) {
  const { id: streamId } = params;
  const recordingProcess = global.recordingProcesses[streamId];
  if (recordingProcess) {
    recordingProcess.kill("SIGINT");
    delete global.recordingProcesses[streamId];
  }
}

function sanitizeFileName(fileName) {
  // 定义不允许的字符
  const illegalChars = /[<>:"/\\|?*]/g;
  const controlChars = /[\x00-\x1F\x80-\x9F]/g;
  const reservedNames = /^(con|prn|aux|nul|com\d|lpt\d)$/i;

  // 替换非法字符
  let sanitizedFileName = fileName.replace(illegalChars, '');
  sanitizedFileName = sanitizedFileName.replace(controlChars, '');

  // 检查保留字
  if (reservedNames.test(sanitizedFileName)) {
    sanitizedFileName = '_' + sanitizedFileName;
  }

  // 去除前后空格
  sanitizedFileName = sanitizedFileName.trim();

  return sanitizedFileName;
}
module.exports = {
  startRecording,
  stopRecording,
};
// const params = {id:781027995094,url:'http://pull-flv-l6.douyincdn.com/stage/stream-692415947984076831_hd.flv?k=5f351a016a60c1ae&t=1728477659&major_anchor_level=common'}
// startRecording(params);
