const CONST = require('CONSTANTS');
var util = require('util');
var cacheMoveTo = require('cacheMoveTo');

//Create with memory sID which is the id of the source to harvest
var roleHarvester = {
  run: function (creep)
  {
    var source = Game.getObjectById(creep.memory.sID);

    //If we cannot find the source, and are not in the same room as it should be in, move to that room.
    if (source == undefined && creep.memory.workRoom != creep.room.name)
    {
      util.moveToRoom(creep, creep.memory.workRoom);
      return;
    }

    //Try to harvest the source
    var res = creep.harvest(source);

    //If not successful, move to the Source
    if (res != 0)
    {
      creep.moveTo(source,
      {
        reusePath: 5
      });
    }
    //If sucessful, sit there forever and mine.
    else
    {
      creep.memory.task = CONST.TASK_MINEENERGY;
    }
  }
};
module.exports = roleHarvester;