import React, { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Box, Button, ClickAwayListener, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Modal, Paper, Slider, Stack, Typography } from "@mui/material";
import { Cancel, CropRotate, FileUpload, Save } from "@mui/icons-material";
import Dropzone from '../../components/helpers/Dropzone.js'
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css"

const ImagemCropUplaod = ({images = [], setImages = null, maxImages = 1, initialAspectRatio = 16 / 9}) => {
    const [crooperShow, setCropperShow] = useState(false);
    const cropperRef = useRef(null);
    const [imageList, setImageList] = useState(images??[]);
    const [croppingImage, setCroppingImage] = useState(null);
    const [croppingImageUrl, setCroppingImageUrl] = useState(null);
    const [editImage, setEditImage] = useState(null);
    const [rotate, setRotate] = useState(0);

    const onSaveCropp = () => {
        const cropper = cropperRef.current?.cropper;
        const dataUrl = cropper.getCroppedCanvas().toDataURL();
        const blob = dataURLtoBlob(dataUrl);
        const croppedFile = new File([blob], croppingImage.name, { type: 'image/png' });
        setImageList(list => [...list.filter(img => img.name != croppingImage.name), croppedFile]);
        setEditImage(croppedFile);
        setCropperShow(false);
        setCroppingImage(null);
        setCroppingImageUrl(null);
    }

    const handleClickAway = () => {
        setCropperShow(false);
    }

    const handleSetImageList = (imageList) =>{
        setImageList(imageList);
        setImages(imageList);
    }

    const handleCropImage = (image) =>{   
        const reader = new FileReader();
        reader.onloadend = () => {
            setCroppingImageUrl(reader.result);
            setCroppingImage(image);
            setCropperShow(true);
        }        
        reader.readAsDataURL(image);
    }    

    const dataURLtoBlob = (dataURL) => {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
      
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
      
        return new Blob([u8arr], { type: mime });
      }

      const handleRotate = (e) => {
        const degress = e.target.value;
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        cropper.rotateTo(degress);
      };

      const handleZoom = (e) => {
        const value = e.target.value;
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        cropper.zoomTo(value / 100);
      };
      

  return (    
    <>  
    <Dropzone
        maxFiles={maxImages}
        acceptedFiles="image/*"
        buttonText="Selecione ou arraste"
        onChangeFiles={handleSetImageList}
        onFileAction={handleCropImage}
        setEditedFile={setEditImage}
        editedFile={editImage}
        fileActionIcon={<CropRotate/>}
        initialFiles={images}
    />
    <Modal                
        open={crooperShow} 
        onClose={handleClickAway}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        sx={{}}
      >
        <Stack sx={{height: '100vh'}} justifyContent={'center'} alignItems={'center'}>
            <ClickAwayListener onClickAway={handleClickAway}>
                <Paper elevation={3} sx={{padding: '1em', width: '60vw'}}>
                    <Box sx={{
                        textAlign: 'center',
                        marginBottom: '.5em'
                    }}>
                            <Typography id="keep-mounted-modal-title" variant="h6" component="h3">
                                Edição da imagem
                            </Typography>                                
                    </Box>
                    <Paper elevation={2} sx={{padding: '.5em', marginBottom: '.5em'}}>
                        <Typography id="keep-mounted-modal-title" variant="span" component="span">
                            Rotação da imagem
                        </Typography>  
                        <Slider defaultValue={0} aria-label="Default" valueLabelDisplay="auto" max={180} min={-180} onChange={handleRotate}/>
                        <Typography id="keep-mounted-modal-title" variant="span" component="span">
                            Zoom
                        </Typography>  
                        <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={200} min={0} onChange={handleZoom}/>
                    </Paper>
                    <Cropper
                        src={croppingImageUrl}
                        style={{ height: 350, width: "100%" }}
                        // Cropper.js options
                        initialAspectRatio={initialAspectRatio}
                        guides={true}
                        ref={cropperRef}
                        rotatable={true}
                        responsive={true}
                        zoomOnWheel={false}
                        movable={true}
                    />
                    <Box 
                        sx={{
                            display: 'flex', 
                            justifyContent: 'end', 
                            width: '100%',
                            marginTop: '1em',
                            '& button':{marginLeft: '1em'
                        }}}
                    >
                        <Button variant="contained" endIcon={<Save />} onClick={onSaveCropp}>
                            Salvar
                        </Button>
                        <Button variant="outlined" endIcon={<Cancel />} color="error" onClick={handleClickAway}>
                            Cancelar
                        </Button>
                    </Box>
                </Paper>
            </ClickAwayListener>
        </Stack>
      </Modal>
    </>
  );
};

export default ImagemCropUplaod;
