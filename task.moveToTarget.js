'use strict';
var util = require('util');
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
    var err = util.moveToWalkable(creep, target, 50);

  }

}
module.exports = taskMoveToTarget;