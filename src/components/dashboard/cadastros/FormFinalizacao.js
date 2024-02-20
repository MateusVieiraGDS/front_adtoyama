import { Alert, Box, FormControl, Grid, Grow, Paper, Slide, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { sa_getCargos, sa_getCongregacoes, sa_getGrupos } from "../../../app/actions/helpers";

export default function FormFinalizacao({data, completeStatus}) {
    const [congregacoes, setCongregacoes] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [cargosPossiveis, setCargosPossiveis] = useState([]);

    useEffect(() => {        
        (async ()=>{
            let responseCargos = await sa_getCargos();            
            let responseCongregacoes = await sa_getCongregacoes();
            let responseGrupos = await sa_getGrupos();
            setCongregacoes(responseCongregacoes.data.map(m => ({'label': m.nome, 'id': m.id})));
            setGrupos(responseGrupos.data.map(m => ({'label': m.nome, 'id': m.id})));
            setCargosPossiveis(responseCargos.data.map(m => ({'label': m.nome, 'id': m.id})));
        })();
    }, []);

    const getUncompleteSteps = () => {
        const labels = ['Dados Pessoais', 'Endereço e Contato', 'Batismo e Congregação', 'Consagrações'];
        console.log(completeStatus);
        return labels.filter((f, index) => {
            console.log(f);
            console.log(completeStatus[index]);
            console.log('---------');
            return completeStatus[index] == false;
        });
    }

    return ( 
        <Grow in={true} direction="left">            
            <Box sx={{width: '100%'}}> 
                <Alert variant="filled" severity="info">
                    Verfique o resumo de cadastro antes de finalizar, 
                    certifique-se que todas as informações estão corretas! Caso ocorra alguma dúvida, volte os passos para verificar.
                </Alert>
                {getUncompleteSteps().length > 0 &&
                    <Alert variant="filled" severity="error" sx={{marginTop: '.5em'}}>
                        Existem Pendencias nos seguintes passos:
                        {getUncompleteSteps().map( (p, i) => 
                            <b key={i}>{`${i > 0 ? ', ' : ''} ${p}`}</b>
                        )}                            
                    </Alert>
                }
                <Paper elevation={3} sx={{padding: '1em', marginTop: '.5em'}}>                                    
                    <Grid container spacing={2} columns={11} >
                        {completeStatus[0] &&
                            <Grid item xs={12} md={12}>
                                <Typography variant="h6">
                                    Dados Pessoais:
                                </Typography>                            
                                <Typography variant="span" component='p'>
                                    <b style={{textTransform: 'capitalize'}}>{data.dadosPessoais.nome}</b> nascido em <b>{data.dadosPessoais.dataNasc}</b> sob o CPF  de número <b>{data.dadosPessoais.cpf}</b> e RG <b>{data.dadosPessoais.rg}</b> emitido na unidade federativa (UF) <b>{data.dadosPessoais.rgUf}</b>
                                </Typography>
                            </Grid>
                        }
                        {completeStatus[1] &&
                            <Grid item xs={12} md={12}>
                                <Typography variant="h6">
                                    Endereço e Contato: 
                                </Typography>
                                <Typography variant="p" component='p'>
                                    {`${data.dadosEnderecoContato.rua}, ${data.dadosEnderecoContato.numero} - ${data.dadosEnderecoContato.bairro}, ${data.dadosEnderecoContato.cidade} - ${data.dadosEnderecoContato.uf}, ${data.dadosEnderecoContato.cep}`}
                                </Typography>
                                <Typography variant="p" component='p'>
                                    Email: {data.dadosEnderecoContato.email}
                                </Typography>
                                <Typography variant="p" component='p'>
                                    Telefone: {data.dadosEnderecoContato.telefone}
                                </Typography>
                            </Grid>
                        }                     
                        {completeStatus[2] &&                         
                            <Grid item xs={12} md={12}>
                                <Typography variant="h6">
                                    Batismo e Congregação: 
                                </Typography>
                                <Typography variant="p" component='p'>
                                    Irá se unir á <b>{congregacoes.find(f => f.id == data.dadosCongregacaoBatismo.congregacao)?.label ?? ''}</b>, e {data.dadosCongregacaoBatismo.grupo != '' ? <> ingressará no grupo dos(a) <b>{(grupos.find(g => g.id == data.dadosCongregacaoBatismo.grupo)?.label ?? '')}</b></> : <> não ingressará em nenhum grupo</>}
                                </Typography>
                                <Typography variant="p" component='p'>
                                    Batizado em <b>{data.dadosCongregacaoBatismo.dataBatismo}</b> na igreja <b>{(data.dadosCongregacaoBatismo.localBatismo == 'self' ? 'AD Toyama' : data.dadosCongregacaoBatismo.localBatismo)}</b>
                                </Typography>
                            </Grid>
                        }
                        <Grid item xs={12} md={12}>                                                
                            <Typography variant="h6">
                                Cargos e Consagrações: 
                            </Typography>
                            {data.dadosConsagracao.length > 0 ?
                                <ul>
                                    {data.dadosConsagracao.map(c => 
                                        <Typography variant="p"  component='li' key={c.id}>
                                            Consagrado ao cargo de <b>{cargosPossiveis.find(cp => cp.id == c.cargoId)?.label ?? ''}</b> em <b>{c.dataCon}</b> pela igreja <b>{c.ministerio == 'self' ? 'AD Toyama' : c.ministerio}</b>
                                        </Typography>
                                    )}
                                </ul>
                            :
                            <Typography variant="p" component='p'>
                                Não foram lançados cargos.
                            </Typography>                        
                            }
                        </Grid>
                    </Grid>
                </Paper>   
            </Box>
        </Grow>
     );
}
