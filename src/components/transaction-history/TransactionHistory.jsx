import React, { useEffect, useState } from 'react';
import { fetchTransactionHistory } from '../../api/transaction';
import "./transaction-history.scss";

export const TransactionHistory = () => {
  const [trxHistory, setTrxHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 15;

  useEffect(() => {
    getTrx();
  }, []);

  const getTrx = async () => {
    try {
      const data = await fetchTransactionHistory();
      if (data.success) {
        setTrxHistory(data.transactionH);
      } else {
        console.error("Failed to fetch transaction history:", data.message);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = trxHistory.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const totalPages = Math.ceil(trxHistory.length / transactionsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;

    if (totalPages <= maxPageNumbersToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1, 2, 3);

      if (currentPage > 5) pageNumbers.push('...');

      for (let i = Math.max(4, currentPage - 1); i <= Math.min(totalPages - 3, currentPage + 1); i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 4) pageNumbers.push('...');

      pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
    }

    return pageNumbers.map((page, index) => (
      <button
        key={index}
        className={`transaction-history__page-btn ${currentPage === page ? 'active' : ''}`}
        onClick={() => paginate(page)}
        disabled={typeof page === 'string'}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className="transaction-history-container">
      <div className="transaction-history">
        <div className="transaction-history__header">
          <h3>Transaction History</h3>
        </div>
        <div className="transaction-history__table-wrap">
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Currency</th>
                <th>Amount</th>
                <th>TxId</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="transaction-history__table-body">
              {currentTransactions.length === 0 && (
                <tr className="transaction-history__no-history">
                  <td colSpan="6">
                    <p>No History</p>
                  </td>
                </tr>
              )}

              {currentTransactions.map((t, index) => (
                <tr key={t.trxId}>
                  <td>{indexOfFirstTransaction + index + 1}</td>
                  <td className="transaction-history__currency-wrap">
                    <img src={"hive"} alt="" />
                    <span>{t.currency}</span>
                  </td>
                  <td
                    className={
                      t.type === 'deposit' || t.type === 'buy'
                        ? 'transaction-history__deposit'
                        : t.type === 'withdrawal' || t.type === 'sell'
                        ? 'transaction-history__withdrawal'
                        : ''
                    }
                  >
                    {t.amount}
                  </td>
                  <td>{t.trxId.slice(0, 5)}...{t.trxId.slice(-5)}</td>
                  <td>{new Date(t.timestamp).toLocaleDateString()}</td>
                  <td
                    className={
                      t.type === 'deposit' || t.type === 'buy'
                        ? 'transaction-history__deposit'
                        : t.type === 'withdrawal' || t.type === 'sell'
                        ? 'transaction-history__withdrawal'
                        : ''
                    }
                  >
                    {t.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="transaction-history__pagination">
          <button
            className="transaction-history__page-btn"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            className="transaction-history__page-btn"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
