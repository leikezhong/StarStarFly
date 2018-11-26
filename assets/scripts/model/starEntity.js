var baseEntity = require("baseEntity");
cc.Class({
    extends: baseEntity,

    init:function(initPos){
        this._super();

        this.starParticle = cc.instantiate(cc.loader.getRes("prefabs/star_particle"));
        this.starParticle.parent = battle.layerManager.playerLayer;

        this.starParticle.x = initPos.x;
        this.starParticle.y = initPos.y;

        this.particleSystem = this.starParticle.getComponent(cc.ParticleSystem);

        // this.startColor = new cc.Color(255,255,255,255);//白
        // this.startColorVar = new cc.Color(0,0,0,255);//黑
        // this.endColorVar = new cc.Color(0,0,0,255);//黑

        this.starParticle.getComponent("starParticle").host = this;
        this.particleSystem.stopSystem();

        console.log("create star entity");
    },

    getEntityX:function(){
        return this.starParticle.x;
    },

    getEntityY:function(){
        return this.starParticle.y;
    },

    setEntityX:function(xPos){
        this.starParticle.x = xPos;
    },

    setEntityY:function(yPos){
        this.starParticle.y = yPos;
    },

    addParameter:function(other){
        return;
    },

    step:function(){
        if(battle.battleManager.isGameOver)   return;
        this.moveStep();
    },

    moveStep:function(){
        this.starParticle.x += battle.battleManager.nowMoveXSpeed;
        this.starParticle.y += battle.battleManager.nowMoveYSpeed;
    },

    clear:function(){
        this.particleSystem = null;
        if(this.starParticle){
            this.starParticle.destroy();
            this.starParticle = null;
        }
        this._super();
    }
})