## How to run
``` shell
export GOOGLE_APPLICATION_CREDENTIALS=[your gcp service account credentials json file]
export GPT_API_KEY=[your chatGpt key]
export HOST_NAME=[your host name or ip]
export PORT=[serive port]
export CHAT_DIR=[directory for chatGpt results files]
node ./src/index.js
```

## URLs
1. Google translate
[http://[hostName]:[port]/googleTrans?sentence=我有600日元。]

2. Google TTS
[http://[hostName]:[port]/googleTTS?sentence=どうぞ宜しくお願い致します。]

3. ChatGpt chat api
[http://[hostName]:[port]/chatgpt?words=降る]