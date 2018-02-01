const CONST = require('CONSTANTS');

var roleUpgrader = {

    run: function(creep)
    {
      if(creep.carry.energy < creep.carryCapacity)
      {
        creep.memory.targetID = -1;
        creep.memory.task = CONST.TASK_FILLFROMBASE;
      }
      else
      {
        creep.memory.task = CONST.TASK_UPGRADEROOM;
      }
  }
};

module.exports = roleUpgrader;
