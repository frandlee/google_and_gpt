//import {TranslationServiceClient} from '@google-cloud/translate';
import { Translate } from '@google-cloud/translate/build/src/v2/index.js';
import { TranslationServiceClient } from '@google-cloud/translate/build/src/v3/index.js';

export async function translateToJp(text) {
  if (!text) {
    return "text is not defined!";
  }
  const translate = new Translate();

  // 1. get target language
  const lanObj = await getLanTarget(text);

  if (!lanObj) {
    return "Can't detect text language."
  }

  let sourceLan = lanObj.sourceLan;
  let targetLan = lanObj.targetLan;

  // 2. translate v3
  return await translateTextV3(text, sourceLan, targetLan);
}

async function getLanTarget(text) {
  if (!text) {
    return undefined;
  }

  console.debug(`text: ${text}`)
  const translationClient = new TranslationServiceClient();

  let projectId = "frandlee";
  let location = "global";
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    content: text,
  };

  // Run request
  const [response] = await translationClient.detectLanguage(request);

  let sourceLan, targetLan;
  console.log('Detected Languages:');
  for (const language of response.languages) {
    console.log(`Language Code: ${language.languageCode}`);
    console.log(`Confidence: ${language.confidence}`);
    sourceLan = language.languageCode;
    break;
  }
  //{ encoding: 'UTF-8', confidence: 0.99, language: 'Japanese' }

  if (sourceLan === "zh-CN") {
    targetLan = "ja";
  }

  if (sourceLan === "en") {
    targetLan = "ja";
  }

  if (sourceLan === "ja") {
    targetLan = "en";
  }

  return {sourceLan: sourceLan, targetLan: targetLan}

}

async function translateText(text, target) {
  console.debug(`text:${text}`);
  console.debug(`traget:${target}`);
  let translations = await translate.translate(text, target);

  translations = Array.isArray(translations) ? translations[0] : translations;
  console.log(`Translations:${translations}`);
  return translations;
}

async function translateTextV3(text, sourceLanguageCode, targetLanguageCode) {
  // Construct request
  console.debug(`translateTextV3 is used`);
  let projectId = "frandlee";
  let location = "global";

  const translationClient = new TranslationServiceClient();
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: 'text/plain', // mime types: text/plain, text/html
    sourceLanguageCode: sourceLanguageCode,
    targetLanguageCode: targetLanguageCode,
  };

  // Run request
  const [response] = await translationClient.translateText(request);

  for (const translation of response.translations) {
    console.log(`Translation: ${translation.translatedText}`);
    return translation.translatedText;
  }
}