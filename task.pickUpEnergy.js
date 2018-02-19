var util = require('util');

var taskPickUpEnergy = {
  run: function (creep)
  {
    if (creep.room.name != creep.memory.workRoom)
    {
      util.moveToRoom(creep, creep.memory.workRoom);
      return;
    }
    var result = util.pickupEnergyFrom(creep, Game.getObjectById(creep.memory.targetID));
    if (result == OK || result == ERR_FULL)
    {
      creep.memory.task = creep.memory.role;
    }
    else if (result == ERR_INVALID_TARGET)
    {
      util.moveToRoom(creep, creep.memory.workRoom);
    }

  }
}
module.exports = taskPickUpEnergy;