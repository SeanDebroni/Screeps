const CONST = require('CONSTANTS');

//Create with memory s which is the id of the source to harvest
var roleScout =
{
    run: function(creep)
    {
      //hmm
      var flags = Game.flags;
      if(flags["scout"] != undefined)
      {
          creep.memory.targetID = flags["scout"].name;
          creep.memory.task = CONST.TASK_MOVETOTARGET;
      }
      if(flags["hi"]!= undefined)
      {
          //creep.say("Hi!", true);
      }

	}
};
module.exports = roleScout;
