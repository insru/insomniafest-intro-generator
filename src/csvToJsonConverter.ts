import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';

const csv: string = readFileSync(join(__dirname, '..', 'data', 'videos.csv')).toString();

let rows: Array<string> = csv.indexOf('\r\n') !== -1 ? csv.split('\r\n') : csv.split('\n');
rows.pop();

let videos: Array<VideoData> = [];
let errors = 0;

rows.forEach((value, index) => {
    const splittedRow: Array<string> = value.split(';');
    const firstColumn: string = splittedRow[0];
    const secondColumn: string = splittedRow[1];

    const mainData: Array<string> = firstColumn.split(' / ');

    if (mainData.length !== 5) {
        errors += 1;
        console.error(`data consistency error in row ${index + 1}: ${mainData.join(' / ')}`);
    } else {
        videos.push({
            name: mainData[0],
            nameRu: secondColumn,
            producer: mainData[1],
            bio: mainData[2] + ' / ' + mainData[3] + ' / ' + mainData[4]
        });
    }
});

writeFileSync(join(__dirname, '..', 'data', 'videos.json'), JSON.stringify({videos: videos}));

console.log(`videos in CSV: ${rows.length}`);
console.log(`videos in JSON: ${videos.length}`);
console.log(`errors: ${errors}`);

interface VideoData {
    name: string,
    nameRu: string,
    producer: string,
    bio: string
}
