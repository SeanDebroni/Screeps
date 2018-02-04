module.exports = {
  isCreepStuck: function (creep, direction)
  {
    var posToLook = new RoomPosition(creep.pos.x, creep.pos.y, creep.room.name);
    var cPos = creep.pos;
    posToLook.x = cPos.x;
    posToLook.y = cPos.y;
    switch (direction)
    {
    case TOP:
      posToLook.y = cPos.y - 1;
      break;
    case TOP_RIGHT:
      posToLook.y = cPos.y - 1;
      posToLook.x = cPos.x + 1;
      break;
    case RIGHT:
      posToLook.x = cPos.x + 1;
      break;
    case BOTTOM_RIGHT:
      posToLook.y = cPos.y + 1;
      posToLook.x = cPos.x + 1;
      break;
    case BOTTOM:
      posToLook.y = cPos.y + 1;
      break;
    case BOTTOM_LEFT:
      posToLook.y = cPos.y + 1;
      posToLook.x = cPos.x - 1;
      break;
    case LEFT:
      posToLook.x = cPos.x - 1;
      break;
    case TOP_LEFT:
      posToLook.y = cPos.y - 1;
      posToLook.x = cPos.x - 1;
      break;
    }
    var whatsThere = creep.room.lookAt(posToLook);
    for (var i = 0; i < whatsThere.length; ++i)
    {
      if (whatsThere[i].type === 'creep' || (whatsThere[i].type === 'structure'))
      {
        return true;
      }
    }
    return false;
  }
};