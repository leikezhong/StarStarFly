cc.Class({
    extends: cc.Component,

    properties: {
        mainLayer:cc.Node,
        uiLayer:cc.Node,
        mainCamera:cc.Node,
        touchLayer:cc.Node
    },

    start:function(){
        cc.director.preloadScene("rankingScene", function () {
            cc.log("rankingScene preloaded");
        });
        // cc.director.setDisplayStats(true);
    },

    onLoad:function(){
        this.allManager = [
            "battleManager",
            "collisionManager",
            "enterFrameManager",
            "entityManager",
            "layerManager",
            "poolManager",
            "resourceManager",
            "visionManager"
        ];

        for(let i = 0; i < this.allManager.length; i++){
            let manager = require(this.allManager[i]);
            battle[this.allManager[i]] = new manager();
            battle[this.allManager[i]].init();
        }
        battle.resourceManager.loadBaseResource(this.loadComplete.bind(this));
    },

    loadComplete:function(){
        this.initParams();
        battle.layerManager.initAllLayer(this);
        battle.enterFrameManager.initEnterFrame();
        battle.collisionManager.initCollision();
        battle.battleManager.initBattle();
        battle.visionManager.initVision(this.mainCamera);
    },
    
    initParams:function(){
        this.touchLayer.on(cc.Node.EventType.TOUCH_START, this.onTouchFunc, this);
    },

    update:function(dt){
        battle.entityManager.step();
        battle.battleManager.step();
        battle.visionManager.step();
    },

    onTouchFunc:function(event){
        battle.battleManager.changeMoveStatus();
    },

    restartGameFunc:function(){
        // cc.director.loadScene("rankingScene");
    },

    onDestroy:function(){
        console.log("battle scene clear!!!");
        battle.battleManager.clear();
        battle.poolManager.clear();
        battle.enterFrameManager.clear();
        battle.entityManager.clear();
        battle.layerManager.clear();
        battle.resourceManager.clear();

        for(let i = 0; i < this.allManager.length; i++){
            let manager = require(this.allManager[i]);
            battle[this.allManager[i]] = null;
        }
    }
});
