'use client';

import { Suspense, useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

const MODEL_URL =
  'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb';

// Auto-play sequence — loops forever. isEmote=true means play-once then continue.
const SEQUENCE: { anim: string; isEmote: boolean; duration?: number }[] = [
  { anim: 'Idle',     isEmote: false, duration: 4000 },
  { anim: 'Wave',     isEmote: true  },
  { anim: 'Idle',     isEmote: false, duration: 3500 },
  { anim: 'ThumbsUp', isEmote: true  },
  { anim: 'Idle',     isEmote: false, duration: 3000 },
  { anim: 'Yes',      isEmote: true  },
  { anim: 'Idle',     isEmote: false, duration: 2500 },
  { anim: 'Dance',    isEmote: false, duration: 5000 },
  { anim: 'Idle',     isEmote: false, duration: 2000 },
  { anim: 'Jump',     isEmote: true  },
];

// Prop interface kept identical to the old SVG Robot for compatibility
export type RobotState = string;
export interface RobotProps {
  state?: RobotState;
  hasEntered?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  sceneIndex?: number;
}

const sizeMap = {
  sm: { w: 240, h: 380 },
  md: { w: 300, h: 460 },
  lg: { w: 380, h: 580 },
  xl: { w: 460, h: 660 },
};

// Shrinks the canvas on tablet/mobile so the robot never overflows its column
function useResponsiveDims(base: { w: number; h: number }) {
  const [dims, setDims] = useState(base);
  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      if (vw < 640)        setDims({ w: 260, h: 400 });
      else if (vw < 1024)  setDims({ w: 320, h: 480 });
      else                  setDims(base);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [base.w, base.h]); // eslint-disable-line react-hooks/exhaustive-deps
  return dims;
}

