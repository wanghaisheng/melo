import Loader from "@/web/app/app/components/loader";
import { Html, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

export interface ModelsLoadConfiguration {
  path: string;
  name: string;
  hideShadow?: boolean;

  props?: {
    position?: [number,number,number],
    rotation?: [number,number,number],
    scale?: [number,number,number]
  }
}

interface ModelsLoaderProps {
  models: ModelsLoadConfiguration[]; 
  progress: number;
}

function Model({
  path,
  hideShadow,
  props,
}: ModelsLoadConfiguration) {
  const { scene } = useGLTF(path);
  
  // Enable shadows for all meshes in the scene
  scene.traverse((child) => {
    if ((child as any).isMesh && !hideShadow) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  
  return <group {...props}>
    <primitive object={scene} />
  </group>;
}


export default function ModelsLoader({
  models,
  progress,
}: ModelsLoaderProps) {
  return models.map((m, i) => {
    return <Suspense fallback={<Html fullscreen className="z-[100000000]">
      <Loader progress={progress} title="Models Loading..." subtitle={`The client is loading environments.`} />
    </Html>}>
      <Model path={m.path} hideShadow={m.hideShadow ?? false} name={m.name} props={m.props}/>
    </Suspense>
  })
}