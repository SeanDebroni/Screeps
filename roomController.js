
module.exports =
{
  //TODO: save and load this at some point rather then remaking it every time.
  init: function()
  {

    roomControllers = [];

    var flags = Game.flags;

    var flagNames = Object.keys(flags);

    //Roomcontrollers has list of RC names.
    //Each RC name has a bunch of room names
    //Each room name has the real room name attached to it.
    //I think this is good so that i can use what I name rooms to decide behavior
    for(var i = 0; i< flagNames.length; ++i)
    {
      //lost sight of room TODO get IT BACK
      if(flags[flagNames[i]].room == undefined)
      {
          continue;
      }

      var splitFlag = flagNames[i].split("-");
      if(splitFlag[0]=="RC" && splitFlag.length == 3)
      {
          if(roomControllers[splitFlag[1]]==undefined)
          {
            roomControllers[splitFlag[1]] = [];
          }
          var rc = roomControllers[splitFlag[1]];
          rc[splitFlag[2]] = flags[flagNames[i]].room.name;
          roomControllers[splitFlag[1]] = rc;
      }
    }

    return roomControllers;


  }


}
