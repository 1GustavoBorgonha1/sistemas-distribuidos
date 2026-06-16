import React, { useEffect, useState } from 'react';
import { loansApi, Loan } from '../services/api';
import LoanList from '../components/LoanList';

export default function MyLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLoans() {
    setLoading(true);
    try {
      const { data } = await loansApi.myLoans();
      setLoans(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchLoans(); }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Meus Empréstimos</h2>
      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <LoanList loans={loans} onReturned={fetchLoans} />
      )}
    </div>
  );
}
