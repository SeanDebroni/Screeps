var intelligentSpawner = require("intelligentSpawner");
var util = require("util");
var cacheFind = require("cacheFind");
const CONST = require('CONSTANTS');


//Done
function recycleCreeps(mainRoom)
{
  var spawnsToRec = cacheFind.findCached(CONST.CACHEFIND_SPAWNS, mainRoom);
  for (var i = 0; i < spawnsToRec.length; ++i)
  {
    intelligentSpawner.recycleCreeps(spawnsToRec[i]);
  }
}

//Done
function makeScoutForFlag(flagName, mainBaseRoom, notBusySpawns, curSpawn)
{

  didntMakeCreep = intelligentSpawner.spawnScout(notBusySpawns[0], mainBaseRoom, 1, flagName);

  if (!didntMakeCreep) curSpawn = curSpawn + 1;

  return curSpawn;

}

//Done
function runDisassemblyFlag(flagName, mainBaseRoom, notBusySpawns, curSpawn)
{
  var didntMakeCreep;

  if (curSpawn > 0) return;
  didntMakeCreep = intelligentSpawner.spawnDisassembleFlag(notBusySpawns[curSpawn], Game.flags[flagName].room, 5, flagName);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;

  return curSpawn;
}


function runColonyRoomPriorityOne(colonyRoom, mainRoom, notBusySpawns, curSpawn)
{
  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, colonyRoom);
  var hostileBuildings = cacheFind.findCached(CONST.CACHEFIND_HOSTILEBUILDINGS, colonyRoom);
  var didntMakeCreep;

  //if theres a hostile creep, GO GO GO KILLLLL
  if ((hostileCreeps.length > 0 || hostileBuildings.length > 0) && mainRoom.energyAvailable > mainRoom.energyCapacityAvailable / 2)
  {
    for (var z = 0; z < 3; ++z)
    {
      didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], colonyRoom, 10);
      if (!didntMakeCreep) curSpawn = curSpawn + 1;
      if (curSpawn >= notBusySpawns.length) return curSpawn;
    }
  }
  return curSpawn;
}

function runColonyRoomPriorityTwo(colonyRoom, mainRoom, notBusySpawns, curSpawn)
{
  didntMakeCreep = intelligentSpawner.spawnBuilder(notBusySpawns[curSpawn], colonyRoom, 3);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnReserver(notBusySpawns[curSpawn], colonyRoom, 1);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  return curSpawn;
}

//done
function runMainRoomPriorityOne(mainRoom, notBusySpawns, curSpawn)
{
  didntMakeCreep = intelligentSpawner.spawnHauler(notBusySpawns[curSpawn], mainRoom, 2);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnHarvester(notBusySpawns[curSpawn], mainRoom);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  //if main base is fucked, fix it first
  var harvesters = _.filter(Game.creeps, (creep) => (creep.memory.role == CONST.ROLE_HARVESTER && util.getWorkRoom(creep) == mainRoom));
  var haulers = _.filter(Game.creeps, (creep) => (creep.memory.role === CONST.ROLE_HAULER && util.getWorkRoom(creep) == mainRoom));
  if (harvesters.length < 2 || haulers.length < 2)
  {
    return notBusySpawns.length;
  }
  var levelSum = 0;
  for (var i = 0; i < harvesters.length; ++i)
  {
    levelSum = levelSum + harvesters[i].memory.lvl;
  }
  if (levelSum / harvesters.length < 5 && mainRoom.controller.level > 3)
  {
    return notBusySpawns.length;
  }


  return curSpawn;

}

//done
function runMainRoomPriorityTwo(mainRoom, notBusySpawns, curSpawn)
{
  didntMakeCreep = intelligentSpawner.spawnBuilder(notBusySpawns[curSpawn], mainRoom, 2);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnUpgrader(notBusySpawns[curSpawn], mainRoom, 3);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnRepairman(notBusySpawns[curSpawn], mainRoom, 1, 17);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  return curSpawn;

}

//Done
function runAttackRoom(attackRoom, mainRoom, notBusySpawns, curSpawn)
{

  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, attackRoom);
  var hostileBuildings = cacheFind.findCached(CONST.CACHEFIND_HOSTILEBUILDINGS, attackRoom);
  var didntMakeCreep;

  //if theres a hostile creep, GO GO GO KILLLLL
  if ((hostileCreeps.length > 0 || hostileBuildings.length > 0) && mainRoom.energyAvailable > mainRoom.energyCapacityAvailable / 2)
  {
    for (var z = 0; z < 3; ++z)
    {
      didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], attackRoom, 10);
      if (!didntMakeCreep) curSpawn = curSpawn + 1;
      if (curSpawn >= notBusySpawns.length) return curSpawn;
    }
  }

  return curSpawn;

}

//Defense
function runExtensionRoomPriorityZero(extRoom, mainRoom, notBusySpawns, curSpawn)
{
  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, extRoom);
  var hostileBuildings = cacheFind.findCached(CONST.CACHEFIND_HOSTILEBUILDINGS, extRoom);

  var didntMakeCreep;
  if ((hostileCreeps.length > 0 || hostileBuildings.length > 0) && mainRoom.energyAvailable > mainRoom.energyCapacityAvailable / 2)
  {
    for (var z = 0; z < 3; ++z)
    {
      didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], extRoom, 10);
      if (!didntMakeCreep) curSpawn = curSpawn + 1;
      if (curSpawn >= notBusySpawns.length) return curSpawn;
    }
  }
  return curSpawn;


}

