'use strict';

//Requires targetIDSet
var taskHealTarget = {

  run: function (creep)
  {

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
    if (creep.heal(target) != 0)
    {
      creep.moveTo(target,
      {
        reusePath: 17
      });
      creep.heal(target);
    }
  }
}

module.exports = taskHealTarget;