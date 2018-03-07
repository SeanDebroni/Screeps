'use strict';
var intelligentSpawner = require("intelligentSpawner");
var util = require("util");
var cacheFind = require("cacheFind");
const CONST = require('CONSTANTS');
const BLUEPRINTS = require("BLUEPRINTS");
var roadBuilder = require('roadBuilder');

function getMainBlueprint(mainRoom)
{

  switch (mainRoom.controller.level)
  {
  case 1:
    return BLUEPRINTS.RCL_ONE_MAIN_CREEP;
  case 2:
    return BLUEPRINTS.RCL_TWO_MAIN_CREEP;
  case 3:
    return BLUEPRINTS.RCL_THREE_MAIN_CREEP;
  case 4:
    return BLUEPRINTS.RCL_FOUR_MAIN_CREEP;
  case 5:
    return BLUEPRINTS.RCL_FIVE_MAIN_CREEP;
  case 6:
    return BLUEPRINTS.RCL_SIX_MAIN_CREEP;
  case 7:
    return BLUEPRINTS.RCL_SEVEN_MAIN_CREEP;
  case 8:
    return BLUEPRINTS.RCL_EIGHT_MAIN_CREEP;

  }
  console.log("invalid controller level in blueprint");
  return undefined;
}

function getExtBlueprint(mainRoom)
{
  switch (mainRoom.controller.level)
  {
  case 1:
    return BLUEPRINTS.RCL_ONE_EXT_CREEP;
  case 2:
    return BLUEPRINTS.RCL_TWO_EXT_CREEP;
  case 3:
    return BLUEPRINTS.RCL_THREE_EXT_CREEP;
  case 4:
    return BLUEPRINTS.RCL_FOUR_EXT_CREEP;
  case 5:
    return BLUEPRINTS.RCL_FIVE_EXT_CREEP;
  case 6:
    return BLUEPRINTS.RCL_SIX_EXT_CREEP;
  case 7:
    return BLUEPRINTS.RCL_SEVEN_EXT_CREEP;
  case 8:
    return BLUEPRINTS.RCL_EIGHT_EXT_CREEP;
  }
  console.log("invalid controller level in blueprint");
  return undefined;
}
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
  let didntMakeCreep = intelligentSpawner.spawnScout(notBusySpawns[0], mainBaseRoom, 1, flagName);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;

  return curSpawn;

}

//Done
function runDisassemblyFlag(flagName, mainBaseRoom, notBusySpawns, curSpawn)
{
  var didntMakeCreep;

  if (curSpawn > 0) return curSpawn;
  didntMakeCreep = intelligentSpawner.spawnDisassembleFlag(notBusySpawns[curSpawn], Game.flags[flagName].room, 5, flagName);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;

  return curSpawn;
}


function runColonyRoomPriorityOne(colonyRoom, mainRoom, notBusySpawns, curSpawn)
{
  let blueprint = BLUEPRINTS.RCL_ALL_COL_CREEP;
  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, colonyRoom);
  var hostileBuildings = cacheFind.findCached(CONST.CACHEFIND_HOSTILEBUILDINGS, colonyRoom);
  var didntMakeCreep;

  //if theres a hostile creep, GO GO GO KILLLLL
  if ((hostileCreeps.length > 0 || hostileBuildings.length > 0) && mainRoom.energyAvailable > mainRoom.energyCapacityAvailable / 2)
  {
    for (var z = 0; z < 3; ++z)
    {
      //didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], colonyRoom, 1);
      //if (!didntMakeCreep) curSpawn = curSpawn + 1;
      //if (curSpawn >= notBusySpawns.length) return curSpawn;
    }
  }
  return curSpawn;
}

function runColonyRoomPriorityTwo(colonyRoom, mainRoom, notBusySpawns, curSpawn)
{
  let blueprint = BLUEPRINTS.RCL_ALL_COL_CREEP;
  let didntMakeCreep = intelligentSpawner.spawnBuilder(blueprint, notBusySpawns[curSpawn], colonyRoom, false);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnReserver(blueprint, notBusySpawns[curSpawn], colonyRoom);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  return curSpawn;
}

