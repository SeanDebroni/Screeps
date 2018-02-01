var taskIdle = {
  run: function(creep)
  {
    var time = creep.memory.idleTime;

    if(time == 0 )
    {
      creep.memory.task = creep.memory.role;
    }
    else
    {
      creep.memory.idleTime = time-1;
    }

  }
}
module.exports = taskIdle;
