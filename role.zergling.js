const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');

var roleZergling = {

    run: function(creep)
    {
      var targRoom = Game.rooms[creep.memory.workRoom];
       var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS,targRoom);
       var hostileBuildings = cacheFind.findCached(CONST.CACHEFIND_HOSTILEBUILDINGS,targRoom);

       var hostiles = hostileCreeps.concat(hostileBuildings);

       if(hostiles.length > 0)
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
