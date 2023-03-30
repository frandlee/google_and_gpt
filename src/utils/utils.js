import fs from "fs";

export function readJsonFromFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function writeIntoFile(dir, file, fileContent) {
	let filePath = dir + "/" + file;
    fs.writeFileSync(filePath, fileContent);
}

export function readFileIfExist(dir, file) {
	let filePath = dir + "/" + file;
	console.debug(filePath);
	if (fs.existsSync(filePath)) {
		try {
			let json = readJsonFromFile(filePath);
			return json;
		} catch (err) {
			fs.unlinkSync(filePath);
			return undefined;
		}
		
	} else {
		return undefined;
	}
}
