
import { Autocomplete, Divider, FormControl, FormControlLabel, FormLabel, Grid, Grow, InputLabel, MenuItem, Radio, RadioGroup, Select, Slide, TextField, Typography, createTheme } from "@mui/material";
import { DatePicker, LocalizationProvider, ptBR } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { sa_getStateAndCities } from "../../../app/actions/helpers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import ImagemCropUplaod from '../../../components/helpers/ImagemCropUplaod';
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';

const dateThem = createTheme({
    ptBR,
});

const UFs = [];

export default function FormDadosPessoais({ data, setData}) {
    const [dataForm, setDataForm] = useState(data ?? {
        nome: '',
        dataNasc: '',
        cpf: '',
        rg: '',
        rgUf: '',
        estado: '',
        cidade: '',
        nomeMae: '',
        nomePai: '',
        imageFileDoc: null,
        imageFileNasc: null
    });

    useEffect(() => {
        setData(dataForm);
    }, [dataForm]);

    const [StatesAndCities, setStatesAndCities] = useState([]);
    const [SelectedState, setSelectedState] = useState(null);

    useEffect(() => {        
        (async ()=>{
            let response = await sa_getStateAndCities(); 
            let temp_states = [];
            console.log(response);
            response.data.map((st => {
                temp_states[st.uf] = st['cities'].map(ct => ct.name);
            }))
            setStatesAndCities(temp_states);
            if(dataForm.estado != '' && dataForm.estado != null)
                setSelectedState(dataForm.estado);
        })();
    }, []);


    const handleStateChange = (e, o) => {
        setSelectedState(o);
        setDataForm((prevData) => ({
            ...prevData,
            estado: o,
        }));
    }

    const handleOnChange = (e) => {
        const {name, value} = e.target;

        setDataForm((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleDatePickOnChange = (e) => {
        setDataForm((prevData) => ({
            ...prevData,
            ['dataNasc']: e.format('DD/MM/YYYY'),
        }));
    }

    const handleChangeRgUf = (e, o) => {
        setDataForm((prevData) => ({
            ...prevData,
            rgUf: o,
        }));
    }

    const handleChangeCidade= (e, o) => {
        setDataForm((prevData) => ({
            ...prevData,
            cidade: o,
        }));
    }

    const handleChangeImageDoc= (image) => {
        setDataForm((prevData) => ({
            ...prevData,
            imageFileDoc: image[0]??null,
        }));
    } 

    const handleChangeImageNasc= (image) => {
        setDataForm((prevData) => ({
            ...prevData,
            imageFileNasc: image[0]??null,
        }));
    } 

    const handleChangeSexo = (e, v) => {
        setDataForm((prevData) => ({
            ...prevData,
            sexo: v,
        }));
    };

    return ( 
        <Grow in={true} direction="left">
            <FormControl>
                    <Grid container spacing={2} columns={11}>
                        <Grid item xs={12} md={12}>
                            <Typography variant="span" gutterBottom>
                                Documentos
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField required id="outlined-basic" label="Nome" variant="outlined" fullWidth name="nome" onChange={handleOnChange} value={dataForm.nome}/>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <FormLabel id="demo-row-radio-buttons-group-label">Sexo</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                onChange={handleChangeSexo}
                            >
                                <FormControlLabel value="MASCULINO" control={<Radio />} label="Masculino" />
                                <FormControlLabel value="FEMININO" control={<Radio />} label="Feminino" />
                            </RadioGroup>
                        </Grid>                                                                                                
                        <Grid item xs={8} md={2}>
                            <TextField required name="cpf" onChange={handleOnChange} value={dataForm.cpf} fullWidth id="outlined-basic" label="CPF" variant="outlined" InputProps={{
                                inputComponent: ReactInputMask,
                                inputProps: { mask: '999.999.999-99' },
                            }}/>
                        </Grid>
                        <Grid item xs={8} md={2}>
                            <TextField required id="outlined-basic" label="RG" variant="outlined"fullWidth name="rg" onChange={handleOnChange} value={dataForm.rg}/>
                        </Grid>
                        <Grid item xs={4} md={2}>
                            <Autocomplete
                            required
                            disablePortal
                            id="combo-box-demo"
                            options={Object.keys(StatesAndCities)}
                            sx={{ width: '100%' }}
                            onChange={handleChangeRgUf}
                            value={dataForm.rgUf}
                            renderInput={(params) => <TextField {...params} label="UF Emissor" fullWidth name="rgUf"/>}                        
                            />
                        </Grid> 
                        <Grid item xs={6} md={2}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker required sx={{ width: '100%' }} label="Data de Nascimento" onChange={handleDatePickOnChange} name="dataNasc" value={dayjs(dataForm.dataNasc, 'DD/MM/YYYY')}/>
                            </LocalizationProvider>
                        </Grid>                         
                        <Grid item xs={12} md={5}>
                            <TextField id="outlined-basic" label="Nome da Mãe" variant="outlined" fullWidth name="nomeMae" onChange={handleOnChange} value={dataForm.nomeMae}/>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField id="outlined-basic" label="Nome do Pai" variant="outlined" fullWidth name="nomePai" onChange={handleOnChange} value={dataForm.nomePai}/>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography variant="span" gutterBottom>
                                Naturalidade
                            </Typography>
                        </Grid>
                        <Grid item xs={4} md={2}>
                            <Autocomplete
                            required
                            disablePortal
                            id="combo-box-demo"
                            options={Object.keys(StatesAndCities)}
                            sx={{ width: '100%' }}
                            onChange={handleStateChange}
                            value={dataForm.estado}
                            renderInput={(params) => <TextField {...params} label="Estado" fullWidth name="estado"value={dataForm.estado}/>}                        
                            />
                        </Grid>
                        <Grid item xs={8} md={4}>
                            <Autocomplete
                            required
                            disablePortal
                            id="combo-box-demo"
                            options={SelectedState != null ? StatesAndCities[SelectedState] : []}                        
                            sx={{ width: '100%' }}
                            value={dataForm.cidade}
                            onChange={handleChangeCidade}                            
                            renderInput={(params) => <TextField {...params} label="Cidade" fullWidth name="cidade"value={dataForm.cidade}/>}
                            noOptionsText={"Selecione o Estado"}            
                            />
                        </Grid>
                        <Grid item xs={5}/>
                        <Grid item md={8} xs={12}>
                            <FormLabel id="demo-row-radio-buttons-group-label">Foto do Documento (Identidade ou CNH)</FormLabel>
                            <ImagemCropUplaod images={dataForm.imageFileDoc != null ? [dataForm.imageFileDoc] : []} setImages={handleChangeImageDoc}/>
                        </Grid>
                        <Grid item md={8} xs={12}>
                            <FormLabel id="demo-row-radio-buttons-group-label">Foto da Certidão de Nascimento</FormLabel>
                            <ImagemCropUplaod images={dataForm.imageFileNasc != null ? [dataForm.imageFileNasc] : []} setImages={handleChangeImageNasc}/>
                        </Grid>
                    </Grid> 
            </FormControl>
        </Grow>
     );
}