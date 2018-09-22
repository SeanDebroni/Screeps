'use strict';
const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');
var util = require('util');
var roleBuilder = {

  run: function(creep)
  {

    //If there is no energy to be used in room, and no energy on the builder, go idle.
    if (cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, Game.rooms[creep.memory.homeRoom])
      .length == 0 && creep.carry.energy == 0)
    {
      var flag = Game.flags[creep.memory.homeRoom + "idle"];
      if (flag != undefined && flag != null)
      {
        util.moveToWalkable(creep, flag, 50);
        return;
      }
    }

    //If builder needs energy, fill it up.
    if (creep.carry.energy < creep.carryCapacity * 0.1)
    {
      creep.memory.targetID = -1;
      creep.memory.task = CONST.TASK_FILLFROMBASE;
      return;
    }

    //if there is a target to build, build it.
    var targets = cacheFind.findCached(CONST.CACHEFIND_CONSTRUCTIONSITES, util.getWorkRoom(creep));
    if (targets.length > 0)
    {
      creep.memory.targetID = targets[0].id;
      creep.memory.task = CONST.TASK_BUILD;
      return;
    }

    //if there is a target to repair, repair it.
    var damagedStructures = cacheFind.findCached(CONST.CACHEFIND_DAMAGEDSTRUCTURES, Game.rooms[creep.memory.workRoom]);
    if (damagedStructures.length > 0)
    {
      var damagedStructures2 = cacheFind.findCached(CONST.CACHEFIND_CRITICALDAMAGEDSTRUCTURES, Game.rooms[creep.memory.workRoom]);
      if (damagedStructures2.length > 0)
      {
        creep.memory.targetID = damagedStructures2[Math.floor(Math.random() * damagedStructures2.length)].id;
      }
      else
      {
        creep.memory.targetID = damagedStructures[Math.floor(Math.random() * damagedStructures.length)].id;
      }
      creep.memory.task = CONST.TASK_REPAIR;
      return;
    }

    //recycle the builder.
    creep.memory.role = CONST.TASK_RECYCLE;
    creep.memory.task = CONST.TASK_RECYCLE;
    creep.memory.targetID = -1;
    return;

  }
};

module.exports = roleBuilder;
