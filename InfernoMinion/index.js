/// <reference types="../CTAutocomplete" />
import PogObject from "PogData";
let data = new PogObject("InfernoMinion", {
    "vertex": 0,
    "apex": 0,
    "chili": 0,
    "ceramics": 0,
    "reapers": 0,
    "time": 0,
    "x": 0,
    "y": 0,
    "firstLog": true
}, ".minionLoot.json");
var inMinion = false
var playerInv
var fuel = ""
var timeLeft = ""
hideGUI = false
if (data.firstLog) {
    ChatLib.chat('&aDo /infhelp for a list of commands!')
    data.firstLog = false
    data.save()
}
register("guiOpened", () => {
    Client.scheduleTask(2, () => {
    a = Player.getContainer().getName();
    if (a.includes("Inferno Minion")) {
        inMinion = true
        playerInv = Player.getInventory().getItems()
        fuel = Player.getContainer().getStackInSlot(19).getName()
    }
    })
})
register("guiClosed", () => {
    if (inMinion) {
        let playerInvNew = Player.getInventory().getItems()
        for (let i = 0; i < playerInv.length; i++) {
            
            if ((playerInv[i] == null) != (playerInvNew[i] == null)) {
                if (playerInvNew[i] == null) return;
                let name = playerInvNew[i].getName()
                    if (name.includes('Vertex')) {
                        data.vertex += playerInvNew[i].getStackSize()
                    } else if (name.includes('Apex') == true) {
                        data.apex += playerInvNew[i].getStackSize()
                    } else if (name.includes('Chili') == true) {
                        data.chili += playerInvNew[i].getStackSize()
                    } else if (name.includes('Reaper') == true) {
                        data.reapers += playerInvNew[i].getStackSize()
                    } else if (name.includes('Ceramics') == true) {
                        data.ceramics += playerInvNew[i].getStackSize()
                    }
                    data.save()
            } else if (((playerInv[i] != null) && (playerInvNew[i] != null)) && playerInv[i].getStackSize() != playerInvNew[i].getStackSize()) {
                if (playerInv[i].getName().equals(playerInvNew[i].getName())) {
                    let name = playerInvNew[i].getName()
                    if (name.includes('Vertex')) {
                        data.vertex += playerInvNew[i].getStackSize() - playerInv[i].getStackSize()
                    } else if (name.includes('Apex') == true) {
                        data.apex += playerInvNew[i].getStackSize() - playerInv[i].getStackSize()
                    } else if (name.includes('Chili') == true) {
                        data.chili += playerInvNew[i].getStackSize() - playerInv[i].getStackSize()
                    } else if (name.includes('Reaper') == true) {
                        data.reapers += playerInvNew[i].getStackSize() - playerInv[i].getStackSize()
                    } else if (name.includes('Ceramics') == true) {
                        data.ceramics += playerInvNew[i].getStackSize() - playerInv[i].getStackSize()
                    }
                    data.save()
                }
            }
        }
       playerInv = playerInvNew 
    }
    inMinion =  false
})
register('guiMouseClick', () => {
    if (inMinion) {
        fuel = Player.getContainer().getStackInSlot(19).getName()
    
    if (fuel.equals('§aFuel')) {
        Client.scheduleTask(2, () => {
            let a = Player.getContainer().getName()
            if (a.includes('Inferno Minion')) {
                let chest = Player.getContainer().getStackInSlot(19).getName()
                if (!(chest.equals(fuel))) {
                    data.time = new Date().getTime() + 86400000
                }
            }
        })
    }
}
})
register("renderOverlay", () => {
    if (!hideGUI){Renderer.drawStringWithShadow(`&7Fuel Time: ${timeLeft}\n&6Ceramics: ${data.ceramics}\n&9Chili: ${data.chili}\n&aVertex: ${data.vertex}\n&cReaper Pepper: ${data.reapers}\n&eApex: ${data.apex}`, data.x, data.y)}
})
register('step', () => {
    let date
    if ((date = new Date().getTime()) < data.time){let mili = data.time - new Date().getTime()
    timeLeft = new Date(mili).toISOString().slice(11, 19)} else {
        timeLeft = '&4FUEL DONE'
    }
}).setDelay(1)

register('command', () => {
    data.ceramics = 0
    data.apex = 0
    data.vertex = 0
    data.chili = 0
    data.reapers = 0
    data.save()
}).setCommandName('resetminion')
register('command', () => {
    data.time = 0
    data.save()
}).setCommandName('resettime')
register('command', () => {
    hideGUI = !hideGUI
}).setCommandName('infhide')
var infmove = new Gui()
register("command", () => {
    infmove.open();
}).setCommandName('infgui');
register("dragged", (dx, dy, x, y) => {
      if (!infmove.isOpen()) return
      data.x = x
      data.y = y
      data.save()
})
register('command', () => {
    ChatLib.chat(`&8/resetminion - Resets all the saved minion loot data.\n\n&8/resettime - Resets the time remaining on fuel.\n\n&8/infgui - Allows you to move the gui.\n\n&8a/infhide - Hides the minion loot gui.`)
}).setCommandName('infhelp')