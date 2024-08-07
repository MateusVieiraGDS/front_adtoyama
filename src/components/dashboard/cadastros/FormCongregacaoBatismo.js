import { Autocomplete, FormControl, FormControlLabel, FormLabel, Grid, Grow, Radio, RadioGroup, Slide, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";
import { DatePicker, LocalizationProvider, ptBR } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ImagemCropUplaod from "../../helpers/ImagemCropUplaod";
import { sa_getCongregacoes, sa_getGrupos } from "../../../app/actions/helpers";
import 'dayjs/locale/pt-br'


export default function FormCongregacaoBatismo({data, setData}) {
    const [dataForm, setDataForm] = useState(data ?? {
        dataBatismo: '',
        localBatismo: '',
        minisAnt: '',
        congregacao: '',
        grupo: '',
        certBatFile: null
    });

    const [rdLocalBatismo, setRdLocalBatismo] = useState(true);
    const [congregacoes, setCongregacoes] = useState([]);
    const [grupos, setGrupos] = useState([]);

    useEffect(() => {
        setData(dataForm);
    }, [dataForm]);

    useEffect(() => {        
        (async ()=>{
            let responseCongregacoes = await sa_getCongregacoes();
            let responseGrupos = await sa_getGrupos();
            setCongregacoes(responseCongregacoes.data.map(m => ({'label': m.nome, 'id': m.id})));
            setGrupos(responseGrupos.data.map(m => ({'label': m.nome, 'id': m.id})));
        })();
    }, []);

    const handleRadioMinisterio = (e, v) => {
        if(v != 'other'){
            setDataForm((prevData) => ({
                ...prevData,
                localBatismo: 'self',
            }));
            setRdLocalBatismo(true);
        }
        else{
            setDataForm((prevData) => ({
                ...prevData,
                localBatismo: '',
            }));
            setRdLocalBatismo(false);
        }
    }

    const handleChangeImage= (image) => {
        setDataForm((prevData) => ({
            ...prevData,
            certBatFile: image[0]??null,
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
            ['dataBatismo']: e.format('DD/MM/YYYY'),
        }));
    }

    const handleChangeCongregacao = (e, o) => {
        setDataForm((prevData) => ({
            ...prevData,
            congregacao: o?.id ?? '',
        }));
    }

    const handleChangeGrupos = (e, o) => {
        setDataForm((prevData) => ({
            ...prevData,
            grupo: o?.id ?? '',
        }));
    }

    return ( 
        <Grow in={true} direction="left">
            <FormControl sx={{width: '100%'}}>
                    <Grid container spacing={2} columns={11} sx={{width: '100%'}}>
                        <Grid item xs={12} md={12}>
                            <Typography variant="span" gutterBottom>
                                Sobre Congregação e Grupo
                            </Typography>
                        </Grid> 
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={congregacoes}
                            sx={{ width: '100%' }}
                            onChange={handleChangeCongregacao}
                            value={congregacoes.length > 0 ? congregacoes.find(c => c.id == dataForm.congregacao) ?? '': ''}
                            renderInput={(params) => <TextField {...params} label="Congregação á se membrar" fullWidth name="congregacao"/>}                        
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={grupos}
                            sx={{ width: '100%' }}
                            onChange={handleChangeGrupos}
                            value={grupos.length > 0 ? grupos.find(c => c.id == dataForm.grupo) ?? '': ''}
                            renderInput={(params) => <TextField {...params} label="Grupo a se unir" fullWidth name="grupo"/>}                        
                            />
                        </Grid>   
                        <Grid item xs={8} md={6}>                            
                            <TextField id="outlined-basic" label="Ministério Anterior (Caso se aplique)" variant="outlined"fullWidth name="minisAnt" onChange={handleOnChange} value={dataForm.minisAnt}/>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography variant="span" gutterBottom>
                                Sobre o Batismo
                            </Typography>
                        </Grid>                       
                        <Grid item xs={6} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                                <DatePicker maxDate={dayjs()} sx={{ width: '100%' }} label="Data de Batismo" onChange={handleDatePickOnChange} name="dataBatismo" value={dayjs(dataForm.dataBatismo, 'DD/MM/YYYY')}/>
                            </LocalizationProvider>
                        </Grid>                     
                        <Grid item xs={12} md={6}>
                            <FormLabel id="demo-row-radio-buttons-group-label">Ministério de Batismo</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                onChange={handleRadioMinisterio}
                            >
                                <FormControlLabel value="self" control={<Radio />} label="A.D Toyama" />
                                <FormControlLabel value="other" control={<Radio />} label="Outro" />
                            </RadioGroup>
                        </Grid>                        
                        {!rdLocalBatismo &&
                            <>
                                <Grid item xs={8} md={6}>
                                    <TextField required id="outlined-basic" label="Ministério de Batismo" variant="outlined"fullWidth name="localBatismo" onChange={handleOnChange} value={dataForm.localBatismo}/>
                                </Grid>
                                <Grid item md={10} xs={12}>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Foto do Certificado</FormLabel>
                                    <ImagemCropUplaod images={dataForm.certBatFile != null ? [dataForm.certBatFile] : []} setImages={handleChangeImage}/>
                                </Grid>
                            </>
                        }                        
                    </Grid> 
            </FormControl>
        </Grow>
     );
}
