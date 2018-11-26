var baseEntity = require("baseEntity");
cc.Class({
    extends: baseEntity,

    init:function(initPos, lastColor){
        this._super();
        this.entityType = gameConst.ENTITY_TYPE.STAR_BOMB;
        this.sunBombParticle = cc.instantiate(cc.loader.getRes("prefabs/sun_bomb_particle"));
        this.sunBombParticle.parent = battle.layerManager.bgLayer;

        this.sunBombParticle.x = initPos.x;
        this.sunBombParticle.y = initPos.y;

        this.particleSystem = this.sunBombParticle.getComponent(cc.ParticleSystem);
        this.particleSystem.startColor = lastColor;
        this.particleSystem.endColor = lastColor;

        // console.log("create sun bomb entity");
    },

    getFromPool:function(initPos, lastColor){
        this.baseFrame = 0;
        this.isInPool = false;
        if(this.sunBombParticle && this.particleSystem){
            this.sunBombParticle.x = initPos.x;
            this.sunBombParticle.y = initPos.y;
            this.particleSystem.startColor = lastColor;
            this.particleSystem.endColor = lastColor;
            this.particleSystem.resetSystem();
        }
        battle.entityManager.addEntity(this);
    },

    putInPool:function(){
        this.baseFrame = 0;
        this.isInPool = true;
        if(this.particleSystem){
            this.particleSystem.stopSystem();
        }
        battle.entityManager.removeEntity(this);
    },

    getEntityX:function(){
        return this.sunBombParticle.x;
    },

    getEntityY:function(){
        return this.sunBombParticle.y;
    },

    step:function(){
        if(this.isInPool)   return;
        this._super();
        this.frameStep();
    },

    frameStep:function(){
        if(this.baseFrame > 300){
            battle.poolManager.putInPool(this);
        }
    },

    clear:function(){
        if(this.sunBombParticle){
            this.sunBombParticle.destroy();
            this.sunBombParticle = null;
        }
        this._super();
    }
})