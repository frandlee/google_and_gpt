import { Configuration, OpenAIApi } from "openai";
import { readFileIfExist, writeIntoFile } from "./utils.js";

export async function openaiChat(GPT_API_KEY, chatDir, words) {
    const openai = new OpenAIApi(new Configuration({
        apiKey: GPT_API_KEY,
    }))

    let fileName = words + ".json";

    let prompt = "Give me an example sentence with the N2 levle Japanese word '" + words + "' in Japanese, English and Chinese. \
    The result should be in JSON format: \
    {\
        Japanese: Japanese, \
        English: English, \
        Chinese: Chinese \
    }";

    // 1. check from previous search results
    let res;
    try {
        res = readFileIfExist(chatDir, fileName);
        console.debug("-- got file ---");
        console.debug(res);
        console.debug(typeof res);
        if (res && (typeof res === "object")) {
            return res;
        }

    } catch (err) {
        res = undefined;
    }

    // 2. query online if no previous files found
    let messages = [];
    messages.push({ role: "user", content: prompt });

    res = await createChat(GPT_API_KEY, messages);
    let result = res.data.choices[0].message.content;

    console.debug(result);
    console.debug(typeof result);

    if (typeof result !== "object") {
        console.debug(typeof result);
        result = result.replace(/([a-zA-Z0-9]+):/g, '"$1":');
        //const jsonObject = JSON.parse(validJsonString);
    }

    writeIntoFile(chatDir, fileName, result);
    return JSON.parse(result);
}

async function createChat(GPT_API_KEY, messages) {
    const openai = new OpenAIApi(new Configuration({
		apiKey: GPT_API_KEY,
	}));
    let model = "gpt-3.5-turbo";

    const res = await openai.createChatCompletion({
        model: model,
        messages: messages,
    })
    return res;
}

// not in use
export async function openaiImage(GPT_API_KEY, sentense) {
	console.debug("--openaiChat");

	//console.debug(process.env.API_KEY);
	const openai = new OpenAIApi(new Configuration({
		apiKey: GPT_API_KEY,
	}));

	const response = await openai.createImage({
		prompt: sentense,
		n: 1,
		size: "1024x1024",
	  });
	let image_url = response.data.data[0].url;

	return image_url;
}

//let sentence = "雨の東京夜桜を透明傘をさして眺める。";
//let response = await openaiImage(sentence);
//console.debug(response);