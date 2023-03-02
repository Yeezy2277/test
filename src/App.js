import './App.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useEffect, useLayoutEffect, useState } from 'react';

function App() {
  const [square, setSquare] = useState([{ id: 1, isMine: false, isChecked: false }]);
  const [bet, setBet] = useState(0);
  const [isEnabledSquare, setEnabledSquare] = useState(false);
  const [mines, setMines] = useState(3);
  const [isLose, setIsLose] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [koeff, setKoeff] = useState(1.0);

  useLayoutEffect(() => {
    setSquare(Array.from({ length: 25 }, (_, i) => i + 1).map(item => {
      return { id: item, isMine: false, isChecked: false }
    }))
  }, [])

  const validateMines = (value) => {
    console.log(value)
    if (value > 24) {
      setMines(24)
    }
    if (value < 1) {
      setMines(1)
    }
    if (value >= 1 && value <= 24) {
      setMines(value)
    }
  };

  const validateBet = (value) => {
    const regex = /^[0-9\b]+$/;
    if (value === '' || regex.test(value)) {
      setBet(value)
    }
  };

  const generateMines = () => {
    if (bet > balance) {
      alert('You dont have enough money')
      return
    }
    setBalance(balance - bet)
    setKoeff(1.0);
    setIsLose(false);
    const mineArr = [];
    while (mineArr.length < mines) {
      const random = Math.floor(Math.random() * 25) + 1;
      if (!mineArr.includes(random)) {
        mineArr.push(random)
      }
    }
    console.log(mineArr);
    setSquare(square.map(item => {
      if (mineArr.includes(item.id)) {
        return { ...item, isChecked: false, isMine: true }
      } else {
        return { ...item, isChecked: false, isMine: false }
      }
    }))
    setEnabledSquare(true)
  };

  useEffect(() => {
    console.log(square)
  }, [square])

  const handleClick = (id) => {
    const currentSquare = square.find(item => item.id === id);
    if (currentSquare.isMine) {
      setIsLose(true);
      setEnabledSquare(false);
      setSquare(square.map(item => {
        return { ...item, isChecked: true }
      }))
    } else {
      setSquare(square.map(item => {
        if (item.id === id) {
          return { ...item, isChecked: true }
        }
        return item
      }))
      setKoeff(koeff + 0.3)
    }
  };

  const resetSquare = () => {
    setSquare(square.map(item => {
      return { id: item.id, isMine: false, isChecked: false }
    }))
  };

  const takeMoney = () => {
    setBalance(balance + bet * koeff);
    setKoeff(1.0);
    setEnabledSquare(false);
    resetSquare();
  };

  return <div className="wrapper">
    <div className='left-side'>
      <div>
        <h1>Balance {balance}$</h1>
        <h1>Bet amount</h1>
        <TextField value={bet} onChange={e => validateBet(e.currentTarget.value)} />
        <h1>Count of mines</h1>
        <div className='mines'>
          {[3, 5, 10, 24].map(item => {
            return <Button variant={mines === item ? "contained" : 'outlined'} onClick={() => setMines(item)}>{item}</Button>
          })}
        </div>
        <h1>Custom value</h1>
        <TextField value={mines} onChange={e => validateMines(e.currentTarget.value)} type={'number'} style={{ width: '100%' }} placeholder='Enter value from 1 to 24' />
        <Button variant="contained" onClick={generateMines} style={{ marginTop: 20 }}>Place bet</Button>
      </div>
    </div>
    <div className='right-side'>
      <p>Koefficient {koeff}</p>
      <div className='square'>
        {square.map(item => {
          return <button style={{ backgroundColor: item.isChecked ? item.isMine ? 'red' : 'green' : 'bisque' }}
            onClick={() => handleClick(item.id)} disabled={!isEnabledSquare}></button>
        })}
      </div>
      {isEnabledSquare ? <Button onClick={takeMoney}>Take money</Button> : null}
      {isLose && <div className='lose'>You lose</div>}
    </div>
  </div>
}

export default App;
