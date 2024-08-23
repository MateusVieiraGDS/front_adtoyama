'use server'

import { ParameterizeResponse, ParameterizedResponse, fetchApi } from "./LaravelApiService";


export async function sa_uploadCadastro(data: FormData): Promise<Partial<ParameterizedResponse>> {
    const newFormData = new FormData();
    data.forEach((value, key) => {
        const newKey = key.replace(/ARRAY\[(\d+)\]/g, 'ARRAY_$1');
        newFormData.append(newKey, value);
    });
    data = newFormData;

    let response = await fetchApi(
        '/NovoCadastro',
        {
            body: data,
            cache: 'no-store',
            method: 'POST'
        },
        false
    );
    
    if (response.success){     
        return ParameterizeResponse(true, response.data);
    }
    if(response.errors['ServerError'])        
        return ParameterizeResponse(false, {"ServerError": "Desculpe! Não foi possível realizar o cadastro, tente mais tarde."});
    return response;    
}