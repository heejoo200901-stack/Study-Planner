import { useEffect, useMemo, useState, type ReactNode } from "react";
import schoolLogo from "./assets/gimpojeil-logo.png";

type IconName =
  | "home" | "calendar" | "chart" | "book" | "settings" | "bell" | "clock"
  | "sparkles" | "check" | "arrow" | "refresh" | "user" | "info" | "target"
  | "plus" | "trash" | "play" | "pause" | "flame" | "method";

type Subject = {
  name: string;
  importance: number;
  baseScore: number;
  color: string;
  pale: string;
  text: string;
  task: string;
};

type Profile = {
  name: string;
  school: string;
  grade: string;
  goal: string;
};

const curriculum = [
  "화법과 언어", "미적분 I", "영어 II", "체육 2", "독서 토론과 글쓰기", "기하",
  "영미 문학 읽기", "도시의 미래 탐구", "세계사", "정치", "사회문제 탐구",
  "현대사회와 윤리", "기후변화와 지속가능한 세계", "역학과 에너지", "물질과 에너지",
  "세포와 물질대사", "지구시스템과학", "지식 재산 일반", "데이터과학",
  "소프트웨어와 생활", "중국 문화", "일본 문화",
];

const subjectLooks = [
  ["bg-indigo-500", "bg-indigo-50", "text-indigo-700"],
  ["bg-emerald-500", "bg-emerald-50", "text-emerald-700"],
  ["bg-amber-500", "bg-amber-50", "text-amber-700"],
  ["bg-rose-500", "bg-rose-50", "text-rose-700"],
  ["bg-sky-500", "bg-sky-50", "text-sky-700"],
  ["bg-violet-500", "bg-violet-50", "text-violet-700"],
  ["bg-teal-500", "bg-teal-50", "text-teal-700"],
  ["bg-orange-500", "bg-orange-50", "text-orange-700"],
];

const taskByCategory = (name: string) => {
  if (name.includes("수학") || name === "기하") return "핵심 유형 10문제 풀이 후 오답 원인 표시";
  if (name.includes("영어") || name.includes("문학")) return "핵심 어휘 인출 후 지문 2개 근거 표시";
  if (name.includes("에너지") || name.includes("물질") || name.includes("과학")) return "개념을 말로 설명하고 기출 문항에 적용";
  if (name.includes("언어") || name.includes("독서")) return "지문 구조를 요약하고 선지 판단 근거 기록";
  return "핵심 개념 백지 인출 후 취약 문제 다시 풀기";
};

const createSubject = (name: string, index: number): Subject => {
  const look = subjectLooks[index % subjectLooks.length];
  return {
    name,
    importance: [1.2, 1.3, 1, 0.9, 1.1][index % 5],
    baseScore: [72, 68, 81, 76, 64][index % 5],
    color: look[0],
    pale: look[1],
    text: look[2],
    task: taskByCategory(name),
  };
};

const learningMethods = [
  { title: "코넬 노트법", tag: "정리", summary: "단서·내용·요약으로 노트를 나눠 기록하고, 복습할 때 질문을 만든 뒤 보지 않고 요약해요.", example: "세계사: 사건 흐름을 적은 뒤 ‘결과가 달라진 원인은?’ 질문을 만들고 마지막 3줄로 요약.", steps: ["내용 기록", "질문 만들기", "가리고 요약"] },
  { title: "파인만 기법", tag: "이해", summary: "7세 아이도 이해할 쉬운 말로 설명해요. 말이 막히는 지점이 바로 보완할 지식 구멍이에요.", example: "역학과 에너지: 작용·반작용을 설명하다 막히면 F=ma와 물체별 힘을 다시 연결.", steps: ["쉽게 설명", "막힌 곳 표시", "다시 설명"] },
  { title: "인출 학습", tag: "암기", summary: "입력 40%, 인출 60%. 책을 덮고 기억나는 내용을 빈 종이에 꺼내는 강력한 학습법이에요.", example: "영어 II: 단어 20개를 5분간 본 뒤 백지 테스트하고 틀린 단어만 다시 암기.", steps: ["짧게 입력", "책 덮기", "백지 테스트"] },
  { title: "간격 반복", tag: "복습", summary: "망각 곡선에 맞춰 5분, 1일, 1주, 1개월 주기로 복습하고 어려운 내용은 간격을 좁혀요.", example: "미적분 I: 오늘 공식 학습 → 내일 아침 적용 → 다음 주 유도 과정을 백지에 쓰기.", steps: ["5분 뒤", "1일 뒤", "1주 뒤"] },
  { title: "SQ3R 독서법", tag: "독해", summary: "훑어보기, 질문하기, 읽기, 암기하기, 검토하기 순서로 제목을 질문으로 바꿔 읽어요.", example: "지구시스템과학: 그래프를 먼저 보고 ‘왜 값이 오르내릴까?’ 질문한 뒤 답을 찾으며 읽기.", steps: ["훑기·질문", "읽기·암기", "검토"] },
  { title: "마인드맵", tag: "구조화", summary: "중심 개념에서 굵은 가지와 세부 가지로 확장하고 아이콘과 색으로 지식을 구조화해요.", example: "화법과 언어: 작품을 중심으로 배경, 인물, 사건, 표현법 가지를 연결.", steps: ["중심 개념", "핵심 가지", "세부 연결"] },
  { title: "메타인지 모니터링", tag: "진단", summary: "이해도를 O, ?, X로 엄격하게 구분해 모르는 것부터 다시 학습해요.", example: "기하: 풀이마다 O, ?, X를 표시하고 시험 전에는 ?와 X 문제만 집중 재학습.", steps: ["상태 표시", "이유 확인", "?·X 우선"] },
  { title: "교차 학습", tag: "문제풀이", summary: "한 단원만 오래 풀지 않고 과목이나 유형을 섞어 문제 조건을 판단하는 힘을 길러요.", example: "미적분 I: 극한 5개, 미분 5개, 적분 5개를 섞어 어떤 공식을 쓸지 먼저 판단.", steps: ["유형 섞기", "조건 판단", "전략 비교"] },
  { title: "정교화 질문", tag: "연결", summary: "새로운 정보를 볼 때 ‘이게 왜 사실이지?’라고 물어 기존 배경지식과 연결해요.", example: "물질과 에너지: ‘소금물에서 철이 왜 빨리 녹을까?’를 전해질 역할과 연결.", steps: ["왜 묻기", "기존 지식 찾기", "연결 설명"] },
  { title: "슬로 리딩", tag: "독해", summary: "속도보다 방향에 집중하며 접속사와 조사 변화를 통해 문장 사이의 논리적 징검다리를 찾아요.", example: "독서 토론과 글쓰기: ‘하지만’에서 멈춰 앞 문장과 반대되는 핵심을 한 줄로 정리.", steps: ["접속사 표시", "관계 파악", "한 줄 정리"] },
];

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="M3 10.8 12 3l9 7.8"/><path d="M5 9.5V21h14V9.5M9 21v-7h6v7"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z"/><path d="M8 7h8M8 11h6"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    sparkles: <><path d="m12 3 1.1 3.4L16.5 8l-3.4 1.6L12 13l-1.1-3.4L7.5 8l3.4-1.6L5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14ZM19 13l.7 2.3L22 16l-2.3.7L19 19l-.7-2.3L16 16l2.3-.7L19 13Z"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    refresh: <><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></>,
    play: <path d="m8 5 11 7-11 7V5Z"/>,
    pause: <><path d="M8 5v14M16 5v14"/></>,
    flame: <path d="M13 3s1 4-2 6c-2-3-5-1-5 3a6 6 0 1 0 12 0c0-3-2-6-5-9Z"/>,
    method: <><path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5"/></>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Button({ children, className = "", onClick, disabled = false }: { children: ReactNode; className?: string; onClick?: () => void; disabled?: boolean }) {
  return <button type="button" disabled={disabled} onClick={onClick} className={`cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}>{children}</button>;
}

function TextInput({ value, placeholder, onChange, className = "", type = "text" }: { value: string; placeholder: string; onChange: (value: string) => void; className?: string; type?: string }) {
  return <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={`min-w-0 rounded-lg border border-slate-200 bg-white text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${className}`} />;
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white ${className}`}>{children}</section>;
}

