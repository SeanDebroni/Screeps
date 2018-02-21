var util = require('util');

var taskPickUpEnergy = {
  run: function (creep)
  {
    if (creep.carry.energy > creep.carryCapacity * 0.8)
    {
      creep.memory.task = creep.memory.role;
      return;
    }
    /*  if (creep.room.name != creep.memory.workRoom)
      {
        util.moveToRoom(creep, creep.memory.workRoom);
        return;
      }*/
    var target = Game.getObjectById(creep.memory.targetID);
    if (target == undefined || target == null)
    {
      creep.memory.task = creep.memory.role;
      util.moveToRoom(creep, creep.memory.workRoom);
      return;
    }
    var result = util.pickupEnergyFrom(creep, target);
    if (result == OK || result == ERR_FULL)
    {
      creep.memory.task = creep.memory.role;
    }
    else if (result == ERR_INVALID_TARGET)
    {
      if (creep.memory.workRoom == creep.room.name)
      {
        creep.memory.task = creep.memory.role;
      }
      util.moveToRoom(creep, creep.memory.workRoom);
    }

  }
}
module.exports = taskPickUpEnergy;