'use strict';
var cacheFind = require('cacheFind');
const CONST = require('CONSTANTS');


module.exports = {
  repairUnderCreep(creep)
  {
    let hasWork = creep.memory.hasWorkPart;
    if (hasWork || hasWork == undefined)
    {
      if (creep.carry.energy > 0)
      {
        let road = creep.pos.lookFor(LOOK_STRUCTURES);
        if (road.length > 0)
        {
          if (road[0].hits < road[0].hitsMax)
          {
            let ret = creep.repair(road[0]);
            if (ret == -12)
            {
              creep.memory.hasWorkPart = false;
            }
          }
        }
      }
    }
  },
  moveOffEdge(creep)
  {
    let rand = Math.random();
    if (creep.pos.x >= 46)
    {
      if (rand < 0.33)
      {
        creep.move(LEFT);
      }
      else if (rand < 0.66)
      {
        creep.move(BOTTOM_LEFT);
      }
      else
      {
        creep.move(TOP_LEFT);
      }
    }
    else if (creep.pos.x <= 3)
    {
      if (rand < 0.33)
      {
        creep.move(RIGHT);
      }
      else if (rand < 0.66)
      {
        creep.move(TOP_RIGHT);
      }
      else
      {
        creep.move(BOTTOM_RIGHT);
      }
    }
    else if (creep.pos.y >= 46)
    {
      if (rand < 0.33)
      {
        creep.move(TOP);
      }
      else if (rand < 0.66)
      {
        creep.move(TOP_RIGHT);
      }
      else
      {
        creep.move(TOP_LEFT);
      }

    }
    else if (creep.pos.y <= 3)
    {
      if (rand < 0.33)
      {
        creep.move(BOTTOM);
      }
      else if (rand < 0.66)
      {
        creep.move(BOTTOM_LEFT);

      }
      else
      {
        creep.move(BOTTOM_RIGHT);
      }
    }
  },
  shouldKite(target)
  {
    let rangePart = false;
    let meleePart = false;
    for (var i = 0; i < target.body.length; ++i)
    {
      if (target.body[i].type == ATTACK)
      {
        return true;
      }
    }
    return false;
  },
  outputMovementError(err, creep, position)
  {
    /*
        console.log("#$#$#$#$#$#$#$#$#$#$#$#$#$");
        console.log("FROM: ");
        console.log(creep.pos);
        console.log("TO: ");
        console.log(position);
        console.log(err);*/
  },
  findOpenSpotAdjacent(roomPos)
  {

  },
  moveToWalkable(creep, thing, reuse = 17)
  {
    return creep.moveTo(thing,
    {
      reusePath: reuse,
      maxOps: 3000
    });
  },
  moveToNonWalkable(creep, thing, reuse = 17)
  {
    return creep.moveTo(thing,
    {
      reusePath: reuse,
      range: 1,
      maxOps: 3000
    });
  },
  moveToOffRoadNonWalkable(creep, thing, reuse = 17)
  {
    return creep.moveTo(thing,
    {
      reusePath: reuse,
      plainCost: 1,
      swampCost: 5,
      range: 1,
      maxOps: 3000
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
  shouldFleeFrom(creep)
  {
    for (var i = 0; i < creep.body.length; ++i)
    {
      if (creep.body[i].type == ATTACK || creep.body[i].type == RANGED_ATTACK)
      {
        return true;
      }
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
  moveToRoom(creep, roomName, x = 25, y = 25, pathRange = 20)
  {
    const pos = new RoomPosition(x, y, roomName);
    var err = creep.moveTo(pos,
    {
      reusePath: 17,
      range: pathRange,
      maxOps: 3000
    });

    return err;
  },
  isAdjacent: function(pos1, pos2)
  {
    if (Math.abs(pos1.x - pos2.x) <= 1 && Math.abs(pos1.y - pos2.y) <= 1)
    {
      return true;
    }
    return false;
  },
  getNotBusySpawns: function(room)
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
  getHomeRoom: function(creep)
  {
    var ret = Game.rooms[creep.memory.homeRoom];
    if (ret == undefined)
    {
      return creep.room;
    }
    return ret;
  },
  getWorkRoom: function(creep)
  {
    var ret = Game.rooms[creep.memory.workRoom];
    if (ret == undefined && creep.memory.role != CONST.ROLE_RESERVER)
    {
      return creep.room;
    }
    return ret;
  },
  cleanUpDeadCreeps: function()
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
