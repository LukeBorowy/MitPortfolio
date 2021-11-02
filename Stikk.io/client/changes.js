let changelog=`
August 21, 2017: Initial release
April 16, 2018: Nerfed Bow, Buffed Blazing Sword+Torch, Bugfixes
April 29, 2018: Added Mobile! A few problems still, will fix soon
March 3, 2018: Removed Weird Boots, Fix respawn joystick glitch
May 15, 2018: Added Boost! Right click or press space to boost. Press the boost bar on mobile. Your boost decreases as you get more valuable items. Buy boots to increase boost speed and duration! 
May 25, 2018: Added Vampiric Sword and Flamethrower! Also some chestplate art.
June 18, 2018: Fixed many, hopefully all bugs, greatly reduced lag! You should now be able to play on slower devices.
July 16, 2018: Added Ammo! Ranged weapons now have a certain ammo, and must reload. Press R to force-reload, or tap the ammo box on mobile.
August 1, 2018: Added Crossbow, for 65 money! Also did some big lag fixes. Also reduced Basic Bow range slightly. 
January 1st, 2019: Added new helmet ability system! Helmets have abilities that can be activated by clicking the button in the top right corner, or pressing 'a' on the keyboard. New Moss Hat has been added, and new stats and ability for Viking Helmet. Also added some new art for Spy Cloak and Vine Shoes. Sorry about the lag, fixes coming soon.
January 5th, 2019: Hopefully reduced lag back to managable levels. You might get low FPS, but hopefully no freezing up.
January 15, 2019: Added a new helmet, the Straw Hat! Also buffed Viking Helmet. Added some lagfixes, hopefully will fix the freezing up. NOTICE: The Stikk.io server will go down at around 11am on January 16. I'll get it back up as soon as I can, hopefully by 6pm.
January 23, 2019: Added 2 new helmets, Spy Hat and Wizard Hat! Added art for Skeleton Suit. Made Tesla lightning flicker. Added second server, look in dropdown. The second one (US-EAST) might be super laggy, you should probably stay on the first one.
Febuary 13th, 2019: Added 2 new weapons for 500, the Rocket Launcher and the Phantom Blade!
Febuary 24, 2019: Balanced Minimap! Now, people in the top 3 can only see people better than themselves on the minimap. This stops leaders from hunting down noobs. Also added art for Elven Cloak.
March 21st, 2019: Reduced Wizard Hat health and Rocket Launcher range.
August 23rd, 2019: Added Chat and kill feed! You can click on the "chat" title to hide or show it.
September 6, 2020: Improved UI on big touchscreens, fixed bug with Tesla Chestplate.
October 19, 2020: Changed Chestplate of Glory to Crystal Chestplate, and added its art. Also removed chat logging (on my side).| If you want to chat to me, put @admin in the chat message. Also reduced armor for Wizard Hat.
October 28, 2020: Fix some lag, prevent spamming multiple open tabs. Also buffed torch+candlestick.| Private messages are coming in the future.
October 29, 2020: Fixed major bug not letting player rejoin.
November 6, 2020: Update to new server for less lag! It should now say US-CENTRAL instead of US-WEST.
November 29, 2020: Major balancing update! Made helmet abilities better and stats weaker. Also colored placeholder art. And more:| Buffed blazing sword, nerfed rocket launcher to match new helmets stuff. The wizard hat now needs time to teleport away. The chestplate placeholder arts have been colored to help you tell them apart. All helmets have had their stats greatly reduced, but their abilities buffed. Some of the other equipment abilities were also balanced out.
December 7, 2020: More balancing on Vampiric Sword, other top tier stuff. Added Tesla Chestplate art.| Wizard hat cooldown back to 30 seconds, Viking helmet ability change: -1 attackspeed, +2 damage. Golden cloak reduce armor. Vampiric sword chance down to 10%. Buff rocket launcher damage.
January  28, 2021: Adding safety time after spawning, which goes away after attacking or 4 seconds. Also nerfed blazing sword.`
function showChanges(){
    let changes=changelog.split("\n").slice(1);
    let mainChange=changes[changes.length-1];
    changes.reverse();
    if(window.location.href.indexOf("changes") !== -1){
        let parent=document.getElementById("changelog");
        for(let change of changes){
            let node= document.createElement('div');
            node.className="change";
            node.innerHTML=change.replace("|","");
            parent.appendChild(node)
        }
    }else{
        document.write(mainChange.split("|")[0]);
    }
}
showChanges();