//done
function runMainRoomPriorityOne(mainRoom, notBusySpawns, curSpawn)
{
  let blueprint = getMainBlueprint(mainRoom);

  if (curSpawn >= notBusySpawns.length) return curSpawn;

  let didntMakeCreep = intelligentSpawner.spawnHauler(blueprint, notBusySpawns[curSpawn], mainRoom);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnHarvester(blueprint, notBusySpawns[curSpawn], mainRoom);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnBaseHealer(blueprint, notBusySpawns[curSpawn]);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  //only one
  didntMakeCreep = intelligentSpawner.spawnUpgrader(blueprint, notBusySpawns[curSpawn], mainRoom, true);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnBuilder(blueprint, notBusySpawns[curSpawn], mainRoom, true);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  //if main base is fucked, fix it first
  var harvesters = cacheFind.findCached(CONST.CACHEFIND_FINDHARVESTERS, mainRoom);
  var haulers = cacheFind.findCached(CONST.CACHEFIND_FINDHAULERS, mainRoom);
  //var harvesters = _.filter(Game.creeps, (creep) => (creep.memory.role == CONST.ROLE_HARVESTER && Game.rooms[creep.memory.workRoom] == mainRoom));
  //var haulers = _.filter(Game.creeps, (creep) => (creep.memory.role === CONST.ROLE_HAULER && Game.rooms[creep.memory.workRoom] == mainRoom));
  if (harvesters.length < 1 || haulers.length < 1)
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
  let blueprint = getMainBlueprint(mainRoom);

  let didntMakeCreep = intelligentSpawner.spawnBuilder(blueprint, notBusySpawns[curSpawn], mainRoom, false);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnUpgrader(blueprint, notBusySpawns[curSpawn], mainRoom, false);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnRepairman(blueprint, notBusySpawns[curSpawn], mainRoom, false);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;



  //If storage is fullish, make a repairman. Should only apply to RCL 8 rooms.
  if (mainRoom.controller.level == 8)
  {
    var containersToFill = cacheFind.findCached(CONST.CACHEFIND_CONTAINERSTOFILL, mainRoom);
    if (containersToFill.length == 0 || containersToFill.length == 1 && containersToFill[0].store > containersToFill[0].storeCapacity * 0.95)
    {
      didntMakeCreep = intelligentSpawner.spawnRepairman(blueprint, notBusySpawns[curSpawn], mainRoom, true);
      if (!didntMakeCreep) curSpawn = curSpawn + 1;
      if (curSpawn >= notBusySpawns.length) return curSpawn;
    }
  }


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
      didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], attackRoom, 1, false);
      if (!didntMakeCreep) curSpawn = curSpawn + 1;
      if (curSpawn >= notBusySpawns.length) return curSpawn;
    }
  }

  return curSpawn;

}

//Defense
function runExtensionRoomPriorityZero(extRoom, mainRoom, notBusySpawns, curSpawn)
{
  let blueprint = getExtBlueprint(mainRoom);
  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, extRoom);
  var hostileBuildings = cacheFind.findCached(CONST.CACHEFIND_HOSTILEBUILDINGS, extRoom);

  var didntMakeCreep;
  if ((hostileCreeps.length > 0 || hostileBuildings.length > 0) && mainRoom.energyAvailable > mainRoom.energyCapacityAvailable / 2)
  {
    for (var z = 0; z < 3; ++z)
    {
      if (hostileCreeps[0].owner.username == "Invader")
      {
        var nonCombat = cacheFind.findCached(CONST.CACHEFIND_NONCOMBATCREEPS, extRoom);

        for (var v = 0; v < nonCombat.length; ++v)
        {
          nonCombat[v].memory.task = CONST.TASK_FLEE;
        }

        didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], extRoom, 1, false);
        if (!didntMakeCreep) curSpawn = curSpawn + 1;
        if (curSpawn >= notBusySpawns.length) return curSpawn;
      }
      /*else if (hostileCreeps[0].owner.username == "Patrik")
      {
        for (var g = 0; g < hostileCreeps.length; ++g)
        {
          var body = hostileCreeps[g].body;
          if (body.includes(ATTACK) || body.includes(RANGED_ATTACK))
          {
            didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], extRoom, 3, true);
            if (!didntMakeCreep) curSpawn = curSpawn + 1;
            if (curSpawn >= notBusySpawns.length) return curSpawn;
          }
        }
      }*/
      else
      {
        var nonCombat = cacheFind.findCached(CONST.CACHEFIND_NONCOMBATCREEPS, extRoom);
        var isDangerous = false;
        for (var v = 0; v < hostileCreeps.length; ++v)
        {
          var c = hostileCreeps[v];
          if (_.filter(c.body, function (bp)
            {
              return (bp == ATTACK || bp == RANGED_ATTACK);
            })
            .length > 0)
          {
            isDangerous = true;
            break;
          }

        }
        if (isDangerous)
        {
          for (var v = 0; v < nonCombat.length; ++v)
          {
            nonCombat[v].memory.task = CONST.TASK_FLEE;
          }
        }
        didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], extRoom, 3, true);
        if (!didntMakeCreep) curSpawn = curSpawn + 1;
        if (curSpawn >= notBusySpawns.length) return curSpawn;
      }
    }
  }
  return curSpawn;


}

