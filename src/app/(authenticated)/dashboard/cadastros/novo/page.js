'use client'

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import FormDadosPessoais from '../../../../../components/dashboard/cadastros/FormDadosPessoais';
import FormCongregacaoBatismo from '../../../../../components/dashboard/cadastros/FormCongregacaoBatismo';
import FormEnderecoContato from '../../../../../components/dashboard/cadastros/FormEnderecoContato';
import FormConsagracao from '../../../../../components/dashboard/cadastros/FormConsagracao';
import FormFinalizacao from '../../../../../components/dashboard/cadastros/FormFinalizacao';
import { Button, Divider, Stack, ThemeProvider, createTheme } from '@mui/material';
import { ArrowBackOutlined, ArrowCircleLeft, ArrowCircleRight, ArrowForwardOutlined } from '@mui/icons-material';
import { ptBR } from '@mui/x-date-pickers';
import { toast } from 'react-toastify';
import { sa_uploadCadastro } from '../../../../actions/cadastro';
import ObjetcToFormData from '../../../../../helpers/ObjetcToFormData'


const themeDatePick = createTheme(
    ptBR, // x-data-grid translations
);

const getUrlHashValue = () =>{
    const hash = window.location.hash.slice(1);
    const index = parseInt(hash, 10);
    return isNaN(index) ? 0 : index;
}

export default function CadastroForm() {  
    console.warn = () => {};
    const [activeStep, setActiveStep] = useState(getUrlHashValue());
    const [completeStepsState, setCompleteStepsStates] = useState([false, false, false, false, true]);

    const [dataPayload, setDataPayload] = useState({
        dadosPessoais: {
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
            imageFileDoc: null,
            imageFileNasc: null,
            imageFileCas: null,
            imageFileDiv: null,
            imageFileObt: null
        },
        dadosEnderecoContato: {
            rua: '',
            numero: '',
            bairro: '',
            cidade: '',
            uf: '',
            complemento: '',
            cep: '',
            email: '',
            telefone: ''
        },
        dadosCongregacaoBatismo: {
            dataBatismo: '',
            localBatismo: '',
            minisAnt: '',
            congregacao: '',
            grupo: '',
            certBatFile: null
        },
        dadosConsagracao: []
    });    

    const dataRequired = {
        dadosPessoais: ['nome', 'dataNasc', 'sexo', 'cpf', 'rg', 'rgUf', 'estado', 'cidade', 'imageFileDoc'],
        dadosEnderecoContato: ['rua', 'numero', 'bairro', 'cidade', 'uf', 'cep', 'email', 'telefone'],
        dadosCongregacaoBatismo: ['dataBatismo', 'localBatismo', 'congregacao'],
        dadosConsagracao: [],
        dadosFinalizacao: []
    }
    
    useEffect(() => {
        console.log(dataPayload);
    }, [dataPayload]);

    useEffect(() => {
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => {
          window.removeEventListener('hashchange', handleHashChange);
        };
      }, []);


    const handleHashChange = () => {
        const index =  getUrlHashValue();
        setActiveStep(index);
    };

    const nextStep = () =>{
        if(activeStep < steps.length - 1){
            setActiveStep(v => {
                window.location.hash = `#${v + 1}`;
                return v + 1;
            });
        }        
    }

    const backStep = () =>{
        if(activeStep > 0){
            setActiveStep(v => {
                window.location.hash = `#${v - 1}`;
                return v - 1;
            });            
        }  
    }
    

    const handleSetData = (data, dataId) =>{
        setDataPayload((prevData) => {
            let new_data ={
                ...prevData,
                [dataId]: data,
            };
            let complete = true;
            dataRequired[dataId].forEach(dr =>{
                let temp_value = new_data[dataId][dr];
                if(temp_value == '' || temp_value == null || temp_value == undefined)
                    complete = false;
            });
            setCompleteStepsStates((prevState) => {
                const novoArray = [...prevState];
                novoArray[activeStep] = complete;
                return novoArray;
            });
            return new_data;
        });
    }
    

    const handleUpload = async () => {
        if(completeStepsState.find(f => f == false) != null){
            toast('Preencha todos os dados obrigatórios para finalizar o cadastro', {type: 'error'});
            return;
        }
        let response = await sa_uploadCadastro(ObjetcToFormData(dataPayload));
        console.log(response);
    }

    const steps = [
        {label: 'Dados Pessoais', component: <FormDadosPessoais data={dataPayload.dadosPessoais} setData={d => handleSetData(d, 'dadosPessoais')}></FormDadosPessoais>},
        {label: 'Endereço e Contato', component: <FormEnderecoContato data={dataPayload.dadosEnderecoContato} setData={d => handleSetData(d, 'dadosEnderecoContato')}></FormEnderecoContato>},
        {label: 'Batismo e Congregação', component: <FormCongregacaoBatismo data={dataPayload.dadosCongregacaoBatismo} setData={d => handleSetData(d, 'dadosCongregacaoBatismo')}></FormCongregacaoBatismo>},
        {label: 'Consagrações', component: <FormConsagracao data={dataPayload.dadosConsagracao} setData={d => handleSetData(d, 'dadosConsagracao')}></FormConsagracao>},
        {label: 'Finalização', component: <FormFinalizacao data={dataPayload} completeStatus={completeStepsState} onUpload={handleUpload}></FormFinalizacao>}
    ];

        
    return ( 
        <>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                <Step key={index}>
                    {(activeStep!= index && activeStep > index && !completeStepsState[index]) ?
                        <StepLabel error={true}>{step.label}*</StepLabel>
                    :
                        <StepLabel >{step.label}</StepLabel>
                    }                    
                </Step>
                ))}
            </Stepper> 
            <Stack 
                direction='row' justifyContent='center' alignContent='center'
                sx={{
                    width: '100%',
                    margin: '.5em 0',
                    '& button': {
                        width: '12em',
                        height: '1.7em',
                        margin: '0 .5em'
                    }
                }} 
            >
                <Button onClick={backStep} variant='contained' color='info' startIcon={<ArrowBackOutlined/>} sx={{borderRadius: '5em 0 0 5em'}}>Voltar</Button>  
                <Button onClick={nextStep} variant='contained' color='primary' endIcon={<ArrowForwardOutlined/>} sx={{borderRadius: '0 5em 5em 0'}}>Proximo</Button> 
            </Stack> 
            <Divider/>
            <Box sx={{
                marginTop: '1em'
            }}>
                <ThemeProvider theme={themeDatePick}>
                    {steps[activeStep].component}
                </ThemeProvider>
            </Box>                    
        </>
     );
}
