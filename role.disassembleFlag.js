var CONST  = require("CONSTANTS");

var roleDisassembleFlag =
{
  run: function(creep)
  {
    var flag = Game.flags[creep.memory.targetID];

    if(flag == undefined)
    {
      console.log("remove flag not found, suiciding");
      creep.suicide();
      return;
    }
    var target = Game.flags[creep.memory.targetID];

    if(flag.room == undefined)
    {
      var err = creep.moveTo(target, {rememberPath: 5});
    }
    else if(creep.room!= flag.room)
    {
      var err = creep.moveTo(target, {rememberPath: 5});

    }
    else
    {
      if( Math.abs(creep.pos.x-flag.pos.x) <=1 && Math.abs(creep.pos.y-flag.pos.y) <= 1)
      {
        creep.memory.task = CONST.TASK_DISASSEMBLE;
      }
      else
      {
        var err = creep.moveTo(target, {rememberPath: 5});
      }
    }
  }


}
module.exports = roleDisassembleFlag;
