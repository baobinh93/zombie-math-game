import React from 'react';
import ImageIcon from './ImageIcon.jsx';

const activeStatuses = ['playing', 'shooting', 'dying'];

export default function QuestionPanel({ campaign, stageIndex, questionIndex, question, status, feedback, timeLeft, timeLimit, streak, onAnswer, onRetry }) {
  const stage = campaign[stageIndex];
  const active = activeStatuses.includes(status);
  const progress = Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100));
  return (
    <section className="question-panel">
      <div className="panel-head">
        <div><span className="eyebrow">THỬ THÁCH TOÁN HỌC</span><h2>{stage?.name || 'Chiến dịch hoàn thành'}</h2></div>
        <div className="question-count">{String(stageIndex + 1).padStart(2, '0')}<span> / 10</span></div>
      </div>
      <div className="stage-progress"><div style={{ width: `${(stageIndex / 10) * 100}%` }} /></div>

      {active && question ? <>
        <div className="question-meta"><span>MÀN {stageIndex + 1} · CÂU {questionIndex + 1}/20</span><span>ĐỘ KHÓ {stageIndex + 1}/10</span></div>
        <div className={`timer-box ${progress <= 20 ? 'timer-danger' : ''}`}>
          <div className="timer-label"><span>THỜI GIAN TRẢ LỜI</span><span className="timer-status">{progress <= 20 ? 'NGUY HIỂM' : 'ĐANG ĐẾM NGƯỢC'}</span></div>
          <div className="timer-track" role="progressbar" aria-label="Thời gian còn lại" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><div style={{ width: `${progress}%` }} /></div>
        </div>
        <div className="math-question"><span>{question.expression}</span><b>= ?</b></div>
        <div className="answer-grid">{question.options.map((option, i) => <button key={`${question.id}-${option}`} className="answer-button" disabled={status !== 'playing'} onClick={() => onAnswer(option)}><span className="answer-letter">{['A', 'B', 'C', 'D'][i]}</span><strong>{option}</strong><span className="answer-arrow">↗</span></button>)}</div>
        <div className={`feedback ${feedback.type ? `feedback-${feedback.type}` : ''}`}>{feedback.text || <><ImageIcon name="target" size={15} /> Trả lời đúng để bắn hạ zombie</>}</div>
        <div className="panel-bottom"><div className="streak"><ImageIcon name="zap" size={15} /><span>CHUỖI ĐÚNG</span><b>{streak}×</b></div><span className="wrong-rule">Sai: giữ nguyên câu</span></div>
      </> : <div className="waiting-panel">
        <div className="waiting-symbol"><ImageIcon name={status === 'won' ? 'trophy' : status === 'lost' ? 'skull' : status === 'paused' ? 'shield' : 'target'} size={30} /></div>
        <strong>{status === 'won' ? 'CHIẾN THẮNG TOÀN CHIẾN DỊCH' : status === 'lost' ? 'NHIỆM VỤ THẤT BẠI' : status === 'paused' ? 'ĐANG TẠM DỪNG' : status === 'stageComplete' ? 'MÀN CHƠI HOÀN THÀNH' : status === 'stageIntro' ? 'SẴN SÀNG VÀO MÀN' : status === 'lifeLost' ? 'ĐANG ĐẶT LẠI LƯỢT' : 'CHUẨN BỊ CHIẾN ĐẤU'}</strong>
        <p>{status === 'won' ? 'Bạn đã vượt qua đủ 10 màn và 200 câu hỏi!' : status === 'lost' ? 'Bạn đã dùng hết 3 mạng. Hãy thử lại để phá kỷ lục.' : status === 'paused' ? 'Nhấn tiếp tục trên sân đấu để bắt đầu lại lượt hiện tại.' : status === 'stageComplete' ? 'Bấm tiếp tục trên sân đấu để chuẩn bị màn tiếp theo.' : status === 'stageIntro' ? 'Bấm vào màn chơi để bắt đầu zombie và thanh thời gian.' : status === 'lifeLost' ? 'Câu hỏi không thay đổi; zombie và đồng hồ sẽ được đặt lại.' : 'Nhấn bắt đầu để chiến đấu qua 10 màn.'}</p>
        {status === 'lost' && <button className="primary-button" onClick={onRetry}><ImageIcon name="retry" size={16} /> CHƠI LẠI TỪ ĐẦU</button>}
      </div>}
    </section>
  );
}
