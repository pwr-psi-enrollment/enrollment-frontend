
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

    this.getHTML = options.getHTML || function() { return ""; };

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
        if (this.id != -1) {
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

            console.log(i, this.getProperty(i));

            element.html(this.getProperty(i));
        }

        // for (var i in this.subcomponents) {
        //
        //     for (let j in this.subcomponents[i]) {
        //         if (this.subcomponents[i][j].hasOwnProperty('refreshView')) {
        //             this.subcomponents[i][j].refreshView();
        //         }
        //
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