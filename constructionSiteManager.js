'use strict';

let csQue = [];

let maxSites = 80;

module.exports = {

  run()
  {
    let sites = Object.keys(Game.constructionSites);
    console.log("CS MANAGER");
    console.log("PLACED SITES: " + sites.length);
    console.log("QUEUED SITES: " + csQue.length);

    if (sites.length < maxSites && csQue.length == 0)
    {
      return;
    }
    let sitesArr = [];
    for (let i = 0; i < sites.length; ++i)
    {
      sitesArr.push(Game.constructionSites[sites[i]]);
    }

    let diff = sitesArr.length - maxSites;
    console.log(diff);
    //Add to queue; 
    if (diff > 0)
    {
      for (let i = sitesArr.length - diff; i < sitesArr.length; ++i)
      {
        csQue.push(sitesArr[i]);
        console.log("ADDED " + sitesArr[i].pos.x + " " + sitesArr[i].pos.y + " " + sitesArr[i].pos.roomName + " " + sitesArr[i].structureType + " TO SITE QUEUE");
        sitesArr[i].remove();
      }
    }
    if (diff < 0)
    {
      for (let i = 0; i < Math.abs(diff) && csQue.length > 0; ++i)
      {
        let siteToAdd = csQue.shift();

        let room = Game.rooms[siteToAdd.pos.roomName];
        if (room == undefined)
        {
          csQue.push(siteToAdd);
          console.log("ADDED " + sitesArr[i].pos.x + " " + sitesArr[i].pos.y + " " + sitesArr[i].pos.roomName + " " + sitesArr[i].structureType + " BACK TO SITE QUEUE BC ROOM UNDEF");
        }
        else
        {
          let ret = room.createConstructionSite(siteToAdd.pos, siteToAdd.structureType);
          if (ret == ERR_FULL)
          {
            csQue.push(siteToAdd);
          }
          else
          {
            console.log("PLACED " + siteToAdd.pos.x + " " + siteToAdd.pos.y + " " + siteToAdd.pos.roomName + " " + siteToAdd.structureType + " TO THE WORLD");
          }
        }
      }
    }

    //Remove to queue;
  }

};
