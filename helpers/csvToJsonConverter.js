let fs = require('fs');
let path = require('path');

let csv = fs.readFileSync(path.join(__dirname, "..", "data", "videos.csv")).toString();

let rows = csv.substring(1);

if (rows.indexOf('\r\n') !== -1) {
    rows = csv.split('\r\n');
} else {
    rows = csv.split('\n');
}

rows.pop();

let videosObj = {
    videos: []
}

let inData = rows.length;
let maxNameLength = 0;
let maxNameRuLength = 0;
let maxProducerLength = 0;
let errors = 0;

rows.forEach((value, index) => {
    // console.log(`processing row: ${index + 1}`);

    // \"

    const splittedRow = value.split(";");
    let data = splittedRow[0];

    // чистим от лишних ковычек
    data = data.substring(1)
    data = data.substring(0, data.length - 2);

    data.replace(" /", " / ");
    data.replace("/ ", " / ");
    data.replace("/", " / ");
    data = data.split(' / ');

    if (data.length !== 5) {
        errors += 1;
        console.log(`data consistency error in row: ${index + 1}`);
        console.log(data);
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

        if (video.nameRu.length > maxNameRuLength) {
            maxNameRuLength = video.nameRu.length
        }

        if (video.name.length > maxNameLength) {
            maxNameLength = video.name.length
        }

        if (video.producer.length > maxProducerLength) {
            maxProducerLength = video.producer.length
        }


        if (video.nameRu.length > 0) {
            videosObj.videos.push(video);
        }
    }
});

fs.writeFileSync(path.join(__dirname, "..", "data", "videos.json"), JSON.stringify(videosObj));

console.log(`videos in CSV: ${inData}`);
console.log(`videos in JSON: ${videosObj.videos.length}`);
console.log(`max name length: ${maxNameLength}`);
console.log(`max name ru length: ${maxNameRuLength}`);
console.log(`max producer length: ${maxProducerLength}`);

console.log(`errors: ${errors}`);
