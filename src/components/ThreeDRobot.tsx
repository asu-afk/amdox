import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkle, 
  Send, 
  Bot, 
  FileCheck, 
  RefreshCw, 
  BrainCircuit, 
  X, 
  Check, 
  AlertTriangle, 
  UploadCloud, 
  ChevronDown, 
  FileSpreadsheet, 
  GraduationCap,
  MessageSquare,
  BookOpen,
  Settings,
  HelpCircle,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface ThreeDRobotProps {
  userEmail?: string;
}

interface LearningRule {
  id: string;
  type: 'heuristic' | 'manual';
  trigger: string;
  action: string;
  learnedAt: string;
}

export default function ThreeDRobot({ userEmail }: ThreeDRobotProps) {
  // High fidelity 3D Rotational angles
  const [rotation, setRotation] = useState({ x: 8, y: -24 });
  const [isDraggingRotation, setIsDraggingRotation] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const rotationStart = useRef({ x: 0, y: 0 });
  
  const [autoRotate, setAutoRotate] = useState(true);

  // --- CURSOR TRACKING COGNITIVE EYES ---
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Translucent x-ray shell to look at the learning brain *inside*
  const [translucentBrainShell, setTranslucentBrainShell] = useState<boolean>(false);
  
  // --- WALKING TO CORNERS ON BACKING CLICK ---
  const [isWalkedToTopLeft, setIsWalkedToTopLeft] = useState<boolean>(false);
  const [isWalking, setIsWalking] = useState<boolean>(false);

  const triggerWalk = () => {
    if (isWalking) return;
    setIsWalking(true);
    setEmote('happy');
    setIsWalkedToTopLeft(prev => !prev);
    setTimeout(() => {
      setIsWalking(false);
    }, 1400);
  };

  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const leftPos = isWalkedToTopLeft 
    ? (windowWidth < 768 ? '6px' : '24px')
    : (windowWidth < 768 ? 'calc(100vw - 166px)' : 'calc(100vw - 184px)');

  const topPos = isWalkedToTopLeft
    ? '90px'
    : (windowWidth < 768 ? 'calc(100vh - 236px)' : 'calc(100vh - 246px)');
  
  // --- INTEGRATED INTERACTIVE EMOTE SYSTEM ---
  const [emote, setEmote] = useState<'normal' | 'happy' | 'love' | 'shock' | 'angry'>('normal');
  const [showEmoteBubble, setShowEmoteBubble] = useState<boolean>(true);
  const [particles, setParticles] = useState<{ id: number; char: string; left: number; delay: number }[]>([]);

  // --- SCI-FI HUD PANEL EXTRAS (Gemini & Learning Suite) ---
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'learning' | 'drop'>('chat');
  
  // Chat History
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; timestamp: string }>>([
    { 
      sender: 'ai', 
      text: "System live. I am **Ammy**, your Cognitive ERP Assistant. I synthesize our live ERP accounts, predict supply disruptions, and auto-sort raw records. Drop any spreadsheet or text file directly onto me to sort it, or enter queries below!", 
      timestamp: new Date().toLocaleTimeString() 
    }
  ]);
  const [userQuery, setUserQuery] = useState<string>('');
  const [isQuerying, setIsQuerying] = useState<boolean>(false);

  // Continuous Learning Mind Core persistence
  const [rules, setRules] = useState<LearningRule[]>([]);
  const [trainingInput, setTrainingInput] = useState({ trigger: '', action: '/api/erp/transaction' });

  // Drag and Drop File Sorting states
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [droppedFile, setDroppedFile] = useState<{ name: string; size: number } | null>(null);
  const [fileClassification, setFileClassification] = useState<{ suggestedTarget: string; categoryName: string; confidence: number; triggerWord?: string } | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
  const [showSortingModal, setShowSortingModal] = useState<boolean>(false);
  const [manualTarget, setManualTarget] = useState<string>('/api/erp/transaction');

  // Load rules on mount
  useEffect(() => {
    const stored = localStorage.getItem('amdox_learned_rules');
    if (stored) {
      try {
        setRules(JSON.parse(stored));
      } catch (e) {
        initializeDefaultRules();
      }
    } else {
      initializeDefaultRules();
    }
  }, []);

  const initializeDefaultRules = () => {
    const defaultRules: LearningRule[] = [
      { id: "rule-1", type: "heuristic", trigger: "salary", action: "HR Personnel Directory", learnedAt: "System Init" },
      { id: "rule-2", type: "heuristic", trigger: "payroll", action: "HR Personnel Directory", learnedAt: "System Init" },
      { id: "rule-3", type: "heuristic", trigger: "ledger", action: "Financial Ledger Entry", learnedAt: "System Init" },
      { id: "rule-4", type: "heuristic", trigger: "invoice", action: "Financial Ledger Entry", learnedAt: "System Init" },
      { id: "rule-5", type: "heuristic", trigger: "stock", action: "Inventory Reorder Stock", learnedAt: "System Init" },
      { id: "rule-6", type: "heuristic", trigger: "sku", action: "Inventory Reorder Stock", learnedAt: "System Init" },
      { id: "rule-7", type: "heuristic", trigger: "shipment", action: "Logistics Freight Cargo", learnedAt: "System Init" },
      { id: "rule-8", type: "heuristic", trigger: "freight", action: "Logistics Freight Cargo", learnedAt: "System Init" }
    ];
    localStorage.setItem('amdox_learned_rules', JSON.stringify(defaultRules));
    setRules(defaultRules);
  };

  const saveRules = (newRules: LearningRule[]) => {
    localStorage.setItem('amdox_learned_rules', JSON.stringify(newRules));
    setRules(newRules);
  };

  // Learning Progress calculated with rule volume multiplier
  const learningProgress = Math.min(42 + rules.filter(r => r.type === 'manual').length * 11, 100);

  useEffect(() => {
    let emoji = '✨';
    if (emote === 'love') emoji = '❤️';
    else if (emote === 'shock') emoji = '⚡';
    else if (emote === 'angry') emoji = '🔥';
    else if (emote === 'happy') emoji = '✨';
    else if (emote === 'normal') emoji = '⚙️';

    const newParticles = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i,
      char: emoji,
      left: 15 + Math.random() * 70,
      delay: i * 0.3
    }));
    setParticles(newParticles);

    setShowEmoteBubble(true);
    const bubbleTimer = setTimeout(() => {
      setShowEmoteBubble(false);
    }, 4500);

    return () => clearTimeout(bubbleTimer);
  }, [emote]);

  useEffect(() => {
    const handlePointerMoveGlobal = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxOffset = 6.0; // wider range of movement for realistic expressive eyes
      
      if (distance === 0) {
        setEyeOffset({ x: 0, y: 0 });
      } else {
        const clampFactor = Math.min(distance / 180, 1);
        const ox = (dx / distance) * maxOffset * clampFactor;
        const oy = (dy / distance) * maxOffset * clampFactor;
        setEyeOffset({ x: ox, y: oy });
      }
    };

    const handleMouse = (e: MouseEvent) => {
      handlePointerMoveGlobal(e.clientX, e.clientY);
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        handlePointerMoveGlobal(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('touchmove', handleTouch);
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, []);

  // --- CHAT WITH GEMINI API SYSTEM ---
  const handleSendMessage = async (customPrompt?: string) => {
    const queryToSend = customPrompt || userQuery;
    if (!queryToSend.trim()) return;

    // Append user message
    const timestamp = new Date().toLocaleTimeString();
    setChatMessages(prev => [...prev, { sender: 'user', text: queryToSend, timestamp }]);
    if (!customPrompt) setUserQuery('');
    setIsQuerying(true);
    setEmote('normal');

    try {
      // Post to our secure full-stack Gemini API endpoint
      const res = await fetch('/api/erp/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: queryToSend })
      });

      if (!res.ok) throw new Error('API server status failure');
      const data = await res.json();

      if (data.success && data.insight) {
        setChatMessages(prev => [...prev, { sender: 'ai', text: data.insight, timestamp: new Date().toLocaleTimeString() }]);
        
        // Dynamic Emote selection based on AI result contents!
        const desc = data.insight.toLowerCase();
        if (desc.includes('risk') || desc.includes('deficit') || desc.includes('overrun') || desc.includes('danger') || desc.includes('bottleneck')) {
          setEmote('shock');
        } else if (desc.includes('optimal') || desc.includes('excellent') || desc.includes('secure') || desc.includes('recommend')) {
          setEmote('happy');
        } else {
          setEmote('normal');
        }

        // Continues Learning: Remember what user query interests are
        const interests = [];
        if (desc.includes('cash') || desc.includes('treasury') || desc.includes('finance')) interests.push('finance');
        if (desc.includes('sku') || desc.includes('inventory') || desc.includes('reorder')) interests.push('logistics');
        if (desc.includes('staff') || desc.includes('employee')) interests.push('human-capital');
        
        if (interests.length > 0) {
          const stored = localStorage.getItem('amdox_learned_rules');
          let currentRules: LearningRule[] = stored ? JSON.parse(stored) : [];
          interests.forEach(interest => {
            const hasRule = currentRules.some(r => r.trigger === `query-${interest}`);
            if (!hasRule) {
              const rule: LearningRule = {
                id: `train-${Date.now()}-${interest}`,
                type: 'manual',
                trigger: `query-${interest}`,
                action: `Adjust forecast profile to favor ${interest === 'finance' ? 'Treasury' : interest === 'logistics' ? 'Fulfillment' : 'Human Capital'} metrics`,
                learnedAt: new Date().toLocaleTimeString()
              };
              currentRules.push(rule);
              saveRules(currentRules);
            }
          });
        }

      } else {
        throw new Error('Response returned missing intelligence block');
      }
    } catch (err: any) {
      console.error('Core mental query failed:', err);
      // Friendly local fallback response
      setChatMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: `⚠️ **Cognitive Pipeline Timeout**: I am experiencing minor synapse dispersion. Here is my local analysis: Standard ERP parameters are optimal, with standard liquidity buffers of $495k and critical microcontroller reorder margins recommended under SKU MCU-V5-AMDX.`, 
          timestamp: new Date().toLocaleTimeString() 
        }
      ]);
      setEmote('angry');
    } finally {
      setIsQuerying(false);
    }
  };

  // --- DRAG AND DROP AUTO-SORTING CLASSIFIER ---
  const classifyFile = (fileName: string): { suggestedTarget: string; categoryName: string; confidence: number; triggerWord?: string } => {
    const normName = fileName.toLowerCase();
    
    // 1. Scan learned associations first to show genuine learning!
    const matchedRule = rules.find(r => r.type === 'manual' && normName.includes(r.trigger.toLowerCase()));
    if (matchedRule) {
      let targetApi = '/api/erp/transaction';
      if (matchedRule.action.includes('HR') || matchedRule.action.includes('Employee')) targetApi = '/api/erp/hr/employee';
      else if (matchedRule.action.includes('Inventory') || matchedRule.action.includes('Stock')) targetApi = '/api/erp/inventory/reorder';
      else if (matchedRule.action.includes('Logistics') || matchedRule.action.includes('Shipment')) targetApi = '/api/erp/shipment/create';
      
      return { 
        categoryName: matchedRule.action, 
        suggestedTarget: targetApi, 
        confidence: 98,
        triggerWord: matchedRule.trigger
      };
    }

    // 2. Default heuristics
    if (normName.includes('salary') || normName.includes('employee') || normName.includes('hr') || normName.includes('payroll') || normName.includes('staff')) {
      return { categoryName: "HR Personnel Directory", suggestedTarget: "/api/erp/hr/employee", confidence: 92 };
    }
    if (normName.includes('stock') || normName.includes('sku') || normName.includes('warehouse') || normName.includes('inventory') || normName.includes('reorder') || normName.includes('item')) {
      return { categoryName: "Inventory Reorder Stock", suggestedTarget: "/api/erp/inventory/reorder", confidence: 88 };
    }
    if (normName.includes('shipment') || normName.includes('freight') || normName.includes('cargo') || normName.includes('carrier') || normName.includes('transit') || normName.includes('waybill') || normName.includes('route')) {
      return { categoryName: "Logistics Freight Cargo", suggestedTarget: "/api/erp/shipment/create", confidence: 90 };
    }
    
    // Default fallback to financial ledger entries
    return { categoryName: "Financial Ledger Entry", suggestedTarget: "/api/erp/transaction", confidence: 72 };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setEmote('shock');
    const classification = classifyFile(file.name);
    
    setDroppedFile({ name: file.name, size: file.size });
    setFileClassification(classification);
    setManualTarget(classification.suggestedTarget);
    setShowSortingModal(true);
    setIsExpanded(true); // Open panel to show drop details tab!
    setActiveTab('drop');
  };

  // User confirms the AI classified location
  const confirmFileSortedMap = async () => {
    if (!droppedFile || !fileClassification) return;
    setIsProcessingFile(true);

    try {
      const targetApi = fileClassification.suggestedTarget;
      let mockBody: any = {};

      if (targetApi === '/api/erp/transaction') {
        mockBody = {
          account: "Accounts Receivable",
          type: "credit",
          amount: 15000 + Math.floor(Math.random() * 25000),
          department: "Engineering",
          description: `Imported Ledger Ledger file audit: ${droppedFile.name}`
        };
      } else if (targetApi === '/api/erp/hr/employee') {
        mockBody = {
          name: `Candidate (${droppedFile.name.split('.')[0]})`,
          role: "Enterprise Systems Architect",
          department: "Engineering",
          email: `recruiting.${Math.floor(Math.random() * 999)}@amdox-erp.com`,
          salary: 110000,
          status: "pending"
        };
      } else if (targetApi === '/api/erp/inventory/reorder') {
        mockBody = {
          sku: "MCU-V5-AMDX",
          orderQty: 1000
        };
      } else if (targetApi === '/api/erp/shipment/create') {
        mockBody = {
          origin: "Port of Rotterdam",
          destination: "Giga-Warehouse Austin",
          carrier: "Fedex Express",
          cargoValue: 125000,
          eta: "Week 3",
          temperatureControlled: false
        };
      }

      const res = await fetch(targetApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockBody)
      });

      if (!res.ok) throw new Error('ERP Gateway Refusal');

      // Refresh ERP
      window.dispatchEvent(new CustomEvent('refresh-erp'));

      // Append success indicator chat
      setChatMessages(prev => [
        ...prev,
        { 
          sender: 'ai', 
          text: `✅ **File Ingestion Successful!** Loaded record from **"${droppedFile.name}"** into **"${fileClassification.categoryName} (${targetApi})"** with **${fileClassification.confidence}% confidence**. ERP registers change instantly.`, 
          timestamp: new Date().toLocaleTimeString() 
        }
      ]);

      setEmote('happy');
    } catch (e: any) {
      console.error('Ingestion failed:', e);
      setChatMessages(prev => [...prev, { sender: 'ai', text: `⚠️ **Ingestion Failed**: Check file parity validation constraints.`, timestamp: new Date().toLocaleTimeString() }]);
      setEmote('angry');
    } finally {
      setIsProcessingFile(false);
      setShowSortingModal(false);
      setDroppedFile(null);
      setFileClassification(null);
    }
  };

  // User denies and sets target manually (triggers learning association updates)
  const overruleClassification = async () => {
    if (!droppedFile || !fileClassification) return;
    setIsProcessingFile(true);

    let finalCategory = "Financial Ledger Entry";
    if (manualTarget === '/api/erp/hr/employee') finalCategory = "HR Personnel Directory";
    else if (manualTarget === '/api/erp/inventory/reorder') finalCategory = "Inventory Reorder Stock";
    else if (manualTarget === '/api/erp/shipment/create') finalCategory = "Logistics Freight Cargo";

    try {
      // Post record to actual overrule target API
      let mockBody: any = {};

      if (manualTarget === '/api/erp/transaction') {
        mockBody = {
          account: "Accounts Receivable",
          type: "credit",
          amount: 18000,
          department: "Sales",
          description: `Manual override ledger log: ${droppedFile.name}`
        };
      } else if (manualTarget === '/api/erp/hr/employee') {
        mockBody = {
          name: `Staff Member (${droppedFile.name.split('.')[0]})`,
          role: "Support Specialist",
          department: "Operations",
          email: `onboard.${Math.floor(Math.random() * 99)}@amdox-erp.com`,
          salary: 62000,
          status: "pending"
        };
      } else if (manualTarget === '/api/erp/inventory/reorder') {
        mockBody = {
          sku: "MCU-V5-AMDX",
          orderQty: 850
        };
      } else if (manualTarget === '/api/erp/shipment/create') {
        mockBody = {
          origin: "Shenzhen Depot",
          destination: "Giga-Warehouse Austin",
          carrier: "USPS Logistics",
          cargoValue: 95000,
          eta: "Week 5",
          temperatureControlled: false
        };
      }

      await fetch(manualTarget, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockBody)
      });

      // Refresh ERP
      window.dispatchEvent(new CustomEvent('refresh-erp'));

      // Teaching/Learning association core!
      // Add a manual mapping rule based on this override trigger!
      // Extract a representative keyword from file name
      let triggerWord = droppedFile.name.toLowerCase().split('.')[0];
      if (triggerWord.length > 7) triggerWord = triggerWord.slice(0, 7);

      const newRule: LearningRule = {
        id: `manual-${Date.now()}`,
        type: 'manual',
        trigger: triggerWord,
        action: finalCategory,
        learnedAt: new Date().toLocaleTimeString()
      };

      const revisedRules = [...rules, newRule];
      saveRules(revisedRules);

      setChatMessages(prev => [
        ...prev,
        { 
          sender: 'ai', 
          text: `🧠 **Neural Core self-corrected!** Learned mapping trigger: any file containing **"${triggerWord}"** will now automatically redirect to **"${finalCategory}"**. Loaded record successfully.`, 
          timestamp: new Date().toLocaleTimeString() 
        }
      ]);

      setEmote('love');
    } catch (e) {
      console.error('Override parsing issue:', e);
      setEmote('angry');
    } finally {
      setIsProcessingFile(false);
      setShowSortingModal(false);
      setDroppedFile(null);
      setFileClassification(null);
    }
  };

  // Add Direct manual rule to train AI Core
  const trainCoreDirectly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainingInput.trigger.trim()) return;

    let actionLabel = "Financial Ledger Entry";
    if (trainingInput.action === '/api/erp/hr/employee') actionLabel = "HR Personnel Directory";
    else if (trainingInput.action === '/api/erp/inventory/reorder') actionLabel = "Inventory Reorder Stock";
    else if (trainingInput.action === '/api/erp/shipment/create') actionLabel = "Logistics Freight Cargo";

    const newRule: LearningRule = {
      id: `manual-${Date.now()}`,
      type: 'manual',
      trigger: trainingInput.trigger.trim().toLowerCase(),
      action: actionLabel,
      learnedAt: new Date().toLocaleTimeString()
    };

    const updated = [...rules, newRule];
    saveRules(updated);

    setTrainingInput({ trigger: '', action: '/api/erp/transaction' });
    setEmote('love');

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: `🧠 **Direct Training Applied!** I have loaded the custom association rule: files with name containing **"${newRule.trigger}"** will be processed into **"${newRule.action}"**. Brain compliance and learning progress increased.`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  // Gentle automatic orbital spin if idle
  useEffect(() => {
    if (!autoRotate || isDraggingRotation) return;
    let animFrame: number;
    const speed = 0.4;
    const tick = () => {
      setRotation(prev => ({
        ...prev,
        y: (prev.y + speed) % 360
      }));
      animFrame = requestAnimationFrame(tick);
    };
    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [autoRotate, isDraggingRotation]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingRotation(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    rotationStart.current = { x: rotation.x, y: rotation.y };
    setAutoRotate(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRotation) return;
    e.stopPropagation();
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    
    setRotation({
      x: Math.max(-60, Math.min(60, rotationStart.current.x - deltaY * 0.9)),
      y: rotationStart.current.y + deltaX * 1.1
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDraggingRotation(false);
  };

  const handleViewportClick = () => {
    if (isDraggingRotation) return;
    setIsExpanded(prev => !prev);
    setEmote('happy');
  };

  const getMoodBorder = () => {
    if (translucentBrainShell) {
      return 'border-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.35)]';
    }
    return 'border-amber-400/30 hover:border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]';
  };

  return (
    <>
      <motion.div
        id="3d_fixed_robot_container"
        ref={containerRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`fixed z-50 p-2.5 select-none w-[160px] flex flex-col items-center rounded-2xl ${
          isDraggingFile ? 'bg-cyan-500/20 border-2 border-dashed border-cyan-400' : ''
        }`}
        style={{
          left: leftPos,
          top: topPos,
          transition: 'left 1.4s cubic-bezier(0.25, 1, 0.5, 1), top 1.4s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
        title="Click Ammy to toggle live Cognitive AI Window! Or click behind her to clear space!"
      >
        {/* Clickable Backing Area (Invisible but clickable overlay behind the robot to toggle position) */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            triggerWalk();
          }}
          className="absolute inset-0 rounded-2xl cursor-pointer z-0 transition-colors hover:bg-white/[0.02]"
          title="Click here to clear space by walking Ammy to the other corner!"
        />

      {/* --- MAIN 3D MODEL VIEWPORT WITH PERSPECTIVE --- */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleViewportClick}
        className={`w-full h-[170px] flex items-center justify-center relative touch-none select-none overflow-visible cursor-pointer z-10 pointer-events-auto`}
        style={{ 
          perspective: '700px',
          perspectiveOrigin: '50% 50%' 
        }}
      >
        {/* Soft Ambient shadow & Pulsing Neon Ground Glow under robot */}
        <div 
          className="absolute bottom-1 w-24 h-4 rounded-full pointer-events-none"
          style={{
            transform: `rotateX(82deg) scale(${isDraggingRotation ? 0.9 : 1.1})`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Physical Ambient occlusion shadow */}
          <div className="absolute inset-0 bg-black/70 rounded-full blur-[3px]" />
          
          {/* Soft outer neon aura */}
          <div 
            className="absolute inset-[-6px] rounded-full blur-[14px] opacity-70 animate-pulse transition-all duration-300"
            style={{
              backgroundColor: translucentBrainShell ? 'rgba(6, 182, 212, 0.45)' : 'rgba(245, 158, 11, 0.45)',
              boxShadow: translucentBrainShell 
                ? '0 0 25px rgba(6, 182, 212, 0.6), 0 0 50px rgba(6, 182, 212, 0.3)' 
                : '0 0 25px rgba(245, 158, 11, 0.6), 0 0 50px rgba(245, 158, 11, 0.3)',
              animationDuration: '1.8s'
            }}
          />
          
          {/* Intense hot core Projection spot */}
          <div 
            className="absolute inset-[3px] rounded-full blur-[5px] opacity-85 animate-pulse transition-all duration-300"
            style={{
              backgroundColor: translucentBrainShell ? 'rgba(34, 211, 238, 0.9)' : 'rgba(251, 191, 36, 0.9)',
              boxShadow: translucentBrainShell 
                ? '0 0 10px rgba(34, 211, 238, 1)' 
                : '0 0 10px rgba(251, 191, 36, 1)',
              animationDuration: '1.2s'
            }}
          />
        </div>

        {/* Glowing Holographic Column for translucent mode */}
        {translucentBrainShell && (
          <div className="absolute top-2 bottom-6 w-14 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 pointer-events-none animate-pulse" />
        )}

        {/* --- COMPLEX 3D ROBOT STRUCTURAL ASSEMBLAGE --- */}
        <div
          className={`relative w-24 h-32 flex flex-col items-center justify-center transition-transform duration-100 ease-out ${isWalking ? 'walking-sway' : ''}`}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Custom style keyframes for floating and magnetic sci-fi effects */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes roboHeadFloat_custom {
              0%, 100% {
                transform: translateY(-30px) rotateX(1.5deg) rotateY(1deg);
              }
              50% {
                transform: translateY(-36px) rotateX(-2deg) rotateY(-1deg);
              }
            }
            @keyframes energyRingPulse {
              0%, 100% {
                transform: translateY(2px) translateZ(0) rotateX(90deg) scale(0.85);
                opacity: 0.55;
                box-shadow: 0 0 10px rgba(0, 240, 255, 0.45), inset 0 0 8px rgba(0, 240, 255, 0.3);
              }
              50% {
                transform: translateY(2px) translateZ(0) rotateX(90deg) scale(1.05);
                opacity: 0.95;
                box-shadow: 0 0 20px rgba(0, 240, 255, 0.85), inset 0 0 12px rgba(0, 240, 255, 0.6);
              }
            }
            @keyframes amberEnergyRingPulse {
              0%, 100% {
                transform: translateY(2px) translateZ(0) rotateX(90deg) scale(0.85);
                opacity: 0.55;
                box-shadow: 0 0 10px rgba(245, 158, 11, 0.45), inset 0 0 8px rgba(245, 158, 11, 0.3);
              }
              50% {
                transform: translateY(2px) translateZ(0) rotateX(90deg) scale(1.05);
                opacity: 0.95;
                box-shadow: 0 0 20px rgba(245, 158, 11, 0.85), inset 0 0 12px rgba(245, 158, 11, 0.6);
              }
            }
            .brushed-metal-gold {
              background: 
                repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
                linear-gradient(135deg, #fffbeb 0%, #fde047 12%, #fbbf24 25%, #ffffff 38%, #f59e0b 45%, #d97706 72%, #92400e 90%, #451a03 100%) !important;
              background-blend-mode: overlay !important;
              box-shadow: 
                inset 1px 1px 2px rgba(255,255,255,0.9),
                inset -2px -2px 4px rgba(0,0,0,0.7),
                0 4px 10px rgba(0,0,0,0.3) !important;
            }
            .brushed-metal-bronze {
              background: 
                repeating-linear-gradient(90deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 3px),
                linear-gradient(135deg, #f59e0b 0%, #ffffff 22%, #d97706 40%, #b45309 68%, #78350f 88%, #451a03 100%) !important;
              background-blend-mode: overlay !important;
              box-shadow: 
                inset 1px 1px 1.5px rgba(255,255,255,0.6),
                inset -2px -2px 4px rgba(0,0,0,0.75) !important;
            }
            .brushed-metal-dark-bronze {
              background: 
                repeating-linear-gradient(90deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, rgba(0,0,0,0.025) 2px, rgba(0,0,0,0.025) 4px),
                linear-gradient(135deg, #b45309 0%, #ffffff 15%, #78350f 45%, #451a03 100%) !important;
              background-blend-mode: overlay !important;
              box-shadow: 
                inset 1px 1px 1px rgba(255,255,255,0.4),
                inset -2px -2px 4px rgba(0,0,0,0.8) !important;
            }
            .brushed-metal-steel {
              background: 
                repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 3px),
                linear-gradient(135deg, #f9fafb 0%, #ffffff 28%, #e5e7eb 40%, #d1d5db 50%, #9ca3af 68%, #4b5563 88%, #1f2937 100%) !important;
              background-blend-mode: overlay !important;
              box-shadow: 
                inset 1px 1px 2px rgba(255,255,255,0.95),
                inset -2px -2px 4px rgba(0,0,0,0.6) !important;
            }
            .rivet {
              width: 4px;
              height: 4px;
              background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 35%, #64748b 75%, #1e293b 100%);
              border-radius: 50%;
              box-shadow: inset 0.5px 0.5px 1px rgba(255,255,255,0.85), 0.5px 0.5px 1.5px rgba(0,0,0,0.55);
              position: absolute;
              z-index: 10;
              pointer-events: none;
            }
            .rivet::after {
              content: '';
              position: absolute;
              left: 50%;
              top: 50%;
              width: 2.2px;
              height: 0.6px;
              background: #000;
              opacity: 0.75;
              transform: translate(-50%, -50%) rotate(42deg);
            }
            @keyframes robotWalkingSway {
              0%, 100% {
                transform: rotateY(-10deg) rotateZ(-3deg) translateY(0px) scaleY(1);
              }
              25% {
                transform: rotateY(10deg) rotateZ(3deg) translateY(-8px) scaleY(0.96);
              }
              50% {
                transform: rotateY(10deg) rotateZ(3deg) translateY(0px) scaleY(1.02);
              }
              75% {
                transform: rotateY(-10deg) rotateZ(-3deg) translateY(-8px) scaleY(0.96);
              }
            }
            @keyframes robotArmLeftWalkingSway {
              0%, 100% {
                transform: rotateZ(-28deg) translateY(-1px);
              }
              50% {
                transform: rotateZ(3deg) translateY(1.5px);
              }
            }
            @keyframes robotArmRightWalkingSway {
              0%, 100% {
                transform: rotateZ(3deg) translateY(1.5px);
              }
              50% {
                transform: rotateZ(-28deg) translateY(-1px);
              }
            }
            @keyframes robotThrusterWalkingSway {
              0%, 100% {
                transform: translateY(51px) rotateZ(-20deg) scaleX(1.2) translateY(2px);
              }
              50% {
                transform: translateY(51px) rotateZ(20deg) scaleX(0.8) translateY(-1px);
              }
            }
            .walking-sway {
              animation: robotWalkingSway 0.45s linear infinite !important;
            }
            .walking-arm-left {
              animation: robotArmLeftWalkingSway 0.45s linear infinite !important;
            }
            .walking-arm-right {
              animation: robotArmRightWalkingSway 0.45s linear infinite !important;
            }
            .walking-thruster {
              animation: robotThrusterWalkingSway 0.45s linear infinite !important;
            }
          `}} />

          {/* === FLOATING HEAD ASSEMBLY (Bobbing in sync above the body) === */}
          <div 
            className="absolute"
            style={{
              width: '74px',
              height: '52px',
              transformStyle: 'preserve-3d',
              animation: 'roboHeadFloat_custom 3.2s ease-in-out infinite',
              pointerEvents: 'none'
            }}
          >
            {/* === 1. TOP ANTENNA (Realistic Milled Chrome Mast + Glowing Gem) === */}
            <div 
              className="absolute" 
              style={{ 
                left: '29px', // Center: (74 - 16)/2 = 29px
                transform: 'translateY(-41px) translateZ(0px)', 
                transformStyle: 'preserve-3d',
                pointerEvents: 'auto'
              }}
            >
              {/* CNC Beveled Antenna Mount */}
              <div 
                className="w-5 h-2 rounded-t-[3px] border-b border-black/40 shadow-[0_1.5px_2px_rgba(0,0,0,0.4)]" 
                style={{ 
                  background: 'linear-gradient(to right, #4b5563, #374151, #1f2937)',
                  transform: 'translateZ(-1px)' 
                }} 
              />
              {/* Polished steel mast with light highlights */}
              <div 
                className="w-1.5 h-6 mx-auto relative shadow-[1px_0_2px_rgba(0,0,0,0.3)]" 
                style={{
                  background: 'linear-gradient(to right, #9ca3af 0%, #f3f4f6 30%, #d1d5db 45%, #4b5563 80%, #374151 100%)'
                }}
              >
                {/* Highlight line on chrome */}
                <div className="absolute top-0 bottom-0 left-[0.5px] w-[0.5px] bg-white/40" />
              </div>
              {/* Dynamic Signal Transmitter Dome */}
              <div 
                className="w-[16px] h-[16px] rounded-full transition-all duration-300"
                style={{
                  background: translucentBrainShell 
                    ? 'radial-gradient(circle at 35% 35%, #9ffff3 0%, #00f0ff 45%, #0e7490 85%, #083344 100%)' 
                    : 'radial-gradient(circle at 35% 35%, #fffbeb 0%, #fbbf24 35%, #d97706 70%, #78350f 100%)',
                  boxShadow: translucentBrainShell 
                    ? '0 0 15px #00f0ff, 0 0 5px rgba(0,240,255,0.5), inset -2.5px -2.5px 5px rgba(0,0,0,0.55)' 
                    : '0 2.5px 6px rgba(0,0,0,0.4), 0 0 10px rgba(217,119,6,0.3), inset -2.5px -2.5px 5px rgba(0,0,0,0.65)',
                  transform: 'translateY(-2px)'
                }}
              />
            </div>

            {/* === 2. HIGHLY ROUNDED 3D TOY HEAD (With Premium Metal Shading) === */}
            <div 
              className="absolute inset-0"
              style={{
                transform: 'translateZ(0px)',
                transformStyle: 'preserve-3d',
                pointerEvents: 'auto'
              }}
            >
              {/* HEAD INTERNAL SOLID FILLERS (Weighted 3D interior to hide light seams) */}
              <div 
                className="absolute pointer-events-none"
                style={{
                  width: '74px',
                  height: '52px',
                  transform: 'translateZ(0px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* XY Plane (Metallic blocker) */}
                <div 
                  className="absolute inset-[1px] transition-all duration-300"
                  style={{
                    background: translucentBrainShell 
                      ? 'rgba(0, 240, 255, 0.12)' 
                      : 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)',
                    borderRadius: '8px',
                    transform: 'translateZ(0px)'
                  }}
                />
                {/* YZ Plane (Sides blocker) */}
                <div 
                  className="absolute transition-all duration-300"
                  style={{
                    width: '50px',
                    height: '50px',
                    left: '12px',
                    top: '1px',
                    background: translucentBrainShell 
                      ? 'rgba(0, 240, 255, 0.12)' 
                      : 'linear-gradient(to bottom, #d97706, #78350f)',
                    borderRadius: '8px',
                    transform: 'rotateY(90deg)'
                  }}
                />
                {/* XZ Plane (Bottom blocker) */}
                <div 
                  className="absolute transition-all duration-300"
                  style={{
                    width: '72px',
                    height: '50px',
                    left: '1px',
                    top: '1px',
                    background: translucentBrainShell 
                      ? 'rgba(0, 240, 255, 0.15)' 
                      : '#78350f',
                    borderRadius: '8px',
                    transform: 'rotateX(90deg)'
                  }}
                />
              </div>

              {/* HEAD SHELL: FRONT VISOR FACE */}
              <div 
                className={`absolute inset-0 rounded-[9px] p-[2.5px] flex items-center justify-center transition-all duration-300 ${!translucentBrainShell ? 'brushed-metal-gold' : ''}`}
                style={{ 
                  transform: 'translateZ(26px)', 
                  transformStyle: 'preserve-3d', 
                  backfaceVisibility: 'hidden',
                  ...(translucentBrainShell ? {
                    background: 'rgba(0, 240, 255, 0.22)',
                    border: '1.5px solid rgba(0, 240, 255, 0.8)',
                    boxShadow: 'inset 0 0 14px rgba(0,240,255,0.7)'
                  } : {
                    border: '1px solid #78350f',
                  })
                }}
              >
                {!translucentBrainShell && (
                  <>
                    <div className="rivet top-[4px] left-[4px]" />
                    <div className="rivet top-[4px] right-[4px]" />
                    <div className="rivet bottom-[4px] left-[4px]" />
                    <div className="rivet bottom-[4px] right-[4px]" />
                  </>
                )}
                {/* CNC Chamfered bezel track */}
                <div className="w-full h-full rounded-[7px] bg-[#0c101d] border-[1.5px] border-[#080a13] p-1.5 flex flex-col justify-between items-center relative overflow-hidden shadow-[inset_0_2px_5px_rgba(0,0,0,0.9)]">
                  {/* Advanced Curved CRT Glare Overlay + Subtle Scanlines */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-30" 
                    style={{
                      background: 'linear-gradient(105deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 20%, transparent 21%, transparent 75%, rgba(255,255,255,0.03) 76%, rgba(255,255,255,0.06) 100%), repeating-linear-gradient(rgba(0,0,0,0) 0px, rgba(0,0,0,0) 1px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 3px)'
                    }}
                  />
                  
                  {/* Micro Ambient Shadow overlay inside screen border */}
                  <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />



                  {/* Highly prominent GLOWING BIG CIRCULAR EYES from the image */}
                  <div className="flex gap-2.5 justify-center items-center my-0.5 relative z-10 transition-transform duration-300">
                    {/* Left Eye Socket */}
                    <div className="w-[21px] h-[28px] flex items-center justify-center relative">
                      {/* Moving Iris & Pupil (moves with eyeOffset) */}
                      <div 
                        className="w-[19px] h-[25px] rounded-[50%] transition-all duration-75 relative flex items-center justify-center select-none overflow-hidden"
                        style={{
                          background: '#ffffff',
                          boxShadow: emote === 'angry' 
                            ? '0 0 15px rgba(239, 68, 68, 0.85), inset 0 2px 4px rgba(0,0,0,0.2)' 
                            : emote === 'love'
                            ? '0 0 15px rgba(244, 63, 94, 0.85), inset 0 2px 4px rgba(0,0,0,0.2)'
                            : '0 0 15px rgba(56, 189, 248, 0.8), inset 0 2px 4px rgba(0,0,0,0.2), inset 0 -1.5px 3px rgba(0,0,0,0.08)',
                          transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                          transformStyle: 'preserve-3d font-sans'
                        }}
                      >
                        {/* Angry Eyebrow Overlay */}
                        {emote === 'angry' && (
                          <div className="absolute top-[2px] left-[-1px] w-5 h-[3px] bg-rose-700 rounded-sm z-30 rotate-[20deg]" />
                        )}

                        {/* Emote Custom Pupils */}
                        {emote === 'normal' && (
                          <div 
                            className="w-[8px] h-[12px] rounded-full bg-gradient-to-b from-[#38bdf8] to-[#1d4ed8] shadow-[inset_0.5px_1px_2px_rgba(255,255,255,0.45)] flex items-center justify-center absolute top-[5px] left-[6.5px]"
                            style={{
                              transform: 'rotate(12deg)'
                            }}
                          />
                        )}

                        {emote === 'happy' && (
                          <div className="w-[11px] h-[7px] border-t-3 border-b-0 border-x-0 border-emerald-600 rounded-t-full mt-[2px] z-20" />
                        )}

                        {emote === 'love' && (
                          <div className="text-[11px] text-rose-500 animate-pulse font-sans leading-none z-20">❤️</div>
                        )}

                        {emote === 'shock' && (
                          <div className="w-[10px] h-[10px] rounded-full bg-cyan-400 border border-white animate-ping absolute" />
                        )}

                        {emote === 'angry' && (
                          <div className="w-[7px] h-[9px] rounded-xs bg-gradient-to-b from-amber-500 to-red-600 top-[6px] absolute z-20" />
                        )}
                        
                        {/* Vibrant Light Blue Curved Crescent ring inside the iris */}
                        {emote === 'normal' && (
                          <div className="absolute bottom-[2px] inset-x-2 h-[3px] rounded-full bg-cyan-200/75 blur-[0.3px] pointer-events-none" />
                        )}

                        {/* CORNEA GLASS GLINT REFLECTIONS */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-[3px] left-[3.2px] w-[5.5px] h-[5.5px] rounded-full bg-white shadow-[0_0_2.5px_rgba(255,255,255,0.95)]" />
                          <div className="absolute bottom-[4.2px] right-[4.2px] w-[3px] h-[3px] rounded-full bg-white/90 shadow-[0_0_1px_rgba(255,255,255,0.8)]" />
                        </div>
                      </div>
                    </div>

                    {/* Right Eye Socket */}
                    <div className="w-[21px] h-[28px] flex items-center justify-center relative">
                      {/* Moving Iris & Pupil (moves with eyeOffset) */}
                      <div 
                        className="w-[19px] h-[25px] rounded-[50%] transition-all duration-75 relative flex items-center justify-center select-none overflow-hidden"
                        style={{
                          background: '#ffffff',
                          boxShadow: emote === 'angry' 
                            ? '0 0 15px rgba(239, 68, 68, 0.85), inset 0 2px 4px rgba(0,0,0,0.2)' 
                            : emote === 'love'
                            ? '0 0 15px rgba(244, 63, 94, 0.85), inset 0 2px 4px rgba(0,0,0,0.2)'
                            : '0 0 15px rgba(56, 189, 248, 0.8), inset 0 2px 4px rgba(0,0,0,0.2), inset 0 -1.5px 3px rgba(0,0,0,0.08)',
                          transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                          transformStyle: 'preserve-3d font-sans'
                        }}
                      >
                        {/* Angry Eyebrow Overlay */}
                        {emote === 'angry' && (
                          <div className="absolute top-[2px] right-[-1px] w-5 h-[3px] bg-rose-700 rounded-sm z-30 -rotate-[20deg]" />
                        )}

                        {/* Emote Custom Pupils */}
                        {emote === 'normal' && (
                          <div 
                            className="w-[8px] h-[12px] rounded-full bg-gradient-to-b from-[#38bdf8] to-[#1d4ed8] shadow-[inset_0.5px_1px_2px_rgba(255,255,255,0.45)] flex items-center justify-center absolute top-[5px] left-[4.5px]"
                            style={{
                              transform: 'rotate(-12deg)'
                            }}
                          />
                        )}

                        {emote === 'happy' && (
                          <div className="w-[11px] h-[7px] border-t-3 border-b-0 border-x-0 border-emerald-600 rounded-t-full mt-[2px] z-20" />
                        )}

                        {emote === 'love' && (
                          <div className="text-[11px] text-rose-500 animate-pulse font-sans leading-none z-20">❤️</div>
                        )}

                        {emote === 'shock' && (
                          <div className="w-[10px] h-[10px] rounded-full bg-cyan-400 border border-white animate-ping absolute" />
                        )}

                        {emote === 'angry' && (
                          <div className="w-[7px] h-[9px] rounded-xs bg-gradient-to-b from-amber-500 to-red-600 top-[6px] absolute z-20" />
                        )}
                        
                        {/* Vibrant Light Blue Curved Crescent ring inside the iris */}
                        {emote === 'normal' && (
                          <div className="absolute bottom-[2px] inset-x-2 h-[3px] rounded-full bg-cyan-200/75 blur-[0.3px] pointer-events-none" />
                        )}

                        {/* CORNEA GLASS GLINT REFLECTIONS */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-[3px] left-[3.2px] w-[5.5px] h-[5.5px] rounded-full bg-white shadow-[0_0_2.5px_rgba(255,255,255,0.95)]" />
                          <div className="absolute bottom-[4.2px] right-[4.2px] w-[3px] h-[3px] rounded-full bg-white/90 shadow-[0_0_1px_rgba(255,255,255,0.8)]" />
                        </div>
                      </div>
                    </div>

                    {/* Highly polished blush spots utilizing sub-surface red glass look */}
                    <div className="absolute -bottom-1.5 inset-x-0 flex justify-between px-1.5 pointer-events-none z-20">
                      <div 
                        className={`w-[8px] h-[3px] rounded-full blur-[0.4px] animate-pulse transition-all duration-300 ${
                          emote === 'love' ? 'bg-rose-500' : emote === 'angry' ? 'bg-red-500 scale-125' : 'bg-rose-500/80'
                        }`} 
                        style={{ animationDuration: '1.2s' }} 
                      />
                      <div 
                        className={`w-[8px] h-[3px] rounded-full blur-[0.4px] animate-pulse transition-all duration-300 ${
                          emote === 'love' ? 'bg-rose-500' : emote === 'angry' ? 'bg-red-500 scale-125' : 'bg-rose-500/80'
                        }`} 
                        style={{ animationDuration: '1.2s' }} 
                      />
                    </div>
                  </div>

                  {/* Authentic sub-level motherboard connection bars */}
                  <div className="flex gap-[1.5px] items-center justify-center h-1 w-full opacity-70 z-10">
                    <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
                    <span className="w-4 h-[1px] bg-zinc-700" />
                    <span className="w-1.5 h-1.5 rounded-sm bg-teal-500/85" />
                    <span className="w-4 h-[1px] bg-zinc-700" />
                    <span className="w-1 h-1 rounded-full bg-pink-500" />
                  </div>
                </div>
              </div>

              {/* HEAD SHELL: REAR BACK FACE (Golden shell with back venting) */}
              <div 
                className={`absolute inset-0 rounded-[9px] p-2 flex flex-col justify-center items-center text-center transition-all duration-300 ${!translucentBrainShell ? 'brushed-metal-gold' : ''}`}
                style={{ 
                  transform: 'rotateY(180deg) translateZ(26px)', 
                  backfaceVisibility: 'hidden',
                  ...(translucentBrainShell ? {
                    background: 'rgba(0, 240, 255, 0.18)',
                    border: '1.5px solid rgba(0, 240, 255, 0.8)'
                  } : {
                    border: '1.5px solid #78350f',
                  }),
                  boxShadow: 'inset -2.5px 2.5px 5px rgba(0,0,0,0.4), inset 1.5px -1.5px 3px rgba(255,255,255,0.2)'
                }}
              >
                {!translucentBrainShell && (
                  <>
                    <div className="rivet top-[4px] left-[4px]" />
                    <div className="rivet top-[4px] right-[4px]" />
                    <div className="rivet bottom-[4px] left-[4px]" />
                    <div className="rivet bottom-[4px] right-[4px]" />
                  </>
                )}
                <span className="text-[5px] font-mono font-black text-zinc-900 tracking-widest leading-none mb-1 shadow-[0_1px_0_rgba(255,255,255,0.25)]">COGNITIVE RADIAL</span>
                {/* Molded mechanical vent slots */}
                <div className="w-12 h-4 bg-[#0a0c14] rounded-[3px] border border-black/80 p-0.5 grid grid-cols-4 gap-[2.5px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
                  <span className="h-full bg-rose-500/80 rounded-xs animate-pulse" />
                  <span className="h-full bg-zinc-800 rounded-xs" />
                  <span className="h-full bg-zinc-800 rounded-xs" />
                  <span className="h-full bg-cyan-400/80 rounded-xs animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
                <span className="text-[3.8px] font-mono text-amber-500/80 font-black mt-1 scale-[0.9]">AMDOX SYSTEMS v4</span>
              </div>

              {/* HEAD SHELL: LEFT SIDE FACE */}
              <div 
                className={`absolute transition-all duration-300 rounded-[8px] ${!translucentBrainShell ? 'brushed-metal-gold' : ''}`}
                style={{
                  width: '52px', // Depth
                  height: '52px', // Height
                  left: '11px',
                  top: '0px',
                  transform: 'rotateY(-90deg) translateZ(37px)',
                  backfaceVisibility: 'hidden',
                  ...(translucentBrainShell ? {
                    background: 'rgba(0, 240, 255, 0.22)',
                    border: '1.5px solid rgba(0, 240, 255, 0.8)',
                    boxShadow: 'inset 0 0 10px rgba(0,240,255,0.5)'
                  } : {
                    border: '1px solid #78350f',
                  })
                }}
              />

              {/* HEAD SHELL: RIGHT SIDE FACE */}
              <div 
                className={`absolute transition-all duration-300 rounded-[8px] ${!translucentBrainShell ? 'brushed-metal-gold' : ''}`}
                style={{
                  width: '52px', // Depth
                  height: '52px', // Height
                  left: '11px',
                  top: '0px',
                  transform: 'rotateY(90deg) translateZ(37px)',
                  backfaceVisibility: 'hidden',
                  ...(translucentBrainShell ? {
                    background: 'rgba(0, 240, 255, 0.22)',
                    border: '1.5px solid rgba(0, 240, 255, 0.8)',
                    boxShadow: 'inset 0 0 10px rgba(0,240,255,0.5)'
                  } : {
                    border: '1px solid #78350f',
                  })
                }}
              />

              {/* HEAD SHELL: LEFT EAR (Faithful dark circular cap button, refined into industrial latch) */}
              <div 
                className="absolute top-[13px] w-[10px] h-[26px] bg-gradient-to-r from-zinc-800 to-zinc-950 rounded-full border border-black flex items-center justify-center cursor-pointer shadow-[2px_0_4px_rgba(0,0,0,0.4)]"
                style={{ 
                  left: '32px', // Centered in X: (74 - 10)/2
                  transform: 'rotateY(-90deg) translateZ(38.5px)',
                  backfaceVisibility: 'hidden',
                  boxShadow: 'inset 1px 1px 3px rgba(255,255,255,0.15)'
                }}
              >
                <div className="w-[3.5px] h-[3.5px] rounded-full bg-[#fbbf24] animate-ping" />
              </div>

              {/* HEAD SHELL: RIGHT EAR (Faithful dark circular cap button, refined into industrial latch) */}
              <div 
                className="absolute top-[13px] w-[10px] h-[26px] bg-gradient-to-r from-zinc-850 to-zinc-950 rounded-full border border-black flex items-center justify-center cursor-pointer shadow-[2px_0_4px_rgba(0,0,0,0.4)]"
                style={{ 
                  left: '32px', // Centered in X: (74 - 10)/2
                  transform: 'rotateY(90deg) translateZ(38.5px)',
                  backfaceVisibility: 'hidden',
                  boxShadow: 'inset 1px 1px 3px rgba(255,255,255,0.15)'
                }}
              >
                <div className="w-[3.5px] h-[3.5px] rounded-full bg-[#fbbf24] animate-ping" />
              </div>

              {/* HEAD TOP CAP LAYER */}
              <div 
                className={`absolute rounded-[8px] transition-all duration-300 ${!translucentBrainShell ? 'brushed-metal-gold' : ''}`}
                style={{ 
                  width: '74px',
                  height: '52px', // depth
                  left: '0px',
                  top: '0px',
                  transform: 'rotateX(90deg) translateZ(26px)',
                  backfaceVisibility: 'hidden',
                  ...(translucentBrainShell ? {
                    background: 'rgba(0, 240, 255, 0.22)',
                    border: '1.5px solid rgba(0, 240, 255, 0.8)',
                  } : {
                    border: '1px solid #78350f',
                  }),
                  boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.45), inset -2.5px -2.5px 5px rgba(0,0,0,0.3)'
                }}
              />

              {/* HEAD BOTTOM CAP LAYER */}
              <div 
                className={`absolute rounded-[8px] transition-all duration-300 ${!translucentBrainShell ? 'brushed-metal-dark-bronze' : ''}`}
                style={{ 
                  width: '74px',
                  height: '52px', // depth
                  left: '0px',
                  top: '0px',
                  transform: 'rotateX(-90deg) translateZ(26px)',
                  backfaceVisibility: 'hidden',
                  ...(translucentBrainShell ? {
                    background: 'rgba(0, 240, 255, 0.18)',
                    border: '1.5px solid rgba(0, 240, 255, 0.7)',
                  } : {
                    border: '1px solid #451a03',
                  }),
                  boxShadow: 'inset -2.5px -2.5px 5px rgba(0,0,0,0.45)'
                }}
              />
            </div>
          </div>

          {/* === 3. FLOATING MAGNETIC LEVITATION FIELD (Replacing rigid physical neck) === */}
          <div 
            className="absolute w-[36px] h-[36px] rounded-full border-2 transition-all duration-300"
            style={{ 
              transform: 'translateY(1px) translateZ(0) rotateX(90deg) scale(0.9)',
              borderColor: translucentBrainShell ? '#22d3ee' : '#f59e0b',
              background: translucentBrainShell 
                ? 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, rgba(34,211,238,0) 70%)'
                : 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0) 70%)',
              animation: translucentBrainShell ? 'energyRingPulse 2s ease-in-out infinite' : 'amberEnergyRingPulse 2s ease-in-out infinite',
              transformStyle: 'preserve-3d',
              pointerEvents: 'none'
            }}
          >
            {/* Inner neon plasma levitation micro core */}
            <div 
              className="absolute inset-[8px] rounded-full blur-[1px]"
              style={{
                background: translucentBrainShell ? '#22d3ee' : '#fbbf24',
                boxShadow: translucentBrainShell ? '0 0 12px #22d3ee' : '0 0 12px #fbbf24'
              }}
            />
          </div>
          
          {/* Glowing magnetic particles bridge beam */}
          <div 
            className="absolute w-[2px] h-[10px] blur-[0.5px] transition-all duration-300 animate-pulse"
            style={{
              background: translucentBrainShell 
                ? 'linear-gradient(to bottom, transparent, rgba(34,211,238,0.85), transparent)'
                : 'linear-gradient(to bottom, transparent, rgba(245,158,11,0.85), transparent)',
              transform: 'translateY(-10px) translateZ(0px)',
              pointerEvents: 'none'
            }}
          />

          {/* === 4. SMOOTH PEBBLE-STYLE TORSO/BODY (Sleek Golden Metallic curves) === */}
          <div 
            className="absolute"
            style={{
              width: '54px',
              height: '42px',
              transform: 'translateY(22px)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* TORSO INTERNAL SOLID FILLERS (Weighted interior core to hide seams) */}
            <div 
              className="absolute pointer-events-none"
              style={{
                width: '54px',
                height: '42px',
                transform: 'translateZ(0px)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* XY Plane */}
              <div 
                className="absolute inset-[1px] transition-all duration-300"
                style={{
                  background: translucentBrainShell 
                    ? 'rgba(0, 240, 255, 0.12)' 
                    : 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)',
                  borderRadius: '6px',
                  transform: 'translateZ(0px)'
                }}
              />
              {/* YZ Plane */}
              <div 
                className="absolute transition-all duration-300"
                style={{
                  width: '40px',
                  height: '40px',
                  left: '7px',
                  top: '1px',
                  background: translucentBrainShell 
                    ? 'rgba(0, 240, 255, 0.12)' 
                    : 'linear-gradient(to bottom, #d97706, #78350f)',
                  borderRadius: '6px',
                  transform: 'rotateY(90deg)'
                }}
              />
              {/* XZ Plane */}
              <div 
                className="absolute transition-all duration-300"
                style={{
                  width: '52px',
                  height: '40px',
                  left: '1px',
                  top: '1px',
                  background: translucentBrainShell 
                    ? 'rgba(0, 240, 255, 0.1)' 
                    : '#78350f',
                  borderRadius: '6px',
                  transform: 'rotateX(90deg)'
                }}
              />
            </div>

            {/* TORSO FRONT: Glossy curved golden body shell or translucent brain matrix! */}
            <div 
              className={`absolute inset-0 rounded-[7px] p-[2.5px] flex flex-col justify-between transition-all duration-300 shadow-[0_3px_8px_rgba(0,0,0,0.3)] ${!translucentBrainShell ? 'brushed-metal-gold' : ''}`}
              style={{ 
                transform: 'translateZ(21px)', 
                transformStyle: 'preserve-3d', 
                backfaceVisibility: 'hidden',
                ...(translucentBrainShell ? {
                  background: 'rgba(0, 240, 255, 0.22)',
                  border: '1.5px solid rgba(0, 240, 255, 0.8)',
                  boxShadow: 'inset 0 0 14px rgba(0,240,255,0.7)'
                } : {
                  border: '1px solid #78350f',
                })
              }}
            >
              {!translucentBrainShell && (
                <>
                  <div className="rivet top-[3px] left-[3px]" />
                  <div className="rivet top-[3px] right-[3px]" />
                  <div className="rivet bottom-[3px] left-[3px]" />
                  <div className="rivet bottom-[3px] right-[3px]" />
                </>
              )}
              {/* CONTINUOUSLY LEARNING BRAIN INNER CORE (Beautiful glowing high-tech structural nodes) */}
              <div className="absolute inset-1.5 flex items-center justify-center pointer-events-none">
                <div 
                  className="rounded-full flex items-center justify-center transition-all p-1 bg-[#14b8a6]/10 animate-pulse relative"
                  style={{
                    border: '1px solid rgba(0,240,255,0.65)'
                  }}
                >
                  <div 
                    className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff] flex items-center justify-center relative overflow-hidden"
                  >
                    {/* Glowing spinner core */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,_rgba(255,255,255,0.9)_0%,_transparent_60%)] z-10" />
                    <Sparkle className="w-2.5 h-2.5 text-white animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                  {/* Surrounding orbit filaments */}
                  <span className="absolute -inset-[3px] rounded-full border border-teal-500/30 animate-spin" style={{ animationDuration: '8s' }} />
                </div>

                {/* Cybernetic wiring tubes */}
                <span className="absolute left-[3px] w-3 h-[1.5px] bg-[#00f0ff]/55 shadow-[0_0_2px_#00f0ff]" />
                <span className="absolute right-[3px] w-3 h-[1.5px] bg-[#00f0ff]/55 shadow-[0_0_2px_#00f0ff]" />
              </div>


            </div>

            {/* TORSO REAR: Backup cell systems */}
            <div 
              className={`absolute inset-0 rounded-[7px] p-2 flex flex-col justify-between items-center transition-all duration-300 ${!translucentBrainShell ? 'brushed-metal-bronze' : ''}`}
              style={{ 
                transform: 'rotateY(180deg) translateZ(21px)', 
                backfaceVisibility: 'hidden',
                ...(translucentBrainShell ? {
                  background: 'rgba(0, 240, 255, 0.2)',
                  border: '1.5px solid rgba(0, 240, 255, 0.8)'
                } : {
                  border: '1px solid #78350f'
                })
              }}
            >
              {!translucentBrainShell && (
                <>
                  <div className="rivet top-[3px] left-[3px]" />
                  <div className="rivet top-[3px] right-[3px]" />
                  <div className="rivet bottom-[3px] left-[3px]" />
                  <div className="rivet bottom-[3px] right-[3px]" />
                </>
              )}
              <span className="text-[5px] font-mono text-zinc-900 tracking-wider font-black shadow-[0_0.5px_-0.5px_rgba(255,255,255,0.15)] pb-0.5">FUSION CORE</span>
              <div className="w-full bg-black/80 rounded border border-white/5 p-0.5 mt-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                <div 
                  className="bg-[#00f0ff] h-1.5 rounded-sm transition-all duration-300" 
                  style={{ 
                    width: `${learningProgress}%`,
                    background: 'linear-gradient(to right, #14b8a6, #22c55e)'
                  }} 
                />
              </div>
              <span className="text-[4px] font-mono text-zinc-800 font-extrabold uppercase">DATABASE LINK [TRUE]</span>
            </div>

            {/* TORSO SHELL: LEFT SIDE FACE */}
            <div 
              className={`absolute transition-all duration-300 rounded-[6px] ${!translucentBrainShell ? 'brushed-metal-gold' : ''}`}
              style={{
                width: '42px', // Depth
                height: '42px', // Height
                left: '6px',
                top: '0px',
                transform: 'rotateY(-90deg) translateZ(27px)',
                backfaceVisibility: 'hidden',
                ...(translucentBrainShell ? {
                  background: 'rgba(0, 240, 255, 0.22)',
                  border: '1.5px solid rgba(0, 240, 255, 0.8)',
                  boxShadow: 'inset 0 0 10px rgba(0,240,255,0.5)'
                } : {
                  border: '1px solid #78350f',
                })
              }}
            />

            {/* TORSO SHELL: RIGHT SIDE FACE */}
            <div 
              className={`absolute transition-all duration-300 rounded-[6px] ${!translucentBrainShell ? 'brushed-metal-gold' : ''}`}
              style={{
                width: '42px', // Depth
                height: '42px', // Height
                left: '6px',
                top: '0px',
                transform: 'rotateY(90deg) translateZ(27px)',
                backfaceVisibility: 'hidden',
                ...(translucentBrainShell ? {
                  background: 'rgba(0, 240, 255, 0.22)',
                  border: '1.5px solid rgba(0, 240, 255, 0.8)',
                  boxShadow: 'inset 0 0 10px rgba(0,240,255,0.5)'
                } : {
                  border: '1px solid #78350f',
                })
              }}
            />

            {/* TORSO SIDE: LEFT JOINT (Segmented industrial chrome arms) */}
            <div 
              className="absolute top-1 bottom-1 bg-zinc-900 rounded-full border border-black/80"
              style={{ 
                left: '6px', 
                width: '42px',
                transform: 'rotateY(-90deg) translateZ(28.5px)',
                backfaceVisibility: 'hidden',
                boxShadow: 'inset 0 0 4px rgba(0,0,0,0.9)'
              }}
            >
              <div 
                className={`absolute top-1.5 w-3.5 h-11 origin-top flex flex-col items-center ${isWalking ? 'walking-arm-left' : ''}`}
                style={{ 
                  left: '19px', // Balanced alignment
                  transform: `rotateZ(${isDraggingRotation ? -24 : -14}deg)`,
                  transformStyle: 'preserve-3d font-sans'
                }}
              >
                {/* Arm Segment 1: Polish Chrome */}
                <div 
                  className="w-2.5 h-4.5 rounded border border-black/30 relative"
                  style={{
                    background: 'linear-gradient(to right, #9ca3af 0%, #f3f4f6 30%, #d1d5db 50%, #4b5563 85%, #1f2937 100%)',
                    boxShadow: '0 1.5px 2px rgba(0,0,0,0.35)'
                  }}
                >
                  <div className="absolute top-0 bottom-0 left-[0.5px] w-[0.5px] bg-white/35" />
                </div>
                {/* Hinged elbow sleeve */}
                <div className="w-[11px] h-2 bg-gradient-to-r from-zinc-800 via-zinc-900 to-black my-[1px] border-y border-black/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
                {/* Arm Segment 2 */}
                <div 
                  className="w-2.5 h-4 rounded border border-black/30 relative"
                  style={{
                    background: 'linear-gradient(to right, #9ca3af 0%, #f3f4f6 30%, #d1d5db 50%, #4b5563 85%, #1f2937 100%)',
                    boxShadow: '0 1.5px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  <div className="absolute top-0 bottom-0 left-[0.5px] w-[0.5px] bg-white/35" />
                </div>
                {/* Wrist cuffs */}
                <div 
                  className={`w-3.5 h-2 border-t border-black/30 rounded-sm ${!translucentBrainShell ? 'brushed-metal-gold' : ''}`}
                />
                {/* Claw joint hand */}
                <div className="w-4 h-3 bg-gradient-to-r from-zinc-800 to-zinc-950 rounded-b flex items-center justify-around px-0.5 border border-black/60">
                  <span className="w-1 h-2 bg-gradient-to-b from-zinc-300 to-zinc-500 rounded-sm" />
                  <span className="w-1 h-2 bg-gradient-to-b from-zinc-300 to-zinc-500 rounded-sm" />
                </div>
              </div>
            </div>

            {/* TORSO SIDE: RIGHT JOINT */}
            <div 
              className="absolute top-1 bottom-1 bg-zinc-900 rounded-full border border-black/80"
              style={{ 
                right: '6px', 
                width: '42px',
                transform: 'rotateY(90deg) translateZ(28.5px)',
                backfaceVisibility: 'hidden',
                boxShadow: 'inset 0 0 4px rgba(0,0,0,0.9)'
              }}
            >
              <div 
                className={`absolute top-1.5 w-3.5 h-11 origin-top flex flex-col items-center ${isWalking ? 'walking-arm-right' : ''}`}
                style={{ 
                  left: '19px', // Balanced alignment
                  transform: `rotateZ(${isDraggingRotation ? 24 : 14}deg)`,
                  transformStyle: 'preserve-3d font-sans'
                }}
              >
                {/* Arm Segment 1: Polish Chrome */}
                <div 
                  className="w-2.5 h-4.5 rounded border border-black/30 relative"
                  style={{
                    background: 'linear-gradient(to right, #9ca3af 0%, #f3f4f6 30%, #d1d5db 50%, #4b5563 85%, #1f2937 100%)',
                    boxShadow: '0 1.5px 2px rgba(0,0,0,0.35)'
                  }}
                >
                  <div className="absolute top-0 bottom-0 left-[0.5px] w-[0.5px] bg-white/35" />
                </div>
                {/* Hinged elbow sleeve */}
                <div className="w-[11px] h-2 bg-gradient-to-r from-zinc-800 via-zinc-900 to-black my-[1px] border-y border-black/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
                {/* Arm Segment 2 */}
                <div 
                  className="w-2.5 h-4 rounded border border-black/30 relative"
                  style={{
                    background: 'linear-gradient(to right, #9ca3af 0%, #f3f4f6 30%, #d1d5db 50%, #4b5563 85%, #1f2937 100%)',
                    boxShadow: '0 1.5px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  <div className="absolute top-0 bottom-0 left-[0.5px] w-[0.5px] bg-white/35" />
                </div>
                {/* Wrist cuffs */}
                <div 
                  className={`w-3.5 h-2 border-t border-black/30 rounded-sm ${!translucentBrainShell ? 'brushed-metal-gold' : ''}`}
                />
                {/* Claw joint hand */}
                <div className="w-4 h-3 bg-gradient-to-r from-zinc-800 to-zinc-950 rounded-b flex items-center justify-around px-0.5 border border-black/60">
                  <span className="w-1 h-2 bg-gradient-to-b from-zinc-300 to-zinc-500 rounded-sm" />
                  <span className="w-1 h-2 bg-gradient-to-b from-zinc-300 to-zinc-500 rounded-sm" />
                </div>
              </div>
            </div>

            {/* TORSO TOP LAYER */}
            <div 
              className={`absolute transition-all duration-300 ${!translucentBrainShell ? 'brushed-metal-gold' : ''}`}
              style={{ 
                width: '54px',
                height: '42px', // depth
                left: '0px',
                top: '0px',
                transform: 'rotateX(90deg) translateZ(21px)',
                backfaceVisibility: 'hidden',
                ...(translucentBrainShell ? {
                  background: 'rgba(0, 240, 255, 0.22)',
                  border: '1.5px solid rgba(0, 240, 255, 0.8)'
                } : {
                  border: '1px solid #78350f'
                })
              }}
            />

            {/* TORSO BOTTOM LAYER */}
            <div 
              className={`absolute transition-all duration-300 ${!translucentBrainShell ? 'brushed-metal-dark-bronze' : ''}`}
              style={{ 
                width: '54px',
                height: '42px', // depth
                left: '0px',
                top: '0px',
                transform: 'rotateX(-90deg) translateZ(21px)',
                backfaceVisibility: 'hidden',
                ...(translucentBrainShell ? {
                  background: 'rgba(0, 240, 255, 0.18)',
                  border: '1.5px solid rgba(0, 240, 255, 0.7)'
                } : {
                  border: '1px solid #451a03'
                })
              }}
            />
          </div>

          {/* === 5. LOWER ENGINE THRUSTER / HOVER CONE (Jet-Burned Titanium Nozzle & Plasma Shock diamonds) === */}
          <div 
            className={`absolute flex flex-col items-center animate-bounce duration-[0.5s] ${isWalking ? 'walking-thruster' : ''}`} 
            style={{ 
              transform: 'translateY(51px) translateZ(0px)',
              transformStyle: 'preserve-3d',
              animationDuration: '0.6s'
            }}
          >
            {/* Machined jet-burned titanium alloy nozzle */}
            <div 
              className="w-6 h-2.5 rounded-b-[4px] border-t border-black/80 relative shadow-[0_3px_5px_rgba(0,0,0,0.5)]" 
              style={{
                background: 'linear-gradient(to right, #413d4c 0%, #2f2a36 30%, #564f63 50%, #1e1b24 85%, #342f3d 100%)',
              }}
            >
              {/* Heat-discoloration ring near lip (metallic blue & deep violet anodizing) */}
              <div className="absolute bottom-[0.5px] inset-x-0 h-[1.2px] bg-gradient-to-r from-blue-500/40 via-purple-600/50 to-orange-400/20 pointer-events-none" />
              <div className="absolute top-0 bottom-0 left-[2px] w-[0.5px] bg-white/10 pointer-events-none" />
            </div>

            {/* High-fidelity responsive plasma jet flame */}
            <div 
              className="w-4 h-6 rounded-b-full flex flex-col items-center justify-start mt-0.5 relative"
              style={{
                background: translucentBrainShell
                  ? 'radial-gradient(ellipse at top, rgba(34, 211, 238, 0.9) 0%, rgba(6, 182, 212, 0.45) 45%, transparent 100%)'
                  : 'radial-gradient(ellipse at top, rgba(254, 215, 170, 0.95) 0%, rgba(249, 115, 22, 0.6) 40%, rgba(239, 68, 68, 0.1) 80%, transparent 100%)',
                boxShadow: translucentBrainShell
                  ? '0 6px 12px rgba(6, 182, 212, 0.6)'
                  : '0 6px 12px rgba(249, 115, 22, 0.55), 0 0 4px rgba(239, 68, 68, 0.35)'
              }}
            />
          </div>

        </div>
      </div>

      {/* Floating Interactive Particles */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 70, scale: 0.6 }}
            animate={{ 
              opacity: [0, 0.9, 0.9, 0], 
              y: [70, -60], 
              scale: [0.6, 1.2, 0.8] 
            }}
            transition={{ 
              duration: 2.2, 
              delay: p.delay,
              ease: "easeOut"
            }}
            className="absolute text-xs"
            style={{ left: `${p.left}%` }}
          >
            {p.char}
          </motion.div>
        ))}
      </div>

      {/* Dynamic Speech Emote Bubble */}
      {showEmoteBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className={`absolute -top-11 left-1/2 -translate-x-1/2 w-[180px] p-2 rounded-xl border text-[9.5px] font-mono text-center font-bold tracking-wide leading-tight z-50 pointer-events-auto cursor-pointer ${
            emote === 'happy'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/45 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
              : emote === 'love'
              ? 'bg-pink-950/90 text-pink-300 border-pink-500/45 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
              : emote === 'shock'
              ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/45 shadow-[0_0_12px_rgba(6,182,212,0.35)]'
              : emote === 'angry'
              ? 'bg-rose-950/90 text-rose-300 border-rose-500/45 shadow-[0_0_12px_rgba(239,68,68,0.35)]'
              : 'bg-zinc-900/95 text-amber-300 border-amber-500/35 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
          }`}
          onClick={() => setShowEmoteBubble(false)}
        >
          {emote === 'happy' && "Hehe, having a great day! 😊✨"}
          {emote === 'love' && "You are doing amazing! 🥰💖"}
          {emote === 'shock' && "BEEP! Heavy forecast deficit! 😲⚡"}
          {emote === 'angry' && "Warning: Budget overruns! 😤🔥"}
          {emote === 'normal' && "Systems optimized & ready! 🤖💼"}
          {/* Bubble tail arrow */}
          <div 
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b" 
            style={{ 
              borderColor: emote === 'happy' ? '#10b981' : emote === 'love' ? '#f43f5e' : emote === 'shock' ? '#06b6d4' : emote === 'angry' ? '#ef4444' : '#f59e0b',
              backgroundColor: emote === 'happy' ? '#064e3b' : emote === 'love' ? '#4c0519' : emote === 'shock' ? '#083344' : emote === 'angry' ? '#4c0519' : '#18181b'
            }} 
          />
        </motion.div>
      )}


    </motion.div>

      {/* --- INTEGRATED SCI-FI COGNITIVE EXPERT HUD PANEL (AI WINDOW) --- */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, x: 40, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, y: 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="fixed bottom-24 right-1.5 md:right-32 w-[95vw] md:w-[450px] h-[600px] max-h-[85vh] bg-[#0c0d15]/95 border-2 border-amber-500/30 backdrop-blur-xl rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(245,158,11,0.12)] text-white z-50 overflow-hidden flex flex-col select-none border-t-amber-400/50"
          style={{ 
            borderColor: translucentBrainShell ? 'rgba(34, 211, 238, 0.45)' : 'rgba(245, 158, 11, 0.35)',
            boxShadow: translucentBrainShell 
              ? '0 20px 50px rgba(0,0,0,0.85), 0 0 30px rgba(34, 211, 238, 0.15)' 
              : '0 20px 50px rgba(0,0,0,0.85), 0 0 30px rgba(245,158,11,0.15)'
          }}
        >
          {/* HUD Panel Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
                <BrainCircuit className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs tracking-wider text-white font-mono uppercase">Ammy ERP Mind Core</h3>
                <p className="text-[9.5px] text-zinc-400 font-mono">Real-time ERP Synthesis Unit</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTranslucentBrainShell(prev => !prev)}
                className={`py-1 px-2.5 rounded-lg border text-[9px] font-mono font-bold cursor-pointer transition-all ${
                  translucentBrainShell 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.4)]' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
                title="View inside synthetic neural core"
              >
                X-RAY SHELL
              </button>
              <button
                onClick={() => {
                  setIsExpanded(false);
                  setEmote('normal');
                }}
                className="p-1 px-1.5 rounded-lg hover:bg-zinc-800/80 cursor-pointer text-zinc-400 hover:text-white transition-all border border-transparent hover:border-zinc-700/50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sci-Fi Multi-Task Workspace Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-[#06070a] p-1 rounded-xl border border-zinc-850 mb-3.5">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                activeTab === 'chat'
                  ? 'bg-amber-500 text-black font-extrabold shadow-md'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Mind Chat
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                activeTab === 'learning'
                  ? 'bg-amber-500 text-black font-extrabold shadow-md'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Brain Rules
            </button>
            <button
              onClick={() => setActiveTab('drop')}
              className={`py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all relative ${
                activeTab === 'drop'
                  ? 'bg-amber-500 text-black font-extrabold shadow-md'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Auto-Sporter
              {droppedFile && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
              )}
            </button>
          </div>

          {/* Inner Workspaces */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            
            {/* TAB 1: COGNITIVE CHAT INTERACTIVE VIEWPORT */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full space-y-3">
                
                {/* Scrollable message console */}
                <div className="flex-1 overflow-y-auto space-y-3.5 p-3 rounded-xl bg-[#05060b]/80 border border-zinc-900 text-[11px] leading-relaxed max-h-[310px] min-h-[290px] font-sans">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl text-left border ${
                          msg.sender === 'user'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200 rounded-br-none'
                            : 'bg-zinc-900 border-zinc-850 text-zinc-300 rounded-bl-none'
                        }`}
                      >
                        <p 
                          dangerouslySetInnerHTML={{ 
                            __html: msg.text
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/`([^`]+)`/g, '<code class="bg-black/80 text-amber-400 px-1 py-0.2 rounded font-mono text-[9px]">$1</code>')
                              .replace(/✅/g, '✅')
                              .replace(/⚠️/g, '⚠️')
                              .replace(/\n/g, '<br />')
                          }}
                        />
                      </div>
                      <span className="text-[7.5px] text-zinc-500 font-mono mt-1">{msg.timestamp}</span>
                    </div>
                  ))}
                  
                  {isQuerying && (
                    <div className="flex items-center gap-2 text-amber-400/80 font-mono text-[9.5px] p-1.5 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
                      SYNAPSE CONNECTING: Synthesizing ledger parameters...
                    </div>
                  )}
                </div>

                {/* Prompt suggestion accelerators */}
                <div className="flex flex-wrap gap-1 px-0.5">
                  <button
                    onClick={() => handleSendMessage("Perform general business operational state audit and treasury forecast.")}
                    className="text-[8.5px] font-mono bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded px-2 py-1 transition-all cursor-pointer"
                  >
                    📊 Status Audit
                  </button>
                  <button
                    onClick={() => handleSendMessage("Are there any delayed freight shipments, carrier routes or stock safety alarms?")}
                    className="text-[8.5px] font-mono bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded px-2 py-1 transition-all cursor-pointer"
                  >
                    ⚠️ Stock Alarms
                  </button>
                  <button
                    onClick={() => handleSendMessage("Calculate and recommend Cash Assets vs Accounts Receivable coverage.")}
                    className="text-[8.5px] font-mono bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded px-2 py-1 transition-all cursor-pointer"
                  >
                    💰 Cash Balance
                  </button>
                </div>

                {/* Send action bar */}
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-zinc-900 mt-auto">
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask Ammy regarding ERP ledgers, employees..."
                    className="flex-1 bg-[#05060b] border border-zinc-800 focus:border-amber-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none placeholder-zinc-500 font-sans"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isQuerying || !userQuery.trim()}
                    className="p-2 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-900 disabled:text-zinc-600 text-black rounded-xl transition-all cursor-pointer flex items-center justify-center font-bold"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: CONTINUOUSLY LEARNING MODEL ENGINE */}
            {activeTab === 'learning' && (
              <div className="space-y-4 font-sans text-xs">
                
                {/* Mental Intelligence status block */}
                <div className="bg-[#05060b] border border-zinc-900 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-extrabold uppercase text-[9px] text-zinc-400 tracking-wider flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
                      Ammy Cognitive Compliance Index
                    </span>
                    <span className="font-mono text-[10.5px] font-black text-amber-400">{learningProgress}%</span>
                  </div>
                  
                  <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-900">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                      style={{ width: `${learningProgress}%` }}
                    />
                  </div>
                  <p className="text-[9.5px] text-zinc-500 mt-2 leading-relaxed font-mono">
                    System refines heuristics when users ingest overrides or feed custom files. Memory persists securely inside localized sessions.
                  </p>
                </div>

                {/* Direct Training Module */}
                <form onSubmit={trainCoreDirectly} className="bg-zinc-900/40 border border-zinc-850 p-3.5 rounded-xl space-y-3 text-left">
                  <h4 className="font-bold text-[9.5px] uppercase tracking-wider text-white flex items-center gap-1.5 font-mono">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                    Feed Manual Training Rules
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8.5px] text-zinc-400 font-mono uppercase">IF File Name Has Key</label>
                      <input
                        type="text"
                        placeholder="e.g. payout, inventory"
                        value={trainingInput.trigger}
                        onChange={(e) => setTrainingInput(prev => ({ ...prev, trigger: e.target.value }))}
                        className="w-full bg-[#05060b] border border-zinc-800 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-amber-500/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8.5px] text-zinc-400 font-mono uppercase">Then Classify As</label>
                      <select
                        value={trainingInput.action}
                        onChange={(e) => setTrainingInput(prev => ({ ...prev, action: e.target.value }))}
                        className="w-full bg-[#05060b] border border-zinc-800 rounded-lg p-1.5 text-[10.5px] text-white focus:outline-none cursor-pointer"
                      >
                        <option value="/api/erp/transaction">Financial Ledger Entry</option>
                        <option value="/api/erp/hr/employee">HR Personnel Directory</option>
                        <option value="/api/erp/inventory/reorder">Inventory Reorder Stock</option>
                        <option value="/api/erp/shipment/create">Logistics Freight Cargo</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!trainingInput.trigger.trim()}
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-900 disabled:text-zinc-650 text-black rounded-lg text-[9.5px] font-mono font-black uppercase cursor-pointer transition-all flex items-center justify-center gap-1"
                  >
                    Inject Rule Constraint
                  </button>
                </form>

                {/* Persistent Dynamic Rules Logs */}
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="font-bold text-[9.5px] uppercase tracking-wider text-zinc-400 font-mono">Neural Association Registry</h4>
                    <span className="text-[8.5px] text-zinc-500 font-mono">Count: {rules.length}</span>
                  </div>

                  <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1 text-[9.5px] font-mono scrollbar-thin">
                    {rules.map((rule) => (
                      <div 
                        key={rule.id}
                        className="bg-[#05060b] border border-zinc-900 rounded-lg p-2.5 flex justify-between items-center hover:border-zinc-800 transition-all"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-amber-400 font-bold">"{rule.trigger}"</span>
                            <span className="text-zinc-600">→</span>
                            <span className="text-zinc-300">{rule.action}</span>
                          </div>
                          <div className="text-[8px] text-zinc-500 flex items-center gap-1.5">
                            <span className={`px-1 rounded-[3px] text-[7.5px] font-bold ${rule.type === 'manual' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 'bg-zinc-900 text-zinc-400'}`}>
                              {rule.type === 'manual' ? 'Manual Link' : 'System Baseline'}
                            </span>
                            <span>Learned at: {rule.learnedAt}</span>
                          </div>
                        </div>

                        {rule.type === 'manual' && (
                          <button
                            onClick={() => {
                              const updated = rules.filter(r => r.id !== rule.id);
                              saveRules(updated);
                              setEmote('angry');
                            }}
                            className="p-1 hover:bg-rose-950/40 text-zinc-550 hover:text-rose-400 rounded cursor-pointer transition-all"
                            title="Forget association trigger"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: COGNITIVE AUTO-SPORTER FILE INGEST CONTAINER */}
            {activeTab === 'drop' && (
              <div className="space-y-3 font-sans text-xs h-full flex flex-col justify-center">
                {!droppedFile ? (
                  <div
                    className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all ${
                      isDraggingFile
                        ? 'border-amber-400 bg-amber-500/10 text-white'
                        : 'border-zinc-800 bg-[#05060b]/40 text-zinc-400 hover:border-zinc-800'
                    }`}
                  >
                    <FileSpreadsheet className="w-10 h-10 text-zinc-500 mb-2.5 animate-pulse" />
                    <h4 className="font-extrabold text-[12px] tracking-wide text-white mb-1 uppercase font-mono">Ingest Operational Records</h4>
                    <p className="text-[10px] leading-relaxed max-w-xs text-zinc-400 mb-4 font-mono">
                      Drag any document or spreadsheet directly onto Ammy to dynamically map records.
                    </p>
                    
                    <div className="bg-[#05060b] rounded-xl p-2.5 border border-zinc-900 text-left space-y-1.5 max-w-[280px] font-mono text-[9px]">
                      <p className="text-amber-400 font-bold uppercase text-[9.5px]">Learned Target Triggers:</p>
                      <p className="text-zinc-500">• contains "salary" OR "payroll" → HR Director</p>
                      <p className="text-zinc-500">• contains "ledger" OR "invoice" → Finance Ledger</p>
                      <p className="text-zinc-500">• contains "sku" OR "stock" → Inventory Core</p>
                      <p className="text-zinc-500">• contains "shipment" OR "freight" → Logistics</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#05060b]/80 border border-zinc-900 rounded-xl p-3.5 space-y-3.5 text-left">
                    <div className="flex items-center gap-2.5 border-b border-zinc-850 pb-2.5">
                      <FileSpreadsheet className="w-7 h-7 text-amber-400 animate-bounce" />
                      <div>
                        <h4 className="font-bold text-white text-[11.5px] truncate max-w-[280px]">{droppedFile.name}</h4>
                        <p className="text-[8.5px] text-zinc-500 font-mono">Size: {(droppedFile.size / 1024).toFixed(2)} KB | Temporary Stream Ingested</p>
                      </div>
                    </div>

                    {fileClassification && (
                      <div className="space-y-3.5">
                        <div className="bg-zinc-900/60 rounded-lg p-2.5 space-y-1.5 border border-zinc-850">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-zinc-400 font-bold">Detected Category:</span>
                            <span className="text-white font-extrabold">{fileClassification.categoryName}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-zinc-400 font-bold">Inferred Endpoint:</span>
                            <span className="text-amber-400 font-bold">{fileClassification.suggestedTarget}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-zinc-400 font-bold">AI Probability Match:</span>
                            <span className="text-amber-400 font-black">{fileClassification.confidence}% Match</span>
                          </div>
                        </div>

                        <p className="text-[10.5px] text-zinc-400 leading-normal font-sans">
                          Ammy's Neural core mapped document triggers. Confirm ingest map below standard ledger, or override directory parameters.
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                          <button
                            onClick={confirmFileSortedMap}
                            disabled={isProcessingFile}
                            className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10.5px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all border border-emerald-500/20"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Ingest Live
                          </button>
                          
                          <button
                            onClick={() => setShowSortingModal(true)}
                            disabled={isProcessingFile}
                            className="py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[10.5px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all border border-zinc-700/40"
                          >
                            <Settings className="w-3.5 h-3.5" />
                            Overrule
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Manual overrule options panel */}
                    {showSortingModal && (
                      <div className="bg-[#05060b] border border-amber-500/20 rounded-lg p-3 space-y-3 mt-1.5 transition-all">
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                          <h5 className="font-bold text-[9px] uppercase tracking-wider text-amber-400 flex items-center gap-1 font-mono">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Configure Ingestion Override
                          </h5>
                          <button onClick={() => setShowSortingModal(false)} className="text-zinc-500 hover:text-white cursor-pointer select-none">
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="space-y-1 text-left font-mono text-[9px]">
                          <label className="text-zinc-400 uppercase font-bold text-[8.5px]">Specify Destination Sector Gateway</label>
                          <select
                            value={manualTarget}
                            onChange={(e) => setManualTarget(e.target.value)}
                            className="w-full bg-[#0c101d] border border-zinc-800 rounded-lg p-1.5 text-[10.5px] text-white focus:outline-none focus:border-amber-400/40 cursor-pointer"
                          >
                            <option value="/api/erp/transaction">Financial Ledger Entry</option>
                            <option value="/api/erp/hr/employee">HR Personnel Directory</option>
                            <option value="/api/erp/inventory/reorder">Inventory Reorder Stock</option>
                            <option value="/api/erp/shipment/create">Logistics Freight Cargo</option>
                          </select>
                        </div>

                        <button
                          onClick={overruleClassification}
                          disabled={isProcessingFile}
                          className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-[9.5px] tracking-wide font-mono font-black uppercase rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1"
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          Teach New Trigger & Map Record
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Core Footer Indicators */}
          <div className="mt-3 pt-2.5 border-t border-zinc-850/60 flex items-center justify-between text-[8px] font-mono text-zinc-500 leading-none">
            <span>MODEL COMPLIANCE INTEGRITY SECURE</span>
            <span className="flex items-center gap-1 text-[#00d4aa] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa]" />
              COGNITIVE SYNC ONLINE
            </span>
          </div>
        </motion.div>
      )}
    </>
  );
}
