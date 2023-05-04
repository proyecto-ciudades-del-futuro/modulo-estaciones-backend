import {ENTITIES_ORION_API_URL} from "../globals/constants";
import axios from "axios";

export const generateNewId = async (): Promise<string> => {
    // Retrieve the latest added entity

// Extract the ID of the latest entity
    const response = await axios.get('/v2/entities?type=Station&orderBy=dateCreated:desc&limit=1');
    const [latestEntityId] = await response.json();
    console.log(latestEntityId);

// Generate the ID for the next entity
    const nextIdSuffix: any = parseInt(latestEntityId.split('_').pop()) + 10;
    return `station_${nextIdSuffix.toString()}`;
}
