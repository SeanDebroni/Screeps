const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');
var util = require('util');

var roleRepairman = {
  run: function (creep)
  {
    var damagedStructures = cacheFind.findCached(CONST.CACHEFIND_DAMAGEDSTRUCTURES, Game.rooms[creep.memory.workRoom]);

    if (cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, Game.rooms[creep.memory.homeRoom])
      .length == 0 && (creep.carry.energy == 0 || damagedStructures.length == 0))
    {
      var flag = Game.flags[creep.memory.homeRoom + "idle"];
      if (flag != undefined && flag != null)
      {
        creep.moveTo(flag,
        {
          reusePath: 10
        });
      }
    }

    if (creep.carry.energy == 0)
    {
      creep.memory.targetID = -1;
      creep.memory.task = CONST.TASK_FILLFROMBASE;
    }
    else
    {

      if (damagedStructures.length == 0)
      {
        if (util.getWorkRoom(creep) == util.getHomeRoom(creep))
        {
          creep.memory.task = CONST.TASK_UPGRADEROOM;
        }
        return;
      }

      creep.memory.targetID = damagedStructures[Math.floor(Math.random() * damagedStructures.length)].id;
      creep.memory.task = CONST.TASK_REPAIR;
    }

  }
};
module.exports = roleRepairman;