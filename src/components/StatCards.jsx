import React from 'react';
import ImageIcon from './ImageIcon.jsx';

export default function StatCards({ health, score, stageIndex }) {
  return (
    <div className="stat-cards">
      <div className="stat-card health-card">
        <div className="stat-icon"><ImageIcon name="heart" size={18} /></div>
        <div><span className="stat-label">MẠNG SỐNG</span><div className="hearts">{[0, 1, 2].map((i) => <span key={i} className={i < health ? 'heart-full' : 'heart-empty'}>♥</span>)}</div></div>
        <b>{health}<small>/3</small></b>
      </div>
      <div className="stat-card score-card">
        <div className="stat-icon"><ImageIcon name="trophy" size={18} /></div>
        <div><span className="stat-label">ĐIỂM THƯỞNG</span><strong>{score * 100}</strong></div>
        <span className="score-plus">MÀN {stageIndex + 1} · THỬ THÁCH</span>
      </div>
    </div>
  );
}
