'use strict';
var util = require('util');

var taskBuild = {
  run: function(creep)
  {
    var target = Game.getObjectById(creep.memory.targetID);
    if (creep.room.name != creep.memory.workRoom && target == undefined)
    {
      util.moveToRoom(creep, creep.memory.workRoom);
      return;
    }

    if (target == undefined || target == null)
    {
      creep.memory.task = creep.memory.role;
      creep.memory.targetID = -1;
      return;
    }

    if (target.room == undefined)
    {
      util.moveToRoom(creep, creep.memory.workRoom);
      return;
    }

    var err = creep.build(target);
    if (err == ERR_NOT_IN_RANGE)
    {
      if (creep.room.name != target.room.name)
      {
        util.moveToWalkable(creep, target, 17);
      }
      else
      {
        creep.moveTo(target,
        {
          reusePath: 5,
          range: 3
        });
      }
    }
    else if (err == ERR_NOT_ENOUGH_RESOURCES || err == ERR_INVALID_TARGET || err == ERR_RCL_NOT_ENOUGH)
    {
      creep.memory.task = creep.memory.role;
    }

  }
}
module.exports = taskBuild;
