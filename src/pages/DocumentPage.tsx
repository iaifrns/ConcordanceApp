import { useState } from 'react';
import DocumentUploader from '../components/DocumentUploader/DocumentUploader';
import FileMetadataForm from '../components/FileMetadata/FileMetadataForm';
import axios from 'axios';
import { Box, Modal, Stack, Typography, styled } from '@mui/material';
import { Icon } from '@iconify/react';

interface Metadata {
  name: string;
  location: string;
  author: string;
  date: string; // or Date if you're using a Date object
  source: string;
}

const DocumentPage = ({ open, handleOpen }: { open: boolean, handleOpen: () => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleMetadataSubmit = async (metadata: Metadata) => {
    console.log('Metadata submitted:', metadata);

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Append each metadata field to the formData
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key as keyof Metadata]);
      });

      try {
        const response = await axios.post('http://localhost:5000/upload', formData);
        console.log(response.data);
        alert(response.data?.message);
        handleOpen()
        // Handle the response from the server, such as displaying a success message
      } catch (error) {
        console.error('Error uploading the document:', error);
        alert('Error uploading the document:' + error);
        // Handle the error, such as displaying an error message
      }
    }
  };

  const ModalContainer = styled(Box)(({ theme }) => ({
    width: 400,
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 32
  }));

  const DropBox = styled(Box)(()=>({
    padding : 16,
    borderStyle : 'dotted',
    borderWidth : '2px',
    borderColor : 'lightgray',
    width: '90%'
  }));

  return (
    <Modal
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      open={open}
      onClose={handleOpen}>
      <ModalContainer >

        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
          <Typography id="modal-modal-title" variant="h5" fontWeight={'bold'} component="h2" >
            Add new document
          </Typography>
          <Icon icon="iconamoon:close-bold" width={24} style={{ cursor: 'pointer' }} onClick={handleOpen} />
        </Stack>
        {!selectedFile && <DropBox> <DocumentUploader onFileSelect={onFileSelect}/> </DropBox>}
        {selectedFile && <FileMetadataForm onSubmit={handleMetadataSubmit} />}
      </ModalContainer>
    </Modal>

  );
};

export default DocumentPage;
