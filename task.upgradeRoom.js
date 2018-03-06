'use strict';
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
      var err = creep.upgradeController(util.getWorkRoom(creep)
        .controller);

      if (creep.upgradeController(util.getWorkRoom(creep)
          .controller) == ERR_NOT_IN_RANGE)
      {

        cacheMoveTo.cacheMoveTo(creep, util.getWorkRoom(creep)
          .controller);
      }
    }
  }
}
module.exports = taskUpgradeRoom;