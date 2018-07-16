'use strict';
var CONST = require("CONSTANTS");
var util = require("util");

var roleClaimer = {
  run: function(creep)
  {

    if (creep.room.name != creep.memory.workRoom)
    {
      util.moveToRoom(creep, creep.memory.workRoom);
      return;
    }

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

    //Try to claim controller.
    var err = creep.claimController(controller);
    console.log(err);
    console.log(creep.room.name);

    //If out of range, move to it.
    if (err == ERR_NOT_IN_RANGE || err == ERR_GCL_NOT_ENOUGH)
    {
      util.moveToNonWalkable(creep, util.getWorkRoom(creep)
        .controller);
      return;
    }
    //If its someone elses controller, attack it.
    else if (err == ERR_NOT_OWNER)
    {
      err = creep.attackController(controller);
      //if not in range to attack, move to it.
      if (err == ERR_NOT_IN_RANGE)
      {
        util.moveToNonWalkable(creep, util.getWorkRoom(creep)
          .controller);
        return;
      }
    }
    else if (err == OK)
    {
      creep.suicide();
    }

  }

}
module.exports = roleClaimer
