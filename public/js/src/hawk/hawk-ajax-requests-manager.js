
Hawk.AjaxRequestType = {
    GET: 'GET',
    POST: 'POST',
    DELETE: "DELETE"
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

    this.delete = function(path, options) {
        this.sendRequest(path, Hawk.AjaxRequestType.DELETE, JSON.stringify({}), options);
    }

    this.post = function(path, bundle, options) {
        this.sendRequest(path, Hawk.AjaxRequestType.POST, bundle, options);
    }

    this.get = function(path, options) {
        this.sendRequest(path, Hawk.AjaxRequestType.GET, {}, options);
    }

    this.sendRequest = function(path, type, bundle, options) {
        // if (this.ajaxRequestWorking) {
        //     return false;
        // }

        this.ajaxRequestWorking = true;

        console.log(bundle);
        console.log(type);

        const headers = options.headers || {};

        const onSuccess = options.onSuccess || this.options.onSuccess;
        const onFailure = options.onFailure || this.options.onFailure;
        const onError = options.onError || this.options.onError;
        const onComplete = options.onComplete || this.options.onComplete;

        this.ajaxRequest = $.ajax({
            type: type,
            url: path,
            contentType: "application/json",
            dataType: "json",
            data: bundle,
            headers: Object.assign({
                //contentType: 'application/json'
            }, headers),
            //traditional: true,
            success: function(result) {
                console.log(result);

                onSuccess(result);
                
                // if (typeof result.success != 'undefined' && result.success) {
                //     console.log("SUCCESS");
                //     onSuccess(result);
                // } else {
                //     console.log("FAILURE");
                //     onFailure(result);
                // }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);

                onError(jqXHR.responseText);
            },
            complete: function() {
                that.ajaxRequestWorking = false;

                onComplete();
            }
        });

        return this;
    }

    this.run = function() {
        
    }
}