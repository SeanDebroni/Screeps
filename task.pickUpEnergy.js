var util = require('util');

var taskPickUpEnergy = {
  run: function (creep)
  {
    var result = util.pickupEnergyFrom(creep, Game.getObjectById(creep.memory.targetID));
    if (result == OK || result == ERR_INVALID_TARGET || result == ERR_FULL || result == ERR_BUSY)
    {
      creep.memory.task = creep.memory.role;
    }

  }
}
module.exports = taskPickUpEnergy;