var level01 = function (window) {
    window.opspark = window.opspark || {};

    var draw = window.opspark.draw;
    var createjs = window.createjs;

    window.opspark.runLevelInGame = function(game) {
        // some useful constants 
        var groundY = game.groundY;

        // this data will allow us to define all of the
        // behavior of our game
        var levelData = {
            name: "Robot Romp",
            number: 1, 
            speed: -3,
            gameItems: [
                {type: 'sawblade',x:400,y:groundY, scale: 1, loc:'img/sawblade.png'};
                {type: 'sawblade',x:900,y:groundY};
                {type: 'sawblade',x:1200,y:groundY - 110};
                {type: 'sawblade',x:1900,y:groundY};
                {type: 'sawblade',x:2400,y:groundY - 110};
                {type: 'elf', x:550, y:groundY-50};
                {type: 'elf', x:1000, y:groundY-50};
                {type: 'elf', x:1800, y:groundY-50};
                {type: 'elf', x:2600, y:groundY-50};
                {type: 'elf', x:3200, y:groundY-50};
            ]
        };
        window.levelData = levelData;

        // set this to true or false depending on if you want to see hitzones
        game.setDebugMode(true);

        // BEGIN EDITING YOUR CODE HERE
     
        for (var i = 0, i < gameItems.length, i++) {
            var gameItem = gameItems[i];
            
            if (gameItem.type === 'sawblade'){
                createSawblade(gameItem.x, gameItem.y)
            } else if (gameItem.type === 'elf') {
                createEnemy()
            }
        }
        
        function createSawblade(x, y) {
           var hitZoneSize = 25;
            var damageFromObstacle = 10;
            var myObstacle, obstacleImage;
            
            myObstacle = game.createObstacle(hitZoneSize,damageFromObstacle);
    
            myObstacle.x = 300;
            myObstacle.y = 100;
            
            obstacleImage = draw.bitmap('img/sawblade.png');
            myObstacle.addChild(obstacleImage);
            
            obstacleImage.x = -25;
            obstacleImage.y = -25;
            
            game.addGameItem(myObstacle);
        }
        
        // Add Enemies!
        function createEnemy(x, y) {
            var enemy, enemyImage;
            
            enemy =  game.createGameItem('enemy',25);
            enemyImage = draw.bitmap('img/elf.png');
            enemyImage.scaleX = 0.4;
            enemyImage.scaleY = 0.4
            enemyImage.x = -25;
            enemyImage.y = -25;
            enemy.velocityX = -2;

            enemy.addChild(enemyImage);
            enemy.x = x;
            enemy.y = y;
            
            enemy.onPlayerCollision = function() {
                console.log('The enemy has hit Halle');
                game.changeIntegrity(-10);
                enemy.fadeOut();
            
            
                enemy.onProjectileCollision = function() {
                  console.log('Halle has hit the enemy');
                  game.increaseScore(100);
                  enemy.flyTo(enemy.x + 120,enemy.y - 200);
                }
            }
            game.addGameItem(enemy);
        
    
    };
};

// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if((typeof process !== 'undefined') &&
    (typeof process.versions.node !== 'undefined')) {
    // here, export any references you need for tests //
    module.exports = level01;
}