Logs changes to a spotify playlist to a discord channel.

# Installation

1. [Download](https://github.com/JonDerThan/spotify-playlist-log/archive/master.zip) this repository and unzip it.
2. Install the dependencies by running `npm install`.
3. Run `node setup.js` to create a config file.
4. Fill in the missing fields. How to obtain certain keys is described [below](#obtaining-the-keys).
5. Run `node setup.js` again. The tracks of the playlist will be saved.

# Usage

Run `node index.js` to start the program.

The program will save the current state of the playlist every 30 minutes. If it observes any changes to the previously saved version it will log them to the discord channel.

The program is not required to run 24/7 but it is recommended to let the program run at least once per day to log every change. You could also let the program run in the daytime and stop it at night.

**Note:** If a track gets added and removed without the program updating the playlists state in between, the change will slip because the program won't observe any difference between the old state and the new state.

# Obtaining the keys
Field | How to obtain
-|-
playlistID | [Playlist ID](#playlist-id)
webhook | [Discord webhook](#discord-webhook)
spotifyCreds | [Spotify credentials](#spotify-credentials)

## Playlist ID
Copy the playlists URI (as described [here](https://community.spotify.com/t5/Spotify-Answers/What-s-a-Spotify-URI/ta-p/919201)), which should look like this: `spotify:playlist:37i9dQZF1DXdipfKDeMPTE`. The last part (`37i9dQZF1DXdipfKDeMPTE`) is the playlists id.

## Discord webhook
Create a webhook as described [here](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks). Its URL should have the form `https://discordapp.com/api/webhooks/{id}/{token}`. Now you can copy & paste the id and token. The webhooks name and icon can be changed later.


## Spotify credentials
1. Open [this](https://developer.spotify.com/dashboard/) link.
2. Log in.
3. Click on "_Create an app_". Examples for name and description:
    App name | App description
    -|-
    spotify-playlist-log | Logs changes to a spotify playlist to a discord channel.
4. Now you can copy & paste the apps id and its secret.
