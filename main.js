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

//profiler.enable();

module.exports.loop = function ()
{
  //profiler.wrap(function ()
  //{
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  let cpuTimesUsedArr = [];
  var cpuUsedOld = Game.cpu.getUsed();
  var cpuUsedNew = Game.cpu.getUsed();
  console.log("Baseline used: " + (cpuUsedNew - cpuUsedOld));
  cpuTimesUsedArr.push(cpuUsedNew - cpuUsedOld);
  cpuUsedOld = cpuUsedNew;

  var a = Game.time & 1023;
  if (a == 0)
  {
    cacheMoveTo.cacheMoveToClear();
  }
  var time = Game.time;
  var rand = Math.floor(Math.random() * 100);

  cacheFind.cacheFindClear();
  util.cleanUpDeadCreeps();

  cpuUsedNew = Game.cpu.getUsed();
  console.log("CPU used for Util: " + (cpuUsedNew - cpuUsedOld));
  cpuTimesUsedArr.push(cpuUsedNew - cpuUsedOld);
  cpuUsedOld = cpuUsedNew;

  for (var room_name in Game.rooms)
  {
    var towers = cacheFind.findCached(CONST.CACHEFIND_MYTOWERS, Game.rooms[room_name]);

    for (var i = 0; i < towers.length; ++i)
    {
      towerLogic.runTower(towers[i]);
    }
  }
  cpuUsedNew = Game.cpu.getUsed();
  console.log("CPU used for Towers: " + (cpuUsedNew - cpuUsedOld));
  cpuTimesUsedArr.push(cpuUsedNew - cpuUsedOld);
  cpuUsedOld = cpuUsedNew;


  var allRoomControllers = roomControllerLogic.init();

  var allRoomControllersKeys = Object.keys(allRoomControllers);
  for (var i = 0; i < allRoomControllersKeys.length; ++i)
  {
    var roomController = allRoomControllers[allRoomControllersKeys[i]];
    roomControllerLogic.runRoomController(roomController, allRoomControllersKeys[i]);
  }

  cpuUsedNew = Game.cpu.getUsed();
  console.log("CPU used for spawning logic: " + (cpuUsedNew - cpuUsedOld));
  cpuTimesUsedArr.push(cpuUsedNew - cpuUsedOld);
  cpuUsedOld = cpuUsedNew;

  //var roleTimes = {};
  //var roleNums = {};
  for (var name in Game.creeps)
  {
    //let roleStart = Game.cpu.getUsed();

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
    /*let roleEnd = Game.cpu.getUsed();
    let role = creep.memory.task;
    if (roleNums[role] != undefined)
    {
      roleTimes[role] = roleTimes[role] + (roleEnd - roleStart);
      roleNums[role] = roleNums[role] + 1;
    }
    else
    {
      roleTimes[role] = (roleEnd - roleStart);
      roleNums[role] = 1;
    }*/
  }

  cpuUsedNew = Game.cpu.getUsed();
  console.log("CPU used for Roles: " + (cpuUsedNew - cpuUsedOld));
  cpuTimesUsedArr.push(cpuUsedNew - cpuUsedOld);
  cpuUsedOld = cpuUsedNew;
  var taskTimes = {};
  var taskNums = {};
  for (var name in Game.creeps)
  {
    let taskStart = Game.cpu.getUsed();
    var creep = Game.creeps[name];
    var isTask = true;
    let task = creep.memory.task;
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
      isTask = false;
      break;
    }
    if (isTask)
    {
      let taskEnd = Game.cpu.getUsed();
      if (taskNums[task] != undefined)
      {
        taskTimes[task] = taskTimes[task] + (taskEnd - taskStart);
        taskNums[task] = taskNums[task] + 1;
      }
      else
      {
        taskTimes[task] = (taskEnd - taskStart);
        taskNums[task] = 1;
      }
    }
  }
  //console.log("Time for task " + creep.memory.task + ": " + (taskEnd - taskStart));
  /*let debugKeysR = Object.keys(roleTimes);
  for (let i = 0; i < debugKeysR.length; ++i)
  {
    console.log("Time Average for role " + debugKeysR[i] + ": " + (roleTimes[debugKeysR[i]] / roleNums[debugKeysR[i]])
      .toFixed(3));
  }*/
  let debugKeys = Object.keys(taskTimes);
  for (let i = 0; i < debugKeys.length; ++i)
  {
    console.log("Time Average for task " + debugKeys[i] + ": " + (taskTimes[debugKeys[i]] / taskNums[debugKeys[i]])
      .toFixed(3));
  }
  cpuUsedNew = Game.cpu.getUsed();
  console.log("CPU used for tasks: " + (cpuUsedNew - cpuUsedOld));
  cpuTimesUsedArr.push(cpuUsedNew - cpuUsedOld);
  console.log("CPU used Total: " + cpuUsedNew);
  console.log("CPU used Sum: " + (_.sum(cpuTimesUsedArr)));
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  cpuUsedOld = cpuUsedNew;

  //});

}