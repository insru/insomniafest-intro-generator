import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';

const csv: string = readFileSync(join(__dirname, '..', 'data', 'video2024.csv')).toString();

const rows: Array<string> = csv.indexOf('\r\n') !== -1 ? csv.split('\r\n') : csv.split('\n');
rows.pop();

const videos: Array<VideoData> = [];
let errors = 0;

let longestName = '';
let longestNameRu = '';
let longestProducer = '';
let longestBio = '';

rows.forEach((row, index) => {
    const parts = row.split(' / ');
    if (parts.length !== 6) {
        errors += 1;
        console.error(`data consistency error in row ${index + 1}: ${row}`);
    } else {
        const video = {
            name: parts[0],
            nameRu: parts[5],
            producer: parts[1],
            bio: `${parts[2]} / ${parts[3]} / ${parts[4]}`
        };

        videos.push(video);

        if (longestName.length < video.name.length) {
            longestName = video.name;
        }

        if (longestNameRu.length < video.nameRu.length) {
            longestNameRu = video.nameRu;
        }

        if (longestProducer.length < video.producer.length) {
            longestProducer = video.producer;
        }

        if (longestBio.length < video.bio.length) {
            longestBio = video.bio;
        }
    }
});

writeFileSync(join(__dirname, '..', 'data', 'videos.json'), JSON.stringify({videos: videos}));

console.log(`videos in CSV: ${rows.length}`);
console.log(`videos in JSON: ${videos.length}`);
console.log(`errors: ${errors}`);
console.log(`longest params:`);
console.log(longestName);
console.log(longestNameRu);
console.log(longestProducer);
console.log(longestBio);

interface VideoData {
    name: string,
    nameRu: string,
    producer: string,
    bio: string
}
