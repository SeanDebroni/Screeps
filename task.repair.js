var cacheMoveTo = require('cacheMoveTo');

var taskRepair = {
  run: function(creep)
  {
    if(creep.memory.targetID == -1)
    {
      creep.memory.task = creep.memory.role;
      return;
    }
    var target = Game.getObjectById(creep.memory.targetID);

    if(target.hits == target.hitsMax)
    {
      creep.memory.task = creep.memory.role;
      creep.memory.targetID = -1;
      return;
    }
    var err = creep.repair(target);
    if(err == ERR_NOT_IN_RANGE) {
        cacheMoveTo.cacheMoveTo(creep, target);
    }
    else if(err == ERR_NOT_ENOUGH_RESOURCES || err == ERR_INVALID_TARGET || err == ERR_RCL_NOT_ENOUGH)
    {
      creep.memory.task = creep.memory.role;
      creep.memory.targetID = -1;
    }

  }
}
module.exports = taskRepair
