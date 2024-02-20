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
import { Button } from '@mui/material';


const getUrlHashValue = () =>{
    const hash = window.location.hash.slice(1);
    const index = parseInt(hash, 10);
    return index ?? 0;
}

export default function CadastroForm() {
    console.warn = () => {};
    
    const [activeStep, setActiveStep] = useState(getUrlHashValue());
    const [completeStepsState, setCompleteStepsStates] = useState([false, false, false, false, false]);

    const [dataPayload, setDataPayload] = useState({
        dadosPessoais: {
            nome: '',
            dataNasc: '',
            cpf: '',
            rg: '',
            rgUf: '',
            estado: '',
            cidade: '',
            imageFile: null
        },
        dadosEnderecoContato: {
            rua: '',
            numero: '',
            bairro: '',
            cidade: '',
            uf: '',
            complemento: '',
            cep: ''
        },
        dadosCongregacaoBatismo: {
            dataBatismo: '',
            localBatismo: '',
            imageCertBat: '',
            minisAnt: '',
        },
        dadosConsagracao: []
    });    

    const dataRequired = {
        dadosPessoais: ['nome', 'dataNasc', 'cpf', 'rg', 'rgUf', 'estado', 'cidade', 'imageFile'],
        dadosEnderecoContato: ['rua', 'numero', 'bairro', 'cidade', 'uf', 'cep'],
        dadosCongregacaoBatismo: [],
        dadosConsagracao: []
    }
    
    useEffect(() => {
        console.log(dataPayload);
        console.log(completeStepsState);
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
                if(temp_value == '' || temp_value == null || temp_value == undefined){
                    console.log("STATE:" + dr);
                    complete = false;
                }
            });
            setCompleteStepsStates((prevState) => {
                const novoArray = [...prevState];
                novoArray[activeStep] = complete;
                return novoArray;
            });
            return new_data;
        });
    }

    const steps = [
        {label: 'Dados Pessoais', component: <FormDadosPessoais data={dataPayload.dadosPessoais} setData={d => handleSetData(d, 'dadosPessoais')}></FormDadosPessoais>},
        {label: 'Endereço e Contato', component: <FormEnderecoContato data={dataPayload.dadosEnderecoContato} setData={d => handleSetData(d, 'dadosEnderecoContato')}></FormEnderecoContato>},
        {label: 'Batismo e Congregação', component: <FormCongregacaoBatismo data={dataPayload.dadosCongregacaoBatismo} setData={d => handleSetData(d, 'dadosCongregacaoBatismo')}></FormCongregacaoBatismo>},
        {label: 'Consagrações', component: <FormConsagracao data={dataPayload.dadosConsagracao} setData={d => handleSetData(d, 'dadosConsagracao')}></FormConsagracao>},
        {label: 'Finalização', component: <FormFinalizacao></FormFinalizacao>}
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
            <Button onClick={backStep}>Voltar</Button>  
            <Button onClick={nextStep}>Proximo</Button>  
            <Box sx={{
                marginTop: '1em'
            }}>
                {steps[activeStep].component}
            </Box>                    
        </>
     );
}
