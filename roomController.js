
module.exports =
{

  init: function()
  {
    var roomControllers = JSON.parse(Memory.roomControllers);
    if(roomControllers == undefined)
    {
      roomControllers = [];
    }
    var flags = Game.flags;

    var flagNames = Object.keys(flags);

    for(var i = 0; i< flagNames.length; ++i)
    {
      var splitFlag = flagNames[i].split("-");
      if(splitFlag[0]=="RC" && splitFlag.length == 3)
      {
          if(roomControllers[splitFlag[1]]==undefined)
          {
            roomControllers[splitFlag[1]] = [];
          }
          roomControllers[splitFlag[1]][splitFlag[2]] = flags[flagNames[i]].room.name;
      }
    }

    Memory.roomControllers = JSON.stringify([...roomControllers]);


  }


}
