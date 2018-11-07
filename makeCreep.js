'use strict';
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
  makeBestCreepFromBlueprint: function(spawner, workRoom, blueprint, creepMemory, maxLevel, makeCreep)
  {
    creepMemory = genericCreepGetMemoryToSet(spawner, workRoom, creepMemory);
    let rand = Math.floor(Math.random() * 1024);
    let parts = [];
    for (let i = 0; i < blueprint.base.length; ++i)
    {
      parts.push(blueprint.base[i]);
    }

    let level = 1;

    var canMake = spawner.spawnCreep(parts, creepMemory.role + (Game.time + rand),
    {
      dryRun: true
    });

    if (canMake != 0) return -1;

    do {
      parts.push(blueprint.levelUp[(level - 1) % blueprint.levelUp.length]);
      level = level + 1;
      canMake = spawner.spawnCreep(parts, creepMemory.role + (Game.time + rand),
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
      spawner.spawnCreep(parts, creepMemory.role + (Game.time + rand),
      {
        memory: creepMemory
      });
    }
    return level - 1;


  },

  makeDisassembleFlag: function(homeRoom, workRoom, spawner, makeCreep, flagName)
  {
    var parts = [WORK, WORK, MOVE];
    var level = 1;
    var canMake = spawner.spawnCreep(parts, CONST.ROLE_DISASSEMBLEFLAG + Game.time,
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
      canMake = spawner.spawnCreep(parts, CONST.ROLE_DISASSEMBLEFLAG + Game.time,
      {
        dryRun: true
      });
    }
    parts.pop();
    if (makeCreep) spawner.spawnCreep(parts, CONST.ROLE_DISASSEMBLEFLAG + Game.time,
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
  makeGuard: function(homeRoom, workRoomName, spawner)
  {
    var parts = [];
    let z;
    for (z = 0; z < 2; ++z)
    {
      parts.push(TOUGH);
    }
    for (z = 0; z < 25; ++z)
    {
      parts.push(MOVE);
    }
    for (z = 0; z < 18; ++z)
    {
      parts.push(RANGED_ATTACK);
    }
    for (z = 0; z < 5; ++z)
    {
      parts.push(HEAL);
    }
    var canMake = spawner.spawnCreep(parts, CONST.ROLE_GUARD + Game.time,
    {
      dryRun: true
    });
    if (canMake != 0) return -1;

    let ret = spawner.spawnCreep(parts, CONST.ROLE_GUARD + Game.time,
    {
      memory:
      {
        homeRoom: homeRoom.name,
        workRoom: workRoomName,
        patrolRoom: workRoomName,
        role: CONST.ROLE_GUARD,
        task: CONST.TASK_SPAWNING,
        hasHealParts: true,
        alwaysKite: true
      }
    });
    return 1;

  },
  makeSuperZergling: function(homeRoom, workRoom, spawner, makeCreep, goAllOut)
  {
    var parts = [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL];
    var level = 1;
    var canMake = spawner.spawnCreep(parts, CONST.ROLE_ZERGLING + Game.time,
    {
      dryRun: true
    });
    if (canMake != 0) return -1;
    var z;
    //Ranged kiter
    while (canMake == 0)
    {
      for (z = 0; z < 4; ++z)
      {
        parts.push(RANGED_ATTACK);
      }
      for (z = 0; z < 5; ++z)
      {
        parts.push(MOVE);
      }
      parts.push(HEAL);
      var canMake = spawner.spawnCreep(parts, CONST.ROLE_ZERGLING + Game.time,
      {
        dryRun: true
      });
    }
    for (z = 0; z < 10; ++z)
    {
      parts.pop();
    }
    let len = parts.length;
    len = len - len % 10;
    let parts2 = [];
    parts2.push(TOUGH);
    parts2.push(TOUGH);
    for (let i = 0; i < 0.5 * len; ++i)
    {
      parts2.push(MOVE);
    }
    for (let i = 0; i < 0.4 * len - 2; ++i)
    {
      parts2.push(RANGED_ATTACK);
    }
    for (let i = 0; i < 0.1 * len; ++i)
    {
      parts2.push(HEAL);
    }

    if (makeCreep) spawner.spawnCreep(parts2, CONST.ROLE_ZERGLING + Game.time,
    {
      memory:
      {
        homeRoom: homeRoom.name,
        workRoom: workRoom.name,
        role: CONST.ROLE_ZERGLING,
        task: CONST.TASK_SPAWNING,
        lvl: level,
        hasHealParts: true
      }
    });

    /*
        while (canMake == 0)
        {
          parts.push(ATTACK);
          parts.push(MOVE);
          var canMake = spawner.spawnCreep(parts, CONST.ROLE_ZERGLING + Game.time,
          {
            dryRun: true
          });
        }
        for (z = 0; z < 2; ++z)
        {
          parts.pop();
        }
        let len = parts.length;
        let parts2 = [];
        for (let i = 0; i < 0.5 * len - 1; ++i)
        {
          parts2.push(MOVE);
        }
        for (let i = 0; i < 0.5 * len; ++i)
        {
          parts2.push(ATTACK);
        }
        parts2.push(MOVE);

        if (makeCreep) spawner.spawnCreep(parts2, CONST.ROLE_ZERGLING + Game.time,
        {
          memory:
          {
            homeRoom: homeRoom.name,
            workRoom: workRoom.name,
            role: CONST.ROLE_ZERGLING,
            task: CONST.TASK_SPAWNING,
            lvl: level,
            hasHealParts: false
          }
        });*/
    return level;

  },
  makeZergling: function(homeRoom, workRoom, spawner, makeCreep, goAllOut)
  {
    var parts = [MOVE, MOVE, ATTACK];
    var level = 1;
    var canMake = spawner.spawnCreep(parts, CONST.ROLE_ZERGLING + Game.time,
    {
      dryRun: true
    });
    if (canMake != 0) return -1;

    while (canMake == 0)
    {
      if (level % 5 == 1) parts.push(ATTACK);
      if (level % 5 == 4) parts.push(RANGED_ATTACK);
      if (level % 5 == 3) parts.push(RANGED_ATTACK);
      if (level % 5 == 2) parts.push(RANGED_ATTACK);
      if (level % 5 == 0) parts.push(ATTACK);
      parts.push(MOVE);
      level = level + 1;
      var canMake = spawner.spawnCreep(parts, CONST.ROLE_ZERGLING + Game.time,
      {
        dryRun: true
      });
    }
    parts.pop();
    parts.pop();

    let len = parts.length / 2;
    if (!goAllOut)
    {
      len = Math.floor(len / 1.5);
    }
    let parts2 = [];
    for (let i = 0; i < len - 1; ++i)
    {
      parts2.push(MOVE);
    }
    for (let i = 0; i < len; ++i)
    {
      /*
            if (i % 2 == 0)
            {
              parts2.push(ATTACK);
            }
            else if(i%2 == 1)
            {
              parts2.push(RANGED_ATTACK);
            }*/
      if (i % 5 == 0)
      {
        parts2.push(ATTACK);
      }
      else if (i % 5 == 1)
      {
        parts2.push(ATTACK);
      }
      else if (i % 5 == 2)
      {
        parts2.push(RANGED_ATTACK);
      }
      else if (i % 5 == 3)
      {
        parts2.push(RANGED_ATTACK);
      }
      else if (i % 5 == 4)
      {
        parts2.push(RANGED_ATTACK);
      }

    }
    parts2.push(MOVE);
    if (makeCreep) spawner.spawnCreep(parts2, CONST.ROLE_ZERGLING + Game.time,
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
  makeBestScout: function(homeRoom, workRoom, spawner, makeCreep, flagName)
  {
    var parts = [MOVE];
    var level = 1;
    var canMake = spawner.spawnCreep(parts, CONST.ROLE_SCOUT + Game.time,
    {
      dryRun: true
    });
    if (canMake != 0) return -1;
    while (canMake == 0 && level < 2)
    {
      parts.push(MOVE);
      level = level + 1;
      canMake = spawner.spawnCreep(parts, CONST.ROLE_SCOUT + Game.time,
      {
        dryRun: true
      });
    }
    parts.pop();

    if (makeCreep) spawner.spawnCreep(parts, CONST.ROLE_SCOUT + Game.time,
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


  }

}
