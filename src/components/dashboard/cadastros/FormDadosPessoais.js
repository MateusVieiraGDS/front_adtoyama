
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
        sexo: '',
        cpf: '',
        rg: '',
        rgUf: '',
        estado: '',
        cidade: '',
        nomeMae: '',
        nomePai: '',
        imageFile34: null,
        imageFileDoc: null,
        imageFileNasc: null,
        imageFileCas: null,
        imageFileDiv: null,
        imageFileObt: null
    });

    useEffect(() => {
        setData(dataForm);
        setValueState(states[dataForm.estado]);
    }, [dataForm]);

    const [states, setStates] = useState([]);
    const [valueState, setValueState] = useState(null);
    const [StatesAndCities, setStatesAndCities] = useState([]);
    const [SelectedState, setSelectedState] = useState(null);
    const [estadosCivis, setEstadosCivis] = useState(['Solteiro', 'Casado', 'Divorciado', 'Viuvo']);

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
        })();
    }, []);


    const handleStateChange = (e, o) => {
        setSelectedState(o.id);
        setDataForm((prevData) => ({
            ...prevData,
            estado: o.id,
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
    
    const handleChangeImage = (image, key) => {
        setDataForm((prevData) => ({
            ...prevData,
            [key]: image[0]??null,
        }));
    }

    const handleChangeSexo = (e, v) => {
        setDataForm((prevData) => ({
            ...prevData,
            sexo: v,
        }));
    };

    const handleChangeEstadoCivil = (e, v) => {
        let obj = {};
        switch(v) {
            case 'Casado':
                obj = {
                    imageFileDiv: null,
                    imageFileObt: null
                }
            break;
            case 'Divorciado':
                obj = {imageFileObt: null}
            break;
            case 'Viuvo':
                obj = {imageFileDiv: null}
            break;
            default:
                obj = {
                    imageFileCas: null,
                    imageFileDiv: null,
                    imageFileObt: null
                }
            break;
        }
        setDataForm((prevData) => ({
            ...prevData,
            estadoCivil: v,
            ...obj
        }));
    };

    return ( 
        <Grow in={true} direction="left">
            <FormControl sx={{width: '100%'}}>
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
                            options={Object.keys(states)}
                            sx={{ width: '100%' }}
                            onChange={handleChangeRgUf}
                            value={dataForm.rgUf}
                            renderInput={(params) => <TextField {...params} label="UF Emissor" fullWidth name="rgUf"/>}                        
                            />
                        </Grid> 
                        <Grid item xs={6} md={2}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                                <DatePicker required sx={{ width: '100%' }} label="Data de Nascimento" onChange={handleDatePickOnChange} name="dataNasc" value={dayjs(dataForm.dataNasc, 'DD/MM/YYYY')} maxDate={dayjs()}/>
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
                            options={Object.values(states)}
                            sx={{ width: '100%' }}
                            onChange={handleStateChange}
                            value={valueState}
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
                        <Grid item md={8} xs={12}>
                            <FormLabel id="demo-row-radio-buttons-group-label">Foto 3x4</FormLabel>
                            <ImagemCropUplaod initialAspectRatio={3/4} images={dataForm.imageFile34 != null ? [dataForm.imageFile34] : []} setImages={ img => handleChangeImage(img, 'imageFile34')}/>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography variant="span" gutterBottom>
                                Estado Civil
                            </Typography>
                        </Grid>
                        <Grid item xs={4} md={2}>
                            <Autocomplete
                            required
                            disablePortal
                            id="combo-box-demo"
                            options={estadosCivis}
                            sx={{ width: '100%' }}
                            onChange={handleChangeEstadoCivil}
                            value={dataForm.estadoCivil}
                            renderInput={(params) => <TextField {...params} label="Estado Civil" fullWidth name="estadoCivil"value={dataForm.estadoCivil}/>}                        
                            />
                        </Grid>
                        <Grid item xs={5}/>
                        {[null, undefined, '', 'Solteiro'].includes(dataForm.estadoCivil) == false &&
                            <Grid item md={8} xs={12}>
                                <FormLabel id="demo-row-radio-buttons-group-label">Foto da Certidão de Casamento</FormLabel>
                                <ImagemCropUplaod images={dataForm.imageFileCas != null ? [dataForm.imageFileCas] : []} setImages={ img => handleChangeImage(img, 'imageFileCas')}/>
                            </Grid>
                        }
                        {dataForm.estadoCivil == 'Divorciado' &&
                            <Grid item md={8} xs={12}>
                                <FormLabel id="demo-row-radio-buttons-group-label">Foto da Certidão de Divórcio</FormLabel>
                                <ImagemCropUplaod images={dataForm.imageFileDiv != null ? [dataForm.imageFileDiv] : []} setImages={ img => handleChangeImage(img, 'imageFileDiv')}/>
                            </Grid>
                        }
                        {dataForm.estadoCivil == 'Viuvo' &&
                            <Grid item md={8} xs={12}>
                                <FormLabel id="demo-row-radio-buttons-group-label">Foto da Certidão de Óbito</FormLabel>
                                <ImagemCropUplaod images={dataForm.imageFileObt != null ? [dataForm.imageFileObt] : []} setImages={ img => handleChangeImage(img, 'imageFileObt')}/>
                            </Grid>
                        }                        
                        <Grid item md={8} xs={12}>
                            <FormLabel id="demo-row-radio-buttons-group-label">Foto do Documento (Identidade ou CNH)</FormLabel>
                            <ImagemCropUplaod images={dataForm.imageFileDoc != null ? [dataForm.imageFileDoc] : []} setImages={ img => handleChangeImage(img, 'imageFileDoc')}/>
                        </Grid>
                        <Grid item md={8} xs={12}>
                            <FormLabel id="demo-row-radio-buttons-group-label">Foto da Certidão de Nascimento</FormLabel>
                            <ImagemCropUplaod images={dataForm.imageFileNasc != null ? [dataForm.imageFileNasc] : []} setImages={ img => handleChangeImage(img, 'imageFileNasc')}/>
                        </Grid>
                    </Grid> 
            </FormControl>
        </Grow>
     );
}