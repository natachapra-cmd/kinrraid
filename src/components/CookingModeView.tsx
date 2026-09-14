import React, { useState, useEffect, useRef } from 'react';
import { Recipe } from '../types';

interface CookingModeViewProps {
  recipe: Recipe;
  recipes?: Recipe[];
  onSelectRecipe?: (recipe: Recipe) => void;
  onFinishCooking: () => void;
  onExit: () => void;
}

export const CookingModeView: React.FC<CookingModeViewProps> = ({
  recipe,
  recipes,
  onSelectRecipe,
  onFinishCooking,
  onExit,
}) => {
  // Start at step index 0 (Step 1)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [showRecipePicker, setShowRecipePicker] = useState<boolean>(false);
  const totalSteps = recipe.steps.length;
  const currentStep = recipe.steps[currentStepIndex] || recipe.steps[0];

  // Reset step index when active recipe changes
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [recipe.id]);

  // Timer State
  const [totalSeconds, setTotalSeconds] = useState<number>(currentStep.durationSeconds || 150);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync timer when step changes
  useEffect(() => {
    setTotalSeconds(currentStep.durationSeconds || 120);
    setIsRunning(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [currentStepIndex, currentStep.durationSeconds]);

  // Countdown effect
  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, totalSeconds]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Timer controls
  const toggleTimer = () => {
    if (totalSeconds === 0) {
      setTotalSeconds(currentStep.durationSeconds || 120);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTotalSeconds(currentStep.durationSeconds || 120);
  };

  const skipTimer = () => {
    setIsRunning(false);
    setTotalSeconds(0);
  };

  // Voice TTS Prompt
  const toggleVoicePrompt = () => {
    if (!('speechSynthesis' in window)) {
      alert('เบราว์เซอร์นี้ไม่รองรับระบบเสียงพูด แต่คุณสามารถทำตามคำแนะนำบนหน้าจอได้เลยครับ');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentStep.speechText || currentStep.instruction);
      utterance.lang = 'th-TH';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowCelebration(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <div className="flex flex-col w-full pb-36 space-y-4">
      {/* Active Recipe Header Banner & Switcher */}
      <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-[#f2ded8]/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-12 h-12 rounded-2xl object-cover shrink-0 bg-[#feeae3] shadow-xs"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#ae3115] bg-[#ffdad2] px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ae3115] animate-pulse" />
                โหมดทำอาหารสด
              </span>
              <span className="text-[11px] text-[#59413c] font-bold">⏱️ {recipe.time}</span>
            </div>
            <h2 className="text-[15px] font-bold text-[#241915] truncate">
              {recipe.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {recipes && recipes.length > 1 && onSelectRecipe && (
            <button
              onClick={() => setShowRecipePicker(true)}
              className="px-3 py-1.5 rounded-full bg-[#feeae3] text-[#ae3115] text-[12px] font-bold hover:bg-[#ffdad2] transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              type="button"
              title="เปลี่ยนเมนูที่จะทำ"
            >
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
              <span className="hidden sm:inline">เปลี่ยน</span>เมนู
            </button>
          )}
          <button
            onClick={onExit}
            className="p-1.5 rounded-full bg-[#fff1ec] text-[#59413c] hover:text-[#ae3115] hover:bg-[#f2ded8] transition-all cursor-pointer"
            type="button"
            title="ออกจากโหมดทำอาหาร"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {/* Top Progress & Chef Encouragement Header */}
      <div className="bg-[#fff1ec] rounded-3xl p-4 shadow-sm border border-[#f2ded8]/60">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ae3115] text-white font-extrabold text-[12px]">
              {currentStep.stepNumber}
            </span>
            <span className="font-bold text-[17px] text-[#241915]">
              ขั้นตอนที่ {currentStep.stepNumber} จาก {totalSteps}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ffdea8] px-3 py-1 text-[#271900] text-[11px] font-bold">
            <span className="material-symbols-outlined text-[16px]">skillet</span>
            กำลังผัดร้อนๆ
          </span>
        </div>

        {/* Interactive Progress Track */}
        <div className="w-full bg-[#f2ded8] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#ff6b4a] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2 text-[12px] text-[#59413c]">
          <span>ความคืบหน้ารวม</span>
          <span className="font-extrabold text-[#ae3115]">
            {progressPercent}% เสร็จสิ้น
          </span>
        </div>
      </div>

      {/* Main Active Cooking Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm flex flex-col space-y-4 border border-[#f2ded8]/60">
        {/* Action Step Image */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-[#feeae3]">
          <img
            alt={currentStep.title}
            className="w-full h-full object-cover"
            src={currentStep.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241915]/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 bg-[#fff8f6]/90 backdrop-blur-md px-3 py-1 rounded-full text-[#241915] text-[11px] font-bold shadow-xs">
              <span className="material-symbols-outlined text-[16px] text-[#ae3115]">
                local_fire_department
              </span>
              {currentStep.heatLevel || 'ใช้ไฟกลางค่อนแรง'}
            </span>

            <button
              onClick={toggleVoicePrompt}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-xs active:scale-95 transition-transform cursor-pointer ${
                isSpeaking ? 'bg-[#00b251] text-white' : 'bg-[#ae3115] text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isSpeaking ? 'graphic_eq' : 'volume_up'}
              </span>
              <span>{isSpeaking ? 'กำลังอ่าน...' : 'อ่านออกเสียง'}</span>
            </button>
          </div>
        </div>

        {/* Active Step Instruction */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad2] text-[#3d0600] text-[11px] font-bold">
              สเต็ปปัจจุบัน
            </span>
            <span className="text-[#59413c] text-[12px]">{recipe.title}</span>
          </div>
          <h3 className="text-[20px] font-extrabold text-[#241915] leading-snug">
            {currentStep.title}: {currentStep.instruction.split('.')[0] || currentStep.instruction}
          </h3>
          <p className="text-[13px] text-[#59413c] leading-relaxed">
            {currentStep.instruction}
          </p>
          {currentStep.proTip && (
            <p className="text-[12px] text-[#ae3115] bg-[#fff1ec] p-2.5 rounded-xl font-medium border border-[#f2ded8]">
              {currentStep.proTip}
            </p>
          )}
        </div>

        {/* Jumbo Digital Cooking Timer */}
        <div className="bg-[#feeae3] rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 text-center border border-[#f2ded8]">
          <div className="flex items-center gap-1.5 text-[#59413c] text-[13px] font-bold">
            <span className="material-symbols-outlined text-[18px] text-[#ae3115]">timer</span>
            <span>เวลานับถอยหลังช่วงผัด</span>
          </div>

          {/* Big Numbers */}
          <div className="text-[44px] text-[#ae3115] font-extrabold tracking-tight font-mono">
            {formatTime(totalSeconds)}
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-2 w-full max-w-xs justify-center">
            <button
              onClick={resetTimer}
              className="flex-1 py-2 px-3 rounded-full bg-[#f8e4dd] text-[#241915] text-[13px] font-bold hover:bg-[#ead6cf] transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">replay</span>
              รีเซ็ต
            </button>

            <button
              onClick={toggleTimer}
              className={`flex-1 py-2 px-3 rounded-full text-white text-[13px] font-bold shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-1 cursor-pointer ${
                isRunning ? 'bg-[#ae3115]' : 'bg-[#00b251]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isRunning ? 'pause' : 'play_arrow'}
              </span>
              <span>{isRunning ? 'หยุดชั่วคราว' : 'เริ่มต่อ'}</span>
            </button>

            <button
              onClick={skipTimer}
              className="flex-1 py-2 px-3 rounded-full bg-[#f8e4dd] text-[#241915] text-[13px] font-bold hover:bg-[#ead6cf] transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">skip_next</span>
              ข้าม
            </button>
          </div>
        </div>
      </div>

      {/* Live Macro Nutrition & Health Dashboard */}
      <div className="bg-white rounded-3xl p-5 shadow-sm flex flex-col space-y-4 border border-[#f2ded8]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ae3115] text-[24px]">nutrition</span>
            <h2 className="font-bold text-[17px] text-[#241915]">สารอาหารต่อ 1 จานนี้</h2>
          </div>
          <div className="flex items-center gap-1 bg-[#6bff8f]/30 text-[#003b16] px-3 py-1 rounded-full text-[11px] font-bold">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>{recipe.nutrition.grade}</span>
          </div>
        </div>

        {/* Donut Visual + Macro Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-[#fff1ec] rounded-2xl p-4 border border-[#f2ded8]">
          {/* Donut Chart SVG */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <path
                  className="text-[#f2ded8]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.8"
                />
                {/* Protein slice (32%) - Primary coral */}
                <path
                  className="text-[#ae3115]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="32, 100"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
                {/* Carbs slice (48%) - Secondary Gold */}
                <path
                  className="text-[#feb700]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="48, 100"
                  strokeDashoffset="-32"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
                {/* Fat slice (20%) - Tertiary green */}
                <path
                  className="text-[#006e2f]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="20, 100"
                  strokeDashoffset="-80"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-[26px] text-[#241915] font-extrabold leading-tight">
                  {recipe.calories}
                </span>
                <span className="text-[11px] text-[#59413c] font-medium">กิโลแคลอรี่</span>
              </div>
            </div>
          </div>

          {/* Macro Details Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Protein */}
            <div className="bg-white p-2.5 rounded-xl shadow-xs flex flex-col border border-[#f2ded8]/60">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ae3115] inline-block" />
                <span className="text-[11px] font-bold text-[#59413c]">โปรตีน</span>
              </div>
              <span className="text-[16px] font-extrabold text-[#241915]">{recipe.nutrition.protein} ก.</span>
              <span className="text-[11px] text-[#006e2f] font-bold">เป้าหมาย 64%</span>
            </div>

            {/* Carbs */}
            <div className="bg-white p-2.5 rounded-xl shadow-xs flex flex-col border border-[#f2ded8]/60">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#feb700] inline-block" />
                <span className="text-[11px] font-bold text-[#59413c]">คาร์โบไฮเดรต</span>
              </div>
              <span className="text-[16px] font-extrabold text-[#241915]">{recipe.nutrition.carbs} ก.</span>
              <span className="text-[11px] text-[#59413c]">พลังงานหลัก</span>
            </div>

            {/* Fat */}
            <div className="bg-white p-2.5 rounded-xl shadow-xs flex flex-col border border-[#f2ded8]/60">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006e2f] inline-block" />
                <span className="text-[11px] font-bold text-[#59413c]">ไขมันดี</span>
              </div>
              <span className="text-[16px] font-extrabold text-[#241915]">{recipe.nutrition.fat} ก.</span>
              <span className="text-[11px] text-[#59413c]">ใช้น้ำมันรำข้าว</span>
            </div>

            {/* Sodium */}
            <div className="bg-white p-2.5 rounded-xl shadow-xs flex flex-col border border-[#f2ded8]/60">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-[14px] text-[#006e2f]">check_circle</span>
                <span className="text-[11px] font-bold text-[#59413c]">โซเดียม</span>
              </div>
              <span className="text-[16px] font-extrabold text-[#241915]">{recipe.nutrition.sodium} มก.</span>
              <span className="text-[11px] text-[#006e2f] font-bold">ระดับปลอดภัย</span>
            </div>
          </div>
        </div>

        {/* Burn It Off Playful Activity Helper */}
        <div className="bg-[#f8e4dd] rounded-2xl p-4 flex flex-col space-y-2 border border-[#f2ded8]">
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#241915]">
            <span className="material-symbols-outlined text-[#ae3115] text-[18px]">
              directions_run
            </span>
            <span>เบิร์นออกง่ายๆ สนุกๆ ({recipe.calories} kcal)</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 bg-white rounded-full py-2 px-3 shadow-xs">
              <span className="text-xl">🏃</span>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#241915]">วิ่งจ๊อกกิ้ง</span>
                <span className="text-[11px] text-[#59413c]">{recipe.nutrition.burnRunningMinutes} นาที</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white rounded-full py-2 px-3 shadow-xs">
              <span className="text-xl">🚴</span>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#241915]">ปั่นจักรยาน</span>
                <span className="text-[11px] text-[#59413c]">{recipe.nutrition.burnCyclingMinutes} นาที</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps Quick Preview Checklist */}
      <div className="bg-white rounded-3xl p-5 shadow-sm flex flex-col space-y-3 border border-[#f2ded8]/60">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[17px] text-[#241915]">ขั้นตอนถัดไปในเมนูนี้</h3>
          <span className="text-[11px] font-bold text-[#59413c]">
            {Math.max(0, totalSteps - currentStepIndex - 1)} ขั้นตอนที่เหลือ
          </span>
        </div>

        <div className="space-y-2">
          {recipe.steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            if (isDone) {
              return (
                <div
                  key={step.stepNumber}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-[#fff1ec] opacity-60"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#006e2f] text-white">
                    <span className="material-symbols-outlined text-[16px]">done</span>
                  </div>
                  <span className="text-[13px] text-[#241915] line-through truncate">
                    สเต็ป {step.stepNumber}: {step.title}
                  </span>
                </div>
              );
            }

            if (isCurrent) {
              return (
                <div
                  key={step.stepNumber}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-[#ffdad2] border border-[#ff6b4a]/30"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ae3115] text-white text-[11px] font-bold">
                    {step.stepNumber}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[13px] font-bold text-[#241915] truncate">
                      สเต็ป {step.stepNumber}: {step.title}
                    </span>
                    <span className="text-[11px] text-[#ae3115] truncate">
                      กำลังทำขั้นตอนนี้อยู่...
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={step.stepNumber}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#fff8f6] border border-[#f2ded8]/60"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#feeae3] text-[#59413c] text-[11px] font-bold">
                  {step.stepNumber}
                </div>
                <span className="text-[13px] text-[#59413c] truncate">
                  สเต็ป {step.stepNumber}: {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chef Mascot Companion Bubble */}
      <div className="bg-[#feeae3] rounded-3xl p-4 flex items-center gap-3 shadow-xs border border-[#f2ded8]">
        <div className="relative shrink-0 w-12 h-12 rounded-full bg-[#ff6b4a] flex items-center justify-center text-white shadow-xs">
          <span className="material-symbols-outlined text-[28px]">outdoor_grill</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-[13px] font-bold text-[#ae3115]">
            <span>เชฟกุ๊กกู๋ แนะนำ</span>
            <span>✨</span>
          </div>
          <p className="text-[12px] text-[#241915] leading-snug mt-0.5">
            กลิ่นหอมเริ่มฟุ้งแล้วใช่ไหมครับ! สเต็ปนี้ระวังน้ำมันกระเด็นเบาๆ แล้วเตรียมตัวใส่ใบกะเพราสดได้เลย!
          </p>
        </div>
      </div>

      {/* Floating Sticky Bottom Control Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#fff8f6]/95 backdrop-blur-md z-40 border-t border-[#f2ded8]/60 shadow-[0_-8px_24px_rgba(45,34,30,0.06)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          {/* Previous Step Button */}
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className={`flex-1 min-h-[50px] rounded-full text-[14px] font-bold flex items-center justify-center gap-1 shadow-xs transition-transform cursor-pointer ${
              currentStepIndex === 0
                ? 'bg-[#f8e4dd] text-[#8d716a]/50 cursor-not-allowed'
                : 'bg-[#f8e4dd] text-[#241915] active:scale-95 hover:bg-[#ead6cf]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span>ขั้นตอนก่อนหน้า</span>
          </button>

          {/* Next Step Button */}
          <button
            onClick={handleNextStep}
            className="flex-[1.4] min-h-[50px] rounded-full bg-[#ae3115] text-white text-[14px] font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform hover:bg-[#962910] cursor-pointer"
          >
            {currentStepIndex < totalSteps - 1 ? (
              <>
                <span>ทำเสร็จแล้ว ไปสเต็ป {currentStepIndex + 2}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            ) : (
              <>
                <span>🎉 ทำเสร็จแล้ว พร้อมทาน!</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recipe Switch Picker Modal */}
      {showRecipePicker && recipes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-[#f2ded8] flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f2ded8]">
              <div>
                <h3 className="font-bold text-[17px] text-[#241915]">เลือกเมนูที่ต้องการทำ</h3>
                <p className="text-[12px] text-[#59413c]">สลับไปโหมดทำอาหารของเมนูอื่น</p>
              </div>
              <button
                onClick={() => setShowRecipePicker(false)}
                className="p-1 rounded-full text-[#8d716a] hover:text-[#241915] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="overflow-y-auto py-3 space-y-2 flex-1">
              {recipes.map((r) => {
                const isCurrent = r.id === recipe.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      if (onSelectRecipe) onSelectRecipe(r);
                      setShowRecipePicker(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full p-2.5 rounded-2xl flex items-center gap-3 text-left transition-all border ${
                      isCurrent
                        ? 'bg-[#fff1ec] border-[#ff6b4a] text-[#ae3115]'
                        : 'bg-white border-[#f2ded8]/60 hover:bg-[#fff8f6] text-[#241915]'
                    }`}
                  >
                    <img
                      src={r.image}
                      alt={r.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 bg-[#feeae3]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[11px] font-bold bg-[#ffdad2] text-[#ae3115] px-1.5 py-0.5 rounded-md">
                          {r.time}
                        </span>
                        <span className="text-[11px] text-[#59413c]">
                          {r.steps.length} ขั้นตอน
                        </span>
                      </div>
                      <h4 className="font-bold text-[14px] truncate">{r.title}</h4>
                    </div>
                    {isCurrent && (
                      <span className="material-symbols-outlined text-[20px] text-[#ff6b4a] shrink-0">
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-[#f2ded8]">
            <div className="text-5xl mb-3">🍳✨🎉</div>
            <h3 className="text-[22px] font-extrabold text-[#241915] mb-2">
              ยินดีด้วยครับ! ทำเสร็จแล้ว
            </h3>
            <p className="text-[14px] text-[#59413c] mb-6">
              เมนู <strong>{recipe.title}</strong> ของคุณพร้อมเสิร์ฟความอร่อย ทานให้อร่อยนะครับ!
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowCelebration(false);
                  onFinishCooking();
                }}
                className="w-full py-3.5 rounded-full bg-[#ae3115] text-white font-bold text-[15px] shadow-sm hover:bg-[#962910] cursor-pointer"
              >
                บันทึกประวัติการทำอาหาร 🏆
              </button>
              <button
                onClick={() => {
                  setShowCelebration(false);
                  onExit();
                }}
                className="w-full py-3 rounded-full bg-[#feeae3] text-[#59413c] font-bold text-[14px] hover:bg-[#f2ded8] cursor-pointer"
              >
                กลับไปหน้าหลัก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
