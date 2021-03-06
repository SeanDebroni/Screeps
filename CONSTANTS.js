'use strict';
const VAL_MAXSTRUCTUREHITS = 200000;
const VAL_RCLEIGHTMAXSTRUCTUREHITS = 300000000;
const VAL_RCLEIGHTMAXSTRUCTUREHITSCRITICAL = 37000000;


const VAL_MAINTAINROADSTIMER = 10;

const FLAGPREFIX_ROOMCONTROLLER = 'RC';
const FLAGPREFIX_WARCONTROLLER = 'WR';

const ROLE_HARVESTER = 'a';
const ROLE_UPGRADER = 'b';
const ROLE_BUILDER = 'c';
const ROLE_HAULER = 'd';
const ROLE_SCOUT = 'f';
const ROLE_RESERVER = 'g';
const ROLE_ZERGLING = 'h';
const ROLE_DISASSEMBLEFLAG = 'i';
const ROLE_REPAIRMAN = 'j';
const ROLE_BASEHEALER = 'k';
const ROLE_UPGRADEDANCER = 'l';
const ROLE_ENERGYTRANSFERER = 'm';
const ROLE_MINERALMINER = 'n';
const ROLE_CLAIMER = 'o';
const ROLE_COLONIST = 'p';
const ROLE_GUARD = 'q';

const TASK_FILLBASE = 'A';
const TASK_MINEENERGY = 'B';
const TASK_PICKUPENERGY = 'C';
const TASK_RECYCLE = 'D';
const TASK_WAITINGTOBERECYCLED = 'E';
const TASK_SPAWNING = 'F';
const TASK_FILLFROMBASE = 'G';
const TASK_BUILD = 'H';
const TASK_IDLE = 'I';
const TASK_UPGRADEROOM = 'J';
const TASK_MOVETOTARGET = 'K';
const TASK_RESERVE = 'L';
const TASK_KILL = 'M';
const TASK_DISASSEMBLE = 'N';
const TASK_REPAIR = 'O';
const TASK_FILLFROMTARGETSTRUCTURE = 'P';
const TASK_HEALTARGET = 'Q';
const TASK_FLEE = 'R';
const TASK_UPGRADEDANCE = 'S';
const TASK_MINEMINERAL = 'T';
const TASK_FILLTARGETSTRUCTURE = 'U';
const TASK_TEMPMINEENERGY = 'V';

const CACHEFIND_SOURCES = 'aa';
const CACHEFIND_DROPPEDENERGY = 'ab';
const CACHEFIND_ENERGYCONTAINERSTOFILL = 'ac';
const CACHEFIND_CONSTRUCTIONSITES = 'ad';
const CACHEFIND_STRUCTURESTOFILL = 'ae';
const CACHEFIND_TOWERSTOFILL = 'af';
const CACHEFIND_CONTAINERSWITHENERGY = 'ag';
const CACHEFIND_STRUCTURESWITHENERGY = 'ah';
const CACHEFIND_SPAWNS = 'ai';
const CACHEFIND_MYTOWERS = 'aj';
const CACHEFIND_HOSTILECREEPS = 'ak';
const CACHEFIND_HOSTILEBUILDINGS = 'al';
const CACHEFIND_WALLS = 'am';
const CACHEFIND_DAMAGEDSTRUCTURES = 'an';
const CACHEFIND_FINDHARVESTERS = 'ao';
const CACHEFIND_FINDHAULERS = 'ap';
const CACHEFIND_GETSTOREDENERGY = 'ar';
const CACHEFIND_FINDDAMAGEDCREEPS = 'as';
const CACHEFIND_NONCOMBATCREEPS = 'at';
const CACHEFIND_RETIREDZERGLINGS = 'au';
const CACHEFIND_TOMBSTONESWITHENERGY = 'av';
const CACHEFIND_FINDMINERALS = 'aw';
const CACHEFIND_FINDEXTRACTOR = 'ax';
const CACHEFIND_FINDDROPPEDNONENERGY = 'ay';
const CACHEFIND_FINDROADS = 'az';
const CACHEFIND_FINDSTRUCTURESTOSTEALENERGYFROM = 'ba';
const CACHEFIND_CRITICALDAMAGEDSTRUCTURES = 'bb';
const CACHEFIND_NEAREMPTYTOWERS = 'bc';
const CACHEFIND_GUARDS = 'bd';
const CACHEFIND_HOSTILETOWERS = 'be';
const CACHEFIND_HOSTILESOURCEKEEPERS = 'bf';

//BECAUSE THE API DOESNT HAVE IT, I WILL.
//Tombstone.structureType = this.
const STRUCTURE_TOMBSTONE = 'tombstone';

