var util = require('util');
var taskReserve = {
  run: function (creep)
  {
    var controller = util.getWorkRoom(creep)
      .controller;
    var err = creep.reserveController(controller);
    if (err == ERR_NOT_OWNER || err == ERR_INVALID_TARGET)
    {
      err = creep.attackController(controller);
      if (err != 0)
      {
        creep.memory.task = creep.memory.role;
      }
    }
    else if (err != 0)
    {
      creep.memory.task = creep.memory.role;
    }
  }
}
module.exports = taskReserve;