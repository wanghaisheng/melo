import { Suspense, useEffect, useState } from "react";
import { BakeShadows, Html, Preload, useGLTF } from "@react-three/drei";
import Loader from "@/web/components/room/components/loader";
import useGlobalStore from "@/web/store/global";

type Vector3 = [number, number, number];

interface ModelConfig {
  path: string;
  name: string;
  hideShadow?: boolean;
  props?: {
    position?: Vector3;
    rotation?: Vector3;
    scale?: Vector3;
  };
}

function Model({ path, hideShadow, props, onLoad }: ModelConfig & { onLoad: () => void }) {
  const { scene } = useGLTF(path);
  
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && !hideShadow) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    onLoad();
  }, [scene, hideShadow]);
  
  return <primitive object={scene} {...props} />;
}

function LoadingFallback() {
  return (
    <Html fullscreen>
      <Loader 
        progress={70} 
        title="Models Loading..." 
        subtitle="The client is loading environments." 
      />
    </Html>
  );
}

export default function ModelsLoader({ 
  models, 
  disableLoader = false 
}: { 
  models: ModelConfig[]; 
  disableLoader?: boolean; 
}) {
  const [loadCount, setLoadCount] = useState(0);
  const { setModelsLoading } = useGlobalStore();

  useEffect(() => {
    if (disableLoader || loadCount >= models.length) {
      setModelsLoading(false);
    }
  }, [disableLoader, loadCount, models.length]);

  return models.map(({ name, ...modelProps }) => (
    <Suspense 
      key={name} 
      fallback={disableLoader ? null : <LoadingFallback />}
    >
      <Model 
        {...modelProps} 
        name={name}
        onLoad={() => setLoadCount(c => c + 1)} 
      />
      <BakeShadows />
      <Preload all />
    </Suspense>
  ));
}