//Harvesters + Haulers  + Reservers
function runExtensionRoomPriorityOne(extRoom, mainRoom, notBusySpawns, curSpawn)
{
  let blueprint = getExtBlueprint(mainRoom);

  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, extRoom);
  if (hostileCreeps.length > 0) return curSpawn;

  var didntMakeCreep = intelligentSpawner.spawnHauler(blueprint, notBusySpawns[curSpawn], extRoom);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnHarvester(blueprint, notBusySpawns[curSpawn], extRoom);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  return curSpawn;
}

function runExtensionRoomPriorityReservers(extRoom, mainRoom, notBusySpawns, curSpawn)
{
  let blueprint = getExtBlueprint(mainRoom);

  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, extRoom);
  if (hostileCreeps.length > 0) return curSpawn;

  var didntMakeCreep = intelligentSpawner.spawnReserver(blueprint, notBusySpawns[curSpawn], extRoom);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  return curSpawn;
}
//Upgraders + builders + repairers + ???
function runExtensionRoomPriorityTwo(extRoom, mainRoom, notBusySpawns, curSpawn)
{
  let blueprint = getExtBlueprint(mainRoom);

  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, extRoom);
  if (hostileCreeps.length > 0) return curSpawn;

  var didntMakeCreep = intelligentSpawner.spawnRepairman(blueprint, notBusySpawns[curSpawn], extRoom, false);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnBuilder(blueprint, notBusySpawns[curSpawn], extRoom, false);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  return curSpawn;
}

module.exports = {
  //TODO: save and load this at some point rather then remaking it every time.
  init: function ()
  {
    let roomControllers = [];

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
    let buildRoads = [];
    let outerWarningRooms = [];

    let notBusySpawns = util.getNotBusySpawns(mainBaseRoom);

    while (notBusySpawns.length > 1)
    {
      notBusySpawns.pop();
    }
    //if all spawns are spawning, no point in doing any of this.
    if (notBusySpawns.length == 0)
    {
      return;
    }
    //SOMEONE PLEASE TELL ME WHY I NEEDED TO ADD THIS CHECK. AS FAR AS I KNOW IT SHOULD NEVER EVER EVER MATTER. BUT ONCE EVERY 10 HOURS IT DOES.
    if (notBusySpawns[0] == undefined || notBusySpawns[0] == null)
    {
      console.log("@#%$#%@#%@#^$@%@#&*(%@#%@%^*@#%#%%@#@#@#%@#%@#$&*(@#$@#%$))");
      console.log("@#%$#%@#%@#^$@%@#&*(%@#%@%^*@#%#%%@#@#@#%@#%@#$&*(@#$@#%$))");
      console.log("@#%$#%@#%@#^$@%@#&*(%@#%@%^*@#%#%%@#@#@#%@#%@#$&*(@#$@#%$))");
      console.log("@#%$#%@#%@#^$@%@#&*(%@#%@%^*@#%#%%@#@#@#%@#%@#$&*(@#$@#%$))");
      console.log("@#%$#%@#%@#^$@%@#&*(%@#%@%^*@#%#%%@#@#@#%@#%@#$&*(@#$@#%$))");
      console.log("@#%$#%@#%@#^$@%@#&*(%@#%@%^*@#%#%%@#@#@#%@#%@#$&*(@#$@#%$))");
      console.log("@#%$#%@#%@#^$@%@#&*(%@#%@%^*@#%#%%@#@#@#%@#%@#$&*(@#$@#%$))");
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
        let roomType = roomName.charAt(0);
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
        case "O":
          outerWarningRooms.push(room);
          break;
        case "B":
          console.log("found flag");
          let flagNamesss = "RC-" + rcName + "-" + roomName;
          Game.flags[flagNamesss].remove();
          buildRoads.push(room);
          break;
        case "R":
          let flagName = "RC-" + rcName + "-" + roomName;
          disassembleFlags.push(flagName);
          break;
        }
      }
    }
    recycleCreeps(mainBaseRoom);

    //Run building code:
    for (let i = 0; i < buildRoads.length; ++i)
    {
      console.log("BuildingRoads");
      roadBuilder.buildBasicRoads(mainBaseRoom, extensionRooms);
    }
    //Run Priority Zero - Defense + haulers
    for (let i = 0; i < extensionRooms.length; ++i)
    {
      curSpawn = runExtensionRoomPriorityZero(extensionRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    //run outer warning rooms

    //Run Priority One Spawns - Haulers + Harvester + healer
    curSpawn = runMainRoomPriorityOne(mainBaseRoom, notBusySpawns, curSpawn);
    if (curSpawn >= notBusySpawns.length) return;


    for (let i = 0; i < extensionRooms.length; ++i)
    {

      curSpawn = runExtensionRoomPriorityOne(extensionRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    //run Reservers
    for (let i = 0; i < extensionRooms.length; ++i)
    {
      curSpawn = runExtensionRoomPriorityReservers(extensionRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
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




    //console.log(mainBaseRoom + " Had nothing to spawn");
    return;

  }

}