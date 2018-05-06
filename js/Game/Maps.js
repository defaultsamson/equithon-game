var xOffset = 0;

const HIGH_BOUND = 10; // blocks 
const LOW_BOUND = 18; // blocks

const pieceNames = ["test1", "test2", "test3", "test4", "test5", "test6", "entrance",
                    "classroom", "ruins", "floors", "gym", "soccer", "houses1", "spiral"];
var pieces = [];

function initMapPieces() {
    for (var i in pieceNames) {
        pieces.push({
            change: getAltitudeChange(pieceNames[i]),
            json: game.cache.getJSON(pieceNames[i])
        })
    }
}

function generateRandomMap(generateUntil) {
    while (xOffset < generateUntil) {
        var altitude = currentAltitude();
        var acceptablePieces = [];

        for (var i in pieces) {
            var newAltitude = altitude + pieces[i].change
            console.log("newAltitude: " + newAltitude)
            if (newAltitude <= LOW_BOUND && newAltitude >= HIGH_BOUND) {
                acceptablePieces.push(pieces[i])
                console.log("dank")
            }
        }

        if (acceptablePieces.length == 0) {
            console.log("ERROR: couldn't find suitable piece. This should never happen!")
            break;
        }
        var piece = acceptablePieces[getRandomInt(0, acceptablePieces.length - 1)]

        addMap(piece.json);
    }
}

function getAltitudeChange(toAdd) {
    var taMap = game.cache.getJSON(toAdd);
    var data = taMap.layers[0].data;
    var width = taMap.layers[0].width;
    var height = taMap.layers[0].height;

    var startHeight = 0;
    for (var y = 0; y < height; y++) {
        // Empty tile
        if (data[y * width] == 0) {
            startHeight++;
        } else {
            break;
        }
    }

    var endHeight = 0;
    for (var y = 0; y < height; y++) {
        // Empty tile
        if (data[y * width + width - 1] == 0) {
            endHeight++;
        } else {
            break;
        }
    }

    return endHeight - startHeight;
}

function currentAltitude() {
    var altitude = 0;
    for (var y = 0; y < WORLD_HEIGHT; y++) {
        if (map.getTile(xOffset - 1, y, layer1)) {
            break;
        } else {
            altitude++;
        }
    }
    return altitude;
}

function getYOffset(data, width, height) {
    var offsetHeight = 0;
    for (var y = 0; y < height; y++) {
        // Empty tile
        if (data[y * width] == 0) {
            offsetHeight++;
        } else {
            break;
        }
    }

    // If xOffset == 0 then this is the first block, just place normally
    return xOffset == 0 ? 0 : currentAltitude() - offsetHeight;
}

function addMapByName(toAdd) {
    addMap(game.cache.getJSON(toAdd));
}

function addMap(toAdd) {

    var data = toAdd.layers[0].data;
    var width = toAdd.layers[0].width;
    var height = toAdd.layers[0].height;

    var yOffset = getYOffset(data, width, height);

    var solidLayer = true;

    for (var x = 0; x < width; x++) {

        if (!solidLayer) {
            for (var y = 0; y < height; y++) {
                map.putTile(data[x + width * y] - 1, x + xOffset, y + yOffset, layer0);
            }
        } else {
            var y = 0;
            var yCoord;
            while ((yCoord = y + yOffset) < WORLD_HEIGHT) {
                var index = x + width * y;
                // if the index is within the range of the array
                if (index < width * height) {
                    var id = data[x + width * y] - 1;
                    if (id >= 0) {
                        // Tile contains something, use it
                        map.putTile(id, x + xOffset, yCoord, layer1);
                    } else {
                        // Tile is empty
                        // Check if all the other blocks in this column are empty
                        var empty = true; // Assume that they are
                        var y2 = y + 1; // start searching from the next block
                        var yCoord2;
                        while ((yCoord2 = y2 + yOffset) < WORLD_HEIGHT) {
                            var index2 = x + width * y2;
                            if (index2 < width * height) {
                                var id2 = data[x + width * y2] - 1;
                                if (id2 >= 0) {
                                    // Tile contains something
                                    empty = false;
                                    break;
                                }
                            } else {
                                // below the file
                                break;
                            }
                            y2++;
                        }

                        if (empty) {
                            var y3 = y;
                            var yCoord3;
                            // replace all the following blocks with dirt
                            while ((yCoord3 = y3 + yOffset) < WORLD_HEIGHT) {
                                map.putTile(DIRT_INDEX, x + xOffset, yCoord3, layer1);
                                y3++;
                            }
                            break;
                        } // Otherwise continue down the column
                    }
                } else {
                    // below the file, fill with dirty things
                    map.putTile(DIRT_INDEX, x + xOffset, yCoord, layer1);
                }
                y++;
            }
        }
    }
    xOffset += width;
}
