'use strict';
var taskMoveToTarget = {
  run: function (creep)
  {
    var target = Game.flags[creep.memory.targetID];

    if (target != undefined)
    {
      if (target.pos.x == creep.pos.x && target.pos.y == creep.pos.y)
      {
        creep.memory.task = creep.memory.role;
      }
    }
    var err = creep.moveTo(target,
    {
      rememberPath: 50
    });

  }

}
module.exports = taskMoveToTarget;