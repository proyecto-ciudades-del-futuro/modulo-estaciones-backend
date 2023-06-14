import express from 'express';
import stationRouter from "./routes/stationsRoutes";
import bodyParser from "body-parser";
import sensorsRouter from "./routes/sensorRoutes";
import {StationCounterSingleton} from "./services/counters/Counter";
import cors from 'cors';
import userRouter from "./routes/userRoutes";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:3001'
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', async (req, res) => {
    res.send('Hello World!');
});



app.use('/stations', stationRouter)
app.use('/sensors', sensorsRouter);
app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

