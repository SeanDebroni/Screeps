'use strict';
const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');
var cacheMoveTo = require('cacheMoveTo');
var util = require('util');

var taskRecycle = {
  run: function (creep)
  {
    if (creep.memory.targetID != -1)
    {
      var spawns = cacheFind.findCached(CONST.CACHEFIND_SPAWNS, util.getHomeRoom(creep));
      if (spawns.length > 0)
      {
        creep.memory.targetID = spawns[0].id;
      }
      else
      {
        console.log("FIX YOUR DAMN RECYCLE CODE SO YOU CAN RECYCLE TO OTHER ROOMS");
      }
      if (creep == null || Game.getObjectById(creep.memory.targetID) == null)
      {
        console.log("something darned fucked up with target of spawn");
        return;
      }
      var posCreep = creep.pos;

      var posSpawner = Game.getObjectById(creep.memory.targetID)
        .pos;
      if (posCreep.x - posSpawner.x >= -1 && posCreep.x - posSpawner.x <= 1 && posCreep.y - posSpawner.y >= -1 && posCreep.y - posSpawner.y <= 1 && creep.room.name == Game.getObjectById(creep.memory.targetID)
        .room.name)
      {
        creep.memory.task = CONST.TASK_WAITINGTOBERECYCLED;
      }
      else
      {
        cacheMoveTo.cacheMoveTo(creep, Game.getObjectById(creep.memory.targetID));
      }

    }
    else
    {
      var spawns = cacheFind.findCached(CONST.CACHEFIND_SPAWNS, util.getHomeRoom(creep));
      if (spawns.length > 0)
      {
        creep.memory.targetID = spawns[0].id;
      }
    }
  }

}
module.exports = taskRecycle;