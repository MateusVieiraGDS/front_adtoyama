'use server'

import { redirect } from "next/navigation";
import { ParameterizeResponse, ParameterizedResponse, destroyAuthToken, fetchApi, setAuthToken } from "./LaravelApiService";

export async function sa_signin(data:FormData): Promise<Partial<ParameterizedResponse>> {
    let e = data.get('email');
    let p = data.get('password');

    if(e == null || p == null)
        return ParameterizeResponse(false, {"email": "E-mail Obrigatório.", "password": "Senha Obrigatória."});

    let response = await fetchApi(
        '/login',
        {
            body: JSON.stringify({"email": e, "password": p}),
            cache: 'no-store',
            method: 'POST'
        }
    );
    if (response.success){
        setAuthToken(response.data['access_token'], response.data['token_type'], response.data['expires_in']);
        return ParameterizeResponse(true, null);
    }

    if(response.errors['ServerError'])        
        return ParameterizeResponse(false, {"ServerError": "Desculpe! Não foi possível realizar o login, tente mais tarde."});
    return response;
}

export async function sa_getUser(): Promise<Partial<ParameterizedResponse>> {
    let response = await fetchApi('/me', {cache: 'no-store'});
    if (response.success){        
        return ParameterizeResponse(true, response.data);
    }
    if(response.errors['ServerError'])        
        return ParameterizeResponse(false, {"ServerError": "Desculpe! Não foi possível solicitar os dados, tente mais tarde."});
    return response;
}

export async function sa_signout(): Promise<void> {
    await fetchApi('/logout', {cache: 'no-store'});
    destroyAuthToken();
    redirect('/signin');
}

export async function sa_sendForgoutCodeToEmail(email): Promise<Partial<ParameterizedResponse>> {
    let response = await fetchApi(
        '/sendForgoutCodeToEmail',
        {
            body: JSON.stringify({"email": email}),
            cache: 'no-store',
            method: 'POST'
        }
    );
    if (response.success){
        return ParameterizeResponse(true, null);
    }

    if(response.errors['ServerError'])        
        return ParameterizeResponse(false, {"ServerError": "Desculpe! Não foi possível realizar o login, tente mais tarde."});
    return response;
}

export async function sa_validForgoutCode(data): Promise<Partial<ParameterizedResponse>> {
    let e = data['email'];
    let c = data['code'];

    let response = await fetchApi(
        '/validForgoutCode',
        {
            body: JSON.stringify({"email": e, "code": c}),
            cache: 'no-store',
            method: 'POST'
        }
    );
    if (response.success){
        return ParameterizeResponse(true, response.data);
    }

    if(response.errors['ServerError'])        
        return ParameterizeResponse(false, {"ServerError": "Desculpe! Não foi possível realizar o login, tente mais tarde."});
    return response;
}

export async function sa_resetPassword(data): Promise<Partial<ParameterizedResponse>> {
    let tk = data['password_token'];
    let npwd = data['new_password'];
    let cpwd = data['confirm_password'];

    let response = await fetchApi(
        '/resetPassword',
        {
            body: JSON.stringify({
                "password_token": tk, 
                "new_password": npwd,
                "confirm_password" : cpwd
            }),
            cache: 'no-store',
            method: 'PUT'
        }
    );
    if (response.success){
        return ParameterizeResponse(true, null);
    }

    if(response.errors['ServerError'])        
        return ParameterizeResponse(false, {"ServerError": "Desculpe! Não foi possível realizar o login, tente mais tarde."});
    return response;
}