'use strict';
var util = require('util');
var CONST = require('CONSTANTS');

var taskUpgradeRoom = {
  run: function (creep)
  {
    let amountToStopAt = 0;
    if (creep.memory.role == CONST.ROLE_UPGRADER) amountToStopAt = 5;

    if (creep.carry.energy <= amountToStopAt)
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

        if (creep.room.name != creep.memory.workRoom)
        {
          util.moveToWalkable(creep, util.getWorkRoom(creep)
            .controller, 17);
        }
        else
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
}
module.exports = taskUpgradeRoom;