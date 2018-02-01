var util = require('util');
var taskReserve =
{
  run: function(creep)
  {
    var err = creep.reserveController(util.getWorkRoom(creep).controller);
    if(err!=0)
    {
      creep.memory.task = creep.memory.role;
    }
  }
}
module.exports = taskReserve;
