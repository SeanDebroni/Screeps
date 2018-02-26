var util = require('util');

var taskKill = {
  run: function (creep)
  {
    var target = Game.getObjectById(creep.memory.targetID);
    if (creep.room.name != creep.memory.workRoom && target == undefined)
    {
      util.moveToRoom(creep, creep.memory.workRoom);
    }
    else if (target == undefined)
    {
      creep.memory.task = creep.memory.role;

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