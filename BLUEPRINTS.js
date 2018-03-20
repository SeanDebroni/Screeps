'use strict';

const CONST = require('CONSTANTS');

//300 max energy
const RCL_ONE_MAIN_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 3,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK, MOVE]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 3,
    maxLevel: 15,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK, MOVE]
    },
    addExtraIfHaveEnergy: true
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 2,
    maxLevel: 20,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 0,
    maxLevel: 3,
    blueprint:
    {
      base: [MOVE, CLAIM, CLAIM, MOVE],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [CARRY, WORK, MOVE, MOVE],
      levelUp: [WORK, CARRY, MOVE, MOVE]
    },
    makeExtra: false
  },
  ROLE_BASEHEALER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, HEAL],
      levelUp: [MOVE, HEAL]
    }
  },
  ROLE_MINERALMINER:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, WORK, MOVE, CARRY, WORK]
    }
  }
};
const RCL_TWO_MAIN_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 5,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 3,
    maxLevel: 15,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK, MOVE]
    },
    addExtraIfHaveEnergy: true
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 5,
    maxLevel: 20,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 0,
    maxLevel: 3,
    blueprint:
    {
      base: [MOVE, CLAIM, CLAIM, MOVE],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [CARRY, WORK, MOVE, MOVE],
      levelUp: [WORK, CARRY, MOVE, MOVE]
    },
    makeExtra: false
  },
  ROLE_BASEHEALER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, HEAL],
      levelUp: [MOVE, HEAL]
    }
  },
  ROLE_MINERALMINER:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, WORK, MOVE, CARRY, WORK]
    }
  }
};
const RCL_THREE_MAIN_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 5,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 5,
    maxLevel: 15,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK, MOVE]
    },
    addExtraIfHaveEnergy: true
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 5,
    maxLevel: 20,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 0,
    maxLevel: 3,
    blueprint:
    {
      base: [MOVE, CLAIM, CLAIM, MOVE],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 1,
    maxLevel: 3,
    blueprint:
    {
      base: [CARRY, WORK, MOVE, MOVE],
      levelUp: [WORK, CARRY, MOVE, MOVE]
    },
    makeExtra: false
  },
  ROLE_BASEHEALER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, HEAL],
      levelUp: [MOVE, HEAL]
    }
  },
  ROLE_MINERALMINER:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, WORK, MOVE, CARRY, WORK]
    }
  }
};
const RCL_FOUR_MAIN_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 5,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 1,
    maxLevel: 15,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK, MOVE]
    },
    addExtraIfHaveEnergy: true
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 2,
    maxLevel: 20,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [CARRY, MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 0,
    maxLevel: 3,
    blueprint:
    {
      base: [MOVE, CLAIM, CLAIM, MOVE],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 1,
    maxLevel: 10,
    blueprint:
    {
      base: [CARRY, WORK, MOVE, MOVE],
      levelUp: [WORK, CARRY, MOVE, MOVE]
    },
    makeExtra: false
  },
  ROLE_BASEHEALER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, HEAL],
      levelUp: [MOVE, HEAL]
    }
  },
  ROLE_MINERALMINER:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, WORK, MOVE, CARRY, WORK]
    }
  }
};
const RCL_FIVE_MAIN_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 5,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 1,
    maxLevel: 15,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK, MOVE]
    },
    addExtraIfHaveEnergy: true
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 2,
    maxLevel: 20,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [CARRY, MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 0,
    maxLevel: 3,
    blueprint:
    {
      base: [MOVE, CLAIM, CLAIM, MOVE],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 1,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, WORK, MOVE, MOVE],
      levelUp: [WORK, CARRY, MOVE, MOVE]
    },
    makeExtra: false
  },
  ROLE_BASEHEALER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, HEAL],
      levelUp: [MOVE, HEAL]
    }
  },
  ROLE_MINERALMINER:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, WORK, MOVE, CARRY, WORK]
    }
  }
};
const RCL_SIX_MAIN_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 5,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 1,
    maxLevel: 15,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK, MOVE]
    },
    addExtraIfHaveEnergy: true
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 2,
    maxLevel: 20,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [CARRY, MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 0,
    maxLevel: 3,
    blueprint:
    {
      base: [MOVE, CLAIM, CLAIM, MOVE],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 1,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, WORK, MOVE, MOVE],
      levelUp: [WORK, CARRY, MOVE, MOVE]
    },
    makeExtra: false
  },
  ROLE_BASEHEALER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, HEAL],
      levelUp: [MOVE, HEAL]
    }
  },
  ROLE_MINERALMINER:
  {
    maxCreeps: 1,
    maxLevel: 25,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, WORK, MOVE, CARRY, WORK]
    }
  }
};
const RCL_SEVEN_MAIN_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 5,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 1,
    maxLevel: 21,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK, MOVE]
    },
    addExtraIfHaveEnergy: true
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 2,
    maxLevel: 20,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [CARRY, MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 0,
    maxLevel: 3,
    blueprint:
    {
      base: [MOVE, CLAIM, CLAIM, MOVE],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 1,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, WORK, MOVE, MOVE],
      levelUp: [WORK, CARRY, MOVE, MOVE]
    },
    makeExtra: false
  },
  ROLE_BASEHEALER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, HEAL],
      levelUp: [MOVE, HEAL]
    }
  },
  ROLE_MINERALMINER:
  {
    maxCreeps: 1,
    maxLevel: 37,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, WORK, MOVE, CARRY, WORK]
    }
  }
};
const RCL_EIGHT_MAIN_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 5,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 1,
    maxLevel: 22,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK, MOVE]
    },
    addExtraIfHaveEnergy: false
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 2,
    maxLevel: 20,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [CARRY, MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 0,
    maxLevel: 3,
    blueprint:
    {
      base: [MOVE, CLAIM, CLAIM, MOVE],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 1,
    maxLevel: 25,
    blueprint:
    {
      base: [CARRY, WORK, MOVE],
      levelUp: [MOVE, WORK, CARRY]
    },
    makeExtra: false
  },
  ROLE_BASEHEALER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, HEAL],
      levelUp: [MOVE, HEAL]
    }
  },
  ROLE_MINERALMINER:
  {
    maxCreeps: 1,
    maxLevel: 50,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, WORK, MOVE, CARRY, WORK]
    }
  }
};

