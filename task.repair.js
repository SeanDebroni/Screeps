var cacheMoveTo = require('cacheMoveTo');

var taskRepair = {
  run: function(creep)
  {
    console.log("NEW REPAIR RUNNING");
    var target = Game.getObjectById(creep.memory.targetID);
    var err = creep.repair(target);
    if(err == ERR_NOT_IN_RANGE) {
        cacheMoveTo.cacheMoveTo(creep, target);
    }
    else if(err == ERR_NOT_ENOUGH_RESOURCES || err == ERR_INVALID_TARGET || err == ERR_RCL_NOT_ENOUGH)
    {
      creep.memory.task = creep.memory.role;
    }

  }
}
module.exports = taskRepair
