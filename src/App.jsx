import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateAndDisplayNotes from './Components/CreateAndDisplayNotes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateAndDisplayNotes />} />
      </Routes>
  </BrowserRouter>
  );
}

export default App;
