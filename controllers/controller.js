/**
 * Controller : Base class
 * 
 * This class is used for handling asynchronous error catching.
 * 
 * This is important because Express 4 doesn't catch asynchronous errors.
 * By using this class we can avoid having to wrap all our routes and methods with Try/Catch
 * 
 */
class Controller{
    // Instance variable to hold the express router
    router;

    /**
     * Constructor 
     * 
     * Set up the router
     * 
     * @param {Express.router} router This is the router that will handle routing internally in the controller
     */
    constructor(router) {
        this.router = router;
    }

    /**
     * get method
     * 
     * sets up the error catching route and catches any errors for the action that is passed in.
     * 
     * @param {String} path The string for the path eg "/" or "/admin"
     * @param {Function} action The async function that will run that will need error catching.
     */
    get(path, action) {
        this.router.get(path, (req, res, next) => this.errorCatching(action, req, res, next))
    }

    /**
     * post method
     * 
     * sets up the error catching route and catches any errors for the action that is passed in.
     * 
     * @param {String} path The string for the path eg "/" or "/admin"
     * @param {Function} action The async function that will run that will need error catching.
     */
    post(path, action) {
        this.router.post(path, (req, res, next) => this.errorCatching(action, req, res, next))
    }

    /**
     * Returns the express router instance variable
     * 
     * @returns Express.router internal router
     */
    getRouter() {
        return this.router;
    }
    
    /**
     * errorcatching method
     * 
     * the magic method that will catch any asynchronous errors and then pass them to express
     * for the error checking middleware
     * 
     * @param {Function} action The async function that will run that will need error catching.
     * @param {*} req Express Request 
     * @param {*} res Express Response
     * @param {*} next Express Next middleware
     */
    errorCatching(action, req, res, next) { action(req,res).catch(next); }
}

exports.Controller = Controller;
