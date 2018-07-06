'use strict';
var cacheFind = require('cacheFind');
const CONST = require('CONSTANTS');

//indexed by RCName
let rememberedRoads = {};
//Each thing in rememberedRoads is an object
//  RememberedRoads
//    0000
//      TimeToCheck
//      W32S67
//        roads
//      W63S75
//        Roads
//They get added if there is an extension flag in that room.
//They have two fields in them. TimeToCheck, and Roads.
//Roads contains an array of x,y pairs.
//TimeToCheck has a timer that goes down every tick.

function setUpNewRoom(roomController, rcName)
{
  let newMainRoomRecord = {
    TimeToCheck: CONST.VAL_MAINTAINROADSTIMER
  };

  let rooms = Object.keys(roomController);
  for (let i = 0; i < rooms.length; ++i)
  {
    let roomName = rooms[i];
    let absRoomName = roomController[roomName];
    let room = Game.rooms[absRoomName];

    let roomType = roomName.charAt(0);
    if (roomType == "M" || roomType == "E")
    {
      if ((room != undefined && room.controller.level > 4 && roomType == "M") || roomType == "E")
      {
        if (!room)
        {
          newMainRoomRecord[absRoomName] = [];
          continue;
        }

        let roads = cacheFind.findCached(CONST.CACHEFIND_FINDROADS, room);
        let roadPositions = [];
        for (let j = 0; j < roads.length; ++j)
        {
          roadPositions.push(
          {
            x: roads[j].pos.x,
            y: roads[j].pos.y
          });
        }
        newMainRoomRecord[absRoomName] = roadPositions;
      }
    }
  }
  return newMainRoomRecord;

}
module.exports = {

  clear: function()
  {
    rememberedRoads = {};
  },

  //returns true if it maintained roads, false otherwise.
  maintainRoads: function(roomController, rcName)
  {
    //Check if it is time for a maintance run.
    let mainRoomRecord = rememberedRoads[rcName];

    //Same as mainRoomRecord == undefined || mainRoomRecord == null???
    if (mainRoomRecord)
    {
      let checkTimer = mainRoomRecord.TimeToCheck;
      if (checkTimer > 0)
      {
        mainRoomRecord.TimeToCheck = checkTimer - 1;
        return false;
      }
      else
      {
        mainRoomRecord.TimeToCheck = CONST.VAL_MAINTAINROADSTIMER;
        let roomsToMaintain = _.filter(Object.keys(mainRoomRecord), (room) => (isNaN(mainRoomRecord[room])));

        for (let i = 0; i < roomsToMaintain.length; ++i)
        {
          let roomMaintainingName = roomsToMaintain[i];
          let roomMaintaining = Game.rooms[roomMaintainingName];
          //Have no sight of room, cant do anything there.
          if (!roomMaintaining)
          {
            continue;
          }
          let oldRoads = mainRoomRecord[roomMaintainingName];
          let newRoads = cacheFind.findCached(CONST.CACHEFIND_FINDROADS, roomMaintaining);

          if (oldRoads.length == newRoads.length)
          {
            continue;
          }
          //added a new road, update
          else if (newRoads.length > oldRoads.length)
          {
            let roadPositions = [];
            for (let j = 0; j < newRoads.length; ++j)
            {
              roadPositions.push(
              {
                x: newRoads[j].pos.x,
                y: newRoads[j].pos.y
              });
            }
            mainRoomRecord[roomMaintaining] = roadPositions;
            continue;
          }
          //remake road
          else //newRoads.length<oldRoads.pathLength
          {

            oldRoads.sort(function(a, b)
            {
              if (a.x != b.x)
              {
                return a.x - b.x;
              }
              else
              {
                return a.y - b.y;
              }
            });

            newRoads.sort(function(a, b)
            {
              if (a.pos.x != b.pos.x)
              {
                return a.pos.x - b.pos.x;
              }
              else
              {
                return a.pos.y - b.pos.y;
              }
            });

            let z = 0;
            let x = 0;

            while (z < oldRoads.length && x < newRoads.length)
            {
              let oldPos = oldRoads[z];
              let newPos = newRoads[x].pos;

              if (oldPos.x == newPos.x && oldPos.y == newPos.y)
              {
                z = z + 1;
                x = x + 1;
                continue;
              }
              else
              {
                console.log("REMAKING ROAD AT " + oldRoads[z].x + " " + oldRoads[z].y);
                roomMaintaining.createConstructionSite(oldRoads[z].x, oldRoads[z].y, STRUCTURE_ROAD);
                z = z + 1;
                continue;
              }
            }
          }

        }

        return true;
      }
    }
    else
    {
      //WE NEED TO SET UP THAT ROOM.
      rememberedRoads[rcName] = setUpNewRoom(roomController, rcName);
      return true; //effectively did the work anyways
    }

    console.log("WHY IS THIS BEING CALLED ERRORRRRR");
  }



}
