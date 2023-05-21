import express from 'express';
import stationRouter from "./routes/stationsRoutes";
import bodyParser from "body-parser";
import sensorsRouter from "./routes/sensorRoutes";
import {StationCounter} from "./services/counters/StationCounter";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', async (req, res) => {
    try {
        const trial = await StationCounter.getStationCount()
        console.log("Counter has a value of " + trial + " at the moment");
        await StationCounter.incrementStationCount();
        console.log("Counter has a value of " + await StationCounter.getStationCount() + " at the moment");
    } catch (e) {
        console.log(e)
    }
    res.send('Hello World!');
});




app.use('/stations', stationRouter)
app.use('/sensors', sensorsRouter);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

