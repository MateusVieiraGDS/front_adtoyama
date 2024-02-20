import { Autocomplete, Box, Button, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Paper, Radio, RadioGroup, Slide, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { sa_getCargos } from "../../../app/actions/helpers";
import ImagemCropUplaod from "../../helpers/ImagemCropUplaod";
import { Delete } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function FormConsagracao({data, setData}) {
    const [cargosPossiveis, setCargosPossiveis] = useState([]);
    const [consagracoes, setConsagracoes] = useState(data??[]);

    useEffect(() => {
        setData(consagracoes);
    }, [consagracoes]);

    useEffect(() => {        
        (async ()=>{
            let response = await sa_getCargos();
            setCargosPossiveis(response.data.map(m => ({'label': m.nome, 'id': m.id})));
        })();
    }, []);

    const newCargo = () =>{
        setConsagracoes((prevData) => ([
            ...prevData,
            {
                cargoId: '',
                dataCon: '',
                ministerio: 'self',
                certConFile: null                
            }
        ]));
    }

    const removeCargo = (index) => {
        setConsagracoes((prevData) => prevData.filter((f, i) => i != index));
    }

    const handleRadioMinisterio = (index, value) => {
        setConsagracoes((prevData) => prevData.map((m, i) => {
            if(i == index)
                return {...m, ministerio: value == 'self' ? 'self' : ''}
            return m;
        }));
    }

    const handleChangeCargo = (index, value) => {
        setConsagracoes((prevData) => prevData.map((m, i) => {
            if(i == index)
                return {...m, cargoId: value.id}
            return m;
        }));
    }

    const handleChangeMinisterio = (index, value) => {
        setConsagracoes((prevData) => prevData.map((m, i) => {
            if(i == index)
                return {...m, ministerio: value}
            return m;
        }));
    }

    const handleChangeImage = (index, imgs) => {
        setConsagracoes((prevData) => prevData.map((m, i) => {
            if(i == index)
                return {...m, certConFile: imgs[0]??null}
            return m;
        }));
    };

    const handleDatePickOnChange = (index, dt) => {
        setConsagracoes((prevData) => prevData.map((m, i) => {
            if(i == index)
                return {...m, dataCon: dt.format('DD/MM/YYYY')}
            return m;
        }));
    }

    return ( 
        <Slide in={true} direction="left">
            <FormControl sx={{width: '100%'}}>
                    <Typography variant="span" gutterBottom>
                        Insira os cargos
                    </Typography>
                    <Button onClick={newCargo} variant="contained">novo cargo</Button>
                    <Box>
                        {consagracoes.map( (con, index) => 
                            <Paper elevation={2} key={index} sx={{ padding: '1em', marginTop: '.5em'}}>
                                <Button sx={{
                                        width: '3em',
                                        height: '3em',
                                        position: 'absolute',
                                        top: '5.3em',
                                        left: 'calc(100% - 4.5em)',
                                        borderRadius: '0 .5em 0 .5em'
                                    }}
                                    variant="contained"
                                    color="error"
                                    onClick={() => {removeCargo(index)}}
                                >
                                    <Delete />
                                </Button>
                                <Grid container spacing={2} columns={12} sx={{width: '100%'}}>
                                    <Grid item xs={4} md={4}>
                                        <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={cargosPossiveis}
                                        sx={{ width: '100%' }}
                                        onChange={(e, o) => {handleChangeCargo(index, o)}}
                                        value={cargosPossiveis.length > 0 ? cargosPossiveis.find(c => c.id == consagracoes[index].cargoId) ?? '': ''}
                                        renderInput={(params) => <TextField {...params} label="Cargo" fullWidth name="congregacao"/>}                        
                                        />
                                    </Grid> 
                                    <Grid item xs={12} md={7}>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Ministério de Batismo</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={(e, o) => {handleRadioMinisterio(index, o)}}
                                            defaultValue={'self'}
                                        >
                                            <FormControlLabel value="self" control={<Radio />} label="A.D Toyama" />
                                            <FormControlLabel value="other" control={<Radio />} label="Outro" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker sx={{ width: '100%' }} label="Data de Batismo" onChange={(dt) => {handleDatePickOnChange(index, dt)}} name="dataBatismo" value={dayjs(consagracoes[index].dataCon, 'DD/MM/YYYY')}/>
                                        </LocalizationProvider>
                                    </Grid> 
                                    {consagracoes[index].ministerio != 'self' &&
                                        <>
                                            <Grid item xs={8} md={6}>
                                                <TextField required id="outlined-basic" label="Ministério de Batismo" variant="outlined"fullWidth name="localBatismo" onChange={(e) => {handleChangeMinisterio(index, e.target.value)}} value={consagracoes[index].ministerio}/>
                                            </Grid>
                                            <Grid item md={10} xs={12}>
                                                <FormLabel id="demo-row-radio-buttons-group-label">Foto de Certificado</FormLabel>
                                                <ImagemCropUplaod images={consagracoes[index] != null && consagracoes[index].certConFile != null ? [consagracoes[index].certConFile] : []} setImages={(imgs) => {handleChangeImage(index, imgs)}}/>
                                            </Grid>
                                        </>
                                    }                                                             
                                </Grid> 
                            </Paper>
                        )}
                    </Box>                     
            </FormControl>
        </Slide>
     );
}
