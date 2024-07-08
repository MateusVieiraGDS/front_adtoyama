'use server'

import { ParameterizeResponse, ParameterizedResponse, fetchApi } from "./LaravelApiService";


export async function sa_uploadCadastro(data: FormData): Promise<Partial<ParameterizedResponse>> {
    //console.log(data);
    let response = await fetchApi(
        '/NovoCadastro',
        {
            body: data,
            cache: 'no-store',
            method: 'POST'
        }
    );
    
    if (response.success){ 
        console.log(response);       
        return ParameterizeResponse(true, null);
    }
    console.log(response);
    if(response.errors['ServerError'])        
        return ParameterizeResponse(false, {"ServerError": "Desculpe! Não foi possível realizar o login, tente mais tarde."});
    
}