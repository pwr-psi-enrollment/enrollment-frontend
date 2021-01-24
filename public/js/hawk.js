var Hawk = {};
Hawk = {
    w: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    h: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    hash: window.location.hash,
    anchorSufix: '-anchor',
}
Hawk.Constants = {
    COMPONENT_ID_ATTRIBUTE: "data-component-id"
};
Hawk.RequestStatus = {
    SUCCESS: 0,
    ERROR: 1,
    EXCEPTION: 2
};
Hawk.anchorRegex = new RegExp("^[^\/]+$");
Hawk.getPreparedHash = function(withoutLeadingHashSign) {
    if (typeof withoutLeadingHashSign == 'undefined' || !withoutLeadingHashSign) {
        return this.hash.replaceAll('/', '');
    } else {
        return this.hash.substring(1).replaceAll('/', '');
    }
}
Hawk.Validator = {};
Hawk.Validator.isEmail = function(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true;
    } else {
        return false;
    }
}
Hawk.Validator.isPhoneNumber = function(number) {
    if (/^\+?[0-9\s]+$/.test(number)) {
        return true;
    } else {
        return false;
    }
}
Hawk.Validator.isNotEmpty = function(value) {
    if (value.length > 0) {
        return true;
    } else {
        return false;
    }
}
Hawk.Validator.longerThan = function(str, length) {
    if (str.length > length) {
        return true;
    } else {
        return false;
    }
}
Hawk.Validator.isSomethingChecked = function(field) {
    if (field.is(':checked')) {
        return true;
    } else {
        return false;
    }
}
Hawk.isInObject = function(value, obj) {
    for (var k in obj) {
        if (!obj.hasOwnProperty(k)) {
            continue;
        }
        if (obj[k] === value) {
            return true;
        }
    }
    return false;
}
Hawk.createBundleFromString = function(str) {
    var parts = str.split('&');
    var result = {};
    var current;
    var data;
    var key;
    var value;
    for (var i in parts) {
        current = parts[i];
        data = current.split('=');
        key = data[0];
        value = data[1];
        result[key] = value;
    }
    return result;
}
Hawk.mergeObjects = function(mainObject, object) {
    var result = {};
    if (object === undefined) {
        return mainObject;
    }
    for (var property in mainObject) {
        if (mainObject.hasOwnProperty(property)) {
            result[property] = (object.hasOwnProperty(property)) ? object[property] : mainObject[property];
        }
        //console.log("object." + property + ": " + result[property]);
    }
    return result;
}
Hawk.mergeWholeObjects = function(mainObject, object) {
    var result = {};
    if (object === undefined) {
        return mainObject;
    }
    for (var property in mainObject) {
        if (mainObject.hasOwnProperty(property)) {
            result[property] = mainObject[property];
        }
        //console.log("object." + property + ": " + result[property]);
    }
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            result[property] = object[property];
        }
        //console.log("object." + property + ": " + result[property]);
    }
    return result;
}
Hawk.addZeros = function(number, digits) {
    number = number + "";
    for (var i = 1; i <= digits; i++) {
        if (number.length < digits) {
            number = "0" + number;
        }
    }
    return number;
}
Hawk.TextManager = {};
Hawk.TextManager.makeLine = function(text) {
    return "<span class=\"line\">" + text + "</span>";
}
Hawk.TextManager.findWordEnd = function(text, index, backwards) {
    if (typeof backwards == 'undefined') {
        backwards = false;
    }
    if (backwards) {
        var spaceIndex = text.lastIndexOf(" ", index);
    } else {
        var spaceIndex = text.indexOf(" ", index);
    }
    if (spaceIndex < 0) {
        return text.length;
    } else {
        return spaceIndex;
    }
}
Hawk.TextManager.findLine = function(text, start, end) {
    return text.substring(start, end);
}
Hawk.TextManager.makeLines = function(text, lines, backwards) {
    if (typeof offset == 'undefined') {
        offset = false;
    }
    text = text.trim();
    var lineLength = text.length / lines;
    var result = "";
    var breakPosition = 0;
    var start = 0;
    var line = "";
    var i = 1;
    if (text.length > 0) {
        while (i < lines + 1) {
            breakPosition = Hawk.TextManager.findWordEnd(text, lineLength * i, (i == 1 && backwards));
            line = Hawk.TextManager.findLine(text, start, breakPosition);
            //console.log(text);
            //console.log(i, line);
            if (line.length > 0) {
                result += Hawk.TextManager.makeLine(line);
                start = breakPosition + 1;
                i++;
            } else {
                return Hawk.TextManager.makeLines(text, lines, true)
            }
        }
    }
    return result;
}
Hawk.scrollToElement = function(options) {
    var defaultOptions = {
        container: window,
        anchor: '#top' + Hawk.anchorSufix,
        callback: function() {},
        delay: 0,
        duration: 800,
        offset: 0
    };
    options = Hawk.mergeObjects(defaultOptions, options);
    setTimeout(function() {
        $(options.container).scrollTo(options.anchor, options.duration, {
            'axis': 'y',
            'offset': options.offset,
            onAfter: function() {
                options.callback();
            }
        });
    }, options.delay);
    return this;
}
Hawk.AnchorsManager = function(options) {
    var that = this;
    this.defaultOptions = {
        delay: 100,
        menu: undefined
    }
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.anchorsCallback = function(e) {
        var regex = /#{1}.+$/;
        var link = this;
        var href = $(this).attr('href');
        var anchor;
        var extraDelay = 0;
        if (anchor = regex.exec(href)) {
            if ($(anchor + Hawk.anchorSufix).length) {
                e.preventDefault();
                if (typeof that.options.menu !== 'undefined' && $(link).parents().is(that.options.menu.menu)) {
                    extraDelay = that.options.menu.totalDuration();
                    that.options.menu.hide();
                }
                var finalDelay = that.options.delay + extraDelay;
                var callback = function() {}
                if (typeof $(link).attr('data-anchor-type') == 'undefined' || $(link).attr('data-anchor-type') != 'blank') {
                    callback = function() {
                        window.location.hash = anchor;
                    }
                }
                Hawk.scrollToElement({
                    anchor: anchor + Hawk.anchorSufix,
                    callback: callback,
                    delay: finalDelay
                });
            }
        }
    };
    this.goTo = function(anchor) {
        Hawk.scrollToElement({
            anchor: anchor + Hawk.anchorSufix
        });
    }
    this.refresh = function() {
        $('a').unbind('click', this.anchorsCallback).click(this.anchorsCallback);
        return this;
    }
    this.run = function() {
        this.refresh();
    }
}
Hawk.DropdownConstants = {
    modes: {
        PLAIN: 0,
        CHOOSABLE: 1
    },
    types: {
        OVERLAYER: 0,
        EXPANDING: 1
    }
}
Hawk.Dropdown = function(container, options) {
    var that = this;
    this.container = $(container).first();
    this.header;
    this.title;
    this.list;
    this.listContainer;
    this.anotherBackElement;
    this.fields;
    this.states = {
        CLOSED: 0,
        OPEN: 1
    }
    this.defaultOptions = {
        slideSpeed: 200,
        mode: Hawk.DropdownConstants.modes.PLAIN,
        type: Hawk.DropdownConstants.types.OVERLAYER,
        containerClass: 'dropdown',
        expandingTypeClass: 'dropdown--expanding',
        choosableModeClass: 'dropdown--choosable',
        filledClass: 'dropdown--filled',
        openClass: 'dropdown--open',
        headerClass: 'dropdown__header',
        titleClass: 'dropdown__title',
        listClass: 'dropdown__list',
        listContainerClass: 'dropdown__list-container',
        onShow: function(dropdown) {},
        onShowBegin: function(dropdown) {},
        onHide: function(dropdown) {},
        onHideBegin: function(dropdown) {},
        onRadioSelected: function(dropdown, radio) {
            var description = radio.parent().find('.dropdown-item__description').html();
            dropdown.title.html(description);
            dropdown.hide();
            dropdown.container.addClass(dropdown.options.filledClass);
        },
        onClick: function(dropdown, item) {}
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.state = this.states.CLOSED;
    this.mode = this.options.mode;
    this.type = this.options.type;
    this.setOpen = function() {
        this.state = this.states.OPEN;
        return this;
    }
    this.setClosed = function() {
        this.state = this.states.CLOSED;
        return this;
    }
    this.isOpen = function() {
        return this.state == this.states.OPEN;
    }
    this.show = function() {
        var that = this;
        this.container.addClass(that.options.openClass);
        if (typeof that.options.onShowBegin === 'function') {
            that.options.onShowBegin(that);
        }
        this.listContainer.velocity("slideDown", {
            duration: that.options.slideSpeed,
            complete: function() {
                if (typeof that.options.onShow === 'function') {
                    that.options.onShow(that);
                }
            }
        });
        this.setOpen();
        return this;
    }
    this.hideImmediately = function() {
        var that = this;
        this.container.removeClass(that.options.openClass);
        if (typeof that.options.onHideBegin === 'function') {
            that.options.onHideBegin(that);
        }
        this.listContainer.hide();
        if (typeof that.options.onHide === 'function') {
            that.options.onHide(that);
        }
        this.setClosed();
        return this;
    }
    this.hide = function() {
        var that = this;
        this.container.removeClass(that.options.openClass);
        if (typeof that.options.onHideBegin === 'function') {
            that.options.onHideBegin(that);
        }
        this.listContainer.velocity("slideUp", {
            duration: that.options.slideSpeed,
            complete: function() {
                if (typeof that.options.onHide === 'function') {
                    that.options.onHide(that);
                }
            }
        });
        this.setClosed();
        return this;
    }
    this.getChecked = function() {
        return this.fields.filter(':checked');
    }
    this.setBackElement = function(element) {
        this.anotherBackElement = element;
        this.anotherBackElement.click(function() {
            if (that.isOpen()) {
                that.hide();
            }
        });
        return this;
    }
    this.select = function(field) {
        if (!field.prop('checked')) {
            field.prop('checked', true);
        }
        var description = field.parent().find('.dropdown-item__description').html();
        that.title.html(description);
        that.hide();
        if (typeof that.options.onRadioSelected == 'function') {
            that.options.onRadioSelected(that, field);
        }
        return this;
    }
    this.selectByIndex = function(index) {
        var selectedInput = that.fields.eq(index);
        this.select(selectedInput);
        return this;
    }
    this.selectByID = function(id) {
        var selectedInput = that.fields.filter('[value="' + id + '"]');
        this.select(selectedInput);
        return this;
    }
    this.run = function() {
        var that = this;
        this.header = this.container.find('.' + this.options.headerClass);
        this.title = this.container.find('.' + this.options.titleClass);
        this.list = this.container.find('.' + this.options.listClass);
        this.listContainer = this.container.find('.' + this.options.listContainerClass);
        this.fields = this.list.find('input[type="radio"]');
        if (this.options.type == Hawk.DropdownConstants.types.EXPANDING) {
            this.container.addClass(this.options.expandingTypeClass);
        }
        if (this.options.mode == Hawk.DropdownConstants.modes.CHOOSABLE) {
            this.container.addClass(this.options.choosableModeClass);
        }
        this.hideImmediately();
        this.container.click(function(e) {
            e.stopPropagation();
        });
        this.header.click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (that.isOpen()) {
                that.hide();
            } else {
                that.show();
            }
        });
        this.container.parent().click(function() {
            if (that.isOpen()) {
                that.hide();
            }
        });
        $('body').click(function() {
            if (that.isOpen()) {
                that.hide();
            }
        });
        if (this.fields.length > 0) {
            this.fields.change(function() {
                if (typeof that.options.onRadioSelected == 'function') {
                    that.options.onRadioSelected(that, $(this));
                }
            });
            var selected = this.fields.filter("[selected=\"selected\"]");
            if (selected.length > 0) {
                this.select(selected);
            }
        }
        return this;
    }
}
Hawk.AjaxOverlayerManager = function(id, options) {
    var that = this;
    this.container = $('#' + id);
    this.overlayerId = parseInt(this.container.attr('data-overlayer-id'));
    this.currentContentID;
    this.currentBundle;
    this.currentCallback;
    this.buttons = $('.ajax-overlayer-button[data-overlayer-id=' + this.overlayerId + ']');
    this.inner;
    this.contentWrapper;
    this.contentContainer;
    this.closeButton;
    this.loadingLayer;
    this.currentButton;
    this.baseZIndex = 9000;
    this.open = false;
    this.disabled = false;
    this.ajaxRequest;
    this.ajaxRequestWorking = false;
    this.defaultOptions = {
        fadeSpeed: 400,
        slideSpeed: 400,
        ajaxFilePath: "/ajax.php",
        loadActionName: "load-overlayer",
        innerClass: 'overlayer__inner',
        contentWrapperClass: 'overlayer__content-wrapper',
        contentContainerClass: 'overlayer__content',
        closeButtonClass: 'ajax-overlayer-close',
        loadingLayerClass: 'overlayer__loading-layer',
        onShow: function(overlayerManager) {},
        onHide: function(overlayerManager) {},
        onPrepareLoading: function(id, bundle) {
            return bundle;
        },
        onLoad: function(overlayerManager, id) {},
        onInitialize: function(overlayerManager, hash) {
            var pattern = /[0-9]+\/[0-9]+\/([a-zA-Z0-9\-]+)/
            if (pattern.test(hash)) {
                var parts = hash.split('/');
                var overlayerId = parseInt(parts[0]);
                var id = parseInt(parts[1]);
                if (overlayerId == overlayerManager.getId()) {
                    overlayerManager.loadContent(id);
                }
            }
        },
        createAnchor: function(overlayerManager, id, hash) {
            return overlayerManager.getId() + "/" + id + "/" + hash;
        },
        defaultRegex: new RegExp("o\/[0-9]\/([a-zA-Z0-9\-]+)+")
    }
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.defaultRegex = this.options.defaultRegex;
    this.popstateDefaultCallback = function() {
        that.hide();
    };
    this.getId = function() {
        return this.overlayerId;
    }
    this.getCurrentContentID = function() {
        return this.currentContentID;
    }
    this.setCurrentContentID = function(id) {
        this.currentContentID = id;
        return this;
    }
    this.getCurrentBundle = function() {
        return this.currentBundle;
    }
    this.setCurrentBundle = function(id) {
        this.currentBundle = id;
        return this;
    }
    this.getCurrentCallback = function() {
        return this.currentCallback;
    }
    this.setCurrentCallback = function(id) {
        this.currentCallback = id;
        return this;
    }
    this.disable = function() {
        this.disabled = true;
        return this;
    }
    this.enable = function() {
        this.disabled = false;
        return this;
    }
    this.isDisabled = function() {
        return this.disabled;
    }
    this.hide = function() {
        var that = this;
        if (this.ajaxRequestWorking) {
            if (typeof this.ajaxRequest != 'undefined') {
                this.ajaxRequest.abort();
            }
        }
        if (this.isDisabled()) {
            return false;
        }
        try {
            history.pushState("", document.title, window.location.pathname + window.location.search);
        } catch (e) {
            window.location.hash = "";
        }
        this.container.velocity("fadeOut", {
            duration: this.options.fadeSpeed,
            complete: function() {
                $('body').css({
                    'overflow': 'auto'
                });
                that.contentContainer.html('').hide();
                that.contentWrapper.css({
                    opacity: 0
                });
                if (typeof that.options.onHide == 'function') {
                    that.options.onHide(that);
                }
                that.currentButton = undefined;
                that.open = false;
                $(window).unbind('popstate', that.popstateDefaultCallback);
            }
        });
        return this;
    }
    this.isOpen = function() {
        return this.open;
    }
    this.changeContent = function(content, callback) {
        var that = this;
        this.contentWrapper.css({
            opacity: 0
        });
        this.contentContainer.html(content);
        this.contentContainer.show();
        that.contentWrapper.velocity({
            opacity: 1
        }, {
            duration: 400,
            complete: function() {
                if (typeof callback == 'function') {
                    callback();
                }
            }
        });
        /**this.contentContainer.velocity("slideDown", {
            duration: that.options.slideSpeed,
            complete: function() {
                that.contentWrapper.velocity({ opacity: 1 } , {
                    duration: 200
                });
            }
        });**/
        return this;
    }
    this.reload = function() {
        console.log("Overlayer reload");
        this.loadContent(this.getCurrentContentID(), this.getCurrentBundle(), this.getCurrentCallback());
        return this;
    }
    this.loadContent = function(id, bundle, callback) {
        var that = this;
        var lang = $('html').attr('lang');
        this.setCurrentContentID(id);
        this.setCurrentBundle(bundle);
        this.setCurrentCallback(callback);
        that.show();
        that.loadingLayer.show();
        this.ajaxRequestWorking = true;
        if (typeof bundle == 'undefined') {
            bundle = {};
        }
        bundle = this.options.onPrepareLoading(id, bundle);
        this.ajaxRequest = $.ajax({
            type: "POST",
            url: that.options.ajaxFilePath,
            dataType: "json",
            data: {
                'action': that.options.loadActionName,
                'id': id,
                'lang': lang,
                'bundle': bundle
            },
            success: function(result) {
                console.log(result);
                if (!result.success) {
                    if (typeof result.message != 'undefined') {
                        noticeManager.error("Error", result.message);
                        that.hide();
                    }
                    return;
                }
                var finalCallback;
                if (typeof callback == 'function') {
                    finalCallback = function() {
                        callback(result);
                    };
                } else {
                    finalCallback = function() {};
                }
                that.changeContent(result.html, finalCallback);
                that.changeHash(id, result.anchor);
                if (typeof that.options.onLoad == 'function') {
                    that.options.onLoad(that, id, result);
                }
                $(window).on('popstate', that.popstateDefaultCallback);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // here should appear error layer
                //alert(errorThrown);
                console.log(jqXHR.responseText);
            },
            complete: function() {
                that.loadingLayer.hide();
                that.ajaxRequestWorking = false;
            }
        });
        return this;
    }
    this.parseIntoBundle = function(str) {
        var items = str.split(';');
        var data;
        var result = {};
        for (var i in items) {
            data = items[i].split('=');
            result[data[0]] = data[1];
        }
        return result;
    }
    this.onButtonClick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!that.open) {
            that.currentButton = $(this);
            var id = $(this).attr('data-id');
            var bundle = {};
            if (typeof $(this).attr('data-bundle') != 'undefined') {
                bundle = Hawk.createBundleFromString($(this).attr('data-bundle'));
            }
            that.loadContent(id, bundle);
        }
    }
    this.getButtonsSelector = function() {
        return '.ajax-overlayer-button[data-overlayer-id="' + this.overlayerId + '"]';
    }
    this.refreshDependencies = function() {
        $('body').off('click', this.getButtonsSelector());
        $(this.getButtonsSelector()).unbind('click');
        $(this.getButtonsSelector()).click(this.onButtonClick);
        $('body').on('click', this.getButtonsSelector(), this.onButtonClick);
        return this;
    }
    this.run = function() {
        var that = this;
        this.inner = this.container.find('.' + this.options.innerClass);
        this.contentWrapper = this.container.find('.' + this.options.contentWrapperClass);
        this.contentContainer = this.container.find('.' + this.options.contentContainerClass);
        this.closeButton = $(this.container.find('.' + this.options.closeButtonClass));
        this.loadingLayer = $(this.container.find('.' + this.options.loadingLayerClass));
        $('body').on('click', this.getButtonsSelector(), that.onButtonClick);
        this.container.click(function() {
            that.hide();
        });
        this.container.on('click', '.' + this.options.closeButtonClass, function(e) {
            e.preventDefault();
            that.hide();
        });
        this.initializeClosePreventer();
        var hash = window.location.hash;
        if (typeof this.options.onInitialize == 'function') {
            this.options.onInitialize(this, hash);
        }
        return true;
    };
}
Hawk.AjaxOverlayerManager.prototype.initializeClosePreventer = function() {
    var that = this;
    this.container.on('click', '.' + that.options.innerClass + ', .' + that.options.innerClass + ' :not(.' + that.options.closeButtonClass + ', .' + that.options.closeButtonClass + ' *, .tox, .tox *)', function(e) {
        e.stopPropagation();
        return;
    });
    return this;
}
Hawk.AjaxOverlayerManager.prototype.show = function() {
    var that = this;
    this.open = true;
    this.container.velocity("fadeIn", {
        duration: this.options.fadeSpeed,
        complete: function() {
            $('body').css({
                'overflow': 'hidden'
            });
            if (typeof that.options.onShow == 'function') {
                that.options.onShow(that);
            }
        }
    });
    return this;
}
Hawk.AjaxOverlayerManager.prototype.changeHash = function(id, anchor) {
    var that = this;
    if (typeof anchor != 'undefined' && anchor != null && anchor.length > 0) {
        window.location.hash = that.options.createAnchor(that, id, anchor);
    }
    return this;
}
Hawk.PopUp = function(container, options) {
    Hawk.AjaxOverlayerManager.call(this, container, options);
}
Hawk.PopUp.prototype.show = function() {
    var that = this;
    this.open = true;
    this.container.velocity("fadeIn", {
        duration: this.options.fadeSpeed,
        complete: function() {
            if (typeof that.options.onShow == 'function') {
                that.options.onShow(that);
            }
        }
    });
    return this;
}
Hawk.PopUp.prototype.initializeClosePreventer = function() {
    return this;
}
Hawk.PopUp.prototype.changeHash = function(id, anchor) {
    return this;
}
Hawk.NoticeManager = function() {
    this.popup = new Hawk.PopUp('notice-popup', {
        ajaxFilePath: '/overlayer/ajax/notice'
    });
    this.popup.run();
    this.success = function(content) {
        this.popup.loadContent('success', {
            title: "Sukces",
            content: content
        });
    }
    this.error = function(content) {
        this.popup.loadContent('error', {
            title: "Błąd",
            content: content
        });
    }
    this.info = function(content) {
        this.popup.loadContent('info', {
            title: "Informacja",
            content: content
        });
    }
}
var noticeManager = new Hawk.NoticeManager();
Hawk.AjaxRequestManager = function(id, path, options) {
    var that = this;
    this.id = id;
    this.path = path;
    this.requestLinks;
    this.spinner;
    this.operations = {};
    this.ajaxRequest;
    this.ajaxRequestWorking = false;
    this.defaultOptions = {
        spinnerClass: 'ajax-request-manager-spinner',
        onError: function() {}
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.getID = function() {
        return this.id;
    }
    this.registerOperation = function(name, operation) {
        this.operations[name] = operation;
        return this;
    }
    this.sendSimpleRequest = function(operation, element) {
        var data = that.collectData(operation, element);
        return that.sendRequest(operation, {
            bundle: data
        });
    }
    this.sendRequest = function(operation, data) {
        if (this.ajaxRequestWorking) {
            //console.log("The request is already been doing!");
            return false;
        }
        this.ajaxRequestWorking = true;
        var that = this;
        data.operation = operation;
        this.spinner.show();
        console.log("DATA");
        console.log(data);
        this.ajaxRequest = $.ajax({
            type: "POST",
            url: this.path,
            dataType: "json",
            data: data,
            success: function(result) {
                console.log(result);
                if (typeof result.success != 'undefined') {
                    if (result.success) {
                        that.operations[result.operation].callback(result);
                    } else {
                        that.operations[result.operation].callback(result);
                    }
                } else {
                    noticeManager.error("Error", "There occured technical error. Try again later.");
                }
                /**if(!result.error) {

                    } else {
                        that.errorMessage.setContent(result.message);
                        that.errorMessage.show();
                    }**/
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                that.options.onError();
            },
            complete: function() {
                that.ajaxRequestWorking = false;
                that.spinner.hide();
            }
        });
        return this;
    }
    this.collectData = function(operation, element) {
        return that.operations[operation].collectData(element);
    }
    this.refreshDependencies = function() {
        var that = this;
    }
    this.run = function() {
        $('body').on('click', '.ajax-request-button[data-manager-id="' + this.getID() + '"]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var operation = $(this).attr('data-operation');
            that.spinner = $(this).parent().find('.ajax-request-spinner');
            var bundle = {};
            if (typeof $(this).attr('data-bundle') != 'undefined') {
                bundle = Hawk.createBundleFromString($(this).attr('data-bundle'));
            }
            that.sendRequest(operation, {
                bundle: bundle
            });
        });
    }
}
var ajaxRequestManager = new Hawk.AjaxRequestManager(1, "/ajax/request", {
    onError: function() {
        noticeManager.error("There occured some technical error.");
    }
});
ajaxRequestManager.run();
Hawk.MoreContentManager = function(id, options) {
    var that = this;
    this.id = id;
    this.lastItemId = 0;
    this.done = false;
    this.buttons;
    this.contentContainer;
    this.defaultOptions = {
        itemsPerLoading: 10,
        loadActionName: 'load-more-content',
        ajaxFilePath: '/ajax.php',
        buttonClass: 'more-content-button',
        contentContainerClass: 'more-content-container',
        slideSpeed: 400,
        fadeSpeed: 400,
        onLoad: function(button, contentContainer) {},
        onDone: function(button, contentContainer) {},
        appendContent: function(mcm, content) {
            content.hide();
            content.css({
                opacity: 0
            });
            mcm.contentContainer.append(content);
            content.velocity("slideDown", {
                duration: that.options.slideSpeed,
                complete: function() {
                    content.velocity({
                        opacity: 1
                    }, {
                        duration: that.options.fadeSpeed
                    });
                }
            });
        }
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.load = function(lastItemId) {
        var that = this;
        var lang = $('html').attr('lang') || "pl";
        $.ajax({
            type: "POST",
            url: that.options.ajaxFilePath,
            dataType: "json",
            data: {
                'action': that.options.loadActionName,
                'id': id,
                'lang': lang,
                'lastItemId': lastItemId
            },
            success: function(result) {
                if (result.error > 0) {
                    // here should appear error layer
                    return;
                }
                console.log(result);
                that.appendContent(result['html']);
                that.lastItemId = result['lastItemId'];
                that.setDone(result['isDone']);
                if (typeof that.options.onLoad == 'function') {
                    that.options.onLoad(that.buttons, that.contentContainer);
                }
                if (that.isDone() && typeof that.options.onDone == 'function') {
                    that.options.onDone(that.buttons, that.contentContainer);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // here should appear error layer
                //alert(errorThrown);
            },
            complete: function() {}
        });
    }
    this.appendContent = function(content) {
        content = $(content);
        content = content.filter(function() {
            return this.nodeType != 3; // Node.TEXT_NODE
        });
        this.options.appendContent(this, content);
    }
    this.isDone = function() {
        return this.done;
    }
    this.setDone = function(isDone) {
        this.done = isDone;
        return this;
    }
    this.run = function() {
        this.buttons = $('.' + this.options.buttonClass + '[data-id="' + this.id + '"]');
        this.contentContainer = $('.' + this.options.contentContainerClass + '[data-id="' + this.id + '"]');
        this.buttons.click(function(e) {
            console.log("clicked");
            e.preventDefault();
            if (!that.isDone()) {
                that.load(that.lastItemId);
            }
        });
    }
}
Hawk.AjaxMoreContentManager = function(id, options) {
    this.id = id;
    this.buttons = $('.more-content-button[data-id="' + this.id + '"]');
    this.contentContainer = $('.more-content-container[data-id="' + this.id + '"]');
    this.lastRowId = 0;
    this.isDone = false;
    this.defaultOptions = {
        slideSpeed: 400,
        fadeSpeed: 400,
        itemsPerLoading: 8,
        onDone: function(button) {
            button.velocity({
                opacity: 0
            }, {
                duration: 400,
                complete: function() {
                    button.css({
                        visibility: 'hidden'
                    });
                }
            });
        },
        onShow: function(contentsContainer, button) {}
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.defaultOnLoad = function(items) {
        items.css({
            display: 'none'
        });
        items.css({
            opacity: 0
        });
        this.contentContainer.append(items);
    }
    this.show = function() {
        var that = this;
        var currentButton = this.buttons.filter('[data-id="' + id + '"]');
        var currentContent = this.contents.filter('[data-id="' + id + '"]');
        currentContent.velocity("slideDown", {
            duration: that.options.slideSpeed,
            complete: function() {
                currentContent.velocity({
                    opacity: 1
                }, {
                    duration: that.options.fadeSpeed,
                    complete: function() {
                        currentContent.attr('data-state', that.states.VISIBLE);
                    }
                });
            }
        });
        if (typeof that.options.onShow == 'function') {
            that.options.onShow(currentButton);
        }
        return this;
    }
    this.run = function() {
        var that = this;
        this.buttons.show();
        this.contents.hide().css({
            opacity: 0
        });
        this.contents.attr('data-state', this.states.HIDDEN);
        if (typeof this.buttons == 'undefined' || typeof this.contents == 'undefined') {
            return false;
        }
        this.buttons.click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            var currentId = $(this).attr('data-id');
            if (that.isHidden(currentId)) {
                that.show(currentId);
            } else {
                that.hide(currentId);
            }
        });
        return true;
    }
}
Hawk.SlideMenu = function(id, options) {
    this.menu = $('#' + id);
    this.wrapper = this.menu.find('> div');
    this.mode;
    this.direction;
    this.state;
    this.toggler;
    this.close;
    this.directionClassName;
    this.modeClassName;
    this.openClassName;
    this.states = {
        closed: 'closed',
        open: 'open'
    };
    this.modes = {
        slideFade: 'slide-fade',
        slide: 'slide',
        fade: 'fade'
    };
    this.directions = {
        top: 'top',
        right: 'right',
        bottom: 'bottom',
        left: 'left'
    };
    this.defaultOptions = {
        slideDuration: 500,
        fadeDuration: 500,
        direction: 'top',
        mode: 'slide',
        toggler: $('.menu-toggler'),
        close: this.menu.find('.menu-close'),
        mainClass: 'slide-menu',
        showCallback: function(menu) {},
        hideCallback: function(menu, hideCall) {
            hideCall();
        }
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.show = function() {
        var that = this;
        var timeRemaining = this.totalDuration();
        setTimeout(function() {
            that.options.showCallback(that.menu);
        }, timeRemaining);
        if (this.options.mode == this.modes.fade) {
            this.menu.velocity("fadeIn", {
                duration: this.options.fadeDuration
            });
        }
        this.menu.addClass(this.openClassName);
        this.state = this.states.open;
        this.toggler.addClass('open');
        this.toggler.find('.icon-hamburger').addClass('open');
        return this;
    }
    this.hide = function() {
        var that = this;
        this.options.hideCallback(this.menu, function() {
            if (that.options.mode == that.modes.fade) {
                that.menu.velocity("fadeOut", {
                    duration: that.options.fadeDuration
                });
            }
            that.menu.removeClass(that.openClassName);
        });
        this.state = this.states.closed;
        this.options.toggler.removeClass('open');
        this.options.toggler.find('.icon-hamburger').removeClass('open');
        return this;
    }
    this.totalDuration = function() {
        if (this.options.mode == this.modes.slide) {
            return this.options.slideDuration;
        } else if (this.options.mode == this.modes.slideFade) {
            return this.options.slideDuration + this.options.fadeDuration;
        } else if (this.options.mode == this.modes.fade) {
            return this.options.fadeDuration;
        } else {
            return 0;
        }
    }
    this.run = function() {
        var that = this;
        this.toggler = this.options.toggler;
        this.close = this.options.close;
        this.modeClassName = this.options.mainClass + "--" + this.options.mode;
        this.directionClassName = this.options.mainClass + "--" + this.options.direction;
        this.openClassName = this.options.mainClass + "--open";
        this.menu.addClass(this.directionClassName);
        this.menu.addClass(this.modeClassName);
        this.hide();
        this.toggler.click(function() {
            if (that.state == that.states.open) {
                that.hide();
            } else {
                that.show();
            }
        });
        this.close.click(function() {
            that.hide();
        });
        return this;
    }
}
Hawk.initializeAnchors = function(options) {
    var that = this;
    var defaultOptions = {
        delay: 100,
        menu: undefined
    }
    options = Hawk.mergeObjects(defaultOptions, options);
    $('a').unbind('click').click(function(e) {
        var regex = /#{1}.+$/;
        var link = this;
        var href = $(this).attr('href');
        var anchor;
        var extraDelay = 0;
        if (anchor = regex.exec(href)) {
            if ($(anchor + that.anchorSufix).length) {
                e.preventDefault();
                if (options.menu !== undefined && $(link).parents(options.menu.menu).length) {
                    extraDelay = options.menu.totalDuration();
                    options.menu.hide();
                }
                var finalDelay = options.delay + extraDelay;
                that.scrollToElement({
                    anchor: anchor + that.anchorSufix,
                    callback: function() {
                        window.location.hash = anchor;
                    },
                    delay: finalDelay
                });
            }
        }
    });
    return this;
}
Hawk.BookmarksManager = function(container, options) {
    this.container = $(container);
    this.content;
    this.contentWrapper;
    this.bookmarks;
    this.current; // current bookmark container
    this.currentHeight = 0;
    this.loading = false;
    var that = this;
    this.defaultOptions = {
        responsive: true,
        activeScroll: false,
        activeScrollWidth: 480,
        slideDuration: 200,
        fadeDuration: 200,
        activeBookmarkClass: 'active',
        bookmarksClass: 'bookmarks-manager__bookmark-container',
        contentClass: 'bookmarks-manager__content',
        contentWrapperClass: 'bookmarks-manager__content-wrapper',
        bookmarkClass: 'bookmarks-manager__bookmark',
        bookmarkContentClass: 'bookmarks-manager__bookmark-content',
        bookmarkActiveCallback: function(bookmarkContainer) {},
        bookmarkUnactiveCallback: function(bookmarkContainer) {},
        changeContentCallback: function(content) {},
        changeBookmarkCallback: function(bookmarkContainer) {}
    }
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.isResponsive = function() {
        return this.options.responsive;
    }
    this.isSmallDevice = function() {
        return (this.isResponsive() && !this.content.is(':visible'));
    }
    this.changeContent = function(content, callback) {
        var container = this.content;
        var showing = function() {
            container.hide();
            container.html(content.show());
            container.velocity("slideDown", {
                duration: that.options.slideDuration,
                complete: function() {
                    container.velocity({
                        opacity: 1
                    }, {
                        duration: that.options.fadeDuration,
                        complete: function() {
                            var currentHeight = that.content.outerHeight();
                            that.currentHeight = currentHeight;
                            that.contentWrapper.css({
                                'min-height': that.currentHeight + "px"
                            });
                            that.options.changeContentCallback(that.content);
                            that.loading = false;
                        }
                    });
                }
            });
        }
        if (container.css('opacity') != 0) {
            container.velocity({
                opacity: 0
            }, {
                duration: that.options.fadeDuration,
                complete: function() {
                    container.html('');
                    showing();
                }
            });
        } else {
            showing();
        }
        if (this.options.activeScroll && Hawk.w < this.options.activeScrollWidth) {
            var id = this.content.attr('id');
            if (id !== undefined) {
                Hawk.scrollToElement({
                    anchor: '#' + id
                });
            }
        }
        return this;
    }
    this.changeBookmark = function(bookmarkContainer) {
        this.unsetBookmarkActive();
        this.current = bookmarkContainer;
        var bookmark = this.current.find('.' + this.options.bookmarkClass);
        var content = this.current.find('.' + this.options.bookmarkContentClass);
        this.setBookmarkActive(this.current);
        if (this.isSmallDevice()) {
            content.velocity("slideDown", {
                duration: that.options.slideDuration,
                complete: function() {
                    that.options.changeContentCallback(content);
                    that.loading = false;
                }
            });
        } else {
            this.changeContent(content.clone(true));
        }
        return this;
    }
    this.unsetBookmarkActive = function() {
        if (this.current !== undefined) {
            var current = this.current;
            current.find('.' + this.options.bookmarkClass).removeClass(this.options.activeBookmarkClass);
            current.find('.' + this.options.bookmarkContentClass).velocity("slideUp", {
                duration: that.options.slideDuration
            });
            this.current = undefined;
            this.options.bookmarkUnactiveCallback(current);
        }
        return this;
    }
    this.setBookmarkActive = function(bookmarkContainer) {
        var bookmark = bookmarkContainer.find('.' + this.options.bookmarkClass);
        bookmark.addClass(this.options.activeBookmarkClass);
        this.options.bookmarkActiveCallback(bookmarkContainer);
        return this;
    }
    this.launchBookmark = function(n) {
        this.changeBookmark(this.bookmarks.eq(n));
        return this;
    }
    this.updateOptions = function(options) {
        this.options = Hawk.mergeObjects(this.options, options);
        return this;
    }
    this.clear = function(callback) {
        //this.current = undefined;
        this.unsetBookmarkActive();
        this.content.velocity({
            opacity: 0
        }, {
            duration: 200,
            complete: function() {
                if (callback !== undefined) {
                    callback();
                }
            }
        });
        return this;
    }
    this.remindActiveBookmark = function() {
        if (this.isSmallDevice()) {}
        return this;
    }
    this.refresh = function() {
        var current = this.current;
        if (current !== undefined) {
            this.clear(function() {
                that.changeBookmark(current);
            });
        }
        return this;
    }
    this.run = function() {
        this.bookmarks = this.container.find('.' + this.options.bookmarksClass);
        this.content = this.container.find('.' + this.options.contentClass);
        this.contentWrapper = this.container.find('.' + this.options.contentWrapperClass);
        var refresh;
        $(window).resize(function() {
            clearTimeout(refresh);
            refresh = setTimeout(function() {
                that.refresh();
            }, 100);
        });
        this.bookmarks.click(function() {
            if (that.loading == true) {
                return;
            }
            if (that.current !== undefined && that.current.is($(this))) {
                that.remindActiveBookmark();
            } else {
                that.changeBookmark($(this));
                that.loading = true;
            }
        });
        return this;
    }
}
Hawk.DetailsList = function(container, options) {
    this.container = $(container);
    this.titles;
    this.contents;
    this.current;
    this.states = {
        open: 'open',
        closed: 'closed'
    }
    this.defaultOptions = {
        itemClass: 'details-list__item',
        titleClass: 'details-list__title',
        contentClass: 'details-list__content',
        activeClass: 'active',
        hideOther: true,
        duration: 200,
        showCallback: function(current) {
            var arrow = current.find('.details-list__arrow');
            arrow.removeClass('icon-arrow--down').addClass('icon-arrow--up');
        },
        hideCallback: function(current) {
            var arrow = current.find('.details-list__arrow');
            arrow.removeClass('icon-arrow--up').addClass('icon-arrow--down');
        }
    }
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.show = function(title) {
        if (this.options.hideOther && this.current !== undefined) {
            var recent = this.current;
            this.hide(recent);
        }
        this.current = title;
        var that = this;
        var container = this.current.parents('.' + that.options.itemClass).first();
        container.addClass(this.options.activeClass);
        var content = this.current.siblings('.' + this.options.contentClass);
        this.options.showCallback(container);
        content.velocity("slideDown", {
            duration: that.options.duration,
            complete: function() {
                that.current.attr('data-state', that.states.open);
            }
        });
        return this;
    }
    this.hide = function(title) {
        var that = this;
        var container = title.parents('.' + that.options.itemClass).first();
        container.removeClass(this.options.activeClass);
        this.options.hideCallback(container);
        var content = title.siblings('.' + this.options.contentClass);
        content.velocity("slideUp", {
            duration: that.options.duration,
            complete: function() {
                title.attr('data-state', that.states.closed);
            }
        });
        return this;
    }
    this.run = function() {
        var that = this;
        this.titles = this.container.find('.' + this.options.titleClass);
        this.contents = this.container.find('.' + this.options.contentClass);
        this.contents.hide();
        this.titles.click(function() {
            if ($(this).attr('data-state') == that.states.open) {
                that.hide($(this));
            } else {
                that.show($(this));
            }
        });
        return this;
    }
}
Hawk.CategorizedItems = function(container, options) {
    this.container = $(container);
    this.categories = this.container.find('[data-category-id]');
    this.items;
    this.noItems;
    this.contentContainer;
    this.content;
    this.selectedItems;
    this.recentItems;
    this.currentCategory;
    this.currentBookmark;
    this.defaultOptions = {
        allId: 'all',
        prefix: "cat-",
        amountInRow: {
            0: 1,
            550: 2,
            768: 3,
            1100: 4
        },
        itemClass: "categorized-items__item",
        noItemsClass: "categorized-items__no-items",
        contentContainerClass: "categorized-items__contents-container",
        contentClass: "categorized-items__contents",
        activeBookmarkClass: "active",
        slideSpeed: 500,
        fadeSpeed: 200,
        smallDeviceWidth: 480,
        scrollOnSmallDevice: true
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.loadCategory = function(id) {
        var that = this;
        this.currentCategory = id;
        this.recentItems = this.selectedItems;
        if (this.currentCategory == this.options.allId) {
            this.selectedItems = this.items;
        } else {
            this.selectedItems = this.items.filter('.cat-' + this.currentCategory);
        }
        this.activateBookmark(this.currentCategory);
        if (that.selectedItems.length > 0) {
            var itemsPerRow = this.countItemsPerRow();
            var rowAmount = Math.ceil(this.selectedItems.length / itemsPerRow);
            var itemHeight = this.selectedItems.first().outerHeight();
            var necessaryHeight = rowAmount * itemHeight;
            if (necessaryHeight < this.contentContainer.outerHeight()) {
                this.contentContainer.css({
                    'min-height': necessaryHeight + "px"
                });
            }
            that.content.velocity("slideUp", {
                duration: that.options.slideSpeed,
                complete: function() {
                    that.noItems.hide();
                    that.items.hide();
                    that.selectedItems.show();
                    if (that.options.scrollOnSmallDevice && Hawk.w < that.options.smallDeviceWidth) {
                        var containerId = that.contentContainer.attr('id');
                        if (containerId !== undefined) {
                            console.log(containerId);
                            Hawk.scrollToElement({
                                anchor: '#' + containerId
                            });
                        }
                    }
                    that.content.velocity("slideDown", {
                        duration: that.options.slideSpeed,
                        complete: function() {
                            that.contentContainer.css({
                                'min-height': necessaryHeight + "px"
                            });
                        }
                    });
                }
            });
        } else {
            var containerMinHeight = that.noItems.outerHeight();
            this.contentContainer.css({
                'min-height': containerMinHeight + "px"
            });
            that.content.velocity("slideUp", {
                duration: that.options.slideSpeed,
                complete: function() {
                    that.items.hide();
                    that.noItems.show();
                    that.content.velocity("slideDown", {
                        duration: that.options.slideSpeed
                    });
                }
            });
        }
        return this;
    }
    this.activateBookmark = function(id) {
        if (this.currentBookmark !== undefined) {
            this.currentBookmark.removeClass(this.options.activeBookmarkClass);
        }
        this.currentBookmark = this.categories.filter('[data-category-id="' + id + '"]');
        this.currentBookmark.addClass(this.options.activeBookmarkClass);
        return this;
    }
    this.countItemsPerRow = function() {
        var amount = 0;
        var object = this.options.amountInRow;
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                if (property > Hawk.w) {
                    return amount;
                }
                amount = object[property];
            }
        }
        return amount;
    }
    this.refresh = function() {
        var itemsPerRow = this.countItemsPerRow();
        var itemWidth = 1 / itemsPerRow * 100;
        this.items.css({
            width: itemWidth + "%"
        });
        return this;
    }
    this.run = function() {
        var that = this;
        this.items = this.container.find('.' + this.options.itemClass);
        this.noItems = this.container.find('.' + this.options.noItemsClass);
        this.content = this.container.find('.' + this.options.contentClass);
        this.contentContainer = this.container.find('.' + this.options.contentContainerClass);
        this.selectedItems = this.items;
        this.noItems.hide();
        this.refresh();
        var refresh;
        $(window).resize(function() {
            clearTimeout(refresh);
            refresh = setTimeout(function() {
                that.refresh();
            }, 100);
        });
        this.categories.click(function() {
            var id = $(this).attr('data-category-id');
            that.loadCategory(id);
        });
        this.loadCategory(this.options.allId);
        return this;
    }
}
Hawk.formFieldTypes = {
    TEXT: 'text',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    FILE: 'file'
};
Hawk.FormField = function(name, type, wrapperClass, required, callback) {
    var that = this;
    this.name = name;
    this.type = type;
    this.wrapperClass = wrapperClass;
    this.required = required;
    this.callback = callback;
    this.wrapper;
    this.field;
    this.errorClass = "error";
    this.getName = function() {
        return this.name;
    }
    this.bind = function(form) {
        if (this.type == Hawk.formFieldTypes.TEXTAREA) {
            this.field = $(form).find('textarea[name="' + this.name + '"]');
        } else if (this.type == Hawk.formFieldTypes.CHECKBOX) {
            this.field = $(form).find('input[name="' + this.name + '"]');
            if (this.field.length == 0) {
                this.field = $(form).find('input[name="' + this.name + '[]"]');
            }
        } else if (this.type == Hawk.formFieldTypes.SELECT) {
            this.field = $(form).find('select[name="' + this.name + '"]');
        } else {
            this.field = $(form).find('input[name="' + this.name + '"]');
        }
        if (this.field.length > 0) {
            if (typeof this.wrapperClass == 'function') {
                this.wrapper = this.wrapperClass(this.field);
            } else {
                this.wrapper = this.field.parents('.' + this.wrapperClass);
            }
        }
    }
    this.parseFieldsIntoArray = function(chosenFields) {
        var result = [];
        chosenFields.each(function() {
            result.push($(this).val());
        });
        return result;
    }
    this.getValue = function() {
        if (this.type == Hawk.formFieldTypes.CHECKBOX) {
            var chosen = this.field.filter(':checked');
            if (chosen.length > 0) {
                this.parseFieldsIntoArray(chosen);
            } else {
                return null;
            }
        } else if (this.type == Hawk.formFieldTypes.RADIO) {
            var chosen = this.field.filter(':checked');
            if (chosen.length > 0) {
                return chosen.val();
            } else {
                return null;
            }
        } else {
            return this.field.val();
        }
    }
    this.isBinded = function() {
        return (this.wrapper !== undefined && this.field !== undefined);
    }
    this.disable = function() {
        if (this.isBinded()) {
            this.field.attr('disabled', 'disabled');
        }
        return this;
    }
    this.validate = function() {
        if (callback !== undefined) {
            if (that.type == Hawk.formFieldTypes.CHECKBOX || that.type == Hawk.formFieldTypes.RADIO || that.type == Hawk.formFieldTypes.FILE) {
                return callback(that.field, that.wrapper);
            } else {
                return callback(that.field.val());
            }
        }
        return true;
    }
    this.markIncorrect = function() {
        this.wrapper.addClass(this.errorClass);
        return this;
    }
    this.clear = function() {
        this.wrapper.removeClass(this.errorClass);
        return this;
    }
    this.clearField = function() {
        if (that.type == Hawk.formFieldTypes.CHECKBOX || that.type == Hawk.formFieldTypes.RADIO) {
            this.field.attr('checked', false);
        } else if (that.type == Hawk.formFieldTypes.SELECT) {
            this.field.val(0);
        } else {
            this.field.val('');
        }
        return this;
    }
    this.run = function(form) {
        this.bind(form);
        this.field.change(function() {
            if (that.validate()) {
                that.clear();
            } else {
                that.markIncorrect();
            }
        });
    }
}
Hawk.FormSender = function(id, fields, options) {
    var that = this;
    this.id = id;
    this.rawForm = document.getElementById(this.id);
    this.form = $(this.rawForm);
    this.fields = {};
    for (var i in fields) {
        var current = fields[i];
        this.fields[current.getName()] = current;
    }
    this.defaultOptions = {
        isStatic: false,
        staticCallback: function() {},
        ajaxPath: '/ajax.php',
        extraData: {},
        autoDisable: true,
        incorrectFieldClass: 'error',
        button: that.form.find('button[type="submit"]'),
        cancelButton: that.form.find('button.form__cancel'),
        infoContainerClass: 'form__info-container',
        infoWrapperClass: 'form__info-wrapper',
        infoClass: 'form__info',
        spinnerClass: 'form__spinner',
        sendingGate: function() {
            return true;
        },
        onCorrect: function(result) {
            that.changeMessage(result.message);
        },
        onError: function(result) {},
        onException: function(result) {},
        callback: function() {}
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.infoContainer = this.form.find('.' + this.options.infoContainerClass);
    this.infoWrapper = this.form.find('.' + this.options.infoWrapperClass);
    this.info = this.form.find('.' + this.options.infoClass);
    this.spinner = this.form.find('.' + this.options.spinnerClass);
    this.button = this.options.button;
    this.cancelButton = this.options.cancelButton;
    this.validate = function() {
        var result = true;
        for (var i in this.fields) {
            var current = this.fields[i];
            if (!current.validate()) {
                current.markIncorrect();
                result = false;
            } else {
                current.clear();
            }
        }
        return result;
    }
    this.clear = function() {
        for (var i in this.fields) {
            var current = this.fields[i];
            current.clear();
        }
        return this;
    }
    this.clearFields = function() {
        for (var i in this.fields) {
            var current = this.fields[i];
            current.clearField();
        }
        return this;
    }
    this.checkFields = function(incorrectFields) {
        for (var i in this.fields) {
            var current = this.fields[i];
            if (Hawk.isInObject(current.name, incorrectFields)) {
                current.markIncorrect();
            } else {
                current.clear();
            }
        }
        return this;
    }
    this.changeMessage = function(message) {
        var showing = function() {
            that.info.html(message);
            that.infoWrapper.velocity("slideDown", {
                duration: 200,
                complete: function() {
                    that.infoContainer.css({
                        'min-height': that.infoContainer.outerHeight() + "px"
                    });
                    that.showMessage();
                }
            });
        }
        if (this.infoWrapper.is(':hidden')) {
            showing();
        } else {
            that.hideMessage(showing);
        }
        return this;
    }
    this.showMessage = function(message) {
        that.info.velocity({
            opacity: 1
        }, {
            duration: 200
        });
        return this;
    }
    this.hideMessage = function(callback) {
        this.info.velocity({
            opacity: 0
        }, {
            duration: 200,
            complete: function() {
                if (callback !== undefined) {
                    callback();
                }
            }
        });
        return this;
    }
    this.immediatelyClearMessage = function() {
        that.info.css({
            opacity: 0
        });
        return this;
    }
    this.clearMessage = function(callback) {
        this.info.velocity({
            opacity: 0
        }, {
            duration: 200,
            complete: function() {
                that.infoWrapper.velocity("slideUp", {
                    duration: 200,
                    complete: function() {
                        that.infoContainer.css({
                            'min-height': 0
                        });
                        if (callback !== undefined) {
                            callback();
                        }
                    }
                });
            }
        });
        return this;
    }
    this.hideButton = function() {
        this.button.add(this.cancelButton).velocity({
            opacity: 0
        }, {
            duration: 200,
            complete: function() {
                that.button.css({
                    visibility: 'hidden'
                });
            }
        });
    }
    this.disable = function() {
        this.form.attr('disabled', 'disabled');
        this.form.find('input, textarea').attr('disabled', 'disabled');
        return this;
    }
    this.isStatic = function() {
        return this.options.isStatic;
    }
    this.send = function() {
        this.spinner.show();
        if (!this.isStatic()) {
            this.immediatelyClearMessage();
            var data = new FormData(that.rawForm);
            for (var key in that.options.extraData) {
                data.append(key, that.options.extraData[key]);
            }
            $.ajax({
                url: that.options.ajaxPath,
                type: 'POST',
                data: data,
                cache: false,
                processData: false, // Don't process the files
                contentType: false,
                dataType: 'json',
                success: function(result) {
                    console.log(result);
                    if (result.status == Hawk.RequestStatus.SUCCESS) {
                        that.clear();
                        if (that.options.autoDisable) {
                            that.hideButton();
                            that.disable();
                        }
                        if (typeof that.options.onCorrect == 'function') {
                            that.options.onCorrect(result);
                        } else {
                            that.changeMessage(result.message);
                        }
                    } else if (result.status == Hawk.RequestStatus.ERROR) {
                        that.checkFields(result.errorFields);
                        that.changeMessage(result.message);
                        if (typeof that.options.onError == 'function') {
                            that.options.onError(result);
                        }
                    } else {
                        that.checkFields(result.errorFields);
                        that.changeMessage(result.message);
                        if (typeof that.options.onException == 'function') {
                            that.options.onException(result);
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText);
                    that.changeMessage("Wystąpił nieoczekiwany problem podczas przetwarzania formularza. Proszę spróbować ponownie później.");
                    console.log(errorThrown);
                    if (typeof that.options.onException == 'function') {
                        that.options.onException();
                    }
                },
                complete: function(jqXHR) {
                    that.spinner.hide();
                }
            });
        } else {
            this.options.staticCallback(this, this.fields);
            that.spinner.hide();
        }
    }
    this.bindFields = function() {
        for (var i in this.fields) {
            var current = this.fields[i];
            current.run(that.form);
        }
        return this;
    }
    this.getField = function(name) {
        return this.fields[name];
    }
    this.run = function() {
        this.bindFields();
        this.form.submit(function(e) {
            e.preventDefault();
            if (that.options.sendingGate()) {
                that.send();
            }
        });
        this.cancelButton.click(function() {
            that.clearFields();
        });
    }
}
Hawk.Fields = {};
Hawk.Fields.Field = function(name, types, required) {
    if (typeof required == 'undefined') {
        required = false;
    }
    return new Hawk.FormField(name, Hawk.formFieldTypes.FILE, function(field) {
        var parent = field.parents('.file-form-field');
        var fieldWrapper = parent.find('.simple-form-field');
        return fieldWrapper;
    }, required, function(field, wrapper) {
        var val;
        var rawField = field.get(0);
        if (field.val().length > 0) {
            val = field.val();
        } else {
            val = field.attr('placeholder');
            wrapper.removeClass('filled');
            return false;
        }
        val = val.replace('fakepath\\', '');
        if (val.length > 26) {
            val = val.slice(-26);
            val = "..." + val;
        }
        wrapper.addClass('filled');
        wrapper.find('.simple-form-field__core').html(val);
        wrapper.removeClass('error');
        if (field.val().length > 0) {
            var fileType = field.get(0).files[0].type.valueOf();
            if (Hawk.isInObject(fileType, types)) {
                wrapper.removeClass('error');
                return true;
            } else {
                wrapper.addClass('error');
                return false;
            }
        } else {
            rawField.value = '';
            if (!/safari/i.test(navigator.userAgent)) {
                rawField.type = ''
                rawField.type = 'file'
            }
            return false;
        }
    });
};
Hawk.FormPreparer = function(id, options) {
    var that = this;
    this.id = id;
    this.rawForm = document.getElementById(this.id);
    this.form = $(this.rawForm);
    this.fields = {};
    this.disabled = false;
    this.defaultOptions = {
        buttonDisabledClass: 'button--disabled',
        onChange: function() {}
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.getButton = function() {
        return this.form.find('button[type="submit"]');
    }
    this.isDisabled = function() {
        return this.disabled;
    }
    this.disable = function() {
        this.form.attr('disabled', 'disabled');
        this.disabled = true;
        this.getButton().addClass(this.options.buttonDisabledClass);
    }
    this.enable = function() {
        this.form.removeAttr('disabled');
        this.disabled = false;
        this.getButton().removeClass(this.options.buttonDisabledClass);
    }
    this.run = function() {
        this.form.submit(function(e) {
            if (that.isDisabled()) {
                e.preventDefault();
            }
        });
        this.fields = this.form.find('input');
        this.fields.keydown(function(e) {
            if (e.key.length > 1 && e.key != "Backspace") {
                return;
            }
            var thisthat = this;
            setTimeout(function() {
                if (typeof $(thisthat).attr('data-current-value') != 'undefined' && $(thisthat).val() != $(thisthat).attr('data-current-value')) {
                    that.enable();
                } else {
                    that.disable();
                }
                that.options.onChange();
            }, 10);
        });
        this.disable();
    }
}
Hawk.Confirmation = function(overlayerID, overlayerPath, options) {
    var that = this;
    this.overlayerID = overlayerID;
    this.overlayerPath = overlayerPath;
    this.formID = options.formID || "form-confirmation";
    this.linkClass = options.linkClass || "confirmation-request-button";
    this.form;
    this.requests = {};
    this.getOverlayerID = function() {
        return this.overlayerID;
    }
    this.getOverlayerPath = function() {
        return this.overlayerPath;
    }
    this.getFormID = function() {
        return this.formID;
    }
    this.getLinkClass = function() {
        return this.linkClass;
    }
    this.registerRequest = function(id, path, onConfirm) {
        this.requests[id] = {
            id: id,
            path: path,
            onConfirm: onConfirm
        };
        return this;
    }
    this.open = function(id, path, data, onConfirm) {
        this.overlayer.loadContent(id, data, function(result) {
            that.form = new Hawk.FormSender(that.getFormID(), [], {
                ajaxPath: path,
                onCorrect: function(result) {
                    onConfirm(result);
                    that.hide();
                }
            });
            that.form.run();
        });
    }
    this.hide = function() {
        this.overlayer.hide();
    }
    this.getRequestParams = function(id) {
        return this.requests[id];
    }
    this.run = function() {
        this.overlayer = new Hawk.AjaxOverlayerManager(this.getOverlayerID(), {
            ajaxFilePath: this.getOverlayerPath()
        });
        this.overlayer.run();
        $('body').on('click', '.' + this.getLinkClass(), function(e) {
            e.preventDefault();
            const id = $(this).attr('data-id');
            const bundle = Hawk.createBundleFromString($(this).attr('data-bundle'));
            const requestParams = that.getRequestParams(id);
            that.open(id, requestParams.path, bundle, requestParams.onConfirm);
        });
    }
}
Hawk.getLocation = function() {
    return window.location;
}
Hawk.getPath = function() {
    return Hawk.getLocation().pathname;
}
Hawk.checkRoute = function(route, path) {
    const pathParts = path.split('/');
    //console.log(pathParts);
    //console.log(route.toString().replace("\\", ""));
    const routeParts = route.toString().replace("\\", "").split('/');
    //console.log(routeParts);
    let regex;
    if (route == "/") {
        return route == path;
    } else {
        for (let i in routeParts) {
            if (typeof pathParts[i] != 'undefined') {
                regex = new RegExp(routeParts[i]);
                if (!regex.test(pathParts[i])) {
                    //console.log("FALSEEEEEE");
                    return false;
                }
                ///console.log("Póki co git");
            } else {
                //console.log("FALSE");
                return false;
            }
        }
        return true;
    }
}
Hawk.LayeredBox = function(container, options) {
    var that = this;
    this.container = $(container);
    this.defaultOptions = {
        buttonClass: 'layered-box-button',
        closeClass: 'layered-box__layer-close',
        layerClass: 'layered-box__layer',
        onLoading: function(box) {}
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.buttons = this.container.find('.' + this.options.buttonClass);
    this.layer = this.container.find('.' + this.options.layerClass);
    this.close = this.container.find('.' + this.options.closeClass);
    this.loadLayer = function() {}
    this.run = function() {
        this.buttons.click(function() {
            that.layer.velocity("fadeIn", {
                duration: 200
            });
            if (typeof that.options.onLoading != 'undefined') {
                that.options.onLoading(that);
            }
        });
        this.close.click(function() {
            that.layer.velocity("fadeOut", {
                duration: 200
            });
        });
    }
}
Hawk.Routes = {
    routes: {},
    path: Hawk.getPath(),
    regexp: new RegExp(""),
    pathRegexp: new RegExp(this.path),
    getPath: function() {
        //console.log("GET PATH", window.location.pathname);
        return window.location.pathname;
    },
    /**routeExists: function(routeName) {
        return (typeof this.routes[routeName] != 'undefined');
    },

    getRoute: function(routeName) {
        if (this.routeExists(routeName)) {
            return this.routes[routeName];
        } else {
            return null;
        }
    },

    registerRoute: function(name, path) {
        this.routes[name] = path;
    },**/
    is: function(route) {
        this.regexp = new RegExp(route);
        return this.regexp.test(this.getPath());
    },
    contains: function(parameterName) {
        var regexp = new RegExp('/' + parameterName + '/');
        var endRegexp = new RegExp('/' + parameterName + '$');
        return regexp.test(this.getPath()) || endRegexp.test(this.getPath());
    },
    getParameterValue: function(parameterString) {
        var parts = parameterString.split('/');
        if (parts.length > 2) {
            return parts[2];
        } else {
            return null;
        }
    },
    get: function(parameterName) {
        if (this.contains(parameterName)) {
            var pattern = '/' + parameterName + '/([0-9a-zA-Z\-]+)';
            var regexp = new RegExp(pattern + '/');
            var endRegexp = new RegExp(pattern + '$');
            var results = regexp.exec(this.getPath());
            if (results != null) {
                return this.getParameterValue(results[0]);
            } else {
                results = endRegexp.exec(this.getPath());
                if (results != null) {
                    return this.getParameterValue(results[0]);
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
    }
}
Hawk.refresh = function() {
    this.w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeigh;
    return this;
}
Hawk.run = function() {
    var that = this;
    var pageLoadingLayer = $('#page-loading-layer');
    pageLoadingLayer.velocity("fadeOut", {
        duration: 1000
    });
    if (this.hash.length != 0 && this.anchorRegex.test(this.hash)) {
        this.scrollToElement({
            anchor: this.hash + this.anchorSufix,
            delay: 200
        });
    }
    $(window).resize(function() {
        that.refresh();
    });
    return this;
}
Hawk.Component = function(classname, values, subcomponents, options, id) {
    var that = this;
    this.classname = classname;
    this.values = values;
    this.subcomponents = subcomponents;
    this.properties = options.properties || {};
    this.methods = options.methods || {};
    this.bindingsDeclarations = options.bindingsDeclarations || [];
    this.bindings = {};
    this.rawBatchUpdate = options.batchUpdate || function(component, data) {};
    this.id = id || -1;
    this.onRefresh = options.onRefresh || function() {};
    this.onClick = options.onClick || function(component) {};
    this.container;
    this.getID = function() {
        return this.id;
    }
    this.getClassname = function() {
        return this.classname;
    }
    this.set = function(key, value) {
        this.values[key] = value;
        return this;
    }
    this.addSubcomponent = function(key, component) {
        this.subcomponents[key][component.getID()] = component;
        this.refreshView();
    }
    this.getSubcomponent = function(key, index) {
        return this.subcomponents[key][index];
    }
    this.getAllSubcomponents = function(key) {
        return this.subcomponents[key];
    }
    this.placeSubcomponent = function(key, component, html) {
        if (typeof this.subcomponents[key] == 'undefined') {
            this.subcomponents[key] = [];
        }
        this.subcomponents[key][component.getID()] = component;
        const element = this.getElement(key);
        element.append(html);
        component.refreshView();
        return this;
    }
    this.get = function(key) {
        return this.values[key];
    }
    this.batchUpdate = function(data) {
        this.rawBatchUpdate(this, data);
        this.refreshView();
        this.onRefresh("all", "all", this);
    }
    this.update = function(key, value) {
        this.set(key, value);
        this.refreshView();
        this.onRefresh(key, value, this);
        this.updateBinded(key, value);
        return this;
    }
    this.updateBinded = function(key, value) {
        if (typeof this.bindings[key] !== 'undefined') {
            this.bindings[key].val(value);
        }
    }
    this.getProperty = function(key) {
        var property = this.properties[key];
        return property(this);
    }
    this.getContainer = function() {
        if (this.id > -1) {
            return $('.' + this.getClassname() + '[data-component-id="' + this.getID() + '"]');
        } else {
            return $('.' + this.getClassname());
        }
    }
    this.getElement = function(name) {
        return this.getContainer().find('.' + this.getClassname() + '__' + name);
    }
    this.refreshView = function() {
        var element = this.getElement("id");
        element.html(this.getID());
        //console.log("ID", this.getID());
        for (var i in this.values) {
            element = this.getElement(i);
            element.html(this.values[i]);
        }
        for (var i in this.properties) {
            element = this.getElement(i);
            element.html(this.getProperty(i));
        }
        // for (var i in this.subcomponents) {
        //     for (let j in this.subcomponents[i]) {
        //         if (this.subcomponents[i][j].hasOwnProperty('refreshView')) {
        //             this.subcomponents[i][j].refreshView();
        //         }
        //     }
        // }
        for (var i in this.methods) {
            this.methods[i](this);
        }
    }
    this.remove = function() {
        const container = this.getContainer();
        container.velocity("slideUp", {
            complete: function() {
                container.remove();
            }
        });
    }
    this.run = function() {
        var allComponentBindings = {};
        this.container = this.getContainer();
        if (this.id > 0) {
            allComponentBindings = $('[data-component-bind="' + this.getClassname() + '.' + this.getID() + '"]');
        } else {
            allComponentBindings = $('[data-component-bind="' + this.getClassname() + '"]');
        }
        for (var i in this.bindingsDeclarations) {
            this.bindings[this.bindingsDeclarations[i]] = allComponentBindings.filter('[data-element-bind="' + this.bindingsDeclarations[i] + '"]');
            $(this.bindings[this.bindingsDeclarations[i]]).keydown(function() {
                var thisthat = $(this);
                setTimeout(function() {
                    that.update(that.bindingsDeclarations[i], thisthat.val());
                }, 10);
            });
        }
    }
}
Hawk.ComponentClass = function(classname, values, subcomponents, options, parseJSON) {
    const that = this;
    this.classname = classname;
    this.values = values;
    this.subcomponents = subcomponents;
    this.options = options;
    this.parseJSON = parseJSON || function(json) {
        return {
            id: -1,
            values: {},
            subcomponents: {}
        };
    };
    this.instances = [];
    this.getOptions = function() {
        return this.options;
    }
    this.getValues = function() {
        return this.values;
    }
    this.newInstance = function(id, values, subcomponents) {
        //if (!this.instanceExists(id)) {
        let certainValues = this.getValues();
        if (typeof values != 'undefined') {
            certainValues = this.parseValues(values);
        }
        if (typeof subcomponents == 'undefined') {
            subcomponents = this.subcomponents;
        }
        const instance = new Hawk.Component(this.getClassname(), certainValues, subcomponents, this.getOptions(), id);
        instance.run();
        instance.refreshView();
        this.instances[instance.getID()] = instance;
        return instance;
        // } else {
        //     return null;
        // }
    }
    this.instanceExists = function(index) {
        return typeof this.instances[index] != 'undefined';
    }
    this.parseValues = function(certainValues) {
        const resultValues = {};
        for (let i in this.values) {
            if (typeof certainValues[i] != 'undefined') {
                resultValues[i] = certainValues[i];
            }
        }
        return resultValues;
    }
    this.getInstance = function(index) {
        if (this.instanceExists(index)) {
            return this.instances[index];
        } else {
            return null;
        }
    }
    this.getInstanceFromDOM = function(id) {}
    this.getAllInstances = function() {
        return this.instances;
    }
    this.removeInstance = function(index) {
        if (this.instanceExists(index)) {
            const current = this.instances[index];
            current.remove();
        }
    }
    this.refreshView = function() {
        for (let i in this.instances) {
            this.instances[i].refreshView();
        }
    }
    this.createFromJSON = function(json) {
        const data = this.parseJSON(json);
        if (typeof data.id != 'undefined') {
            const values = this.parseValues(data.values);
            return this.newInstance(data.id, values, data.subcomponents);
        } else {
            return null;
        }
    }
    this.clearInstances = function() {
        this.instances = [];
    }
    this.getClassname = function() {
        return this.classname;
    }
    this.initialize = function() {
        const components = $('.' + this.getClassname());
        let currentID = -1;
        components.each(function() {
            currentID = $(this).attr(Hawk.Constants.COMPONENT_ID_ATTRIBUTE);
            if (currentID > 0) {
                that.newInstance(currentID);
            }
        });
    }
}
Hawk.AjaxRequestType = {
    GET: 'GET',
    POST: 'POST',
};
Hawk.AjaxRequestsManager = function(options) {
    const that = this;
    this.ajaxRequest;
    //this.ajaxRequestWorking = false;
    this.defaultOptions = {
        onSuccess: function() {},
        onError: function() {},
        onFailure: function() {},
        onComplete: function() {}
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.post = function(path, bundle, callbacks) {
        this.sendRequest(path, Hawk.AjaxRequestType.POST, bundle, callbacks);
    }
    this.get = function(path, callbacks) {
        this.sendRequest(path, Hawk.AjaxRequestType.GET, {}, callbacks);
    }
    this.sendRequest = function(path, type, bundle, callbacks) {
        // if (this.ajaxRequestWorking) {
        //     return false;
        // }
        this.ajaxRequestWorking = true;
        const onSuccess = callbacks.onSuccess || this.options.onSuccess;
        const onFailure = callbacks.onFailure || this.options.onFailure;
        const onError = callbacks.onError || this.options.onError;
        const onComplete = callbacks.onComplete || this.options.onComplete;
        this.ajaxRequest = $.ajax({
            type: type,
            url: path,
            dataType: "json",
            data: bundle,
            success: function(result) {
                console.log(result);
                if (typeof result.success != 'undefined' && result.success) {
                    console.log("SUCCESS");
                    onSuccess(result);
                } else {
                    console.log("FAILURE");
                    onFailure(result);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                onError();
            },
            complete: function() {
                that.ajaxRequestWorking = false;
                onComplete();
            }
        });
        return this;
    }
    this.run = function() {}
}
Hawk.AjaxRequestsController = function() {
    this.requestLinks;
    this.operations = {};
    this.registerOperation = function(options) {
        this.operations[options.name] = options;
        return this;
    };
    this.sendRequest = function(generalData, moduleData) {
        var that = this;
        var data = Hawk.mergeWholeObjects(generalData, moduleData);
        console.log(data);
        $.ajax({
            type: "POST",
            //url: "/ajax.php",
            url: '/ajax/request',
            dataType: "json",
            data: data,
            success: function(result) {
                console.log(result);
                that.operations[result.operation].callback(result);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            },
            complete: function() {
                //spinner.hide();
            }
        });
        return this;
    }
    this.refreshDependencies = function() {
        var that = this;
        this.requestLinks = $('.ajax-request-button');
        this.requestLinks.unbind('click').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            var operation = $(this).attr('data-operation');
            var data = that.operations[operation].collectData($(this));
            that.sendRequest({
                operation: operation
            }, data);
        });
    }
    this.run = function() {
        this.refreshDependencies();
    }
}
Hawk.ComponentsManager = function(classComponent, wrapperClass, options) {
    const that = this;
    this.classComponent = classComponent;
    this.wrapperClass = wrapperClass;
    this.defaultOptions = {
        contentContainerClass: 'components',
        loaderClass: 'contents-manager__loader'
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.getClassComponent = function() {
        return this.classComponent;
    }
    this.getWrapper = function() {
        return $('.' + this.wrapperClass);
    }
    this.getContentContainer = function() {
        return this.getWrapper().find('.' + this.options.contentContainerClass);
    }
    this.getLoader = function() {
        return this.getWrapper().find('.' + this.options.loaderClass);
    }
    this.requestsManager = new Hawk.AjaxRequestsManager();
    // this.loadComponent = function(path, id, callback) {
    //     this.requestsManager.get(path + "/" + id, {
    //         onSuccess: function(result) {
    //             that.getWrapper().html(result.html);
    //             console.log(result);
    //             let current;
    //             for (let i in result.bundle) {
    //                 current = that.classComponent.createFromJSON(result.bundle[i]);
    //                 if (typeof callback == 'function') {
    //                     callback(current);
    //                 }
    //             }
    //             if (typeof generalCallback == 'function') {
    //                 generalCallback(result);
    //             }
    //         },
    //         onFailure: function(result) {
    //             console.log(result);
    //             console.error("A problem during loading components...");
    //         },
    //         onError: function(result) {
    //             console.log(result);
    //             console.error("An ERROR during loading components...");
    //         }
    //     });
    // }
    this.loadComponents = function(path, callback, generalCallback) {
        var loader = this.getLoader();
        loader.show();
        //console.log("loading...........");
        this.requestsManager.get(path, {
            onSuccess: function(result) {
                that.getContentContainer().html(result.html);
                //console.log(result);
                let current;
                for (let i in result.bundle) {
                    current = that.classComponent.createFromJSON(result.bundle[i]);
                    if (typeof callback == 'function') {
                        callback(current);
                    }
                }
                if (typeof generalCallback == 'function') {
                    generalCallback(result);
                }
            },
            onFailure: function(result) {
                console.log(result);
                console.error("A problem during loading components...");
            },
            onError: function(result) {
                console.log(result);
                console.error("An ERROR during loading components...");
            },
            onComplete: function() {
                loader.hide();
                //console.log("loading completed");
            }
        });
    }
    this.addComponent = function(html, json, callback) {
        const content = $(html);
        that.getContentContainer().append(html);
        current = that.classComponent.createFromJSON(json);
        if (typeof callback == 'function') {
            callback(current);
        }
    }
    this.swapComponents = function(firstID, secondID) {
        const wrappers = this.getWrapper();
        wrappers.each(function() {
            const firstElement = $(this).find('.' + that.classComponent.getClassname() + '[data-component-id="' + firstID + '"]');
            const secondElement = $(this).find('.' + that.classComponent.getClassname() + '[data-component-id="' + secondID + '"]');
            var height = firstElement.outerHeight();
            var firstCopy = firstElement.clone();
            var secondCopy = secondElement.clone();
            firstElement.velocity({
                top: -height + "px"
            }, {
                duration: 200
            });
            secondElement.velocity({
                top: height + "px"
            }, {
                duration: 200
            });
            setTimeout(function() {
                firstElement.replaceWith(secondCopy);
                secondElement.replaceWith(firstCopy);
            }, 200);
        });
    }
}
Hawk.ContentsManager = function(wrapperClass, options) {
    const that = this;
    this.wrapperClass = wrapperClass;
    this.defaultOptions = {
        'loaderClass': 'contents-manager__loader'
    };
    this.options = Hawk.mergeObjects(this.defaultOprions, options);
    this.requestsManager = new Hawk.AjaxRequestsManager();
    this.getWrapper = function() {
        return $('.' + this.wrapperClass);
    }
    this.getLoader = function() {
        return this.getWrapper().find('.' + this.options.loaderClass);
    }
    this.changeContent = function(content) {
        that.getWrapper().html(content);
    }
    this.load = function(path, callback) {
        var loader = this.getLoader();
        loader.show();
        console.log("loading...");
        this.requestsManager.get(path, {
            onSuccess: function(result) {
                that.changeContent(result.html);
                if (typeof callback == 'function') {
                    callback();
                }
            },
            onFailure: function(result) {
                console.error("A problem during loading contents...");
            },
            onError: function(result) {
                console.error("An ERROR during loading contents...");
            },
            onComplete: function() {
                loader.hide();
                console.log("loading completed");
            }
        });
    }
}
Hawk.PagesManager = function(routes, wrapperClass) {
    const that = this;
    this.routes = routes;
    this.wrapperClass = wrapperClass;
    this.requestsManager = new Hawk.AjaxRequestsManager();
    this.getWrapper = function() {
        return $('.' + this.wrapperClass);
    }
    this.changeContent = function(content) {
        that.getWrapper().html(content);
    }
    this.changePath = function(path) {
        window.history.pushState({
            page: path
        }, '', path);
    }
    this.load = function(path, callback) {
        this.requestsManager.get(path, {
            onSuccess: function(result) {
                that.changeContent(result.html);
                window.history.pushState({
                    page: path
                }, '', path);
                for (let i in AppComponents) {
                    AppComponents[i].clearInstances();
                }
                if (typeof callback == 'function') {
                    callback();
                }
            },
            onFailure: function(result) {
                console.error("A problem during loading contents...");
            },
            onError: function(result) {
                console.error("An ERROR during loading contents...");
            }
        });
    }
    this.getDestination = function(link) {
        return $(link).attr('href');
    }
    this.loading = function(e) {
        const destination = that.getDestination($(this));
        let route;
        for (let i in that.routes) {
            route = that.routes[i];
            console.log(route);
            if (Hawk.checkRoute(route.path, destination) && destination != that.routes.MAIN.path) {
                e.preventDefault();
                that.load(destination, route.callback);
                //that.changePath(destination);
                console.log("THIS IS APP ROUTE");
                return;
            }
        }
        console.log("It's not an app route");
    }
    this.refreshDependencies = function() {
        $('a').off('click', this.loading).on('click', this.loading);
        return this;
    }
    this.run = function(destination) {
        this.refreshDependencies();
        let route;
        for (let i in that.routes) {
            route = that.routes[i];
            if (Hawk.checkRoute(route.path, destination)) {
                route.callback();
                console.log("THIS IS APP ROUTE");
            }
        }
    }
}
const Routes = {
    MATCH: {
        path: '/team/([0-9]+)/match/([0-9]+)',
        callback: function() {
            const currentTeamID = Hawk.Routes.get('team');
            const currentMatchID = Hawk.Routes.get('match');
            AppComponentManagers.Player.loadComponents('/get-players/team/' + currentTeamID + '/match/' + currentMatchID, function(team) {
                // const players = team.get('players');
                // for (let i in players) {
                //     const player = AppComponents.Player.createFromJSON(players[i]);
                //     AppComponents.Team.addSubitem('players', player.getID(), player);
                // }
            }, function(result) {
                $('.layered-box').each(function() {
                    var dropdownContainer = $(this).find('.dropdown-menu');
                    var dropdown = new Hawk.Dropdown(dropdownContainer, {
                        onShow: function(dropdown) {
                            dropdown.container.find('.icon-hamburger').addClass('open').addClass('icon-hamburger--light');
                        },
                        onHide: function(dropdown) {
                            dropdown.container.find('.icon-hamburger').removeClass('open').removeClass('icon-hamburger--light');
                        }
                    });
                    dropdown.run();
                    var current = new Hawk.LayeredBox($(this), {
                        onLoading: function(box) {
                            dropdown.hide();
                        }
                    });
                    current.run();
                });
                AppAjaxRequestsController.refreshDependencies();
                AppPagesManager.refreshDependencies();
            });
            // AppComponentManagers.Player.loadComponents('/get-players/team/' + currentTeamID + '/match/' + currentMatchID, function(current) {
            //     console.log(current);
            // }, function() {
            //     $('.layered-box').each(function() {
            //         var dropdownContainer = $(this).find('.dropdown-menu');
            //         var dropdown = new Hawk.Dropdown(dropdownContainer, {
            //             onShow: function(dropdown) {
            //                 dropdown.container.find('.icon-hamburger').addClass('open').addClass('icon-hamburger--light');
            //             },
            //             onHide: function(dropdown) {
            //                 dropdown.container.find('.icon-hamburger').removeClass('open').removeClass('icon-hamburger--light');
            //             }
            //         });
            //         dropdown.run();
            //         var current = new Hawk.LayeredBox($(this), {
            //             onLoading: function(box) {
            //                 dropdown.hide();
            //             }
            //         });
            //         current.run();
            //     });
            //     AppAjaxRequestsController.refreshDependencies();
            // });
            const setsDropdownContainer = $('#sets-dropdown');
            if (setsDropdownContainer.length) {
                const setsDropdown = new Hawk.Dropdown(setsDropdownContainer, {
                    mode: Hawk.DropdownConstants.modes.CHOOSABLE
                });
                setsDropdown.run();
            }
        }
    },
    TEAM: {
        path: '/team/([0-9]+)',
        callback: function() {
            const currentTeamID = Hawk.Routes.get('team');
            console.log(currentTeamID);
            AppComponentManagers.Team.loadComponents('/teams/get', function(currentTeamID) {
                // const players = team.get('players');
                // for (let i in players) {
                //     AppComponents.Player.createFromJSON(players[i]);
                // }
                AppAjaxRequestsController.refreshDependencies();
                AppPagesManager.refreshDependencies();
            });
            AppComponentManagers.Match.loadComponents('/matches/get/' + currentTeamID, function() {
                AppAjaxRequestsController.refreshDependencies();
                AppPagesManager.refreshDependencies();
            });
        }
    },
    LOGIN: {
        path: '/user/login',
        callback: function() {}
    },
    MAIN: {
        path: '/',
        callback: function() {
            AppComponentManagers.Team.loadComponents('/teams/get', function(team) {
                // const players = team.get('players');
                // for (let i in players) {
                //     AppComponents.Player.createFromJSON(players[i]);
                // }
                AppAjaxRequestsController.refreshDependencies();
                AppPagesManager.refreshDependencies();
            });
            AppComponentManagers.EnemyTeam.loadComponents('/enemy-teams/get', function() {
                AppAjaxRequestsController.refreshDependencies();
                AppPagesManager.refreshDependencies();
            });
        }
    }
};
var Languages = {
    PL: {
        id: 1,
        code: "pl"
    },
    EN: {
        id: 2,
        code: "en"
    },
    DE: {
        id: 3,
        code: "de"
    },
    FR: {
        id: 4,
        code: "fr"
    },
    ES: {
        id: 5,
        code: "es"
    },
    HU: {
        id: 6,
        code: "hu"
    }
};
var ActiveLanguages = [
    Languages.PL,
    Languages.EN,
    Languages.HU
];
var MainLanguage = ActiveLanguages[0];
var FileTypes = {
    UNDEFINED: {
        id: 0,
        type: 'UNDEFINED',
        mimeType: "undefined"
    },
    IMAGE_JPEG: {
        id: 1,
        type: 'IMAGE_JPEG',
        mimeType: "image/jpeg"
    },
    IMAGE_PNG: {
        id: 2,
        type: 'IMAGE_PNG',
        mimeType: "image/png"
    },
    IMAGE_SVG: {
        id: 3,
        type: 'IMAGE_SVG',
        mimeType: "image/svg+xml"
    },
    AUDIO_MP3: {
        id: 30,
        type: 'AUDIO_MP3',
        mimeType: "audio/mpeg"
    },
    FILE_PDF: {
        id: 40,
        type: 'FILE_PDF',
        mimeType: "application/pdf"
    },
    FILE_DOC: {
        id: 41,
        type: 'FILE_DOC',
        mimeType: "application/msword"
    },
    FILE_XLS: {
        id: 42,
        type: 'FILE_XLS',
        mimeType: "application/vnd.ms-excel"
    },
    FILE_DOCX: {
        id: 43,
        type: 'FILE_DOCX',
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    },
    FILE_XLSX: {
        id: 44,
        type: 'FILE_XLSX',
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    },
    getByID: function(id) {
        for (var i in FileTypes) {
            if (FileTypes[i].hasOwnProperty('id') && FileTypes[i].id == id) {
                return FileTypes[i];
            }
        }
        return FileTypes.UNDEFINED;
    }
};
const ElementTypes = {
    UNDEFINED: 0,
    PLAIN_TEXT: 1,
    TEXT: 2,
    EXTENDED_TEXT: 3,
    SHORT_TEXT: 4,
    DATE: 8,
    ATTACHMENT: 10,
    CATEGORY: 20
}
const AppConstants = {};
AppConstants.EntityType = {
    COMPONENT: 1,
    CATEGORY: 2
};
const AppComponents = {};
AppComponents.ModulesGroup = new Hawk.ComponentClass('modules-group', {
    name: "",
    distinguished: false
}, {}, {
    methods: {
        refreshDistinguished: function(component) {
            if (component.get('distinguished')) {
                component.getContainer().addClass('modules-group--distinguished')
            } else {
                component.getContainer().removeClass('modules-group--distinguished')
            }
        }
    }
}, function(json) {
    let result = [];
    return {
        id: json.id,
        values: {
            name: json.name,
            distinguished: json.isDistinguished
        },
        subcomponents: {}
    };
});
AppComponents.Element = new Hawk.ComponentClass('element', {
    name: "",
    code: "",
    representative: false
}, {}, {
    methods: {
        refreshRepresentative: function(component) {
            var element = component.getElement('name-container');
            var operationElement = component.getElement('representative-link');
            if (component.get('representative')) {
                element.addClass('distinguished-element--active');
                operationElement.css({
                    visibility: 'hidden'
                });
            } else {
                element.removeClass('distinguished-element--active');
                operationElement.css({
                    visibility: 'visible'
                });
            }
        }
    }
}, function(json) {
    return {
        id: json.id,
        values: {
            name: json.name,
            code: json.code,
            representative: json.isRepresentative
        },
        subcomponents: {}
    };
});
AppComponents.Attachment = new Hawk.ComponentClass('attachment', {
    name: "",
    code: "",
    representative: false
}, {}, {
    methods: {
        refreshRepresentative: function(component) {
            var element = component.getElement('name-container');
            var operationElement = component.getElement('representative-link');
            if (component.get('representative')) {
                element.addClass('distinguished-element--active');
                operationElement.css({
                    visibility: 'hidden'
                });
            } else {
                element.removeClass('distinguished-element--active');
                operationElement.css({
                    visibility: 'visible'
                });
            }
        }
    }
}, function(json) {
    return {
        id: json.id,
        values: {
            name: json.name,
            code: json.code,
            representative: json.isRepresentative
        },
        subcomponents: {}
    };
});
AppComponents.Category = new Hawk.ComponentClass('category', {
    name: "",
    code: ""
}, {}, {}, function(json) {
    return {
        id: json.id,
        values: {
            name: json.name,
            code: json.code
        },
        subcomponents: {}
    };
});
AppComponents.Component = new Hawk.ComponentClass('component', {
    representativeName: "",
    visible: true,
    contents: []
}, {
    subcomponents: {}
}, {
    methods: {
        checkVisibility: function(component) {
            var enabledIcon = component.getElement('hideComponent');
            var disabledIcon = component.getElement('showComponent');
            if (component.get('visible')) {
                enabledIcon.show();
                disabledIcon.hide();
                component.getContainer().removeClass('component--hidden')
            } else {
                enabledIcon.hide();
                disabledIcon.show();
                component.getContainer().addClass('component--hidden')
            }
        }
    }
}, function(json) {
    // submodules
    const subcomponentsData = json.subcomponents;
    let subcomponents = [];
    for (let i in subcomponentsData) {
        subcomponents["subcomponents_" + i] = [];
        for (let j in subcomponentsData[i]) {
            const subcomponent = AppComponents.Component.createFromJSON(subcomponentsData[i][j]);
            const contents = subcomponent.get('contents');
            const representativeName = subcomponent.get('representativeName');
            subcomponent.set('contents', contents[MainLanguage.id]);
            subcomponent.set('representativeName', representativeName[MainLanguage.id]);
            (subcomponents["subcomponents_" + i]).push(subcomponent);
        }
    }
    console.log(json.id, json.representativeName);
    console.log(json.contents);
    console.log(json.subcomponents);
    return {
        id: json.id,
        values: {
            representativeName: json.representativeName,
            visible: json.isVisible,
            contents: json.contents
        },
        subcomponents: subcomponents
    };
});
AppComponents.Module = new Hawk.ComponentClass('module', {
    name: "",
    type: AppConstants.EntityType.COMPONENT
}, {
    elements: {},
    attachments: {},
    categories: {},
    components: {},
    submodules: {}
}, {
    methods: {
        refreshType: function(component) {
            const type = component.get('type');
            const typeIcon = component.getElement('icon');
            const categoriesRow = component.getElement('categories-row');
            if (type == AppConstants.EntityType.CATEGORY) {
                typeIcon.attr('src', "/herocms/img/icons/subsection/icon-category-small-primary.svg");
                categoriesRow.velocity("slideUp", {
                    duration: 200
                });
            } else {
                typeIcon.attr('src', "/herocms/img/icons/subsection/icon-module-small-primary.svg");
                categoriesRow.velocity("slideDown", {
                    duration: 400
                });
            }
        }
    }
}, function(json) {
    // elements
    const elementsData = json.elements;
    let elements = [];
    for (let i in elementsData) {
        const element = AppComponents.Element.createFromJSON(elementsData[i]);
        elements[element.getID()] = element;
    }
    // attachments
    const attachmentsData = json.attachments;
    let attachments = [];
    for (let i in attachmentsData) {
        const attachment = AppComponents.Attachment.createFromJSON(attachmentsData[i]);
        attachments[attachment.getID()] = attachment;
    }
    // categories
    const categoriesData = json.categories;
    let categories = [];
    for (let i in categoriesData) {
        const category = AppComponents.Category.createFromJSON(categoriesData[i]);
        categories[category.getID()] = category;
    }
    // components
    const componentsData = json.components;
    let components = [];
    for (let i in componentsData) {
        const component = AppComponents.Component.createFromJSON(componentsData[i]);
        components[component.getID()] = component;
    }
    // submodules
    const submodulesData = json.submodules;
    let submodules = [];
    for (let i in submodulesData) {
        const submodule = AppComponents.Module.createFromJSON(submodulesData[i]);
        submodules[submodule.getID()] = submodule;
    }
    return {
        id: json.id,
        values: {
            name: json.name,
            type: json.type
        },
        subcomponents: {
            elements: elements,
            attachments: attachments,
            categories: categories,
            components: components,
            submodules: submodules
        }
    };
});
AppComponents.DefinedData = new Hawk.ComponentClass('defined-data', {
    name: "",
    code: "",
    values: []
}, {}, {
    methods: {
        placeLanguagesSubsets: function(component) {
            let element;
            const values = component.get('values');
            let current;
            let currentValue;
            //console.log(values);
            for (let language in ActiveLanguages) {
                current = ActiveLanguages[language];
                element = component.getElement('value-' + current.code);
                //console.log('value-' + current.code);
                currentValue = values[current.id];
                if (typeof currentValue != 'undefined') {
                    element.html(currentValue.substring(0, 50));
                }
            }
        }
    }
}, function(json) {
    return {
        id: json.id,
        values: {
            name: json.name,
            code: json.code,
            values: json.values
        },
        subcomponents: {}
    };
});
const AppComponentManagers = {};
AppComponentManagers.ModulesGroup = new Hawk.ComponentsManager(AppComponents.ModulesGroup, 'modules-group-components');
AppComponentManagers.Module = new Hawk.ComponentsManager(AppComponents.Module, 'module-components');
AppComponentManagers.DefinedData = new Hawk.ComponentsManager(AppComponents.DefinedData, 'defined-data-components');
AppComponentManagers.Component = new Hawk.ComponentsManager(AppComponents.Component, 'component-components');
//const AppContentsManager = new Hawk.ContentsManager('site-content');
//const AppAjaxRequestsController = new Hawk.AjaxRequestsController();
//const AppPagesManager = new Hawk.PagesManager(Routes, 'site-content');
/**var MyCounter01 = Counter.newInstance(1);

var MyCounter02 = Counter.newInstance(2);

console.log(Counter.instanceExists(MyCounter01.getID()));
console.log(Counter.instanceExists(3));**/
// const MyCounter01 = Counter.getInstance(1);
// const MyCounter02 = Counter.getInstance(2);
// $('.counter-button-victory-01').click(function() {
//     var currentValue = parseInt(MyCounter01.get('victories'));
//     currentValue++;
//     MyCounter01.update('victories', currentValue);
// });
// $('.counter-button-defeat-01').click(function() {
//     var currentValue = parseInt(MyCounter01.get('defeats'));
//     currentValue++;
//     MyCounter01.update('defeats', currentValue);
// });
// $('.counter-button-victory-02').click(function() {
//     var currentValue = parseInt(MyCounter02.get('victories'));
//     currentValue++;
//     MyCounter02.update('victories', currentValue);
// });
// $('.counter-button-defeat-02').click(function() {
//     var currentValue = parseInt(MyCounter02.get('defeats'));
//     currentValue++;
//     MyCounter02.update('defeats', currentValue);
// });
// var Mapper = new Hawk.ComponentClass('mapper-item', {
//     values: {
//         name: ''
//     },
//     bindingsDeclarations: [
//         'name'
//     ]
// });
// Mapper.initialize();
// const CurrentMapper = Mapper.getInstance(1);
// setTimeout(function() {
//     CurrentMapper.update('name', 'lala');
// }, 5000);
