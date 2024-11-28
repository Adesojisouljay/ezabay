import React, { useState, useEffect, useRef } from "react";
import { Loader } from "../loader/Loader";
import { useSelector } from "react-redux";
import { MdOutlineDownload } from "react-icons/md";
import { getAccount } from "../../hive-client";
import { createHiveAccount, getAccountKeys } from '../../api/hive';
import { validateHiveUsername } from "../../utils";
import success from "../../assets/succes.gif";
import "./index.scss";

export const HiveOnboard = () => {

    const user = useSelector((state) => state.ekzaUser.user);
    const hiveAsset = user?.assets[0]
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1);
    const [newHiveAccount, setNewHiveAccount] = useState(null);
    const [message, setMessage] = useState(null);
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [usernameValid, setUsernameValid] = useState(null);
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [feeType, setFeeType] = useState('hive');

      const debounceTimer = useRef(null);

  useEffect(() => {
    if (username) {
      getExistingHiveAccount();
    }
  }, [username]);

  const fee = 4.5;

  const getExistingHiveAccount = async () => {
    setLoading(true);
    validateUsernameWithDelay(username);
    try {
      const account = await getAccount(username);
      if (account) {
        setMessage("Username is already taken");
        setUsernameAvailable(false);
      } else {
        setMessage("Username Available ✅");
        setUsernameAvailable(true);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const validateUsernameWithDelay = (newUsername) => {
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const isValid = validateHiveUsername(newUsername, setMessage);
      if (isValid) {
        setUsernameValid(true)
      } else {
        setUsernameValid(false)
      }
    }, 500);
  };

  const usernameChanged = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername.toLowerCase());
  };

 const getkeys = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await getAccountKeys(username)
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

      const handleDownload = () => {
        const accountData = `

         Please handle your password & private keys with extra caution. Your account will no longer be accessible if you loose your password. We do not keep copy of it, it is confidential only you have access to it.
        We recommend that;
        1. PRINT this file out and store it securely.
        2. NEVER use your password/owner key on untrusted apps.
        3. Save all your keys within a password manager, as you will need them frequently.
        4. Don't keep this file within the reach of a third party.
    
            Your Hive Account Information

          Username: ${newHiveAccount?.username}

          Master Password: ${newHiveAccount?.masterPassword}

          Active Private Key: ${newHiveAccount?.active}

          Active Posting Key: ${newHiveAccount?.posting}

          Active Owner Key: ${newHiveAccount?.owner}

          Active Memo Key: ${newHiveAccount?.memo}


                        WHAT YOUR KEYS ARE USED FOR

            Owner key: "Change Password, Change Keys, Recover Account",

            Active key: "Transfer Funds, Power up/down, Voting Witnesses/Proposals",

            Posting key: "Post, Comment, Vote, Reblog, Follow, Profile updates",

            Memo key: "Send/View encrypted messages on transfers",
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
        setIsDownloaded(true);
      };
      
      const createAccount = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {

            const hiveAccountData = {
                username,
                email,
                fee: feeType === "hive" ? fee : (hiveAsset.nairaValue * 4.5).toFixed(3),
                feeType,
                accountKeys: newHiveAccount
            }

            const response = await createHiveAccount(hiveAccountData)
            if(response.success) {
                setNewHiveAccount(response.accountDetails)
                setLoading(false)
                setStep(3)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

  return (
    <div className="hive-onboard-container">
      <div className={`hive-onboard-wrapper ${step === 3? "add-width" : ""}`}>
        {step === 1 && (
          <>
            <h1>Create Hive Account</h1>
            <span className={(!usernameAvailable || !usernameValid) ? "warning" : "success"}>
              {message}
            </span>
            <form onSubmit={getkeys}>
              {loading && <Loader />}
              <span>Fee: 4.5 Hive(₦{(hiveAsset.nairaValue * 4.5).toFixed(3)})</span>
              <div className="onboard-form-group">
                <input
                  type={"text"}
                  value={username}
                  onChange={usernameChanged}
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
                            value="NGN"
                            checked={feeType === 'NGN'}
                            onChange={() => setFeeType('NGN')}
                        />
                        Pay with Naira
                    </label>
                </div>
              <button
                style={{
                  cursor: (loading || !usernameAvailable || !usernameValid) && "not-allowed",
                }}
                className="onboard-btn"
                disabled={loading || !usernameAvailable || !usernameValid}
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
            style={{cursor: isDownloaded ? "" : "not-allowed"}}
              className={`onboard-btn ${!isDownloaded ? "downloaded" : ""}`}
              disabled={!isDownloaded}
            >
              <div className="wrap">
                {loading ? (<>
              <div class="lds-spinner">
                <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
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
