import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("bookHistory")) || [];
    setHistory(storedHistory.slice(0, 5));
  }, []);

  useEffect(() => {
    localStorage.setItem("bookHistory", JSON.stringify(history));
  }, [history]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return; // Validar que no esté vacío
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`
      );
      const data = await response.json();
      const books = data.items.map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(", ") || "Autor desconocido",
      }));
      setResults(books);
    } catch (error) {
      console.error("Error al buscar libros:", error);
    }
  };

  const addToHistory = (book) => {
    const updatedHistory = [book, ...history].slice(0, 5);
    setHistory(updatedHistory);
  };

  const assignCategory = (bookId, category) => {
    const updatedCategories = [...categories];
    updatedCategories[bookId] = category;
    setCategories(updatedCategories);
  };

  return (
    <div className="App">
      <header>
        <h1>Busca Libros</h1>
      </header>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por título o autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      <div className="results">
        <h2>Resultados</h2>
        {results.map((book) => (
          <div key={book.id} className="result-item">
            <h3>{book.title}</h3>
            <p>Autor: {book.author}</p>
            <select
              onChange={(e) => assignCategory(book.id, e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Categorizar
              </option>
              <option value="Aventuras">Aventuras</option>
              <option value="Ciencia Ficción">Ciencia Ficción</option>
              <option value="Histórica">Histórica</option>
              <option value="Novela Negra">Novela Negra</option>
              <option value="Romántica">Romántica</option>
              <option value="Terror">Terror</option>
              <option value="Tecnología">Tecnología</option>
            </select>
            <button onClick={() => addToHistory(book)}>Añadir al Historial</button>
          </div>
        ))}
      </div>
      <div className="history">
        <h2>Últimos 5 libros consultados</h2>
        {history.map((book, index) => (
          <div key={index} className="result-item">
            <h3>{book.title}</h3>
            <p>Autor: {book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;