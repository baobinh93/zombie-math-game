import React from 'react';
import target from '../assets/images/icons/target.svg';
import heart from '../assets/images/icons/heart.svg';
import trophy from '../assets/images/icons/trophy.svg';
import zap from '../assets/images/icons/zap.svg';
import shield from '../assets/images/icons/shield.svg';
import skull from '../assets/images/icons/skull.svg';
import retry from '../assets/images/icons/retry.svg';
const sources = {target,heart,trophy,zap,shield,skull,retry};
export default function ImageIcon({name,size=18,className=''}) { return <img src={sources[name] || target} width={size} height={size} className={`image-icon ${className}`} alt="" aria-hidden="true"/>; }