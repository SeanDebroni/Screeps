const CONST = require('CONSTANTS');

var roleUpgrader = {

  run: function (creep)
  {
    //if not full, fill.
    if (creep.carry.energy < creep.carryCapacity)
    {
      creep.memory.targetID = -1;
      creep.memory.task = CONST.TASK_FILLFROMBASE;
      return;
    }
    //we are full of energy, upgrade
    else
    {
      creep.memory.task = CONST.TASK_UPGRADEROOM;
      return;
    }
  }
};

module.exports = roleUpgrader;