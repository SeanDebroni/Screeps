'use strict';
var util = require('util');
var taskClaim = {
  run: function (creep)
  {
    var controller = util.getWorkRoom(creep)
      .controller;
    var err = creep.claimController(controller);
    if (err != 0)
    {
      creep.memory.task = creep.memory.role;
    }
    else
    {
      creep.suicide();
    }
  }
}
module.exports = taskClaim;