
module.exports =
{

  init: function()
  {
    var flags = Game.flags;

    var flagNames = Object.keys(flags);

    for(var i = 0; i< flagNames.length; ++i)
    {
      var splitFlag = flagNames[i].split("-");

      if(splitFlag[0]=="RC" && splitFlag.length == 3)
      {
        //Memory.roomControllers.0000.M
        //Memory.roomControllers.0000.E1
        //Memory.roomControllers.0000.E2
        Memory.roomControllers[splitFlag[1]][splitFlag[3]] = flags[flagName[i]].room;
        console.log(flags[flagName[i]].room);
      }
    }


  }


}
