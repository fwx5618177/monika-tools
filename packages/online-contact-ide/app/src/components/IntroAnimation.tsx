// packages/app/src/components/IntroAnimation.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D } from '@react-three/drei';
import * as THREE from 'three';
import explosionSound from '../sounds/explosion.wav';
import helvetiker from '../fonts/helvetiker_bold.typeface.json';

const OKXText: React.FC<{ onEnd: () => void }> = ({ onEnd }) => {
  const textRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const [scale, setScale] = useState(1);
  const [color, setColor] = useState('skyblue');
  const speed = 0.1; // 下降速度
  const initialY = viewport.height / 2; // 动态起始高度
  const vibrationIntensity = 0.02; // 振动强度
  let hasExploded = false;

  useEffect(() => {
    // 根据视口宽度调整字体大小和缩放比例
    const calculatedScale = Math.min(viewport.width / 8, 1.5); // 最大缩放为 1.5
    setScale(calculatedScale);
  }, [viewport.width]);

  useFrame(({ clock }) => {
    if (textRef.current) {
      // 文字掉落动画
      if (textRef.current.position.y > 0) {
        textRef.current.position.y -= speed;

        // 添加旋转和缩放效果
        textRef.current.rotation.y += 0.05;
        textRef.current.scale.set(scale * (1 + 0.1 * Math.sin(clock.getElapsedTime() * 5)), scale, scale);
      } else {
        if (!hasExploded) {
          // 播放爆炸音效
          const audio = new Audio(explosionSound);
          audio.play();
          hasExploded = true;

          // 爆炸后的闪烁颜色效果
          let flashInterval = setInterval(() => {
            setColor((prev) => (prev === 'skyblue' ? 'orange' : 'skyblue'));
          }, 100);

          // 振动效果
          const vibrationInterval = setInterval(() => {
            if (textRef.current) {
              textRef.current.position.x += (Math.random() - 0.5) * vibrationIntensity;
              textRef.current.position.y += (Math.random() - 0.5) * vibrationIntensity;
            }
          }, 16);

          // 爆炸效果结束后切换到主页面
          setTimeout(() => {
            clearInterval(flashInterval);
            clearInterval(vibrationInterval);
            onEnd();
          }, 1000);
        }
      }
    }
  });

  return (
    <Text3D
      ref={textRef as any}
      font={helvetiker as any} // 请确保字体文件路径正确
      size={0.8} // 基础大小为 1，实际大小由缩放控制
      height={0.5}
      position={[0, initialY, 0]}
      scale={[scale, scale, scale]}
    >
      Contract IDE
      <meshStandardMaterial color={color} />
    </Text3D>
  );
};

const IntroAnimation: React.FC<{ onEnd: () => void }> = ({ onEnd }) => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 10]} />
      <OKXText onEnd={onEnd} />
    </Canvas>
  );
};

export default IntroAnimation;