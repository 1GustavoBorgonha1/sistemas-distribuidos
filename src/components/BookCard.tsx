import React, { useState } from 'react';
import { Book, loansApi } from '../services/api';

interface Props {
  book: Book;
  onBorrowed?: () => void;
}

export default function BookCard({ book, onBorrowed }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleBorrow() {
    setLoading(true);
    setError('');
    try {
      await loansApi.borrow(book._id);
      onBorrowed?.();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Erro ao emprestar';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2">
      <h3 className="font-semibold text-gray-800 leading-snug">{book.title}</h3>
      <p className="text-sm text-gray-500">{book.author}</p>
      <p className="text-xs text-gray-400">ISBN: {book.isbn}</p>
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className={`text-sm font-medium ${book.availableQty > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {book.availableQty > 0 ? `${book.availableQty} disponível(is)` : 'Indisponível'}
        </span>
        <button
          onClick={handleBorrow}
          disabled={book.availableQty < 1 || loading}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '...' : 'Pegar Emprestado'}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
