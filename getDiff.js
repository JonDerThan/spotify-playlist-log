"use strict";

module.exports = function(oldArr, newArr) {
    return {
        removed: oldArr.filter((oldTrack) => isNotIn(oldTrack.id, newArr)),
        added: newArr.filter((newTrack) => isNotIn(newTrack.id, oldArr))
    };
}

function isNotIn(id, arr) {
    return arr.findIndex((track) => track.id === id) === -1;
}
