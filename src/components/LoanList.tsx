import React, { useState } from 'react';
import { Loan, Book, User, loansApi } from '../services/api';

interface Props {
  loans: Loan[];
  showUser?: boolean;
  onReturned?: () => void;
}

export default function LoanList({ loans, showUser = false, onReturned }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleReturn(loanId: string) {
    setLoadingId(loanId);
    try {
      await loansApi.returnBook(loanId);
      onReturned?.();
    } finally {
      setLoadingId(null);
    }
  }

  if (loans.length === 0) {
    return <p className="text-gray-500 text-sm">Nenhum empréstimo encontrado.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-600">
            {showUser && <th className="px-4 py-2 border-b">Usuário</th>}
            <th className="px-4 py-2 border-b">Livro</th>
            <th className="px-4 py-2 border-b">Emprestado em</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => {
            const book = loan.bookId as Book;
            const user = loan.userId as User;
            return (
              <tr key={loan._id} className="border-b hover:bg-gray-50">
                {showUser && <td className="px-4 py-2">{user?.name ?? '—'}</td>}
                <td className="px-4 py-2 font-medium">{book?.title ?? loan.bookId as string}</td>
                <td className="px-4 py-2 text-gray-500">{new Date(loan.borrowedAt).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${loan.status === 'active' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {loan.status === 'active' ? 'Ativo' : 'Devolvido'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {loan.status === 'active' && !showUser && (
                    <button
                      onClick={() => handleReturn(loan._id)}
                      disabled={loadingId === loan._id}
                      className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 disabled:opacity-40"
                    >
                      {loadingId === loan._id ? '...' : 'Devolver'}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
