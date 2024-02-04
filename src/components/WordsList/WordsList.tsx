import { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './WordsList.css';
import { Box } from '@mui/material';

interface FilterStructure {
    documentId: string;
    doc_id: string;
    startingLetter: string;
    paragraph: string;
    sentence: string;
    lineNumber: string;
    lineRange: string;
}

interface WordsListProps {
    onWordSelect: (word: string) => void;
    filters: FilterStructure;
    setWordNumber : (value : number) => void; 
    startSplit: number;
    endSplit: number
}


const WordsList = ({ onWordSelect, filters, setWordNumber, startSplit, endSplit }: WordsListProps) => {
    const [words, setWords] = useState<string[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const formatFilters = useCallback(() => {
        let str = '?';
        for (const key in filters) {
            if (filters[key as keyof FilterStructure] !== '') {
                str += `${key}=${filters[key as keyof FilterStructure]}&`
            }
        }
        return str.substring(0, str.length - 1);
    }, [filters]);

    useEffect(() => {
        const fetchWords = async () => {
            if (formatFilters()?.includes('=')) {
                try {
                    const res = await fetch(`http://localhost:5000/words${formatFilters()}`);
                    const data = await res.json();
                    // data from database
                    console.log("Data: ",data)

                    setWordNumber(data.length)

                    setWords([...data]);
                } catch (error) {
                    alert('Error occured when fetching Words try again !!!')
                }
            } 
        };
        fetchWords();
        // rest of your code
    }, [formatFilters]);


    return (
        <div className="words-list-container">
            <InfiniteScroll
                dataLength={words.length}
                next={() => setPage(prevPage => prevPage + 1)}
                hasMore={hasMore}
                loader={<h4>Loading ...</h4>}
                endMessage={<p>No more words!</p>}
                className="scrollable-words-list"
            >
                {words.slice(startSplit, endSplit).map((word) => (
                    <Box key={word} onClick={() => onWordSelect(word)} border={1} p={2} borderRadius={3} sx={{cursor: 'pointer'}} >
                        {word}
                    </Box>
                ))}
            </InfiniteScroll> 
        </div>
    );
};

export default WordsList;