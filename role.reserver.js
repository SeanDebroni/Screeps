var CONST = require("CONSTANTS");
var util = require("util");
var cacheMoveTo = require("cacheMoveTo");

var roleReserver = {
  run: function (creep)
  {
    var controller = util.getWorkRoom(creep)
      .controller;

    if (controller == undefined)
    {
      return;
    }
    var controller = util.getWorkRoom(creep)
      .controller;
    var err = creep.reserveController(controller);
    if (err == ERR_NOT_IN_RANGE)
    {
      cacheMoveTo.cacheMoveTo(creep, util.getWorkRoom(creep)
        .controller);
    }
    else if (err == ERR_NOT_OWNER || err == ERR_INVALID_TARGET)
    {
      err = creep.attackController(controller);
      if (err == ERR_NOT_IN_RANGE)
      {
        cacheMoveTo.cacheMoveTo(creep, util.getWorkRoom(creep)
          .controller);
      }
      else
      {
        creep.memory.task = CONST.TASK_RESERVE;
      }
    }
    else
    {
      creep.memory.task = CONST.TASK_RESERVE;
    }

  }

}
module.exports = roleReserver