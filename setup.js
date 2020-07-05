"use strict";

const fs = require("fs");
const path = require("path");

const SpotifyWebApi = require("spotify-web-api-node");

if (!fs.existsSync("./config.json")) {
    fs.writeFileSync("./config.json", fs.readFileSync("./config-example.json"));

    console.log("A config file was automatically created, please fill in the missing fields.");

    process.exit();
}

const config = require("./config.json");

const getAllPlaylistTracks = require("./getAllPlaylistTracks.js");

if (!fs.existsSync(config.dataDir)) fs.mkdirSync(config.dataDir);

if (!fs.existsSync(path.join(config.dataDir, "history/"))) fs.mkdirSync(path.join(config.dataDir, "history/"));

console.log("Fetching tracks for the first time...")
getAllPlaylistTracks().then((tracks) => {
    let file0 = path.join(config.dataDir, "tracks.json")

    fs.writeFileSync(file0, JSON.stringify(tracks));

    console.log(`Wrote tracks to "${file0}".`);

    process.exit();
});
