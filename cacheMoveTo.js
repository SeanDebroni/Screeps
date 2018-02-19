var cacheMoveToM = new Map();

module.exports = {

  cacheMoveTo: function (creep, to)
  {
    var err11 = creep.moveTo(to,
    {
      reusePath: 10
    });
    return err11;
  },

  cacheMoveToClear: function ()
  {
    cacheMoveToM = new Map();
    Memory.cacheMoveToMSize = 0;
    Memory.cacheMoveToM = undefined;

  },
  cacheMoveToSave: function ()
  {
    if (cacheMoveToM.size > 0)
    {
      Memory.cacheMoveToMSize = cacheMoveToM.size;
      Memory.cacheMoveToM = JSON.stringify([...cacheMoveToM]);
    }


  },
  cacheMoveToLoad: function ()
  {

    if (Memory.cacheMoveToM != undefined)
    {
      var temp = JSON.parse(Memory.cacheMoveToM);
      var tempArr = temp.toString()
        .split(',');
      var arrSize = Memory.cacheMoveToMSize;
      cacheMoveToM = new Map();
      for (var i = 0; i < arrSize * 2; i = i + 2)
      {
        cacheMoveToM.set(tempArr[i], tempArr[i + 1]);
      }

    }



  }



}