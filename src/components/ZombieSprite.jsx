import React from 'react';
import z01 from '../assets/images/zombies/zombie-01.png';
import z02 from '../assets/images/zombies/zombie-02.png';
import z03 from '../assets/images/zombies/zombie-03.png';
import z04 from '../assets/images/zombies/zombie-04.png';
import z05 from '../assets/images/zombies/zombie-05.png';
import z06 from '../assets/images/zombies/zombie-06.png';
import z07 from '../assets/images/zombies/zombie-07.png';
import z08 from '../assets/images/zombies/zombie-08.png';
import z09 from '../assets/images/zombies/zombie-09.png';
import z10 from '../assets/images/zombies/zombie-10.png';
export const zombieImages = [z01,z02,z03,z04,z05,z06,z07,z08,z09,z10];
// Mỗi màn dùng một ảnh zombie riêng. Thay file PNG trong assets là được.
export default function ZombieSprite({stage=1, className=''}) {
  const src = zombieImages[(stage-1) % zombieImages.length];
  return <img className={`zombie-sprite ${className}`} src={src} alt={`Zombie màn ${stage}`} draggable="false"/>;
}