'use strict';
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
      var err = creep.upgradeController(util.getWorkRoom(creep)
        .controller);

      if (creep.upgradeController(util.getWorkRoom(creep)
          .controller) == ERR_NOT_IN_RANGE)
      {
        creep.moveTo(util.getWorkRoom(creep)
          .controller,
          {
            reusePath: 5,
            range: 3
          });
      }
    }
  }
}
module.exports = taskUpgradeRoom;