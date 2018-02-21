const CONST = require('CONSTANTS');


function genericCreepGetMemoryToSet(spawner, workRoom, mem)
{
  if (mem == undefined) mem = {};
  if (mem.role == undefined) mem.role = "TEST";
  if (mem.homeRoom == undefined) mem.homeRoom = spawner.room.name;
  if (mem.workRoom == undefined) mem.workRoom = workRoom.name;
  if (mem.task == undefined) mem.task = CONST.TASK_SPAWNING;
  return mem;
}


module.exports = {


  //memory must have role. blueprint must be valid
  makeBestCreepFromBlueprint: function (spawner, workRoom, blueprint, creepMemory, maxLevel, makeCreep)
  {

    creepMemory = genericCreepGetMemoryToSet(spawner, workRoom, creepMemory);
    let rand = Math.floor(Math.random() * 1024);
    let parts = [];
    for (let i = 0; i < blueprint.base.length; ++i)
    {
      parts.push(blueprint.base[i]);
    }

    let level = 1;

    var canMake = Game.spawns[spawner.name].spawnCreep(parts, creepMemory.role + (Game.time + rand),
    {
      dryRun: true
    });

    if (canMake != 0) return -1;

    do {
      parts.push(blueprint.levelUp[(level - 1) % blueprint.levelUp.length]);
      level = level + 1;
      canMake = Game.spawns[spawner.name].spawnCreep(parts, creepMemory.role + (Game.time + rand),
      {
        dryRun: true
      });
    } while (canMake == 0 && level <= maxLevel)

    parts.pop();
    //memory setup generic
    creepMemory.lvl = level - 1;
    if (makeCreep)
    {
      console.log("setting these mem values to made creep");
      console.log(Object.keys(creepMemory));
      Game.spawns[spawner.name].spawnCreep(parts, creepMemory.role + (Game.time + rand),
      {
        memory: creepMemory
      });
    }
    return level - 1;


  },

  makeDisassembleFlag: function (homeRoom, workRoom, spawner, makeCreep, flagName)
  {
    var parts = [WORK, WORK, MOVE];
    var level = 1;
    var canMake = Game.spawns[spawner.name].spawnCreep(parts, CONST.ROLE_DISASSEMBLEFLAG + Game.time,
    {
      dryRun: true
    });
    if (canMake != 0) return -1;

    while (canMake == 0)
    {
      if (level % 3 == 1) parts.push(MOVE);
      if (level % 3 == 2) parts.push(WORK);
      if (level % 3 == 0) parts.push(WORK);
      level = level + 1;
      canMake = Game.spawns[spawner.name].spawnCreep(parts, CONST.ROLE_DISASSEMBLEFLAG + Game.time,
      {
        dryRun: true
      });
    }
    parts.pop();
    if (makeCreep) Game.spawns[spawner.name].spawnCreep(parts, CONST.ROLE_DISASSEMBLEFLAG + Game.time,
    {
      memory:
      {
        targetID: flagName,
        homeRoom: homeRoom.name,
        workRoom: workRoom.name,
        role: CONST.ROLE_DISASSEMBLEFLAG,
        task: CONST.TASK_SPAWNING,
        lvl: level - 1
      }
    });
    return level - 1;
  },

  makeZergling: function (homeRoom, workRoom, spawner, makeCreep)
  {
    var parts = [MOVE, MOVE, ATTACK];
    var level = 1;
    var canMake = Game.spawns[spawner.name].spawnCreep(parts, CONST.ROLE_ZERGLING + Game.time,
    {
      dryRun: true
    });
    if (canMake != 0) return -1;

    while (canMake == 0)
    {
      if (level % 2 == 1) parts.push(RANGED_ATTACK)
      if (level % 2 == 0) parts.push(ATTACK)
      parts.push(MOVE);
      var canMake = Game.spawns[spawner.name].spawnCreep(parts, CONST.ROLE_ZERGLING + Game.time,
      {
        dryRun: true
      });
    }
    parts.pop();
    parts.pop();

    let len = parts.length / 2;

    let parts2 = [];
    for (let i = 0; i < Math.floor(len / 2); ++i)
    {
      parts2.push(MOVE);
    }
    for (let i = 0; i < Math.floor(len / 2); ++i)
    {
      if (i % 2 == 0)
        parts2.push(ATTACK);
      else
        parts2.push(RANGED_ATTACK);
    }
    parts2.push(MOVE);
    if (makeCreep) Game.spawns[spawner.name].spawnCreep(parts2, CONST.ROLE_ZERGLING + Game.time,
    {
      memory:
      {
        homeRoom: homeRoom.name,
        workRoom: workRoom.name,
        role: CONST.ROLE_ZERGLING,
        task: CONST.TASK_SPAWNING,
        lvl: level
      }
    });
    return level;

  },
  makeBestScout: function (homeRoom, workRoom, spawner, makeCreep, flagName)
  {
    var parts = [MOVE];
    var level = 1;
    var canMake = Game.spawns[spawner.name].spawnCreep(parts, CONST.ROLE_SCOUT + Game.time,
    {
      dryRun: true
    });
    if (canMake != 0) return -1;
    while (canMake == 0 && level < 2)
    {
      parts.push(MOVE);
      level = level + 1;
      canMake = Game.spawns[spawner.name].spawnCreep(parts, CONST.ROLE_SCOUT + Game.time,
      {
        dryRun: true
      });
    }
    parts.pop();

    if (makeCreep) Game.spawns[spawner.name].spawnCreep(parts, CONST.ROLE_SCOUT + Game.time,
    {
      memory:
      {
        targetID: flagName,
        homeRoom: homeRoom.name,
        workRoom: workRoom.name,
        role: CONST.ROLE_SCOUT,
        task: CONST.TASK_SPAWNING,
        lvl: level - 1
      }
    });
    return level - 1;


  },

  makeBestUpgrader: function (homeRoom, workRoom, spawner, makeCreep)
  {
    var parts = [WORK, CARRY, MOVE];
    var level = 1;
    var canMake = Game.spawns[spawner.name].spawnCreep(parts, CONST.ROLE_UPGRADER + Game.time,
    {
      dryRun: true
    });
    if (canMake != 0) return -1;
    while (canMake == 0 && level < 20)
    {
      if (level % 6 == 5) parts.push(CARRY);
      else if (level % 6 == 0) parts.push(MOVE);
      else parts.push(WORK);

      level = level + 1;
      canMake = Game.spawns[spawner.name].spawnCreep(parts, CONST.ROLE_UPGRADER + Game.time,
      {
        dryRun: true
      });
    }
    parts.pop();

    if (makeCreep) Game.spawns[spawner.name].spawnCreep(parts, CONST.ROLE_UPGRADER + Game.time,
    {
      memory:
      {
        homeRoom: homeRoom.name,
        workRoom: workRoom.name,
        role: CONST.ROLE_UPGRADER,
        task: CONST.TASK_SPAWNING,
        lvl: level - 1
      }
    });
    return level - 1;
  }

}