const RCL_ONE_EXT_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 3,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK, MOVE]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 0,
    maxLevel: 15,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK]
    },
    addExtraIfHaveEnergy: true
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 0,
    maxLevel: 20,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CLAIM, CLAIM, MOVE],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 0,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, WORK, MOVE, MOVE],
      levelUp: [WORK, CARRY, MOVE, MOVE]
    },
    makeExtra: false
  }

};
const RCL_TWO_EXT_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 5,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK, MOVE]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 0,
    maxLevel: 15,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK]
    },
    addExtraIfHaveEnergy: true
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 0,
    maxLevel: 20,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CLAIM, CLAIM, MOVE],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 0,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, WORK, MOVE, MOVE],
      levelUp: [WORK, CARRY, MOVE, MOVE]
    },
    makeExtra: false
  }
};
const RCL_THREE_EXT_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 5,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK, MOVE]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 0,
    maxLevel: 15,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK]
    },
    addExtraIfHaveEnergy: true
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 0,
    maxLevel: 20,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CLAIM, CLAIM, MOVE],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 0,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, WORK, MOVE, MOVE],
      levelUp: [WORK, CARRY, MOVE, MOVE]
    },
    makeExtra: false
  }
};
const RCL_FOUR_EXT_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 7,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK, MOVE, WORK]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 0,
    maxLevel: 15,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK]
    },
    addExtraIfHaveEnergy: true
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 1,
    maxLevel: 10,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 16,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [CARRY, MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CLAIM, MOVE, CLAIM],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [CARRY, WORK, MOVE, MOVE],
      levelUp: [WORK, CARRY, MOVE, MOVE]
    },
    makeExtra: false
  }
};
const RCL_FIVE_EXT_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 5,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 0,
    maxLevel: 15,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK]
    },
    addExtraIfHaveEnergy: true
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 1,
    maxLevel: 20,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 16,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [CARRY, MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CLAIM, CLAIM, MOVE],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 1,
    maxLevel: 4,
    blueprint:
    {
      base: [CARRY, WORK, MOVE],
      levelUp: [MOVE, WORK, CARRY]
    },
    makeExtra: false
  }
};
const RCL_SIX_EXT_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 5,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 0,
    maxLevel: 15,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK]
    },
    addExtraIfHaveEnergy: true
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 2,
    maxLevel: 20,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 17,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [CARRY, MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CLAIM, CLAIM, MOVE],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 1,
    maxLevel: 7,
    blueprint:
    {
      base: [CARRY, WORK, MOVE],
      levelUp: [MOVE, WORK, CARRY]
    },
    makeExtra: true
  }
};
const RCL_SEVEN_EXT_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 6,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 0,
    maxLevel: 15,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK]
    },
    addExtraIfHaveEnergy: true
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 2,
    maxLevel: 20,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 23,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [CARRY, MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CLAIM, CLAIM, MOVE],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 1,
    maxLevel: 10,
    blueprint:
    {
      base: [CARRY, WORK, MOVE],
      levelUp: [MOVE, WORK, CARRY]
    },
    makeExtra: true
  }
};
const RCL_EIGHT_EXT_CREEP = {
  ROLE_HARVESTER:
  {
    maxCreepPerSource: 1,
    maxLevel: 6,
    blueprint:
    {
      base: [MOVE, WORK],
      levelUp: [WORK]
    }
  },
  ROLE_UPGRADER:
  {
    maxCreeps: 0,
    maxLevel: 15,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [WORK, WORK, CARRY, WORK, WORK]
    },
    addExtraIfHaveEnergy: true
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 2,
    maxLevel: 50,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_HAULER:
  {
    maxCreepPerHarvester: 2,
    maxLevel: 23,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [CARRY, MOVE, CARRY]
    }
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_RESERVER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CLAIM, CLAIM, MOVE],
      levelUp: [MOVE, CLAIM]
    }
  },

  ROLE_REPAIRMAN:
  {
    maxCreeps: 1,
    maxLevel: 13,
    blueprint:
    {
      base: [CARRY, WORK, MOVE],
      levelUp: [MOVE, WORK, CARRY]
    },
    makeExtra: true
  }
};
const RCL_ALL_COL_CREEP = {
  ROLE_RESERVER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CLAIM],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_CLAIMER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CLAIM],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: false,
    maxCreeps: 1,
    maxLevel: 21,
    blueprint:
    {
      base: [MOVE, MOVE, WORK, CARRY],
      levelUp: [MOVE, MOVE, WORK, CARRY, MOVE, CARRY, MOVE, CARRY]
    }
  }

};

