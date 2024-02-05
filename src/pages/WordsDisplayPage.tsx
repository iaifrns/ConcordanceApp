// WordsDisplayPage.tsx
import React, { useState } from 'react';
import WordsList from '../components/WordsList/WordsList';
import WordContextViewer from '../components/WordContextViewer/WordContextViewer';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Box, Modal, Pagination, Stack, Typography, styled, useMediaQuery, useTheme } from '@mui/material';

interface FilterStructure {
    documentId: string;
    doc_id: string;
    startingLetter: string;
    paragraph: string;
    sentence: string;
    lineNumber: string;
    lineRange: string;
}

const WordsDisplayPage = () => {
    const [selectedWord, setSelectedWord] = useState<string>('');
    const [isWordVisible, setIsWordVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const [filters, setFilters] = useState<FilterStructure>({
        documentId: '',
        doc_id: '',
        startingLetter: '',
        paragraph: '',
        sentence: '',
        lineNumber: '',
        lineRange: ''
    });

    const [numberOfWords, setNumberOfWord] = useState(0);

    const handleWordSelect = (word: string) => {
        setIsWordVisible(true)
        setSelectedWord(word);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsWordVisible(false)
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const styles = {
        padding: 16,
        width: 350
    }

    const [page, setPage] = useState(1);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        console.log(event);
    };

    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const PreviewModal = styled(Modal)(() => ({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }))

    const PreviewModalContainer = styled(Box)(({ theme }) => ({
        padding: 16,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'white',
        display:'flex',
        alignItems: 'center',
        flexDirection : 'column'
    }));

    return (
        <Stack direction={'column'} alignItems={'center'} gap={3} >
            <Stack direction={'row'} alignItems={'center'} width={'70%'}>
                <Icon width={24} icon="icon-park-solid:back" onClick={() => navigate("/")} style={{ flex: 1, cursor: 'pointer' }} />
                <Typography variant='h3' sx={{ flex: 9 }}>Display Words</Typography>
            </Stack>

            <Stack
                sx={{ width: smallScreen ? '100%' : '70%' }}
                direction={smallScreen ? 'column' : 'row'}
                justifyContent={smallScreen ? 'center' : 'space-between'}
                alignItems={'center'} gap={3}>

                <input style={styles} name="doc_id" placeholder="Filter by Document ID" value={filters.doc_id} onChange={handleFilterChange} />
                <input style={styles} name="startingLetter" placeholder="Word Search" value={filters.startingLetter} onChange={handleFilterChange} />

            </Stack>

            <Stack
                sx={{ width: smallScreen ? '100%' : '70%' }}
                direction={smallScreen ? 'column' : 'row'}
                justifyContent={smallScreen ? 'center' : 'space-between'}
                alignItems={'center'} gap={3}>

                <input style={styles} name="paragraph" placeholder="Paragraph" value={filters.paragraph} onChange={handleFilterChange} />
                <input style={styles} name="sentence" placeholder="Sentence" value={filters.sentence} onChange={handleFilterChange} />

            </Stack>

            <Stack
                sx={{ width: smallScreen ? '100%' : '70%' }}
                direction={smallScreen ? 'column' : 'row'}
                justifyContent={smallScreen ? 'center' : 'space-between'}
                alignItems={'center'} gap={3}>

                <input style={styles} name="lineNumber" placeholder="Line Number" value={filters.lineNumber} onChange={handleFilterChange} />

            </Stack>

            <Box sx={{ width: '70%' }}>
                {isWordVisible ?
                    <PreviewModal open={isWordVisible} onClose={() => setIsWordVisible(false)}>
                        <PreviewModalContainer>
                            <Stack direction={'row'} justifyContent={'right'} width={'100%'}>
                            <Icon icon="ic:round-close" width={24} onClick={() => setIsWordVisible(false)} />
                            </Stack>
                            <WordContextViewer word={selectedWord} filters={filters} />
                        </PreviewModalContainer>
                    </PreviewModal>
                    :
                    <Stack direction={'column'} alignItems={'center'} gap={2}>
                        {numberOfWords > 30 ? (
                            <>
                                <WordsList onWordSelect={handleWordSelect} filters={filters} setWordNumber={setNumberOfWord} startSplit={0 + (30 * (page - 1))} endSplit={30 + (30 * (page - 1))} />
                                <Pagination count={Math.ceil(Math.ceil(numberOfWords / 30))} color="primary" onChange={handleChange} />
                            </>
                        ) : (
                            <>
                                <WordsList onWordSelect={handleWordSelect} filters={filters} setWordNumber={setNumberOfWord} startSplit={0} endSplit={30} />
                            </>
                        )}

                    </Stack>
                }

            </Box>

        </Stack>


    );
};

export default WordsDisplayPage;
