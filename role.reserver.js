'use strict';
var CONST = require("CONSTANTS");
var util = require("util");

var roleReserver = {
  run: function (creep)
  {
    var workRoom = util.getWorkRoom(creep);
    //sanity check???
    if (workRoom == undefined || workRoom == null)
    {
      return;
    }

    var controller = util.getWorkRoom(creep)
      .controller;

    //another sanity check
    if (controller == undefined)
    {
      return;
    }

    //Try to reserve controller.
    var err = creep.reserveController(controller);
    //If out of range, move to it.
    if (err == ERR_NOT_IN_RANGE)
    {

      util.moveToNonWalkable(creep, util.getWorkRoom(creep)
        .controller);
      return;
    }
    //If its someone elses controller, attack it.
    else if (err == ERR_NOT_OWNER || err == ERR_INVALID_TARGET)
    {
      err = creep.attackController(controller);
      //if not in range to attack, move to it.
      if (err == ERR_NOT_IN_RANGE)
      {
        util.moveToNonWalkable(creep, util.getWorkRoom(creep)
          .controller);
        return;
      }
      //sucessful attack, keep doing it?!?!?. TODO make better
      else
      {
        creep.memory.task = CONST.TASK_RESERVE;
        return;
      }
    }
    //Sucessful reserve, keep doing it forever!
    else
    {
      creep.memory.task = CONST.TASK_RESERVE;
      return;
    }

  }

}
module.exports = roleReserver