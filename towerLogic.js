const CONST = require('CONSTANTS');
const cacheFind = require('cacheFind');


module.exports = {

  runTower: function (tower)
  {
    if (tower)
    {
      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);


      var damagedStructures = cacheFind.findCached(CONST.CACHEFIND_DAMAGEDSTRUCTURES, tower.room);
      var toRepair = damagedStructures[Math.floor(Math.random() * damagedStructures.length)];


      if (closestHostile)
      {
        tower.attack(closestHostile);
      }
      if (toRepair)
      {
        tower.repair(toRepair);
      }


    }
  }



}