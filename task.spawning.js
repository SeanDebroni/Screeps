var taskSpawning = {
  run: function (creep)
  {
    if (!creep.spawning)
    {
      creep.memory.task = creep.memory.role;
    }
  }

}
module.exports = taskSpawning;