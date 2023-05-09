import express from 'express';
import stationRouter from "./routes/stationsRoutes";
import bodyParser from "body-parser";
import sensorsRouter from "./routes/sensorRoutes";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.use('/stations', stationRouter)
app.use('/sensors', sensorsRouter);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

