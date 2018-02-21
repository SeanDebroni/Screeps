const CONST = require('CONSTANTS');
const cacheFind = require('cacheFind');


module.exports = {

  runTower: function (tower)
  {
    if (tower)
    {
      var closestHostile; // = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

      var hostiles = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, tower.room);
      if (hostiles.length == 0)
      {
        closestHostile = false;
      }
      else
      {
        closestHostile = hostiles[0];
      }

      var damagedStructures = cacheFind.findCached(CONST.CACHEFIND_DAMAGEDSTRUCTURES, tower.room);
      var toRepair = damagedStructures[Math.floor(Math.random() * damagedStructures.length)];


      if (closestHostile)
      {
        tower.attack(closestHostile);
        return;
      }

      if (tower.energyCapacity * 0.50 > tower.energy) return;

      if (toRepair)
      {
        tower.repair(toRepair);
      }


    }
  }



}