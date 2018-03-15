'use strict';
var util = require('util');

//Requires targetIDSet
var taskHealTarget = {

  run: function (creep)
  {
    if (creep.hits < creep.hitsMax)
    {
      creep.heal(creep);
      return;
    }

    var target = Game.getObjectById(creep.memory.targetID);
    if (target == undefined || target == null)
    {
      creep.memory.task = creep.memory.role;
      creep.memory.targetID = -1;
      return;
    }

    if (target.hits == target.hitsMax)
    {
      creep.memory.task = creep.memory.role;
      creep.memory.targetID = -1;
      return;
    }

    creep.rangedHeal(target);
    creep.heal(target);
    if (creep.pos.isNearTo(target.pos))
    {
      creep.move(creep.pos.getDirectionTo(target.pos));
    }
    else
    {
      util.moveToNonWalkable(creep, target, 17);
    }
    creep.heal(target);

  }
}

module.exports = taskHealTarget;