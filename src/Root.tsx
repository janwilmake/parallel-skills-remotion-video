import { Composition, Folder } from "remotion";
import { Terminal3D } from "./Terminal3D";
import { IntegrationsScreen } from "./IntegrationsScreen";
import { MainVideo } from "./MainVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        fps={30}
        durationInFrames={360}
        width={1920}
        height={1080}
      />
      <Folder name="Scenes">
        <Composition
          id="Terminal3D"
          component={Terminal3D}
          fps={30}
          durationInFrames={210}
          width={1920}
          height={1080}
        />
        <Composition
          id="Integrations"
          component={IntegrationsScreen}
          fps={30}
          durationInFrames={150}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
