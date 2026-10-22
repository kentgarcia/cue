import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { PropsWithChildren } from "react";
import { PlaybackController } from "./PlaybackController";
import { bindKeyboard } from "./KeyboardController";
import type { PresentationConfig } from "./types";
import { useReducedMotion } from "../hooks/useReducedMotion";

function useEngine(config: PresentationConfig) {
  const controller = useMemo(() => new PlaybackController(config), [config]);
  const state = useSyncExternalStore(
    controller.subscribeCommands,
    controller.getCommandSnapshot,
  );
  const stageRef = useRef<HTMLDivElement>(null);
  const [presenting, setPresenting] = useState(false);
  const [notice, setNotice] = useState("");
  const reducedMotion = useReducedMotion();
  const exit = useCallback(() => {
    if (document.fullscreenElement)
      void document
        .exitFullscreen()
        .catch(() => setNotice("Use Escape to leave browser fullscreen."));
    setPresenting(false);
  }, []);
  const fullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      exit();
      return;
    }
    setPresenting((current) => {
      if (current) return false;
      return true;
    });
    const stage = stageRef.current;
    if (!stage || presenting) return;
    if (document.fullscreenEnabled && stage.requestFullscreen) {
      void stage
        .requestFullscreen()
        .catch(() =>
          setNotice(
            "Browser fullscreen is unavailable. Focus mode is on; press Escape to return.",
          ),
        );
    } else setNotice("Focus mode is on. Press Escape to return.");
  }, [exit, presenting]);
  useEffect(() => {
    const onChange = () => {
      setPresenting(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  useEffect(
    () =>
      bindKeyboard({
        next: controller.next,
        previous: controller.previous,
        first: () => controller.goToSlide(0),
        last: () => controller.goToSlide(config.slides.length - 1, true),
        fullscreen,
        escape: () => {
          if (!presenting && !document.fullscreenElement) return false;
          exit();
          return true;
        },
      }),
    [config.slides.length, controller, fullscreen, exit, presenting],
  );
  return {
    config,
    controller,
    state,
    stageRef,
    presenting,
    fullscreen,
    exit,
    reducedMotion,
    notice,
    dismissNotice: () => setNotice(""),
  };
}

type Engine = ReturnType<typeof useEngine>;
const EngineContext = createContext<Engine | null>(null);

export function PresentationEngine({
  config,
  children,
}: PropsWithChildren<{ config: PresentationConfig }>) {
  const engine = useEngine(config);
  return (
    <EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
  );
}

export function usePresentation(): Engine {
  const engine = useContext(EngineContext);
  if (!engine) throw new Error("usePresentation requires PresentationEngine.");
  return engine;
}

export function usePlaybackSnapshot() {
  const { controller } = usePresentation();
  return useSyncExternalStore(controller.subscribe, controller.getSnapshot);
}
