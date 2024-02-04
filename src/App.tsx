import React,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import WordsDisplayPage from './pages/WordsDisplayPage';
import WordGroup from './pages/WordGroup';
import WordExpression from './pages/WordExpression';
import Statistics from './pages/Statistics'
import DataMining from './pages/DataMining';
// Import other pages and components as needed

function App() {
  const [documentList,setDocumentList] = useState<any[]>([]);

  const fetchDocuments = async ()=>{
    try{  
      const res = await fetch("http://localhost:5000/documents")
      const data = await res.json();
      setDocumentList([...data]);
    }catch(e){
      console.log("Failed to fetch documents",e)
    }
  }

  React.useEffect(()=>{
    fetchDocuments();
  },[])

  return (
    <Router>
      <div className="App">
        <header>
          {/* Add your header or navigation bar here */}
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/words-display" element={<WordsDisplayPage />} />
            <Route path="/words-group" element={<WordGroup  />} />
            <Route path='/words-expressions' element={<WordExpression documents={documentList} />} />
            <Route path='/stats' element={<Statistics documents={documentList} />} />
            <Route path='/data-mining' element={<DataMining documents={documentList} />} />
          </Routes>
        </main>
        <footer>
          {/* Footer content */}
        </footer>
      </div>
    </Router>
  );
}

export default App;
