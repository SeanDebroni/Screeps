'use strict';
var taskIdle = {
  run: function (creep)
  {
    var flag = Game.flags[creep.memory.homeRoom + "idle"];
    if (flag != undefined && flag != null)
    {
      creep.moveTo(flag,
      {
        reusePath: 50
      });
      return;
    }

  }
}
module.exports = taskIdle;