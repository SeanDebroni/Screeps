var intelligentSpawner = require("intelligentSpawner");
var util = require("util");
var cacheFind = require("cacheFind");
const CONST = require('CONSTANTS');


function makeScoutForFlag(flagName,mainBaseRoom)
{
  var notBusySpawns = util.getNotBusySpawns(mainBaseRoom);
  if(notBusySpawns.length==0)
  {
    //console.log("All spawns are spawning.");
    return;
  }
  didntMakeCreep = intelligentSpawner.spawnScout(notBusySpawns[0], mainBaseRoom, 1, flagName);

}
function runDisassemblyFlag(flagName, mainBaseRoom)
{
  var notBusySpawns = util.getNotBusySpawns(mainBaseRoom);
  if(notBusySpawns.length==0)
  {
    //console.log("All  spawns are spawning.");
    return;
  }
  var curSpawn = 0;
  var didntMakeCreep;

  if(curSpawn >= notBusySpawns.length) return;
  didntMakeCreep = intelligentSpawner.spawnDisassembleFlag(notBusySpawns[curSpawn], Game.flags[flagName].room, 5, flagName);
  if(!didntMakeCreep) curSpawn = curSpawn+1;


  return;
}
function runColonyRoom( colonyRoom, mainRoom)
{
  var notBusySpawns = util.getNotBusySpawns(mainRoom);
  if(notBusySpawns.length==0)
  {
    //console.log("All  spawns are spawning.");
    return;
  }
  //TODO ALLOW SPAWNS TO RECYCLE WHILE BUSY
  for(var i=0; i<notBusySpawns.length;++i)
  {
    intelligentSpawner.recycleCreeps(notBusySpawns[i]);
  }

  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, colonyRoom);
  var hostileBuildings = cacheFind.findCached(CONST.CACHEFIND_HOSTILEBUILDINGS, colonyRoom);
  var curSpawn = 0;
  var didntMakeCreep;

  //if theres a hostile creep, GO GO GO KILLLLL
  if(hostileCreeps.length>0 || hostileBuildings.length > 0)
  {
    for(var z = 0; z<3; ++z)
    {
      if(curSpawn >= notBusySpawns.length) return;

      didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], colonyRoom, 5);

      if(!didntMakeCreep) curSpawn = curSpawn+1;
    }
  }
  if(curSpawn >= notBusySpawns.length) return;
  didntMakeCreep = intelligentSpawner.spawnHauler(notBusySpawns[curSpawn], colonyRoom, 0);
  if(!didntMakeCreep) curSpawn = curSpawn+1;

  //if(curSpawn >= notBusySpawns.length) return;
  //didntMakeCreep = intelligentSpawner.spawnHarvester(notBusySpawns[curSpawn], colonyRoom);
  //if(!didntMakeCreep) curSpawn = curSpawn+1;

  if(curSpawn >= notBusySpawns.length) return;
  didntMakeCreep = intelligentSpawner.spawnBuilder(notBusySpawns[curSpawn], colonyRoom, 3);
  if(!didntMakeCreep) curSpawn = curSpawn+1;

  if(curSpawn >= notBusySpawns.length) return;
  didntMakeCreep = intelligentSpawner.spawnUpgrader(notBusySpawns[curSpawn], colonyRoom, 0);
  if(!didntMakeCreep) curSpawn = curSpawn+1;

  if(curSpawn >= notBusySpawns.length) return;
  didntMakeCreep = intelligentSpawner.spawnScout(notBusySpawns[curSpawn], colonyRoom, 0, undefined);
  if(!didntMakeCreep) curSpawn = curSpawn+1;

  if(curSpawn >= notBusySpawns.length) return;
  didntMakeCreep = intelligentSpawner.spawnReserver(notBusySpawns[curSpawn], colonyRoom, 1);
  if(!didntMakeCreep) curSpawn = curSpawn+1;

  if(curSpawn >= notBusySpawns.length) return;

}
function runMainRoom(mainRoom)
{
    //TODO if there isnt max harvesters in room, set all non-harvester/hauler to 0.
    var curSpawn = 0;
    var notBusySpawns = util.getNotBusySpawns(mainRoom);

    if(notBusySpawns.length==0)
    {
      //console.log("All spawns are spawning.");
      return;
    }

    //TODO ALLOW SPAWNS TO RECYCLE WHILE BUSY
    for(var i=0; i<notBusySpawns.length;++i)
    {
      intelligentSpawner.recycleCreeps(notBusySpawns[i]);
    }

    var didntMakeCreep;
    if(curSpawn >= notBusySpawns.length) return;

    didntMakeCreep = intelligentSpawner.spawnHauler(notBusySpawns[curSpawn], mainRoom, 2);

    if(!didntMakeCreep) curSpawn = curSpawn+1;
    if(curSpawn >= notBusySpawns.length) return;

    didntMakeCreep = intelligentSpawner.spawnHarvester(notBusySpawns[curSpawn], mainRoom);

    if(!didntMakeCreep) curSpawn = curSpawn+1;
    if(curSpawn >= notBusySpawns.length) return;

    didntMakeCreep = intelligentSpawner.spawnBuilder(notBusySpawns[curSpawn], mainRoom, 2);

    if(!didntMakeCreep) curSpawn = curSpawn+1;
    if(curSpawn >= notBusySpawns.length) return;

    didntMakeCreep = intelligentSpawner.spawnUpgrader(notBusySpawns[curSpawn], mainRoom, 2);

    if(!didntMakeCreep) curSpawn = curSpawn+1;
    if(curSpawn >= notBusySpawns.length) return;

    didntMakeCreep = intelligentSpawner.spawnRepairman(notBusySpawns[curSpawn], mainRoom, 2, 50);

    if(!didntMakeCreep) curSpawn = curSpawn+1;
    if(curSpawn >= notBusySpawns.length) return;

    didntMakeCreep = intelligentSpawner.spawnScout(notBusySpawns[curSpawn], mainRoom, 1, undefined);

    if(!didntMakeCreep) curSpawn = curSpawn+1;
    if(curSpawn >= notBusySpawns.length) return;

}

