import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getCages } from '@store/slices/cageSlice';
import Button from '@common/Button/Button';
import './CAGEManagement.css';

const CAGEManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { cages, isLoading, pagination } = useSelector((state) => state.cage);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCages, setSelectedCages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    dispatch(getCages({ page: currentPage, perPage, search: searchTerm }));
  }, [dispatch, currentPage, perPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCages(cages.map((cage) => cage.id));
    } else {
      setSelectedCages([]);
    }
  };

  const handleSelectCage = (id) => {
    setSelectedCages((prev) =>
      prev.includes(id) ? prev.filter((cageId) => cageId !== id) : [...prev, id]
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="cage-management">
      <div className="page-header">
        <h1 className="page-title">{t('cage.management')}</h1>
      </div>

      <div className="cage-controls">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder={t('cage.searchPlaceholder')}
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="action-buttons">
          <Button variant="outline" size="small">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="4" y1="21" x2="4" y2="14" strokeWidth="2" />
              <line x1="4" y1="10" x2="4" y2="3" strokeWidth="2" />
              <line x1="12" y1="21" x2="12" y2="12" strokeWidth="2" />
              <line x1="12" y1="8" x2="12" y2="3" strokeWidth="2" />
              <line x1="20" y1="21" x2="20" y2="16" strokeWidth="2" />
              <line x1="20" y1="12" x2="20" y2="3" strokeWidth="2" />
            </svg>
            {t('cage.filters')}
          </Button>
          <Button variant="primary" size="small">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" />
              <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" />
            </svg>
            {t('cage.addNew')}
          </Button>
          <Button variant="outline" size="small">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" />
              <polyline points="17 8 12 3 7 8" strokeWidth="2" />
              <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" />
            </svg>
          </Button>
          <Button variant="outline" size="small">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" />
              <polyline points="7 10 12 15 17 10" strokeWidth="2" />
              <line x1="12" y1="15" x2="12" y2="3" strokeWidth="2" />
            </svg>
          </Button>
          <Button variant="outline" size="small">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
              <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
              <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div className="loading-state">{t('common.loading')}</div>
        ) : (
          <table className="cage-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedCages.length === cages.length && cages.length > 0}
                  />
                </th>
                <th>{t('cage.code')}</th>
                <th>{t('cage.name')}</th>
                <th>{t('cage.street')}</th>
                <th>{t('cage.city')}</th>
                <th>{t('cage.state')}</th>
                <th>{t('cage.country')}</th>
                <th>{t('cage.postCode')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {cages.map((cage) => (
                <tr key={cage.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCages.includes(cage.id)}
                      onChange={() => handleSelectCage(cage.id)}
                    />
                  </td>
                  <td>{cage.cageCode}</td>
                  <td>{cage.name}</td>
                  <td>{cage.street}</td>
                  <td>{cage.city}</td>
                  <td>{cage.state}</td>
                  <td>{cage.country}</td>
                  <td>{cage.postCode}</td>
                  <td>
                    <button className="action-button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="1" fill="currentColor" />
                        <circle cx="12" cy="5" r="1" fill="currentColor" />
                        <circle cx="12" cy="19" r="1" fill="currentColor" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <div className="pagination-info">
          <span>
            {t('cage.perPage')}:{' '}
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="per-page-select"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </span>
          <span className="pagination-range">
            {(currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, pagination.total)}{' '}
            {t('cage.of')} {pagination.total}
          </span>
        </div>

        <div className="pagination-buttons">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="15 18 9 12 15 6" strokeWidth="2" />
            </svg>
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pagination.totalPages}
            className="pagination-button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9 18 15 12 9 6" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CAGEManagement;
