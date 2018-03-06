'use strict';
const CONST = require('CONSTANTS');
const cacheFind = require('cacheFind');


module.exports = {

  runTowers: function (towers)
  {
    if (towers == undefined || towers == null) return;
    if (towers.length > 0)
    {
      var closestHostile; // = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      var room = towers[0].room;
      var hostiles = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, room);
      if (hostiles.length == 0)
      {
        closestHostile = false;
      }
      else
      {
        closestHostile = hostiles[0];
      }

      var damagedStructures = _.filter(cacheFind.findCached(CONST.CACHEFIND_DAMAGEDSTRUCTURES, room), (structure) => (structure.hits < 100000));
      var toRepair = damagedStructures[Math.floor(Math.random() * damagedStructures.length)];


      if (closestHostile)
      {
        for (var i = 0; i < towers.length; ++i)
        {
          towers[i].attack(closestHostile);
        }
        return;
      }

      if (toRepair)
      {
        for (var i = 0; i < towers.length; ++i)
        {
          if (towers[i].energyCapacity * 0.50 > towers[i].energy)
          {
            continue;
          }
          towers[i].repair(toRepair);
          if (!(toRepair.hits * 2 < toRepair.hitsMax))
          {
            return;
          }
        }
      }


    }
  }



}