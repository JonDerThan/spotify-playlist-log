"use strict";

module.exports = function (track) {
    return `**${track.name}** by **${track.artists.join(", ")}** on **${track.album}** (added by **${track.addedBy}**)`;
}
