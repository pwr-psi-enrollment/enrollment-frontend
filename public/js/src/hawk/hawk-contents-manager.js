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