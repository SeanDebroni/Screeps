'use strict';
let cacheGetDistanceMap = new Map();
var util = require('util');

var startSize;

function getKeyFromRoomPositions(startPos, endPos)
{

  return startPos.x + "" + startPos.roomName + "" +
    startPos.y + " " + endPos.x + "" + endPos.roomName + "" +
    endPos.y;
}

module.exports = {

  //NOTE - ONLY USE THIS FOR FIXED LOCATIONS. USING IT FOR DYNAMIC LOCATIONS WILL CLOG MEMORY.
  cachedGetDistance(startPos, endPos)
  {
    var key = getKeyFromRoomPositions(startPos, endPos);
    if (cacheGetDistanceMap.has(key))
    {
      return cacheGetDistanceMap.get(key);
    }
    else
    {
      let distance = util.getDistance(startPos, endPos);
      cacheGetDistanceMap.set(key, distance);
      return distance;
    }
  },
  cachedGetDistanceSave: function ()
  {
    if (cacheGetDistanceMap.size == startSize)
    {
      return;
    }
    if (cacheGetDistanceMap.size > 0)
    {
      Memory.cacheGetDistanceMapSize = cacheGetDistanceMap.size;
      Memory.cacheGetDistanceMap = JSON.stringify([...cacheGetDistanceMap]);
    }

  },

  cachedGetDistanceClear: function ()
  {
    cacheMoveToM = new Map();
    Memory.cacheGetDistanceMapSize = 0;
    Memory.cacheGetDistanceMap = undefined;

  },

  cachedGetDistanceLoad: function ()
  {
    startSize = cacheGetDistanceMap.size;
    if (startSize > 0)
    {
      return;
    }

    if (Memory.cacheGetDistanceMap != undefined)
    {
      var temp = JSON.parse(Memory.cacheGetDistanceMap);
      var tempArr = temp.toString()
        .split(',');
      var arrSize = Memory.cacheGetDistanceMapSize;
      cacheGetDistanceMap = new Map();
      for (var i = 0; i < arrSize * 2; i = i + 2)
      {
        cacheGetDistanceMap.set(tempArr[i], tempArr[i + 1]);
      }
    }
  }
}