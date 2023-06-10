export class NotFoundError extends Error {
    code: number;

    constructor(message: string) {
        super(message); // Pass remaining arguments (including vendor specific ones) to parent constructor
        this.name = "Entity Not Found"; // Custom name
        this.code = 404;

        // This line is needed to correctly set up the .stack property in V8-based environments (Node.js, Chrome)
        // Refer to: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#ES5_Custom_Error_Object
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}


export class InternalError extends Error {
    code: number;
    constructor(message: string) {
        super(message); // Pass remaining arguments (including vendor specific ones) to parent constructor
        this.name = "Internal Server Error"; // Custom name
        this.code = 500;
        Object.setPrototypeOf(this, InternalError.prototype);
    }
}

export class AlreadyExistsError extends Error {
    code: number;
    constructor(message: string){
        super(message);
        this.name = "Entity Already Exists";
        this.code = 409;
        Object.setPrototypeOf(this, AlreadyExistsError.prototype);
    }
}


