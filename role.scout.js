const CONST = require('CONSTANTS');

//Create with memory s which is the id of the source to harvest
var roleScout = {
  run: function (creep)
  {
    //hmm

    if (creep.memory.targetID != undefined)
    {
      creep.memory.task = CONST.TASK_MOVETOTARGET;
      return;
    }

    var flags = Game.flags;
    if (flags["scout"] != undefined)
    {
      creep.memory.targetID = flags["scout"].name;
      creep.memory.task = CONST.TASK_MOVETOTARGET;
    }
    if (flags["hi"] != undefined)
    {
      //creep.say("Hi!", true);
    }

  }
};
module.exports = roleScout;