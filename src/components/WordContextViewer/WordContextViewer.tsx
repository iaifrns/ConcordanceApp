// WordContextViewer.tsx
import React, { useState, useEffect, useCallback } from 'react';
import './WordContextViewer.css';

interface FilterStructure {
    documentId: string;
    doc_id: string;
    startingLetter: string;
    paragraph: string;
    sentence: string;
    lineNumber: string;
    lineRange: string;
}

interface WordContextViewerProps {
    word: string;
    filters: FilterStructure;
}

interface WordContextResponse {
    doc_name: string;
    sentence_no:Number;
    paragraph_no: Number;
    word: string;
    context_paragraph: string;
}

const WordContextViewer = ({ word, filters }: WordContextViewerProps) => {
    const [context, setContext] = useState<WordContextResponse[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const formatFilters = useCallback(() => {
        let str = '?';
        for (const key in filters) {
            if (filters[key as keyof FilterStructure] !== '') {
                str += `${key}=${filters[key as keyof FilterStructure]}&`
            }
        }
        return str.substring(0, str.length - 1);
    }, [filters])
   

    const sortData=(data:WordContextResponse[])=>{
        
    }

    useEffect(() => {
        const fetchWordsContext = async () => {
            if (formatFilters()?.includes('=')) {
                try {
                    const formatedFilters = formatFilters().substring(1, formatFilters().length)
                    const res = await fetch(`http://localhost:5000/word-context?word=${word}&${formatedFilters}`);
                    const data = await res.json();

                    setContext([...data])
                    setCurrentIndex(0)
                } catch (error) {
                    alert('Error occured when fetching Word Context !!!')
                }
            }
        };
        fetchWordsContext();
        // rest of your code
    }, [formatFilters]);

    const handlePrev = () => {
        setCurrentIndex((currentIndex:number) => currentIndex -1);
    };

    const handleNext = () => {
        setCurrentIndex((currentIndex:number) =>  currentIndex+1);
    };

    const formatResponse = (data: string)=>{
        let str = ``;
        data.split(" ")
            .forEach((wordIndex:string)=> {
                
            })

        return str;
    }

    return (
        <div className="word-context-viewer">
            {context.length > 0 ? (
                <>
                    <button type="button" className='btn-next' onClick={()=>handlePrev()} disabled={currentIndex === 0}>Previous</button>
                    <div className="context-display">
                        {
                            context[currentIndex]?.context_paragraph.split(" ")
                            .map((wordIndex: string)=>{
                                return(
                                    wordIndex === word ? <span style={{backgroundColor: 'red',color: 'white'}}>{wordIndex}</span>
                                        : <span>{" "+wordIndex+" "}</span>
                                )
                            })
                        }
                    </div>
                    <button type="button" className='btn-next' onClick={()=>handleNext()} disabled={currentIndex === context.length - 1}>Next</button>
                </>
            ) : (
                <p>Select a word to view its context.</p>
            )}
        </div>
    );
};

export default WordContextViewer;
