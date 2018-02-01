var CONST = require("CONSTANTS");
var util = require("util");
var cacheMoveTo = require("cacheMoveTo");

var roleReserver =
{
  run: function(creep)
  {
    if(creep.reserveController(util.getWorkRoom(creep).controller) == ERR_NOT_IN_RANGE)
    {
      cacheMoveTo.cacheMoveTo(creep, util.getWorkRoom(creep).controller);
    }
    else
    {
      creep.memory.task = CONST.TASK_RESERVE;
    }

  }

}
module.exports = roleReserver
