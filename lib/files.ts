import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

export const readAsset = (asset: Asset): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            await asset.downloadAsync()
            const file = await fetch(asset.uri)
            const text = await file.text()
            resolve(text);
        } catch (e) {
            reject(e)
        }
    });
}

export const getJson = (fileContents: string, sanitizeFirst: boolean): Object => {
    const obj: any = {
        items: []
    };
    const allLines = fileContents.split(/\r\n|\n/);
    const jsonStart = allLines[0].indexOf("{");

    allLines.forEach((l: string, i: number) => {
        if (l.length > 0) {
            let jsonString = l.substring(jsonStart);
            if (sanitizeFirst) {
                jsonString = jsonString.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
            }
            try {
                obj.items.push(JSON.parse(jsonString));
            } catch (e) {
                console.error(e, jsonString); // error in the above string (in this case, yes)!
            }
        }
    });

    return obj;
}

