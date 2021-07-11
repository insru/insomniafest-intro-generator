#include "lib/json.js";

function main() {
    // noinspection JSUnresolvedVariable
    if (app.project.file === null) {
        alert("save project pls");
        return;
    }

    /** ищем папку с сорцами src в проекте */
    var sourceFolder = findFolder('src');

    /** ищем главную композицию */
    var mainComp = findItem('intro', sourceFolder);

    // noinspection JSUnresolvedVariable
    /** грузим videos.json */
    var videos = loadJson("/data/videos.json").videos;

    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    /** создаем папку для рендер композиций */
    var renderFolder = app.project.rootFolder.items.addFolder("renderComps");

    /** запускаем генерацию композиции для каждого видео */
    for (var i = 0; i < videos.length; i++) {

        var videoParams = videos[i];
        var videoName = videoParams.name;

        /** дублируем главную композицию и все ее динамические зависимости из папки src */
        var videoComp = duplicateComposition(mainComp, renderFolder);
        // noinspection JSUnresolvedFunction
        videoComp.name = videoName;

        // noinspection JSUnresolvedFunction,JSUnresolvedVariable
        videoComp.layer("name-ru").text.sourceText.setValue(videoParams.nameRu);
        // noinspection JSUnresolvedFunction,JSUnresolvedVariable
        videoComp.layer("name").text.sourceText.setValue(videoParams.name);
        // noinspection JSUnresolvedFunction,JSUnresolvedVariable
        videoComp.layer("producer").text.sourceText.setValue(videoParams.producer);
        // noinspection JSUnresolvedFunction,JSUnresolvedVariable
        videoComp.layer("bio").text.sourceText.setValue(videoParams.bio);
        // noinspection JSUnresolvedFunction,JSUnresolvedVariable
        videoComp.layer("duration").text.sourceText.setValue(videoParams.duration);
    }
    alert("Generation completed");
}

function loadJson(path) {
    // noinspection JSUnresolvedVariable
    var folder = app.project.file.path;
    var configPath = folder + path;
    var configFile = new File(configPath);

    // noinspection JSUnresolvedVariable
    if (!configFile.exists) {
        alert("failed to load: " + configPath);
        return null;
    }

    configFile.open('r');
    var config = JSON.parse(configFile.read());
    configFile.close();

    // noinspection JSUnresolvedVariable
    return config;
}

function findFolder(folderName, parentFolder) {
    // noinspection JSUnresolvedVariable
    if (!(parentFolder instanceof FolderItem)) {
        // noinspection JSUnresolvedVariable
        parentFolder = app.project.rootFolder;
    }

    // noinspection JSUnresolvedVariable
    for (var i = 1; i <= parentFolder.numItems; i++) {

        var item = parentFolder.item(i);

        // noinspection JSUnresolvedVariable
        if (item instanceof FolderItem) {
            if (item.name !== folderName) {
                var res = findFolder(folderName, item)
                if (res !== null) {
                    return res;
                }
            } else {
                return item;
            }
        }
    }
    return null;
}

function findItem(itemName, parentFolder) {
    // noinspection JSUnresolvedVariable
    if (!(parentFolder instanceof FolderItem)) {
        // noinspection JSUnresolvedVariable
        parentFolder = app.project.rootFolder;
    }

    // noinspection JSUnresolvedVariable
    for (var i = 1; i <= parentFolder.numItems; i++) {

        var item = parentFolder.item(i);

        if (item.name === itemName) {
            return item;
        }

        // noinspection JSUnresolvedVariable
        if (item instanceof FolderItem) {
            var res = findItem(itemName, item)
            if (res !== null) {
                return res;
            }
        }
    }
    return null;
}

function duplicateComposition(composition, targetFolder) {
    // noinspection JSUnresolvedFunction
    var duplicatedComposition = composition.duplicate();
    duplicatedComposition.parentFolder = targetFolder;
    duplicatedComposition.name = composition.name;
    return duplicatedComposition;
}

/**
 * заворачиваем и вызываем главную функцию в ундогруппу для ее быстрой отмены в АЕ
 */

// noinspection JSUnresolvedFunction,JSUnresolvedVariable
app.beginUndoGroup("script run");
main(false);
// noinspection JSUnresolvedFunction,JSUnresolvedVariable
app.endUndoGroup();
