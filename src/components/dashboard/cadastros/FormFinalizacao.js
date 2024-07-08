import { Alert, Box, Button, Divider, FormControl, Grid, Grow, Paper, Slide, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { sa_getCargos, sa_getCongregacoes, sa_getGrupos } from "../../../app/actions/helpers";

export default function FormFinalizacao({data, completeStatus, onUpload}) {
    const [congregacoes, setCongregacoes] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [cargosPossiveis, setCargosPossiveis] = useState([]);
    const [preview34, setPreview34] = useState(null);

    useEffect(() => {             
        (async ()=>{
            if(data.dadosPessoais.imageFile34 != null){
                const reader = new FileReader();
                reader.onloadend = (e) => setPreview34(e.target.result);     
                reader.readAsDataURL(data.dadosPessoais.imageFile34);
            }
        })();
        (async ()=>{
            let responseCargos = await sa_getCargos();            
            setCargosPossiveis(responseCargos.data.map(m => ({'label': m.nome, 'id': m.id})));
        })();
        (async ()=>{        
            let responseCongregacoes = await sa_getCongregacoes();
            setCongregacoes(responseCongregacoes.data.map(m => ({'label': m.nome, 'id': m.id})));
        })();
        (async ()=>{
            let responseGrupos = await sa_getGrupos();
            setGrupos(responseGrupos.data.map(m => ({'label': m.nome, 'id': m.id})));
        })();
    }, []);

    const getUncompleteSteps = () => {
        const labels = ['Dados Pessoais', 'Endereço e Contato', 'Batismo e Congregação', 'Consagrações'];
        return labels.filter((f, index) => {
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
                <Paper elevation={3} sx={
                    {
                        padding: '1em', 
                        marginTop: '.5em'
                    }}>   
                        {completeStatus[0] &&
                            <>        
                                <img src={preview34} width="200" height="266" 
                                    style={{
                                        float: 'left',
                                        margin: '0 1em 0 0'
                                    }}
                                ></img>                                                   
                                <Typography variant="h6">
                                    Dados Pessoais:
                                </Typography>                            
                                <Typography variant="span" component='p'>
                                    <b style={{textTransform: 'capitalize'}}>{data.dadosPessoais.nome}</b> do sexo <span style={{textTransform: 'capitalize'}}>{data.dadosPessoais.sexo}</span>, nascido(a) em <b>{data.dadosPessoais.dataNasc}</b> sob o CPF  de número <b>{data.dadosPessoais.cpf}</b> e RG <b>{data.dadosPessoais.rg}</b> emitido na unidade federativa (UF) <b>{data.dadosPessoais.rgUf}</b>
                                </Typography>
                                <Divider/>                                    
                            </>
                        }
                        {completeStatus[1] &&
                            <>
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
                                <Divider/>
                            </>
                        }                     
                        {completeStatus[2] && 
                            <>
                                <Typography variant="h6">
                                    Batismo e Congregação: 
                                </Typography>
                                <Typography variant="p" component='p'>
                                    Irá se unir á <b>{congregacoes.find(f => f.id == data.dadosCongregacaoBatismo.congregacao)?.label ?? ''}</b>, e {data.dadosCongregacaoBatismo.grupo != '' ? <> ingressará no grupo dos(a) <b>{(grupos.find(g => g.id == data.dadosCongregacaoBatismo.grupo)?.label ?? '')}</b></> : <> não ingressará em nenhum grupo</>}
                                </Typography>
                                <Typography variant="p" component='p'>
                                    Batizado em <b>{data.dadosCongregacaoBatismo.dataBatismo}</b> na igreja <b>{(data.dadosCongregacaoBatismo.localBatismo == 'self' ? 'AD Toyama' : data.dadosCongregacaoBatismo.localBatismo)}</b>
                                </Typography>
                                <Divider/>
                            </>             
                        }                                             
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
                    <Divider/>
                    <Box sx={{width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center', marginTop: '1em'}}>
                        <Button variant="contained" color="secondary" onClick={onUpload}>Enviar dados e cadastrar</Button>
                    </Box>
                </Paper>   
            </Box>
        </Grow>
     );
}
