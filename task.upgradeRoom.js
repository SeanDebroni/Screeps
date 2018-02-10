var cacheMoveTo = require('cacheMoveTo');
var util = require('util');

var taskUpgradeRoom = {
  run: function (creep)
  {
    if (creep.carry.energy == 0)
    {
      creep.memory.task = creep.memory.role;
    }
    else
    {
      if (creep.upgradeController(util.getWorkRoom(creep)
          .controller) == ERR_NOT_IN_RANGE)
      {
        creep.moveTo(util.getWorkRoom(creep)
          .controller,
          {
            reusePath: 10
          });
      }
    }
  }
}
module.exports = taskUpgradeRoom;