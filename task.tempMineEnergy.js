'use strict';
var util = require('util');
var taskTempMineEnergy = {
  run: function (creep)
  {
    if (creep.carry[RESOURCE_ENERGY] == creep.carryCapacity)
    {
      creep.memory.targetID = -1;
      creep.memory.task = creep.memory.role;
      return;
    }

    var source = Game.getObjectById(creep.memory.targetID);
    let res = creep.harvest(source);
    if (res == ERR_NOT_IN_RANGE)
    {
      util.moveToNonWalkable(creep, source, 3);
    }
    else if (res != OK)
    {
      creep.memory.targetID = -1;
      creep.memory.task = creep.memory.role;
      return;
    }
  }
}
module.exports = taskTempMineEnergy;