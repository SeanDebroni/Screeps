
module.exports =
{

  init: function()
  {
    var flags = Game.flags;

    var flagNames = Object.keys(flags);

    for(var i = 0; i< flagNames.length; ++i)
    {
      var splitFlag = flagNames[i].split("-");

      if(splitFlag[0]=="RC")
      {
        console.log(flagNames[i]);
      }
    }


  }


}
