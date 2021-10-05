import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";

export const httpVideo = axios.create({
    baseURL: process.env.REACT_APP_MICRO_VIDEO_API_URL
    // baseURL: 'http://localhost:8000/api'
});

const instances = [httpVideo];

export function addGlobalRequestInterceptor(
    onFulFilled?: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
    onRejected?: (error: any) => any
) {
    const ids: number[] = [];
    for (let i of instances){
        const id = i.interceptors.request.use(onFulFilled, onRejected);
        ids.push(id);
    }
    return ids;
}

export function removeGlobalRequestInterceptor(ids: number[]) {
    ids.forEach(
        (id, index) => instances[index].interceptors.request.eject(id)
    )
}

export function addGlobalResponseInterceptor(
    onFulFilled?: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
    onRejected?: (error: AxiosError) => any
) {
    const ids: number[] = [];
    for (let i of instances){
        const id = i.interceptors.response.use(onFulFilled, onRejected);
        ids.push(id);
    }
    return ids;
}

export function removeGlobalResponseInterceptor(ids: number[]) {
    ids.forEach(
        (id, index) => instances[index].interceptors.response.eject(id)
    )
}
