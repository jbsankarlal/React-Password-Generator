import React, { useEffect, useState } from 'react'
import { FaClipboard } from "react-icons/fa"
import { toast } from 'react-hot-toast'
import { useForm } from './useForm'
import { getRandomChar, getSpecialChar } from './utils';

function App() {

    const [values, setValues] = useForm({
        length: 6,
        capital: true,
        small: true,
        number: false,
        symbol: false
    })


    const [result, setResult] = useState("");
    const [lastPasswords, setLastPasswords] = useState([]);

    useEffect(() => {
        const storedPasswords = JSON.parse(localStorage.getItem('lastPasswords') || '[]');
        setLastPasswords(storedPasswords);
    }, []);

    const saveLastPasswords = (password) => {
        const updatedPasswords = [password, ...lastPasswords.slice(0, 4)];
        setLastPasswords(updatedPasswords);
        localStorage.setItem('lastPasswords', JSON.stringify(updatedPasswords));
    };


    const fieldsArray = [
        {
            field: values.capital,
            getChar: () => getRandomChar(65, 90)
        },
        {
            field: values.small,
            getChar: () => getRandomChar(97, 122)
        },
        {
            field: values.number,
            getChar: () => getRandomChar(48, 57)
        },
        {
            field: values.symbol,
            getChar: () => getSpecialChar()
        },

    ]

    const handleOnSubmit = (e) => {
        e.preventDefault();
        let generatedPassword = '';
        const checkedFields = fieldsArray.filter(({ field }) => field);

        for (let i = 0; i < values.length; i++) {
            const index = Math.floor(Math.random() * checkedFields.length);
            const letter = checkedFields[index]?.getChar();

            if (letter) {
                generatedPassword += letter;
            }
        }
        if (generatedPassword) {
            setResult(generatedPassword);
            saveLastPasswords(generatedPassword);
        } else {
            toast.error(' Please select at least one option');
        }
    };

    const handleClipboard = async () => {
        if (result) {
            await navigator.clipboard.writeText(result);
            toast.success('Copied to your clipboard');
        } else {
            toast.error('No password to copy');
        }
    };



    return (

        <section>
            <div></div>
            <div className="container">
                <form id='pg-form' onSubmit={handleOnSubmit}>
                    <div className="result">
                        <input type="text" placeholder='Minimum 6 character' id='result' readOnly value={result} />
                        <div className='clipboard' onClick={handleClipboard}>
                            <FaClipboard></FaClipboard>
                        </div>
                    </div>
                    <div>
                        <div className="field">
                            <label htmlFor="length">Length</label>
                            <input type="number" id='length' min={6} max={10} name='length' value={values.length}
                                onChange={setValues} />
                        </div>
                        <div className="field">
                            <label htmlFor="capital">Capital</label>
                            <input type="checkbox" id='capital' name='capital' checked={values.capital}
                                onChange={setValues} />
                        </div>
                        <div className="field">
                            <label htmlFor="small">Small</label>
                            <input type="checkbox" id='small' name='small' checked={values.small}
                                onChange={setValues} />
                        </div>
                        <div className="field">
                            <label htmlFor="number">Number</label>
                            <input type="checkbox" id='number' name='number' checked={values.number}
                                onChange={setValues} />
                        </div>
                        <div className="field">
                            <label htmlFor="symbol">Symbol</label>
                            <input type="checkbox" id='symbol' name='symbol' checked={values.symbol}
                                onChange={setValues} />
                        </div>
                    </div>
                    <button type='submit'>Generate Password</button>
                </form>
                <br />
                <div className="last-passwords">
                    <h4 className='password-header'>Last 5 Passwords:</h4><br />
                    <ol>
                        {lastPasswords.map((password, index) => (
                            <li key={index}>{password}</li>
                        ))}
                    </ol>
                </div>
            </div>

        </section>

    )
}

export default App