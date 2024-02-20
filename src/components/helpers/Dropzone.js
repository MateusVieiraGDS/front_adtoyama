import { Audiotrack, Delete, Extension, FileUpload, FolderZip, InsertChart, InsertDriveFile, NoteAdd, OndemandVideo, Photo, PictureAsPdf, RemoveCircle, TextSnippet, Upload, ViewCarousel } from "@mui/icons-material";
import { Avatar, Box, Button, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../styles/helpersStyles/dropzone.module.css';

const MAX_FILES_LIMIT = 2147483647;

function Dropzone({
    acceptedFiles = "*/*", 
    maxFiles = MAX_FILES_LIMIT, 
    buttonText = null, 
    onChangeFiles = null,
    onFileAction = null,
    fileActionIcon = null,
    editedFile = null,
    setEditedFile = null,
    initialFiles = null
}) 
{
    const [fileList, setFileList] = useState(initialFiles??[]);
    const [isDragging, setIsDragging] = useState(false);
    const dropContainer = useRef(null);

    useEffect(() => {
        if(editedFile != null){
            let edFile = editedFile;            
            edFile['isEditted'] = true;
            setFileList(list => {
                let new_list = [...list.filter(file => file.name != edFile.name), editedFile];
                onChangeFiles(new_list);
                return new_list;
            });
            setEditedFile(null);
        }
    }, [editedFile, setEditedFile]);

    const iconsComponent = {
        'image/jpeg|image/png|image/gif|image/bmp|image/tiff|image/raw|image/avif|image/webp':
          <Photo color='primary' />,
        'application/pdf':
          <PictureAsPdf color='primary' />,
        'audio/aac|audio/avif|audio/cda|audio/ico|audio/webp|audio/wma|audio/wav|audio/pcm|audio/flac|audio/oga|audio/opus|audio/weba':
          <Audiotrack color='primary' />,
        'video/mpeg|video/mp4|video/mov|video/wmv|video/flv|video/f4v|video/swf|video/mkv|video/avi|video/avchd|video/ogv|video/webm':
          <OndemandVideo color='primary' />,
        'application/abw|application/msword|application/vnd.oasis.opendocument.presentation|application/vnd.oasis.opendocument.text|application/rtf|text/plain':
          <TextSnippet color='primary' />,
        'application/x-bzip|application/x-bzip2|application/gzip|application/x-tar|application/zip|application/x-7z-compressed|application/x-rar-compressed':
          <FolderZip color='primary' />,
        'text/csv|application/vnd.ms-excel|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|application/vnd.ms-excel.sheet.macroenabled.12':
          <InsertChart color='primary' />,
        'application/vnd.ms-powerpoint|application/vnd.openxmlformats-officedocument.presentationml.presentation':
          <ViewCarousel color='primary' />,
      };


    const handlePushFiles = (files) => {
        files = Array.from(files);
        let overflow = (fileList.length + files.length) - maxFiles;
        if(overflow > 0){            
            files.splice(files.length - overflow);
            toast.warning(`Máximo de ${maxFiles} arquivos permitidos!`, {position: 'bottom-left'});
            if(files.length < 1)
                return;
        }
        setFileList(oldList => 
            {
                let new_list = oldList.concat(files.filter(ff => 
                    oldList.find(of => of.name == ff.name) == null && isMimeTypeAccepted(ff)
                ))
                onChangeFiles(new_list);
                return new_list;
            }
        );
    }

    const handleFileInput = (e) => { 
        handlePushFiles(e.target.files);
        e.target.value = '';
    };

    const handleRemove = (index) => {
        setFileList(oldList => {
            let new_list = oldList.filter((f, i) => i != index);
            onChangeFiles(new_list);
            return new_list;
        });
    };
    
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handlePushFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        if (!dropContainer.current.contains(e.relatedTarget))
            setIsDragging(false);
    };


    const formatSizeAndLastMod = (file) => {
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            timeZone: 'America/Sao_Paulo', // Use o fuso horário desejado
        };
        const kilobyte = 1024;
        const megabyte = kilobyte * 1024;
        const gigabyte = megabyte * 1024;
        const sizeInBytes = file.size; 

        let ret = `Mod: ${(new Intl.DateTimeFormat('pt-BR', options).format(file.lastModifiedDate))} | Tamanho: `;
             
        if (sizeInBytes < kilobyte) {
            ret += sizeInBytes + ' B';
        } else if (sizeInBytes < megabyte) {
            ret += (sizeInBytes / kilobyte).toFixed(2) + ' KB';
        } else if (sizeInBytes < gigabyte) {
            ret += (sizeInBytes / megabyte).toFixed(2) + ' MB';
        } else {
            ret += (sizeInBytes / gigabyte).toFixed(2) + ' GB';
        }

        return ret;
    }

    const isMimeTypeAccepted = (file) => {
        const fileMimeType = file.type;
        const normalizedAcceptedTypes = acceptedFiles.replace(/\s/g, '').split(',');

        if (normalizedAcceptedTypes.includes('*/*')) {
            return true;
        }
        if (normalizedAcceptedTypes.includes(fileMimeType)) {
            return true;
        }
        const partialMimeType = fileMimeType.split('/')[0] + '/*';
        if (normalizedAcceptedTypes.includes(partialMimeType)) {
            return true;
        }

        const fileExtension = file.name.split('.').pop();
        if (normalizedAcceptedTypes.includes('.' + fileExtension)) {
            return true;
        }

        return false;
    }

    const getFileIcon = (file) => {
        let iconKey = Object.keys(iconsComponent).find(k => (k+"").includes(file.type));
        if(iconKey != null)
            return iconsComponent[iconKey];
        return (<InsertDriveFile color='primary'/>);
    }
    return ( 
        <Paper elevation={3} sx={{padding: '1em', position: 'relative'}}
            ref={dropContainer}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}           
            onDrop={handleDrop}
            className={styles.dropContainer}
        >            
            <Button variant="contained" endIcon={isDragging? null: <FileUpload />} fullWidth component={'label'}
                sx={{
                    position: 'absolute',
                    height: '2.5em',
                    width: 'calc(100% - 2.3em)',
                    zIndex: '999',
                    transition: 'all 300ms',
                    '&': (!isDragging? {} : {  
                        width: '100%',
                        height: '100%',
                        margin: '-1.2em'
                    })
                }}
            >
                {!isDragging ? 
                    buttonText ?? 'Selecione ou solte seus arquivos!'
                    :<>
                        <NoteAdd className={styles.dropIcon}/>
                    </>
                }
                <input type="file" onChange={handleFileInput} style={{display: 'none'}} multiple={maxFiles > 1} accept={acceptedFiles}/>
            </Button>
            <Box sx={{height: maxFiles > 1 ? '2.5em' : '0.5em'}}></Box>
            {maxFiles > 1 &&
                <Typography id="keep-mounted-modal-title" variant="span" component="span">
                    {fileList.length < 1 ?
                        'Nenhum arquivo selecionado'
                        :
                        `${fileList.length} arquivo(s)` + (maxFiles < MAX_FILES_LIMIT ? ` de ${maxFiles}`: '')
                    }
                </Typography>
            }            
            <Box sx={{overflowY: 'auto', maxHeight: '40vh'}}>                
                
                <List sx={{ width: '100%', bgcolor: 'background.paper', marginTop: '1em'}}>
                    {fileList.map( (file, index) =>                         
                        <ListItem key={index} secondaryAction={
                            <>
                                {onFileAction && 
                                    <IconButton edge="end" aria-label="delete" color="secondary" onClick={() => onFileAction(file)} sx={{marginRight: '.1em'}}>
                                        {fileActionIcon??<Extension/>}
                                    </IconButton>
                                }
                                <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleRemove(index)}>
                                    <RemoveCircle/>
                                </IconButton>
                            </>
                        }>
                            <ListItemAvatar>
                            <Avatar>
                                {getFileIcon(file)}
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={file.name} secondary={`${formatSizeAndLastMod(file)} ${file.isEditted ? ' - [Editado]' : ''}`} />
                            <Box sx={{display: 'flex', position: 'absolute', top: '100%', justifyContent: 'center', width: 'calc(100% - 1em)'}}>
                                <Box sx={{
                                    width: '80%',
                                    borderBottom: 'solid 0.1em #0000000d',               
                                }}
                                />
                            </Box>
                        </ListItem>    
                    )}
                </List>            
            </Box>
        </Paper>
     );
}

export default Dropzone;