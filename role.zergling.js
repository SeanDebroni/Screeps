'use strict';
const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');
var util = require('util');

var roleZergling = {

  run: function(creep)
  {
    var targRoom = Game.rooms[creep.memory.workRoom];
    if (creep.room.name != creep.memory.workRoom && (targRoom == undefined || targRoom == null))
    {
      util.moveToRoom(creep, creep.memory.workRoom);
      return;
    }

    if (targRoom == undefined)
    {
      if (creep.memory.roomFlag != undefined)
      {
        var target = Game.flags[creep.memory.roomFlag];
        if (target != undefined)
        {
          util.moveToWalkable(creep, target, 10);
        }
      }
      return;
    }
    var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, targRoom);
    var hostileBuildings = cacheFind.findCached(CONST.CACHEFIND_HOSTILEBUILDINGS, targRoom);

    var hostiles = hostileCreeps.concat(hostileBuildings);

    /*    if (hostiles.length == 1)
        {
          if (hostiles[0].structureType == STRUCTURE_CONTROLLER)
          {
            if (creep.moveTo(hostiles[0] == ERR_NO_PATH))
            {
              var hostileWalls = cacheFind.findCached(CONST.CACHEFIND_WALLS, targRoom);
              creep.memory.targetID = hostileWalls[Math.floor(Math.random() * hostileWalls.length)].id;
              creep.memory.task = CONST.TASK_KILL;
              return;
            }
          }
        }*/

    if (hostiles.length > 0)
    {
      let rand = Math.floor(Math.random() * hostiles.length);
      creep.memory.targetID = hostiles[rand].id;
      creep.memory.targetLastX = hostiles[rand].pos.x;
      creep.memory.targetLastY = hostiles[rand].pos.y;
      creep.memory.task = CONST.TASK_KILL;
      return;
    }
    else
    {
      creep.memory.targetID = -1;
      creep.memory.task = CONST.TASK_IDLE;
      creep.memory.atIdleSpot = false;
      creep.memory.workRoom = creep.memory.homeRoom;
      //creep.suicide();
    }
  }
};

module.exports = roleZergling;
