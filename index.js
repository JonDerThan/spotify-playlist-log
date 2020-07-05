"use strict";

// maximum length for descriptions of discord message embeds
const MAX_DESCRIPTION_LENGTH = 2048;

const fs = require("fs");
const path = require("path");

const SpotifyWebApi = require("spotify-web-api-node");
const Discord = require("discord.js");

const config = require("./config.json");

const getAllPlaylistTracks = require("./getAllPlaylistTracks.js");
const getDiff = require("./getDiff.js");
const trackToString = require("./trackToString.js");

let spotify = new SpotifyWebApi(config.spotifyCreds);

const webhook = new Discord.WebhookClient(config.webhook.id, config.webhook.token);

async function main() {
    let oldTracks = getOldTracks(),
        newTracks = await getAllPlaylistTracks();

    let {removed, added} = getDiff(oldTracks, newTracks);

    if (removed.length > 0) {
        let strs = removed.map(trackToString);

        for (let i = 0; i < strs.length; ) {
            let count = 0;
            let description = "";

            for (; i < strs.length && description.length + strs[i].length < MAX_DESCRIPTION_LENGTH; i++, count++) {
                description += strs[i] + "\n\n";
            }

            description = description.trim();

            await webhook.send(new Discord.MessageEmbed({
                title: `**${count}** track${count == 1 ? " was" : "s were"} removed.`,
                description,
                thumbnail: {
                    url: removed[i - count].imageURL
                },
                color: "#ff0000"
            }));
        }
    }

    if (added.length > 0) {
        let strs = added.map(trackToString);

        for (let i = 0; i < strs.length; ) {
            let count = 0;
            let description = "";

            for (; i < strs.length && description.length + strs[i].length < MAX_DESCRIPTION_LENGTH; i++, count++) {
                description += strs[i] + "\n\n";
            }

            description = description.trim();

            await webhook.send(new Discord.MessageEmbed({
                title: `**${count}** new track${count == 1 ? " was" : "s were"} added.`,
                description,
                thumbnail: {
                    url: added[i - count].imageURL
                },
                color: "#00ff00"
            }));
        }
    }

    updateFile(newTracks);
}

function getOldTracks() {
    return JSON.parse(fs.readFileSync(path.join(config.dataDir, "tracks.json")));
}

function updateFile(tracks) {
    let outStr = JSON.stringify(tracks);

    fs.writeFileSync(path.join(config.dataDir, "tracks.json"), outStr);


    let now = new Date();

    let date = now.getDate(),
        month = now.getMonth() + 1,
        year = now.getFullYear().toString();

    date = date < 10 ? "0" + date : date.toString();
    month = month < 10 ? "0" + month : month.toString();

    let fileName = `${date}-${month}-${year}.json`;
    let filePath = path.join(config.dataDir, "history/", fileName);

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, outStr);
    }
}

console.log("Fetching tracks...");
main().then(() => {
    console.log("Updated tracks successfully.");

    console.log("Initiating interval...");
    setInterval(main, config.interval);
    console.log(`Set an interval for every ${config.interval / 1000 / 60} minutes.`);
});
