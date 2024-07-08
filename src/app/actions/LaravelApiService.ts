import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { cookies, headers} from "next/headers";

export const COOKIE_TOKEN_NAME = 'AD-TK';
export const API_SERVER_ENDPOINT = 'http://localhost/api';

/*FETECH NEXTJS EXTENDS API SERVICE - CONFIG ------------------------------------------*/
export const fetchApi = async (url: string, options: RequestInit): Promise<Partial<ParameterizedResponse>> => {   
    let url_final = null; 
    try{
        url_final = new URL(url);
    }catch{
        url= (`/${url}`).replace(/\\/gm, '/').replace(/\/+/gm, '/');
        url_final = new URL(API_SERVER_ENDPOINT + url);
    }    
    const payload_headers = new Headers();
    let jwt = await getAuthToken();
    payload_headers.append('Authorization', jwt);
    payload_headers.append('Content-Type', 'application/json');
    payload_headers.append('LAPI-KEY', process.env.LARAVEL_API_KEY);
    payload_headers.append('Accept', 'application/json');
    payload_headers.append('x-forwarded-for', headers().get('x-forwarded-for'));
    Object.entries(options.headers || {}).map((pair) => {
        if(payload_headers.has(pair[0]))
        payload_headers.set(pair[0], pair[1]);
        else 
        payload_headers.append(pair[0], pair[1]);
    });

    let jsonResponse: object = null;
    var response: Response = null;
    try {
        response = await fetch(url_final.href, {
            ...options,
            headers: payload_headers
        });
        jsonResponse = await response.json();  
        if(!response.ok)
            return ParameterizeResponse(false, refactorLaravelError(jsonResponse['errors']));
    } catch (error) {
        let er = `${error?.cause?.errno} | ${error?.cause?.code}`;
        if(!response.ok)
            er = `API | ${response?.statusText}`;
        return ParameterizeResponse(false, {"ServerError": er});
    }    

    return ParameterizeResponse(true, jsonResponse);
}

const refactorLaravelError = (errorObject: object): object=>{
    let ret = {};
    Object.entries(errorObject).map(kv => {
        if(typeof kv[1] != 'object')
            ret[kv[0]] = kv[1];
        else
            ret[kv[0]] = Object.values(kv[1]).toString();
    });
    return ret;
}

export const setAuthToken = async (token:string, type:string, expiresSeconds: number ): Promise<void> =>{
    cookies().set(COOKIE_TOKEN_NAME, `${type} ${token}`, {maxAge: expiresSeconds})
}

export const destroyAuthToken = (): void => {
    cookies().delete(COOKIE_TOKEN_NAME);
}

export const getAuthToken = async (): Promise<string | null> => {
    return cookies().has(COOKIE_TOKEN_NAME) ? cookies().get(COOKIE_TOKEN_NAME).value : null;
}


export interface ParameterizedResponse {
    success: boolean;
    data: object;
    errors: object;
}

export function ParameterizeResponse(success: boolean,  data: object): Partial<ParameterizedResponse>{
    data = data? data : {};
    let ret: Partial<ParameterizedResponse> = {"success": success};
    if(success)
        ret.data = data;
    else    
        ret.errors = data;
    return ret;
}