function runAttackRoom(attackRoom, mainRoom)
{
  var curSpawn = 0;

  var notBusySpawns = util.getNotBusySpawns(mainRoom);
  if(notBusySpawns.length==0)
  {
    //console.log("All  spawns are spawning.");
    return;
  }

  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, attackRoom);
  var hostileBuildings = cacheFind.findCached(CONST.CACHEFIND_HOSTILEBUILDINGS,attackRoom);
  var didntMakeCreep;

  //if theres a hostile creep, GO GO GO KILLLLL
  if(hostileCreeps.length>0 || hostileBuildings.length > 0)
  {
    for(var z = 0; z<3; ++z)
    {
      if(curSpawn >= notBusySpawns.length) return;

      didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], attackRoom, 5);

      if(!didntMakeCreep) curSpawn = curSpawn+1;
    }
  }

  if(curSpawn >= notBusySpawns.length) return;

  //didntMakeCreep = intelligentSpawner.spawnHauler(notBusySpawns[curSpawn], attackRoom, 1);


}

function runExtensionRoom(extRoom, mainRoom)
{

  var notBusySpawns = util.getNotBusySpawns(mainRoom);
  if(notBusySpawns.length==0)
  {
    //console.log("All  spawns are spawning.");
    return;
  }

  //TODO ALLOW SPAWNS TO RECYCLE WHILE BUSY
  for(var i=0; i<notBusySpawns.length;++i)
  {
    intelligentSpawner.recycleCreeps(notBusySpawns[i]);
  }

  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, extRoom);
  var hostileBuildings = cacheFind.findCached(CONST.CACHEFIND_HOSTILEBUILDINGS, extRoom);
  var curSpawn = 0;
  var didntMakeCreep;

  //if theres a hostile creep, GO GO GO KILLLLL
  if(hostileCreeps.length>0 || hostileBuildings.length > 0)
  {
    for(var z = 0; z<3; ++z)
    {
      if(curSpawn >= notBusySpawns.length) return;

      didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], extRoom, 10);

      if(!didntMakeCreep) curSpawn = curSpawn+1;
    }
  }



  if(curSpawn >= notBusySpawns.length) return;
  didntMakeCreep = intelligentSpawner.spawnHauler(notBusySpawns[curSpawn], extRoom, 2);
  if(!didntMakeCreep) curSpawn = curSpawn+1;

  if(curSpawn >= notBusySpawns.length) return;
  didntMakeCreep = intelligentSpawner.spawnHarvester(notBusySpawns[curSpawn], extRoom);
  if(!didntMakeCreep) curSpawn = curSpawn+1;

  if(curSpawn >= notBusySpawns.length) return;
  didntMakeCreep = intelligentSpawner.spawnBuilder(notBusySpawns[curSpawn], extRoom, 2);
  if(!didntMakeCreep) curSpawn = curSpawn+1;

  if(curSpawn >= notBusySpawns.length) return;
  didntMakeCreep = intelligentSpawner.spawnUpgrader(notBusySpawns[curSpawn], extRoom, 0);
  if(!didntMakeCreep) curSpawn = curSpawn+1;

  if(curSpawn >= notBusySpawns.length) return;
  didntMakeCreep = intelligentSpawner.spawnScout(notBusySpawns[curSpawn], extRoom, 0, undefined);
  if(!didntMakeCreep) curSpawn = curSpawn+1;

  if(curSpawn >= notBusySpawns.length) return;
  didntMakeCreep = intelligentSpawner.spawnReserver(notBusySpawns[curSpawn], extRoom, 1);
  if(!didntMakeCreep) curSpawn = curSpawn+1;

  if(curSpawn >= notBusySpawns.length) return;
  didntMakeCreep = intelligentSpawner.spawnRepairman(notBusySpawns[curSpawn], extRoom, 1, 1);
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

      }

      var splitFlag = flagNames[i].split("-");
      if(splitFlag[0]=="RC" && splitFlag.length == 3)
      {
          if(roomControllers[splitFlag[1]]==undefined)
          {
            roomControllers[splitFlag[1]] = [];
          }
          var rc = roomControllers[splitFlag[1]];
          if(flags[flagNames[i]].room != undefined)
          {
            rc[splitFlag[2]] = flags[flagNames[i]].room.name;
          }
          else
          {
            rc[splitFlag[2]] = undefined;
          }
          roomControllers[splitFlag[1]] = rc;
      }
    }

    return roomControllers;


  },

  runRoomController: function(roomController, rcName)
  {
    var rooms = Object.keys(roomController);
    var mainBaseRoom = Game.rooms[roomController["M"]];
    if(mainBaseRoom==undefined)
    {
      console.log("ROOM CONTROLLER MISSING MAIN BASE FLAG. ABORT. ABORT. ABORT");
      return;
    }

    for(var i = 0; i< rooms.length; ++i)
    {
      var roomName = rooms[i];
      var room = Game.rooms[roomController[rooms[i]]];
      if(roomName.startsWith("R"))
      {
        if(room!= undefined)
        {
          var flagName = "RC-" + rcName + "-"+ roomName;
          //console.log("RUNNING REMOVE FLAG");
          runDisassemblyFlag(flagName, mainBaseRoom);
        }
        else
        {
          var flagName = "RC-" + rcName + "-"+ roomName;
          makeScoutForFlag(flagName,mainBaseRoom);
        }
      }

    }

    for(var i = 0; i< rooms.length; ++i)
    {
      var roomName = rooms[i];
      var room = Game.rooms[roomController[rooms[i]]];
      if(roomName.startsWith("A"))
      {
        if(room!= undefined)
        {
          //console.log("RUNNING ATTACK ROOM");
          runAttackRoom(room, mainBaseRoom);
        }
        else
        {
          var flagName = "RC-" + rcName + "-"+ roomName;
          makeScoutForFlag(flagName,mainBaseRoom);
        }
      }

    }

    for(var i =0; i< rooms.length; ++i)
    {

      var roomName = rooms[i];
      var room = Game.rooms[roomController[rooms[i]]];

      if(roomName.startsWith("C"))
      {
        if(room!= undefined)
        {
          //console.log("RUNNING COLONY ROOM");
          runColonyRoom(room, mainBaseRoom);
        }
        else
        {
          var flagName = "RC-" + rcName + "-"+ roomName;
          makeScoutForFlag(flagName,mainBaseRoom);
        }
      }
    }
    for(var i = 0; i< rooms.length; ++i)
    {
      var roomName = rooms[i];
      var room = Game.rooms[roomController[rooms[i]]];

      if(roomName.startsWith("E"))
      {
        if(room!= undefined)
        {
          //console.log("RUNNING EXTENSION ROOM");
          runExtensionRoom(room, mainBaseRoom);
        }
        else
        {
          var flagName = "RC-" + rcName + "-"+ roomName;
          makeScoutForFlag(flagName,mainBaseRoom);
        }
      }
    }

  //  console.log("RUNNING MAIN ROOM");
    runMainRoom(mainBaseRoom);



  }


}
