import React from "react";

import player01 from "../assets/images/player/player-01.png";
import player02 from "../assets/images/player/player-02.png";
import player03 from "../assets/images/player/player-03.png";

export default function Character({ stage = 1 }) {
  let avatar;

  if (stage <= 3) {
    avatar = player01;
  } else if (stage <= 6) {
    avatar = player02;
  } else {
    avatar = player03;
  }

  return (
    <img
      src={avatar}
      alt={`Nhân vật người chơi - Màn ${stage}`}
      className={`character player-svg character-0${
        stage <= 3 ? 1 : stage <= 6 ? 2 : 3
      }`}
      draggable={false}
    />
  );
}
