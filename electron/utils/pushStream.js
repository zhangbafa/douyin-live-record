const ffmpeg = require('fluent-ffmpeg');

// 定义视频文件列表
const videoFiles = ['input1.mp4', 'input2.mp4'];

// 创建一个 ffmpeg 命令
const command = ffmpeg();

// 添加视频文件到命令中
videoFiles.forEach(file => {
  command.input(file);
});

// 使用 concat 滤镜按顺序连接视频
command.complexFilter([
  ...videoFiles.map((file, index) => `[${index}:v]scale=600:900[v${index}]`),
  ...videoFiles.map((file, index) => `[v${index}][${index}:a]`),
  `concat=n=${videoFiles.length}:v=1:a=1[v][a]`
]);

// 映射连接后的视频和音频
command.map('[v]').map('[a]');

// 设置推流参数
command
  .outputOptions([
    '-r 25', // 设置帧率为 25 FPS
    '-c:v libx264', // 使用 H.264 编码视频
    '-b:v 3000k', // 设置视频码率为 3000 kbps
    '-g 25', // 设置关键帧间距为 25 帧
    '-c:a aac', // 使用 AAC 编码音频
    '-ar 8000', // 设置音频采样率为 8000 Hz
    '-b:a 128k', // 设置音频码率为 128 kbps
    '-f flv' // 指定输出格式为 FLV
  ])
  .save('rtmp://yourserver/live/streamkey') // 指定 RTMP 服务器地址和流密钥
  .on('start', function(commandLine) {
    console.log('Spawned FFmpeg with command: ' + commandLine);
  })
  .on('error', function(err, stdout, stderr) {
    console.log('An error occurred: ' + err.message);
    console.log('ffmpeg stderr: ' + stderr);
  })
  .on('end', function() {
    console.log('Processing finished!');
  });

/*
const ffmpeg = require('fluent-ffmpeg');

// 创建一个 ffmpeg 命令
const command = ffmpeg();

// 使用 concat 协议读取视频文件列表
command.input('list.txt')
  .inputOptions(['-f concat', '-safe 0']) // 使用 concat 协议并允许不安全的路径
  .videoCodec('libx264') // 使用 H.264 编码视频
  .size('600x900') // 设置视频分辨率为 600x900
  .fps(25) // 设置帧率为 25 FPS
  .outputOptions([
    '-b:v 3000k', // 设置视频码率为 3000 kbps
    '-g 25', // 设置关键帧间距为 25 帧
    '-c:a aac', // 使用 AAC 编码音频
    '-ar 8000', // 设置音频采样率为 8000 Hz
    '-b:a 128k', // 设置音频码率为 128 kbps
    '-f flv' // 指定输出格式为 FLV
  ])
  .save('rtmp://yourserver/live/streamkey') // 指定 RTMP 服务器地址和流密钥
  .on('start', function(commandLine) {
    console.log('Spawned FFmpeg with command: ' + commandLine);
  })
  .on('error', function(err, stdout, stderr) {
    console.log('An error occurred: ' + err.message);
    console.log('ffmpeg stderr: ' + stderr);
  })
  .on('end', function() {
    console.log('Processing finished!');
  });
*/