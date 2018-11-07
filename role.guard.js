'use strict';
const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');
var util = require('util');

var roleGuard = {

  run: function(creep)
  {
    let a = cacheFind.findCached(CONST.CACHEFIND_HOSTILETOWERS, creep.room);
    if (a.length > 0)
    {
      if (creep.memory.patrolRoom != undefined)
      {
        if (creep.room.name != creep.memory.patrolRoom)
        {
          util.moveToRoom(creep, creep.memory.patrolRoom);
          return;
        }
      }
    }

    let hostiles = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, creep.room);

    if (creep.hits < creep.hitsMax)
    {
      creep.heal(creep);
    }
    if (hostiles.length > 0)
    {
      creep.memory.task = CONST.TASK_KILL;
      creep.memory.targetID = hostiles[0].id;
      return;
    }

    let sourceKeepers = cacheFind.findCached(CONST.CACHEFIND_HOSTILESOURCEKEEPERS, creep.room);

    for (var i = 0; i < sourceKeepers.length; ++i)
    {
      if (creep.pos.getRangeTo(sourceKeepers[i]) < 3)
      {
        creep.memory.task = CONST.TASK_KILL;
        creep.memory.targetID = sourceKeepers[i].id;
        return;
      }
    }


    let patrolRoom = creep.memory.patrolRoom;
    if (patrolRoom == undefined) patrolRoom = creep.memory.workRoom;
    if (creep.room.name != patrolRoom)
    {
      util.moveToRoom(creep, patrolRoom);
      return;
    }
    util.moveOffEdge(creep);

    //creep.moveToWalkable(creep.memory.idleX, creep.memory.idleY);

  }

};

module.exports = roleGuard;
