var baseEntity = require("baseEntity");
cc.Class({
    extends: baseEntity,

    init:function(initPos, wid, hei, type){
        this._super();
        this.entityType = gameConst.ENTITY_TYPE.WALL;
        this.initPos = initPos;
        this.width = wid;
        this.height = hei;
        this.offsetType = type;
        this.itemCount = 0;
        this.radius = 0;

        this.wallParticle = cc.instantiate(cc.loader.getRes("prefabs/wall_particle"));
        battle.layerManager.enemyLayer.addChild(this.wallParticle);

        this.wallParticle.x = initPos.x;
        this.wallParticle.y = initPos.y;
        this.wallParticle.getComponent("wallParticle").host = this;

        this.wallCollider = this.wallParticle.getComponent(cc.BoxCollider);
        this.wallCollider.size = new cc.Size(this.width, this.height);
        if(this.offsetType == 1){
            this.wallCollider.offset = new cc.p(0, this.height * .5);
        }else if(this.offsetType == 2){
            this.wallCollider.offset = new cc.p(0, -this.height * .5);
        }
    },

    getFromPool:function(initPos, wid, hei, type){
        this.baseFrame = 0;
        this.isInPool = false;
        this.initPos = initPos;
        this.width = wid;
        this.height = hei;
        this.offsetType = type;
        this.wallParticle.x = this.initPos.x;
        this.wallParticle.y = this.initPos.y;
        if(this.wallCollider){
            this.wallCollider.size = new cc.Size(this.width, this.height);
            if(this.offsetType == 1){
                this.wallCollider.offset = new cc.p(0, this.height * .5);
            }else if(this.offsetType == 2){
                this.wallCollider.offset = new cc.p(0, -this.height * .5);
            }
        }
        battle.entityManager.addEntity(this);
    },

    putInPool:function(){
        this.baseFrame = 0;
        this.isInPool = true;
        battle.entityManager.removeEntity(this);
    },

    getEntityX:function(){
        return this.wallParticle.x;
    },

    getEntityY:function(){
        return this.wallParticle.y;
    },

    createBomb:function(){
        
    },

    step:function(){
        if(this.isInPool)   return;
        this._super();
        this.moveStep();
    },

    moveStep:function(){
        if(this.getEntityX() < 1500){
            battle.poolManager.putInPool(this);
        }
    },

    clear:function(){
        this.particleSystem = null;
        if(this.wallParticle){
            this.wallParticle.destroy();
            this.wallParticle = null;
        }
        this._super();
    }
})