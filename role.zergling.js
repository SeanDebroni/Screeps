const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');
var cacheMoveTo = require('cacheMoveTo');


var roleZergling = {

  run: function (creep)
  {
    var targRoom = Game.rooms[creep.memory.workRoom];
    if (targRoom == undefined)
    {
      return;
    }
    var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, targRoom);
    var hostileBuildings = cacheFind.findCached(CONST.CACHEFIND_HOSTILEBUILDINGS, targRoom);

    var hostiles = hostileCreeps.concat(hostileBuildings);

    if (hostiles.length == 1)
    {
      if (hostiles[0].structureType == STRUCTURE_CONTROLLER)
      {
        if (cacheMoveTo.cacheMoveTo(creep, hostiles[0]) == ERR_NO_PATH)
        {
          var hostileWalls = cacheFind.findCached(CONST.CACHEFIND_WALLS, targRoom);
          creep.memory.targetID = hostileWalls[Math.floor(Math.random() * hostileWalls.length)].id;
          creep.memory.task = CONST.TASK_KILL;
          return;
        }
      }
    }

    if (hostiles.length > 0)
    {
      creep.memory.targetID = hostiles[Math.floor(Math.random() * hostiles.length)].id;
      creep.memory.task = CONST.TASK_KILL;
    }
    else
    {
      creep.suicide();
    }
  }
};

module.exports = roleZergling;