import express from 'express';
import stationRouter from "./routes/stationsRoutes";
import bodyParser from "body-parser";
import sensorsRouter from "./routes/sensorRoutes";
import cors from 'cors';
import userRouter from "./routes/userRoutes";
import configurationRouter from "./routes/configurationRoutes";
import ConfigurationService from "./services/configuration/ConfigurationService";

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
app.use('/configuration', configurationRouter)


const configurationService = new ConfigurationService();
configurationService.createConfigurationIfNotExists();


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

