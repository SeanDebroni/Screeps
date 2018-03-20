'use strict';
const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');
var util = require('util');

var taskRecycle = {
  run: function (creep)
  {
    if (creep.memory.targetID != -1 && creep.memory.targetID != undefined)
    {
      if (Game.getObjectById(creep.memory.targetID) == null)
      {
        console.log("something darned fucked up with target of spawn");
        return;
      }
      var posCreep = creep.pos;

      var posSpawner = Game.getObjectById(creep.memory.targetID)
        .pos;
      if (posCreep.isNearTo(posSpawner))
      {
        creep.memory.task = CONST.TASK_WAITINGTOBERECYCLED;
      }
      else
      {
        util.moveToNonWalkable(creep, Game.getObjectById(creep.memory.targetID));
      }

    }
    else
    {
      var spawns = cacheFind.findCached(CONST.CACHEFIND_SPAWNS, util.getHomeRoom(creep));
      if (spawns.length > 0)
      {
        creep.memory.targetID = spawns[0].id;
        util.moveToNonWalkable(creep, spawns[0]);
      }
    }
  }

}
module.exports = taskRecycle;