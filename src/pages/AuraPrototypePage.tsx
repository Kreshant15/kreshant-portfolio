import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

type Screen =
  | "splash"
  | "moodSelect"
  | "permissions"
  | "home"
  | "calibration"
  | "player"
  | "timeline"
  | "you";

type Mood = {
  id: string;
  label: string;
  icon: string;
  tone: string;
  colors: [string, string];
  stats: {
    tempo: number;
    vocal: number;
    depth: number;
    intensity: number;
  };
};

type PermissionKey = "music" | "motion" | "notifications";

const moods: Mood[] = [
  {
    id: "calm",
    label: "Calm",
    icon: "~",
    tone: "Focused · Still",
    colors: ["#7dd3fc", "#c4b5fd"],
    stats: { tempo: 32, vocal: 48, depth: 62, intensity: 22 },
  },
  {
    id: "melancholy",
    label: "Melancholy",
    icon: "◐",
    tone: "Deep · Nostalgic",
    colors: ["#818cf8", "#1e1b4b"],
    stats: { tempo: 26, vocal: 58, depth: 84, intensity: 34 },
  },
  {
    id: "euphoria",
    label: "Euphoria",
    icon: "*",
    tone: "Joy · Expansive",
    colors: ["#f9a8d4", "#fb7185"],
    stats: { tempo: 76, vocal: 42, depth: 52, intensity: 76 },
  },
  {
    id: "energy",
    label: "Energy",
    icon: "+",
    tone: "Drive · Intense",
    colors: ["#fb923c", "#facc15"],
    stats: { tempo: 88, vocal: 36, depth: 40, intensity: 90 },
  },
  {
    id: "serenity",
    label: "Serenity",
    icon: "<>",
    tone: "Peace · Airy · Rest",
    colors: ["#93c5fd", "#d8b4fe"],
    stats: { tempo: 32, vocal: 55, depth: 78, intensity: 20 },
  },
];

const recommendations = [
  { title: "Holocene", artist: "Bon Iver", mood: "Melancholy" },
  { title: "Intro", artist: "The xx", mood: "Calm" },
  { title: "Weightless", artist: "Marconi Union", mood: "Serenity" },
];

const timelineMoments = [
  { time: "7am", note: "Tension release", level: 18 },
  { time: "12pm", note: "Focused calm", level: 38 },
  { time: "6pm", note: "Serenity peak", level: 72 },
  { time: "11pm", note: "Sleep-ready", level: 54 },
];

const spectrum = [
  { label: "Serenity", value: 42 },
  { label: "Calm", value: 26 },
  { label: "Melancholy", value: 18 },
  { label: "Euphoria", value: 9 },
  { label: "Energy", value: 5 },
];

const navItems: Array<{ key: Screen; label: string; icon: string }> = [
  { key: "home", label: "HOME", icon: "[]" },
  { key: "calibration", label: "ORB", icon: "()" },
  { key: "player", label: "NOW", icon: ">" },
  { key: "timeline", label: "ARC", icon: "~" },
  { key: "you", label: "YOU", icon: "o" },
];

