import React, { useState, useEffect } from 'react'
import './WordGroup.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography, styled } from '@mui/material';
import { Icon } from '@iconify/react/dist/iconify.js';


interface ToggleInterface {
    action: string;
    active: boolean;
}

export default function WordExpression({ documents }: any) {
    const navigate = useNavigate();
    const [toggle, setToggle] = useState<ToggleInterface[]>([
        {
            action: 'GroupList',
            active: true
        },
        {
            action: 'AddGroup',
            active: false
        },
        {
            action: 'AddWord',
            active: false
        }
    ])
    const [groupsList, setGroupList] = useState<any>([])
    const [wordsList, setWordsList] = useState<any>([])
    const [documentText, setDocumentText] = useState<string[]>([])
    const [selectedDoc, setSelectedDoc] = useState<any>(documents[0])
    const [selectedText, setSelectedText] = useState<string[]>([])
    const [expressionInput, setExpressionInput] = useState<string>('')

    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const [page1, setPage1] = useState<number>(1);
    const [hasMore1, setHasMore1] = useState<boolean>(true);

    const [page2, setPage2] = useState<number>(1);
    const [hasMore2, setHasMore2] = useState<boolean>(true);

    const [isGroup, setIsGroup] = useState<boolean>(true);



    //   fetch list of words in group
    async function fetchWordsFromGroup() {
        setTimeout(() => {
            setWordsList(['Dog', 'Pig', 'Goat'])
        }, 3000)
    }

    const onGroupSelect = (data: any) => {
        let arr = [...groupsList].filter((item: any, ind: number) => item?.name === data?.name)
        if (arr.length > 0)
            setWordsList([...arr[0]?.words?.split(" ")])
        setIsGroup(false)
    }

    //   function to get all text from document
    async function getDocumentData(filename: any) {
        try {
            const res = await fetch(`http://localhost:5000/documents?filename=${filename}`)
            const data = await res.json()
            setDocumentText([...data])
        } catch (e) {
            console.log("Error Occured Fetching groups: ", e);
        }
    }

    async function saveNewExpression() {
        if (!expressionInput)
            return;
        fetch("http://localhost:5000/expression", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                expression: expressionInput,
                words_expression: selectedText.join(" ")
            })
        })
            .then(res => {
                if (res.status >= 200) {
                    setExpressionInput('')
                    setSelectedText([])
                    alert("Expression Added Successfully !!!")
                }
            })
            .then(data => console.log(data))
            .catch(err => console.log(err))
    }

    async function fetchWordGroups() {
        try {
            const res = await fetch('http://localhost:5000/expression')
            const data = await res.json()
            console.log("Data: ", data)
            setGroupList([...data])
        } catch (e) {
            console.log("Error Occured Fetching Expressions: ", e);
        }
    }

    useEffect(() => {
        getDocumentData(selectedDoc?.name);
    }, [selectedDoc])


    useEffect(() => {
        fetchWordGroups()
    }, [])

    const updateToggle = (action: string) => {
        let arr: ToggleInterface[] = [...toggle];
        arr.forEach((item: ToggleInterface, index: number) => {
            if (item?.action === action) {
                item.active = true
                if (item?.action === 'GroupList') {
                    fetchWordGroups();
                }
            } else {
                item.active = false;
            }
        })

        setToggle([...arr])
    }

    const WordBox = styled(Box)(({ theme }) => ({
        padding: 16,
        border: '1px solid',
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        alignItems: 'center',
        width: 200,
        justifyContent: 'center',
        cursor: 'pointer'
    }));



    return (
        <Stack direction={'column'} gap={4} alignItems={'center'}>
            <Stack direction={'row'} justifyContent={'space-around'} width={'100%'}>
                <Icon width={24} icon="icon-park-solid:back" onClick={() => navigate("/")} style={{ flex: 1, cursor: 'pointer' }} />
                <Typography variant='h3' sx={{ flex: 5 }} fontWeight={'bold'} >Manage Word Expressions</Typography>
            </Stack>
            <Box border={1} borderRadius={3} p={3} gap={2} maxHeight={'70vh'} width={'80%'} display={'flex'} justifyContent={'center'} alignItems={'center'} >
                {/* display word groups */}
                {
                    toggle.map((item: ToggleInterface, index: number) => {
                        return (
                            <>
                                {item.action === 'GroupList' && item.active && <Box width={'100%'}  >
                                    <Stack direction={'column'} alignItems={'center'} >

                                        {!isGroup && <Box width={'100%'} display={'flex'}><Icon width={24} icon="ep:back" style={{ cursor: 'pointer' }} onClick={() => setIsGroup(true)} /></Box>}
                                        {isGroup ? <InfiniteScroll
                                            dataLength={groupsList.length}
                                            next={() => setPage(prevPage => prevPage + 1)}
                                            hasMore={hasMore}
                                            loader={<h4>Loading ...</h4>}
                                            endMessage={<p>No more words!</p>}
                                            className="scrollable-words-list"
                                        >
                                            {groupsList.map((group: any) => (
                                                <WordBox key={group?.name} onClick={() => onGroupSelect(group)}>
                                                    {group?.name}
                                                </WordBox>
                                            ))}
                                        </InfiniteScroll> :
                                            <>
                                                <InfiniteScroll
                                                    dataLength={wordsList.length}
                                                    next={() => setPage1(prevPage => prevPage + 1)}
                                                    hasMore={hasMore1}
                                                    loader={<h4>Loading ...</h4>}
                                                    endMessage={<p>No more words!</p>}
                                                    className="scrollable-words-list"
                                                >
                                                    {wordsList.map((word: any) => (
                                                        <WordBox key={word} >
                                                            {word}
                                                        </WordBox>
                                                    ))}
                                                </InfiniteScroll>
                                            </>

                                        }
                                    </Stack>
                                </Box>
                                }

                                {item.action === 'AddGroup' && item.active && <Box width={'100%'} gap={2} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                                    <Typography variant='h4'>Words In Expression: {selectedText.join(" ")}</Typography>
                                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                                        <select onChange={(e) => {
                                            const str = e.target.value.replace(".txt", "")
                                            const obj = documents.find((item: any, index: number) => item?.name === str);
                                            setSelectedDoc(obj)
                                        }}
                                            style={{
                                                width: 350,
                                                height: 55
                                            }}
                                        >
                                            {
                                                documents?.map((doc: any, index: number) => {
                                                    return (
                                                        <option>{doc?.name + ".txt"}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <input type='text'
                                            onChange={(e) => setExpressionInput(e.target.value)}
                                            placeholder='Enter expression name ...'
                                            style={{
                                                width: 350,
                                                height: 50
                                            }}
                                        />
                                    </Stack>

                                    <Box width={'100%'} height={'35vh'} border={'1px solid gray'} overflow={'scroll'} borderRadius={3}>
                                        {documentText.map((word: any) => (
                                            <button key={word}
                                                onClick={() => setSelectedText((prev) => [...prev, word])}
                                                type="button" className="word-item">
                                                {word}
                                            </button>
                                        ))}

                                    </Box>

                                    <Stack direction={'row'} gap={3} justifyContent={'space-around'} width={'80%'}>
                                        <Button
                                            variant={'contained'}
                                            onClick={() => saveNewExpression()} >Save Expression</Button>
                                        <Button
                                            variant={'contained'}
                                            onClick={() => setSelectedText([])} >Clear Words</Button>
                                    </Stack>

                                </Box>
                                }
                            </>
                        )
                    })
                }
            </Box>
            <Stack direction={'row'} gap={3} justifyContent={'space-around'} width={'80%'}>
                <Button
                    variant={'contained'}
                    onClick={() => {
                        updateToggle('GroupList')
                    }} >View Expressions</Button>
                <Button
                    variant={'contained'}
                    onClick={() => {
                        updateToggle('AddGroup')
                    }} >Add Expression</Button>
            </Stack>
        </Stack>
    )
}
