'use strict';
const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');

let RoadCostMatrix = {};

function makeRoadsFrom(posA, posB)
{
  var foundPath = PathFinder.search(posA, posB,
  {
    plainCost: 7,
    swampCost: 21,
    range: 1,
    maxRooms: 3,
    maxCost: 2000,
    roomCallback: function (roomName)
    {
      if (RoadCostMatrix[roomName] != undefined)
      {
        return RoadCostMatrix[roomName];
      }
      var room = Game.rooms[roomName];
      if (room != undefined && room != null)
      {
        console.log(roomName);
        RoadCostMatrix[roomName] = new PathFinder.CostMatrix;

        room.find(FIND_STRUCTURES)
          .forEach(function (struct)
          {
            if (struct.structureType == STRUCTURE_EXTENSION ||
              struct.structureType == STRUCTURE_STORAGE ||
              struct.structureType == STRUCTURE_TOWER ||
              struct.structureType == STRUCTURE_LAB ||
              struct.structureType == STRUCTURE_TERMINAL)
            {
              RoadCostMatrix[roomName].set(struct.pos.x, struct.pos.y, 0xff);
            }
          });

        room.find(FIND_STRUCTURES)
          .forEach(function (struct)
          {
            if (struct.structureType == STRUCTURE_ROAD)
            {
              RoadCostMatrix[roomName].set(struct.pos.x, struct.pos.y, 6);
            }
          });

      }
      return RoadCostMatrix[roomName];
    }

  });

  var path = foundPath.path;
  var sumPlaced = 0;
  for (var i = 0; i < path.length; ++i)
  {
    var res = Game.rooms[path[i].roomName].createConstructionSite(path[i], STRUCTURE_ROAD);
    if (res == ERR_FULL) return res;
    if (res == OK) sumPlaced = sumPlaced + 1;
  }
  return sumPlaced;

}

module.exports = {


  buildBasicRoads: function (mainRoom, extRooms)
  {
    var mainSources = cacheFind.findCached(CONST.CACHEFIND_SOURCES, mainRoom);
    var mainSpawns = cacheFind.findCached(CONST.CACHEFIND_SPAWNS, mainRoom);

    var mainBuildings = mainRoom.find(FIND_STRUCTURES,
    {
      filter: (structure) =>
      {
        return (structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_STORAGE ||
          structure.structureType == STRUCTURE_TOWER ||
          structure.structureType == STRUCTURE_LAB ||
          structure.structureType == STRUCTURE_TERMINAL ||
          structure.structureType == STRUCTURE_CONTAINER)


      }
    });

    //Build road main rooms
    let res;
    for (var i = 0; i < mainSpawns.length; ++i)
    {
      //From spawn to source
      for (var j = 0; j < mainSources.length; ++j)
      {
        res = makeRoadsFrom(mainSpawns[i].pos, mainSources[j].pos);
        if (res == ERR_FULL) return;
      }

      for (var j = 0; j < mainBuildings.length; ++j)
      {
        res = makeRoadsFrom(mainSpawns[i].pos, mainBuildings[j].pos);
        if (res == ERR_FULL) return;

      }
    }

    //Build roads ext rooms
    for (var i = 0; i < extRooms.length; ++i)
    {
      var extSources = cacheFind.findCached(CONST.CACHEFIND_SOURCES, extRooms[i]);

      for (var j = 0; j < mainSpawns.length; ++j)
      {
        for (var k = 0; k < extSources.length; ++k)
        {
          res = makeRoadsFrom(mainSpawns[j].pos, extSources[k].pos);
          if (res == ERR_FULL) return;

        }
      }
    }
    //from spawn to source
  }


}