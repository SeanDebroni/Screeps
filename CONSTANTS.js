const VAL_MAXSTRUCTUREHITS = 5000000;


const ROLE_HARVESTER = 'a';
const ROLE_UPGRADER = 'b';
const ROLE_BUILDER = 'c';
const ROLE_HAULER = 'd';
const ROLE_RETURNER = 'e';
const ROLE_SCOUT = 'f';
const ROLE_RESERVER = 'g';
const ROLE_ZERGLING = 'h';
const ROLE_DISASSEMBLEFLAG = 'i';
const ROLE_REPAIRMAN = 'j';



const TASK_FILLBASE = 'A';
const TASK_MINEENERGY = 'B';
const TASK_PICKUPENERGY = 'C';
const TASK_RECYCLE = 'D';
const TASK_WAITINGTOBERECYCLED = 'E';
const TASK_SPAWNING = 'F';
const TASK_FILLFROMBASE = 'G';
const TASK_BUILD = 'H';
const TASK_IDLE = 'I';
const TASK_UPGRADEROOM = "J";
const TASK_MOVETOTARGET = "K";
const TASK_RESERVE = "L";
const TASK_KILL = "M";
const TASK_DISASSEMBLE = "N";
const TASK_REPAIR = "O";



const CACHEFIND_SOURCES = 'aa';
const CACHEFIND_DROPPEDENERGY = 'ab';
const CACHEFIND_CONTAINERSTOFILL = 'ac';
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

const ROOMTYPE_MAIN = 'ba';
const ROOMTYPE_EXPANSION = 'bb';


const CONSTANTS = {
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
  ROLE_RETURNER: ROLE_RETURNER,
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
  CACHEFIND_CONTAINERSTOFILL: CACHEFIND_CONTAINERSTOFILL,
  CACHEFIND_CONSTRUCTIONSITES: CACHEFIND_CONSTRUCTIONSITES,
  CACHEFIND_STRUCTURESTOFILL: CACHEFIND_STRUCTURESTOFILL,
  CACHEFIND_TOWERSTOFILL: CACHEFIND_TOWERSTOFILL,
  CACHEFIND_CONTAINERSWITHENERGY: CACHEFIND_CONTAINERSWITHENERGY,
  CACHEFIND_STRUCTURESWITHENERGY: CACHEFIND_STRUCTURESWITHENERGY,
  CACHEFIND_SPAWNS: CACHEFIND_SPAWNS,

  TASK_MOVETOTARGET: TASK_MOVETOTARGET,
  ROLE_SCOUT: ROLE_SCOUT,

  CACHEFIND_MYTOWERS: CACHEFIND_MYTOWERS,
  ROOMTYPE_MAIN: ROOMTYPE_MAIN,
  ROOMTYPE_EXPANSION: ROOMTYPE_EXPANSION,
  ROLE_RESERVER: ROLE_RESERVER,
  TASK_RESERVE: TASK_RESERVE

};
module.exports = CONSTANTS;