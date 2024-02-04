import { useState, useEffect } from 'react'
import './WordGroup.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Modal, Stack, TextField, Typography, styled } from '@mui/material';
import { Icon } from '@iconify/react';


interface ToggleInterface {
    action: string;
    active: boolean;
}

interface InputData {
    id: number;
    text: string;
}

enum Status {
    GROUPLIST = 'GroupList',
    ADDGROUP = 'AddGroup',
    ADDWORD = 'AddWord'
}

export default function WordGroup() {
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
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [wordInput, setWordInput] = useState<InputData>({
        id: -1,
        text: ''
    });
    const [groupInput, setGroupInput] = useState<InputData>({
        id: -1,
        text: ''
    });

    const [page1, setPage1] = useState<number>(1);
    const [hasMore1, setHasMore1] = useState<boolean>(true);

    const [isGroup, setIsGroup] = useState<boolean>(true);

    const updateToggle = (action: string) => {
        let arr: ToggleInterface[] = [...toggle];
        arr.forEach((item: ToggleInterface, index: number) => {
            if (item?.action === action) {
                item.active = true
                if (action === 'GroupList') {
                    fetchWordGroups();
                }
            } else {
                item.active = false;
            }
        })

        setToggle([...arr])
    }

    //   fetch list of words in group
    async function fetchWordsFromGroup(data: any) {
        const obj = data;
        try {
            const res = await fetch(`http://localhost:5000/group/words?group_id=${obj?.id}`)
            const data = await res.json()
            setWordsList([...data])
        } catch (e) {
            console.log("Error Occured Fetching Words From List: ", e);
        }
    }

    const onGroupSelect = (data: any) => {
        fetchWordsFromGroup(data)
        setIsGroup(false)
    }

    //   function to get all groups
    async function fetchWordGroups() {
        try {
            const res = await fetch('http://localhost:5000/group')
            const data = await res.json()
            setGroupList([...data])
        } catch (e) {
            console.log("Error Occured Fetching groups: ", e);
        }
    }

    //   fetch all word groups
    useEffect(() => {
        fetchWordGroups()
    }, [])

    async function saveToDB(action: string) {
        if (action === 'word' && wordInput.id > 0 && wordInput.text.length) {
            fetch("http://localhost:5000/group/add-word", {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    group_id: wordInput.id,
                    word: wordInput.text
                })
            })
                .then(res => {
                    if (res.status >= 200) {
                        alert("Word Added To Group Successfully !!!")
                        setWordInput({ id: -1, text: '' })
                    }
                })
                .then(data => console.log(data))
                .catch(err => console.log(err))
        } else if (action === 'group' && groupInput.text.length > 0) {
            fetch("http://localhost:5000/group", {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    name: groupInput.text
                })
            })
                .then(res => {
                    if (res.status >= 200) {
                        alert("Added New Group Successfully !!!")
                        setGroupInput({ id: -1, text: '' })
                    }
                })
                .then(data => console.log(data))
                .catch(err => console.log(err))
        }
    }

    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);

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
                <Typography variant='h3' sx={{ flex: 5 }} fontWeight={'bold'} >Manage Word Groups</Typography>
            </Stack>
            <Box border={1} borderRadius={3} p={3} maxHeight={'60vh'} width={'80%'} display={'flex'} justifyContent={'center'} alignItems={'center'} >
                {/* display word groups */}
                {
                    toggle.map((item: ToggleInterface) => {
                        return (
                            <>
                                {item.action === Status.GROUPLIST && item.active && <Box width={'100%'}  >
                                    <Stack direction={'column'} alignItems={'center'}>

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
                                                <WordBox key={group?.id} onClick={() => onGroupSelect(group)} >
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
                                                        <WordBox key={word?.word_id} >
                                                            {word?.words}
                                                        </WordBox>
                                                    ))}
                                                </InfiniteScroll>
                                            </>

                                        }
                                    </Stack>
                                </Box>
                                }

                            </>
                        )
                    })
                }
            </Box>

            <Modal
                open={open}
                onClose={() => {
                    setOpen(false)
                    updateToggle(Status.GROUPLIST)
                }}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >

                <Box
                    bgcolor={'white'}
                    width={500}
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    p={3}
                    gap={3}
                >
                    <Typography variant='h4'>Add Group</Typography>
                    <TextField value={groupInput.text} onChange={(e) => {
                        setGroupInput({
                            id: groupInput.id, text: e.target.value
                        })
                    }} placeholder='Enter group name ...' fullWidth />

                    <Button variant='contained' className="word-item" fullWidth
                        onClick={() => saveToDB('group')}
                        color='secondary'
                    >Save Group</Button>
                </Box>

            </Modal>

            <Modal
                open={open1}
                onClose={() => {
                    setOpen1(false)
                    updateToggle(Status.GROUPLIST)
                }}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >

                <Box
                    bgcolor={'white'}
                    width={500}
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    p={3}
                    gap={3}
                >

                    <Typography variant='h4'>Add Word</Typography>
                    <select onChange={(e) => {
                        const obj = groupsList.find((item: any, index: number) => item?.name === e.target.value)
                        setWordInput((prev: InputData) => {
                            return { ...prev, id: obj?.id }
                        })
                    }

                    }
                        style={{
                            width: '100%',
                            height: 60,
                        }}
                    >
                        {
                            groupsList?.map((item: any, index: any) => {
                                return (
                                    <option key={item?.name + index.toString()}>{item?.name}</option>
                                )
                            })
                        }
                    </select>
                    <TextField value={wordInput.text} variant='filled'
                        sx={{ backgroundColor: 'white' }}
                        onChange={(e) => setWordInput((prev: InputData) => {
                            return { ...prev, text: e.target.value }
                        })}
                        placeholder='Enter word ...' fullWidth />
                    <Button variant='contained'
                        onClick={() => saveToDB('word')}
                        color='secondary'
                    >Save Word To Group</Button>

                </Box>

            </Modal>

            <Stack direction={'row'} gap={3} justifyContent={'space-around'} width={'80%'}>
                <Button
                    variant={'contained'}
                    onClick={() => {
                        setOpen(true)
                    }} >Add a word group</Button>
                <Button
                    variant={'contained'}
                    onClick={() => {
                        setOpen1(true)
                    }} >Add a word to a group</Button>
            </Stack>
        </Stack >
    )
}
