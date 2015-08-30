var helper = {
    addActionToControlButton: function(aButton, aCallback) {
        var l = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                var target = event.getCurrentTarget();

                if (helper.isTouchOnTarget(touch, target) && target.isEnabled()) {
                    target.setHighlighted(true);
                    return true;
                }
                return false;
            },
            onTouchMoved: function(touch, event) {
                var target = event.getCurrentTarget();

                if (helper.isTouchOnTarget(touch, target)) {
                    if (target.isHighlighted() === false) {
                        target.setHighlighted(true);
                    }
                } else {
                    if (target.isHighlighted() === true) {
                        target.setHighlighted(false);
                    }
                }
            },
            onTouchEnded: function(touch, event) {
                var target = event.getCurrentTarget();
                cc.log("sprite onTouchesEnded.. ");
                if (helper.isTouchOnTarget(touch, target)) {
                    target.setHighlighted(false);
                    if (aCallback) {
                        aCallback(target);
                    }
                }
            }
        });

        cc.eventManager.addListener(l, aButton);
    },

    addControlButtonToLayer: function(aLayer, aString, aY, aDisabled) {
        var size = cc.winSize;

        var b = helper.createControlButton(aString, aDisabled);
        b.setPosition(cc.p(size.width*0.5, aY));
        aLayer.addChild(b);

        return b;
    },

    addUITextToLayer: function(aLayer, aString, aFontSize, aY) {
        var t = helper.createUIText(aString, aFontSize);
        t.attr({
            x: cc.winSize.width*0.5,
            y: aY
        });

        aLayer.addChild(t);

        return t;
    },

    changeSceneTo: function(aScene) {
        var scene = new aScene();
        cc.director.runScene(new cc.TransitionFade(0.5, scene));
    },

    createControlButton: function(aString, aDisabled) {
        var size = cc.winSize;

        var b = new cc.ControlButton();
        b.setBackgroundSpriteForState(helper.createS9TileFromRes(res.up_l_png), cc.CONTROL_STATE_NORMAL);
        b.setBackgroundSpriteForState(helper.createS9TileFromRes(res.down_l_png), cc.CONTROL_STATE_HIGHLIGHTED);
        b.setBackgroundSpriteForState(helper.createS9TileFromRes(res.up_png), cc.CONTROL_STATE_DISABLED);
        b.setPreferredSize(cc.size(size.width*0.25, size.height*0.13));
        b.setAnchorPoint(cc.p(0.5, 0.5));
        b.setTitleForState(aString, cc.CONTROL_STATE_NORMAL);
        b.setTitleTTFForState('Impact', cc.CONTROL_STATE_NORMAL);
        b.setTitleTTFSizeForState(size.height*0.07, cc.CONTROL_STATE_NORMAL);
        b.setTitleColorForState(cc.color(170,170,170), cc.CONTROL_STATE_DISABLED);
        if (aDisabled) {
            b.setEnabled(false);
        }

        return b;
    },

    createS9TileFromRes: function(aRes) {
        return cc.Scale9Sprite.create(aRes, cc.rect(0, 0, 110, 110), cc.rect(25, 25, 65, 65));
    },

    createUIText: function(aString, aFontSize) {
        var t = new ccui.Text();
        t.attr({
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            string: aString,
            fontName: 'Impact',
            fontSize: aFontSize
        });
        t.enableOutline(cc.color(0, 0, 0), aFontSize*0.15);

        return t;
    },

    isTouchOnTarget: function(touch, target) {
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        return cc.rectContainsPoint(rect, locationInNode);
    },
};