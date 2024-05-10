import React, { useState } from 'react';

export function MainPage() {
  const [showInput, setShowInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSelectChange = (event) => {
    setShowInput(event.target.value === 'KNN');
  };

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadButtonClick = () => {
    // Adicione aqui a lógica para lidar com o upload do arquivo.
    console.log('Arquivo enviado:', selectedFile);
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor: 'lightgray', padding: '20px' }}>
      <h1>Classificador de Peras</h1>
      <div style={{ display: 'inline-block', backgroundColor: 'gray', padding: '10px', borderRadius: '5px' }}>
        <input type="file" onChange={handleFileInputChange} accept=".csv" style={{ display: 'none' }} />
        <button style={{ backgroundColor: 'blue', color: 'white', marginBottom: '10px', marginRight: '10px' }} onClick={() => document.querySelector('input[type="file"]').click()}>Selecionar o Arquivo</button>
        <p>Modelo do Arquivo modelo.csv</p>
        <select  onChange={handleSelectChange}>
          <option>Selecionar uma Opção</option>
          <option>Árvore de Decisão</option>
          <option>KNN</option>
        </select><br></br>
        {showInput && <input type="text" placeholder="Digite algo para KNN"  />}
      </div>
      <br />
      <button style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px', borderRadius: '5px' }} onClick={handleUploadButtonClick}>Executar</button>
    </div>
  );
}
