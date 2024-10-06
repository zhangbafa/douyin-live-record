const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('@ffprobe-installer/ffprobe');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const path = require('path');
const fs = require('fs').promises;

ffmpeg.setFfprobePath(ffprobe.path);
ffmpeg.setFfmpegPath(ffmpegPath);

async function getVideoInfoAndThumbnail(filePath) {
  const info = await new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const { format, streams } = metadata;
      const videoStream = streams.find(stream => stream.codec_type === 'video');

      resolve({
        fileName: path.basename(format.filename),
        fileSize: parseInt(format.size), // in bytes
        duration: parseFloat(format.duration), // in seconds
        bitrate: parseInt(format.bit_rate),
        videoCodec: videoStream.codec_name,
        width: videoStream.width,
        height: videoStream.height,
        fps: eval(videoStream.r_frame_rate).toFixed(2)
      });
    });
  });

//   const userDataPath = app.getPath('userData');
//   const thumbnailsDir = path.join(userDataPath, 'thumbnails');
//   await fs.mkdir(thumbnailsDir, { recursive: true });
//   const thumbnailPath = path.join(thumbnailsDir, `${path.basename(filePath, path.extname(filePath))}_thumbnail.jpg`);
  const thumbnailPath = path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}_thumbnail.jpg`);

  await new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .screenshots({
        timestamps: ['00:00:01'],
        filename: path.basename(thumbnailPath),
        folder: path.dirname(thumbnailPath),
        // size: '320x240'
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });

  info.thumb = thumbnailPath;
  // info.thumbnailData = await fs.readFile(thumbnailPath, { encoding: 'base64' });

  return info;
}

// 使用示例
async function main() {
  try {
    const videoInfo = await getVideoInfoAndThumbnail('/Users/zhang1/Desktop/屏幕录制2024-08-13 21.27.48.mov');
    console.log(videoInfo);
    // 如果不需要保存缩略图文件，可以在这里删除它
    // await fs.unlink(videoInfo.thumbnailPath);
  } catch (error) {
    console.error('Error getting video info and thumbnail:', error);
  }
}

module.exports = {
    getVideoInfoAndThumbnail
};