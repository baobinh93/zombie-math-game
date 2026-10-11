# Zombie Math v4 — chiến dịch 10 màn, 200 câu

## Chạy game
Yêu cầu Node.js 18+.

```bash
npm install
npm run dev
```
Mở URL mà Vite hiển thị, thường là `http://localhost:5173`.

Build production:

```bash
npm run build
```

## Luật chơi
- Chiến dịch gồm 10 màn × 20 câu = 200 câu. Độ khó tăng dần.
- Thời gian mỗi câu lần lượt là 25, 23, 21, 19, 17, 15, 13, 11, 9 và 7 giây.
- Mỗi lượt chỉ có đúng 1 zombie. Zombie xuất phát bên phải và tiến về căn cứ theo đúng tiến trình của thanh thời gian.
- Trả lời đúng: +100 điểm; đạn bay từ nhân vật tới zombie, zombie lóe sáng/biến mất rồi zombie tiếp theo xuất hiện ở điểm bắt đầu.
- Trả lời sai: giữ nguyên câu và zombie; zombie tiếp tục di chuyển, đồng hồ vẫn chạy.
- Hết giờ hoặc zombie chạm căn cứ: mất 1 mạng, giữ nguyên câu hỏi. Sau hiệu ứng báo mất mạng, zombie và đồng hồ được đặt lại.
- Có 3 mạng cho toàn chiến dịch. Mất mạng cuối cùng là thua.
- Có nút tạm dừng và nút bật/tắt âm thanh. Tiếp tục sau tạm dừng sẽ đặt lại zombie và đồng hồ của câu hiện tại.
- Sau câu 20, game hiện màn hoàn thành. Bấm tiếp tục để xem phần giới thiệu màn kế tiếp; bấm lần nữa để bắt đầu màn đó.
- Thắng sau khi trả lời đúng cả 200 câu; màn hình chiến thắng hiển thị tổng câu đúng, tổng điểm và nút chơi lại.

## Thay ảnh zombie
Giữ nguyên tên file `zombie-01.png` đến `zombie-10.png` trong `src/assets/images/zombies/`. Nên dùng PNG nền trong suốt, nhân vật quay mặt sang trái, khung hình khoảng 256×256 hoặc 512×512. Mỗi màn sử dụng ảnh zombie tương ứng trong `src/components/ZombieSprite.jsx`.

## Thay âm thanh
Các file WAV nằm trong `src/assets/sounds/`:
- `shoot.wav` — bắn súng.
- `zombie-hit.wav` — đạn trúng / hạ zombie.
- `lose-life.wav` — mất mạng.

Có thể thay nội dung bằng file WAV khác nhưng giữ nguyên tên để không cần sửa import. Nếu dùng MP3, đổi phần mở rộng trong file và cập nhật import tương ứng ở `src/App.jsx`.

## Cấu trúc chính
```text
src/
├── App.jsx
├── main.jsx
├── styles.css
├── data/questions.js
├── components/
│   ├── Battlefield.jsx
│   ├── Character.jsx
│   ├── ImageIcon.jsx
│   ├── QuestionPanel.jsx
│   ├── RulesCard.jsx
│   ├── StatCards.jsx
│   ├── TopBar.jsx
│   └── ZombieSprite.jsx
└── assets/
    ├── images/
    │   ├── icons/
    │   └── zombies/
    └── sounds/
```
