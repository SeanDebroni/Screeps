'use strict';
var CONST = require("CONSTANTS");
var util = require("util");
var cacheFind = require("cacheFind");


var roleColonist = {
  run: function(creep)
  {
    //if not in work room, move to work room.
    if (creep.room.name != creep.memory.workRoom)
    {
      util.moveToRoom(creep, creep.memory.workRoom);
      return;
    }

    let room = creep.room;

    //If at low energy, find a source with energy, and mine from it until full or no sources with energy.
    // the 5 is mostly for upgrade room reuse
    if (creep.carry[RESOURCE_ENERGY] <= 5)
    {
      let sources = _.filter(cacheFind.findCached(CONST.CACHEFIND_SOURCES, room), (source) => (source.energy > 0));

      if (sources.length > 0)
      {
        creep.memory.targetID = sources[Math.floor(Math.random() * sources.length)].id;
        creep.memory.task = CONST.TASK_TEMPMINEENERGY;
        return;
      }
      else
      {
        let stuff = cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, room);
        if (stuff.length > 0)
        {
          creep.memory.targetID = -1;
          creep.memory.task = CONST.TASK_FILLFROMBASE;
          return;
        }
        else
        {
          let stuff2 = cacheFind.findCached(CONST.CACHEFIND_STRUCTURESWITHENERGY, room);
          creep.memory.targetID = stuff2[Math.floor(Math.random() * stuff2.length)].id;
          creep.memory.task = CONST.TASK_FILLFROMTARGETSTRUCTURE;
          return;
        }


      }
    }

    //if at > 0 energy, find a construction site, and build it.
    let constructionSites = cacheFind.findCached(CONST.CACHEFIND_CONSTRUCTIONSITES, room);
    if (constructionSites.length > 0)
    {
      creep.memory.targetID = constructionSites[0].id;
      creep.memory.task = CONST.TASK_BUILD;
      return;
    }

    //if no construction sites, upgrade the room.
    creep.memory.task = CONST.TASK_UPGRADEROOM;
    return;

  }


}
module.exports = roleColonist;
