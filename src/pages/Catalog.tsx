import React, { useEffect, useState, useCallback } from 'react';
import { booksApi, Book } from '../services/api';
import BookCard from '../components/BookCard';

export default function Catalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await booksApi.list(query || undefined);
      setBooks(data);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(fetchBooks, 300);
    return () => clearTimeout(timer);
  }, [fetchBooks]);

  function handleBorrowed() {
    setFeedback('Empréstimo realizado com sucesso!');
    fetchBooks();
    setTimeout(() => setFeedback(''), 3000);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Catálogo de Livros</h2>
      <input
        type="text"
        placeholder="Buscar por título ou autor..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded px-3 py-2 w-full max-w-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {feedback && <p className="text-green-600 text-sm mb-4">{feedback}</p>}
      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : books.length === 0 ? (
        <p className="text-gray-500">Nenhum livro encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <BookCard key={book._id} book={book} onBorrowed={handleBorrowed} />
          ))}
        </div>
      )}
    </div>
  );
}