const RCL_ALL_PL_CREEP = {
  ROLE_UPGRADER:
  {
    maxCreeps: 9,
    maxLevel: 50,
    blueprint:
    {
      base: [WORK, CARRY, MOVE],
      levelUp: [MOVE, WORK, WORK, CARRY, WORK, WORK]
    },
    addExtraIfHaveEnergy: false
  },
  ROLE_BUILDER:
  {
    upgradeCreeps: true,
    maxCreeps: 2,
    maxLevel: 50,
    blueprint:
    {
      base: [MOVE, CARRY, WORK],
      levelUp: [MOVE, WORK, CARRY]
    }
  },
  ROLE_ENERGYTRANSFERER:
  {
    maxCreeps: 1,
    maxLevel: 50,
    blueprint:
    {
      base: [CARRY, MOVE],
      levelUp: [CARRY, MOVE, CARRY]
    },
    makeExtra: true
  },
  ROLE_SCOUT:
  {
    maxCreeps: 0,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE],
      levelUp: [MOVE]
    }
  },
  ROLE_CLAIMER:
  {
    maxCreeps: 1,
    maxLevel: 1,
    blueprint:
    {
      base: [MOVE, CLAIM],
      levelUp: [MOVE, CLAIM]
    }
  },
  ROLE_REPAIRMAN:
  {
    maxCreeps: 1,
    maxLevel: 25,
    blueprint:
    {
      base: [CARRY, WORK, MOVE],
      levelUp: [MOVE, WORK, CARRY]
    },
    makeExtra: false
  }
};

const RCL_ONE_STRUCTUREBLUEPRINT = {};
const RCL_TWO_STRUCTUREBLUEPRINT = {};
const RCL_THREE_STRUCTUREBLUEPRINT = {};
const RCL_FOUR_STRUCTUREBLUEPRINT = {};
const RCL_FIVE_STRUCTUREBLUEPRINT = {};
const RCL_SIX_STRUCTUREBLUEPRINT = {};
const RCL_SEVEN_STRUCTUREBLUEPRINT = {};
const RCL_EIGHT_STRUCTUREBLUEPRINT = {};



const BLUEPRINTS = {
  RCL_ALL_PL_CREEP: RCL_ALL_PL_CREEP,

  RCL_ALL_COL_CREEP: RCL_ALL_COL_CREEP,

  RCL_ONE_EXT_CREEP: RCL_ONE_EXT_CREEP,
  RCL_TWO_EXT_CREEP: RCL_TWO_EXT_CREEP,
  RCL_THREE_EXT_CREEP: RCL_THREE_EXT_CREEP,
  RCL_FOUR_EXT_CREEP: RCL_FOUR_EXT_CREEP,
  RCL_FIVE_EXT_CREEP: RCL_FIVE_EXT_CREEP,
  RCL_SIX_EXT_CREEP: RCL_SIX_EXT_CREEP,
  RCL_SEVEN_EXT_CREEP: RCL_SEVEN_EXT_CREEP,
  RCL_EIGHT_EXT_CREEP: RCL_EIGHT_EXT_CREEP,

  RCL_ONE_MAIN_CREEP: RCL_ONE_MAIN_CREEP,
  RCL_TWO_MAIN_CREEP: RCL_TWO_MAIN_CREEP,
  RCL_THREE_MAIN_CREEP: RCL_THREE_MAIN_CREEP,
  RCL_FOUR_MAIN_CREEP: RCL_FOUR_MAIN_CREEP,
  RCL_FIVE_MAIN_CREEP: RCL_FIVE_MAIN_CREEP,
  RCL_SIX_MAIN_CREEP: RCL_SIX_MAIN_CREEP,
  RCL_SEVEN_MAIN_CREEP: RCL_SEVEN_MAIN_CREEP,
  RCL_EIGHT_MAIN_CREEP: RCL_EIGHT_MAIN_CREEP
};
module.exports = BLUEPRINTS;