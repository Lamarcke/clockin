import {API_BASE_PATH} from "../constants.ts";

export function getUploadedImageURL(key: string){
    return `${API_BASE_PATH}/public/uploads/${key}`
}
