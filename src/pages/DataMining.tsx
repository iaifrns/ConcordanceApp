import React, { useState, useEffect } from 'react'
import './Statistics.css'
import { useNavigate } from 'react-router-dom'
import { BarChart } from '@mui/x-charts/BarChart';

export default function Statistics({ documents }: any) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [documentText, setDocumentText] = useState<string[]>([])
  const [selectedDoc,setSelectedDoc] = useState<any>(documents[0])
  const [chartKeys,setChartKeys] = useState<string[]>([''])
  const [chartVals,setChartVals] = useState<number[]>([0])

  const [statsData,setStatsData] = useState<any>({})
  const [activeCardData,setActiveCardData] = useState<any>({
    paragraph: {},
    sentence: {}
  })

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

  async function getFileStats(){
    try {
      const res = await fetch(`http://localhost:5000/statistics?filename=${selectedDoc?.name}`)
      const data = await res.json()
      const values:number[] = Object.values(data?.stats);
      const keys:string[] = Object.keys(data?.stats)

      setChartVals([...values])
      setChartKeys([...keys])

      setStatsData(data)
    } catch (e) {
      console.log("Error Occured Fetching groups: ", e);
    }
  }

  useEffect(()=>{
      getDocumentData(selectedDoc?.name);
      getFileStats();
  },[selectedDoc])
  

  
  return (
    <div className='stat_main'>
      <div className='stat_header'>
        <div className="header-wrapper">
          <button className="word-item" style={{ backgroundColor: 'white', color: 'black', marginRight: '25%' }}
            onClick={() => navigate('/')}>{"<<  "} Back </button>
          <h2 style={{ marginRight: '28%' }}>Display Statistics</h2>
        </div>
        <b style={{marginBottom:'1.5%'}}>Total No Words: {statsData?.total_letters_counts?.total_num_words}  
        {"  | "}  Total No Letter: {statsData?.total_letters_counts?.total_num_chars}</b>
      </div>
      <div className='stat_body'>
        Select Document:
        <select onChange={(e: any) => {
          const str = e.target.value.replace(".txt", "")
          const obj = documents.find((item: any, index: number) => item?.name === str);
          setSelectedDoc(obj)
        }}>
          {
            documents?.map((doc: any, index: number) => {
              return (
                <option key={doc?.name}>{doc?.name + ".txt"}</option>
              )
            })
          }
        </select>


        <div className='chart'>
          <div className='chart-bar'>
          <BarChart
            xAxis={[{ scaleType: 'band', data: [...chartKeys] }]}
            series={[{ data: [...chartVals] }]}
            width={400}
            height={350}
          />
          </div>

          <div className='card-wrapper'>

              <div className='selects-wrapper'>
                <div className='div-select'>
                  <b style={{fontSize: 12}}>Paragraph No:</b>
                  <select onChange={(e)=>{
                    const obj = statsData?.paragraph?.find((item:any,i:number)=> item?.paragraph === Number.parseInt(e.target.value));
                    console.log("Obj: ", e.target.value)
                    setActiveCardData((prev:any)=> {
                      return {...prev,paragraph: {...obj}}
                    })
                  }}>
                    {
                      statsData?.paragraph?.map((item:any,index:number)=>{
                        return (
                          <option>{item?.paragraph}</option>
                        )
                      })
                    }
                  </select>
                </div>

                <div className='div-select'>
                  <b style={{fontSize: 12}}>Sentence No:</b>
                  <select onChange={(e)=>{
                    const obj = statsData?.sentence?.find((item:any,i:number)=> item?.sentence === Number.parseInt(e.target.value));
                    console.log("Obj: ", e.target.value)
                    setActiveCardData((prev:any)=> {
                      return {...prev,sentence: {...obj}}
                    })
                  }}>
                    {
                      statsData?.sentence?.map((item:any,index:number)=>{
                        return (
                          <option>{item?.sentence}</option>
                        )
                      })
                    }
                  </select>
                </div>
              </div>

              <div className='freq-words'>
                <div className='freq-title'>
                  <b>Most Frequent Words:</b>
                </div>
                <div className='freq-words-item'>
                  {
                    statsData?.frequency?.map((item:any,index:number)=>{
                      return(
                        <div className='word-item space' key={item?.word}>
                            <span>{item?.word}</span>
                            <span className='count-round'>{item?.count}</span>
                        </div>
                      )
                    })
                  }
                </div>
              </div>

              <div className='cards-wrapper-items'>
                  <div className='sample-card'>
                    <b>Paragraph Num: {activeCardData?.paragraph?.paragraph}</b>
                    <b>No of Chars: {activeCardData?.paragraph?.num_characters}</b>
                    <b>No of Words: {activeCardData?.paragraph?.num_words}</b>
                  </div>
                  <div className='sample-card'>
                    <b>Sentence Num: {activeCardData?.sentence?.sentence}</b>
                    <b>No of Chars: {activeCardData?.sentence?.num_characters}</b>
                    <b>No of Words: {activeCardData?.sentence?.num_words}</b>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
