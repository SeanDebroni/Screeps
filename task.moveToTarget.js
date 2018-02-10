var cacheMove = require("cacheMoveTo");
var taskMoveToTarget = {
  run: function (creep)
  {
    var target = Game.flags[creep.memory.targetID];

    if (target != undefined)
    {
      if (Math.abs(target.pos.x - creep.pos.x) <= 1 && Math.abs(target.pos.y - creep.pos.y) <= 1)
      {
        creep.memory.task = creep.memory.role;
      }
    }
    var err = cacheMove.cacheMoveTo(creep, target);

    /*var err = cacheMoveTo.cacheMoveTo(creep, target,
    {
      rememberPath: 50
    });*/

  }

}
module.exports = taskMoveToTarget;