import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

export function MainPage() {
  const [showInput, setShowInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [kValue, setKValue] = useState('3');
  const [selectedOption, setSelectedOption] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resultFile, setResultFile] = useState('');

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    setShowInput(value === 'KNN');
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
      setErrorMessage('');
    } else {
      setSelectedFile(null);
      setErrorMessage('Por favor, selecione um arquivo CSV.');
    }
  };
  const downloadCSV = (htmlData) => {
    // Usar DOMParser para extrair dados do HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlData, 'text/html');
    const rows = [...doc.querySelectorAll('tr')];
  
    // Extrair dados das linhas e colunas, removendo campos Unnamed e NaN
    const csvData = rows.map(row => {
      const cells = [...row.querySelectorAll('th, td')].map(cell => cell.textContent.trim());
      return cells.filter(cell => !cell.includes('Unnamed') && cell !== 'NaN').join(';');
    }).filter(line => line.length > 0);
  
    // Adicionar quebra de linha para formar o CSV
    const csv = csvData.join('\n');
  
    // Criar um objeto Blob para o CSV
    const blob = new Blob([csv], { type: 'text/csv' });
  
    // Criar URL para o Blob
    const url = window.URL.createObjectURL(blob);
  
    // Criar um link para download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resultado.csv';
  
    // Adicionar o link ao documento e clicar nele para iniciar o download
    document.body.appendChild(a);
    a.click();
  
    // Limpar o URL criado
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleUploadButtonClick = async () => {
    if (!selectedFile) {
      setErrorMessage('Nenhum arquivo CSV selecionado.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    let url = '';
    if (selectedOption === 'Árvore de Decisão') {
      url = 'http://127.0.0.1:5000/classifica';
    } else if (selectedOption === 'KNN') {
      formData.append('k', kValue);
      url = 'http://127.0.0.1:5000/classifica_knn';   
    } else {
      setErrorMessage('Por favor, selecione uma opção válida.');
      return;
    }

    try {
      const response = await axios.post(url, formData);

      if (!response.status === 200) {
        throw new Error('Erro ao processar a solicitação');
      }

      setResultFile(response.data.result);

      downloadCSV(response.data.result);
    } catch (error) {
      setErrorMessage('Erro ao processar a solicitação: ' + error.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor: 'lightgray', padding: '190px' }}>
      <h1>Classificador de Peras</h1>
      <div style={{ display: 'inline-block', backgroundColor: 'gray', padding: '70px', borderRadius: '5px' }}>
        <input
          type="file"
          onChange={handleFileInputChange}
          accept=".csv"
          style={{ display: 'none' }}
        />
        <Button
          size="lg"
          variant="primary"
          onClick={() => document.querySelector('input[type="file"]').click()}
        >
          Selecionar o Arquivo
        </Button>
        <p>
          Modelo do Arquivo <a href="./assets/modelo.csv" download>modelo.csv</a>
        </p>

        <Form.Select onChange={handleSelectChange}>
          <option>Selecionar uma Opção</option>
          <option value="Árvore de Decisão">Árvore de Decisão</option>
          <option value="KNN">KNN</option>
        </Form.Select>
        <br />
        {showInput && (
          <Form.Control
            type="text"
            placeholder="Digite o valor de K"
            value={kValue}
            onChange={(e) => setKValue(e.target.value)}
          />
        )}
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <br />
      <br />
      <Button
        onClick={handleUploadButtonClick}
        size="lg"
        variant="success"
      >
        Executar
      </Button>
    </div>
  );
}