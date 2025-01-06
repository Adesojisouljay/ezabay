import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux";
import { logout } from "../../redux/userReducer";
import { clearCurrency } from "../../redux/currencySlice";
import "./invalid-token-modal.scss"

export const InvalidTokenModal = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showModal, setShoeModal] = useState(true);
    
    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCurrency());
        localStorage.removeItem("token")
        setShoeModal(!showModal);
        navigate('/login');
        window.location.reload();
      };

    return (
        <>
            <div className={`fadded-container modal-overlay ${showModal ? 'open' : ''}`} >
                <div className={`modal-overlay  ${showModal ? 'open' : ''}`}> </div>
                {showModal && <div className="modal">
                    <div className="modal-content">
                        <h2>Session Expired</h2>
                        <p>Your session has expired. Please log in again.</p>
                        <button onClick={handleLogout}>
                        Go to Login
                        </button>
                    </div>
                </div>}
            </div>
        </>
    )
  };