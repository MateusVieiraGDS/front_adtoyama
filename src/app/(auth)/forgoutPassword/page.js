'use client'

import { SendEmailCode } from '../../../components/Auth/SendEmailCode.js';
import { Alert, Box, Button, CircularProgress, FormControl, FormHelperText, Grid, Paper, Stack, TextField, Typography } from '@mui/material';

import { useRouter } from "next/navigation";
import { useState } from "react";

import style from '../../../styles/auth/forgout.pwd.module.css';
import Image from 'next/image.js';

import { resetPassword, sendForgoutCodeToEmail, validForgoutCode } from "../../../components/Auth/AuthProvider";

export default function SigninPage({intercepted = false}) {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [awaitAttempt, setAwaitAttempt] = useState(0);  
    const [cronometerRunning, setCronometerRunning] = useState(false);
    const [nowStep, setNowStep] = useState(0);
    const [email, setEmail] = useState('');
    const [emailConfirmed, setEmailConfirmed] = useState(false);
    const [code, setCode] = useState('');
    const [expired, setExpired] = useState(false);

    const [resetPayload, setResetPayload] = useState({
        "password_token": null, 
        "new_password": '',
        "confirm_password" : ''
    });

    
    const hasError = (errorName = null) => {
        if(errorName)
            return errors != null && errors[errorName] != null;
        return errors != null;
    };    

    const cronometerAwaitAttempt = (step, init = false) =>{
        if(step > 0){            
            if(!init)
                setAwaitAttempt(step - 1);
            setTimeout(() => {cronometerAwaitAttempt(step - 1);}, 1000);
        }else
            setCronometerRunning(false);
    }

    function handleSend(){
        if(awaitAttempt > 0) return;
        setLoading(true);     
        setTimeout(()=>{
            (async ()=>{

                let response = await sendForgoutCodeToEmail(email);
                if(response.success){
                    setLoading(false);
                    if(emailConfirmed == false)
                        nextStep();
                    setEmailConfirmed(true);
                    setExpired(false);
                }
                else{
                    setEmailConfirmed(false);
                    setErrors(response.errors);
                    setLoading(false);
                    if(response.errors?.awaitAttempt){
                        setAwaitAttempt(response.errors.awaitAttempt);
                        if(cronometerRunning == false)
                            cronometerAwaitAttempt(response.errors.awaitAttempt, true);
                    }
                }
            })();
        }, 1);
    };

    function handleVerifyCode(c, e){
        if(awaitAttempt > 0) return;
        setLoading(true);     
        setTimeout(()=>{
            (async ()=>{
                let payload = {'email': e, 'code': c};
                let response = await validForgoutCode(payload);
                if(response.success){
                    setResetPayload(p => ({...p, password_token: response.data.password_token}));
                    setLoading(false);
                    nextStep();
                }
                else{
                    setCode('');
                    setErrors(response.errors);
                    setLoading(false);
                    if(response.errors?.awaitAttempt){
                        setAwaitAttempt(response.errors.awaitAttempt);
                        if(cronometerRunning == false)
                            cronometerAwaitAttempt(response.errors.awaitAttempt, true);
                    }
                }
            })();
        }, 1);
    }

    function handleResetPassword(c, e){
        if(awaitAttempt > 0) return;
        setLoading(true);     
        setTimeout(()=>{
            (async ()=>{
                let response = await resetPassword(resetPayload);
                if(response.success){
                    setLoading(false);
                    nextStep();
                }
                else{                    
                    if(response.errors.code != undefined){
                        resetForgoutPasswordSteps();
                    }
                    setErrors(response.errors);
                    setLoading(false);
                    if(response.errors?.awaitAttempt){
                        setAwaitAttempt(response.errors.awaitAttempt);
                        if(cronometerRunning == false)
                            cronometerAwaitAttempt(response.errors.awaitAttempt, true);
                    }
                }
            })();
        }, 1);
    }

    function nextStep(){
        setNowStep(s => s + 1);
    }

    function forwardStep(){
        let s = nowStep;
        if(s <= 1){
            s = 0;
            setEmailConfirmed(false);
        }else
            s--;
        setNowStep(s);
    }

    function handleCancel(){
        router.push('/signin');
    }

    function handleSetEmail(event){
        setEmail(event.target.value);        
    }

    function handleCode(event){        
        if(event.target.value.length >= 6){
            event.target.blur();
            handleVerifyCode(event.target.value, email);
        }
        setCode(event.target.value);
    }

    function handlePassword(event){
        let obj = {};
        obj[event.target.name] = event.target.value
        setResetPayload(p => ({...p, ...obj}));
    }

    function resetForgoutPasswordSteps(){
        setEmailConfirmed(false);
        setCode('');
        setEmail('');
        setErrors(null);
        setResetPayload({
            "password_token": null, 
            "new_password": '',
            "confirm_password" : ''
        });
        setNowStep(0);
        setExpired(true);
    }

    return ( 
        <>
            <Stack justifyContent="center" alignItems='center' flex={1} sx={{height: '100vh'}} className={style.body_login}>
                <Paper elevation={3}>  
                    <Stack justifyContent="center" alignItems='center' sx={{width: '20em', height: '20em', marginBottom:'6em'}}>                           
                            {nowStep == 0 &&                
                        <FormControl sx={{width: '15em'}}>
                            <form>
                                <Grid container spacing={2}>
                                    <Grid xs={12} item >
                                        <Stack justifyContent="center" alignItems='center'>
                                            <Box className={style.ad_logo}>
                                                <Image src='/ad.jpg' width={100} height={100} alt='AD Toyama'></Image>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} item >
                                        <Typography textAlign='center'>Para realizar a recuperação de senha, insira seu e-mail cadastrado abaixo.</Typography>
                                    </Grid>
                                    <Grid xs={12} item >
                                        <TextField label="email" required type='email' variant="filled" name="email" disabled={loading} fullWidth error={hasError('email')} helperText={errors?.email} onChange={handleSetEmail} value={email}/>
                                    </Grid>
                                    <Grid xs={12} item>                                        
                                        <Button variant="contained" disabled={loading||awaitAttempt > 0} fullWidth onClick={handleSend}>
                                            {loading? (<CircularProgress color="secondary"/> ): "Prosseguir"}
                                        </Button>
                                        {errors?.ServerErro && <FormHelperText error>{errors.ServerErro}</FormHelperText>}
                                        {awaitAttempt>0 && <FormHelperText error>Tentativas excedidas! Tente novamente em {awaitAttempt} segundo{awaitAttempt>1 && 's'}.</FormHelperText>}
                                    </Grid>
                                    <Grid xs={12} item>                                        
                                        <Button variant="outlined" disabled={loading} color='error' fullWidth >
                                            Voltar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>    
                        </FormControl> 
                    }
                    {nowStep == 1 &&
                        <FormControl sx={{width: '15em'}}>
                            <form>
                                <Grid container spacing={2}>
                                    <Grid xs={12} item >
                                        <Stack justifyContent="center" alignItems='center'>
                                            <Box className={style.ad_logo}>
                                                <Image src='/ad.jpg' width={100} height={100} alt='AD Toyama'></Image>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} item >
                                        <Typography textAlign='center'>Ótimo! Achamos seu email <b>{email}</b></Typography>                                
                                    </Grid>
                                    <Grid xs={12} item >
                                        <Typography textAlign='center'>Agora, digite abaixo o código que enviamos para ele.</Typography>
                                    </Grid>
                                    <Grid xs={12} item >
                                        <div className={style.input_code}>  
                                            <label>
                                                <input type="text" value={code} onChange={handleCode} maxLength='6' placeholder="000000"/>
                                            </label>                                                                          
                                            {errors?.code && <FormHelperText error sx={{textAlign: 'center'}}>{errors.code}</FormHelperText>}                                                                                                                                  
                                            {errors?.ServerErro && <FormHelperText error sx={{textAlign: 'center'}}>{errors.ServerErro}</FormHelperText>}
                                            {awaitAttempt>0 && <FormHelperText error sx={{textAlign: 'center'}}>Vou esperar um pouco enquanto você procura o código! Tente novamente em {awaitAttempt} segundo{awaitAttempt>1 && 's'}.</FormHelperText>}
                                        </div>                                
                                    </Grid>                                
                                    <Grid xs={12} item>                                        
                                        <Button variant="outlined" disabled={loading||awaitAttempt > 0}fullWidth onClick={handleSend}>
                                            {loading? (<CircularProgress color="secondary"/> ): "Enviar novamente"}
                                        </Button>                                                                
                                    </Grid>
                                    <Grid xs={12} item>                                        
                                        <Button variant="outlined" disabled={loading} color='error' fullWidth onClick={forwardStep}>
                                            Voltar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>    
                        </FormControl> 
                    }
                    {nowStep == 2 &&
                        <FormControl sx={{width: '15em'}}>
                            <form>
                                <Grid container spacing={2}>
                                    <Grid xs={12} item >
                                        <Stack justifyContent="center" alignItems='center'>
                                            <Box className={style.ad_logo}>
                                                <Image src='/ad.jpg' width={100} height={100} alt='AD Toyama'></Image>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} item >
                                        <Typography textAlign='center'>Tudo certo! Agora é só definir sua nova senha</Typography>                                
                                    </Grid>
                                    <Grid xs={12} item>
                                        <TextField label="Nova senha" required type="password" variant="filled" name="new_password" value={resetPayload.new_password} onChange={handlePassword} disabled={loading} fullWidth error={hasError('new_password')} helperText={errors?.new_password}/>
                                    </Grid>
                                    <Grid xs={12} item>
                                        <TextField label="Confirme a senha" required type="password" variant="filled" name="confirm_password" value={resetPayload.confirm_password} onChange={handlePassword} disabled={loading} fullWidth error={hasError('confirm_password')} helperText={errors?.confirm_password}/>
                                    </Grid>
                                        {errors?.ServerErro && <FormHelperText error>{errors.ServerErro}</FormHelperText>}
                                        {awaitAttempt>0 && <FormHelperText error>Vou esperar um pouco enquanto você procura o código! Tente novamente em {awaitAttempt} segundo{awaitAttempt>1 && 's'}.</FormHelperText>}
                                    <Grid xs={12} item>                                        
                                        <Button variant="outlined" disabled={loading||awaitAttempt > 0}fullWidth onClick={handleResetPassword}>
                                            {loading? (<CircularProgress color="secondary"/> ): "Redefinir Senha"}
                                        </Button>
                                    </Grid>
                                    <Grid xs={12} item>                                        
                                        <Button variant="outlined" disabled={loading} color='error' fullWidth onClick={handleCancel}>
                                            Cancelar Alteração
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>    
                        </FormControl> 
                    }   
                    {nowStep == 3 &&
                        <FormControl sx={{width: '15em'}}>
                            <form>
                                <Grid container spacing={2}>
                                    <Grid xs={12} item >
                                        <Stack justifyContent="center" alignItems='center'>
                                            <Box className={style.ad_logo}>
                                                <Image src='/ad.jpg' width={100} height={100} alt='AD Toyama'></Image>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} item >
                                        <Typography textAlign='center'>Muito bem! Senha redefinida com sucesso!</Typography>                                
                                    </Grid>
                                    <Grid xs={12} item>                                        
                                        <Button variant="outlined" disabled={loading||awaitAttempt > 0}fullWidth onClick={handleCancel}>
                                            Ir para login
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>    
                        </FormControl> 
                    }                 
                    </Stack>
                    {expired &&
                        <Stack textAlign='center' sx={{width: '20em'}}>
                            <Alert severity="error" sx={{display: 'flex', justifyContent: 'center'}}>A sessão anterior de redefinição de senha foi expirada, realize o processo novamente!</Alert>
                        </Stack>
                    }
                </Paper>
            </Stack>
        </>
     );
}
