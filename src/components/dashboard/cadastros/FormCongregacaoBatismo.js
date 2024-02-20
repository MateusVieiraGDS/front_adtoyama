import { Autocomplete, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Slide, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ImagemCropUplaod from "../../helpers/ImagemCropUplaod";
import { sa_getCongregacoes } from "../../../app/actions/helpers";

export default function FormCongregacaoBatismo({data, setData}) {
    const [dataForm, setDataForm] = useState(data ?? {
        dataBatismo: '',
        localBatismo: '',
        minisAnt: '',
        congregacao: '',
        certBatFile: null
    });

    const [rdLocalBatismo, setRdLocalBatismo] = useState(true);
    const [congregacoes, setCongregacoes] = useState([]);

    useEffect(() => {
        setData(dataForm);
    }, [dataForm]);

    useEffect(() => {        
        (async ()=>{
            let response = await sa_getCongregacoes();
            setCongregacoes(response.data.map(m => ({'label': m.nome, 'id': m.id})));
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
        console.log();
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

    return ( 
        <Slide in={true} direction="left">
            <FormControl sx={{width: '100%'}}>
                    <Grid container spacing={2} columns={12} sx={{width: '100%'}}> 
                        <Grid item xs={12} md={7}>
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
                        <Grid item xs={8} md={6}>                            
                            <TextField id="outlined-basic" label="Nome do ministério Anterior" variant="outlined"fullWidth name="minisAnt" onChange={handleOnChange} value={dataForm.minisAnt}/>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography variant="span" gutterBottom>
                                Sobre o Batismo
                            </Typography>
                        </Grid>                       
                        <Grid item xs={6} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker sx={{ width: '100%' }} label="Data de Batismo" onChange={handleDatePickOnChange} name="dataBatismo" value={dayjs(dataForm.dataBatismo, 'DD/MM/YYYY')}/>
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
                                    <FormLabel id="demo-row-radio-buttons-group-label">Foto de Certificado</FormLabel>
                                    <ImagemCropUplaod images={dataForm.certBatFile != null ? [dataForm.certBatFile] : []} setImages={handleChangeImage}/>
                                </Grid>
                            </>
                        }                        
                    </Grid> 
            </FormControl>
        </Slide>
     );
}
