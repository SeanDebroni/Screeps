const CONST = require('CONSTANTS');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHauler = require('role.hauler');
var roleScout = require('role.scout');
var roleReserver = require('role.reserver');
var roleZergling = require('role.zergling');
var roleDisassembleFlag = require('role.disassembleFlag');
var roleRepairman = require('role.repairman');

var taskFillBase = require('task.fillBase');
var taskMineEnergy = require('task.mineEnergy');
var taskPickUpEnergy = require('task.pickUpEnergy');
var taskRecycle = require('task.recycle');
var taskWaitingToBeRecycled = require('task.waitingToBeRecycled');
var taskSpawning = require('task.spawning');
var taskFillFromBase = require('task.fillFromBase');
var taskIdle = require('task.idle');
var taskUpgradeRoom = require('task.upgradeRoom');
var taskBuild = require('task.build');
var taskMoveToTarget = require('task.moveToTarget');
var taskReserve = require('task.reserve');
var taskKill = require('task.kill');
var taskDisassemble = require('task.disassemble');
var taskRepair = require('task.repair');

const profiler = require('profiler');



var towerLogic = require('towerLogic');
var intelligentSpawner = require('intelligentSpawner');
var roomControllerLogic = require('roomControllerLogic');
var dumbSpawner = require('dumbSpawner');
var util = require('util');

var cacheFind = require('cacheFind');
var cacheMoveTo = require('cacheMoveTo');

profiler.enable();

module.exports.loop = function ()
{
  profiler.wrap(function ()
  {
    console.log(" ");
    console.log(Game.time);

    //console.log("CPU limit: "+ Game.cpu.limit);
    //console.log("CPU ticklimit: "+ Game.cpu.tickLimit);
    //console.log("CPU bucket: "+ Game.cpu.bucket);
    var start = new Date()
      .getTime();


    var a = Game.time & 1023;
    if (a == 0)
    {
      cacheMoveTo.cacheMoveToClear();
    }
    var time = Game.time;
    var rand = Math.floor(Math.random() * 100);

    cacheFind.cacheFindClear();
    util.cleanUpDeadCreeps();

    for (var room_name in Game.rooms)
    {
      var towers = cacheFind.findCached(CONST.CACHEFIND_MYTOWERS, Game.rooms[room_name]);

      for (var i = 0; i < towers.length; ++i)
      {
        towerLogic.runTower(towers[i]);
      }
    }

    var allRoomControllers = roomControllerLogic.init();

    var allRoomControllersKeys = Object.keys(allRoomControllers);
    for (var i = 0; i < allRoomControllersKeys.length; ++i)
    {
      var roomController = allRoomControllers[allRoomControllersKeys[i]];
      roomControllerLogic.runRoomController(roomController, allRoomControllersKeys[i]);
    }


    var end2 = new Date()
      .getTime();
    var time2 = end2 - start;
    console.log("time difference after spawnAll: " + time2);

    for (var name in Game.creeps)
    {
      var creep = Game.creeps[name];
      switch (creep.memory.task)
      {
      case CONST.ROLE_REPAIRMAN:
        roleRepairman.run(creep);
        break;
      case CONST.ROLE_DISASSEMBLEFLAG:
        roleDisassembleFlag.run(creep);
        break;
      case CONST.ROLE_HARVESTER:
        roleHarvester.run(creep);
        break;
      case CONST.ROLE_UPGRADER:
        roleUpgrader.run(creep);
        break;
      case CONST.ROLE_BUILDER:
        roleBuilder.run(creep);
        break;
      case CONST.ROLE_HAULER:
        roleHauler.run(creep);
        break;
      case CONST.ROLE_SCOUT:
        roleScout.run(creep);
        break;
      case CONST.ROLE_RESERVER:
        roleReserver.run(creep);
        break;
      case CONST.ROLE_ZERGLING:
        roleZergling.run(creep);
        break;
      default:
        break;
      }
    }
    var end1 = new Date()
      .getTime();
    var time1 = end1 - start;
    console.log("time differenceafter role: " + time1);
    for (var name in Game.creeps)
    {
      var creep = Game.creeps[name];

      switch (creep.memory.task)
      {
      case CONST.TASK_REPAIR:
        taskRepair.run(creep);
        break;
      case CONST.TASK_DISASSEMBLE:
        taskDisassemble.run(creep);
        break;
      case CONST.TASK_KILL:
        taskKill.run(creep);
        break;
      case CONST.TASK_FILLBASE:
        taskFillBase.run(creep);
        break;
      case CONST.TASK_MINEENERGY:
        taskMineEnergy.run(creep);
        break;
      case CONST.TASK_PICKUPENERGY:
        taskPickUpEnergy.run(creep);
        break;
      case CONST.TASK_RECYCLE:
        taskRecycle.run(creep);
        break;
      case CONST.TASK_WAITINGTOBERECYCLED:
        taskWaitingToBeRecycled.run(creep);
        break;
      case CONST.TASK_SPAWNING:
        taskSpawning.run(creep);
        break;
      case CONST.TASK_IDLE:
        taskIdle.run(creep);
        break;
      case CONST.TASK_BUILD:
        taskBuild.run(creep);
        break;
      case CONST.TASK_FILLFROMBASE:
        taskFillFromBase.run(creep);
        break;
      case CONST.TASK_UPGRADEROOM:
        taskUpgradeRoom.run(creep);
        break;
      case CONST.TASK_MOVETOTARGET:
        taskMoveToTarget.run(creep);
        break;
      case CONST.TASK_RESERVE:
        taskReserve.run(creep);
        break;
      default:
        break;
      }
    }

    //console.log("CPU limit: "+ Game.cpu.limit);
    // console.log("CPU ticklimit: "+ Game.cpu.tickLimit);
    //console.log("CPU bucket: "+ Game.cpu.bucket);

    var end = new Date()
      .getTime();
    var time = end - start;
    console.log("time difference: " + time);
  });

}