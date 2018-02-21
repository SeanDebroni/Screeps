const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');
var util = require('util');
var roleBuilder = {

  run: function (creep)
  {

    if (cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, Game.rooms[creep.memory.homeRoom])
      .length == 0 && creep.carry.energy == 0)
    {
      var flag = Game.flags[creep.memory.homeRoom + "idle"];
      if (flag != undefined && flag != null)
      {
        creep.moveTo(flag,
        {
          reusePath: 10
        });
        return;
      }
    }

    if (creep.carry.energy < creep.carryCapacity * 0.1)
    {
      creep.memory.targetID = -1;
      creep.memory.task = CONST.TASK_FILLFROMBASE;
      return;
    }

    var targets = cacheFind.findCached(CONST.CACHEFIND_CONSTRUCTIONSITES, util.getWorkRoom(creep));
    if (targets.length > 0)
    {
      creep.memory.targetID = targets[0].id;
      creep.memory.task = CONST.TASK_BUILD;
      return;
    }

    var damagedStructures = cacheFind.findCached(CONST.CACHEFIND_DAMAGEDSTRUCTURES, Game.rooms[creep.memory.workRoom]);
    if (damagedStructures.length > 0)
    {
      creep.memory.targetID = damagedStructures[Math.floor(Math.random() * damagedStructures.length)].id;
      creep.memory.task = CONST.TASK_REPAIR;
      return;
    }

    creep.memory.workRoom = creep.memory.homeRoom;
    creep.memory.task = CONST.TASK_UPGRADEROOM;
    return;

  }
};

module.exports = roleBuilder;