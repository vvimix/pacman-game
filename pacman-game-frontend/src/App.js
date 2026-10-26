import React, { useState } from 'react';
import './App.css';
import Game from './components/Game';
import OnlineGame from './components/OnlineGame';

function Lobby({ onOffline, onHost, onHostParty, onJoin }) {
  const [code, setCode] = useState('');
  const [partyMode, setPartyMode] = useState('coop');
  const [partyMax, setPartyMax] = useState(8);

  return (
    <div className="lobby">
      <h1 className="lobby-brand">PAC-MAN</h1>
      <p className="lobby-tagline">Arcade co-op — offline or online rooms</p>

      <div className="lobby-actions">
        <button type="button" className="lobby-btn primary" onClick={onOffline}>
          Play offline
        </button>
        <button type="button" className="lobby-btn" onClick={onHost}>
          Host online (2P)
        </button>

        <div className="lobby-party">
          <div className="lobby-party-label">Host party (2–8)</div>
          <div className="lobby-party-row">
            <label>
              Mode
              <select value={partyMode} onChange={(e) => setPartyMode(e.target.value)}>
                <option value="coop">Co-op</option>
                <option value="ffa">Free-for-all</option>
                <option value="survive">Survive</option>
                <option value="teams">Teams</option>
              </select>
            </label>
            <label>
              Max
              <select
                value={partyMax}
                onChange={(e) => setPartyMax(Number(e.target.value))}
              >
                {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="button"
            className="lobby-btn"
            onClick={() => onHostParty({ mode: partyMode, maxPlayers: partyMax })}
          >
            Host party
          </button>
        </div>

        <form
          className="lobby-join"
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = code.trim().toUpperCase();
            if (trimmed.length >= 4) onJoin(trimmed);
          }}
        >
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ROOM CODE"
            aria-label="Room code"
          />
          <button type="submit" className="lobby-btn" disabled={code.trim().length < 4}>
            Join online
          </button>
        </form>
      </div>

      <p className="lobby-hint">
        Online needs the local server on port 3001. Party modes: Co-op, FFA, Survive (1 life, last
        Pac wins), Teams (P1–4 vs P5–8). Everyone uses WASD / arrows.
      </p>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState('lobby');
  const [joinCode, setJoinCode] = useState('');
  const [hostOpts, setHostOpts] = useState({ maxPlayers: 2, mode: 'coop' });

  if (screen === 'offline') {
    return (
      <div className="App">
        <button type="button" className="back-lobby" onClick={() => setScreen('lobby')}>
          ← Lobby
        </button>
        <Game />
      </div>
    );
  }

  if (screen === 'host' || screen === 'join') {
    return (
      <div className="App">
        <OnlineGame
          mode={screen === 'host' ? 'host' : 'join'}
          joinCode={joinCode}
          hostOptions={hostOpts}
          onLeave={() => {
            setJoinCode('');
            setHostOpts({ maxPlayers: 2, mode: 'coop' });
            setScreen('lobby');
          }}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <Lobby
        onOffline={() => setScreen('offline')}
        onHost={() => {
          setHostOpts({ maxPlayers: 2, mode: 'coop' });
          setScreen('host');
        }}
        onHostParty={({ mode, maxPlayers }) => {
          setHostOpts({ mode, maxPlayers });
          setScreen('host');
        }}
        onJoin={(code) => {
          setJoinCode(code);
          setScreen('join');
        }}
      />
    </div>
  );
}

export default App;
