'use strict';
var util = require('util');

var taskKill = {
  run: function (creep)
  {
    var target = Game.getObjectById(creep.memory.targetID);
    if (creep.room.name != creep.memory.workRoom && (target == undefined || target == null))
    {
      if (creep.memory.targetLastX != undefined)
      {
        util.moveToRoom(creep, creep.memory.workRoom, creep.memory.targetLastX, creep.memory.targetLastY);
      }
      else
      {
        util.moveToRoom(creep, creep.memory.workRoom);
      }
      return;
    }
    else if (target == undefined || target == null)
    {
      creep.memory.task = creep.memory.role;
      return;
    }

    if (target.room.name != creep.memory.workRoom)
    {
      creep.memory.workRoom = target.room.name;
    }
    creep.memory.targetLastX = target.pos.x;
    creep.memory.targetLastY = target.pos.y;

    creep.rangedAttack(target);
    creep.attack(target);
    if (creep.pos.isNearTo(target.pos))
    {
      creep.move(creep.pos.getDirectionTo(target.pos));
    }
    else
    {
      util.moveToNonWalkable(creep, target, 3);
    }

    creep.attack(target);

  }
}
module.exports = taskKill;