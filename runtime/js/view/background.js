var background = function (window) {
    'use strict';
    
    window.opspark = window.opspark || {};
    var draw = window.opspark.draw;
    var createjs = window.createjs;
    
    /*
     * Create a background view for our game application
     */
    window.opspark.makeBackground = function(app,ground) {
        if(!app) {
            throw new Error("Invaid app argument");
        }
        if(!ground || typeof(ground.y) == 'undefined') {
            throw new Error("Invalid ground argument");
        }

        // container which will be returned
        var background;
        var backgroundBox;
    
        
        // add objects for display inb ackground
        // called at the start of game and whenever the page is resized
        function render() {
            // useful variables
            var canvasWidth = app.canvas.width;
            var canvasHeight = app.canvas.height;
            var groundY = ground.y;
            
            window.backgroundChildren = [];
            background.removeAllChildren();

            // TODO: 3 - YOUR DRAW CODE GOES HERE
            
            function makeStar() {
                var line1, line2, line3, line4, centerX, centerY;
                centerX = canvasWidth*Math.random();
                centerY = groundY*Math.random();
                line1 = draw.line(centerX-5, centerY-5, centerX+5, centerY+5, 'lightGray', 2);
                line2 = draw.line(centerX-5, centerY+5, centerX+5, centerY-5, 'lightGray', 2);
                line3 = draw.line(centerX-5, centerY, centerX+5, centerY, 'white', 2);
                line4 = draw.line(centerX, centerY-5, centerX, centerY+5, 'white', 2);
                background.addChild(line1);
                background.addChild(line2);
                background.addChild(line3);
                background.addChild(line4);
            }
            for(var i=0;i<100;i++) {
                makeStar();
            }
            
            var moon = draw.bitmap('img/moon.png');
            moon.x = 70;
            moon.y = 25;
            moon.scaleX = 0.2;
            moon.scaleY = 0.2;
            background.addChild(moon);
            
            
            // backgroundBox = draw.rect(100,100,'Blue');
            // backgroundBox.x = 400;
            // backgroundBox.y = groundY-100;
            // background.addChild(backgroundBox);
            var buildings = [];
            var trees = [];
            
            var building, height;
            for(var i=0;i<7;++i) {
                height = Math.random() * 200 + 100;
                building = draw.rect(75,height,'LightGray','Black',1);
                building.x = 200*i;
                building.y = groundY-height;
                background.addChild(building);
                buildings.push(building);
            }
            
            var tree, scale;
            var treeHeight = 235;
            for(var i=0;i<3;++i) {
                scale = Math.random() * 0.8 + 0.2;
                tree = draw.bitmap('img/christmas-tree.png');
                tree.x = 400*i;
                tree.y = groundY-(235 * scale);
                tree.scaleX = scale;
                tree.scaleY = scale;
                background.addChild(tree);
                trees.push(tree);
            }
            
            // this fills the background with a obnoxious yellow
            // you should modify this to suit your game
            var backgroundFill = draw.rect(canvasWidth,groundY,'#9b0707');
            background.addChild(backgroundFill);
            
        }
        
        // Perform background animation
        // called on each timer "tick" - 60 times per second
        function update() {
            // useful variables
            var canvasWidth = app.canvas.width;
            var canvasHeight = app.canvas.height;
            var groundY = ground.y;
            
            for (var i=0; i<buildings.length; i++) {
                var building = buildings[i];
                building.x = building.x - 1;
                if(building.x < -100) {
                    building.x = canvasWidth;
                }
            }
            
            for (var i=0; i<trees.length; i++) {
                var tree = trees[i];
                tree.x = tree.x - 2;
                if(tree.x < -100) {
                    tree.x = canvasWidth;
                }
            }
        }

        background = new createjs.Container();
        background.resize = render;
        background.update = update;
        
        app.addResizeable(background);
        app.addUpdateable(background);
        
        render();
        return background;
    };
};

// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if((typeof process !== 'undefined') &&
    (typeof process.versions.node !== 'undefined')) {
    // here, export any references you need for tests //
    module.exports = background;
}