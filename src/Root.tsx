import { Composition, Folder } from "remotion";
import { Terminal3D } from "./Terminal3D";
import { AnnouncementScreen } from "./AnnouncementScreen";
import {
  ResearchScreen,
  EnrichmentsScreen,
  WebSearchScreen,
} from "./FeatureScreen";
import { IntegrationsScreen } from "./IntegrationsScreen";
import { MainVideo } from "./MainVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        fps={30}
        durationInFrames={490}
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
          id="Announcement"
          component={AnnouncementScreen}
          fps={30}
          durationInFrames={75}
          width={1920}
          height={1080}
        />
        <Composition
          id="Research"
          component={ResearchScreen}
          fps={30}
          durationInFrames={45}
          width={1920}
          height={1080}
        />
        <Composition
          id="Enrichments"
          component={EnrichmentsScreen}
          fps={30}
          durationInFrames={45}
          width={1920}
          height={1080}
        />
        <Composition
          id="WebSearch"
          component={WebSearchScreen}
          fps={30}
          durationInFrames={45}
          width={1920}
          height={1080}
        />
        <Composition
          id="Integrations"
          component={IntegrationsScreen}
          fps={30}
          durationInFrames={120}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