const formatMinutes = (value: number) => {
  const minutes = Math.floor(value);
  const seconds = Math.floor((value - minutes) * 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const pickMood = (id: string) => moods.find((mood) => mood.id === id) ?? moods[4];

function AuraOrb({
  colors,
  size = "large",
}: {
  colors: [string, string];
  size?: "small" | "medium" | "large";
}) {
  const dimension = size === "small" ? 48 : size === "medium" ? 176 : 192;

  return (
    <div
      className="relative shrink-0 rounded-full"
      style={{
        width: dimension,
        height: dimension,
        background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.88), transparent 28%), linear-gradient(160deg, ${colors[0]}, ${colors[1]})`,
        boxShadow:
          "0 20px 60px rgba(117, 92, 255, 0.22), inset 0 1px 18px rgba(255,255,255,0.52)",
      }}
    >
      <div className="absolute inset-4 rounded-full border border-white/25" />
      <div className="absolute inset-7 rounded-full border border-white/15" />
      <div className="absolute left-[22%] top-[14%] h-[28%] w-[30%] rounded-full bg-white/45 blur-md" />
      <div className="absolute inset-0 rounded-full animate-pulse bg-white/5" />
    </div>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[22px] border border-white/12 bg-white/6 px-4 py-3 text-center backdrop-blur-md">
      <div className="text-lg font-semibold text-white">{value}</div>
      <div className="mt-1 text-[10px] tracking-[0.28em] text-white/55">{label}</div>
    </div>
  );
}

function SliderRow({
  icon,
  label,
  value,
  onChange,
}: {
  icon: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid grid-cols-[20px_48px_1fr_40px] items-center gap-3 text-[13px] text-white/80">
      <span className="text-center text-white/70">{icon}</span>
      <span>{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/12 accent-white"
      />
      <span className="text-right text-xs text-white/60">{value}%</span>
    </label>
  );
}

export function AuraPrototypePage() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [selectedMoodId, setSelectedMoodId] = useState("serenity");
  const [permissions, setPermissions] = useState<Record<PermissionKey, boolean>>({
    music: true,
    motion: false,
    notifications: false,
  });
  const [calibration, setCalibration] = useState({
    tempo: 32,
    vocal: 55,
    depth: 78,
    intensity: 20,
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [playerProgress, setPlayerProgress] = useState(2.18);
  const [timelineMode, setTimelineMode] = useState<"session" | "day">("session");

  const mood = useMemo(() => pickMood(selectedMoodId), [selectedMoodId]);

  useEffect(() => {
    setCalibration(pickMood(selectedMoodId).stats);
  }, [selectedMoodId]);

  useEffect(() => {
    if (!isPlaying || screen !== "player") {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setPlayerProgress((value) => {
        if (value >= 8.09) {
          return 0;
        }
        return Math.min(value + 0.03, 8.09);
      });
    }, 220);

    return () => window.clearInterval(interval);
  }, [isPlaying, screen]);

  const progressRatio = Math.min(playerProgress / 8.09, 1);

  const updatePermission = (key: PermissionKey) => {
    setPermissions((current) => ({ ...current, [key]: !current[key] }));
  };

  const renderScreen = () => {
    switch (screen) {
      case "splash":
        return (
          <div className="flex h-full flex-col items-center px-7 pb-10 pt-16 text-center">
            <TopChrome />
            <div className="mt-20">
              <AuraOrb colors={mood.colors} size="large" />
            </div>
            <h1 className="mt-10 font-['Syne'] text-[58px] font-semibold tracking-[-0.06em] text-white">
              AURA
            </h1>
            <p className="mt-2 text-xl text-white/72">Tuning, not typing.</p>
            <div className="mt-auto w-full">
              <button
                onClick={() => setScreen("moodSelect")}
                className="w-full rounded-full bg-white px-6 py-4 text-base font-semibold text-[#17122d] shadow-[0_18px_40px_rgba(255,255,255,0.16)] transition-transform hover:scale-[1.01]"
              >
                Begin
              </button>
              <button
                onClick={() => setScreen("home")}
                className="mt-4 text-sm text-white/68 transition hover:text-white"
              >
                Already have an account
              </button>
            </div>
          </div>
        );

      case "moodSelect":
        return (
          <div className="flex h-full flex-col px-5 pb-10 pt-16">
            <TopChrome />
            <div className="mt-8 text-center">
              <div className="text-[11px] tracking-[0.36em] text-white/50">03 / 04</div>
              <h2 className="mt-2 font-['Syne'] text-[34px] font-semibold tracking-[-0.05em] text-white">
                What resonates?
              </h2>
              <p className="mx-auto mt-3 max-w-[270px] text-sm leading-6 text-white/66">
                Tap what resonates. AURA will calibrate your first session.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {moods.slice(0, 4).map((item) => {
                const active = selectedMoodId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMoodId(item.id)}
                    className={`rounded-[28px] border px-4 py-4 text-left transition ${
                      active
                        ? "border-white/50 bg-white/14 shadow-[0_12px_30px_rgba(0,0,0,0.2)]"
                        : "border-white/10 bg-white/6 hover:bg-white/10"
                    }`}
                  >
                    <div
                      className="mb-4 h-3 w-3 rounded-full"
                      style={{ background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})` }}
                    />
                    <div className="text-base font-medium text-white">{item.label}</div>
                    <div className="mt-1 text-xs text-white/55">{item.tone}</div>
                    <div className="mt-3 text-2xl text-white/60">{item.icon}</div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setSelectedMoodId("serenity")}
              className={`mt-4 rounded-[28px] border px-4 py-4 text-left transition ${
                selectedMoodId === "serenity"
                  ? "border-white/50 bg-white/14 shadow-[0_12px_30px_rgba(0,0,0,0.2)]"
                  : "border-white/10 bg-white/6 hover:bg-white/10"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${mood.colors[0]}, ${mood.colors[1]})`,
                      }}
                    />
                    <span className="text-base font-medium text-white">Serenity</span>
                  </div>
                  <div className="mt-1 text-xs text-white/55">Peace · Airy · Rest</div>
                </div>
                <div className="text-2xl text-white/60">&lt;&gt;</div>
              </div>
            </button>

            <div className="mt-auto">
              <ProgressDots active={2} />
              <button
                onClick={() => setScreen("permissions")}
                className="mt-5 w-full rounded-full bg-white px-6 py-4 text-base font-semibold text-[#17122d]"
              >
                Set My Mood
              </button>
            </div>
          </div>
        );

      case "permissions":
        return (
          <div className="flex h-full flex-col px-5 pb-10 pt-16">
            <TopChrome />
            <div className="mt-8 text-center">
              <div className="text-[11px] tracking-[0.36em] text-white/50">04 / 04</div>
              <h2 className="mt-2 font-['Syne'] text-[34px] font-semibold tracking-[-0.05em] text-white">
                Almost there.
              </h2>
              <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-white/66">
                Grant what feels right. Everything optional is genuinely optional.
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <AuraOrb colors={mood.colors} size="medium" />
            </div>

            <div className="mt-8 space-y-3">
              {[
                {
                  key: "music" as const,
                  icon: "♪",
                  title: "Music library access",
                  note: "To read your existing tracks",
                },
                {
                  key: "motion" as const,
                  icon: "◎",
                  title: "Motion data",
                  note: "For ambient mood context",
                },
                {
                  key: "notifications" as const,
                  icon: "!",
                  title: "Notifications",
                  note: "For mood-shift nudges",
                },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => updatePermission(item.key)}
                  className="flex w-full items-center justify-between rounded-[24px] border border-white/10 bg-white/8 px-4 py-4 text-left backdrop-blur-sm transition hover:bg-white/12"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/12 text-white/85">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{item.title}</div>
                      <div className="mt-1 text-xs text-white/55">{item.note}</div>
                    </div>
                  </div>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                      permissions[item.key]
                        ? "border-white bg-white text-[#17122d]"
                        : "border-white/20 text-white/55"
                    }`}
                  >
                    {permissions[item.key] ? "Y" : ""}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-auto">
              <ProgressDots active={3} />
              <button
                onClick={() => setScreen("home")}
                className="mt-5 w-full rounded-full bg-white px-6 py-4 text-base font-semibold text-[#17122d]"
              >
                Enter AURA
              </button>
              <button
                onClick={() => setScreen("home")}
                className="mt-4 w-full text-sm text-white/68 transition hover:text-white"
              >
                Skip all permissions
              </button>
            </div>
          </div>
        );

      case "home":
        return (
          <div className="flex h-full flex-col px-5 pb-6 pt-16">
            <TopChrome />
            <div className="mt-4">
              <div className="text-[30px] font-semibold tracking-[-0.05em] text-white">
                Good evening.
              </div>
              <div className="mt-1 text-sm text-white/62">What are you feeling?</div>
            </div>

            <button
              onClick={() => setScreen("calibration")}
              className="mt-5 flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/8 px-4 py-3 text-left backdrop-blur-md transition hover:bg-white/12"
            >
              <AuraOrb colors={mood.colors} size="small" />
              <div className="flex-1">
                <div className="text-base font-medium text-white">Calibrate Mood</div>
                <div className="mt-1 text-xs text-white/60">
                  Tap to tune your emotional frequency
                </div>
              </div>
              <div className="text-lg text-white/75">{">"}</div>
            </button>

            <SectionLabel label="NOW PLAYING" />
            <button
              onClick={() => setScreen("player")}
              className="mt-3 rounded-[28px] border border-white/10 bg-white/8 p-3 text-left backdrop-blur-md transition hover:bg-white/12"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/16 bg-white/10">
                  <AuraOrb colors={mood.colors} size="small" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Weightless</div>
                  <div className="mt-1 text-xs text-white/58">Marconi Union</div>
                  <div className="mt-3 h-1 rounded-full bg-white/10">
                    <div className="h-full w-[38%] rounded-full bg-white" />
                  </div>
                </div>
                <div className="text-xl text-white/80">{isPlaying ? "||" : ">"}</div>
              </div>
            </button>

            <SectionLabel label="YOUR MOOD TODAY" />
            <div className="mt-3 rounded-[30px] border border-white/10 bg-white/8 p-4 backdrop-blur-md">
              <div className="text-xs text-white/78">Stressed to Serene · down 72% intensity</div>
              <div className="mt-1 text-[11px] tracking-[0.22em] text-white/45">4 SESSIONS · 2H 18M</div>
              <div className="mt-6 flex items-end gap-4">
                {timelineMoments.map((point) => (
                  <div key={point.time} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-full bg-white/6 p-1">
                      <div
                        className="rounded-full"
                        style={{
                          height: `${Math.max(point.level, 12)}px`,
                          background: `linear-gradient(180deg, ${mood.colors[0]}, ${mood.colors[1]})`,
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-white/42">{point.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <SectionLabel label={`FOR YOUR ${mood.label.toUpperCase()}`} />
            <div className="mt-3 space-y-3">
              {recommendations.map((track) => (
                <div
                  key={track.title}
                  className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/8 px-3 py-3 backdrop-blur-md"
                >
                  <div
                    className="h-10 w-1 rounded-full"
                    style={{ background: `linear-gradient(180deg, ${mood.colors[0]}, ${mood.colors[1]})` }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{track.title}</div>
                    <div className="mt-1 text-xs text-white/56">{track.artist}</div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[10px] tracking-[0.2em] text-white/62">
                    {track.mood}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <StatBadge value="38" label="TODAY" />
              <StatBadge value="7" label="TRACKS" />
              <StatBadge value="72%" label="SHIFT" />
            </div>

            <BottomNav current={screen} onChange={setScreen} />
          </div>
        );

      case "calibration":
        return (
          <div className="flex h-full flex-col px-5 pb-6 pt-16">
            <TopChrome />
            <HeaderWithBack
              overline="MOOD CALIBRATION"
              title="How are you?"
              onBack={() => setScreen("home")}
              action="?"
            />

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px]">
              {moods.map((item) => {
                const active = item.id === selectedMoodId;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMoodId(item.id)}
                    className={`rounded-full border px-3 py-1.5 transition ${
                      active
                        ? "border-white/30 bg-white/14 text-white"
                        : "border-white/10 bg-white/6 text-white/55"
                    }`}
                  >
                    {active ? "o " : ""}
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div className="text-sm text-white/44">Energy up</div>
              <div className="mt-3 rounded-full border border-white/10 bg-white/6 p-5">
                <AuraOrb colors={mood.colors} size="large" />
              </div>
              <div className="mt-4 text-[28px] font-semibold tracking-[-0.05em] text-white">
                {mood.label}
              </div>
              <div className="mt-1 text-sm text-white/58">{mood.tone}</div>
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/8 p-4 backdrop-blur-md">
              <div className="text-[10px] tracking-[0.32em] text-white/48">FINE-TUNE YOUR SIGNAL</div>
              <div className="mt-4 space-y-4">
                <SliderRow
                  icon="♪"
                  label="Tempo"
                  value={calibration.tempo}
                  onChange={(value) => setCalibration((current) => ({ ...current, tempo: value }))}
                />
                <SliderRow
                  icon="o"
                  label="Vocal"
                  value={calibration.vocal}
                  onChange={(value) => setCalibration((current) => ({ ...current, vocal: value }))}
                />
                <SliderRow
                  icon="~"
                  label="Depth"
                  value={calibration.depth}
                  onChange={(value) => setCalibration((current) => ({ ...current, depth: value }))}
                />
                <SliderRow
                  icon="+"
                  label="Intensity"
                  value={calibration.intensity}
                  onChange={(value) => setCalibration((current) => ({ ...current, intensity: value }))}
                />
              </div>
            </div>

            <button
              onClick={() => setScreen("player")}
              className="mt-4 rounded-full bg-white px-6 py-4 text-base font-semibold text-[#17122d]"
            >
              Tune my AURA
            </button>

            <BottomNav current={screen} onChange={setScreen} />
          </div>
        );

      case "player":
        return (
          <div className="flex h-full flex-col px-5 pb-6 pt-16">
            <TopChrome />
            <HeaderWithBack
              overline="NOW PLAYING"
              title="Serenity Session"
              onBack={() => setScreen("home")}
              action="..."
            />

            <div className="mt-6 flex justify-center">
              <div className="rounded-[40px] border border-white/10 bg-white/8 p-7 backdrop-blur-md">
                <AuraOrb colors={mood.colors} size="large" />
              </div>
            </div>

            <div className="mt-5 flex items-start justify-between">
              <div>
                <div className="text-[26px] font-semibold tracking-[-0.05em] text-white">
                  Weightless
                </div>
                <div className="mt-1 text-sm text-white/58">Marconi Union · 2012</div>
              </div>
              <button className="mt-1 text-lg text-white/72">♡</button>
            </div>

            <div className="mt-6">
              <div className="flex h-8 items-end gap-[3px]">
                {Array.from({ length: 48 }).map((_, index) => {
                  const height = 10 + Math.abs(Math.sin(index * 0.55 + playerProgress * 1.9)) * 22;
                  return (
                    <div
                      key={index}
                      className="flex-1 rounded-full bg-white/80"
                      style={{ height, opacity: 0.5 + ((index % 4) * 0.1) }}
                    />
                  );
                })}
              </div>

              <div className="mt-4 h-1.5 rounded-full bg-white/10">
                <div
                  className="relative h-full rounded-full bg-white"
                  style={{ width: `${progressRatio * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.7)]" />
                </div>
              </div>

              <div className="mt-2 flex justify-between text-[11px] text-white/48">
                <span>{formatMinutes(playerProgress)}</span>
                <span>8:09</span>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between text-white">
              <button className="text-xl text-white/56">{"<>"}</button>
              <button className="text-2xl text-white/72">{"<<"}</button>
              <button
                onClick={() => setIsPlaying((value) => !value)}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-[#17122d] shadow-[0_18px_40px_rgba(255,255,255,0.16)]"
              >
                {isPlaying ? "||" : ">"}
              </button>
              <button className="text-2xl text-white/72">{">>"}</button>
              <button className="text-xl text-white/56">{"[]"}</button>
            </div>

            <div className="mt-7 grid grid-cols-4 gap-3 text-center">
              {[
                ["+", "ADD"],
                ["o", "ORB"],
                ["^", "SHARE"],
                ["...", "MORE"],
              ].map(([icon, label]) => (
                <button
                  key={label}
                  className="rounded-[24px] border border-white/10 bg-white/8 px-2 py-3 text-white/78 backdrop-blur-md"
                >
                  <div className="text-xl">{icon}</div>
                  <div className="mt-2 text-[10px] tracking-[0.24em]">{label}</div>
                </button>
              ))}
            </div>

            <BottomNav current={screen} onChange={setScreen} />
          </div>
        );

      case "timeline":
        return (
          <div className="flex h-full flex-col px-5 pb-6 pt-16">
            <TopChrome />
            <HeaderWithBack
              overline="FLOW TIMELINE"
              title="Tonight's Arc"
              onBack={() => setScreen("home")}
              action="^"
            />

            <div className="mt-5 rounded-full border border-white/10 bg-white/8 p-1 backdrop-blur-md">
              <div className="grid grid-cols-2 gap-1 text-sm">
                <button
                  onClick={() => setTimelineMode("session")}
                  className={`rounded-full px-4 py-2 transition ${
                    timelineMode === "session" ? "bg-white text-[#17122d]" : "text-white/58"
                  }`}
                >
                  Session Arc
                </button>
                <button
                  onClick={() => setTimelineMode("day")}
                  className={`rounded-full px-4 py-2 transition ${
                    timelineMode === "day" ? "bg-white text-[#17122d]" : "text-white/58"
                  }`}
                >
                  Day View
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-3">
              <StatBadge value="7" label="TRACKS" />
              <StatBadge value="2h 18m" label="LENGTH" />
              <StatBadge value="72%" label="SHIFT" />
              <StatBadge value="14d" label="STREAK" />
            </div>

            <div className="mt-6 rounded-[30px] border border-white/10 bg-white/8 p-5 backdrop-blur-md">
              <div className="flex items-end justify-between">
                {timelineMoments.map((point, index) => (
                  <div key={point.time} className="flex flex-col items-center gap-3">
                    <div className="text-[10px] tracking-[0.24em] text-white/42">{point.time}</div>
                    <div className="relative flex h-52 w-12 items-end rounded-full bg-white/6 p-1">
                      <div
                        className="w-full rounded-full"
                        style={{
                          height: `${30 + point.level * 1.4}px`,
                          background: `linear-gradient(180deg, ${mood.colors[index % 2]}, rgba(255,255,255,0.85))`,
                        }}
                      />
                    </div>
                    <div className="max-w-[64px] text-center text-[11px] leading-4 text-white/58">
                      {timelineMode === "session" ? point.note : `${point.level}% lift`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-[28px] border border-white/10 bg-white/8 p-4 backdrop-blur-md">
              <div className="text-[10px] tracking-[0.32em] text-white/42">TONIGHT'S SUMMARY</div>
              <div className="mt-3 space-y-3">
                {[
                  "Started in stress, landed in serenity after the second track.",
                  "Tempo response peaked after 18 minutes and held steady.",
                  "Low-intensity endings helped maintain sleep-ready energy.",
                ].map((line) => (
                  <div key={line} className="rounded-[18px] bg-white/6 px-3 py-3 text-sm leading-6 text-white/72">
                    {line}
                  </div>
                ))}
              </div>
            </div>

            <BottomNav current={screen} onChange={setScreen} />
          </div>
        );

      case "you":
        return (
          <div className="flex h-full flex-col px-5 pb-6 pt-16">
            <TopChrome />
            <div className="mt-4 text-center">
              <div className="text-[11px] tracking-[0.36em] text-white/48">YOU</div>
              <div className="mt-2 font-['Syne'] text-[34px] font-semibold tracking-[-0.05em] text-white">
                Your frequency.
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/18 bg-white/10 text-3xl font-semibold text-white">
                K
                <div
                  className="absolute right-2 top-2 h-3 w-3 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${mood.colors[0]}, ${mood.colors[1]})` }}
                />
              </div>
              <div className="mt-4 text-[28px] font-semibold tracking-[-0.05em] text-white">
                Kreshant Kumar
              </div>
              <div className="mt-1 text-sm text-white/58">{mood.label} · 14 day streak</div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <StatBadge value="47" label="SESSIONS" />
              <StatBadge value="2h 18m" label="AVG LENGTH" />
              <StatBadge value="68%" label="AVG SHIFT" />
            </div>

            <SectionLabel label="YOUR EMOTIONAL SPECTRUM" />
            <div className="mt-3 rounded-[28px] border border-white/10 bg-white/8 p-4 backdrop-blur-md">
              <div className="space-y-4">
                {spectrum.map((item, index) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm text-white/72">
                      <span>{item.label}</span>
                      <span className="text-xs text-white/48">{item.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.value}%`,
                          background: `linear-gradient(90deg, ${mood.colors[index % 2]}, rgba(255,255,255,0.8))`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SectionLabel label="PREFERENCES" />
            <div className="mt-3 space-y-3">
              {[
                ["Moon", "Sleep Timer", "Auto · Serenity"],
                ["Pulse", "Haptic Feedback", "On"],
                ["Glow", "Aurora Intensity", "High"],
              ].map(([icon, title, note]) => (
                <button
                  key={title}
                  className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 text-left backdrop-blur-md transition hover:bg-white/12"
                >
                  <div>
                    <div className="text-sm font-medium text-white">{title}</div>
                    <div className="mt-1 text-xs text-white/54">{note}</div>
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/36">{icon}</div>
                </button>
              ))}
            </div>

            <button className="mt-auto text-sm text-white/52 transition hover:text-white/78">
              Sign out
            </button>

            <BottomNav current={screen} onChange={setScreen} />
          </div>
        );
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf7f2]">
      <Navbar />

      <div className="relative overflow-hidden px-4 pb-24 pt-32 sm:px-6 md:pt-40">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 h-[24rem] w-[32rem] rounded-full bg-gradient-to-bl from-violet-100/40 to-transparent blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[20rem] w-[26rem] rounded-full bg-gradient-to-tr from-amber-100/30 to-transparent blur-[90px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(#8b5cf6 1px, transparent 1px), linear-gradient(90deg, #8b5cf6 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10">
            <Link
              to="/projects/aura-app"
              className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400 transition-colors duration-200 hover:text-violet-600"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to case study
            </Link>
          </div>

          <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-purple-600">
                <span className="h-px w-4 bg-purple-400" />
                Live Prototype
              </span>
              <h1 className="mt-5 font-display font-black leading-[0.9] tracking-tight">
                <span
                  className="block text-[clamp(2.8rem,8vw,6.2rem)] text-[#111111]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  AURA
                </span>
                <span
                  className="block text-[clamp(2.6rem,7vw,5.8rem)]"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "2px #7c3aed",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  Prototype
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-neutral-500">
                This is the interactive version of the Aura app concept. It keeps the mood-led
                flow from the Figma screens, but sits inside the same editorial world as the rest
                of the portfolio so it feels like a designed project, not a detached demo.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                ["Splash", "splash"],
                ["Home", "home"],
                ["Calibration", "calibration"],
                ["Player", "player"],
              ].map(([label, target]) => (
                <button
                  key={target}
                  onClick={() => setScreen(target as Screen)}
                  className="rounded-full border border-neutral-300 bg-white/70 px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition-all duration-200 hover:border-violet-400 hover:text-violet-700"
                >
                  {label}
                </button>
              ))}
              <Link
                to="/projects/aura-app"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#7c3aed,#a855f7,#c084fc)] px-5 py-2 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(124,58,237,0.22)]"
              >
                Case Study
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <section className="rounded-[32px] border border-neutral-200/70 bg-white/75 p-6 shadow-[0_20px_60px_rgba(17,17,17,0.06)] backdrop-blur-md md:p-8">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Splash to onboarding flow",
                  "Mood selection and permission gates",
                  "Live calibration sliders",
                  "Animated playback and progress",
                  "Timeline summary states",
                  "Profile spectrum and settings",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-neutral-200/70 bg-[#faf7f2] px-4 py-4 text-sm leading-6 text-neutral-600"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <img
                  src="/images/projects/aura/mockup-overview.svg"
                  alt="Aura overview mockup"
                  className="rounded-[24px] border border-neutral-200/70 bg-[#faf7f2]"
                />
                <img
                  src="/images/projects/aura/screen-grid.svg"
                  alt="Aura screen grid"
                  className="rounded-[24px] border border-neutral-200/70 bg-[#faf7f2]"
                />
              </div>
            </section>

            <section className="relative mx-auto w-full max-w-[460px]">
              <div className="absolute left-1/2 top-10 h-[85%] w-[85%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(153,112,255,0.24),_transparent_60%)] blur-3xl" />
              <div className="relative mx-auto rounded-[44px] border border-white/12 bg-[#0e0918]/80 p-3 shadow-[0_40px_120px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
                <div className="relative mx-auto h-[844px] max-h-[82vh] w-full max-w-[390px] overflow-hidden rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,_rgba(12,8,24,0.98)_0%,_rgba(10,6,18,0.98)_100%)]">
                  <PhoneBackground colors={mood.colors} />
                  {renderScreen()}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function TopChrome() {
  return (
    <div className="flex items-center justify-between text-xs text-white/74">
      <span>9:41</span>
      <div className="h-9 w-32 rounded-full border border-white/10 bg-black/30" />
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/55" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/32" />
      </div>
    </div>
  );
}

function PhoneBackground({ colors }: { colors: [string, string] }) {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_30%)]" />
      <div
        className="absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-60 blur-3xl"
        style={{ background: colors[0] }}
      />
      <div
        className="absolute bottom-28 right-[-3rem] h-72 w-72 rounded-full opacity-45 blur-3xl"
        style={{ background: colors[1] }}
      />
      <div className="absolute left-12 top-64 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0)_24%,_rgba(255,255,255,0.03)_100%)]" />
    </>
  );
}

function ProgressDots({ active }: { active: number }) {
  return (
    <div className="flex justify-center gap-3">
      {[0, 1, 2, 3].map((index) => (
        <span
          key={index}
          className={`rounded-full transition-all ${
            index === active ? "h-1.5 w-8 bg-white" : "h-1.5 w-1.5 bg-white/35"
          }`}
        />
      ))}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <div className="mt-6 text-[11px] tracking-[0.34em] text-white/46">{label}</div>;
}

function HeaderWithBack({
  overline,
  title,
  action,
  onBack,
}: {
  overline: string;
  title: string;
  action: string;
  onBack: () => void;
}) {
  return (
    <div className="mt-3 flex items-start justify-between">
      <button
        onClick={onBack}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/70"
      >
        {"<"}
      </button>
      <div className="text-center">
        <div className="text-[11px] tracking-[0.32em] text-white/42">{overline}</div>
        <div className="mt-1 text-[30px] font-semibold tracking-[-0.05em] text-white">{title}</div>
      </div>
      <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/70">
        {action}
      </button>
    </div>
  );
}

function BottomNav({
  current,
  onChange,
}: {
  current: Screen;
  onChange: (screen: Screen) => void;
}) {
  return (
    <div className="mt-auto pt-4">
      <div className="grid grid-cols-5 rounded-[28px] border border-white/10 bg-white/8 px-2 py-2 backdrop-blur-lg">
        {navItems.map((item) => {
          const active = current === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className="relative rounded-[20px] px-2 py-2 text-center transition hover:bg-white/8"
            >
              <div className={`text-sm ${active ? "text-white" : "text-white/44"}`}>{item.icon}</div>
              <div
                className={`mt-1 text-[10px] tracking-[0.22em] ${
                  active ? "text-white" : "text-white/35"
                }`}
              >
                {item.label}
              </div>
              {active ? <div className="mx-auto mt-2 h-1.5 w-1.5 rounded-full bg-white" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
