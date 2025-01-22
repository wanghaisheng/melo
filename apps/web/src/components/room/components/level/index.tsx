import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Bvh, MapControls, OrthographicCamera } from "@react-three/drei";

import useGlobalStore from "@/web/store/global";

import Players from "@/web/components/room/components/three-components/players";
import ModelsLoader from "@/web/components/room/components/models-loader";
import Ground from "@/web/components/room/components/three-components/ground";

export default function Level() {
  const { modelsLoading } = useGlobalStore();
  
  return (
    <Canvas 
        className=""
        shadows
        gl={{ 
          toneMapping: 3, // ACESFilmicToneMapping
          outputColorSpace: 'srgb',
          antialias: false,
        }}
        frameloop="always"
        >
        <AdaptiveDpr pixelated />
        <Bvh firstHitOnly>
          {/* <Stats /> */}
          <ModelsLoader 
            models={[
              {
                path: "/static/housing.glb",
                name: "Buildings",
                props: {
                  position: [0,0,0]
                }
              },
              {
                path: "/static/test.glb",
                name: "Environment",
                props: {
                  position: [0,-1,0]
                },
                hideShadow: true,
              }
            ]}
            // TODO: Be sure to remove this line in PROD
            // disableLoader
          />

          <Ground />
        </Bvh>

        {/* Disable Map Controls while loading */}
        <MapControls 
          enableRotate={false}
          minZoom={50}
          maxZoom={100}
          zoomSpeed={3}
          enablePan={!modelsLoading}
        />

        <color attach="background" args={['#000']} />
        <OrthographicCamera
          makeDefault
          zoom={100}
          position={[10, 14, 10]}
          near={-1000}
          far={1000}
        />
        
        <directionalLight 
          castShadow 
          position={[10, 60, 0]} 
          intensity={1}
          shadow-intensity={2.6}
          shadow-mapSize={[8192, 8192]}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          shadow-bias={-0.0001}
        />
        
        {/* Hemisphere light for ambient illumination */}
        <hemisphereLight 
          intensity={3}
          groundColor="#000"
          position={[100, 100, 100]}
        />
        
        {/* Subtle fill light */}
        <ambientLight intensity={0.4} />
        
        {/* Players */}
        <Players />
      </Canvas>
  );
}