//TODO sort this pile of $#%@
const CONSTANTS = {
  CACHEFIND_HOSTILESOURCEKEEPERS: CACHEFIND_HOSTILESOURCEKEEPERS,
  CACHEFIND_HOSTILETOWERS: CACHEFIND_HOSTILETOWERS,
  ROLE_GUARD: ROLE_GUARD,
  CACHEFIND_NEAREMPTYTOWERS: CACHEFIND_NEAREMPTYTOWERS,
  VAL_RCLEIGHTMAXSTRUCTUREHITSCRITICAL: VAL_RCLEIGHTMAXSTRUCTUREHITSCRITICAL,
  CACHEFIND_CRITICALDAMAGEDSTRUCTURES: CACHEFIND_CRITICALDAMAGEDSTRUCTURES,
  CACHEFIND_FINDSTRUCTURESTOSTEALENERGYFROM: CACHEFIND_FINDSTRUCTURESTOSTEALENERGYFROM,
  FLAGPREFIX_ROOMCONTROLLER: FLAGPREFIX_ROOMCONTROLLER,
  FLAGPREFIX_WARCONTROLLER: FLAGPREFIX_WARCONTROLLER,
  TASK_TEMPMINEENERGY: TASK_TEMPMINEENERGY,
  ROLE_COLONIST: ROLE_COLONIST,
  TASK_FLEE: TASK_FLEE,
  ROLE_CLAIMER: ROLE_CLAIMER,
  CACHEFIND_FINDDROPPEDNONENERGY: CACHEFIND_FINDDROPPEDNONENERGY,
  CACHEFIND_FINDROADS: CACHEFIND_FINDROADS,
  VAL_MAINTAINROADSTIMER: VAL_MAINTAINROADSTIMER,
  CACHEFIND_FINDEXTRACTOR: CACHEFIND_FINDEXTRACTOR,
  TASK_FILLTARGETSTRUCTURE: TASK_FILLTARGETSTRUCTURE,
  CACHEFIND_FINDMINERALS: CACHEFIND_FINDMINERALS,
  TASK_MINEMINERAL: TASK_MINEMINERAL,
  ROLE_MINERALMINER: ROLE_MINERALMINER,
  STRUCTURE_TOMBSTONE: STRUCTURE_TOMBSTONE,
  CACHEFIND_TOMBSTONESWITHENERGY: CACHEFIND_TOMBSTONESWITHENERGY,
  TASK_UPGRADEDANCE: TASK_UPGRADEDANCE,
  ROLE_UPGRADEDANCER: ROLE_UPGRADEDANCER,
  ROLE_ENERGYTRANSFERER: ROLE_ENERGYTRANSFERER,
  CACHEFIND_RETIREDZERGLINGS: CACHEFIND_RETIREDZERGLINGS,
  CACHEFIND_NONCOMBATCREEPS: CACHEFIND_NONCOMBATCREEPS,
  CACHEFIND_FINDDAMAGEDCREEPS: CACHEFIND_FINDDAMAGEDCREEPS,
  TASK_HEALTARGET: TASK_HEALTARGET,
  ROLE_BASEHEALER: ROLE_BASEHEALER,
  CACHEFIND_GETSTOREDENERGY: CACHEFIND_GETSTOREDENERGY,
  TASK_FILLFROMTARGETSTRUCTURE: TASK_FILLFROMTARGETSTRUCTURE,
  VAL_RCLEIGHTMAXSTRUCTUREHITS: VAL_RCLEIGHTMAXSTRUCTUREHITS,
  CACHEFIND_FINDHAULERS: CACHEFIND_FINDHAULERS,
  CACHEFIND_FINDHARVESTERS: CACHEFIND_FINDHARVESTERS,
  ROLE_REPAIRMAN: ROLE_REPAIRMAN,
  VAL_MAXSTRUCTUREHITS: VAL_MAXSTRUCTUREHITS,
  CACHEFIND_DAMAGEDSTRUCTURES: CACHEFIND_DAMAGEDSTRUCTURES,
  TASK_REPAIR: TASK_REPAIR,
  ROLE_DISASSEMBLEFLAG: ROLE_DISASSEMBLEFLAG,
  TASK_DISASSEMBLE: TASK_DISASSEMBLE,
  CACHEFIND_WALLS: CACHEFIND_WALLS,
  TASK_KILL: TASK_KILL,
  ROLE_ZERGLING: ROLE_ZERGLING,
  CACHEFIND_HOSTILECREEPS: CACHEFIND_HOSTILECREEPS,
  CACHEFIND_HOSTILEBUILDINGS: CACHEFIND_HOSTILEBUILDINGS,
  ROLE_HARVESTER: ROLE_HARVESTER,
  ROLE_UPGRADER: ROLE_UPGRADER,
  ROLE_BUILDER: ROLE_BUILDER,
  ROLE_HAULER: ROLE_HAULER,
  TASK_FILLBASE: TASK_FILLBASE,
  TASK_MINEENERGY: TASK_MINEENERGY,
  TASK_PICKUPENERGY: TASK_PICKUPENERGY,
  TASK_RECYCLE: TASK_RECYCLE,
  TASK_WAITINGTOBERECYCLED: TASK_WAITINGTOBERECYCLED,
  TASK_SPAWNING: TASK_SPAWNING,
  TASK_FILLFROMBASE: TASK_FILLFROMBASE,
  TASK_BUILD: TASK_BUILD,
  TASK_IDLE: TASK_IDLE,
  TASK_UPGRADEROOM: TASK_UPGRADEROOM,
  CACHEFIND_SOURCES: CACHEFIND_SOURCES,
  CACHEFIND_DROPPEDENERGY: CACHEFIND_DROPPEDENERGY,
  CACHEFIND_ENERGYCONTAINERSTOFILL: CACHEFIND_ENERGYCONTAINERSTOFILL,
  CACHEFIND_CONSTRUCTIONSITES: CACHEFIND_CONSTRUCTIONSITES,
  CACHEFIND_STRUCTURESTOFILL: CACHEFIND_STRUCTURESTOFILL,
  CACHEFIND_TOWERSTOFILL: CACHEFIND_TOWERSTOFILL,
  CACHEFIND_CONTAINERSWITHENERGY: CACHEFIND_CONTAINERSWITHENERGY,
  CACHEFIND_STRUCTURESWITHENERGY: CACHEFIND_STRUCTURESWITHENERGY,
  CACHEFIND_SPAWNS: CACHEFIND_SPAWNS,
  TASK_MOVETOTARGET: TASK_MOVETOTARGET,
  ROLE_SCOUT: ROLE_SCOUT,
  CACHEFIND_MYTOWERS: CACHEFIND_MYTOWERS,
  ROLE_RESERVER: ROLE_RESERVER,
  TASK_RESERVE: TASK_RESERVE
};
module.exports = CONSTANTS;
