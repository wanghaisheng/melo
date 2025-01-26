import { Suspense, useEffect, useState } from "react";
import { BakeShadows, Html, Preload, useGLTF } from "@react-three/drei";
import Loader from "@/web/components/room/components/loader";
import useGlobalStore from "@/web/store/global";

import * as THREE from "three";

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
  const { scene } = useGLTF(path, "https://www.gstatic.com/draco/versioned/decoders/1.3.6/");
  
  useEffect(() => {
    scene.traverse((child: any) => {

      if ( child.name.startsWith('Lights_') ) {
        const light = new THREE.PointLight("#ffb", .4, 0.85, 30);
        // Update the matrix world to the child's matrix world to get all transforms
        child.updateMatrixWorld();
        light.position.setFromMatrixPosition(child.matrixWorld);
        light.rotation.setFromRotationMatrix(child.matrixWorld);

        // light.position.copy(child.position);
        light.rotation.copy(child.rotation);
        scene.add(light);
        // scene.remove(child);
      }
      
      if (child.isMesh && !hideShadow) {
        (child as THREE.Object3D).matrixAutoUpdate = false;
        (child as THREE.Object3D).matrixWorldAutoUpdate = false;
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