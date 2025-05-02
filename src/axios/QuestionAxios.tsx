import axios from "axios";
import {baseUrl} from "../main.tsx";

export async function getQuestion(tags: string[]) {

    try {
        return await axios.get(`${baseUrl}/api/v1/questions?tags=${tags.join(',')}`);
    } catch (error) {
        if (axios.isAxiosError(error)) {

        } else {
            console.error('Unexpected error:', error);
        }
    }

}