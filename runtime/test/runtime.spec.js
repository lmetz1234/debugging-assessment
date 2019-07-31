// mock a global window object //

const
    _ = require('lodash'),
    expect = require('chai').expect,
    sinon = require('sinon'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    window = require('../test/windowMock.js'),
    init = require('../js/init.js'),
    background = require('../js/view/background.js'),
    level01 = require('../js/level01.js');

describe('runtime', function() {
    describe('index.html', function() {
        const $ = cheerio.load(fs.readFileSync('index.html')),
            scripts = $('script');

        var hasHud = false,
            hasBackground = false,
            hasLevel01 = false;
        
        var src;
        for (var i = 0; i < scripts.length; i++) {
            src = scripts[i].attribs.src;
            if (src === 'js/view/hud.js') {
                hasHud = true;
            } else if (src === 'js/view/background.js') {
                hasBackground = true;
            } else if (src === 'js/level01.js') {
                hasLevel01 = true;
            }
        }
        it('should load hud.js', function() {
            expect(hasHud).to.be.true;
        });
        
        it('should load background.js', function() {
            expect(hasBackground).to.be.true;
        });
        
        it('should load level01.js', function() {
            expect(hasLevel01).to.be.true;
        });
    });
    
    describe('JavaScript', function() {
        background(window);
        level01(window);
        
        const opspark = window.opspark;
        
        describe('init.js', function() {
            var viewSpy, hudSpy, bgSpy, gameManagerSpy, runLevelSpy;
            before(function(done) {
                viewSpy = sinon.spy(opspark.app.view, 'addChild');
                hudSpy = sinon.spy(opspark, 'makeHud');
                bgSpy = sinon.spy(opspark, 'makeBackground');
                gameManagerSpy = sinon.spy(opspark, 'createGameManager');
                runLevelSpy = sinon.spy(opspark, 'runLevelInGame');    
                init(window);
                done();
                
            });
            
            after(function(done) {
                viewSpy.restore();
                hudSpy.restore();
                bgSpy.restore();
                gameManagerSpy.restore();
                runLevelSpy.restore();
                done();
            });
            
            it('should create a HUD with opspark.makeHud and add it to the view', function(done) {
                expect(hudSpy.called, 'See Step 3 - Adding The Heads-Up Display').to.be.true;
                // expect(viewSpy.calledWith('hud'), 'must pass hud object to view.addChild() to add it to the view').to.be.true;
                done();
            });
            
            it('should create a background with opspark.makeBackground', function(done) {
                // this should be 2 to account for calling it later in this test spec
                expect(bgSpy.called, 'See Step 4 - Adding A Background').to.be.true;
                // expect(opspark.app.view.addChild.calledWith('background'), 'must pass background object to view.addChild() to add it to the view').to.be.true;
                done();
            });
            
            it('should create a game manager with opspark.createGameManager', function(done) {
                expect(opspark.createGameManager.called, 'See Step 9 - Setting Up Gameplay').to.be.true;
                done();
            });
            
            it('should call opspark.runLevelInGame', function(done) {
                // this should be 2 to account for calling it later in this test spec
                expect(opspark.runLevelInGame.called, 'See Step 9 - Setting Up Gameplay').to.be.true;
                done();
            });
        });
        
        describe('background.js', function() {
            const 
                draw = opspark.draw,
                app = opspark.app,
                ground = window.game.ground;
            var lineSpy, rectSpy, circleSpy, bitmapSpy, bg;
            
            before(function(done) {
                lineSpy = sinon.spy(draw, 'line');
                rectSpy = sinon.spy(draw, 'rect');
                circleSpy = sinon.spy(draw, 'circle');
                bitmapSpy = sinon.spy(draw, 'bitmap');
                bg = opspark.makeBackground(app, ground);
                done();
            });
            
            after(function(done) {
                lineSpy.restore();
                rectSpy.restore();
                circleSpy.restore();
                bitmapSpy.restore();
                done();
            });
            
            it('should first create a background with draw.rect and set the color/height', function() {
                // run the student's code //
                expect(draw.rect.called).to.be.true;
                
                // remove backgroundFill from backgroundChildren as it will be tested differently than the other background objects. it should be the first background object added
                var backgroundFill = window.backgroundChildren.shift();
                
                // the first background child should be thebackground with width of the canvas, height set to groundY, and a new color
                expect(backgroundFill.width).to.equal(app.canvas.width, "the background must fill the entire width of the screen");
                expect(backgroundFill.height).to.equal(ground.y, "the background must fill the screen above groundY");
                expect(backgroundFill.color).to.not.equal('yellow', "the background color must be changed from yellow");
            });
            
            it('should add every drawn image to the background', function() {
                // tally up all counts to the draw API and subtract 1 for the backgroundFill
                var backgroundDrawCount = draw.bitmap.callCount + draw.rect.callCount + draw.line.callCount + draw.circle.callCount - 1;
            
                expect(window.backgroundChildren.length).to.equal(backgroundDrawCount, 'make sure you are adding each drawn shape to the background with background.addChild(shape)');
            
                for (var i = 0; i < window.backgroundChildren.length; i++) {
                    let element = window.backgroundChildren[i];
                    expect(element.x === undefined, 'a background element is missing an x value').to.be.false;
                    expect(element.y === undefined, 'a background element is missing an y value').to.be.false;
                }
            });
            
            it('should animate the background in the update function', function() {
                var bgXY = [];
                for (var i = 0; i < window.backgroundChildren.length; i++) {
                    let element = window.backgroundChildren[i];
                    bgXY.push({x: element.x, y: element.y});
                }
                bg.update();
                var isAnimating = false;
                for (var i = 0; i < window.backgroundChildren.length; i++) {
                    let element = window.backgroundChildren[i];
                    if (element.x != bgXY[i].x || element.y != bgXY[i].y) isAnimating = true;
                }
                expect(isAnimating, 'change the x or y position of a background object in the update function to animate your background').to.be.true;
            });
        });
        
        describe('level01.js', function() {
            const game = window.game;
            
            window.gameItems = [];
            window.opspark.runLevelInGame(game);
            
            var hasObstacle = false;
            var hasCustomObstacle = false;
            var hasEnemy = false;
            var hasEnemyProps = true;
            var hasCustomEnemy = false;
            var hasReward = false;
            var hasRewardProps = true;
            
            /* Iterate through all gameItems added to the game*/
            for (var i = 0; i < window.gameItems.length; i++) {
                var gameItem = window.gameItems[i];
                
                expect(gameItem.x === undefined, 'you must create all gameItems with an x value').to.be.false;
                expect(gameItem.y === undefined, 'you must create all gameItems with a y value').to.be.false;
                expect(gameItem.image === undefined, 'you must create all gameItems with an image').to.be.false;
                
                if (gameItem.type === 'obstacle') { 
                    hasObstacle = true;
                    expect(gameItem.damage === undefined, 'you must create obstacles with a damageFromObstacle value').to.be.false;
                    expect(gameItem.radius === undefined, 'you must create obstacles with a hitZoneSize value').to.be.false;               
                   
                    if (gameItem.image.loc != 'img/sawblade.png') {
                        hasCustomObstacle = true;
                    }
                } else if (gameItem.type === 'enemy') { // check to see that they created at least one gameItem with type enemy
                    hasEnemy = true;
                    
                    if (!(gameItem.image.type === 'rect' && gameItem.image.width === 50 && gameItem.image.height === 50 && gameItem.image.color === 'red')) { // check to see that they did not use the provided red square for the enemy image
                        hasCustomEnemy = true;
                    }
                    if (!gameItem.hasOwnProperty('onPlayerCollision') || !gameItem.hasOwnProperty('onProjectileCollision') || !gameItem.hasOwnProperty('velocityX')) {
                        hasEnemyProps = false;
                    }
                } else if (gameItem.type === 'reward') {// check to see that they created at least one gameItem with type reward
                    hasReward = true;
                
                    if (!gameItem.hasOwnProperty('onPlayerCollision')) {
                        hasRewardProps = false;
                    }
                }
            }
            it('should create at least 1 obstacle with a radius and damage using the createObstacle method', function() {
                expect(hasObstacle, 'you must create at least 1 obstacle!').to.be.true;
            });
            
            it('should create at least 1 unique obstacle', function() {
                expect(hasCustomObstacle, 'you must create at least 1 custom obstacle!').to.be.true;
            });
            
            it('should create at least gameItem of type \'enemy\'', function() {
                expect(hasEnemy, 'you must create at least 1 enemy').to.be.true;
            });
            
            it('should create a unique \'enemy\'', function() {
                expect(hasCustomEnemy, 'you must create at least 1 unique enemy').to.be.true;
            });
            
            it('enemies should have a onPlayerCollision and onProjectileCollision method', function() {
                expect(hasEnemy && hasEnemyProps, 'enemies must have velocityX and methods onPlayerCollision / onProjectileCollision defined!').to.be.true;
            });
            
            it('should create a gameItem of type \'reward\'', function() {
                expect(hasReward, 'you must create at least 1 reward!').to.be.true;
            });
            
            it('reward should the onPlayerCollision method defined', function() {
                expect(hasReward && hasRewardProps, 'set onPlayerCollision method for your reward obstacle').to.be.true;
            });
            
            it('use levelData to create obstacles, enemies, and rewards', function() {
               expect(window.levelData.gameItems.length > 3, 'fill the levelData.gameItems array with your data for each game item!').to.be.true; 
            });
        });
    });
});