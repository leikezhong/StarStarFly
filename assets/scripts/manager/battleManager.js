var starEntity = require("starEntity");
var wallEntity = require("wallEntity");
var sunBombEntity = require("sunBombEntity");
cc.Class({
    init:function () {
        // console.log("---init battleManager---");
    },

    initBattle:function(){
        this.initParams();
        this.initEntity();
    },

    initParams:function(){
        this.frameSize = cc.view.getFrameSize();
        this.winSize = cc.director.getWinSize();
        console.log("winSize: ", this.winSize);
        console.log("frameSize: ", this.frameSize);

        this.createSunCount = 0;
        this.createSunInterval = 90;

        this.nowAllScore = 0;//score
        this.nowDistance = 0;
        this.allWalls = [];
        this.yPoint = 0;
        this.yPointInterval = 10;
        this.yPointCount = 0;
        this.yPointTotal = 20;
        this.intervalHeight = 350;
        this.changeYPointRandom = 0.2;
        this.minHeightInterval = 180;

        this.moveXSpeed = 5;
        this.moveYSpeed = 3;
        this.nowMoveXSpeed = 0;
        this.nowMoveYSpeed = 0;

        this.scoreNow = battle.layerManager.uiLayer.getChildByName("scoreNow").getComponent(cc.Label);
        if(this.scoreNow){
            this.scoreNow.string = "Score:" + this.nowAllScore;
        }
    },

    initEntity:function(){
        this.mainStar = new starEntity();
        this.mainStar.init(cc.p(-200, 0));
        battle.visionManager.setVisionEntity(this.mainStar);

        for(var i = 0; i < 60; i++){
            var wall = new wallEntity();
            wall.init(cc.p(-1500, 0), 100, 800, 1);
            this.allWalls.push(wall);
            battle.poolManager.putInPool(wall);
        }
    },

    changeMoveStatus:function(){
        this.moveYSpeed = -this.moveYSpeed;
        this.nowMoveXSpeed = this.moveXSpeed;
        this.nowMoveYSpeed = this.moveYSpeed;
    },

    getRandom:function(){
        return Math.random();
    },

    gameOver:function(){
        if(!this.isGameOver){
            this.isGameOver = true;
            battle.wxManager.nowScore = this.nowAllScore;
            battle.layerManager.uiLayer.getChildByName("restartGameBtn").active = true;
            battle.layerManager.uiLayer.getChildByName("scoreTitle").active = true;
            battle.layerManager.uiLayer.getChildByName("scoreLabel").active = true;
            battle.layerManager.uiLayer.getChildByName("scoreLabel").getComponent(cc.Label).string = this.nowAllScore;
        }
    },

    step:function(){
        if(this.isGameOver) return;
        this.createWallStep();
        this.starMoveStep();
    },

    starMoveStep:function(){
        if(this.mainStar){
            this.nowMoveXSpeed = this.moveXSpeed + this.mainStar.getEntityX() / 1000;
            if(this.nowMoveXSpeed > 20){
                this.nowMoveXSpeed = 20;
            }
        }
    },

    createWallStep:function(){
        if(this.mainStar){
            if(this.nowDistance < this.mainStar.getEntityX() + 1500){
                this.yPointCount++;
                if(this.yPointCount >= this.yPointTotal){
                    this.yPointInterval = -this.yPointInterval;
                    this.yPointCount = 0;
                }
                if(this.getRandom() < this.changeYPointRandom){
                    this.yPointInterval = -this.yPointInterval;
                    this.yPointCount = 0;
                }

                this.yPoint += this.yPointInterval;
                if(this.yPoint < -this.winSize.height * .5 + this.minHeightInterval){
                    this.yPoint = -this.winSize.height * .5 + this.minHeightInterval;
                }else if(this.yPoint > this.winSize.height * .5 - this.minHeightInterval){
                    this.yPoint = this.winSize.height * .5 - this.minHeightInterval;
                }

                if(this.intervalHeight < 250){
                    this.intervalHeight += (-30 + this.getRandom() * 100);
                }else if(this.intervalHeight > 450){
                    this.intervalHeight += (-70 + this.getRandom() * 100);
                }else{
                    this.intervalHeight += (-50 + this.getRandom() * 100);
                }
                
                if(this.intervalHeight < this.minHeightInterval){
                    this.intervalHeight = this.minHeightInterval;
                }else if(this.intervalHeight > 500){
                    this.intervalHeight = 500;
                }

                let minYPos = -this.intervalHeight *.5 + this.yPoint;
                if(minYPos < -this.winSize.height * .5 + 20){
                    minYPos = -this.winSize.height * .5 + 20;
                }
                let maxYPos = this.intervalHeight * .5 + this.yPoint;
                if(maxYPos > this.winSize.height * .5 - 20){
                    maxYPos = this.winSize.height * .5 - 20
                }

                for(let i = 1; i < 3; i++){
                    var wall = battle.poolManager.getFromPool(gameConst.ENTITY_TYPE.WALL);
                    if(!wall){
                        wall = new wallEntity();
                        wall.init(cc.p(this.nowDistance, i==1?maxYPos:minYPos), 100, 800, i);
                    }else{
                        wall.getFromPool(cc.p(this.nowDistance, i==1?maxYPos:minYPos), 100, 800, i);
                    }
                }
                this.nowDistance += 100;
            }
        }
    },

    clear:function(){
        this.createSunCount = 0;
        this.createSunInterval = 90;
        this.nowAllScore = 0;
        this.nowEnergy = 100;
    }
})