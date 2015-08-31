var s1 = true, s2 = true;

var helper = {
    addMouseActionsTo: function(aNode, aMouseDownCallback, aMouseMoveCallback, aMouseUpCallback) {
        var l = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseDown: aMouseDownCallback,
            onMouseMove: aMouseMoveCallback,
            onMouseUp: aMouseUpCallback
        });

        cc.eventManager.addListener(l, aNode);
    },

    addButtonToLayer: function(aLayer, aString, aY, aDisabled) {
        var b = helper.createControlButton(aString, true, aY, aDisabled);
        aLayer.addChild(b);

        return b;
    },

    addMouseUpActionTo: function(aNode, aCallback) {
        var l = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseUp: function(event) {
                var target = event.getCurrentTarget();
                if (target.enabled && helper.isMouseEventOnItsTarget(event)) {
                    aCallback(event, target);
                }
            }
        });
        cc.eventManager.addListener(l, aNode);
    },

    addSoundAndMusicButtons: function(aLayer) {
        var size = cc.winSize;
        var soundButton = helper.addButtonToLayer(aLayer, null, size.height*0.05);
        helper.setSoundVolume(soundButton, true);
        soundButton.setContentSize(cc.size(120, 120));
        soundButton.setPreferredSize(cc.size(120, 120));
        soundButton.setPosition(cc.p(size.width*0.94, size.height*0.9));
        helper.addMouseUpActionTo(soundButton, function(event) { var target = event.getCurrentTarget(); helper.setSoundVolume(target); });

        var musicButton = helper.addButtonToLayer(aLayer, null, size.height*0.05);
        helper.setMusicVolume(musicButton, true);
        musicButton.setContentSize(cc.size(120, 120));
        musicButton.setPreferredSize(cc.size(120, 120));
        musicButton.setPosition(cc.p(size.width*0.94, size.height*0.73));
        helper.addMouseUpActionTo(musicButton, function(event) { var target = event.getCurrentTarget(); helper.setMusicVolume(target); });
    },

    setSoundVolume: function(aTarget, aDoNotSwitch) {
        if (!aDoNotSwitch) {
            s1 = !s1;
        }
        cc.audioEngine.setEffectsVolume(s1 ? 0.5 : 0);
        aTarget.setBackgroundSpriteForState(cc.Scale9Sprite.create(res['sound_' + (s1 ? '' : 'disabled_') + 'png'], cc.rect(0, 0, 120, 120), cc.rect(0, 0, 120, 120)), cc.CONTROL_STATE_NORMAL);
        aTarget.setBackgroundSpriteForState(cc.Scale9Sprite.create(res['sound_' + (s1 ? 'disabled_' : '') + 'png'], cc.rect(0, 0, 120, 120), cc.rect(0, 0, 120, 120)), cc.CONTROL_STATE_HIGHLIGHTED);
    },
    setMusicVolume: function(aTarget, aDoNotSwitch) {
        if (!aDoNotSwitch) {
            s2 = !s2;
        }
        cc.audioEngine.setMusicVolume(s2 ? 0.25 : 0);
        aTarget.setBackgroundSpriteForState(cc.Scale9Sprite.create(res['music_' + (s2 ? '' : 'disabled_') + 'png'], cc.rect(0, 0, 120, 120), cc.rect(0, 0, 120, 120)), cc.CONTROL_STATE_NORMAL);
        aTarget.setBackgroundSpriteForState(cc.Scale9Sprite.create(res['music_' + (s2 ? 'disabled_' : '') + 'png'], cc.rect(0, 0, 120, 120), cc.rect(0, 0, 120, 120)), cc.CONTROL_STATE_HIGHLIGHTED);
    },

    addTileToLayer: function(aLayer) {
        var size = cc.winSize;
        var b = new cc.Sprite();
        b.initWithFile(res.closed_png, helper['rect_' + sprite_size]);
        b.setAnchorPoint(cc.p(0.5, 0.5));
        aLayer.addChild(b);

        return b;
    },

    addUITextToLayer: function(aLayer, aString, aFontSize, aY) {
        var t = helper.createUIText(aString, aFontSize);
        t.setPosition(cc.p(cc.winSize.width*0.5, aY));

        aLayer.addChild(t);

        return t;
    },

    changeSceneTo: function(aScene) {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();
        var scene = new aScene();
        cc.director.runScene(new cc.TransitionFade(0.5, scene));
    },

    createControlButton: function(aString, aIsButton, aY, aDisabled) {
        var size = cc.winSize;

        var textures = {
            normal:      aIsButton ? res.button_normal_png      : res.closed_png,
            highlighted: aIsButton ? res.button_highlighted_png : res.closed_highlighted_png,
            disabled:    aIsButton ? res.button_disabled_png    : res.closed_png
        };

        var b = new cc.ControlButton();
        b.setBackgroundSpriteForState(helper.createS9TileFromRes(textures.normal, aIsButton), cc.CONTROL_STATE_NORMAL);
        b.setBackgroundSpriteForState(helper.createS9TileFromRes(textures.highlighted, aIsButton), cc.CONTROL_STATE_HIGHLIGHTED);
        b.setBackgroundSpriteForState(helper.createS9TileFromRes(textures.disabled, aIsButton), cc.CONTROL_STATE_DISABLED);
        b.setPreferredSize(cc.size(size.width*0.25, size.height*0.13));
        b.setAnchorPoint(cc.p(0.5, 0.5));
        b.setPosition(cc.p(size.width*0.5, aY));
        if (aString) {
            b.setTitleForState(aString, cc.CONTROL_STATE_NORMAL);
            b.setTitleTTFForState('Impact', cc.CONTROL_STATE_NORMAL);
            b.setTitleTTFSizeForState(size.height*0.07, cc.CONTROL_STATE_NORMAL);
            b.setTitleColorForState(cc.color(170,170,170), cc.CONTROL_STATE_DISABLED);
        }
        if (aDisabled) {
            b.setEnabled(false);
        }

        return b;
    },

    createS9TileFromRes: function(aRes, aIsButton) {
        if (aIsButton) {
            return cc.Scale9Sprite.create(aRes, cc.rect(0, 0, 110, 110), cc.rect(25, 25, 65, 65));
        } else {
            return cc.Scale9Sprite.create(aRes, helper.rect1, helper.rect2);
        }
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

    isMouseEventOnItsTarget: function(event) {
        var target = event.getCurrentTarget(),
            locationInNode = target.convertToNodeSpace(event.getLocation()),
            s = target.getContentSize(),
            rect = cc.rect(0, 0, s.width, s.height);

        return cc.rectContainsPoint(rect, locationInNode);
    },

    ReplaceWithTryCatch: function(method) {
        return function() {
            try {
                return method.apply(null, arguments);
            } catch (e) {
                cc.error(e);
            }
        };
    },

    ProcessTryCatcher: function(object) {
        var method_name, method;
        for (method_name in object) {
            method = object[method_name];
            if (typeof method === "function") {
                object[method_name] = helper.ReplaceWithTryCatch(method);
            }
        }
    },
    rect_small: cc.rect(0, 0, 45, 45),
    rect_medium: cc.rect(0, 0, 80, 80),
    rect_big: cc.rect(0, 0, 110, 110),
};

helper.ProcessTryCatcher(helper);
