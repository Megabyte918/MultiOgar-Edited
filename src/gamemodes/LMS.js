var FFA = require('./FFA'); // Base gamemode
var Entity = require('../entity');
var Logger = require('../modules/Logger');
//var gameServer = require('../gameServer.js');
//LMS based gamemode
//Experimental Mode
//After a set time interval the Server will not allow players to spawn and will only let them specate
//Some time later, the Server will disconnect all players and restart the cycle.

function LMS () {
    var StartofLMS = false;


    FFA.apply(this, Array.prototype.slice.call(arguments));
    
    this.ID = 21;
    this.name = "LMS";
    this.specByLeaderboard = true;
    
    // Gamemode Specific Variables
    this.nodesMother = [];
    this.tickMotherSpawn = 0;
    this.tickMotherUpdate = 0;
    
    // Config
    this.motherSpawnInterval = 25 * 5;  // How many ticks it takes to spawn another mother cell (5 seconds)
    this.motherUpdateInterval = 2;     // How many ticks it takes to spawn mother food (1 second)
    this.motherMinAmount = 20;
    this.motherMaxAmount = 30;
    this.contenders = [];
    this.maxcontenders = 1500;
}

module.exports = LMS;
LMS.prototype = new FFA();

// Gamemode Specific Functions

LMS.prototype.spawnMotherCell = function (gameServer) {
    // Checks if there are enough mother cells on the map
    if (this.nodesMother.length >= this.motherMinAmount) {
        return;
    }
    // Spawns a mother cell
    var pos = gameServer.getRandomPosition();
    if (gameServer.willCollide(pos, 149)) {
        // cannot find safe position => do not spawn
        return;
    }
    // Spawn if no cells are colliding
    var mother = new Entity.MotherCell(gameServer, null, pos, null);
    gameServer.addNode(mother);
};

// Override

LMS.prototype.onServerInit = function (gameServer) {
    // Called when the server starts
    gameServer.run = true;
    
    var mapSize = Math.max(gameServer.border.width, gameServer.border.height);
    
    // 7 mother cells for vanilla map size
    //this.motherMinAmount = Math.ceil(mapSize / 2000);
    //this.motherMaxAmount = this.motherMinAmount * 2;
    
    var self = this;
    // Override
    
    // Special virus mechanics
    Entity.Virus.prototype.onEat = function (prey) {
        // Pushes the virus
        var angle = prey.isMoving ? prey.boostDirection.angle : this.boostDirection.angle;
        this.setBoost(16 * 20, angle);
    };
    Entity.MotherCell.prototype.onAdd = function () {
        self.nodesMother.push(this);
    };
    Entity.MotherCell.prototype.onRemove = function () {
        var index = self.nodesMother.indexOf(this);
        if (index != -1) {
            self.nodesMother.splice(index, 1);
        } else {
            Logger.error("Experimental.onServerInit.MotherVirus.onRemove: Tried to remove a non existing virus!");
        }
    };


LMS.prototype.onChange = function (gameServer) {
    // Remove all mother cells
    for (var i in this.nodesMother) {
        gameServer.removeNode(this.nodesMother[i]);
    }
    this.nodesMother = [];
    // Add back default functions
    Entity.Virus.prototype.onEat = require('../Entity/Virus').prototype.onEat;
    Entity.MotherCell.prototype.onAdd = require('../Entity/MotherCell').prototype.onAdd;
    Entity.MotherCell.prototype.onRemove = require('../Entity/MotherCell').prototype.onRemove;
};

LMS.prototype.onPlayerSpawn = function (gameServer, player) {
    // Only spawn players if LMS hasnt started yet
    if (StartofLMS = false) {
        player.setColor(gameServer.getRandomColor()); // Random color
        gameServer.spawnPlayer(player);
        }
    };
}
	var short = this.gameServer.config.lastManStandingShortest * 60000;
    var long = this.gameServer.config.lastManStandingLongest * 60000;
    var time = Math.floor((Math.Random() * long) + short);
    var kickingpeopletime = Math.floor((Math.Random() * 1800000 + this.gameServer.config.lastManStandingLongest) + 900000 + lastManStandingShortest); //Could be made into a config soon
    var LMS_end_interval = SetInterval(function() {LMS.prototype.lmsKickingpeople()}, kickingpeopletime);
    //1 minutes = 60000 milliseconds
    var LMS_START_INTERVAL = SetInterval(function() {LMS.prototype.lmsFunction()}, time); // 3600000 = 1 hour for future reference

    	LMS.prototype.lmsKickingpeople = function(){ 
		while (this.cell.length > 0) {
			this.gameServer.removeNode(this.cells[0])
		}
		    this.isRemoved = true;
    	return;
	};
LMS.prototype.lmsFunction = function () {

    StartofLMS = true;
    Logger.info("LMS HAS STARTED");

};


LMS.prototype.onPlayerDeath = function (gameServer){

};

LMS.prototype.onTick = function (gameServer) {
    // Mother Cell Spawning
    if (this.tickMotherSpawn >= this.motherSpawnInterval) {
        this.tickMotherSpawn = 0;
        this.spawnMotherCell(gameServer);
    } else {
        this.tickMotherSpawn++
    }
    if (this.tickMotherUpdate >= this.motherUpdateInterval) {
        this.tickMotherUpdate = 0;
        for (var i = 0; i < this.nodesMother.length; i++) {
            this.nodesMother[i].onUpdate();
        }
    } else {
        this.tickMotherUpdate++
    }


};
