import {Counter} from "../counters/Counter";

export const generateNewId = async (counter: Counter, idPrefix: string): Promise<string> => {
    try {
        const idCounter = await counter.incrementCount();
        return `${idPrefix}_${idCounter}`;
    } catch (error) {
        return Promise.reject('An unexpected error occurred');
    }
};