// ─── Inner Three.js scene (must live inside <Canvas>) ─────────────────────────
function RobotModel({ onLoad }: { onLoad: () => void }) {
  const groupRef = useRef<THREE.Group>(null);

  // Load ONCE globally (cached), clone PER INSTANCE so each Canvas gets its own
  // Object3D tree — a THREE.Object3D can only have one parent at a time,
  // so without cloning the second instance (AboutSection) is always invisible.
  const { scene: rawScene, animations } = useGLTF(MODEL_URL) as any;
  const clonedScene = useMemo(
    () => SkeletonUtils.clone(rawScene) as THREE.Group,
    [rawScene],
  );

  // Bind animations to the group that wraps our cloned scene
  const { actions, mixer } = useAnimations(animations, groupRef);

  const stepRef    = useRef(0);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevRef    = useRef<THREE.AnimationAction | null>(null);
  const notifiedRef = useRef(false);

  const go = useCallback(
    (idx: number) => {
      const step   = SEQUENCE[idx % SEQUENCE.length];
      const action = actions[step.anim];
      if (!action) return;

      if (prevRef.current && prevRef.current !== action) {
        prevRef.current.fadeOut(0.4);
      }

      action.reset().setEffectiveTimeScale(1).setEffectiveWeight(1);

      if (step.isEmote) {
        action.setLoop(THREE.LoopOnce, 1).fadeIn(0.25).play();
        action.clampWhenFinished = true;
      } else {
        action.setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.4).play();
        timerRef.current = setTimeout(() => {
          stepRef.current = idx + 1;
          go(idx + 1);
        }, step.duration!);
      }

      prevRef.current = action;
    },
    [actions],
  );

  useEffect(() => {
    if (!mixer || Object.keys(actions).length === 0) return;

    if (!notifiedRef.current) {
      notifiedRef.current = true;
      onLoad();
    }

    go(0);

    const onFinished = (e: { action: THREE.AnimationAction }) => {
      const name    = e.action.getClip().name;
      const curStep = SEQUENCE[stepRef.current % SEQUENCE.length];
      if (curStep.isEmote && name === curStep.anim) {
        const next = stepRef.current + 1;
        stepRef.current = next;
        go(next);
      }
    };

    mixer.addEventListener('finished', onFinished as any);
    return () => {
      mixer.removeEventListener('finished', onFinished as any);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mixer, actions, go, onLoad]);

  const elapsedRef = useRef(0);

  // Drive the mixer + subtle idle sway (no full rotation)
  useFrame((_, delta) => {
    mixer?.update(delta);
    elapsedRef.current += delta;
    if (groupRef.current) {
      // Gentle side-to-side sway ±7° — stays facing forward
      groupRef.current.rotation.y = Math.sin(elapsedRef.current * 0.4) * 0.12;
      // Very subtle vertical breathing bob
      groupRef.current.position.y = Math.sin(elapsedRef.current * 0.6) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* scale=0.78, position.y=-0.28 per layout spec */}
      <primitive object={clonedScene} scale={0.65} position={[0, -0.3, 0]} />

      {/* Glow ring sits just above feet level (primitive.y + 0.01) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.27, 0]}>
        <circleGeometry args={[0.9, 64]} />
        <meshBasicMaterial color="#3BF0FF" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

// Kick off the network request before any component mounts
useGLTF.preload(MODEL_URL);

// ─── Public component ─────────────────────────────────────────────────────────
export default function Robot({
  size = 'lg',
  state:      _s,
  hasEntered: _h,
  sceneIndex: _i,
}: RobotProps) {
  const [loaded, setLoaded] = useState(false);
  const { w, h } = useResponsiveDims(sizeMap[size]);
  const handleLoad = useCallback(() => setLoaded(true), []);

  return (
    // overflow:visible so glow effects bleed past the box boundary naturally
    <div
      style={{ width: w, height: h, position: 'relative', flexShrink: 0, overflow: 'visible' }}
    >
      {/* Breathing glow placeholder while the GLB downloads */}
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="rounded-full animate-pulse"
            style={{
              width:  w * 0.55,
              height: w * 0.55,
              background:
                'radial-gradient(circle, rgba(59,240,255,0.13) 0%, transparent 70%)',
            }}
          />
        </div>
      )}

      <Canvas
        onCreated={({ camera }) => {
          // scale=0.78, offset y=-0.28 → feet at -0.28, head at ≈1.20
          // camera z=6.4 (spec), fov=45° → half_height = tan(22.5°)*6.4 ≈ 2.65
          // top visible  ≈ 0.46 + 2.65 = 3.11  (head 1.20 → 1.91 margin ✓)
          // bottom visible ≈ 0.46 − 2.65 = −2.19 (feet -0.28 → 1.91 margin ✓)
          camera.position.set(0, 0.5, 8);
          (camera as THREE.PerspectiveCamera).fov = 42;
          (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
          camera.lookAt(0, 0.2, 0);
        }}
        gl={{ alpha: true, antialias: true }}
        style={{
          position:   'absolute',
          top:        0,
          left:       0,
          right:      0,
          bottom:     0,
          background: 'transparent',
          opacity:    loaded ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        {/* Ambient base fill */}
        <ambientLight intensity={0.5} />

        {/* Sky/ground hemisphere — bright sky, dark navy ground */}
        <hemisphereLight args={[0xffffff, 0x111827, 1.2]} />

        {/* Strong key light: upper-right front */}
        <directionalLight position={[4, 10, 6]} intensity={2.2} color={0xffffff} />

        {/* Cyan rim light: left-back for the futuristic edge glow */}
        <directionalLight position={[-5, 4, -4]} intensity={0.8} color={0x3bf0ff} />

        {/* Blue fill: soft front-below */}
        <pointLight position={[0, 0, 4]} intensity={0.5} color={0x4b92ff} distance={8} />

        <Suspense fallback={null}>
          <RobotModel onLoad={handleLoad} />
        </Suspense>
      </Canvas>
    </div>
  );
}
