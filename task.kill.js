var taskKill = {
  run: function(creep)
  {
    var target = Game.getObjectById(creep.memory.targetID);
    if(target == undefined)
    {

      creep.memory.task = creep.memory.role;
    }
    if(creep.attack(target)!=0)
    {
      creep.moveTo(target, {reusePath: 3});
      creep.attack(target);
    }
  }
}
module.exports = taskKill;
