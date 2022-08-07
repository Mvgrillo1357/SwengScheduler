class Controller{
    router;

    constructor(router) {
        this.router = router;
    }

    get(path, action) {
        this.router.get(path, (req, res, next) => this.errorCatching(action, req, res, next))
    }

    post(path, action) {
        this.router.post(path, (req, res, next) => this.errorCatching(action, req, res, next))
    }

    getRouter() {
        return this.router;
    }
    
    errorCatching(action, req, res, next) { action(req,res).catch(next); }
}

exports.Controller = Controller;
