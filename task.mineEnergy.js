var taskMineEnergy = {
  run: function(creep)
  {
      var source = Game.getObjectById(creep.memory.sID);
      var err = creep.harvest(source);
      if(err!=0)
      {
        creep.memory.task = creep.memory.role;
      }
  }
}
module.exports = taskMineEnergy;
