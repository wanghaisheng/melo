import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Bvh, MapControls, OrthographicCamera, Stars } from "@react-three/drei";

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
          antialias: true,
        }}
        frameloop="always"
        >
        <AdaptiveDpr pixelated />
        <Bvh firstHitOnly>
          <Stars depth={10} factor={1} count={10000} radius={30} saturation={100}/>
          {/* <Stats /> */}
          <ModelsLoader 
            models={[
              {
                path: "/static/level.glb",
                name: "Buildings",
                props: {
                  position: [0,0,0]
                }
              },
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
          position={[60, 60, -40]} 
          intensity={2}
          shadow-intensity={0.7}
          shadow-mapSize={[24000, 24000]}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          shadow-bias={-0.0001}
        />
        
        {/* Hemisphere light for ambient illumination */}
        <hemisphereLight 
          intensity={1.4}
          groundColor="#555"
          position={[100, 100, 100]}
        />
        
        {/* Subtle fill light */}
        <ambientLight intensity={0.4} />
        
        {/* Players */}
        <Players />
      </Canvas>
  );
}