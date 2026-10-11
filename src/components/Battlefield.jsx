import React from "react";
import Character from "./Character.jsx";
import ZombieSprite from "./ZombieSprite.jsx";
import ImageIcon from "./ImageIcon.jsx";

export default function Battlefield({
  status,
  stageIndex,
  stageName,
  timeLimit,
  questionIndex,
  health,
  score,
  zombies,
  flash,
  zombieHit,
  shot,
  soundEnabled,
  onToggleSound,
  onPause,
  onResume,
  onStart,
  onBeginStage,
  onContinueStage,
  onRetry,
  notice,
}) {
  const stageNo = stageIndex + 1;
  const showZombie = [
    "playing",
    "shooting",
    "dying",
    "paused",
    "lifeLost",
  ].includes(status);
  const overlay = [
    "ready",
    "stageIntro",
    "stageComplete",
    "paused",
    "lifeLost",
    "won",
    "lost",
  ].includes(status);

  return (
    <div className={`battlefield ${flash ? "battle-flash" : ""}`}>
      <div className="sky-glow" />
      <div className="moon" />
      <div className="city city-back">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="city city-front">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="ground">
        <div className="ground-line" />
      </div>

      <div className="player-unit">
        <Character stage={stageNo} />
        <div className="unit-label">SHINE ●</div>
      </div>

      {showZombie &&
        zombies.slice(0, 1).map((z) => (
          <div
            key={z.id}
            className={`zombie-unit ${zombieHit ? "zombie-dying" : ""}`}
            style={{ left: `${z.x}%`, zIndex: 3 }}
          >
            <ZombieSprite stage={stageNo} />
            <div className="unit-label zombie-label">ZOMBIE</div>
          </div>
        ))}

      {status === "shooting" && shot && (
        <div
          key={shot.id}
          className="bullet-projectile"
          style={{
            "--target-x": `${Math.min(94, Math.max(12, shot.targetX))}%`,
          }}
        />
      )}

      <div className="battle-hud">
        <div>
          <span className="hud-label">MÀN</span>
          <strong>
            {String(stageNo).padStart(2, "0")}
            <small> / 10</small>
          </strong>
        </div>
        <div>
          <span className="hud-label">CÂU</span>
          <strong>
            {String(Math.min(questionIndex + 1, 20)).padStart(2, "0")}
            <small> / 20</small>
          </strong>
        </div>
        <div>
          <span className="hud-label">ĐIỂM</span>
          <strong>{score * 100}</strong>
        </div>
        <div>
          <span className="hud-label">MẠNG</span>
          <strong>
            {health}
            <small> / 3</small>
          </strong>
        </div>
      </div>

      <div className="battle-controls">
        <button
          className={`battle-control ${soundEnabled ? "" : "is-muted"}`}
          onClick={onToggleSound}
          aria-label={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
        >
          <span aria-hidden="true">{soundEnabled ? "♫" : "♪̸"}</span>
          <small>{soundEnabled ? "ÂM THANH" : "ĐÃ TẮT"}</small>
        </button>
        {status === "playing" && (
          <button
            className="battle-control"
            onClick={onPause}
            aria-label="Tạm dừng"
            title="Tạm dừng"
          >
            <span aria-hidden="true">Ⅱ</span>
            <small>TẠM DỪNG</small>
          </button>
        )}
      </div>
      {showZombie && (
        <div className="zombie-counter">
          <ImageIcon name="skull" size={15} />1 ZOMBIE
        </div>
      )}
      {flash && (
        <div className="hit-flash" style={{ left: `${zombies[0]?.x ?? 80}%` }}>
          ✦
        </div>
      )}

      {overlay && (
        <div
          className={`start-overlay ${status === "won" || status === "lost" ? "result-overlay" : ""}`}
        >
          <div className="overlay-icon">
            <ImageIcon
              name={
                status === "won"
                  ? "trophy"
                  : status === "lost" || status === "lifeLost"
                    ? "skull"
                    : status === "paused"
                      ? "shield"
                      : status === "stageComplete"
                        ? "trophy"
                        : "target"
              }
              size={32}
            />
          </div>
          {status === "ready" && (
            <>
              <h2>10 MÀN SINH TỒN</h2>
              <p>
                Mỗi màn có 20 câu. Chỉ có một zombie trên sân. Trả lời đúng để
                bắn hạ trước khi zombie đến căn cứ.
              </p>
              <button className="primary-button" onClick={onStart}>
                BẮT ĐẦU CHIẾN DỊCH →
              </button>
            </>
          )}
          {status === "stageIntro" && (
            <>
              <div className="result-kicker">CHUẨN BỊ CHIẾN ĐẤU</div>
              <h2>
                MÀN {stageNo}: {stageName}
              </h2>
              <p>
                20 câu hỏi · {timeLimit} giây mỗi lượt. Zombie và đồng hồ chỉ
                bắt đầu khi bạn sẵn sàng.
              </p>
              <button className="primary-button" onClick={onBeginStage}>
                VÀO MÀN {stageNo} →
              </button>
            </>
          )}
          {status === "stageComplete" && (
            <>
              <div className="result-kicker won">MÀN {stageNo} HOÀN THÀNH</div>
              <h2>ĐÃ DỌN SẠCH KHU VỰC!</h2>
              <p>
                Bạn đã trả lời đúng 20/20 câu của màn này. Sẵn sàng cho màn tiếp
                theo chưa?
              </p>
              <button className="primary-button" onClick={onContinueStage}>
                TIẾP TỤC →
              </button>
            </>
          )}
          {status === "paused" && (
            <>
              <h2>ĐÃ TẠM DỪNG</h2>
              <p>
                Khi tiếp tục, zombie sẽ trở về điểm xuất phát và thanh thời gian
                của câu hiện tại được đặt lại đầy đủ.
              </p>
              <button className="primary-button" onClick={onResume}>
                TIẾP TỤC CHƠI →
              </button>
            </>
          )}
          {status === "lifeLost" && (
            <>
              <div className="result-kicker lost">MẤT 1 MẠNG</div>
              <h2>ZOMBIE ĐÃ ÁP SÁT!</h2>
              <p>
                {notice} Câu hỏi được giữ nguyên. Đang chuẩn bị lượt thử lại…
              </p>
            </>
          )}
          {(status === "won" || status === "lost") && (
            <>
              <div className={`result-kicker ${status}`}>
                {status === "won"
                  ? "CHIẾN DỊCH HOÀN THÀNH"
                  : "PHÒNG TUYẾN BỊ PHÁ VỠ"}
              </div>
              <h2>{status === "won" ? "CHIẾN THẮNG!" : "BẠN ĐÃ THUA!"}</h2>
              <p>
                {status === "won"
                  ? "Bạn đã trả lời đúng toàn bộ 200 câu và bảo vệ căn cứ thành công."
                  : notice ||
                    `Bạn dừng lại ở màn ${stageNo}, câu ${Math.min(questionIndex + 1, 20)}.`}
              </p>
              <div className="result-stats">
                <div>
                  <strong>{score}</strong>
                  <span>CÂU ĐÚNG</span>
                </div>
                <div>
                  <strong>{score * 100}</strong>
                  <span>TỔNG ĐIỂM</span>
                </div>
                <div>
                  <strong>{health}/3</strong>
                  <span>MẠNG CÒN</span>
                </div>
              </div>
              <button className="primary-button" onClick={onRetry}>
                <ImageIcon name="retry" size={16} /> CHƠI LẠI TỪ ĐẦU
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
