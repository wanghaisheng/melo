import { Suspense, useEffect, useState } from "react";
import { Html, useGLTF } from "@react-three/drei";
import Loader from "@/web/components/room/components/loader";
import useGlobalStore from "@/web/store/global";

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
  disableLoader?: boolean;
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

// This component unloads when the model is loaded, and the fallback(this component) is unloaded.
function ModelLoaderFallback({
  handleIncreaseLoadCount,
}: {
  handleIncreaseLoadCount: () => void,
}) {
  
  useEffect(() => {
    return () => {
      handleIncreaseLoadCount();
    }
  }, [handleIncreaseLoadCount])
  
  return <Html fullscreen>
    <Loader progress={70} title="Models Loading..." subtitle={`The client is loading environments.`} />
  </Html> ;
}

export default function ModelsLoader({
  models,
  disableLoader = false,
}: ModelsLoaderProps) {
  const [loadCount, setLoadCount] = useState(0);
  const { setModelsLoading } = useGlobalStore();

  useEffect(() => {
    if (disableLoader || loadCount >= models.length) setModelsLoading(false);
  }, [disableLoader, loadCount, models.length, setModelsLoading]);

  return models.map((m, i) => {
    return <Suspense key={i} fallback={disableLoader ? null : <ModelLoaderFallback handleIncreaseLoadCount={() => setLoadCount(c => c + 1)} />}>
      <Model path={m.path} hideShadow={m.hideShadow ?? false} name={m.name} props={m.props}/>
    </Suspense>
  })
}