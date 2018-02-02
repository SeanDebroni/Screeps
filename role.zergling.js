const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');

var roleZergling = {

    run: function(creep)
    {
       var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS);
       var hostileBuildings = cacheFind.findCached(CONST.CACHEFIND_HOSTILEBUILDINGS);

       var hostiles = hostileCreeps.concat(hostileBuildings);

       if(hostiles.length > 0)
       {
         creep.memory.targetID = hostiles[Math.floor(Math.random() * hostiles.length];
         creep.memory.task = CONST.TASK_KILL;
       }
       else
       {
         creep.suicide();
       }
    }
};

module.exports = roleZergling;
