'use strict';
const CONST = require('CONSTANTS');
var util = require('util');

function wipeCreepMemory(creep)
{
  creep.memory.task = creep.memory.role;
  creep.memory.targetID = -1;
}
var taskFillTargetStructure = {

  run: function (creep)
  {
    if (_.sum(creep.carry) == 0)
    {
      wipeCreepMemory(creep);
      return;
    }
    var target = Game.getObjectById(creep.memory.targetID);
    if (target == undefined || target == null)
    {
      wipeCreepMemory(creep);
      return;
    }
    if (!creep.pos.isNearTo(target))
    {
      util.moveToNonWalkable(creep, target, 17);
    }
    else
    {
      var whatCarry = Object.keys(creep.carry);
      for (var i = 0; i < whatCarry.length; ++i)
      {
        if (whatCarry[i] != RESOURCE_ENERGY)
        {
          creep.transfer(target, whatCarry[i]);
          wipeCreepMemory(creep);
          return;
        }
      }
    }
  }

};

module.exports = taskFillTargetStructure;