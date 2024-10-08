import { Autocomplete, FormControl, Grid, Grow, Slide, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { sa_getStateAndCities } from "../../../app/actions/helpers";
import ReactInputMask from "react-input-mask";
import MyValidator from "../../../helpers/MyValidator";

export default function FormEnderecoContato({data, setData}) {
    const [dataForm, setDataForm] = useState(data ?? {
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        uf: '',
        complemento: '',
        cep: '',
        email: '',
        telefone: '',
        inexistentCep: false
    });

    const [valueState, setValueState] = useState(null);
    const [valueCity, setValueCity] = useState(null);
    const [StatesAndCities, setStatesAndCities] = useState([]);
    const [states, setStates] = useState([]);
    const [SelectedState, setSelectedState] = useState(null);
    const [addressFound, setAddressFound] = useState(false);

    useEffect(() => {
        setData(dataForm);
    }, [dataForm]);

    useEffect(() => {        
        (async ()=>{
            let response = await sa_getStateAndCities(); 
            let temp_states = [];
            let states = [];
            response.data.map((st => {
                states[st.uf] = {'label': st.name, 'id': st.uf};
                temp_states[st.uf] = st['cities'].map(ct => ({'label': ct.name, 'id': ct.id}));
            }))
            setStates(states);
            setStatesAndCities(temp_states);
            if(dataForm.estado != '' && dataForm.estado != null){
                setSelectedState(dataForm.estado);
                setValueState(states[dataForm.estado]);
            }
            if(dataForm.cidade != '' && dataForm.cidade != null)
                setValueCity(temp_states[dataForm.estado].find(ct => ct.id == dataForm.cidade));
        })();
    }, []);

    const handleOnChange = (e) => {
        const {name, value} = e.target;        
        setDataForm((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleStateChange = (e, o) => {
        setSelectedState(o.id);
        setValueState(o);
        setDataForm((prevData) => ({
            ...prevData,
            uf: o.id,
        }));
    }

    const handleChangeCidade= (e, o) => {
        setValueCity(o);
        setDataForm((prevData) => ({
            ...prevData,
            cidade: o.id,
        }));
    }


    const handleSearchAddressByCep = async (cep) => {
        let response = await fetch(
            `https://viacep.com.br/ws/${cep}/json`,
            {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );  
        let responseData = null;     
        if(response.ok){
            responseData = await response.json(); 
            if(responseData.erro)
                responseData = null;
        }
        
        if(responseData != null){            
            setSelectedState(responseData.uf);
            setValueState(states[responseData.uf]);
            let city = StatesAndCities[responseData.uf].find(ct => ct.label == responseData.localidade);
            setValueCity(city);

            setDataForm((prevData) => ({
                ...prevData,
                rua: responseData.logradouro,            
                bairro: responseData.bairro,
                cidade: city.id,
                uf: responseData.uf,
                inexistentCep: false
            }));
        }
        else
            setDataForm((prevData) => ({
                ...prevData,
                inexistentCep: true
            }));
        setAddressFound(true);
    }

    const handleOnChangeCep = (e) => {
        const value = e.target.value;
        const valueNumber = value.replace(/\D/g, '')
        if(valueNumber.length == 8){
            handleSearchAddressByCep(valueNumber);
        }
        else{            
            if(addressFound){            
                setDataForm((prevData) => ({
                    ...prevData,
                    ...{
                        rua: '',                    
                        bairro: '',
                        cidade: '',
                        uf: ''
                    }
                }));
                setSelectedState(null);
                setAddressFound(false);
                setDataForm((prevData) => ({
                    ...prevData,
                    inexistentCep: false
                }));
            }
        }
        setDataForm((prevData) => ({
            ...prevData,
            cep: value,
        }));
    };


    return ( 
        <Grow in={true} direction="left">
            <FormControl>
                    <Grid container spacing={2} columns={11}>                        
                        <Grid item xs={12} md={12}>
                            <Typography variant="span" gutterBottom>
                                Insira o CEP
                            </Typography>
                        </Grid>
                        <Grid item xs={8} md={3}>
                            <TextField 
                                helperText={dataForm.inexistentCep && 'CEP não localizado, preencha o endereço manualmente ou verifique o cep!'}
                                error={dataForm.inexistentCep}
                                required name="cep" onChange={handleOnChangeCep} value={dataForm.cep} fullWidth id="outlined-basic" label="CEP" variant="outlined" InputProps={{
                                inputComponent: ReactInputMask,
                                inputProps: { mask: '99999-999' },
                            }}/>
                        </Grid>                                                      
                        <Grid item xs={8} md={5}>
                            <TextField required id="outlined-basic" label="Rua" variant="outlined"fullWidth name="rua" onChange={handleOnChange} value={dataForm.rua} disabled={!dataForm.inexistentCep}/>
                        </Grid>
                        <Grid item xs={8} md={2}>
                            <TextField required id="outlined-basic" label="Numero" variant="outlined"fullWidth name="numero" onChange={handleOnChange} value={dataForm.numero}/>
                        </Grid>
                        <Grid item xs={8} md={4}>
                            <TextField required id="outlined-basic" label="Bairro" variant="outlined"fullWidth name="bairro" onChange={handleOnChange} value={dataForm.bairro} disabled={!dataForm.inexistentCep}/>
                        </Grid>                                
                        <Grid item xs={8} md={5}>
                            <TextField required id="outlined-basic" label="Complemento" variant="outlined"fullWidth name="complemento" onChange={handleOnChange} value={dataForm.complemento}/>
                        </Grid>
                        <Grid item xs={4} md={2}>
                            <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={Object.values(states)}
                            sx={{ width: '100%' }}
                            onChange={handleStateChange}
                            value={valueState}
                            disabled={!dataForm.inexistentCep}
                            required
                            renderInput={(params) => <TextField {...params} label="Estado" fullWidth name="estado"value={dataForm.estado}/>}                        
                            />
                        </Grid>
                        <Grid item xs={8} md={4}>
                            <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={SelectedState != null ? StatesAndCities[SelectedState] : []}                        
                            sx={{ width: '100%' }}
                            value={valueCity}
                            onChange={handleChangeCidade}  
                            disabled={!dataForm.inexistentCep}
                            required                          
                            renderInput={(params) => <TextField {...params} label="Cidade" fullWidth name="cidade"value={dataForm.cidade}/>}
                            noOptionsText={"Selecione o Estado"}            
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography variant="span" gutterBottom>
                                Contato
                            </Typography>
                        </Grid>
                        <Grid item xs={8} md={6}>
                            <TextField required id="outlined-basic" label="Email" variant="outlined"fullWidth name="email" onChange={handleOnChange} value={dataForm.email}/>
                        </Grid>                                
                        <Grid item xs={8} md={3}>
                            <TextField 
                                required name="telefone" onChange={handleOnChange} value={dataForm.telefone} fullWidth id="outlined-basic" label="Celular/Telefone" variant="outlined" InputProps={{
                                inputComponent: ReactInputMask,
                                inputProps: { mask: '(99) 9 9999-9999' },
                            }}/>
                        </Grid>    
                    </Grid> 
            </FormControl>
        </Grow>
     );
}
