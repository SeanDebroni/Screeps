const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');
var util = require('util');
var roleBuilder = {

    run: function(creep) {
      if(creep.carry.energy < creep.carryCapacity*0.1)
      {
        creep.memory.targetID = -1;
        creep.memory.task = CONST.TASK_FILLFROMBASE;
      }
      else
      {
        var targets = cacheFind.findCached(CONST.CACHEFIND_CONSTRUCTIONSITES, util.getWorkRoom(creep));
        if( targets.length > 0 )
        {
          creep.memory.targetID = targets[0].id;
          creep.memory.task = CONST.TASK_BUILD;
        }
        else
        {
          var damagedStructures = cacheFind.findCached(CONST.CACHEFIND_DAMAGEDSTRUCTURES, Game.rooms[creep.memory.workRoom]);
          if(damagedstructures.length > 0)
          {
            creep.memory.targetID = damagedStructures[Math.floor(Math.random() * damagedStructures.length)].id;
            creep.memory.task = CONST.TASK_REPAIR;
          }
          else
          {
            creep.memory.task = CONST.TASK_UPGRADEROOM;
          }
        }

      }
	}
};

module.exports = roleBuilder;
