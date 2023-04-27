import express, {Router, Request, Response} from 'express';
import {INTERNAL_500} from "../globals/errorMessages";

const router: Router = express.Router();

router.get('/stations/', async (req: Request, res: Response) => {
    try {
        console.log("tomá las estaciones")
    } catch (error) {
        res.status(500).send(INTERNAL_500);
    }
})



