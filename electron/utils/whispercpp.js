const { exec } = require('child_process');
const fs = require('fs');

// 音频文件路径
const audioFilePath = '/Users/zhang1/Downloads/1000.wav';

// whisper.cpp可执行文件路径
const whisperExecutablePath = '/Users/zhang1/Downloads/whisper.cpp/main';
// ./main -m ./models/ggml-base.en.bin -f ./path/to/your/audio.wav -l en -t 4
// ./whisper.cpp/main -m ./whisper.cpp/models/ggml-medium.bin -f ./1000.wav
// 模型文件路径
const modelFilePath = '/Users/zhang1/Downloads/ggml-small.bin';
//% ./whisper.cpp/main -m ./ggml-small.bin -f 1000.wav -l zh -otxt ./8.txt
// 构建命令
const command = `${whisperExecutablePath} -m ${modelFilePath} -f ${audioFilePath} -l zh -otxt ./998.txt`;

// 执行命令
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Transcription: ${stdout}`);
});