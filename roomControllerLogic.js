var intelligentSpawner = require("intelligentSpawner");
var util = require("util");
const CONST = require('CONSTANTS');

function runMainRoom(mainRoom)
{
    var notBusySpawns = util.getNotBusySpawns(mainRoom);
    if(notBusySpawns.length==0)
    {
      console.log("All spawns are spawning.");
      return;
    }

    //TODO ALLOW SPAWNS TO RECYCLE WHILE BUSY
    for(var i=0; i<notBusySpawns.length;++i)
    {
      intelligentSpawner.recycleCreeps(notBusySpawns[i]);
    }

    var curSpawn = 0;
    var didntMakeCreep;
    if(curSpawn >= notBusySpawns.length) return;

    didntMakeCreep = intelligentSpawner.spawnHauler(notBusySpawns[curSpawn], mainRoom, 2);

    if(!didntMakeCreep) curSpawn = curSpawn+1;
    if(curSpawn >= notBusySpawns.length) return;

    didntMakeCreep = intelligentSpawner.spawnHarvester(notBusySpawns[curSpawn], mainRoom);

    if(!didntMakeCreep) curSpawn = curSpawn+1;
    if(curSpawn >= notBusySpawns.length) return;

    didntMakeCreep = intelligentSpawner.spawnBuilder(notBusySpawns[curSpawn], mainRoom, 0);

    if(!didntMakeCreep) curSpawn = curSpawn+1;
    if(curSpawn >= notBusySpawns.length) return;

    didntMakeCreep = intelligentSpawner.spawnUpgrader(notBusySpawns[curSpawn], mainRoom, 1);

    if(!didntMakeCreep) curSpawn = curSpawn+1;
    if(curSpawn >= notBusySpawns.length) return;

    didntMakeCreep = intelligentSpawner.spawnScout(notBusySpawns[curSpawn], mainRoom, 1);

    if(!didntMakeCreep) curSpawn = curSpawn+1;
    if(curSpawn >= notBusySpawns.length) return;

}

function runExtensionRoom(extRoom, mainRoom)
{
  var notBusySpawns = util.getNotBusySpawns(mainRoom);
  if(notBusySpawns.length==0)
  {
    console.log("All  spawns are spawning.");
    return;
  }

  //TODO ALLOW SPAWNS TO RECYCLE WHILE BUSY
  for(var i=0; i<notBusySpawns.length;++i)
  {
    intelligentSpawner.recycleCreeps(notBusySpawns[i]);
  }

  var curSpawn = 0;
  var didntMakeCreep;
  if(curSpawn >= notBusySpawns.length) return;

  didntMakeCreep = intelligentSpawner.spawnHauler(notBusySpawns[curSpawn], extRoom, 1);

  if(!didntMakeCreep) curSpawn = curSpawn+1;
  if(curSpawn >= notBusySpawns.length) return;

  didntMakeCreep = intelligentSpawner.spawnHarvester(notBusySpawns[curSpawn], extRoom);

  if(!didntMakeCreep) curSpawn = curSpawn+1;
  if(curSpawn >= notBusySpawns.length) return;

  didntMakeCreep = intelligentSpawner.spawnBuilder(notBusySpawns[curSpawn], extRoom, 0);

  if(!didntMakeCreep) curSpawn = curSpawn+1;
  if(curSpawn >= notBusySpawns.length) return;

  didntMakeCreep = intelligentSpawner.spawnUpgrader(notBusySpawns[curSpawn], extRoom, 0);

  if(!didntMakeCreep) curSpawn = curSpawn+1;
  if(curSpawn >= notBusySpawns.length) return;

  didntMakeCreep = intelligentSpawner.spawnScout(notBusySpawns[curSpawn], extRoom, 0);

  if(!didntMakeCreep) curSpawn = curSpawn+1;
  if(curSpawn >= notBusySpawns.length) return;

}

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


  },

  runRoomController: function(roomController)
  {
    var rooms = Object.keys(roomController);

    var mainBaseRoom = Game.rooms[roomController["M"]];
    if(mainBaseRoom==undefined)
    {
      console.log("ROOM CONTROLLER MISSING MAIN BASE FLAG. ABORT. ABORT. ABORT");
      return;
    }
    console.log("RUNNING MAIN ROOM");
    runMainRoom(mainBaseRoom);

    for(var i = 0; i< rooms.length; ++i)
    {
      var roomName = rooms[i];
      var room = Game.rooms[roomController[rooms[i]]];

      if(roomName.startsWith("E"))
      {
        if(room!= undefined)
        {
          console.log("RUNNING EXTENSION ROOM");
          runExtensionRoom(room, mainBaseRoom);
        }
        else
        {
          console.log("LOST SIGHT OF EXTENSION ROOM");
        }
      }


    }
  }


}
