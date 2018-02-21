const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');
var util = require('util');

var roleRepairman = {
  run: function (creep)
  {
    var energyStorageStructures = cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, Game.rooms[creep.memory.homeRoom]);

    //if creep is empty and storage is not, fill up the creep.
    if (creep.carry.energy == 0 && energyStorageStructures.length > 0)
    {
      creep.memory.targetID = -1;
      creep.memory.task = CONST.TASK_FILLFROMBASE;
      return;
    }

    var damagedStructures = cacheFind.findCached(CONST.CACHEFIND_DAMAGEDSTRUCTURES, Game.rooms[creep.memory.workRoom]);

    //if there is something to repair, repair it.
    if (damagedStructures.length > 0)
    {
      creep.memory.targetID = damagedStructures[Math.floor(Math.random() * damagedStructures.length)].id;
      creep.memory.task = CONST.TASK_REPAIR;
      return;
    }
    //else there is nothing to repair, so do other stuff
    else
    {
      //if its a mainroom repairman, then upgrade
      if (creep.memory.workRoom == creep.memory.homeRoom)
      {
        creep.memory.task = CONST.TASK_UPGRADEROOM;
        return;
      }

      //if its an ext roleRepairman

      //refill first
      if (creep.carry.energy < creep.carryCapacity)
      {
        creep.memory.targetID = -1;
        creep.memory.task = CONST.TASK_FILLFROMBASE;
        return;
      }

      //Then idle.
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

    return;

  }
};
module.exports = roleRepairman;