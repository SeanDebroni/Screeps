'use strict';
var util = require('util');

var taskKill = {
  run: function (creep)
  {
    var target = Game.getObjectById(creep.memory.targetID);
    if (creep.room.name != creep.memory.workRoom && (target == undefined || target == null))
    {
      util.moveToRoom(creep, creep.memory.workRoom);
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

    creep.rangedAttack(target);
    if (creep.attack(target) != 0)
    {
      creep.moveTo(target,
      {
        reusePath: 3
      });
      creep.attack(target);
    }
  }
}
module.exports = taskKill;