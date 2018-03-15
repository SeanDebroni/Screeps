'use strict';
var CONST = require("CONSTANTS");
var util = require('util');

var roleDisassembleFlag = {
  run: function (creep)
  {
    var flag = Game.flags[creep.memory.targetID];

    if (flag == undefined)
    {
      console.log("remove flag not found, suiciding");
      creep.suicide();
      return;
    }

    //Not in same room, just move there.
    if (flag.room == undefined || creep.room != flag.room)
    {

      var err = util.moveToWalkable(creep, flag, 5);
      return;
    }

    //If adjacent, start working
    if (Math.abs(creep.pos.x - flag.pos.x) <= 1 && Math.abs(creep.pos.y - flag.pos.y) <= 1)
    {
      creep.memory.task = CONST.TASK_DISASSEMBLE;
      return;
    }

    //otherwise, just move to it.
    var err = util.moveToWalkable(creep, flag, 5);
    return;

  }
}

module.exports = roleDisassembleFlag;