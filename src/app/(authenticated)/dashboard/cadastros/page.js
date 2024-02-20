'use client'

//import theme from "@/Layouts/Admin/Default/themes/default";
import { Box, Button, Grid, InputAdornment, Link, Paper, TextField, ThemeProvider, Tooltip, Typography, createTheme } from "@mui/material";
import { DataGrid, GridNoRowsOverlay, GridToolbar, ptBR } from "@mui/x-data-grid";
import ReactInputMask from "react-input-mask";
import AddIcon from '@mui/icons-material/Add';
//import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import NoRowsDatagridOverlay from '../../../../components/dashboard/NoRowsDatagridOverlay';
import { UploadFile } from "@mui/icons-material";
import { useRouter } from "next/navigation";
//import { onlyNumbers } from "@/helpers/onlyNumbers";
//import DeleteModal from "@/Pages/Admin/components/DeleteModal";
//import DeleteUserModal from "./DeleteUserModal";


const themeDataGrid = createTheme(
    ptBR, // x-data-grid translations
);


export default function DashboardCadastros({membersList = [], setMembersList = null, updateMembersListData = null}) {

    const router = useRouter();

    const [gridSearch, setGridSearch] = useState('');
    const [deleteId, setDeleteId] = useState(0); 

    const columns = [
        {
          id: 1,
          field: 'cpf',
          headerName: 'CPF',
          align: 'center',
          headerAlign: 'center',
          flex: 1,
          valueGetter: params => params.row.cpf,
          renderCell: (params) => (
            <ReactInputMask 
                mask="999.999.999-99" 
                value={params.row.cpf} 
                readOnly
                style={{
                    border: 'none',
                    textAlign: 'center',
                    fontSize: '1em',
                    fontWeight: 'bold',
                    background: '#dddddd',
                    width: '9em',
                    borderRadius: '1em',
                    outline: 'none',
                    padding: '0.3em',
                    cursor: 'default'
                }}
            />
          )
        },
        {
          id: 2,
          field: 'name',
          headerName: 'Nome',
          headerAlign: 'center',
          align: 'center',          
          flex: 1.5
        },
        {
            id: 2,
            field: 'role',
            headerName: 'Cargo (Editável)',
            headerAlign: 'center',
            align: 'center',          
            flex: 1.5,
            editable: true,
            valueSetter: (params) => {
              setMembersList(prev_list => prev_list.map(u => {
                if(u.user_id == params.row.user_id)
                  u.role = params.value
                return u;
              }))           
              updateMembersListData();
              return { ...params.row, ...{role: params.value}}
            },
            valueGetter: (params) => params.row.role,
            renderCell: (params) => (
              <Tooltip title="Clique 2x para editar" arrow disableInteractive>
                {params.row.role != "" ? (<div>{params.row.role}</div>) : (<div style={{opacity: '.5'}}>Inserir cargo...</div>)}
              </Tooltip>
            )            
          },
        {        
          id: 3,
          field: "search",
          headerAlign: 'center',
          headerClassName: 'renderSearchHeader',
          sortable: false,
          renderHeader: () => <></>,          
          flex: 1,
          align: 'right',          
          renderCell: renderActionsCell
        }
      ];

    function renderActionsCell(params) {
        return (
          <>
            <Button
              variant="contained"
              color="red"
              onClick={() => setDeleteId(params.row.user_id)}
              aria-label="delete"
            >
              <DeleteIcon sx={{color: "#fff"}}/>
            </Button>
          </>
        )
      }
    
    function renderSearchHeader(){
        return (
            <>
                <TextField
                    id="filled-search"
                    label="Pesquisar"
                    type="search"
                    value={gridSearch}
                    variant="filled"
                    sx={{width: '100%'}}
                    InputProps={{
                    startAdornment: 
                        <InputAdornment position="start">
                            <SearchIcon/>
                        </InputAdornment>                      
                    }}
                    onChange={(e) => {setGridSearch(e.target.value)}}
                />
            </>
        )
    }


    return ( 
        <>
            <Paper sx={{marginBottom: '1em', padding: '1em'}}>                
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <TextField
                            id="filled-search"
                            label="Pesquisar Membro (Nome/CPF)"
                            type="search"
                            value={gridSearch}
                            variant="filled"
                            sx={{width: '100%'}}
                            InputProps={{
                            startAdornment: 
                                <InputAdornment position="start">
                                    <SearchIcon/>
                                </InputAdornment>                      
                            }}
                            onChange={(e) => {setGridSearch(e.target.value)}}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" sx={{width: '100%', height: '100%'}} onClick={()=>{router.push("/dashboard/cadastros/novo")}}>Novo Cadastro</Button>
                    </Grid>
                    <Grid item xs={1}>                        
                        <Button variant="outlined" sx={{width: '100%', height: '100%'}}>
                            <UploadFile sx={{fontSize: '2.17em'}}/>
                        </Button>                                               
                    </Grid>
                </Grid>
            </Paper>
            <Box sx={{ height: 'calc(100vh - 13em)'}}>                
                <ThemeProvider theme={themeDataGrid}>
                <DataGrid
                filterModel= {{
                    items: [],
                    quickFilterValues: [gridSearch],
                }}
                rows={membersList}
                columns={columns}
                getRowId={(row) => row.user_id}
                disableColumnSelector={true}
                disableColumnMenu={true}
                disableColumnFilter={true}
                disableDensitySelector={true}
                disableSelectionOnClick={true}
                rowsPerPageOptions={[10, 50, 100, 500]}
                slots={{
                    noRowsOverlay: NoRowsDatagridOverlay,
                }}
                sx={{
                    "& .MuiDataGrid-cell:not([class~='MuiDataGrid-cell--editable']), .MuiDataGrid-columnHeader" :{
                        outline: 'none!important',
                        cursor: 'default'
                    },
                    "& .MuiDataGrid-cell--editable input" :{
                    textAlign: 'center'
                    }
                }}             
                />
                </ThemeProvider>
            </Box>
            {/* <DeleteUserModal
            deleteId={deleteId}
            handleDelete={handleDelete}
            closeDeleteModal={() => {setDeleteId(0)}}
            /> */}         
        </>
     );
}