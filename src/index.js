import { googleTTS } from './utils/voiceTool.js';
import { translateToJp } from "./utils/translateTool.js";
import { openaiChat } from "./utils/chatGpt.js";
import express from 'express';

// Init
const voiceFileDir = '/tmp';
let gpt_api_key = process.env.GPT_API_KEY;
let hostName = process.env.HOST_NAME;
let port = process.env.PORT;
console.debug(`HOST_NAME: ${hostName}`);
console.debug(`PORT: ${port}`);
console.debug(`GPT_API_KEY: ${gpt_api_key}`);

const app = express();

app.post('/', function requestHandler(req, res) {
  console.debug(req.params);
  console.debug(req.body);
  res.end('post request handled!');
});

// 0. ChatGPT
app.get('/chatgpt', async function (req, res) {
  console.debug(req.query);
  const words = req.query['words'];
  console.debug('words: ' + words);
  const results = await openaiChat(gpt_api_key, words)
  console.debug(typeof results);
  console.debug(results);
  res.json(results)
  res.send();
})

// 1. Google translate service
app.get('/googleTrans', async function (req, res) {
  console.debug(req.query);
  const sentence = req.query['sentence'];
  console.debug('sentence: ' + sentence);
  const translation = await translateToJp(sentence);
  res.json({ translation: translation })
  res.send();
})

// 2. download from GOOGLE TTS
// 2.1 Generate Mp3
app.get('/googleTTS', async function (req, res) {
  console.debug(req.query);
  const sentence = req.query['sentence'];
  console.debug('sentence: ' + sentence);
  var fileName = voiceFileDir + '/' + Date.now() + '.mp3';
  console.debug(fileName);
  await googleTTS(sentence, fileName);
  console.debug('----------file generated!=-----');
  //googleTTS();
  //console.debug(req.headers);
  const fileUrl = `http://${hostName}:${port}/download?mp3=${fileName}`;
  console.debug(fileUrl)
  res.json({ fileUrl: fileUrl })
  res.send();
})

//2.2 mp3 download
app.get('/download', function (req, res) {
  //const __dirname = 'voicefiles'
  console.debug(req.query);
  const mp3 = req.query['mp3'];
  //const file = `${voiceFileDir}/${mp3}`;
  res.download(mp3); // Set disposition and send it.
});


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log(`Words service: http://${hostName}:${port}`)
})


