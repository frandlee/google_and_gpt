import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { writeFile as _writeFile } from "fs";
import { promisify } from "util";

// Not in use
export async function listAllVoice() {
	const client = new TextToSpeechClient();

	const [result] = await client.listVoices({});
	const voices = result.voices;

	console.log("Voices:");
	voices.forEach((voice) => {

		if (voice.name.indexOf('JP') != -1) {
			console.log(`Name: ${voice.name}`);
			console.log(`  SSML Voice Gender: ${voice.ssmlGender}`);
			console.log(
				`  Natural Sample Rate Hertz: ${voice.naturalSampleRateHertz}`
			);
			console.log("  Supported languages:");
			voice.languageCodes.forEach((languageCode) => {
				console.log(`    ${languageCode}`);
			});
		}

	});
}

export async function googleTTS(text, outputFile) {
	const client = new TextToSpeechClient();

	const request = {
		input: { text: text },
		voice: { languageCode: "ja-JP", name: "ja-JP-Neural2-C", ssmlGender: "MALE" },
		audioConfig: {
			audioEncoding: "LINEAR16",
			effectsProfileId: [
				"handset-class-device"
			],
			pitch: 0,
			speakingRate: 1
		}
	};
	const [response] = await client.synthesizeSpeech(request);

	const writeFile = promisify(_writeFile);

	await writeFile(outputFile, response.audioContent, "binary");
	console.log(`Audio content written to file: ${outputFile}`);
}
