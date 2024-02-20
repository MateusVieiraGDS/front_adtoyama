'use client'

import { useRouter } from 'next/navigation.js';
import { signin } from '../../../components/Auth/AuthProvider.js';
import { useContext, useState } from 'react';
import { useFormState } from 'react-dom';
import { Alert, Avatar, Box, Button, Card, CircularProgress, FormControl, FormHelperText, Grid, Paper, Stack, TextField, Typography } from '@mui/material';

import style from '../../../styles/auth/signin.module.css';
import Link from 'next/link.js';
import Image from 'next/image.js';

export default function SigninPage({intercepted = false}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [awaitAttempt, setAwaitAttempt] = useState(0);  
    const [cronometerRunning, setCronometerRunning] = useState(false);
    
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

    function handleSigin(data){
        if(awaitAttempt > 0) return;
        setLoading(true);     
        setTimeout(()=>{
            (async ()=>{
                let response = await signin(data);
                if(response.success){
                    if(intercepted)
                        router.refresh();
                    else
                        router.push('/dashboard');
                }
                else{
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
    

    async function handleForgout(){
        router.push('/forgoutPassword');
    }

    return ( 
        <>
            <Stack justifyContent="center" alignItems='center' flex={1} sx={{height: '100vh'}} className={style.body_login}>
                <Paper elevation={3}>                             
                    <Stack justifyContent="center" alignItems='center' sx={{width: '20em', height: '20em', marginBottom:'6em'}}>                                                              
                        <FormControl sx={{width: '15em'}}>
                            <form action={handleSigin}>
                                <Grid container spacing={2}>
                                    <Grid xs={12} item >
                                        <Stack justifyContent="center" alignItems='center'>
                                            <Box className={style.ad_logo}>
                                                <Image src='/ad.jpg' width={100} height={100} alt='AD Toyama'></Image>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} item >
                                        <Typography textAlign='center'>Autenticação ADToyma</Typography>
                                    </Grid>
                                    <Grid xs={12} item >
                                        <TextField label="email" required type='email' variant="filled" name="email" disabled={loading} fullWidth error={hasError('email')} helperText={errors?.email}/>
                                    </Grid>
                                    <Grid xs={12} item>
                                        <TextField label="senha" required type="password" variant="filled" name="password" disabled={loading} fullWidth error={hasError('password')} helperText={errors?.password}/>
                                    </Grid>
                                    <Grid xs={12} item>                                        
                                        <Button variant="contained" disabled={loading||awaitAttempt > 0} type='submit' fullWidth>
                                            {loading? (<CircularProgress color="secondary"/> ): "Entrar"}
                                        </Button>
                                        {errors?.ServerErro && <FormHelperText error>{errors.ServerErro}</FormHelperText>}
                                        {awaitAttempt>0 && <FormHelperText error>Tentativas excedidas! Tente novamente em {awaitAttempt} segundo{awaitAttempt>1 && 's'}.</FormHelperText>}
                                    </Grid>
                                    <Grid xs={12} item>                                        
                                        <Button variant="outlined" disabled={loading} color='error' fullWidth onClick={handleForgout}>
                                            Esqueci a senha
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>    
                        </FormControl> 
                    </Stack>  
                    {intercepted &&
                            <Stack textAlign='center'>
                                <Alert severity="warning" sx={{display: 'flex', justifyContent: 'center'}}>Faça Login para continuar !</Alert>
                            </Stack>
                    }
                </Paper>
            </Stack>
        </>
     );
}
