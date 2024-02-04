import React, { useState,ChangeEvent, FormEvent } from 'react';
import './FileMetadataForm.css';

interface Props {
    onSubmit: (metadata: { name: string, location: string, author: string, date: string, source: string }) => void;
  }
  

  const FileMetadataForm: React.FC<Props> = ({ onSubmit }) => {
    const [metadata, setMetadata] = useState({
    name: '',
    location: '',
    author: '',
    date: '',
    source: ''
  });

  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(metadata);
  };

  return (
    <form onSubmit={handleSubmit} style={{width:'100%'}}>
      <div className="form-field">
        <label htmlFor="name">Document Name:</label>
        <input type="text" name="name" value={metadata.name} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="location">Location:</label>
        <input type="text" name="location" value={metadata.location} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="author">Author:</label>
        <input type="text" name="author" value={metadata.author} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="date">Date:</label>
        <input type="date" name="date" value={metadata.date} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="source">Source:</label>
        <input type="text" name="source" value={metadata.source} onChange={handleChange} />
      </div>
      <button type="submit">Submit Metadata</button>
    </form>
  );
  
};

export default FileMetadataForm;
