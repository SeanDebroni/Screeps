'use strict';
const CONST = require('CONSTANTS');

var cache = new Map();

function findCachedInternal(whatToFind, room)
{
  if (room == null || room == undefined)
  {
    return [];
  }

  var key = whatToFind + " " + room.name;
  if (cache.has(key))
  {
    return cache.get(key);
  }

  switch (whatToFind)
  {
    case CONST.CACHEFIND_FINDSTRUCTURESTOSTEALENERGYFROM:
      var a = room.find(FIND_HOSTILE_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_LINK || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_LAB || structure.structureType == STRUCTURE_TERMINAL || structure.structureType == STRUCTURE_STORAGE);
        }
      });
      cache.set(key, a);
      break;
    case CONST.CACHEFIND_FINDEXTRACTOR:
      var a = room.find(FIND_STRUCTURES,
      {
        filter: (struct) =>
        {
          return struct.structureType == STRUCTURE_EXTRACTOR;
        }
      });
      cache.set(key, a);
      break;
    case CONST.CACHEFIND_FINDMINERALS:
      var b = room.find(FIND_MINERALS);
      cache.set(key, b);
      break;
    case CONST.CACHEFIND_TOMBSTONESWITHENERGY:
      var a = room.find(FIND_TOMBSTONES,
      {
        filter: (tomb) =>
        {
          return (tomb.store[RESOURCE_ENERGY] > 50);
        }
      });
      cache.set(key, a);
      break;
    case CONST.CACHEFIND_RETIREDZERGLINGS:
      let rz = _.filter(Game.creeps, (creepA) => creepA.memory.role == CONST.ROLE_ZERGLING && (creepA.memory.task == CONST.TASK_RECYCLE || creepA.memory.task == CONST.TASK_WAITINGTOBERECYCLED || creepA.memory.task == CONST.TASK_IDLE) && creepA.memory.homeRoom == room.name);
      cache.set(key, rz);
      break;

    case CONST.CACHEFIND_NONCOMBATCREEPS:
      let ncCreeps = _.filter(Game.creeps, (creepA) => creepA.memory.role != CONST.ROLE_ZERGLING && creepA.memory.workRoom == room.name);
      cache.set(key, ncCreeps);
      break;

    case CONST.CACHEFIND_FINDDAMAGEDCREEPS:
      let damagedCreeps = _.filter(Game.creeps, (creepA) => creepA.hits < creepA.hitsMax && creepA.memory.homeRoom == room.name);
      cache.set(key, damagedCreeps);
      break;

    case CONST.CACHEFIND_GETSTOREDENERGY:
      var structures = findCachedInternal(CONST.CACHEFIND_CONTAINERSWITHENERGY, room);
      let sum = 0;
      for (var i = 0; i < structures.length; ++i)
      {
        if (structures[i].structureType == STRUCTURE_TERMINAL || structures[i].structureType == STRUCTURE_CONTAINER || structures[i].structureType == STRUCTURE_STORAGE)
        {
          sum = sum + structures[i].store[RESOURCE_ENERGY];
        }
      }
      cache.set(key, sum);
      break;

    case CONST.CACHEFIND_FINDHAULERS:
      var a = _.filter(Game.creeps, (creep) => (room.name == creep.memory.workRoom && creep.memory.role == CONST.ROLE_HAULER));
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_FINDHARVESTERS:
      var a = _.filter(Game.creeps, (creep) => (room.name == creep.memory.workRoom && creep.memory.role == CONST.ROLE_HARVESTER));
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_FINDROADS:
      var a = (room.find(FIND_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType == STRUCTURE_ROAD);
        }
      }));
      var b = room.find(FIND_CONSTRUCTION_SITES,
      {
        filter: (site) =>
        {
          return (site.my && site.structureType == STRUCTURE_ROAD);
        }
      });
      cache.set(key, (a.concat(b)));
      break;


    case CONST.CACHEFIND_DAMAGEDSTRUCTURES:
      let maxHits = CONST.VAL_MAXSTRUCTUREHITS;
      if (room.controller != undefined && room.controller != null)
      {
        if (room.controller.level == 8)
        {
          maxHits = CONST.VAL_RCLEIGHTMAXSTRUCTUREHITS;
        }
      }
      var a = (room.find(FIND_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.hits < structure.hitsMax && structure.hits < maxHits);
        }
      }));
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_CRITICALDAMAGEDSTRUCTURES:
      let maxHits2 = CONST.VAL_MAXSTRUCTUREHITSCRITICAL;
      if (room.controller != undefined && room.controller != null)
      {
        if (room.controller.level == 8)
        {
          maxHits2 = CONST.VAL_RCLEIGHTMAXSTRUCTUREHITSCRITICAL;
        }
      }
      var a = (room.find(FIND_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.hits < structure.hitsMax && structure.hits < maxHits2);
        }
      }));
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_WALLS:
      var a = (room.find(FIND_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType == STRUCTURE_WALL);
        }
      }));
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_HOSTILEBUILDINGS:
      var a = (room.find(FIND_HOSTILE_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType != STRUCTURE_CONTROLLER);
        }
      }));
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_HOSTILECREEPS:
      var a = (room.find(FIND_HOSTILE_CREEPS));
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_MYTOWERS:
      var a = room.find(FIND_MY_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType == STRUCTURE_TOWER);
        }
      });
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_SOURCES:
      let s = room.find(FIND_SOURCES);
      cache.set(key, s);
      break;
    case CONST.CACHEFIND_FINDDROPPEDNONENERGY:
      var a = (room.find(FIND_DROPPED_RESOURCES,
      {
        filter: (resource) =>
        {
          return (resource.resourceType != RESOURCE_ENERGY);
        }
      }));
      cache.set(key, a);
      break;
    case CONST.CACHEFIND_DROPPEDENERGY:
      var d = (room.find(FIND_DROPPED_RESOURCES,
      {
        filter: (resource) =>
        {
          return (resource.resourceType == RESOURCE_ENERGY);
        }
      }));
      cache.set(key, d);
      break;

    case CONST.CACHEFIND_ENERGYCONTAINERSTOFILL:
      var a = (room.find(FIND_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (((structure.structureType == STRUCTURE_TERMINAL || structure.structureType == STRUCTURE_STORAGE) && (structure.store[RESOURCE_ENERGY] < (structure.storeCapacity / 2))) || (structure.structureType == STRUCTURE_CONTAINER && (_.sum(structure.store) < structure.storeCapacity)));
        }
      }));
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_CONSTRUCTIONSITES:
      cache.set(key, room.find(FIND_CONSTRUCTION_SITES,
      {
        filter: (site) =>
        {
          return (site.my);
        }
      }));
      break;

    case CONST.CACHEFIND_STRUCTURESTOFILL:
      var a = (room.find(FIND_MY_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && (structure.energy < structure.energyCapacity);
        }
      }));
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_TOWERSTOFILL:
      var a = room.find(FIND_MY_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType == STRUCTURE_TOWER) && (structure.energy < 0.6 * structure.energyCapacity) && structure.isActive();
        }
      });
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_CONTAINERSWITHENERGY:
      var a = room.find(FIND_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType == STRUCTURE_TERMINAL || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] >= 50;
        }
      });
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_STRUCTURESWITHENERGY:
      var a = room.find(FIND_MY_STRUCTURES,
      {
        filter: (structure) =>
        {
          return ((structure.structureType == STRUCTURE_EXTENSION) || (structure.structureType == STRUCTURE_SPAWN)) && structure.energy >= 50;
        }
      });
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_SPAWNS:
      var a = room.find(FIND_MY_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType == STRUCTURE_SPAWN)
        }
      });
      cache.set(key, a);
      break;

    default:
      console.log("TRYING TO FIND SOMETHING UNSUPPROTED");
      return;

  }
  return cache.get(key);
}

module.exports = {

  findCached: function(whatToFind, room)
  {
    return findCachedInternal(whatToFind, room);

  },
  cacheFindClear: function()
  {
    cache.clear();
  }

};