function Stepper({ label, value, unit, min, max, step, onChange, icon, guide, inputValue, onInputChange, error }: { label: string; value: number; unit: string; min: number; max: number; step: number; onChange: (value: number) => void; icon: IconName; guide: string; inputValue?: string; onInputChange?: (value: string) => void; error?: string }) {
  return (
    <div className={`rounded-xl border bg-slate-50 p-4 ${error ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-200"}`}>
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Icon name={icon} className="size-4 text-indigo-500" />{label}</div>
      <div className="mt-3 flex items-center justify-between">
        <Button onClick={() => onChange(Math.max(min, +(value - step).toFixed(1)))} className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-600">−</Button>
        <div className="flex items-end justify-center gap-1 text-center">
          {onInputChange ? <input value={inputValue} inputMode="decimal" aria-label={label} onChange={(event) => onInputChange(event.target.value)} className="w-14 border-0 bg-transparent p-0 text-center text-2xl font-black tracking-tight outline-none" /> : <span className="text-2xl font-black tracking-tight">{value}</span>}
          <span className="mb-1 text-xs font-medium text-slate-400">{unit}</span>
        </div>
        <Button onClick={() => onChange(Math.min(max, +(value + step).toFixed(1)))} className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-600">+</Button>
      </div>
      <div className={`mt-2 text-center text-[10px] font-semibold ${error ? "text-rose-600" : "text-slate-400"}`}>{error || guide}</div>
    </div>
  );
}

