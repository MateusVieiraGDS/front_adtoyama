'use server'

import { ParameterizeResponse, ParameterizedResponse, fetchApi } from "./LaravelApiService";

export async function sa_getStateAndCities(): Promise<Partial<ParameterizedResponse>> {
    let response = await fetchApi('/StateAndCities', { method: 'GET', cache: 'no-cache'});
    if (response.success){        
        return ParameterizeResponse(true, response.data);
    }

    if(response.errors['ServerError'])        
        return ParameterizeResponse(false, {"ServerError": "Erro ao recuperar os estados com suas cidades."});
    return response;
}


export async function sa_getCongregacoes(): Promise<Partial<ParameterizedResponse>> {
    let response = await fetchApi('/Congregacoes', { method: 'GET'});
    if (response.success){        
        return ParameterizeResponse(true, response.data);
    }

    if(response.errors['ServerError'])        
        return ParameterizeResponse(false, {"ServerError": "Erro ao recuperar os estados com suas cidades."});
    return response;
}

export async function sa_getCargos(): Promise<Partial<ParameterizedResponse>> {
    let response = await fetchApi('/Cargos', { method: 'GET'});
    if (response.success){        
        return ParameterizeResponse(true, response.data);
    }

    if(response.errors['ServerError'])        
        return ParameterizeResponse(false, {"ServerError": "Erro ao recuperar os estados com suas cidades."});
    return response;
}

export async function sa_getGrupos(): Promise<Partial<ParameterizedResponse>> {
    let response = await fetchApi('/Grupos', { method: 'GET'});
    if (response.success){        
        return ParameterizeResponse(true, response.data);
    }

    if(response.errors['ServerError'])        
        return ParameterizeResponse(false, {"ServerError": "Erro ao recuperar os estados com suas cidades."});
    return response;
}