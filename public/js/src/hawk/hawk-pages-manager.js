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
        window.history.pushState({ page: path }, '', path);
    }

    this.load = function(path, callback) {
        this.requestsManager.get(path, {
            onSuccess: function(result) {
                that.changeContent(result.html);

                window.history.pushState({ page: path }, '', path);

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