function ScoreRadar({ items }: { items: { name: string; predicted: number }[] }) {
  const centerX = 160;
  const centerY = 135;
  const radius = 82;
  const point = (index: number, value: number, extraRadius = radius) => {
    const angle = ((Math.PI * 2 * index) / items.length) - (Math.PI / 2);
    const distance = extraRadius * (value / 100);
    return { x: centerX + Math.cos(angle) * distance, y: centerY + Math.sin(angle) * distance };
  };
  const polygon = (value: number) => items.map((_, index) => {
    const position = point(index, value);
    return `${position.x},${position.y}`;
  }).join(" ");
  const scorePolygon = items.map((item, index) => {
    const position = point(index, item.predicted);
    return `${position.x},${position.y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 320 280" className="mx-auto w-full max-w-sm" role="img" aria-label={`${items.length}각형 과목별 예상 점수 차트`}>
      {[25, 50, 75, 100].map((level) => <polygon key={level} points={polygon(level)} className="fill-none stroke-slate-200" strokeWidth="1" />)}
      {items.map((item, index) => {
        const end = point(index, 100);
        const label = point(index, 100, 112);
        const shortName = item.name.length > 8 ? `${item.name.slice(0, 7)}…` : item.name;
        return <g key={item.name}><line x1={centerX} y1={centerY} x2={end.x} y2={end.y} className="stroke-slate-200" /><text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" className="fill-slate-600 text-[10px] font-bold">{shortName}</text></g>;
      })}
      <polygon points={scorePolygon} className="fill-indigo-500/15 stroke-indigo-600" strokeWidth="2.5" strokeLinejoin="round" />
      {items.map((item, index) => {
        const position = point(index, item.predicted);
        return <circle key={item.name} cx={position.x} cy={position.y} r="4" className="fill-white stroke-indigo-600" strokeWidth="2.5" />;
      })}
    </svg>
  );
}

const navItems: { label: string; icon: IconName }[] = [
  { label: "맞춤 전략", icon: "sparkles" },
  { label: "학습 플래너", icon: "calendar" },
  { label: "추천 학습법", icon: "method" },
  { label: "과목 관리", icon: "book" },
];

function getFutureDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export default function App() {
  const [activeNav, setActiveNav] = useState("맞춤 전략");
  const [profile, setProfile] = useState<Profile>({ name: "김희주", school: "김포제일고등학교", grade: "2학년", goal: "이번 시험 평균 85점" });
  const [examName, setExamName] = useState("시험");
  const [examDate, setExamDate] = useState(getFutureDate(18));
  const [studyHours, setStudyHours] = useState(4);
  const [studyHoursInput, setStudyHoursInput] = useState("4");
  const [sleepHours, setSleepHours] = useState(5.5);
  const [focus, setFocus] = useState(3);
  const [previousScore, setPreviousScore] = useState(72);
  const [subjects, setSubjects] = useState<Subject[]>(() => ["화법과 언어", "미적분 I", "영어 II", "세계사", "역학과 에너지"].map(createSubject));
  const [completed, setCompleted] = useState<string[]>(["화법과 언어", "미적분 I"]);
  const [version, setVersion] = useState(1);
  const [analyzedConditions, setAnalyzedConditions] = useState({ studyHours: 4, sleepHours: 5.5, focus: 3, previousScore: 72 });
  const [minuteEdits, setMinuteEdits] = useState<Record<string, number>>({});
  const [taskEdits, setTaskEdits] = useState<Record<string, string>>({});
  const [removedTasks, setRemovedTasks] = useState<string[]>([]);
  const [customTasks, setCustomTasks] = useState<{ id: string; title: string; minutes: number }[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [methodFilter, setMethodFilter] = useState("전체");
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerElapsed, setTimerElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerRecords, setTimerRecords] = useState<{ id: number; subject: string; seconds: number }[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ studyHours?: string }>({});
  const [notice, setNotice] = useState<{ title: string; message: string } | null>(null);

  const examDays = useMemo(() => {
    const target = new Date(`${examDate}T23:59:59`);
    const today = new Date();
    return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86400000));
  }, [examDate]);

  useEffect(() => {
    if (!timerRunning) return;
    const timer = window.setInterval(() => {
      setTimerSeconds((seconds) => {
        if (seconds <= 1) {
          setTimerRunning(false);
          setTimerElapsed((elapsed) => elapsed + 1);
          return 0;
        }
        setTimerElapsed((elapsed) => elapsed + 1);
        return seconds - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning]);

  const analysis = useMemo(() => {
    const { studyHours: appliedStudyHours, sleepHours: appliedSleepHours, focus: appliedFocus, previousScore: appliedPreviousScore } = analyzedConditions;
    const condition =
      appliedSleepHours < 6 ? { name: "회복 우선형", tone: "text-amber-700", box: "bg-amber-50 border-amber-200", description: "수면이 부족해 인지 피로가 예상돼요. 고난도 문제보다 인출 복습을 먼저 배치했어요.", method: "인출 학습" } :
      appliedFocus <= 2 ? { name: "집중 회복형", tone: "text-rose-700", box: "bg-rose-50 border-rose-200", description: "집중도가 낮은 상태예요. 25분 단위의 짧은 학습과 잦은 휴식이 효과적이에요.", method: "교차 학습" } :
      appliedFocus >= 4 ? { name: "몰입 학습형", tone: "text-emerald-700", box: "bg-emerald-50 border-emerald-200", description: "집중도가 높은 상태예요. 취약 과목의 고난도 문제를 앞 순서에 배치했어요.", method: "파인만 기법" } :
      { name: "균형 학습형", tone: "text-indigo-700", box: "bg-indigo-50 border-indigo-200", description: "안정적인 컨디션이에요. 개념과 문제 풀이를 균형 있게 구성했어요.", method: "메타인지 모니터링" };
    const conditionDelta = (appliedStudyHours * 2.1) + ((appliedSleepHours - 6) * 1.2) + ((appliedFocus - 3) * 2);
    const predictedScore = Math.min(98, Math.max(0, Math.round(appliedPreviousScore + conditionDelta)));
    const rows = subjects.map((subject) => {
      const subjectPrediction = Math.min(98, Math.max(0, predictedScore + subject.baseScore - appliedPreviousScore));
      const weight = subject.importance * (1 / (examDays + 1)) * (100 - subjectPrediction);
      return { ...subject, dDay: examDays, predicted: subjectPrediction, weight };
    });
    const totalWeight = rows.reduce((sum, subject) => sum + subject.weight, 0);
    const totalMinutes = appliedStudyHours * 60;
    const allocations = rows.map((subject) => {
      const rawMinutes = totalMinutes * subject.weight / totalWeight;
      return { ...subject, minutes: Math.floor(rawMinutes / 5) * 5, remainder: rawMinutes % 5 };
    });
    let left = totalMinutes - allocations.reduce((sum, subject) => sum + subject.minutes, 0);
    [...allocations].sort((a, b) => b.remainder - a.remainder).forEach((subject) => {
      if (left >= 5) {
        subject.minutes += 5;
        left -= 5;
      }
    });
    return { condition, predictedScore, allocations };
  }, [analyzedConditions, subjects, examDays, version]);

  const planItems = [
    ...analysis.allocations.filter((subject) => !removedTasks.includes(subject.name)).map((subject) => ({
      id: subject.name, name: subject.name, task: taskEdits[subject.name] ?? subject.task,
      minutes: minuteEdits[subject.name] ?? subject.minutes, isCustom: false,
    })),
    ...customTasks.map((task) => ({
      id: task.id, name: "직접 추가", task: taskEdits[task.id] ?? task.title,
      minutes: minuteEdits[task.id] ?? task.minutes, isCustom: true,
    })),
  ];
  const planMinutes = planItems.reduce((sum, item) => sum + item.minutes, 0);
  const completedCount = planItems.filter((item) => completed.includes(item.id)).length;
  const completedMinutes = planItems.filter((item) => completed.includes(item.id)).reduce((sum, item) => sum + item.minutes, 0);
  const prioritySubject = [...analysis.allocations].sort((a, b) => b.minutes - a.minutes)[0];
  const hasPendingAnalysis = Number(studyHoursInput) !== analyzedConditions.studyHours
    || !studyHoursInput.trim()
    || sleepHours !== analyzedConditions.sleepHours
    || focus !== analyzedConditions.focus
    || previousScore !== analyzedConditions.previousScore;

  const addCustomTask = () => {
    const title = newTask.trim();
    if (!title) return;
    setCustomTasks((tasks) => [...tasks, { id: `custom-${Date.now()}`, title, minutes: 30 }]);
    setNewTask("");
  };
  const resetPlan = () => {
    setMinuteEdits({});
    setTaskEdits({});
    setRemovedTasks([]);
    setCustomTasks([]);
    setCompleted([]);
  };
  const toggleSubject = (name: string) => {
    const exists = subjects.some((subject) => subject.name === name);
    if (exists) {
      const remaining = subjects.filter((subject) => subject.name !== name);
      setSubjects(remaining);
      setCompleted((items) => items.filter((item) => item !== name));
      if (remaining.length === 0) {
        setNotice({ title: "시험 과목이 비어 있어요", message: "시험 과목을 1개 이상 선택해야 맞춤형 전략을 짤 수 있어요!" });
      }
    } else if (subjects.length < 8) {
      setSubjects((items) => [...items, createSubject(name, items.length)]);
    }
  };
  const updateSubject = (name: string, patch: Partial<Subject>) => {
    setSubjects((items) => items.map((subject) => subject.name === name ? { ...subject, ...patch } : subject));
  };
  const addNewSubject = () => {
    const name = newSubject.trim();
    if (!name || subjects.length >= 8 || subjects.some((subject) => subject.name === name)) return;
    setSubjects((items) => [...items, createSubject(name, items.length)]);
    setNewSubject("");
  };
  const goToMethod = (method: string) => {
    setMethodFilter("전체");
    setActiveNav("추천 학습법");
    window.setTimeout(() => document.getElementById(method)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };
  const analyzeConditions = () => {
    const parsedStudyHours = Number(studyHoursInput);
    if (!studyHoursInput.trim() || !Number.isFinite(parsedStudyHours) || parsedStudyHours < 0.5 || parsedStudyHours > 15) {
      setValidationErrors({ studyHours: "앗! 하루 공부 시간은 최소 0.5시간, 최대 15시간으로 입력해 주세요." });
      return;
    }
    if (subjects.length === 0) {
      setNotice({ title: "분석할 과목이 없어요", message: "시험 과목을 1개 이상 선택해야 맞춤형 전략을 짤 수 있어요!" });
      return;
    }
    if (examDays === 0) {
      setNotice({ title: "시험 날짜를 확인해 주세요", message: "D-Day는 최소 1일 이상이어야 해요. 내일 이후의 시험 날짜를 선택해 주세요!" });
      return;
    }
    setValidationErrors({});
    setStudyHours(parsedStudyHours);
    setAnalyzedConditions({ studyHours: parsedStudyHours, sleepHours, focus, previousScore });
    setVersion((current) => current + 1);
  };
  const saveTimerRecord = () => {
    if (timerElapsed <= 0) return;
    setTimerRecords((records) => [{ id: Date.now(), subject: prioritySubject?.name ?? "자율 학습", seconds: timerElapsed }, ...records]);
    setTimerRunning(false);
    setTimerSeconds(25 * 60);
    setTimerElapsed(0);
  };

  const PlanList = ({ full = false }: { full?: boolean }) => (
    <Card className={full ? "p-6" : "p-6"}>
      <div className="flex items-center justify-between">
        <div><div className="text-base font-bold">{full ? "오늘의 상세 플래너" : "오늘의 실행 계획"}</div><div className="mt-1 text-xs text-slate-400">AI 초안을 내 계획으로 자유롭게 수정해요</div></div>
        <Button onClick={resetPlan} className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-200"><Icon name="refresh" className="size-3.5" />초기화</Button>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white">
        <div className="text-xs text-slate-400"><span className="font-bold text-white">{completedCount}/{planItems.length}</span>개 완료</div>
        <div className="text-xs text-slate-400">완료 <span className="font-bold text-emerald-400">{completedMinutes}분</span> · 계획 <span className="font-bold text-white">{Math.floor(planMinutes / 60)}시간 {planMinutes % 60}분</span></div>
      </div>
      <div className={`mt-5 grid gap-3 ${full ? "lg:grid-cols-2" : ""}`}>
        {planItems.map((item, index) => {
          const done = completed.includes(item.id);
          return (
            <div key={item.id} className={`rounded-xl border p-4 transition-all ${done ? "border-slate-100 bg-slate-50" : "border-slate-200 bg-white"}`}>
              <div className="flex items-start gap-3">
                <Button onClick={() => setCompleted((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg border ${done ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 text-transparent hover:border-indigo-400"}`}><Icon name="check" className="size-3.5" /></Button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2"><span className={`truncate text-sm font-bold ${done ? "line-through" : ""}`}>{index + 1}. {item.name}</span><span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${item.isCustom ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700"}`}>{item.isCustom ? "내 과제" : "AI"}</span></div>
                    <Button onClick={() => item.isCustom ? setCustomTasks((tasks) => tasks.filter((task) => task.id !== item.id)) : setRemovedTasks((tasks) => [...tasks, item.id])} className="text-slate-300 hover:text-rose-500"><Icon name="trash" className="size-4" /></Button>
                  </div>
                  <TextInput value={item.task} placeholder="학습 내용을 입력하세요" onChange={(value) => setTaskEdits((edits) => ({ ...edits, [item.id]: value }))} className={`mt-2 w-full px-2.5 py-2 text-xs ${done ? "line-through opacity-60" : ""}`} />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">5분 단위 조정</span>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => setMinuteEdits((edits) => ({ ...edits, [item.id]: Math.max(10, item.minutes - 5) }))} className="flex size-6 items-center justify-center rounded-md border border-slate-200 text-sm text-slate-500">−</Button>
                      <span className="w-10 text-center text-xs font-bold">{item.minutes}분</span>
                      <Button onClick={() => setMinuteEdits((edits) => ({ ...edits, [item.id]: item.minutes + 5 }))} className="flex size-6 items-center justify-center rounded-md border border-slate-200 text-sm text-slate-500">+</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 p-3">
        <div className="mb-2 text-xs font-bold text-indigo-700">내 과제 직접 추가</div>
        <div className="flex gap-2"><TextInput value={newTask} placeholder="예: 영어 단어 백지 테스트" onChange={setNewTask} className="flex-1 px-3 py-2.5 text-xs" /><Button onClick={addCustomTask} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white">추가</Button></div>
      </div>
    </Card>
  );

  const StrategyPage = () => (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div><div className="text-2xl font-black tracking-tight md:text-3xl">{profile.name}님의 오늘 전략</div><div className="mt-2 text-sm text-slate-500">컨디션과 시험 정보를 반영해 지금 해야 할 공부를 계산했어요.</div></div>
        <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white"><Icon name="calendar" className="size-5" /></div>
          <div><div className="text-xs font-semibold text-indigo-500">{examName}</div><div className="text-lg font-black text-indigo-900">D-{examDays}</div></div>
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="p-6 xl:col-span-2">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div><div className="text-base font-bold">1. 오늘의 학습 조건</div><div className="mt-1 text-xs text-slate-400">KNN·회귀 모델에 들어가는 입력값을 조정하세요</div></div>
            <div className="flex items-center gap-2"><TextInput value={examDate} placeholder="" type="date" onChange={setExamDate} className="px-3 py-2 text-xs" /><span className="rounded-lg bg-slate-100 px-2.5 py-2 text-xs font-bold text-slate-600">D-{examDays}</span></div>
          </div>
          {validationErrors.studyHours && <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"><Icon name="info" className="size-4" /></div><div><div className="font-bold">입력값을 다시 확인해 주세요</div><div className="mt-1 text-xs leading-5 text-amber-700">{validationErrors.studyHours}</div></div></div>}
          <div className={`${validationErrors.studyHours ? "mt-3" : "mt-5"} grid gap-3 sm:grid-cols-2 lg:grid-cols-4`}>
            <Stepper label="오늘 가능한 시간" value={studyHours} inputValue={studyHoursInput} unit="시간" min={0.5} max={15} step={0.5} onInputChange={(value) => { setStudyHoursInput(value); setValidationErrors({}); }} onChange={(value) => { setStudyHours(value); setStudyHoursInput(String(value)); setValidationErrors({}); }} icon="clock" guide="입력 범위 0.5 ~ 15시간" error={validationErrors.studyHours ? "0.5시간 이상 입력해 주세요" : undefined} />
            <Stepper label="어젯밤 수면" value={sleepHours} unit="시간" min={3} max={12} step={0.5} onChange={setSleepHours} icon="calendar" guide="입력 범위 3 ~ 12시간" />
            <Stepper label="현재 집중도" value={focus} unit="/ 5점" min={1} max={5} step={1} onChange={setFocus} icon="sparkles" guide="입력 범위 1 ~ 5점" />
            <Stepper label="최근 평균 성적" value={previousScore} unit="점" min={0} max={100} step={1} onChange={setPreviousScore} icon="chart" guide="입력 범위 0 ~ 100점" />
          </div>
          <Button onClick={analyzeConditions} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition-colors ${hasPendingAnalysis ? "bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700" : "bg-slate-400 shadow-slate-100"}`}><Icon name="refresh" className="size-4" />{hasPendingAnalysis ? "변경한 조건으로 맞춤 전략 분석하기" : "내 맞춤 전략 다시 분석하기"}</Button>
          {hasPendingAnalysis && <div className="mt-2 text-center text-xs font-semibold text-amber-600">입력값이 변경됐어요. 버튼을 눌러야 분석 결과에 반영됩니다.</div>}
        </Card>
        <Card className={`border p-6 ${analysis.condition.box}`}>
          <div className="flex items-center justify-between"><div className="flex size-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm"><Icon name="sparkles" /></div><span className="text-xs font-semibold text-slate-400">분석 #{version}</span></div>
          <div className="mt-5 text-xs font-bold text-slate-500">오늘의 학습 유형</div>
          <div className={`mt-1 text-2xl font-black ${analysis.condition.tone}`}>{analysis.condition.name}</div>
          <div className="mt-3 text-sm leading-6 text-slate-600">{analysis.condition.description}</div>
          <Button onClick={() => goToMethod(analysis.condition.method)} className="mt-4 flex w-full items-center justify-between rounded-xl bg-white/80 p-3 text-left text-xs font-bold text-slate-700"><span>추천 · {analysis.condition.method}</span><Icon name="arrow" className="size-4" /></Button>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-white/80 p-4"><div><div className="text-xs text-slate-400">예상 평균</div><div className="mt-0.5 text-xl font-black">{analysis.predictedScore}점</div></div><div className="text-right"><div className="text-xs text-slate-400">변화 예측</div><div className="mt-0.5 text-sm font-bold text-emerald-600">+{analysis.predictedScore - analyzedConditions.previousScore}점</div></div></div>
        </Card>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><div className="text-base font-bold">2. 과목별 자동 시간 배분</div><div className="mt-1 text-xs text-slate-400">시험이 가깝고 예상 점수가 낮을수록 더 많이 배정해요</div></div><Button onClick={() => setActiveNav("과목 관리")} className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">{subjects.length}과목 관리</Button></div>
          <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
            {analysis.allocations.map((subject) => {
              const percent = Math.round(subject.minutes / (analyzedConditions.studyHours * 60) * 100);
              return <div key={subject.name} className="bg-white p-5"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className={`size-2.5 shrink-0 rounded-full ${subject.color}`} /><div><div className="text-sm font-bold">{subject.name}</div><div className="mt-0.5 text-xs text-slate-400">D-{subject.dDay} · 예상 {subject.predicted}점</div></div></div><div className="shrink-0 text-right"><span className="text-xl font-black">{subject.minutes}</span><span className="ml-1 text-xs text-slate-400">분</span></div></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${subject.color}`} style={{ width: `${percent}%` }} /></div><div className="mt-2 flex justify-between text-xs text-slate-400"><span>전체의 {percent}%</span><span>가중치 {subject.weight.toFixed(2)}</span></div></div>;
            })}
          </div>
          <div className="flex items-start gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 text-xs leading-5 text-slate-500"><Icon name="info" className="mt-0.5 size-4 shrink-0 text-indigo-500" />가중치 = 과목 중요도 × 1/(D-Day+1) × (100−예상 점수). 가중치 비율만큼 오늘 시간을 5분 단위로 배분합니다.</div>
          <div className="border-t border-slate-100 p-6">
            <div className="flex items-center justify-between">
              <div><div className="text-sm font-bold">오늘의 시험 대비 체크포인트</div><div className="mt-1 text-xs text-slate-400">배분 결과를 실제 공부로 연결하는 빠른 가이드</div></div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">D-{examDays} 맞춤</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600"><Icon name="target" className="size-4" />집중 우선</div>
                <div className="mt-2 text-sm font-black">{prioritySubject?.name ?? "과목을 선택해 주세요"}</div>
                <div className="mt-1 text-xs text-slate-400">{prioritySubject ? `${prioritySubject.minutes}분 먼저 시작하기` : "과목 관리에서 시험 과목 추가"}</div>
              </div>
              <Button onClick={() => goToMethod(analysis.condition.method)} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-left hover:border-indigo-200 hover:bg-indigo-50/50">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600"><Icon name="method" className="size-4" />추천 학습법</div>
                <div className="mt-2 text-sm font-black">{analysis.condition.method}</div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400"><span>실행법 확인하기</span><Icon name="arrow" className="size-3.5" /></div>
              </Button>
              <Button onClick={() => setActiveNav("학습 플래너")} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-left hover:border-indigo-200 hover:bg-indigo-50/50">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600"><Icon name="clock" className="size-4" />바로 실행</div>
                <div className="mt-2 text-sm font-black">25분 집중 세션</div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400"><span>타이머로 시작하기</span><Icon name="arrow" className="size-3.5" /></div>
              </Button>
            </div>
            <div className="mt-4 rounded-xl bg-slate-900 p-4 text-white">
              <div className="flex items-center justify-between text-xs"><span className="font-bold">시험 준비 단계</span><span className="text-slate-400">{examDays > 13 ? "개념 정리" : examDays > 6 ? "유형 훈련" : examDays > 1 ? "오답 압축" : "최종 점검"}</span></div>
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {["개념 정리", "유형 훈련", "오답 압축", "최종 점검"].map((phase, index) => {
                  const activePhase = examDays > 13 ? 0 : examDays > 6 ? 1 : examDays > 1 ? 2 : 3;
                  return <div key={phase} className={`h-1.5 rounded-full ${index <= activePhase ? "bg-indigo-400" : "bg-white/15"}`} />;
                })}
              </div>
            </div>
          </div>
        </Card>
        {PlanList({})}
      </div>
      <Card className="mt-5 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-base font-bold">과목별 N각형 점수 프로필</div><div className="mt-1 text-xs text-slate-400">선택한 과목 수에 맞춰 도형이 자동으로 바뀌어요.</div></div><div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-indigo-500" /><span className="text-xs font-semibold text-slate-500">AI 예상 점수 · {analysis.allocations.length}각형</span></div></div>
        <div className="grid items-center gap-4 p-6 lg:grid-cols-5">
          <div className="lg:col-span-2"><ScoreRadar items={analysis.allocations} /></div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 lg:col-span-3">
            <div className="min-w-xl"><div className="grid grid-cols-5 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-500"><span>과목</span><span className="text-center">직전 점수</span><span className="text-center">예상 점수</span><span className="text-center">변화</span><span className="text-right">권장 시간</span></div>
              <div className="divide-y divide-slate-100">{analysis.allocations.map((subject) => <div key={subject.name} className="grid grid-cols-5 items-center px-4 py-3 text-sm"><div className="flex items-center gap-2 font-bold"><span className={`size-2 shrink-0 rounded-full ${subject.color}`} /><span className="truncate">{subject.name}</span></div><span className="text-center text-slate-500">{subject.baseScore}점</span><span className="text-center font-black">{subject.predicted}점</span><span className="text-center text-xs font-bold text-emerald-600">+{subject.predicted - subject.baseScore}점</span><span className="text-right font-semibold text-indigo-700">{subject.minutes}분</span></div>)}</div>
            </div>
          </div>
        </div>
      </Card>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-6"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Icon name="chart" /></div><div><div className="font-bold">모델은 이렇게 판단해요</div><div className="text-xs text-slate-400">KNN·회귀 기반 추천 구조</div></div></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{[["01", "유사 학생 탐색", "입력 조건과 가까운 학습 패턴을 찾습니다."], ["02", "성적 변화 예측", "시간·수면·집중도로 점수를 계산합니다."], ["03", "시간 최적 배분", "시험 임박도와 부족도로 시간을 나눕니다."]].map(([number, title, detail]) => <div key={number} className="rounded-xl bg-slate-50 p-4"><div className="text-xs font-black text-indigo-500">{number}</div><div className="mt-2 text-sm font-bold">{title}</div><div className="mt-1 text-xs leading-5 text-slate-500">{detail}</div></div>)}</div></Card>
        <Card className="p-6"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Icon name="user" /></div><div><div className="font-bold">탐구 데이터 근거</div><div className="text-xs text-slate-400">실제 학생 설문 42명 · 가상 데이터 1,000개</div></div></div><div className="mt-5 grid grid-cols-3 gap-3">{[["81%", "하루 공부", "2–6시간"], ["64.3%", "수면 시간", "6시간 미만"], ["2.93", "평균 집중도", "5점 기준"]].map(([value, label, sub]) => <div key={label} className="rounded-xl border border-slate-100 p-4"><div className="text-xl font-black">{value}</div><div className="mt-1 text-xs text-slate-400">{label}<br />{sub}</div></div>)}</div></Card>
      </div>
    </>
  );

  const PlannerPage = () => (
    <>
      <div className="mb-6"><div className="text-2xl font-black tracking-tight md:text-3xl">오늘의 집중 플래너</div><div className="mt-2 text-sm text-slate-500">계획을 실행하고, 완료한 학습 시간을 바로 확인하세요.</div></div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="relative overflow-hidden bg-slate-900 p-6 text-white lg:col-span-1">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-indigo-500/20" />
          <div className="relative"><div className="flex items-center justify-between"><div><div className="text-xs font-bold text-indigo-300">FOCUS TIMER</div><div className="mt-1 text-lg font-bold">25분 집중 세션</div></div><Icon name="flame" className="size-7 text-amber-400" /></div>
            <div className="my-8 text-center">
              <div className="text-5xl font-black tabular-nums">{String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:{String(timerSeconds % 60).padStart(2, "0")}</div>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400"><span className={`size-2 rounded-full ${timerRunning ? "animate-pulse bg-emerald-400" : "bg-slate-600"}`} />{timerRunning ? "집중 시간이 흐르고 있어요" : "시작 버튼을 누르면 타이머가 작동해요"}</div>
            </div>
            <div className="flex gap-2"><Button disabled={timerSeconds === 0} onClick={() => setTimerRunning((running) => !running)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 text-sm font-bold hover:bg-indigo-400"><Icon name={timerRunning ? "pause" : "play"} className="size-4" />{timerRunning ? "잠시 멈춤" : "집중 시작"}</Button><Button onClick={() => { setTimerRunning(false); setTimerSeconds(25 * 60); setTimerElapsed(0); }} className="flex size-11 items-center justify-center rounded-xl bg-white/10"><Icon name="refresh" className="size-4" /></Button></div>
            {timerElapsed > 0 && <Button onClick={saveTimerRecord} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 py-2.5 text-xs font-bold text-white hover:bg-white/15"><Icon name="check" className="size-4" />현재 집중 기록 저장 · {Math.floor(timerElapsed / 60)}분 {timerElapsed % 60}초</Button>}
          </div>
        </Card>
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between"><div><div className="font-bold">오늘의 진행률</div><div className="mt-1 text-xs text-slate-400">작게 완료할수록 시험 불안이 줄어들어요</div></div><div className="text-right"><div className="text-2xl font-black text-indigo-600">{planItems.length ? Math.round(completedCount / planItems.length * 100) : 0}%</div><div className="text-xs text-slate-400">{completedMinutes}분 완료</div></div></div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${planItems.length ? completedCount / planItems.length * 100 : 0}%` }} /></div>
          <div className="mt-6 grid grid-cols-3 gap-3">{[["남은 과제", `${planItems.length - completedCount}개`], ["계획 시간", `${planMinutes}분`], ["시험까지", `D-${examDays}`]].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-4 text-center"><div className="text-xs text-slate-400">{label}</div><div className="mt-1 text-lg font-black">{value}</div></div>)}</div>
          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between"><div className="text-sm font-bold">최근 집중 기록</div><div className="text-xs text-slate-400">총 {timerRecords.length}회</div></div>
            {timerRecords.length > 0 ? <div className="mt-3 space-y-2">{timerRecords.slice(0, 3).map((record) => <div key={record.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs"><span className="font-semibold text-slate-600">{record.subject}</span><span className="font-black text-indigo-600">{Math.floor(record.seconds / 60)}분 {record.seconds % 60}초</span></div>)}</div> : <div className="mt-3 rounded-lg bg-slate-50 px-3 py-3 text-center text-xs text-slate-400">타이머를 실행한 뒤 기록을 저장해 보세요.</div>}
          </div>
        </Card>
      </div>
      <div className="mt-5">{PlanList({ full: true })}</div>
    </>
  );

  const MethodsPage = () => {
    const filters = ["전체", ...Array.from(new Set(learningMethods.map((method) => method.tag)))];
    const methods = methodFilter === "전체" ? learningMethods : learningMethods.filter((method) => method.tag === methodFilter);
    return (
      <>
        <div className="mb-6"><div className="text-2xl font-black tracking-tight md:text-3xl">나에게 맞는 공부법 찾기</div><div className="mt-2 text-sm text-slate-500">진로 수업에서 배운 10가지 학습법을 오늘 과목에 바로 적용해 보세요.</div></div>
        <Card className="overflow-hidden border-indigo-100 bg-indigo-600 p-6 text-white">
          <div className="grid items-center gap-5 md:grid-cols-3"><div className="md:col-span-2"><div className="text-xs font-bold text-indigo-200">TODAY'S PICK</div><div className="mt-2 text-2xl font-black">{analysis.condition.name}에게는 {analysis.condition.method}</div><div className="mt-2 text-sm leading-6 text-indigo-100">현재 수면과 집중도에 가장 잘 맞는 방법이에요. 아래 카드의 3단계를 오늘 실행 계획에 적용해 보세요.</div></div><Button onClick={() => goToMethod(analysis.condition.method)} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-bold text-indigo-700"><span>추천 학습법 보기</span><Icon name="arrow" className="size-4" /></Button></div>
        </Card>
        <div className="mt-5 flex flex-wrap gap-2">{filters.map((filter) => <Button key={filter} onClick={() => setMethodFilter(filter)} className={`rounded-full px-4 py-2 text-xs font-bold ${methodFilter === filter ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-500 hover:border-indigo-300"}`}>{filter}</Button>)}</div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {methods.map((method, index) => <Card key={method.title} className="scroll-mt-28 p-6" >
            <div id={method.title} className="scroll-mt-28">
              <div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-sm font-black text-indigo-600">{String(index + 1).padStart(2, "0")}</div><div><div className="text-base font-black">{method.title}</div><div className="text-xs font-semibold text-indigo-500">{method.tag}</div></div></div>{analysis.condition.method === method.title && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">오늘 추천</span>}</div>
              <div className="mt-4 text-sm leading-6 text-slate-600">{method.summary}</div>
              <div className="mt-4 grid grid-cols-3 gap-2">{method.steps.map((step, stepIndex) => <div key={step} className="rounded-lg bg-slate-50 p-3 text-center"><div className="text-[10px] font-black text-indigo-400">STEP {stepIndex + 1}</div><div className="mt-1 text-xs font-bold">{step}</div></div>)}</div>
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-xs leading-5 text-slate-600"><span className="font-bold text-slate-900">적용 사례</span> · {method.example}</div>
            </div>
          </Card>)}
        </div>
      </>
    );
  };

  const SubjectsPage = () => (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="text-2xl font-black tracking-tight md:text-3xl">2028 개정 교육과정 과목 관리</div><div className="mt-2 text-sm text-slate-500">시험 과목을 1~8개 선택하고 중요도와 직전 점수를 입력하세요.</div></div><div className={`rounded-xl px-4 py-3 text-sm font-bold ${subjects.length === 0 ? "bg-rose-50 text-rose-700" : "bg-indigo-50 text-indigo-700"}`}>{subjects.length}/8 과목 선택</div></div>
      {(subjects.length === 0 || examDays === 0) && <div role="alert" className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Icon name="info" className="size-5" /></div><div><div className="font-black text-amber-900">맞춤 전략을 만들기 전에 확인해 주세요</div><div className="mt-1 text-sm leading-6 text-amber-700">{subjects.length === 0 ? "시험 과목을 1개 이상 선택해야 맞춤형 전략을 짤 수 있어요!" : "D-Day는 최소 1일 이상이어야 해요. 프로필에서 시험 날짜를 내일 이후로 설정해 주세요!"}</div>{examDays === 0 && <Button onClick={() => setActiveNav("내 프로필")} className="mt-2 text-xs font-bold text-amber-900 underline underline-offset-2">시험 날짜 수정하기</Button>}</div></div>
      </div>}
      <Card className="p-6">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {curriculum.map((name) => {
            const selected = subjects.some((subject) => subject.name === name);
            return <Button key={name} disabled={!selected && subjects.length >= 8} onClick={() => toggleSubject(name)} className={`flex items-center justify-between rounded-xl border p-3 text-left text-sm font-semibold ${selected ? "border-indigo-300 bg-indigo-50 text-indigo-800" : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"}`}><span>{name}</span><span className={`flex size-5 shrink-0 items-center justify-center rounded-md ${selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}><Icon name={selected ? "check" : "plus"} className="size-3" /></span></Button>;
          })}
        </div>
        <div className="mt-5 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-indigo-800"><Icon name="plus" className="size-4" />새로운 과목 직접 입력하기</div>
          <div className="mt-3 flex gap-2">
            <TextInput value={newSubject} placeholder="목록에 없는 과목명을 입력하세요" onChange={setNewSubject} className="flex-1 px-3 py-2.5" />
            <Button disabled={!newSubject.trim() || subjects.length >= 8 || subjects.some((subject) => subject.name === newSubject.trim())} onClick={addNewSubject} className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700">과목 추가</Button>
          </div>
          {subjects.some((subject) => subject.name === newSubject.trim()) && newSubject.trim() && <div className="mt-2 text-xs font-semibold text-amber-600">이미 추가된 과목이에요.</div>}
        </div>
        <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-400"><Icon name="info" className="mt-0.5 size-4 shrink-0" />맞춤 전략을 생성하려면 최소 1과목이 필요하며, 레이더 차트 가독성을 위해 최대 8과목까지 선택할 수 있어요.</div>
      </Card>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {subjects.map((subject) => <Card key={subject.name} className="p-5">
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className={`size-3 rounded-full ${subject.color}`} /><div className="font-bold">{subject.name}</div></div><Button onClick={() => toggleSubject(subject.name)} className="text-slate-300 hover:text-rose-500"><Icon name="trash" className="size-4" /></Button></div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-500">직전 점수<input type="number" min="0" max="100" value={subject.baseScore} onChange={(event) => updateSubject(subject.name, { baseScore: Math.min(100, Math.max(0, Number(event.target.value))) })} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-bold outline-none focus:border-indigo-400" /></label>
            <label className="text-xs font-semibold text-slate-500">과목 중요도<select value={subject.importance} onChange={(event) => updateSubject(subject.name, { importance: Number(event.target.value) })} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:border-indigo-400"><option value="0.8">낮음 · 0.8</option><option value="1">보통 · 1.0</option><option value="1.2">높음 · 1.2</option><option value="1.4">매우 높음 · 1.4</option></select></label>
          </div>
        </Card>)}
      </div>
    </>
  );

  const ProfilePage = () => (
    <>
      <div className="mb-6"><div className="text-2xl font-black tracking-tight md:text-3xl">내 학습 프로필</div><div className="mt-2 text-sm text-slate-500">내 정보와 시험 일정을 설정하면 모든 추천에 바로 반영돼요.</div></div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-4"><div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-black text-indigo-700">{profile.name.slice(0, 1)}</div><div><div className="text-lg font-black">기본 정보</div><div className="text-xs text-slate-400">상단 프로필과 맞춤 문구에 사용돼요</div></div></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[["이름", "name", "이름을 입력하세요"], ["학교", "school", "학교를 입력하세요"], ["학년", "grade", "예: 2학년"], ["이번 시험 목표", "goal", "예: 평균 85점"]].map(([label, key, placeholder]) => <label key={key} className="text-xs font-semibold text-slate-500">{label}<TextInput value={profile[key as keyof Profile]} placeholder={placeholder} onChange={(value) => setProfile((current) => ({ ...current, [key]: value }))} className="mt-2 w-full px-3 py-3" /></label>)}
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Icon name="target" /></div><div className="mt-4 text-xs font-bold text-slate-400">MY GOAL</div><div className="mt-1 text-xl font-black">{profile.goal || "목표를 입력해 주세요"}</div><div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{profile.school} · {profile.grade}<br />현재 예상 평균 <span className="font-black text-indigo-600">{analysis.predictedScore}점</span></div>
        </Card>
      </div>
      <Card className="mt-5 p-6">
        <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Icon name="calendar" /></div><div><div className="font-bold">시험 일정</div><div className="text-xs text-slate-400">남은 기간이 시간 배분 공식에 사용돼요</div></div></div>
        <div className="mt-6 grid items-end gap-4 sm:grid-cols-3">
          <label className="text-xs font-semibold text-slate-500">시험 이름<TextInput value={examName} placeholder="시험 이름" onChange={setExamName} className="mt-2 w-full px-3 py-3" /></label>
          <label className="text-xs font-semibold text-slate-500">시험 시작일<TextInput value={examDate} placeholder="" type="date" onChange={setExamDate} className="mt-2 w-full px-3 py-3" /></label>
          <div className="flex h-11 items-center justify-between rounded-xl bg-indigo-600 px-4 text-white"><span className="text-xs font-semibold text-indigo-200">남은 기간</span><span className="text-xl font-black">D-{examDays}</span></div>
        </div>
      </Card>
      <div className="mt-5 flex justify-end"><Button onClick={() => setActiveNav("맞춤 전략")} className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white">설정 완료하고 전략 보기</Button></div>
    </>
  );

  const pageTitle: Record<string, string> = { "맞춤 전략": "시험 맞춤 전략 생성기", "학습 플래너": "오늘의 실행 센터", "추천 학습법": "학습 전략 라이브러리", "과목 관리": "시험 과목 설정", "내 프로필": "개인 설정" };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:flex-col">
        <Button onClick={() => setActiveNav("맞춤 전략")} className="w-full rounded-xl px-2 py-1 text-left hover:bg-slate-50">
          <img src={schoolLogo} alt="김포제일고등학교 로고" className="w-full object-contain" />
          <div className="mt-1 flex items-center justify-between px-1"><span className="text-sm font-black tracking-tight text-slate-800">하우스</span><span className="text-[10px] font-bold tracking-wider text-indigo-500">STUDY HOUSE</span></div>
        </Button>
        <nav className="mt-10 space-y-2" aria-label="주요 메뉴">{navItems.map((item) => <Button key={item.label} onClick={() => setActiveNav(item.label)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${activeNav === item.label ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}><Icon name={item.icon} />{item.label}{activeNav === item.label && <span className="ml-auto size-1.5 rounded-full bg-indigo-600" />}</Button>)}</nav>
        <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white"><div className="flex items-center justify-between"><div className="flex size-9 items-center justify-center rounded-lg bg-indigo-500"><Icon name="chart" className="size-4" /></div><span className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-300">KNN 기반</span></div><div className="mt-4 text-sm font-semibold">학습 데이터 분석 모델</div><div className="mt-1 text-xs leading-5 text-slate-400">1,000개 가상 데이터와 학생 42명의 설문 결과를 바탕으로 설계했어요.</div></div>
        <Button onClick={() => setActiveNav("내 프로필")} className={`mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${activeNav === "내 프로필" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"}`}><Icon name="settings" />내 프로필</Button>
      </aside>
      <main className="lg:ml-64">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-8 lg:px-10">
          <div><div className="text-xs font-semibold text-indigo-600">{pageTitle[activeNav]}</div><div className="mt-0.5 text-lg font-bold tracking-tight md:text-xl">{examName}까지 D-{examDays}</div></div>
          <div className="flex items-center gap-3">
            <Button className="relative flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"><Icon name="bell" /><span className="absolute right-2.5 top-2 size-2 rounded-full border-2 border-white bg-rose-500" /></Button>
            <Button onClick={() => setActiveNav("내 프로필")} className="flex items-center gap-3 text-left"><div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">{profile.name.slice(0, 2)}</div><div className="hidden sm:block"><div className="text-sm font-semibold">{profile.name}</div><div className="text-xs text-slate-400">{profile.grade} · 프로필 설정</div></div></Button>
          </div>
        </header>
        <div className="border-b border-slate-200 bg-white px-4 py-2 lg:hidden"><div className="flex gap-1 overflow-x-auto">{[...navItems, { label: "내 프로필", icon: "user" as IconName }].map((item) => <Button key={item.label} onClick={() => setActiveNav(item.label)} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${activeNav === item.label ? "bg-indigo-50 text-indigo-700" : "text-slate-400"}`}><Icon name={item.icon} className="size-3.5" />{item.label}</Button>)}</div></div>
        <div className="mx-auto max-w-screen-2xl p-5 md:p-8 lg:p-10">
          {activeNav === "맞춤 전략" && StrategyPage()}
          {activeNav === "학습 플래너" && PlannerPage()}
          {activeNav === "추천 학습법" && MethodsPage()}
          {activeNav === "과목 관리" && SubjectsPage()}
          {activeNav === "내 프로필" && ProfilePage()}
        </div>
      </main>
      {timerRunning && <Button onClick={() => setActiveNav("학습 플래너")} className="fixed bottom-5 right-5 z-30 flex items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-left text-white shadow-2xl shadow-slate-400/40">
        <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500"><Icon name="clock" className="size-4" /></span>
        <span><span className="block text-[10px] font-bold text-emerald-400">집중 기록 중</span><span className="block text-lg font-black tabular-nums">{String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:{String(timerSeconds % 60).padStart(2, "0")}</span></span>
        <Icon name="arrow" className="size-4 text-slate-400" />
      </Button>}
      {notice && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="notice-title">
        <Card className="w-full max-w-md p-6 shadow-2xl">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"><Icon name="info" /></div>
          <div id="notice-title" className="mt-4 text-xl font-black">{notice.title}</div>
          <div className="mt-2 text-sm leading-6 text-slate-600">{notice.message}</div>
          <Button onClick={() => setNotice(null)} className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white">확인했어요</Button>
        </Card>
      </div>}
    </div>
  );
}
