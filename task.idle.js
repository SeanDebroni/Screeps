'use strict';
var util = require('util');
var taskIdle = {
  run: function (creep)
  {
    if (creep.memory.atIdleSpot == true)
    {
      return;
    }
    var flag = Game.flags[creep.memory.homeRoom + "idle"];
    if (flag != undefined && flag != null)
    {
      if (creep.pos.isNearTo(flag.pos))
      {
        creep.memory.atIdleSpot = true;
      }
      util.moveToWalkable(creep, flag, 50);

      return;
    }

  }
}
module.exports = taskIdle;