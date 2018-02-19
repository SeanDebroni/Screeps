const CONST = require('CONSTANTS');
var util = require('util');
var cacheMoveTo = require('cacheMoveTo');

//Create with memory s which is the id of the source to harvest
var roleHarvester = {
  run: function (creep)
  {
    var source = Game.getObjectById(creep.memory.sID);

    if (source == undefined && creep.memory.workRoom != creep.room.name)
    {
      util.moveToRoom(creep, creep.memory.workRoom);
      return;
    }

    var res = creep.harvest(source);
    if (res != 0)
    {
      creep.moveTo(source,
      {
        reusePath: 20
      });
    }
    else
    {
      creep.memory.task = CONST.TASK_MINEENERGY;
    }
  }
};
module.exports = roleHarvester;