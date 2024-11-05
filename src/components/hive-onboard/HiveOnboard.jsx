import React, { useState, useEffect } from 'react'
import { createHiveAccount } from '../../api/hive'
import { Loader } from '../loader/Loader'
import { MdOutlineDownload } from 'react-icons/md'
import { getAccount } from '../../hive-client'
import "./index.scss"

export const HiveOnboard = () => {

    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1);
    const [newHiveAccount, setNewHiveAccount] = useState(null);
    const [message, setMessage] = useState(null);
    const [usernameAvailable, setUsernameAvailable] = useState(null);

    useEffect(() => {
        if(username) {
            getExistingHiveAccount()
        }
    }, [username])

    const fee = 6

    const getExistingHiveAccount = async () => {
        setLoading(true)
        try {
            const account = await getAccount(username);
            if(account) {
                setMessage("Username is already taken");
                setUsernameAvailable(true)
            } else {
                setMessage("Username Available ✅")
                setUsernameAvailable(false)
            }
            console.log(account)
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {

            const hiveAccountData = {
                username,
                email,
                fee
            }

            const response = await createHiveAccount(hiveAccountData)
            console.log(response)
            if(response.success) {
                setNewHiveAccount(response.accountDetails)
                setLoading(false)
                setStep(2)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
  return (
    <div className='hive-onboard-container'>
      <div className='hive-onboard-wrapper'>
       {step === 1 &&  <>
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
                <button
                    style={{ cursor: (loading || usernameAvailable) && "not-allowed" }}
                    className="onboard-btn"
                    disabled={loading || usernameAvailable}
                    type="submit"
                >
                    Create Account
                </button>
                </form>
        </>}

        {step === 2 && <div className='hive-onboard-created-wrapper'>
            <h1>Account created</h1>
            <ul className='hive-onboard-created-list'>
                <li>Your hive account has been created successfully, please your email for your keys</li>
                <li>Please keep your keys securely, if lost, you will not be able to retrieve it as we do not keep a copy of it.</li>
                <li>You can also download your keys below;</li>
            </ul>
            <div className='hive-account-details'>
                <p>Username: {newHiveAccount?.username}</p>
                <p>Master Password: {newHiveAccount?.masterPassword}</p>
                <p>Active Private Key: {newHiveAccount?.active}</p>
                <p>Active Posting Key: {newHiveAccount?.posting}</p>
                <p>Active Owner Key: {newHiveAccount?.owner}</p>
                <p>Active Memo Key: {newHiveAccount?.memo}</p>
            </div>
            <button className="onboard-btn-download">Download Keys <MdOutlineDownload size={24}/></button>
        </div>}
      </div>
    </div>
  )
}

