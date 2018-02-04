const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');

var roleRepairman =
{
    run: function(creep)
    {
      if(creep.carry.energy == 0)
      {
        creep.memory.targetID = -1;
        creep.memory.task = CONST.TASK_FILLFROMBASE;
      }
      else
      {
        var damagedStructures = cacheFind.findCached(CONST.CACHEFIND_DAMAGEDSTRUCTURES, Game.rooms[creep.memory.workRoom]);

        if(damagedStructures.length ==0) return;

        creep.memory.targetID = damagedStructures[Math.floor(Math.random() * damagedStructures.length)].id;
        creep.memory.task = CONST.TASK_REPAIR;
      }

	}
};
module.exports = roleRepairman;
