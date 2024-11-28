import React, { useEffect, useState } from 'react';
import { fetchCryptoData, addAsset, removeAsset } from '../api/ekzat';
import { useSelector, useDispatch } from 'react-redux';
import './wallet-page.scss';
import { FaGift, FaArrowUp, FaArrowDown, FaExchangeAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { getUserProfile } from '../api/profile';
import { toast } from 'react-toastify';
import { Loader } from '../components/loader/Loader';

export const WalletPage = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredCryptoData, setFilteredCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const user = useSelector((state) => state.ekzaUser.user);
  const selectedCurrency = useSelector((state) => state.currency.selectedCurrency);
  const dispatch = useDispatch()

  useEffect(() => {
    getCryptoData();
  }, []);

  useEffect(() => {
    const filteredData = cryptoData.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCryptoData(filteredData);
  }, [searchTerm, cryptoData]);

  const getCryptoData = async () => {
    try {
      const response = await fetchCryptoData();
      if (response?.data?.success) {
        const { usdData, ngnData } = response.data.cryptoData;
        setCryptoData(selectedCurrency === 'USD' ? usdData : ngnData);
        setFilteredCryptoData(selectedCurrency === 'USD' ? usdData : ngnData);
      } else {
        setError(response?.data?.message || 'Failed to fetch data.');
      }
    } catch (error) {
      setError('An error occurred while fetching the data.');
    } finally {
      setLoading(false);
    }
  };

  const addTokenToWallet = async (coinId) => {
    setLoading(true)
    try {
      const response = await addAsset(coinId)
      if(response.success){
        toast.success(response.message,{
          style: {
            backgroundColor: 'rgba(229, 229, 229, 0.1)',
            color: '#fff',
            fontSize: '16px',
            marginTop: "60px"
          },
        });
        getUserProfile(dispatch)
      } else {
        toast.error(response.message + "try again",{
          style: {
            backgroundColor: 'rgba(229, 229, 229, 0.1)',
            color: '#fff',
            fontSize: '16px',
            marginTop: "60px"
          },
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
      toast.error(error.message || "Error adding asset",{
        style: {
          backgroundColor: 'rgba(229, 229, 229, 0.1)',
          color: '#fff',
          fontSize: '16px',
          marginTop: "60px"
        },
      });
    }
  };
  const removeTokenFromWallet = async (coinId) => {
    try {
      const response = await removeAsset(coinId)
        toast.success("remove...",{
          style: {
            backgroundColor: 'rgba(229, 229, 229, 0.1)',
            color: '#fff',
            fontSize: '16px',
            marginTop: "60px"
          },
        });
        getUserProfile(dispatch)
     
    } catch (error) {
      // console.log(error)
      toast.error( "Error adding asset",{
        style: {
          backgroundColor: 'rgba(229, 229, 229, 0.1)',
          color: '#fff',
          fontSize: '16px',
          marginTop: "60px"
        },
      });
    }
  };

  const isAssetAdded = (coinId) => {
    return user?.assets?.some(asset => asset.coinId === coinId);
  };

  return (
    <div className="wallet-page-container">
      <h2 className="wallet-page-title">{user.username}'s Crypto Portfolio</h2>

      <div className="wallet-top-actions-wrapper">
        <div className="wallet-actions">
          Send<FaArrowUp title="Send" />
        </div>
        <div className="wallet-page-reward-value wallet-actions">
          Receive<FaArrowDown title="Receive" />
        </div>
        <div className="wallet-page-reward-value wallet-actions">
          Buy/Sell<FaExchangeAlt title="Sell" />
        </div>
      </div>

      <div className="wallet-page-assets-tokens">
        <div className="wallet-page-portfolio-wrap">
          <div className="wallet-page-card-wrap">
            <div className="wallet-page-card-title">
              <div className="wallet-page-card-icon">
                <FaGift size={20} />
              </div> 
              <h4>Assets</h4>
            </div>

            <div className="wallet-page-card-balance">
              <h2>
                <span className="wallet-page-strike-currency">
                  {selectedCurrency === 'USD' ? '$' : '₦'}
                </span>
                {selectedCurrency === 'USD' 
                  ? user?.totalUsdValue?.toFixed(4)
                  : user?.totalNairaValue?.toFixed(4)}
              </h2>
            </div>

            <div className="wallet-page-card-component-wrap">
              <div className="wallet-page-card-headings">
                <h5>Coin</h5>
                <h5>Balances</h5>
                <h5>Last 24hr</h5>
                <h5>Send</h5>
                <h5>Receive</h5>
                <h5>Buy/Sell</h5>
              </div>

              {user?.assets?.map((u) => (
                <div key={u.coinId} className="wallet-page-card-component">
                  <div className="wallet-page-card-reward">
                    <div className="wallet-page-reward-value wallet-page-token-item-coin-info">
                      <img src={u.image} alt={u.currency} />
                      <div>
                        <h5>{u.symbol?.toUpperCase()}</h5>
                        <p>{u.balance?.toFixed(4)}</p>
                      </div>
                    </div>
                    <div className="wallet-page-reward-value wallet-balance">
                      <div>
                        <p>
                          {selectedCurrency === 'USD' 
                            ? `$${u.asseUsdtWorth?.toFixed(3)}`
                            : `₦${u.assetNairaWorth?.toFixed(3)}`}
                        </p>
                      </div>
                      <div style={{ color: u.percentageChange < 0 ? 'red' : 'green' }}>
                        <span>
                          {u.percentageChange?.toFixed(3)}%
                        </span>
                        <span>
                          ({u.percentageChange < 0 ? '↓' : '↑'})
                        </span>
                      </div>
                    </div>
                    <div className="wallet-page-reward-value">
                      <div style={{ color: u.percentageChange < 0 ? 'red' : 'green' }}>
                        <span>
                          {selectedCurrency === 'USD' 
                            ? (u.balance * u.priceChangeUsd)?.toFixed(3)
                            : (u.balance * u.priceChangeNgn)?.toFixed(3)
                            }
                        </span>
                        <span>
                          ({u.percentageChange < 0 ? '↓' : '↑'})
                        </span>
                      </div>
                    </div>
                    <div className="wallet-page-reward-value wallet-actions">
                      Send<FaArrowUp title="Send" />
                    </div>
                    <div className="wallet-page-reward-value wallet-actions">
                      Receive<FaArrowDown title="Receive" />
                    </div>
                    <div className="wallet-page-reward-value wallet-actions">
                      Buy/Sell<FaExchangeAlt title="Sell" />
                    </div>
                    <div onClick={() => removeTokenFromWallet(u.coinId)} className="wallet-page-reward-value wallet-actions">
                      Remove<FaExchangeAlt title="Sell" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="wallet-page-add-token">
          <h3>Listed Tokens</h3>

          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="wallet-page-search-input"
          />
          {loading && <p className="wallet-page-loading">Loading...</p>}
          {error && <p className="wallet-page-error">{error}</p>}
          {filteredCryptoData?.map((coin) => (
            <div key={coin.id} className="wallet-page-token-item">
              <div className="wallet-page-token-item-coin-info">
                <img src={coin.image} alt={coin.name} className="wallet-page-token-image" />
                <span>{coin.name}</span>
              </div>
              {isAssetAdded(coin.id) ? <button
                className="wallet-page-btn"
                onClick={() => removeTokenFromWallet(coin.id)}
                style={{cursor: "not-allowed"}}
                disabled
              >
                Coin Added
              </button> :
              <button
                className="wallet-page-btn"
                onClick={() => addTokenToWallet(coin.id)}
                disabled={loading}
                style={{cursor: loading && "not-allowed"}}
              >
                Add Coin<FaPlus />
              </button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
