'use strict';
var taskIdle = {
  run: function (creep)
  {
    var flag = Game.flags[creep.memory.homeRoom + "idle"];
    if (flag != undefined && flag != null)
    {
      creep.moveTo(flag,
      {
        reusePath: 10
      });
      return;
    }

  }
}
module.exports = taskIdle;