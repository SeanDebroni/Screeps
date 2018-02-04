var taskDisassemble =
{
  run: function(creep)
  {
    var flag = Game.flags[creep.memory.targetID];
    if(flag==undefined)
    {
      creep.suicide();
      return;
    }
    var working = false;
    var whatsThere = creep.room.lookAt(flag.pos.x, flag.pos.y);

    for(var i =0; i< whatsThere.length; ++i)
    {
      if(whatsThere[i].type == 'structure')
      {
        creep.dismantle(whatsThere[i]);
        working=true;
      }
    }
    if(!working)
    {
      creep.suicide();
    }

  }


}
module.exports = taskDisassemble;
