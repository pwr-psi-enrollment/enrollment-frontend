Hawk.ComponentsManager = function(classComponent, wrapperClass, options) {
    const that = this;

    this.classComponent = classComponent;
    this.wrapperClass = wrapperClass;

    this.defaultOptions = {
        contentContainerClass: 'components',
        loaderClass: 'contents-manager__loader',

        parseComponent: function(thisthat, component) {
            return thisthat.getHTML(component);
        },
        callback: function(component) {},
        generalCallback: function(components) {}
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

    this.getHTML = function(json) {
        return that.classComponent.getHTML(json);
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

    this.parseComponents = function(components, container) {
        var current;
        var HTML = "";
        var callback = this.options.callback;
        var generalCallback = this.options.generalCallback;

        for (var i in components) {
            current = components[i];

            HTML += that.options.parseComponent(that, current);
        }

        //that.options.parseJSON(that, result);

        if (typeof container != 'undefined') {
            container.html(HTML);
        } else {
            that.getContentContainer().html(HTML);
        }

        for (let i in components) {
            current = components[i];
            current.refreshView();

            if (typeof callback == 'function') {
                callback(current);
            }
        }

        if (typeof generalCallback == 'function') {
            generalCallback(components);
        }
    }

    this.parseItems = function(json, options) {
        var callback = options.callback || this.options.callback;
        var generalCallback = options.generalCallback || this.options.generalCallback;

        var receiveItems = options.receiveItems || function(result) { return result; };

        var result = receiveItems(json);

        let current;
        let HTML = "";

        var components = [];

        for (var i in result) {
            current = that.classComponent.createFromJSON(that.classComponent.prepareJSON(result[i]));
            components.push(current);

            HTML += that.options.parseComponent(that, current);
        }

        //that.options.parseJSON(that, result);

        that.getContentContainer().html(HTML);

        for (let i in components) {
            current = components[i];
            current.refreshView();

            if (typeof callback == 'function') {
                callback(current);
            }
        }

        if (typeof generalCallback == 'function') {
            generalCallback(components);
        }
    }

    this.loadComponents = function(path, headers, options) {
        var loader = this.getLoader();
        loader.show();

        //console.log("loading...........");

        this.requestsManager.get(path, {
            headers: headers,
            onSuccess: function(rawResult) {
                
                //console.log(result);
                that.parseItems(rawResult, options);

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

    this.createComponent = function(json) {
        that.getContentContainer().append(that.classComponent.getHTML(json));

        return that.classComponent.createFromJSON(json);
    }

    this.swapComponents = function(firstID, secondID) {
        const wrappers = this.getWrapper();

        wrappers.each(function() {
            const firstElement = $(this).find('.' + that.classComponent.getClassname() + '[data-component-id="' + firstID + '"]');
            const secondElement = $(this).find('.' + that.classComponent.getClassname() + '[data-component-id="' + secondID + '"]');

            var height = firstElement.outerHeight();

            var firstCopy = firstElement.clone();
            var secondCopy = secondElement.clone();

            firstElement.velocity({ top: -height + "px"}, {
                duration: 200
            });

            secondElement.velocity({ top: height + "px" }, {
                duration: 200
            });

            setTimeout(function() {
                firstElement.replaceWith(secondCopy);
                secondElement.replaceWith(firstCopy);
            }, 200);
        });
    }
}