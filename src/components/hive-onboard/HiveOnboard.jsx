import React, { useState, useEffect } from "react";
// import { createHiveAccount } from "../../api/hive";
import { Loader } from "../loader/Loader";
import { MdOutlineDownload } from "react-icons/md";
import { getAccount } from "../../hive-client";
import { createHiveAccount, getAccountKeys } from '../../api/hive';
import success from "../../assets/succes.gif";
import "./index.scss";

export const HiveOnboard = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [newHiveAccount, setNewHiveAccount] = useState(null);
  const [message, setMessage] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(true);
  const [feeType, setFeeType] = useState('hive')

  useEffect(() => {
    if (username) {
      getExistingHiveAccount();
    }
  }, [username]);

  const fee = 6;

  const getExistingHiveAccount = async () => {
    setLoading(true);
    try {
      const account = await getAccount(username);
      if (account) {
        setMessage("Username is already taken");
        setUsernameAvailable(true);
      } else {
        setMessage("Username Available ✅");
        setUsernameAvailable(false);
      }
      console.log(account);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };


 

 const getAccountkeys = async () => {
        // e.preventDefault();
        setLoading(true)
        try {
            const response = await getAccountKeys(username)
            console.log(response)
            if(response.success){
                setNewHiveAccount(response.accountDetails);
                setLoading(false)
                setStep(2)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        getAccountkeys()
     
      };

      const handleDownload = () => {
        const accountData = `
          Username: ${newHiveAccount?.username}
          Master Password: ${newHiveAccount?.masterPassword}
          Active Private Key: ${newHiveAccount?.active}
          Active Posting Key: ${newHiveAccount?.posting}
          Active Owner Key: ${newHiveAccount?.owner}
          Active Memo Key: ${newHiveAccount?.memo}
        `;
      
        const blob = new Blob([accountData], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${newHiveAccount?.username}_HiveAccountDetails.txt`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a); 
        setIsDownloaded(false);
      };
      


      const createAccount = async (e) => {
        e.preventDefault();
        console.log("hello")
        setLoading(true)
        // try {

        //     const hiveAccountData = {
        //         username,
        //         email,
        //         fee,
        //         feeType,
        //         // publicKeys: newHiveAccount.publicKeys
        //         accountKeys: newHiveAccount
        //     }

        //     const response = await createHiveAccount(hiveAccountData)
        //     console.log(response)
        //     if(response.success) {
        //         setNewHiveAccount(response.accountDetails)
        //         setLoading(false)
        //         setStep(3)
        //     }
        // } catch (error) {
        //     console.log(error)
        //     setLoading(false)
        // }
    }






  return (
    <div className="hive-onboard-container">
      <div className={`hive-onboard-wrapper ${step === 3? "add-width" : ""}`}>
        {step === 1 && (
          <>
            <h1>Create Hive Account</h1>
            <span className={usernameAvailable ? "warning" : "success"}>
              {message}
            </span>
            <form onSubmit={handleSubmit}>
              {loading && <Loader />}
              <span>Fee: 4.5 Hive(NGN2000)</span>
              <div className="onboard-form-group">
                <input
                  type={"text"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Pick a username"
                  required
                />
              </div>
              <div className="onboard-form-group">
                <input
                  type={"email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="fee-type-selection">
                    <label className='fee-type-label'>
                        <input
                            className='fee-type-input'
                            type="radio"
                            value="hive"
                            checked={feeType === 'hive'}
                            onChange={() => setFeeType('hive')}
                        />
                        Pay with Hive
                    </label>
                    <label className='fee-type-label'>
                        <input
                            className='fee-type-input'
                            type="radio"
                            value="naira"
                            checked={feeType === 'naira'}
                            onChange={() => setFeeType('naira')}
                        />
                        Pay with Naira
                    </label>
                </div>
              <button
                style={{
                  cursor: (loading || usernameAvailable) && "not-allowed",
                }}
                className="onboard-btn"
                disabled={loading || usernameAvailable}
                type="submit"
              >
                Proceed
              </button>
            </form>
          </>
        )}
        {step === 2 && (
          <div className={`hive-onboard-created-wrapper ${step === 3? "add-width" : ""}`}>
            <h1 className="onboard-title">Create Hive Account</h1>
            <div className="hive-account-details">
              <p>Username: {newHiveAccount?.username}</p>
              <p>Master Password: {newHiveAccount?.masterPassword}</p>
              <p>Active Private Key: {newHiveAccount?.active}</p>
              <p>Active Posting Key: {newHiveAccount?.posting}</p>
              <p>Active Owner Key: {newHiveAccount?.owner}</p>
              <p>Active Memo Key: {newHiveAccount?.memo}</p>
            </div>
            <div className="note-wrap note-bgs">
              <header>Please Note:</header>
              <ul className="blink-in">
                <li>
                  Please copy and download you keys 
                </li>
                <li>We don't recover keys for user because we don't save it</li>
                <li>You'll need to be more careful with your Active Key since it has permissions to perform wallet related actions.</li>
              </ul>
            </div>

            <button onClick={handleDownload} className="onboard-btn-download">
              Download Keys <MdOutlineDownload size={24} />
            </button>

            <button onClick={createAccount}
              className={`onboard-btn ${isDownloaded ? "downloaded" : ""}`}
              disabled={isDownloaded}
            >
              <div className="wrap">
                {loading ? (<>
              <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                <span>Creating.....</span>
                </>) : (<span>Create Account</span>)
              
                    }
              </div>
              
            </button>
          </div>
        )}

        {step === 3 && (
          <div className={`hive-onboard-created-wrapper `}>
            <img src={success} alt="" />
            <h2>Congratulations</h2>
            <p  className="sucess-text">
                Your hive account has been created successfully, please check your
                email for your keys
              </p>
          </div>
        )}
      </div>
    </div>
  );
};
