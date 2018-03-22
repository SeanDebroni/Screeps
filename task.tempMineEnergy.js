'use strict';
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
      util.moveToNonWalkable(creep, source);
    }
  }
}
module.exports = taskTempMineEnergy;