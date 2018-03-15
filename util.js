'use strict';
var cacheFind = require('cacheFind');
const CONST = require('CONSTANTS');


module.exports = {
  moveToWalkable(creep, thing, reuse = 17)
  {
    return creep.moveTo(thing,
    {
      reusePath: reuse
    });
  },
  moveToNonWalkable(creep, thing, reuse = 17)
  {
    return creep.moveTo(thing,
    {
      reusePath: reuse,
      range: 1
    });
  },
  countWorkParts(creep)
  {
    var workCount = 0;
    for (var i = 0; i < creep.body.length; ++i)
    {
      if (creep.body[i].type == WORK)
      {
        workCount = workCount + 1;
      }
    }
    return workCount;
  },
  isDangerousCreep(creep)
  {
    var workcount = 0;
    for (var i = 0; i < creep.body.length; ++i)
    {
      if (creep.body[i].type == ATTACK || creep.body[i].type == RANGED_ATTACK)
      {
        return true;
      }
      if (creep.body[i].type == WORK)
      {
        workcount = workcount + 1;
      }
    }
    if (workcount > creep.body.length / 3)
    {
      return true;
    }
    return false;
  },
  getDistance(startPos, endPos)
  {

    let path = startPos.findPathTo(endPos,
    {
      ignoreCreeps: true,
      ignoreRoads: true,
      range: 1
    });

    let pathLength = path.length;

    if (startPos.roomName == endPos.roomName)
    {
      return pathLength;
    }
    let route = Game.map.findRoute(startPos.roomName, endPos.roomName);
    let curPos;
    let roomAdj = Game.map.describeExits(startPos.roomName);

    for (let i = 0; i < route.length; ++i)
    {
      curPos = new RoomPosition(path[path.length - 1].x, path[path.length - 1].y, startPos.roomName);
      switch (curPos.x)
      {
      case 0:
        curPos.x = 49;
        curPos.roomName = roomAdj[LEFT];
        break;
      case 49:
        curPos.x = 0;
        curPos.roomName = roomAdj[RIGHT];
        break;
      }
      switch (curPos.y)
      {
      case 0:
        curPos.y = 49;
        curPos.roomName = roomAdj[TOP];
        break;
      case 49:
        curPos.y = 0;
        curPos.roomName = roomAdj[BOTTOM];
        break;
      }

      roomAdj = Game.map.describeExits(curPos.roomName);
      path = curPos.findPathTo(endPos,
      {
        ignoreCreeps: true,
        ignoreRoads: true,
        range: 1
      });

      pathLength = pathLength + path.length;
    }
    return pathLength;
  },
  moveToRoom(creep, roomName, x = 25, y = 25)
  {
    const pos = new RoomPosition(x, y, roomName);
    return creep.moveTo(pos,
    {
      reusePath: 17
    });
  },
  isAdjacent: function (pos1, pos2)
  {
    if (Math.abs(pos1.x - pos2.x) <= 1 && Math.abs(pos1.y - pos2.y) <= 1)
    {
      return true;
    }
    return false;
  },
  getNotBusySpawns: function (room)
  {
    var spawns = cacheFind.findCached(CONST.CACHEFIND_SPAWNS, room);
    var notBusySpawns = [];
    //How many of them are spawning currently?
    for (var i = 0; i < spawns.length; ++i)
    {
      if (spawns[i].spawning == null)
      {
        notBusySpawns.push(spawns[i]);
      }
    }
    return notBusySpawns;
  },
  getHomeRoom: function (creep)
  {
    var ret = Game.rooms[creep.memory.homeRoom];
    if (ret == undefined)
    {
      return creep.room;
    }
    return ret;
  },
  getWorkRoom: function (creep)
  {
    var ret = Game.rooms[creep.memory.workRoom];
    if (ret == undefined && creep.memory.role != CONST.ROLE_RESERVER)
    {
      return creep.room;
    }
    return ret;
  },
  cleanUpDeadCreeps: function ()
  {
    for (var name in Memory.creeps)
    {
      if (!Game.creeps[name])
      {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }
  }

};