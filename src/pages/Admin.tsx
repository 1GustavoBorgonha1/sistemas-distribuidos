import React, { useEffect, useState } from 'react';
import { booksApi, loansApi, Loan } from '../services/api';
import LoanList from '../components/LoanList';

export default function Admin() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loansLoading, setLoansLoading] = useState(true);
  const [form, setForm] = useState({ title: '', author: '', isbn: '', totalQty: 1 });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function fetchLoans() {
    setLoansLoading(true);
    try {
      const { data } = await loansApi.allLoans();
      setLoans(data);
    } finally {
      setLoansLoading(false);
    }
  }

  useEffect(() => { fetchLoans(); }, []);

  async function handleAddBook(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    setFormSuccess('');
    try {
      await booksApi.create({ ...form, totalQty: Number(form.totalQty) });
      setFormSuccess(`Livro "${form.title}" adicionado com sucesso!`);
      setForm({ title: '', author: '', isbn: '', totalQty: 1 });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Erro ao adicionar livro';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Adicionar Livro</h2>
        <form onSubmit={handleAddBook} className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          <input
            placeholder="Título"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 col-span-2"
          />
          <input
            placeholder="Autor"
            required
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="ISBN"
            required
            value={form.isbn}
            onChange={(e) => setForm({ ...form, isbn: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            min={1}
            placeholder="Quantidade"
            required
            value={form.totalQty}
            onChange={(e) => setForm({ ...form, totalQty: parseInt(e.target.value) })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 sm:col-span-2"
          >
            {submitting ? 'Adicionando...' : 'Adicionar Livro'}
          </button>
          {formError && <p className="text-red-500 text-sm sm:col-span-2">{formError}</p>}
          {formSuccess && <p className="text-green-600 text-sm sm:col-span-2">{formSuccess}</p>}
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Todos os Empréstimos</h2>
        {loansLoading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : (
          <LoanList loans={loans} showUser />
        )}
      </section>
    </div>
  );
}
