"use strict";

const SpotifyWebApi = require("spotify-web-api-node");

const config = require("./config.json");

let spotify = new SpotifyWebApi(config.spotifyCreds);

async function getSpotifyToken() {
    return new Promise((resolve, reject) => {
        spotify.clientCredentialsGrant().then((data) => {
            spotify.setAccessToken(data.body["access_token"]);

            setTimeout(getSpotifyToken, data.body["expires_in"] * 1000);

            resolve();
        }, reject);
    });
}

let defer = getSpotifyToken();

module.exports = async function () {
    await defer;

    return convertTracks(await getTracks());
}

async function getTracks() {
    return await fetchAllPlaylistTracks(config.playlistID, {
        fields: "items(added_by.id, track(id, name, album(name, images), artists(name))), total"
    }).catch((err) => {
        if (err.statusCode == 429) {
            console.log(`Rate limit was hit, retry after ${data.headers["Retry-After"]} seconds.`);
        }

        else throw err;
    });
}

async function fetchAllPlaylistTracks(playlistID, options = {}, items = []) {
    return new Promise((resolve, reject) => {
        spotify.getPlaylistTracks(playlistID, options).then((data) => {
            items = items.concat(data.body.items);

            if (items.length < data.body.total) {
                options.offset = items.length;

                fetchAllPlaylistTracks(playlistID, options, items).then(resolve, reject);
            }

            else {
                resolve(items);
            }
        }, reject);
    });
}

function convertTracks(tracks) {
    return tracks.map((item) => {
        return {
            id: item.track.id,
            name: item.track.name,
            album: item.track.album.name,
            artists: item.track.artists.map((artist) => artist.name),
            imageURL: item.track.album.images[0].url,
            addedBy: item.added_by.id
        };
    });
}
