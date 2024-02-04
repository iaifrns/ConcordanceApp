import { useState, useEffect } from 'react'
import './Statistics.css'
import { useNavigate } from 'react-router-dom'
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Stack, Typography } from '@mui/material';
import { Icon } from '@iconify/react/dist/iconify.js';
import { ChartsColorPalette, LineChart } from '@mui/x-charts';

export default function Statistics({ documents }: any) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [documentText, setDocumentText] = useState<string[]>([])
  const [selectedDoc, setSelectedDoc] = useState<any>(documents[0])
  const [chartKeys, setChartKeys] = useState<string[]>([''])
  const [chartVals, setChartVals] = useState<number[]>([0])

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

  async function getFileStats() {
    try {
      const res = await fetch(`http://localhost:5000/statistics?filename=${selectedDoc?.name}`)
      const data = await res.json()
      const values: number[] = Object.values(data);
      const keys: string[] = Object.keys(data)

      setChartVals([...values])
      setChartKeys([...keys])
    } catch (e) {
      console.log("Error Occured Fetching groups: ", e);
    }
  }

  useEffect(() => {
    getDocumentData(selectedDoc?.name);
    getFileStats();
  }, [selectedDoc])


  const chartsParams = {
    margin: { bottom: 20, left: 55, right: 25 },
    height: 400
  };


  return (
    <Stack direction={'column'} alignItems={'center'} justifyContent={'center'} gap={3}>
      <Stack direction={'row'} justifyContent={'space-around'} width={'90%'}>
        <Icon width={24} icon="icon-park-solid:back" onClick={() => navigate("/")} style={{ flex: 1, cursor: 'pointer' }} />
        <Typography variant='h3' sx={{ flex: 5 }} fontWeight={'bold'} >Display Statistics</Typography>
      </Stack>
      <Box width={'70%'} m={3} >

        <Stack direction={'column'} justifyContent={'center'} alignItems={'center'} width={'100%'} >

          <LineChart
            {...chartsParams}
            series={[
              {
                data: [...chartVals],
                label: 'Statistics',
                color: "#2b3146",
              },
            ]}
          />

          <select
            onChange={(e: any) => {
              const str = e.target.value.replace(".txt", "")
              const obj = documents.find((item: any, index: number) => item?.name === str);
              setSelectedDoc(obj)
            }}
            style={{
              width: '50%',
              height: 55
            }}
          >
            {
              documents?.map((doc: any, index: number) => {
                return (
                  <option key={doc?.name}>{doc?.name + ".txt"}</option>
                )
              })
            }
          </select>

        </Stack>

      </Box>
    </Stack>
  )
}