//Harvesters + Haulers  + Reservers
function runExtensionRoomPriorityOne(extRoom, mainRoom, notBusySpawns, curSpawn)
{
  didntMakeCreep = intelligentSpawner.spawnHauler(notBusySpawns[curSpawn], extRoom, 2);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnHarvester(notBusySpawns[curSpawn], extRoom);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnReserver(notBusySpawns[curSpawn], extRoom, 1);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  return curSpawn;
}
//Upgraders + builders + repairers + ???
function runExtensionRoomPriorityTwo(extRoom, mainRoom, notBusySpawns, curSpawn)
{
  didntMakeCreep = intelligentSpawner.spawnRepairman(notBusySpawns[curSpawn], extRoom, 1, 1);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnBuilder(notBusySpawns[curSpawn], extRoom, 2);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  return curSpawn;
}

module.exports = {
  //TODO: save and load this at some point rather then remaking it every time.
  init: function ()
  {

    roomControllers = [];

    var flags = Game.flags;

    var flagNames = Object.keys(flags);

    //Roomcontrollers has list of RC names.
    //Each RC name has a bunch of room names
    //Each room name has the real room name attached to it.
    //I think this is good so that i can use what I name rooms to decide behavior
    for (var i = 0; i < flagNames.length; ++i)
    {
      //lost sight of room TODO get IT BACK
      if (flags[flagNames[i]].room == undefined)
      {

      }

      var splitFlag = flagNames[i].split("-");
      if (splitFlag[0] == "RC" && splitFlag.length == 3)
      {
        if (roomControllers[splitFlag[1]] == undefined)
        {
          roomControllers[splitFlag[1]] = [];
        }
        var rc = roomControllers[splitFlag[1]];
        if (flags[flagNames[i]].room != undefined)
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

  runRoomController: function (roomController, rcName)
  {
    var rooms = Object.keys(roomController);

    var mainBaseRoom = Game.rooms[roomController["M"]];
    if (mainBaseRoom == undefined)
    {
      console.log("ROOM CONTROLLER MISSING MAIN BASE FLAG. ABORT. ABORT. ABORT");
      return;
    }

    let extensionRooms = [];
    let colonyRooms = [];
    let attackRooms = [];
    let disassembleFlags = [];

    let notBusySpawns = util.getNotBusySpawns(mainBaseRoom);

    //if all spawns are spawning, no point in doing any of this.
    if (notBusySpawns.length == 0)
    {
      return;
    }
    //only do one spawn at time for now.
    //notBusySpawns = [notBusySpawns[0]];

    var curSpawn = 0;

    //Find flags that correspond to certain rooms and categorize them.
    for (let i = 0; i < rooms.length; ++i)
    {
      let roomName = rooms[i];
      let room = Game.rooms[roomController[roomName]];

      if (room == undefined)
      {
        let flagName = "RC-" + rcName + "-" + roomName;
        curSpawn = makeScoutForFlag(flagName, mainBaseRoom, notBusySpawns, curSpawn);
        if (curSpawn > notBusySpawns.length) return;
      }
      else
      {
        let roomType = roomName.charAt(i);
        switch (roomType)
        {
        case "C":
          colonyRooms.push(room);
          break;
        case "E":
          extensionRooms.push(room);
          break;
        case "A":
          attackRooms.push(room);
          break;
        case "R":
          let flagName = "RC-" + rcName + "-" + roomName;
          disassembleFlags.push(flagName);
          break;
        }
      }
    }
    recycleCreeps(mainBaseRoom);
    //Run Priority Zero - Defense
    for (let i = 0; i < extensionRooms.length; ++i)
    {
      curSpawn = runExtensionRoomPriorityZero(extensionRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    //Run Priority One Spawns - Haulers + Harvester + Reservers
    curSpawn = runMainRoomPriorityOne(mainBaseRoom, notBusySpawns, curSpawn);
    if (curSpawn >= notBusySpawns.length) return;

    for (let i = 0; i < extensionRooms.length; ++i)
    {
      curSpawn = runExtensionRoomPriorityOne(extensionRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    for (let i = 0; i < colonyRooms.length; ++i)
    {
      curSpawn = runColonyRoomPriorityOne(colonyRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    //Run Attack Rooms
    for (let i = 0; i < attackRooms.length; ++i)
    {
      curSpawn = runAttackRoom(attackRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    //Run Priority Two Spawns - Builders/Repairmen/upgraders
    curSpawn = runMainRoomPriorityTwo(mainBaseRoom, notBusySpawns, curSpawn);
    if (curSpawn >= notBusySpawns.length) return;

    for (let i = 0; i < extensionRooms.length; ++i)
    {
      curSpawn = runExtensionRoomPriorityTwo(extensionRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    for (let i = 0; i < colonyRooms.length; ++i)
    {
      curSpawn = runColonyRoomPriorityTwo(colonyRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }


    //Run Priority Three Spawns - misc
    for (let i = 0; i < disassembleFlags.length; ++i)
    {
      curSpawn = runDisassemblyFlag(disassembleFlags[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    console.log(mainBaseRoom + " Had nothing to spawn");
    return;

  }

}