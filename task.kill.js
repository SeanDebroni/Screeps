var cacheMoveTo = require('cacheMoveTo');

var taskKill = {
  run: function (creep)
  {

    var target = Game.getObjectById(creep.memory.targetID);
    if (target == undefined)
    {

      creep.memory.task = creep.memory.role;
    }
    if (creep.attack(target) != 0)
    {
      cacheMoveTo.cacheMoveTo(creep, target);
      creep.attack(target);
    }
  }
}
module.exports = taskKill;