import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TopBar from "./components/TopBar.jsx";
import Battlefield from "./components/Battlefield.jsx";
import QuestionPanel from "./components/QuestionPanel.jsx";
import StatCards from "./components/StatCards.jsx";
import RulesCard from "./components/RulesCard.jsx";
import { createCampaign, TIME_LIMITS } from "./data/questions.js";
import shootSound from "./assets/sounds/shoot.wav";
import zombieHitSound from "./assets/sounds/zombie-hit.wav";
import loseLifeSound from "./assets/sounds/lose-life.wav";

const START_X = 88;
const BASE_X = 11;
const SHOT_DURATION_MS = 270;
const DEATH_DURATION_MS = 300;
const LIFE_LOSS_PAUSE_MS = 650;

function makeSound(src, enabled) {
  if (!enabled) return;
  try {
    const audio = new Audio(src);
    audio.volume = 0.55;
    audio.play().catch(() => {});
  } catch {
    // Audio không hỗ trợ sẽ không làm gián đoạn game.
  }
}

export default function App() {
  const [campaign, setCampaign] = useState(createCampaign);
  const [stageIndex, setStageIndex] = useState(7);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [health, setHealth] = useState(3);
  const [score, setScore] = useState(0); // Số câu trả lời đúng; điểm = score * 100.
  const [status, setStatus] = useState("ready");
  const [feedback, setFeedback] = useState({ text: "", type: "" });
  const [streak, setStreak] = useState(0);
  const [shot, setShot] = useState(null);
  const [zombieHit, setZombieHit] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [notice, setNotice] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastLoss, setLastLoss] = useState("");
  const elapsedRef = useRef(0);
  const lossHandledRef = useRef(false);
  const animationTimersRef = useRef([]);

  const question = campaign[stageIndex]?.questions[questionIndex];
  const timeLimit = TIME_LIMITS[stageIndex] ?? 7;
  const elapsedRatio = Math.min(1, elapsedMs / (timeLimit * 1000));
  const timeLeft = Math.max(0, timeLimit - elapsedMs / 1000);
  // Tọa độ zombie được suy ra trực tiếp từ tiến trình đồng hồ, bảo đảm hai thứ đồng bộ.
  const zombieX = START_X - elapsedRatio * (START_X - BASE_X);
  const zombies = useMemo(
    () => [{ id: stageIndex * 20 + questionIndex + 1, x: zombieX }],
    [stageIndex, questionIndex, zombieX],
  );

  const clearAnimationTimers = useCallback(() => {
    animationTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    animationTimersRef.current = [];
  }, []);

  useEffect(() => () => clearAnimationTimers(), [clearAnimationTimers]);

  const resetRoundClock = useCallback(() => {
    elapsedRef.current = 0;
    lossHandledRef.current = false;
    setElapsedMs(0);
  }, []);

  const restart = useCallback(() => {
    clearAnimationTimers();
    const freshCampaign = createCampaign();
    setCampaign(freshCampaign);
    setStageIndex(0);
    setQuestionIndex(0);
    setHealth(3);
    setScore(0);
    setStatus("ready");
    setFeedback({ text: "", type: "" });
    setStreak(0);
    setShot(null);
    setZombieHit(false);
    setNotice("");
    setLastLoss("");
    resetRoundClock();
  }, [clearAnimationTimers, resetRoundClock]);

  const loseLife = useCallback(
    (message) => {
      if (lossHandledRef.current || status !== "playing") return;
      lossHandledRef.current = true;
      clearAnimationTimers();
      const remainingLives = Math.max(0, health - 1);
      setHealth(remainingLives);
      setLastLoss(message);
      setFeedback({ text: message, type: "warn" });
      setNotice(message);
      makeSound(loseLifeSound, soundEnabled);
      // Giữ zombie tại căn cứ trong khoảnh khắc mất mạng; sau thông báo mới reset.
      elapsedRef.current = timeLimit * 1000;
      setElapsedMs(timeLimit * 1000);
      setShot(null);
      setZombieHit(false);

      if (remainingLives <= 0) {
        setStatus("lost");
        return;
      }

      setStatus("lifeLost");
      const timer = window.setTimeout(() => {
        setStatus("playing");
        setFeedback({
          text: `${message} Câu hỏi được giữ nguyên — thử lại!`,
          type: "warn",
        });
        resetRoundClock();
      }, LIFE_LOSS_PAUSE_MS);
      animationTimersRef.current.push(timer);
    },
    [
      clearAnimationTimers,
      health,
      resetRoundClock,
      soundEnabled,
      status,
      timeLimit,
    ],
  );

  useEffect(() => {
    if (status !== "playing") return undefined;
    const timer = window.setInterval(() => {
      if (lossHandledRef.current) return;
      const nextElapsed = Math.min(timeLimit * 1000, elapsedRef.current + 50);
      elapsedRef.current = nextElapsed;
      setElapsedMs(nextElapsed);
      if (nextElapsed >= timeLimit * 1000) {
        // Vì zombie đi hết quãng đường đúng bằng thời gian câu hỏi, cả hai mốc
        // được xử lý như một sự kiện duy nhất để không trừ hai mạng cùng lúc.
        loseLife("Hết thời gian! Zombie đã đến căn cứ — mất 1 mạng.");
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [status, timeLimit, loseLife]);

  const beginStage = useCallback(() => {
    resetRoundClock();
    setShot(null);
    setZombieHit(false);
    setFeedback({
      text: "Bắt đầu! Hãy trả lời đúng trước khi zombie đến căn cứ.",
      type: "",
    });
    setStatus("playing");
  }, [resetRoundClock]);

  const startCampaign = useCallback(() => {
    setStatus("stageIntro");
    setFeedback({ text: "", type: "" });
  }, []);

  const resumeAfterPause = useCallback(() => {
    // Theo luật đã chốt: tiếp tục sau tạm dừng sẽ reset zombie và đồng hồ.
    resetRoundClock();
    setShot(null);
    setZombieHit(false);
    setFeedback({
      text: "Tiếp tục! Zombie và đồng hồ đã được đặt lại.",
      type: "",
    });
    setStatus("playing");
  }, [resetRoundClock]);

  const continueAfterStage = useCallback(() => {
    const nextStage = stageIndex + 1;
    if (nextStage >= campaign.length) {
      setStatus("won");
      setNotice("Bạn đã trả lời đúng toàn bộ 200 câu hỏi!");
      return;
    }
    setStageIndex(nextStage);
    setQuestionIndex(0);
    resetRoundClock();
    setShot(null);
    setZombieHit(false);
    setFeedback({ text: "", type: "" });
    setStatus("stageIntro");
  }, [campaign.length, resetRoundClock, stageIndex]);

  const finishCorrectAnswer = useCallback(() => {
    setShot(null);
    setZombieHit(false);
    if (questionIndex < campaign[stageIndex].questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      resetRoundClock();
      setFeedback({
        text: "Chính xác! Zombie tiếp theo xuất hiện — câu mới bắt đầu.",
        type: "good",
      });
      setStatus("playing");
      return;
    }

    if (stageIndex < campaign.length - 1) {
      setFeedback({ text: `Hoàn thành màn ${stageIndex + 1}!`, type: "good" });
      setStatus("stageComplete");
      return;
    }

    setStatus("won");
    setNotice("Bạn đã trả lời đúng toàn bộ 200 câu hỏi!");
  }, [campaign, questionIndex, resetRoundClock, stageIndex]);

  const answer = useCallback(
    (choice) => {
      if (status !== "playing" || !question || lossHandledRef.current) return;
      if (choice !== question.answer) {
        setStreak(0);
        setFeedback({
          text: "Sai rồi! Câu hỏi và zombie vẫn giữ nguyên. Zombie tiếp tục tiến tới!",
          type: "warn",
        });
        return;
      }

      setScore((current) => current + 1);
      setStreak((current) => current + 1);
      setFeedback({ text: "CHÍNH XÁC! ĐANG BẮN...", type: "good" });
      makeSound(shootSound, soundEnabled);
      setShot({ id: `${Date.now()}-${Math.random()}`, targetX: zombieX + 4 });
      setZombieHit(false);
      setStatus("shooting");

      const hitTimer = window.setTimeout(() => {
        setShot(null);
        setZombieHit(true);
        makeSound(zombieHitSound, soundEnabled);
        setStatus("dying");
        const deathTimer = window.setTimeout(
          () => finishCorrectAnswer(),
          DEATH_DURATION_MS,
        );
        animationTimersRef.current.push(deathTimer);
      }, SHOT_DURATION_MS);
      animationTimersRef.current.push(hitTimer);
    },
    [finishCorrectAnswer, question, soundEnabled, status, zombieX],
  );

  const pause = useCallback(() => {
    if (status !== "playing") return;
    setStatus("paused");
    setFeedback({ text: "Đã tạm dừng.", type: "" });
  }, [status]);

  const toggleSound = useCallback(
    () => setSoundEnabled((enabled) => !enabled),
    [],
  );
  const currentStageName =
    campaign[stageIndex]?.title || campaign[stageIndex]?.name || "";
  const isBattleActive = ["playing", "shooting", "dying"].includes(status);

  return (
    <main className="app-shell">
      <TopBar />
      <section className="game-layout">
        <section className="battle-column">
          <div className="mission-row">
            <div>
              <div className="eyebrow">
                KHU VỰC NHIỄM ĐỘC <span>///</span>
              </div>
              <h1>
                10 màn. 200 câu. <em>Sống sót!</em>
              </h1>
            </div>
            <div className="mission-status">
              <span className={`status-dot ${isBattleActive ? "live" : ""}`} />
              {isBattleActive
                ? "ĐANG GIAO TRANH"
                : status === "paused"
                  ? "TẠM DỪNG"
                  : status === "won"
                    ? "CHIẾN THẮNG"
                    : status === "lost"
                      ? "THẤT BẠI"
                      : "SẴN SÀNG"}
            </div>
          </div>
          <Battlefield
            status={status}
            stageIndex={stageIndex}
            stageName={currentStageName}
            questionIndex={questionIndex}
            health={health}
            score={score}
            zombies={zombies}
            flash={status === "dying"}
            zombieHit={zombieHit}
            shot={shot}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            onPause={pause}
            onResume={resumeAfterPause}
            onStart={startCampaign}
            onBeginStage={beginStage}
            onContinueStage={continueAfterStage}
            onRetry={restart}
            notice={notice}
          />
          <div className="battle-footer">
            <div className="footer-tip">
              <span className="tip-bolt">✦</span>
              <span>
                <b>MẸO SINH TỒN:</b> Câu trả lời sai không qua câu; đừng để hết
                giờ!
              </span>
            </div>
            <div className="round-progress">
              <span>CHIẾN DỊCH</span>
              <div className="progress-track">
                <div
                  style={{
                    width: `${((status === "won" ? 200 : status === "stageComplete" ? (stageIndex + 1) * 20 : stageIndex * 20 + questionIndex) / 200) * 100}%`,
                  }}
                />
              </div>
              <b>
                {status === "won"
                  ? 200
                  : status === "stageComplete"
                    ? (stageIndex + 1) * 20
                    : stageIndex * 20 + questionIndex}
                /200
              </b>
            </div>
          </div>
        </section>
        <aside className="side-column">
          <StatCards health={health} score={score} stageIndex={stageIndex} />
          <QuestionPanel
            campaign={campaign}
            stageIndex={stageIndex}
            questionIndex={questionIndex}
            question={question}
            status={status}
            feedback={feedback}
            timeLeft={timeLeft}
            timeLimit={timeLimit}
            streak={streak}
            onAnswer={answer}
            onRetry={restart}
            onResume={resumeAfterPause}
          />
          <RulesCard />
        </aside>
      </section>
      <footer className="page-footer">
        <span>© 2026 ZOMBIE MATH</span>
        <span>10 MÀN • 200 CÂU HỎI</span>
        <span className="footer-online">
          <i /> OFFLINE READY
        </span>
      </footer>
    </main>
  );
}
