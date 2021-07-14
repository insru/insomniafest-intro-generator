let fs = require('fs');
let path = require('path');

let csv = fs.readFileSync(path.join(__dirname, "..", "data", "videos.csv")).toString();

let rows = csv;

if (rows.indexOf('\r\n') !== -1) {
    rows = rows.split('\r\n');
} else {
    rows = rows.split('\n');
}

rows.pop();

let videosObj = {
    videos: []
}

const CSVLength = rows.length;
let errors = 0;

rows.forEach((value, index) => {
    const splittedRow = value.split(";");
    let data = splittedRow[0];

    // чистим от лишних ковычек
    data = data.substring(1)
    data = data.substring(0, data.length - 2);

    data = data.split(' / ');

    // проверяем верно ли парсится строка с данными на английском
    if (data.length !== 5) {
        errors += 1;
        console.error(`data consistency error in row: ${index + 1}`);
        console.error(data);
    } else {
        let video = {
            name: data[0],
            nameRu: splittedRow[1],
            producer: data[1],
            bio: data[2] + ' / ' + data[3] + ' / ' + data[4]
        }

        if (video.bio.indexOf("'") === -1) {
            console.log(`wrong duration format in row: ${index + 1}`);
        }
        if (video.bio.indexOf(`"`) === -1) {
            console.log(`wrong duration format in row: ${index + 1}`);
        }

        if (video.nameRu.length > 1) {
            videosObj.videos.push(video);
        }
    }
});

fs.writeFileSync(path.join(__dirname, "..", "data", "videos.json"), JSON.stringify(videosObj));

console.log(`videos in CSV: ${CSVLength}`);
console.log(`videos in JSON: ${videosObj.videos.length}`);
console.log(`errors: ${errors}`);
