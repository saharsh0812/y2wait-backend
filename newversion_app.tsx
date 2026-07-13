import React, { useState, useEffect } from 'react';
import { 
  Truck, User, ShieldCheck, MapPin, ArrowRight, 
  Bot, X, Upload, CheckCircle2, 
  Layers, HelpCircle, Radio, Menu, Crown, 
  History, LogOut, Settings, PhoneCall, 
  Info, Camera, Bus, ShoppingBag, Building, 
  AlertTriangle, Package, Clock, QrCode, TrendingDown, 
  Activity, ArrowLeft, ChevronDown, 
  Star, PlayCircle, Lock, Search, Flame, Eye, Box, Send, Plus, Check
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
type Role = 'driver' | 'transporter' | 'trader' | 'corporate' | null;
type View = 'landing' | 'dashboard' | 'premium' | 'history' | 'support' | 'settings' | 'about' | 'services' | 'safe_qr' | 'feature_detail' | 'contact';
type ModuleTab = 'freight' | 'bus_cargo' | 'mandi' | 'ads' | 'corporate';
type ListingTab = 'all' | 'my_listings' | 'command_center';

// --- CONSTANTS & MOCK DATA ---
const parallelHeaders = [
  { id: 0, url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1600", title: "Outstation Fleet Hub", subtitle: "Connecting outstation trucks with high-value loads in real-time.", tag: "LIVE RADAR", btn1: "Request Demo", btn2: "Join Network" },
  { id: 1, url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1600", title: "Bus Parcel Network", subtitle: "Ship small parcels between cities using our reliable inter-city Volvo network.", tag: "EXPRESS CARGO", btn1: "Request Demo", btn2: "Join Network" },
  { id: 2, url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1600", title: "Enterprise Bidding", subtitle: "Simplified logistics and reverse bidding for businesses of all sizes.", tag: "CORPORATE", btn1: "Learn More", btn2: "Join Network" },
  { id: 3, url: "https://images.unsplash.com/photo-1635767798638-3e2523d06eb1?auto=format&fit=crop&q=80&w=1600", title: "Fleet Mandi Deals", subtitle: "Group buying discounts on engine oil, tires, and essential parts.", tag: "GROUP BUY", btn1: "Learn More", btn2: "Join Network" },
  { id: 4, url: "https://images.unsplash.com/photo-1596733246337-3375c378e907?auto=format&fit=crop&q=80&w=1600", title: "Road Safety AI", subtitle: "AI-powered solutions to prevent accidents and protect your fleet.", tag: "AI SAFETY", btn1: "Learn More", btn2: "Join Network" },
  { id: 5, url: "https://images.unsplash.com/photo-1586528116311-ad8ed7b66bfc?auto=format&fit=crop&q=80&w=1600", title: "Secure Safe QR", subtitle: "Save police checking time and process smoothly avoiding scams.", tag: "SECURITY", btn1: "Learn More", btn2: "Join Network" },
];

const platformFeatures = [
  { id: 1, url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1600", title: "Enterprise Bidding", subtitle: "Experience zero-commission loads and simplified logistics for businesses.", tag: "CORPORATE" },
  { id: 2, url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1600", title: "Bus Parcel Delivery", subtitle: "Ship small parcels between cities using our reliable inter-city Volvo network.", tag: "NETWORK" },
  { id: 3, url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1600", title: "Highway Freight Hub", subtitle: "Zero-commission loads for outstation fleets. Maximize your earnings.", tag: "FREIGHT" },
  { id: 4, url: "https://images.unsplash.com/photo-1586528116311-ad8ed7b66bfc?auto=format&fit=crop&q=80&w=1600", title: "Safe Traffic QR", subtitle: "One scan for Police checks. No physical papers. Absolute peace of mind.", tag: "SECURITY" },
];

const mandiProducts = [
  { id: 1, name: "Premium Synthetic Engine Oil", type: "Lubricants", price: "4,500", tag: "OEM Certified", stock: "In Stock", img: "https://images.unsplash.com/photo-1635767798638-3e2523d06eb1?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "MRF Heavy Commercial Radial", type: "Tires", price: "18,500", tag: "Heavy Duty", stock: "In Stock", img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Tata Signa Brake Pads Set", type: "Spare Parts", price: "3,200", tag: "Genuine Part", stock: "In Stock", img: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&q=80&w=400" },
  { id: 4, type: "Electricals", name: "Exide Heavy Duty Fleet Battery", price: "14,000", tag: "Warranty", stock: "Few Left", img: "https://images.unsplash.com/photo-1528659105436-1e612a201c13?auto=format&fit=crop&q=80&w=400" }
];

export default function App() {
  // --- APP STATE ---
  const [activeView, setActiveView] = useState<View>('landing');
  const [activeModule, setActiveModule] = useState<ModuleTab>('freight');
  const [listingTab, setListingTab] = useState<ListingTab>('all');
  const [busTab, setBusTab] = useState<ListingTab>('all');
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [language, setLanguage] = useState<'en'|'hi'>('en'); 
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [demoText, setDemoText] = useState("");
  const [heroIdx, setHeroIdx] = useState(0);
  
  const [platformStats, setPlatformStats] = useState({ trucks: 0, parcels: 0, verified: 0, cities: 0 });

  const t = (en: string, hi: string) => language === 'en' ? en : hi;

  // --- AUTH STATE (Passwordless + Split Screen) ---
  const [authModal, setAuthModal] = useState<{ open: boolean; step: 'role' | 'auth_choice' | 'login_pass' | 'register_otp' | 'forgot_otp' | 'kyc' }>({ open: false, step: 'role' });
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [user, setUser] = useState<any>({ firstName: '', lastName: '', mobile: '', email: '', password: '', businessName: '', gst: '', dl: '', dp: '' });
  const [otpVal, setOtpVal] = useState('');

  // --- MODULE STATES ---
  const [bookingStep, setBookingStep] = useState<number>(1); 
  const [expandedListingId, setExpandedListingId] = useState<string | null>(null);
  const [safetyEnabled, setSafetyEnabled] = useState<boolean>(false);
  
  // Real-time Filters
  const [freightSearch, setFreightSearch] = useState('');
  const [freightCapacityFilter, setFreightCapacityFilter] = useState('');
  const [busSearch, setBusSearch] = useState('');
  const [busTypeFilter, setBusTypeFilter] = useState('');
  
  // Live Data Repositories
  const [driversList, setDriversList] = useState<any[]>([
    { id: 'TRK-1029', origin: 'Mumbai, MH', destination: 'Delhi, DL', capacity: '20', charges: 45000, type: 'Container', driverName: 'Rajesh Kumar', isMine: false, dp: '', truckImg: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400' },
    { id: 'TRK-2022', origin: 'Chennai, TN', destination: 'Kolkata, WB', capacity: '16', charges: 38000, type: 'Open Body', driverName: 'Vikram Singh', isMine: false, dp: '', truckImg: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=400' }
  ]);
  const [loadsList, setLoadsList] = useState<any[]>([{ id: 'LOD-9921', origin: 'Patna, BR', destination: 'Kolkata, WB', weight: '15', targetPrice: 32000, material: 'Textiles', companyName: 'Vikas Traders', isMine: false }]);
  const [busSpaceList, setBusSpaceList] = useState<any[]>([
    { id: 'BUS-110', operator: 'Shatabdi Volvo', route: 'Delhi - Jaipur', capacity: '100 KG Space', price: 15, isMine: false, busImg: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400', serviceType: 'Express' },
    { id: 'BUS-215', operator: 'Govt Transport', route: 'Patna - Ranchi', capacity: '50 KG Space', price: 10, isMine: false, busImg: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400', serviceType: 'Standard' }
  ]); 
  const [corporateBids, setCorporateBids] = useState<any[]>([
    { id: '#54321', company: 'Constry Materials', demand: '200 Ton', route: 'Patna - Ranchi', L1: 45000, time: '02h 45m 10s' }
  ]);
  
  // Forms
  const [newTruck, setNewTruck] = useState<any>({ origin: '', dest: '', capacity: '', charges: '', vehicleNumber: '' });
  const [newLoad, setNewLoad] = useState<any>({ material: '', weight: '', origin: '', destination: '', targetPrice: '' });
  const [newBus, setNewBus] = useState<any>({ route: '', serviceType: 'Standard', price: '', vehicleNumber: '', capacity: '', productType: '', weight: '' }); 
  const [newBid, setNewBid] = useState<any>({ demand: '', route: '', initialL1: '' });
  
  // Safe QR state
  const [qrDocs, setQrDocs] = useState<any>({ dl: false, rc: false, ins: false, permit: false });
  const [uploadedFiles, setUploadedFiles] = useState<any>({});
  const allDocsUploaded = qrDocs.dl && qrDocs.rc && qrDocs.ins && qrDocs.permit;

  const [negotiationTarget, setNegotiationTarget] = useState<any>(null);
  const [counterOffer, setCounterOffer] = useState<string>('');

  // --- REAL-TIME FEED FILTER LOGIC ---
  const safeLoads = Array.isArray(loadsList) ? loadsList : [];
  const safeDrivers = Array.isArray(driversList) ? driversList : [];
  const safeBids = Array.isArray(corporateBids) ? corporateBids : [];
  const safeBuses = Array.isArray(busSpaceList) ? busSpaceList : [];
  
  const combinedFeed = [...safeLoads, ...safeDrivers].filter((item: any) => {
    const originMatch = freightSearch === '' || (item.origin || item.currentLoc || '').toLowerCase().includes(freightSearch.toLowerCase());
    const destMatch = freightSearch === '' || (item.destination || item.destLoc || '').toLowerCase().includes(freightSearch.toLowerCase());
    if (freightSearch && !originMatch && !destMatch) return false;
    if (freightCapacityFilter && item.capacity !== freightCapacityFilter && item.weight !== freightCapacityFilter) return false;
    return listingTab === 'all' ? !item.isMine : item.isMine;
  });

  const filteredBusFeed = safeBuses.filter((item: any) => {
    if (busSearch && !(item.route || '').toLowerCase().includes(busSearch.toLowerCase())) return false;
    if (busTypeFilter && item.serviceType !== busTypeFilter) return false;
    return busTab === 'all' ? !item.isMine : item.isMine;
  });

  const myActiveItem = combinedFeed.find((i: any) => i.isMine) || safeBuses.find((i: any) => i.isMine);
  const originLabel = myActiveItem ? (myActiveItem.origin || myActiveItem.currentLoc || (myActiveItem.route ? myActiveItem.route.split('-')[0] : 'Origin')) : 'Origin';
  const destLabel = myActiveItem ? (myActiveItem.destination || myActiveItem.destLoc || (myActiveItem.route ? myActiveItem.route.split('-')[1] : 'Destination')) : 'Destination';

  // --- EFFECTS ---
  useEffect(() => { setBookingStep(1); }, [activeModule, selectedRole, listingTab, busTab]);

  useEffect(() => {
    const slideTimer = setInterval(() => { setHeroIdx((prev) => (prev + 1) % parallelHeaders.length); }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    if (showDemo) {
      const texts = ["Initializing AI Engine...", "Scanning identity...", "Connecting Radar Grid...", "Ready. Welcome to the future."];
      let i = 0; setDemoText(texts[0]);
      const int = setInterval(() => { i++; if (i < texts.length) setDemoText(texts[i]); else clearInterval(int); }, 2000);
      return () => clearInterval(int);
    }
  }, [showDemo]);

  // --- ACTIONS ---
  const handlePageChange = (view: View) => { setActiveView(view); window.scrollTo(0,0); setDrawerOpen(false); };

  const handleMobileSubmit = () => {
    if (user.mobile.length !== 10) return;
    if (user.mobile === '8210160012') {
      setAuthModal({ open: true, step: 'login_pass' });
    } else {
      setAuthModal({ open: true, step: 'register_otp' });
    }
  };

  const executeLogin = () => { setIsLoggedIn(true); setAuthModal({ open: false, step: 'role' }); handlePageChange('dashboard'); };

  const handleLogout = () => { setIsLoggedIn(false); setUser({ firstName: '', lastName: '', mobile: '', email: '', password: '', businessName: '', gst: '', dl: '', dp: '' }); setSelectedRole(null); handlePageChange('landing'); };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setUser({ ...user, dp: URL.createObjectURL(e.target.files[0]) });
  };
  
  const handleFileUpload = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setUploadedFiles({ ...uploadedFiles, [type]: e.target.files[0].name });
        if (type === 'dl') setQrDocs({...qrDocs, dl: true});
        if (type === 'rc') setQrDocs({...qrDocs, rc: true});
        if (type === 'ins') setQrDocs({...qrDocs, ins: true});
        if (type === 'permit') setQrDocs({...qrDocs, permit: true});
    }
  };

  const openWhatsApp = (msg: string) => { window.open(`https://wa.me/918210160012?text=${encodeURIComponent(msg)}`, '_blank'); };

  const processBid = () => {
     if (Number(counterOffer) >= (negotiationTarget?.data?.L1 || 0)) return alert(t("Bid must be lower than current L1 price!", "बोली वर्तमान L1 कीमत से कम होनी चाहिए!"));
     const updatedBids = corporateBids.map((b: any) => b.id === negotiationTarget?.data?.id ? { ...b, L1: Number(counterOffer) } : b);
     setCorporateBids(updatedBids); setNegotiationTarget(null); setCounterOffer('');
     alert(t("Bid Placed Successfully! You are now L1.", "बोली सफलतापूर्वक लगाई गई!"));
  };

  const handlePostTruck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTruck.origin) return;
    const created = { id: `TRK-${Math.floor(1000 + Math.random() * 9000)}`, driverName: user.firstName || 'Driver', phone: user.mobile, dp: user.dp, currentLoc: newTruck.origin, destLoc: newTruck.dest, capacity: newTruck.capacity || '16', charges: Number(newTruck.charges) || 50000, status: 'Booked', type: 'Open Body', isMine: true, truckImg: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400' };
    setDriversList([created, ...driversList]); setPlatformStats((prev: any) => ({...prev, trucks: prev.trucks + 1, cities: prev.cities + 2})); setListingTab('my_listings'); setNewTruck({ origin: '', dest: '', capacity: '', charges: '', vehicleNumber: '' }); setBookingStep(1);
  };

  const handlePostLoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoad.origin) return;
    const loadPayload = { id: `LOD-${Date.now()}`, companyName: user.businessName || `${user.firstName}'s Enterprise`, phone: user.mobile, dp: user.dp, material: newLoad.material, weight: newLoad.weight, origin: newLoad.origin, destination: newLoad.destination, targetPrice: Number(newLoad.targetPrice), status: 'Booked', isMine: true };
    setLoadsList([loadPayload, ...loadsList]); setPlatformStats((prev: any) => ({...prev, parcels: prev.parcels + 1, cities: prev.cities + 2})); setListingTab('my_listings'); setNewLoad({ material: '', weight: '', origin: '', destination: '', targetPrice: '' }); setBookingStep(1);
  };

  const handlePostBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBus.route) return alert(t("Please enter Route.", "कृपया रूट डालें।"));
    const isDriver = selectedRole === 'driver' || selectedRole === 'transporter';
    const capacityText = isDriver ? `${newBus.capacity} Space` : `${newBus.productType} (${newBus.weight} KG)`;
    
    const busPayload = { 
      id: `BUS-${Math.floor(Math.random() * 9000)}`, 
      operator: user.businessName || user.firstName || 'Travels', 
      phone: user.mobile, 
      dp: user.dp, 
      route: newBus.route, 
      capacity: capacityText, 
      price: Number(newBus.price) || 500, 
      isMine: true, 
      serviceType: newBus.serviceType || 'Standard', 
      busImg: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400' 
    };
    setBusSpaceList([busPayload, ...busSpaceList]); setNewBus({ route: '', serviceType: 'Standard', price: '', vehicleNumber: '', capacity: '', productType: '', weight: '' }); setBusTab('my_listings'); setBookingStep(1);
  };

  const handlePostBid = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newBid.demand) return;
    const created = { id: `#${Math.floor(10000 + Math.random() * 90000)}`, company: user.businessName || 'Corporate', demand: newBid.demand, route: newBid.route, L1: Number(newBid.initialL1) || 50000, time: '7 Days Left', l1Holder: 'Awaiting Bids' };
    setCorporateBids([created, ...corporateBids]); setNewBid({ demand: '', route: '', initialL1: '' });
  };

  const handleKycSubmit = () => {
    if(!user.firstName) return alert("Required fields missing!");
    setUser({ ...user, isVerified: true }); 
    setPlatformStats((prev: any) => ({...prev, verified: prev.verified + 1}));
    executeLogin();
  };

  // --- REUSABLE COMPONENTS ---
  const BackToDashboardBtn = () => (
    <div className="mb-8 w-full max-w-[1600px] mx-auto px-4 sm:px-8 relative z-20 text-left">
      <button type="button" onClick={() => handlePageChange(isLoggedIn ? 'dashboard' : 'landing')} className="flex items-center text-[#EA580C] font-black bg-[#0F172A] px-6 py-3 rounded-xl shadow-xl w-fit group hover:bg-black transition-all border border-slate-800">
        <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" /> {t("Back to Main Screen", "मुख्य स्क्रीन पर वापस")}
      </button>
    </div>
  );

  const LayeredStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-8 max-w-lg mx-auto">
      <div className={`flex items-center ${bookingStep >= 1 ? 'text-[#EA580C] font-black' : 'text-slate-400 font-medium'}`}><span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm mr-2 ${bookingStep >= 1 ? 'bg-[#EA580C] text-white shadow-md' : 'bg-slate-100'}`}>1</span><span className="text-sm">Location</span></div>
      <div className={`h-0.5 w-8 sm:w-16 ${bookingStep >= 2 ? 'bg-[#EA580C]' : 'bg-slate-200'}`}></div>
      <div className={`flex items-center ${bookingStep >= 2 ? 'text-[#EA580C] font-black' : 'text-slate-400 font-medium'}`}><span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm mr-2 ${bookingStep >= 2 ? 'bg-[#EA580C] text-white shadow-md' : 'bg-slate-100'}`}>2</span><span className="text-sm">Details</span></div>
      <div className={`h-0.5 w-8 sm:w-16 ${bookingStep >= 3 ? 'bg-[#EA580C]' : 'bg-slate-200'}`}></div>
      <div className={`flex items-center ${bookingStep >= 3 ? 'text-[#EA580C] font-black' : 'text-slate-400 font-medium'}`}><span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm mr-2 ${bookingStep >= 3 ? 'bg-[#EA580C] text-white shadow-md' : 'bg-slate-100'}`}>3</span><span className="text-sm">Confirm</span></div>
    </div>
  );

  const renderLiveRadar = () => (
    <div className="w-full bg-[#0F172A] border border-slate-800 rounded-[2rem] p-8 shadow-2xl animate-fade-in mt-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#EA580C] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center"><MapPin className="h-6 w-6 text-[#EA580C] mr-2" /> Live Command Radar</h2>
          <p className="text-sm text-slate-400 mt-1 font-medium">Real-time GPS positioning on Grid</p>
        </div>
        <button type="button" onClick={() => setSafetyEnabled(!safetyEnabled)} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg ${safetyEnabled ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
          <AlertTriangle className="h-4 w-4 inline mr-2"/> Road Safety: {safetyEnabled ? 'ON' : 'OFF'}
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        <div className="flex-[2] relative rounded-[1.5rem] overflow-hidden bg-[#000000] shadow-inner border border-slate-800 h-[450px]">
           {safetyEnabled && (
             <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md p-8 flex flex-col items-center justify-center text-center">
                <AlertTriangle className="h-20 w-20 text-red-500 mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                <h3 className="text-4xl font-black text-red-500 mb-4 tracking-tight">High Risk Zone</h3>
                <p className="text-slate-300 text-lg font-bold mb-8">Alert on route to {destLabel}. 3 Fatal Accidents in 48 Hrs.<br/>Foggy conditions ahead.</p>
                <button type="button" onClick={() => setSafetyEnabled(false)} className="bg-red-600 text-white px-10 py-4 rounded-xl text-base font-black hover:bg-red-700 shadow-xl">Acknowledge</button>
             </div>
           )}

           <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
             <div className="border border-teal-500/20 rounded-full w-[100%] h-[100%] absolute animate-ping" style={{animationDuration: '4s'}}></div>
             <div className="border border-teal-500/30 rounded-full w-[70%] h-[70%] absolute"></div>
             <div className="border border-teal-500/50 rounded-full w-[40%] h-[40%] absolute"></div>
             <div className="w-4 h-4 bg-[#EA580C] rounded-full absolute shadow-[0_0_20px_#EA580C]"></div>
             
             {myActiveItem ? (
               <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 800 600">
                   <path d="M 200 300 Q 400 100 600 300" fill="transparent" stroke="#EA580C" strokeWidth="2" strokeDasharray="6 6" className="animate-pulse opacity-60" />
                   <circle cx="200" cy="300" r="8" fill="#EA580C" />
                   <text x="170" y="330" fill="#94A3B8" fontSize="14" fontWeight="bold">{originLabel}</text>
                   <circle cx="600" cy="300" r="8" fill="#EA580C" className="animate-ping" />
                   <circle cx="600" cy="300" r="6" fill="#EA580C" />
                   <text x="570" y="330" fill="#94A3B8" fontSize="14" fontWeight="bold">{destLabel}</text>
                   <g className="animate-truck-move-dynamic">
                      <rect x="-20" y="-10" width="40" height="20" fill="#EA580C" rx="4" />
                   </g>
               </svg>
             ) : (
               <div className="text-slate-500 font-bold z-10 bg-slate-900/80 px-6 py-3 rounded-xl border border-slate-800">Scanning active fleet grid...</div>
             )}
           </div>

           {myActiveItem && (
             <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur p-5 rounded-2xl border border-slate-700 w-80 z-20 shadow-2xl">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Active Trip Telemetry</h4>
               <div className="flex justify-between items-center mb-3">
                 <span className="font-black text-white truncate max-w-[40%] text-base">{originLabel}</span>
                 <ArrowRight className="h-5 w-5 text-slate-500" />
                 <span className="font-black text-white truncate max-w-[40%] text-base">{destLabel}</span>
               </div>
               <div className="text-[10px] text-teal-400 font-black flex items-center mt-4 bg-teal-500/10 w-fit px-3 py-1.5 rounded-lg border border-teal-500/20">
                 <Radio className="h-4 w-4 mr-2 animate-pulse" /> GPS Connection Active
               </div>
             </div>
           )}
        </div>

        <div className="flex-1 flex flex-col gap-6">
           <div className="bg-black p-8 rounded-[1.5rem] border border-slate-800 shadow-inner flex-1">
              <h4 className="text-white font-black text-base mb-8">Tracking Timeline</h4>
              <div className="relative border-l-2 border-slate-800 ml-5 space-y-10 pb-4">
                 <div className="relative">
                   <div className="absolute -left-[25px] bg-black p-1"><CheckCircle2 className="h-6 w-6 text-emerald-500" /></div>
                   <div className="pl-6">
                     <h4 className="font-black text-white text-base">Booked</h4>
                     <p className="text-xs text-slate-500 font-bold">Order Confirmed</p>
                   </div>
                 </div>
                 <div className="relative">
                   <div className="absolute -left-[25px] bg-black p-1"><Truck className="h-6 w-6 text-[#EA580C]" /></div>
                   <div className="pl-6">
                     <h4 className="font-black text-white text-base">Picked Up</h4>
                     <p className="text-xs text-slate-500 font-bold">Package Loaded</p>
                   </div>
                 </div>
                 <div className="relative">
                   <div className="absolute -left-[25px] bg-black p-1"><Radio className="h-6 w-6 text-teal-400 animate-pulse" /></div>
                   <div className="pl-6">
                     <h4 className="font-black text-teal-400 text-base">In Transit</h4>
                     <p className="text-xs text-slate-500 font-bold">Current Location</p>
                   </div>
                 </div>
                 <div className="relative">
                   <div className="absolute -left-[25px] bg-black p-1"><Package className="h-6 w-6 text-slate-700" /></div>
                   <div className="pl-6 bg-slate-900 p-4 rounded-xl border border-slate-800">
                     <h4 className="font-black text-slate-400 text-base">Shipped</h4>
                     <p className="text-xs text-slate-600 font-bold">Pending Arrival</p>
                   </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#EA580C] selection:text-white flex flex-col overflow-x-hidden relative">
      
      {/* 🇮🇳 REAL INDIA MAP WATERMARK (No Text, Just the SVG Outline) */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0F172A] opacity-5"></div>
        <img 
           src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Outline_Map_of_India.svg" 
           alt="" 
           className="w-[90%] max-w-5xl h-auto opacity-[0.06] filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] mix-blend-multiply"
        />
      </div>

      {/* --- HEADER --- */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handlePageChange('landing')}>
            <Truck className="h-8 w-8 text-[#EA580C]" />
            <span className="text-2xl font-black tracking-tight text-[#0F172A]">Load<span className="text-[#EA580C]">Bhai</span></span>
          </div>

          <nav className="hidden lg:flex space-x-8 text-sm font-black text-slate-700">
            {[{v: 'landing', e: 'HOME', h: 'होम'}, {v: 'about', e: 'ABOUT US', h: 'हमारे बारे में'}, {v: 'services', e: 'SERVICES', h: 'सेवाएं'}, {v: 'premium', e: 'PRICING', h: 'कीमत'}, {v: 'contact', e: 'CONTACT', h: 'संपर्क करें'}].map((page: any) => (
                <button type="button" key={page.v} onClick={() => handlePageChange(page.v as View)} className={`hover:text-[#EA580C] transition-colors uppercase tracking-wide ${activeView === page.v ? 'text-[#EA580C]' : ''}`}>{t(page.e, page.h)}</button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button type="button" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="flex bg-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 border border-slate-200 shadow-sm">
              🌐 {language === 'en' ? 'EN' : 'HI'} <ChevronDown className="h-3 w-3 ml-1"/>
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                 <button type="button" onClick={() => handlePageChange('dashboard')} className="text-sm font-black text-[#EA580C] hidden sm:block border border-[#EA580C] bg-orange-50 px-5 py-2.5 rounded-xl hover:bg-[#EA580C] hover:text-white transition-colors shadow-md">Dashboard</button>
                 <div className="h-11 w-11 bg-slate-200 rounded-full cursor-pointer flex items-center justify-center overflow-hidden border-2 border-[#0F172A] shadow-md hover:scale-105 transition-transform" onClick={() => setDrawerOpen(true)}>
                   {user.dp ? <img src={user.dp} className="h-full w-full object-cover" alt=""/> : <User className="h-6 w-6 text-slate-500" />}
                 </div>
              </div>
            ) : (
              <>
                <button type="button" onClick={() => setAuthModal({ open: true, step: 'role' })} className="bg-[#0F172A] text-white px-7 py-3 rounded-xl font-black text-sm hover:bg-slate-800 transition-colors shadow-lg">
                  Login / Register
                </button>
                <button type="button" className="lg:hidden text-slate-600" onClick={() => setDrawerOpen(true)}><Menu className="h-7 w-7" /></button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* --- DRAWER (Profile & Settings) --- */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[150] flex">
          <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm" onClick={() => setDrawerOpen(false)}></div>
          <div className="relative w-80 bg-white h-full shadow-2xl flex flex-col animate-fade-in-right z-50 border-l border-slate-100">
            {isLoggedIn ? (
              <>
                <div className="p-10 border-b border-slate-100 flex flex-col items-center bg-slate-50 relative">
                   <button type="button" onClick={() => setDrawerOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-white p-2 rounded-lg border shadow-sm"><X className="h-5 w-5"/></button>
                   <label className="h-28 w-28 rounded-full bg-slate-200 mb-4 border-4 border-[#0F172A] flex items-center justify-center overflow-hidden cursor-pointer group relative shadow-inner">
                     {user.dp ? <img src={user.dp} className="h-full w-full object-cover" alt=""/> : <User className="h-12 w-12 text-slate-400"/>}
                     <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center"><Camera className="h-8 w-8 text-white"/></div>
                     <input type="file" className="hidden" onChange={handleProfilePicUpload} accept="image/*"/>
                   </label>
                   <h3 className="font-black text-2xl text-slate-900">{user.firstName || 'Partner'}</h3>
                   <span className="text-xs font-black bg-[#EA580C] text-white px-4 py-1.5 rounded-full uppercase mt-2.5 shadow-md tracking-widest">{selectedRole}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
                   {[
                       {i: Layers, l: 'My Dashboard', v: 'dashboard'},
                       {i: History, l: 'Order History', v: 'history'},
                       {i: QrCode, l: 'Security QR', v: 'safe_qr', s: 'Free'},
                       {i: Crown, l: 'Subscriptions', v: 'premium'},
                       {i: Activity, l: 'Services Hub', v: 'services'},
                       {i: Info, l: 'About Us', v: 'about'},
                       {i: HelpCircle, l: 'Help Center', v: 'contact'},
                       {i: Settings, l: 'Settings', v: 'settings'},
                   ].map((item: any) => (
                       <button type="button" key={item.l} onClick={() => { setDrawerOpen(false); handlePageChange(item.v as View); }} className="w-full flex items-center p-4 text-sm font-black text-slate-700 hover:bg-orange-50 rounded-xl transition-colors group border border-transparent hover:border-orange-100">
                           <item.i className={`h-5 w-5 mr-4 ${item.v === 'dashboard' ? 'text-[#0F172A]' : 'text-slate-400 group-hover:text-[#EA580C]'}`}/> 
                           {item.l}
                           {item.s && <span className="ml-auto bg-emerald-100 text-emerald-600 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">{item.s}</span>}
                       </button>
                   ))}
                </div>
                <div className="p-8 border-t border-slate-100 bg-slate-50">
                   <button type="button" onClick={handleLogout} className="w-full bg-red-50 text-red-600 p-4 rounded-xl text-sm font-black hover:bg-red-100 transition-colors flex justify-center items-center border border-red-100 shadow-sm"><LogOut className="h-5 w-5 mr-3"/> Sign Out</button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-6">
                 <button type="button" onClick={() => setDrawerOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-white p-2 rounded-lg border shadow-sm"><X className="h-5 w-5"/></button>
                 <Lock className="h-20 w-20 text-slate-300"/>
                 <h3 className="text-3xl font-black text-slate-900">Please Login</h3>
                 <p className="text-base text-slate-500 font-medium">Access features by joining the network.</p>
                 <button type="button" onClick={() => { setDrawerOpen(false); setAuthModal({open: true, step: 'role'}); }} className="bg-[#EA580C] text-white px-10 py-4 rounded-xl font-black text-lg w-full mt-4 shadow-xl hover:bg-orange-700 transition-colors">Login Now</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- AUTH MODAL --- */}
      {authModal.open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#0F172A]/90 backdrop-blur-md animate-fade-in pointer-events-auto">
          <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl flex overflow-hidden h-[550px] border border-slate-200 relative">
            <div className="hidden md:flex w-1/2 relative bg-[#0F172A] flex-col justify-end p-12">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7b66bfc?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
               <div className="relative z-10">
                  <h2 className="text-white text-4xl font-black mb-4 leading-tight">Powering the Future of Logistics.</h2>
                  <p className="text-slate-300 text-base font-medium">Seamlessly connect and manage your operations.</p>
               </div>
            </div>
            <div className="w-full md:w-1/2 p-8 sm:p-12 relative flex flex-col justify-center bg-white pointer-events-auto">
              <button type="button" onClick={() => setAuthModal({ ...authModal, open: false })} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-slate-50 p-2 rounded-xl border z-50"><X className="h-5 w-5" /></button>
              
              {authModal.step === 'role' && (
                <div className="space-y-8 animate-fade-in text-center relative z-20">
                  <h3 className="text-3xl font-black text-slate-900">Select Identity</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { role: 'driver', label: 'Driver' },
                      { role: 'transporter', label: 'Transporter' },
                      { role: 'trader', label: 'Trader' },
                      { role: 'corporate', label: 'Corporate' }
                    ].map((r: any) => (
                      <button type="button" key={r.role} onClick={() => { setSelectedRole(r.role as Role); setAuthModal({ open: true, step: 'auth_choice' }); }} className="p-5 rounded-xl border border-slate-200 bg-white hover:border-[#EA580C] hover:shadow-md transition-all font-black text-slate-700 text-sm shadow-sm hover:text-[#EA580C]">
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {authModal.step === 'auth_choice' && (
                <div className="space-y-8 animate-fade-in text-center relative z-20">
                  <div className="flex justify-center mb-6"><div className="bg-orange-50 p-5 rounded-full border border-orange-100 shadow-inner"><Lock className="h-10 w-10 text-[#EA580C]"/></div></div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Login / Register</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest border border-slate-200 w-fit mx-auto px-4 py-1.5 rounded-full shadow-sm">Role: <span className="text-[#EA580C]">{selectedRole}</span></p>
                  <input type="tel" maxLength={10} value={user.mobile} onChange={(e: any) => setUser({...user, mobile: e.target.value.replace(/\D/g,'')})} placeholder="10-Digit Mobile Number" className="w-full border-2 border-slate-200 rounded-xl p-4 text-center text-xl font-black outline-none focus:border-[#EA580C] shadow-inner" />
                  <div className="flex flex-col gap-4 pt-2">
                    <button type="button" onClick={handleMobileSubmit} disabled={user.mobile.length !== 10} className="w-full bg-[#EA580C] disabled:bg-slate-300 text-white font-black py-4 rounded-xl transition-colors shadow-lg hover:bg-orange-700 text-lg">Continue Securely</button>
                  </div>
                </div>
              )}
              {authModal.step === 'login_pass' && (
                 <div className="space-y-6 animate-fade-in text-center relative z-20">
                   <h3 className="text-3xl font-black text-slate-900">Welcome Back</h3>
                   <p className="text-sm font-bold text-slate-600 bg-slate-50 py-3 rounded-xl border border-slate-100 tracking-widest mb-6">{user.mobile}</p>
                   <div className="text-left space-y-2">
                      <label className="text-xs font-bold text-slate-600">Password</label>
                      <input type="password" value={user.password} onChange={(e: any) => setUser({...user, password: e.target.value})} placeholder="Enter Password" className="w-full border-2 border-slate-200 rounded-xl p-4 text-center text-xl font-bold outline-none focus:border-[#EA580C] shadow-inner" />
                   </div>
                   <button type="button" onClick={executeLogin} disabled={!user.password} className="w-full bg-[#0F172A] disabled:bg-slate-300 text-white font-black py-4 rounded-xl shadow-lg mt-4 hover:bg-slate-800 text-lg transition-colors">Sign In</button>
                   <div className="text-sm text-[#EA580C] font-bold cursor-pointer mt-6 hover:underline" onClick={() => setAuthModal({ open: true, step: 'forgot_otp' })}>Forgot Password?</div>
                 </div>
              )}
              {(authModal.step === 'register_otp' || authModal.step === 'forgot_otp') && (
                <div className="space-y-6 animate-fade-in text-center relative z-20">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{authModal.step === 'forgot_otp' ? 'Reset via OTP' : 'Verify Number'}</h3>
                  <p className="text-xs text-slate-500 font-bold bg-slate-50 py-3 rounded-xl border border-slate-100 tracking-widest mb-6">OTP sent to {user.mobile}</p>
                  <input type="text" maxLength={4} value={otpVal} onChange={(e: any) => setOtpVal(e.target.value.replace(/\D/g,''))} placeholder="XXXX" className="w-full border-2 border-slate-200 rounded-xl p-4 text-center text-4xl tracking-[0.5em] font-black outline-none focus:border-[#EA580C] shadow-inner mt-4" />
                  <button type="button" onClick={() => { if (otpVal.length !== 4) return; if (otpVal === "1234") { if(authModal.step === 'forgot_otp') executeLogin(); else setAuthModal({ open: true, step: 'kyc' }); } else { alert("Invalid OTP. Use 1234 for demo."); } }} disabled={otpVal.length !== 4} className="w-full bg-[#EA580C] disabled:bg-slate-300 text-white font-black py-4 rounded-xl shadow-lg mt-6 transition-colors text-base">Verify Secure Code</button>
                </div>
              )}
              {authModal.step === 'kyc' && (
                <div className="space-y-5 animate-fade-in overflow-y-auto max-h-full pb-4 pr-2 relative z-20">
                  <h3 className="text-2xl font-black text-slate-900 text-center border-b border-slate-100 pb-4 mb-6">Complete Profile Setup</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" value={user.firstName} onChange={(e: any)=>setUser({...user, firstName: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#EA580C] shadow-inner"/>
                    <input type="text" placeholder="Last Name" value={user.lastName} onChange={(e: any)=>setUser({...user, lastName: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#EA580C] shadow-inner"/>
                  </div>
                  {(selectedRole === 'trader' || selectedRole === 'corporate' || selectedRole === 'transporter') && (
                    <div className="space-y-4">
                      <input type="text" placeholder="Business / Company Name" value={user.businessName} onChange={(e: any)=>setUser({...user, businessName: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#EA580C] shadow-inner"/>
                      <input type="text" placeholder="GSTIN Number (Mandatory)" value={user.gst} onChange={(e: any)=>setUser({...user, gst: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#EA580C] shadow-inner"/>
                    </div>
                  )}
                  {selectedRole === 'driver' && (
                    <input type="text" placeholder="Driving License Number" value={user.dl} onChange={(e: any)=>setUser({...user, dl: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#EA580C] shadow-inner"/>
                  )}
                  <label className="border-2 border-dashed border-slate-300 bg-slate-50 p-4 rounded-xl flex flex-col items-center cursor-pointer hover:bg-slate-100 transition-colors">
                    <Upload className="h-5 w-5 text-slate-400 mb-1" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Upload PAN/Aadhaar</span>
                    <input type="file" className="hidden" onChange={(e: any) => handleFileUpload('aadhaar', e)} />
                  </label>
                  <input type="password" placeholder="Set a Secure Password" value={user.password} onChange={(e: any)=>setUser({...user, password: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#EA580C] shadow-inner mt-4"/>
                  <button type="button" onClick={handleKycSubmit} className="w-full bg-[#0F172A] text-white font-black py-4 rounded-xl shadow-lg mt-6 hover:bg-slate-800 transition-colors text-base">Initialize Account</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- DEMO OVERLAY --- */}
      {showDemo && (
        <div className="fixed inset-0 z-[400] bg-[#0F172A]/95 flex flex-col items-center justify-center p-6 backdrop-blur-md pointer-events-auto">
           <button type="button" onClick={() => setShowDemo(false)} className="absolute top-8 right-8 text-white hover:text-[#EA580C] z-50"><X className="h-10 w-10"/></button>
           <Bot className="h-32 w-32 text-[#EA580C] mb-8 animate-bounce drop-shadow-[0_0_20px_rgba(234,88,12,0.6)]" />
           <div className="h-16 flex items-center justify-center">
             <h2 className="text-2xl md:text-5xl font-mono text-white font-black border-r-4 border-[#EA580C] pr-3 animate-pulse">{demoText}</h2>
           </div>
           <div className="mt-16 max-w-2xl text-center space-y-8">
              <p className="text-slate-300 text-xl font-medium leading-relaxed">This AI engine matches drivers and loads in real-time, eliminating empty returns and reducing carbon footprints based on your identity profile.</p>
              <button type="button" onClick={() => setShowDemo(false)} className="bg-[#EA580C] text-white px-12 py-5 rounded-2xl font-black text-xl shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:bg-orange-700 transition-colors">End Demo Simulation</button>
           </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full relative z-10">
        
        {/* LANDING VIEW */}
        {activeView === 'landing' && (
          <>
            <section className="relative w-full min-h-[65vh] md:min-h-[85vh] bg-[#0F172A] flex flex-col justify-end overflow-hidden pb-32 pt-24 border-b-8 border-[#EA580C]">
               <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                 {/* DRONE SHOT BACKGROUND ZOOMING */}
                 <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover opacity-50 animate-ken-burns" alt="Trucks Drone Shot" />
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-transparent z-0 pointer-events-none"></div>
               
               <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-12 w-full grid lg:grid-cols-2 gap-16 items-center pointer-events-none">
                  
                  <div className="max-w-2xl space-y-8 pointer-events-auto">
                     <span className="bg-[#EA580C]/20 text-[#EA580C] border border-[#EA580C]/50 px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase inline-block shadow-inner">{t("India's Logistics Backbone", "भारत का लॉजिस्टिक्स नेटवर्क")}</span>
                     <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[1.05] tracking-tight drop-shadow-2xl">
                       {t("Empowering Transporters.", "ट्रांसपोर्टर्स को सशक्त बनाना")}<br/>
                       <span className="text-[#EA580C]">{t("Pure Profits.", "प्योर प्रॉफिट्स।")}</span>
                     </h1>
                     <p className="text-lg md:text-2xl text-slate-300 font-medium max-w-2xl leading-relaxed">
                       {t("Connect directly. Manage loads. Group buy parts. Access AI safety. Simplified logistics tailored for the Indian market.", "सीधे जुड़ें। लोड प्रबंधित करें। ग्रुप बाय पार्ट्स। एआई सेफ्टी का एक्सेस करें।")}
                     </p>
                  </div>

                  {/* Parallel Scrolling Headers - Auto Carousel */}
                  <div className="relative h-[450px] bg-slate-900 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-800 hidden lg:block pointer-events-auto">
                    <div className="absolute inset-0 z-0 pointer-events-none">
                      {parallelHeaders.map((header: any, i: number) => (
                        <div key={header.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIdx ? 'opacity-100' : 'opacity-0'}`}>
                          <img src={header.url} className="w-full h-full object-cover opacity-60" alt="" />
                        </div>
                      ))}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 h-full flex flex-col justify-end p-10 pointer-events-none">
                      {parallelHeaders.map((header: any, i: number) => (
                        <div key={header.id} className={`space-y-5 transition-all duration-1000 absolute bottom-10 left-10 right-10 ${i === heroIdx ? 'opacity-100 translate-y-0 z-20 pointer-events-auto' : 'opacity-0 translate-y-10 z-0 pointer-events-none'}`}>
                           <span className="bg-[#EA580C] text-white px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg inline-block border border-orange-400">{header.tag}</span>
                           <h3 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md">{header.title}</h3>
                           <p className="text-slate-300 text-lg font-bold max-w-md">{header.subtitle}</p>
                           <div className="flex space-x-4 mt-6">
                             {header.btn1 === 'Request Demo' && (
                               <button type="button" onClick={() => setShowDemo(true)} className="bg-white text-[#0F172A] px-8 py-4 rounded-xl font-black text-sm hover:bg-slate-200 transition-colors flex items-center shadow-xl hover:scale-105 transform cursor-pointer">
                                 {header.btn1} <PlayCircle className="h-5 w-5 ml-3"/>
                               </button>
                             )}
                             {header.btn1 === 'Learn More' && (
                               <button type="button" onClick={() => handlePageChange('services')} className="bg-white text-[#0F172A] px-8 py-4 rounded-xl font-black text-sm hover:bg-slate-200 transition-colors flex items-center shadow-xl hover:scale-105 transform cursor-pointer">
                                 {header.btn1} <ArrowRight className="h-5 w-5 ml-3"/>
                               </button>
                             )}
                             {(header.btn2 === 'Join Network') && (
                               <button type="button" onClick={() => setAuthModal({open:true, step:'role'})} className="bg-[#EA580C] text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-orange-700 transition-colors flex items-center shadow-xl hover:scale-105 transform cursor-pointer">
                                 {header.btn2} <User className="h-5 w-5 ml-3"/>
                               </button>
                             )}
                           </div>
                        </div>
                      ))}
                    </div>
                    {/* Carousel Indicators */}
                    <div className="absolute top-6 right-6 flex space-x-2 z-20 pointer-events-auto">
                       {parallelHeaders.map((_: any, i: number) => (
                         <button type="button" key={i} onClick={() => setHeroIdx(i)} className={`h-2 rounded-full transition-all cursor-pointer ${i === heroIdx ? 'w-10 bg-[#EA580C]' : 'w-4 bg-white/30 hover:bg-white/50'}`}></button>
                       ))}
                    </div>
                  </div>
               </div>
            </section>

            {/* OVERLAPPING STATS */}
            <section className="max-w-[1200px] mx-auto px-6 relative z-20 -mt-24 mb-32">
               <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 p-10 grid grid-cols-2 md:grid-cols-4 gap-10 text-center divide-x divide-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-[80px] -z-10"></div>
                  {[
                      {i: Truck, c: platformStats.trucks, l: 'Trucks Listed'},
                      {i: Package, c: platformStats.parcels, l: 'Parcels Shipped'},
                      {i: ShieldCheck, c: platformStats.verified, l: 'Verified Drivers'},
                      {i: MapPin, c: platformStats.cities, l: 'Cities Covered'}
                  ].map((stat: any, i: number) => (
                      <div key={stat.l} className={`flex-1 ${i === 0 ? '' : 'md:pl-10'} ${i > 1 ? 'mt-10 md:mt-0' : ''}`}>
                          <div className={`text-5xl md:text-6xl font-black ${i%2===0 ? 'text-[#EA580C]' : 'text-[#0F172A]'} flex items-center justify-center mb-3`}><stat.i className="h-10 w-10 mr-4 shrink-0"/> {stat.c}</div>
                          <div className="text-xs text-slate-500 font-black uppercase tracking-widest leading-tight">{stat.l}</div>
                      </div>
                  ))}
               </div>
            </section>

            {/* SELECT IDENTITY CARDS */}
            <section className="max-w-[1400px] mx-auto px-6 text-center space-y-16 mb-32">
              <h2 className="text-5xl font-black text-[#0F172A]">{t("Select Your Identity", "अपनी पहचान चुनें")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { role: 'driver', icon: <Truck/>, title: 'Driver / Fleet', desc: 'List empty trucks' },
                  { role: 'transporter', icon: <User/>, title: 'Transporter', desc: 'Manage trader loads' },
                  { role: 'trader', icon: <Package/>, title: 'Local Trader', desc: 'Ship individual parcels' },
                  { role: 'corporate', icon: <Building/>, title: 'Corporate', desc: 'Bulk advanced bidding' }
                ].map((item: any) => (
                  <button type="button" key={item.role} onClick={() => { setSelectedRole(item.role as Role); setAuthModal({ open: true, step: 'auth_choice' }); }} 
                    className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-2xl hover:border-[#EA580C] transition-all flex flex-col items-center text-center group cursor-pointer hover:-translate-y-2">
                    <div className="h-24 w-24 bg-slate-50 text-slate-500 rounded-[1.5rem] flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-[#EA580C] group-hover:text-white transition-colors shadow-inner [&>svg]:h-12 [&>svg]:w-12">{item.icon}</div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-base text-slate-500 font-medium">{item.desc}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* WHAT OUR USERS SAY */}
            <section className="py-32 bg-[#0F172A] text-white">
               <div className="max-w-[1600px] mx-auto px-6 sm:px-12">
                 <div className="text-center mb-20">
                   <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">What Our Users Say</h2>
                   <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">Real experiences from our growing network of partners who have transformed their logistics.</p>
                 </div>
                 <div className="flex overflow-x-auto space-x-8 pb-10 no-scrollbar snap-x cursor-grab">
                   {[
                     { name: "Rajesh K.", role: "Fleet Owner", quote: "LoadBhai's radar completely eliminated my empty return trips. My monthly revenue jumped by 40%. The UI is incredibly easy to use." },
                     { name: "Suresh Singh", role: "Independent Driver", quote: "The safe QR code feature saved me from endless highway checks. It's the most secure way to haul freight in India right now." },
                     { name: "Amit Patel", role: "Corporate Manager", quote: "Enterprise reverse bidding helped my manufacturing plant reduce logistics costs drastically. The bidding terminal is flawless." },
                     { name: "Vikram D.", role: "Transporter", quote: "Bus parcel service is a game changer for urgent small loads. It's fast, reliable, and the escrow fee is very reasonable." }
                   ].map((testimonial: any, i: number) => (
                     <div key={i} className="min-w-[450px] bg-[#0B0F19] p-12 rounded-[2.5rem] border border-slate-800 shadow-2xl snap-center flex flex-col justify-between hover:border-[#EA580C] transition-colors group">
                       <div>
                         <div className="flex text-[#EA580C] mb-8"><Star className="h-6 w-6 fill-current"/><Star className="h-6 w-6 fill-current"/><Star className="h-6 w-6 fill-current"/><Star className="h-6 w-6 fill-current"/><Star className="h-6 w-6 fill-current"/></div>
                         <p className="text-xl text-slate-300 italic mb-10 leading-relaxed">"{testimonial.quote}"</p>
                       </div>
                       <div className="flex items-center space-x-5 border-t border-slate-800 pt-8">
                         <div className="h-16 w-16 rounded-full bg-slate-800 border-2 border-[#EA580C] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><User className="text-white h-8 w-8"/></div>
                         <div>
                           <h4 className="font-black text-white text-xl">{testimonial.name}</h4>
                           <p className="text-xs text-[#EA580C] font-black uppercase tracking-widest mt-1">{testimonial.role}</p>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </section>

            {/* PLATFORM FEATURES GRID */}
            <section className="bg-slate-100 py-32 px-6">
               <div className="max-w-[1400px] mx-auto space-y-16">
                 <div className="text-center mb-20"><h2 className="text-5xl font-black text-[#0F172A] mb-6">Platform Features</h2><p className="text-slate-500 text-xl font-medium">Click to explore the tools driving efficiency.</p></div>
                 <div className="grid md:grid-cols-2 gap-10">
                   {platformFeatures.map((b: any) => (
                     <div key={b.id} onClick={() => { setSelectedFeature(b); handlePageChange('feature_detail'); }} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-2">
                        <div className="h-72 relative overflow-hidden">
                          <img src={b.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                          <div className={`absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 opacity-90`}></div>
                          <span className="absolute top-6 left-6 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-sm">{b.tag}</span>
                        </div>
                        <div className="p-10">
                          <h3 className="text-3xl font-black text-slate-900 mb-4 flex items-center">{b.title} <ArrowRight className="h-6 w-6 ml-auto text-slate-300 group-hover:text-[#EA580C] transition-colors"/></h3>
                          <p className="text-lg text-slate-600 font-medium leading-relaxed">{b.subtitle}</p>
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
            </section>
          </>
        )}

        {/* FEATURE DETAIL PAGE */}
        {activeView === 'feature_detail' && selectedFeature && (
          <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-20 animate-fade-in z-10 relative">
             <button type="button" onClick={() => handlePageChange('landing')} className="flex items-center text-[#EA580C] font-black text-base mb-10 transition-colors hover:text-[#0F172A] bg-white px-6 py-3 rounded-xl shadow-md border"><ArrowLeft className="h-5 w-5 mr-3"/> Back to Main Screen</button>
             <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200">
                <div className="h-[500px] relative">
                  <img src={selectedFeature?.url} className="w-full h-full object-cover" alt="" />
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#0F172A] opacity-90`}></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-16">
                     <span className="bg-[#EA580C] text-white px-5 py-2 rounded-full w-fit text-xs font-black tracking-widest mb-6 shadow-lg uppercase border border-orange-400">{selectedFeature?.tag}</span>
                     <h1 className="text-6xl md:text-7xl font-black text-white leading-tight drop-shadow-lg">{selectedFeature?.title}</h1>
                  </div>
                </div>
                <div className="p-16 space-y-10">
                   <h3 className="text-4xl font-black text-slate-900">Feature Overview</h3>
                   <p className="text-slate-600 text-2xl font-medium leading-relaxed max-w-4xl">{selectedFeature?.subtitle} Built with high-scale architecture to support millions of concurrent transactions, ensuring reliability and security across the entire logistics grid.</p>
                   <div className="bg-slate-50 border border-slate-200 p-10 rounded-3xl flex items-center space-x-8 max-w-lg shadow-inner">
                      <Activity className="h-12 w-12 text-[#EA580C]"/>
                      <div>
                        <div className="text-3xl font-black text-slate-900 mb-2">Enterprise Ready</div>
                        <div className="text-base font-bold text-slate-500 uppercase tracking-widest">Fully integrated module</div>
                      </div>
                   </div>
                   <button type="button" onClick={() => setAuthModal({open: true, step: 'role'})} className="bg-[#0F172A] text-white px-12 py-5 rounded-2xl text-xl font-black hover:bg-slate-800 transition-colors shadow-2xl">Start Using This Feature</button>
                </div>
             </div>
          </section>
        )}

        {/* LOGGED IN DASHBOARD MODULES */}
        {isLoggedIn && activeView === 'dashboard' && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-10 relative">
             
             {/* TOP MODULE TABS - RESTORED FULLY */}
             <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl mb-12 gap-6">
                <h2 className="text-3xl font-black text-slate-900 w-full lg:w-auto text-center lg:text-left tracking-tight">
                  {activeModule === 'freight' && 'Book Freight & Radar'}
                  {activeModule === 'bus_cargo' && 'Bus Parcel Delivery'}
                  {activeModule === 'corporate' && 'Enterprise Auctions'}
                  {activeModule === 'mandi' && 'Fleet Mandi Hub'}
                  {activeModule === 'ads' && 'Truck Advertising'}
                </h2>
                {/* Module-specific Sub Tabs */}
                <div className="flex flex-wrap justify-center bg-slate-100 p-2 rounded-2xl w-full lg:w-auto border border-slate-200 shadow-inner gap-2">
                   {[
                     { id: 'freight', label: 'Book Freight' },
                     { id: 'bus_cargo', label: 'Bus Parcel' },
                     { id: 'corporate', label: 'Enterprise Bids' },
                     { id: 'mandi', label: 'Fleet Mandi' },
                     { id: 'ads', label: 'Truck Ads' }
                   ].map((tab: any) => (
                     <button type="button" key={tab.id} onClick={() => { setActiveModule(tab.id as ModuleTab); setListingTab('all'); setBusTab('all'); setBookingStep(1); }} 
                       className={`px-6 py-3.5 rounded-xl text-sm font-black transition-all ${activeModule === tab.id ? 'bg-[#0F172A] text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-white'}`}>
                       {tab.label}
                     </button>
                   ))}
                </div>
             </div>

             {/* Module-specific Sub Tabs for Freight/Bus */}
             {(activeModule === 'freight' || activeModule === 'bus_cargo') && (
                <div className="flex justify-center mb-10">
                  <div className="flex bg-slate-100 p-2 rounded-2xl w-fit border border-slate-200 shadow-inner">
                     <button type="button" onClick={() => { activeModule === 'freight' ? setListingTab('all') : setBusTab('all'); }} className={`px-10 py-3.5 rounded-xl text-sm font-black transition-all ${(activeModule === 'freight' ? listingTab : busTab) === 'all' ? 'bg-white text-[#EA580C] shadow' : 'text-slate-500 hover:text-slate-900'}`}>Market Feed</button>
                     <button type="button" onClick={() => { activeModule === 'freight' ? setListingTab('my_listings') : setBusTab('my_listings'); }} className={`px-10 py-3.5 rounded-xl text-sm font-black transition-all ${(activeModule === 'freight' ? listingTab : busTab) === 'my_listings' ? 'bg-white text-[#EA580C] shadow' : 'text-slate-500 hover:text-slate-900'}`}>My Listings</button>
                     <button type="button" onClick={() => { activeModule === 'freight' ? setListingTab('command_center') : setBusTab('command_center'); }} className={`px-10 py-3.5 rounded-xl text-sm font-black transition-all ${(activeModule === 'freight' ? listingTab : busTab) === 'command_center' ? 'bg-[#0F172A] text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}>Radar</button>
                  </div>
                </div>
             )}

             {/* MODULE: FREIGHT */}
             {activeModule === 'freight' && (
               <div className="space-y-10 animate-fade-in">
                 {listingTab === 'all' && (
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl">
                      <div className="p-8 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                         <div className="flex items-center space-x-4">
                           <div className="bg-[#EA580C] p-3 rounded-2xl shadow-inner"><Activity className="h-7 w-7 text-white"/></div>
                           <h3 className="font-black text-slate-900 text-2xl">Live Freight Market</h3>
                         </div>
                         <div className="flex space-x-4 w-full md:w-auto">
                           {/* Real-time search/filter inputs */}
                           <div className="bg-white border border-slate-300 px-5 py-4 rounded-xl flex items-center shadow-inner flex-1 md:flex-none">
                             <Search className="h-5 w-5 mr-3 text-slate-400"/>
                             <input type="text" placeholder="Search Origin/Dest..." value={freightSearch} onChange={(e: any)=>setFreightSearch(e.target.value)} className="text-sm font-bold outline-none w-full md:w-40 text-slate-700"/>
                           </div>
                           <select value={freightCapacityFilter} onChange={(e: any)=>setFreightCapacityFilter(e.target.value)} className="bg-[#0F172A] text-white border border-slate-800 px-7 py-4 rounded-xl shadow-md text-sm font-black outline-none cursor-pointer">
                              <option value="">All Capacities</option>
                              <option value="15">15 Tons</option>
                              <option value="16">16 Tons</option>
                              <option value="20">20 Tons</option>
                           </select>
                         </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                          <thead>
                            <tr className="bg-white border-b border-slate-200 text-xs font-black text-slate-400 uppercase tracking-widest">
                              <th className="p-8 pl-10">Vehicle / Asset</th>
                              <th className="p-8">Route Details</th>
                              <th className="p-8">Capacity & Type</th>
                              <th className="p-8">Est. Fare</th>
                              <th className="p-8 text-right pr-10">Action</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm divide-y divide-slate-100">
                            {combinedFeed.map((item: any, idx: number) => (
                              <React.Fragment key={idx}>
                                <tr className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setExpandedListingId(expandedListingId === item.id ? null : item.id)}>
                                  <td className="p-8 pl-10">
                                    <div className="flex items-center space-x-5">
                                      <div className="h-16 w-24 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 shadow-sm">
                                        <img src={item.truckImg || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover" alt=""/>
                                      </div>
                                      <div>
                                        <div className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200 uppercase w-fit mb-1">{item.id || `LOD-${idx}`}</div>
                                        <div className="font-black text-slate-900 text-lg">{item.isMine ? (item.driverName || item.companyName) : 'View Contact'}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-8">
                                    <div className="flex items-center space-x-3 font-black text-slate-900 text-lg bg-slate-100 w-fit px-5 py-2.5 rounded-xl border border-slate-200">
                                      <span>{item.origin || item.currentLoc}</span>
                                      <ArrowRight className="h-5 w-5 text-[#EA580C]"/>
                                      <span>{item.destination || item.destLoc}</span>
                                    </div>
                                  </td>
                                  <td className="p-8 font-bold text-slate-600 text-lg">
                                    {item.capacity || item.weight} Tons <br/> <span className="text-xs text-slate-400 uppercase tracking-widest">{item.type || item.material || 'General'}</span>
                                  </td>
                                  <td className="p-8 font-black text-slate-900 text-3xl text-[#EA580C]">
                                    ₹{(item.charges || item.targetPrice).toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-8 text-right pr-10">
                                    <div className="flex justify-end items-center text-slate-400 group-hover:text-[#0F172A]">
                                      <span className="text-xs font-black mr-3 uppercase tracking-widest">Details</span> 
                                      <div className={`p-2.5 rounded-full transition-all ${expandedListingId === item.id ? 'bg-[#0F172A] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                                        <ChevronDown className={`h-6 w-6 transition-transform ${expandedListingId === item.id ? 'rotate-180' : ''}`} />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                {expandedListingId === item.id && (
                                  <tr className="bg-slate-50 border-b border-slate-200 shadow-inner">
                                    <td colSpan={5} className="p-8">
                                      <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 animate-fade-in">
                                        <div className="flex items-center space-x-8">
                                          <div className="h-20 w-20 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                                            {item.dp ? <img src={item.dp} className="h-full w-full object-cover" alt=""/> : <User className="h-10 w-10 text-slate-400"/>}
                                          </div>
                                          <div>
                                            <div className="font-black text-slate-900 text-2xl mb-3">{item.driverName || item.companyName || 'Verified Transporter'}</div>
                                            <div className="flex space-x-5 text-sm font-bold text-slate-600">
                                              <span className="flex items-center bg-slate-100 px-4 py-2 rounded-xl border border-slate-200"><PhoneCall className="h-5 w-5 mr-2 text-[#EA580C]"/> {item.phone || '+91 9876543210'}</span>
                                              <span className="flex items-center bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 text-emerald-600"><CheckCircle2 className="h-5 w-5 mr-2"/> KYC Verified</span>
                                            </div>
                                          </div>
                                        </div>
                                        <button type="button" onClick={(e: any) => { e.stopPropagation(); openWhatsApp(`I want to connect regarding Freight ID: ${item.id}`); }} className="bg-[#0F172A] text-white font-black px-12 py-5 rounded-xl shadow-xl hover:bg-slate-800 transition-colors text-lg w-full md:w-auto">
                                          Contact / Bid Now
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                            {combinedFeed.length === 0 && <tr><td colSpan={5} className="p-16 text-center text-slate-500 font-bold text-lg">No active listings match your search.</td></tr>}
                          </tbody>
                        </table>
                      </div>
                    </div>
                 )}

                 {listingTab === 'my_listings' && (
                    <div className="grid lg:grid-cols-3 gap-10">
                       <div className="lg:col-span-1 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl h-fit">
                         <h3 className="font-black text-3xl text-slate-900 mb-8 border-b border-slate-100 pb-5">Post Requirements</h3>
                         {LayeredStepIndicator()}
                         {selectedRole === 'driver' || selectedRole === 'transporter' ? (
                           <form onSubmit={handlePostTruck} className="space-y-5">
                             {bookingStep === 1 && (
                               <div className="animate-fade-in space-y-5">
                                 <input type="text" placeholder="Origin Location" value={newTruck.origin} onChange={(e: any)=>setNewTruck({...newTruck, origin: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <input type="text" placeholder="Destination" value={newTruck.dest} onChange={(e: any)=>setNewTruck({...newTruck, dest: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <button type="button" onClick={()=>setBookingStep(2)} className="w-full bg-[#0F172A] text-white p-5 rounded-xl font-black text-lg hover:bg-slate-800 transition-colors shadow-lg mt-4">Next Step</button>
                               </div>
                             )}
                             {bookingStep === 2 && (
                               <div className="animate-fade-in space-y-5">
                                 <input type="text" placeholder="Vehicle No (e.g. MH04AB1234)" value={newTruck.vehicleNumber} onChange={(e: any)=>setNewTruck({...newTruck, vehicleNumber: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <input type="text" placeholder="Capacity (Tons)" value={newTruck.capacity} onChange={(e: any)=>setNewTruck({...newTruck, capacity: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <div className="flex gap-4 pt-4">
                                   <button type="button" onClick={()=>setBookingStep(1)} className="flex-1 bg-slate-100 text-slate-700 font-black p-5 rounded-xl hover:bg-slate-200 transition-colors">Back</button>
                                   <button type="button" onClick={()=>setBookingStep(3)} className="flex-[2] bg-[#0F172A] text-white font-black p-5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg">Next</button>
                                 </div>
                               </div>
                             )}
                             {bookingStep === 3 && (
                               <div className="animate-fade-in space-y-5">
                                 <input type="number" placeholder="Expected Price (₹)" value={newTruck.charges} onChange={(e: any)=>setNewTruck({...newTruck, charges: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <label className="border-2 border-dashed border-slate-300 bg-slate-50 p-8 rounded-2xl text-center cursor-pointer block hover:bg-slate-100 transition-colors">
                                   <Camera className="mx-auto h-10 w-10 text-slate-400 mb-3"/>
                                   <span className="text-sm text-slate-600 font-black uppercase tracking-widest">Upload Truck Image</span>
                                   <input type="file" className="hidden" onChange={(e: any) => handleFileUpload('truck_pic', e)} />
                                 </label>
                                 <div className="flex gap-4 pt-6">
                                   <button type="button" onClick={()=>setBookingStep(2)} className="flex-1 bg-slate-100 text-slate-700 font-black p-5 rounded-xl hover:bg-slate-200 transition-colors">Back</button>
                                   <button type="submit" className="flex-[2] bg-[#EA580C] text-white font-black p-5 rounded-xl hover:bg-orange-700 shadow-xl transition-colors text-lg">Post Listing</button>
                                 </div>
                               </div>
                             )}
                           </form>
                         ) : (
                           <form onSubmit={handlePostLoad} className="space-y-5">
                              {bookingStep === 1 && (
                               <div className="animate-fade-in space-y-5">
                                 <input type="text" placeholder="Pickup Location" value={newLoad.origin} onChange={(e: any)=>setNewLoad({...newLoad, origin: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <input type="text" placeholder="Drop Location" value={newLoad.destination} onChange={(e: any)=>setNewLoad({...newLoad, destination: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <button type="button" onClick={()=>setBookingStep(2)} className="w-full bg-[#0F172A] text-white p-5 rounded-xl font-black text-lg hover:bg-slate-800 transition-colors shadow-lg mt-4">Next Step</button>
                               </div>
                             )}
                             {bookingStep === 2 && (
                               <div className="animate-fade-in space-y-5">
                                 <input type="text" placeholder="Material Type" value={newLoad.material} onChange={(e: any)=>setNewLoad({...newLoad, material: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <input type="text" placeholder="Weight (Tons)" value={newLoad.weight} onChange={(e: any)=>setNewLoad({...newLoad, weight: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <div className="flex gap-4 pt-4">
                                   <button type="button" onClick={()=>setBookingStep(1)} className="flex-1 bg-slate-100 text-slate-700 font-black p-5 rounded-xl hover:bg-slate-200 transition-colors">Back</button>
                                   <button type="button" onClick={()=>setBookingStep(3)} className="flex-[2] bg-[#0F172A] text-white font-black p-5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg">Next</button>
                                 </div>
                               </div>
                             )}
                             {bookingStep === 3 && (
                               <div className="animate-fade-in space-y-5">
                                 <input type="number" placeholder="Offer Price (₹)" value={newLoad.targetPrice} onChange={(e: any)=>setNewLoad({...newLoad, targetPrice: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <div className="flex gap-4 pt-6">
                                   <button type="button" onClick={()=>setBookingStep(2)} className="flex-1 bg-slate-100 text-slate-700 font-black p-5 rounded-xl hover:bg-slate-200 transition-colors">Back</button>
                                   <button type="submit" className="flex-[2] bg-[#EA580C] text-white font-black p-5 rounded-xl hover:bg-orange-700 shadow-md transition-colors">Post Load</button>
                                 </div>
                               </div>
                             )}
                           </form>
                         )}
                       </div>
                       <div className="lg:col-span-2">
                         {renderLiveRadar()}
                       </div>
                    </div>
                 )}

                 {listingTab === 'command_center' && renderLiveRadar()}
               </div>
             )}

             {/* MODULE: BUS CARGO */}
             {activeModule === 'bus_cargo' && (
               <div className="space-y-10 animate-fade-in">
                 
                 {busTab === 'all' && (
                   <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl">
                      <div className="p-8 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                         <div className="flex items-center space-x-4">
                           <div className="bg-[#EA580C] p-3 rounded-2xl shadow-inner"><Bus className="h-7 w-7 text-white"/></div>
                           <h3 className="font-black text-slate-900 text-2xl">Active Bus Cargo</h3>
                         </div>
                         <div className="flex space-x-4 w-full md:w-auto">
                           {/* Real-time search for Bus */}
                           <div className="bg-white border border-slate-300 px-5 py-4 rounded-xl flex items-center shadow-inner flex-1 md:flex-none">
                             <Search className="h-5 w-5 mr-3 text-slate-400"/>
                             <input type="text" placeholder="Search route..." value={busSearch} onChange={(e: any)=>setBusSearch(e.target.value)} className="text-sm font-bold outline-none w-full md:w-48 text-slate-700"/>
                           </div>
                           <select value={busTypeFilter} onChange={(e: any)=>setBusTypeFilter(e.target.value)} className="bg-[#0F172A] text-white border border-slate-800 px-7 py-4 rounded-xl shadow-md text-sm font-black outline-none cursor-pointer">
                              <option value="">All Types</option>
                              <option value="Fragile">Fragile</option>
                              <option value="Express">Express</option>
                              <option value="Standard">Standard</option>
                           </select>
                         </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                          <thead>
                            <tr className="bg-white border-b border-slate-200 text-xs font-black text-slate-400 uppercase tracking-widest">
                              <th className="p-8 pl-10">Bus Operator</th>
                              <th className="p-8">Route</th>
                              <th className="p-8">Space & Type</th>
                              <th className="p-8">Price/Kg</th>
                              <th className="p-8 text-right pr-10">Action</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm divide-y divide-slate-100">
                            {filteredBusFeed.map((bus: any, idx: number) => (
                              <React.Fragment key={idx}>
                                <tr className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setExpandedListingId(expandedListingId === bus.id ? null : bus.id)}>
                                  <td className="p-8 pl-10">
                                    <div className="flex items-center space-x-5">
                                      <div className="h-16 w-24 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 shadow-sm">
                                        <img src={bus.busImg} className="w-full h-full object-cover" alt="" />
                                      </div>
                                      <div>
                                        <div className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200 uppercase w-fit mb-1">{bus.id}</div>
                                        <div className="font-black text-slate-900 text-lg">{bus.operator}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-8 font-black text-slate-900 text-lg">
                                    <span className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 inline-block">{bus.route}</span>
                                  </td>
                                  <td className="p-8 font-bold text-slate-600 text-base">
                                    {bus.capacity} <br/> 
                                    <span className={`text-[10px] font-black uppercase tracking-widest mt-1.5 inline-flex items-center px-2.5 py-1 rounded-md ${bus.serviceType === 'Fragile' ? 'bg-orange-50 text-[#EA580C] border border-orange-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                      {bus.serviceType === 'Fragile' && <Package className="h-3 w-3 mr-1"/>}
                                      {bus.serviceType === 'Express' && <Truck className="h-3 w-3 mr-1"/>}
                                      {bus.serviceType === 'Standard' && <Box className="h-3 w-3 mr-1"/>}
                                      {bus.serviceType}
                                    </span>
                                  </td>
                                  <td className="p-8 font-black text-slate-900 text-3xl text-[#EA580C]">
                                    ₹{bus.price}
                                  </td>
                                  <td className="p-8 text-right pr-10">
                                    <div className="flex justify-end items-center text-slate-400 group-hover:text-[#0F172A]">
                                      <span className="text-xs font-black mr-3 uppercase tracking-widest">Details</span> 
                                      <div className={`p-2.5 rounded-full transition-all ${expandedListingId === bus.id ? 'bg-[#0F172A] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                                        <ChevronDown className={`h-6 w-6 transition-transform ${expandedListingId === bus.id ? 'rotate-180' : ''}`} />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                {expandedListingId === bus.id && (
                                  <tr className="bg-slate-50 border-b border-slate-200 shadow-inner">
                                    <td colSpan={5} className="p-8">
                                      <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 animate-fade-in">
                                        <div className="flex items-center space-x-6">
                                          <div className="h-16 w-16 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                                            <Bus className="h-8 w-8 text-slate-400"/>
                                          </div>
                                          <div>
                                            <div className="font-black text-slate-900 text-xl mb-2">{bus.operator}</div>
                                            <div className="flex space-x-4 text-sm font-bold text-slate-600">
                                              <span className="flex items-center bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"><PhoneCall className="h-4 w-4 mr-2 text-[#EA580C]"/> Contact Operator</span>
                                              <span className="flex items-center bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 text-emerald-600"><CheckCircle2 className="h-4 w-4 mr-2"/> Verified Route</span>
                                            </div>
                                          </div>
                                        </div>
                                        <button type="button" onClick={(e: any) => { e.stopPropagation(); openWhatsApp(`I want to book parcel space on ${bus.route} via ${bus.operator}`); }} className="bg-[#0F172A] text-white font-black px-10 py-4 rounded-xl shadow-xl hover:bg-slate-800 transition-colors text-base w-full md:w-auto">
                                          Book Space Now
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                            {filteredBusFeed.length === 0 && <tr><td colSpan={5} className="p-16 text-center text-slate-500 font-bold text-lg">No active bus networks match your filter.</td></tr>}
                          </tbody>
                        </table>
                      </div>
                   </div>
                 )}

                 {busTab === 'my_listings' && (
                   <div className="grid lg:grid-cols-3 gap-10">
                      <div className="lg:col-span-1 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl h-fit">
                        {selectedRole === 'driver' || selectedRole === 'transporter' ? (
                          <form onSubmit={handlePostBus} className="space-y-6">
                             <h3 className="font-black text-3xl text-slate-900 border-b border-slate-100 pb-5 mb-8">List Bus Capacity</h3>
                             <div className="space-y-5">
                               <label className="text-xs font-bold text-slate-700 block uppercase tracking-widest">Route (Origin - Destination)</label>
                               <input type="text" placeholder="e.g. Patna - Delhi" value={newBus.route} onChange={(e: any)=>setNewBus({...newBus, route:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                               
                               <div className="grid grid-cols-2 gap-4">
                                 <div>
                                   <label className="text-xs font-bold text-slate-700 block pt-2 uppercase tracking-widest">Vehicle No.</label>
                                   <input type="text" placeholder="e.g. MH04 AB1234" value={newBus.vehicleNumber} onChange={(e: any)=>setNewBus({...newBus, vehicleNumber:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                                 </div>
                                 <div>
                                   <label className="text-xs font-bold text-slate-700 block pt-2 uppercase tracking-widest">Space (KG)</label>
                                   <input type="number" placeholder="e.g. 500" value={newBus.capacity} onChange={(e: any)=>setNewBus({...newBus, capacity:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                                 </div>
                               </div>

                               <label className="text-xs font-bold text-slate-700 block pt-4 uppercase tracking-widest">Select Service Type</label>
                               <div className="grid grid-cols-3 gap-4 mb-8">
                                  <div onClick={() => setNewBus({...newBus, serviceType: 'Fragile'})} className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-colors ${newBus.serviceType === 'Fragile' ? 'border-[#EA580C] bg-orange-50' : 'border-slate-200'}`}><Package className={`h-8 w-8 mx-auto mb-3 ${newBus.serviceType === 'Fragile' ? 'text-[#EA580C]' : 'text-slate-400'}`}/><div className="text-[10px] font-black uppercase tracking-wider">Fragile</div></div>
                                  <div onClick={() => setNewBus({...newBus, serviceType: 'Express'})} className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-colors ${newBus.serviceType === 'Express' ? 'border-[#EA580C] bg-orange-50' : 'border-slate-200'}`}><Truck className={`h-8 w-8 mx-auto mb-3 ${newBus.serviceType === 'Express' ? 'text-[#EA580C]' : 'text-slate-400'}`}/><div className="text-[10px] font-black uppercase tracking-wider">Express</div></div>
                                  <div onClick={() => setNewBus({...newBus, serviceType: 'Standard'})} className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-colors ${newBus.serviceType === 'Standard' ? 'border-[#EA580C] bg-orange-50' : 'border-slate-200'}`}><Box className={`h-8 w-8 mx-auto mb-3 ${newBus.serviceType === 'Standard' ? 'text-[#EA580C]' : 'text-slate-400'}`}/><div className="text-[10px] font-black uppercase tracking-wider">Standard</div></div>
                               </div>

                               <label className="text-xs font-bold text-slate-700 block pt-4 uppercase tracking-widest">Price per Kg (₹)</label>
                               <input type="number" placeholder="₹" value={newBus.price} onChange={(e: any)=>setNewBus({...newBus, price:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                               
                               <button type="submit" className="w-full bg-[#EA580C] text-white font-black p-5 rounded-xl hover:bg-orange-700 transition-colors shadow-xl mt-8 text-lg">Post Available Space</button>
                             </div>
                          </form>
                        ) : (
                          <form onSubmit={handlePostBus} className="space-y-6">
                             <h3 className="font-black text-3xl text-slate-900 border-b border-slate-100 pb-5 mb-8">Send Bus Parcel</h3>
                             <div className="space-y-5">
                               <label className="text-xs font-bold text-slate-700 block uppercase tracking-widest">Route (Origin - Destination)</label>
                               <input type="text" placeholder="e.g. Patna - Delhi" value={newBus.route} onChange={(e: any)=>setNewBus({...newBus, route:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                               
                               <div className="grid grid-cols-2 gap-4">
                                 <div>
                                   <label className="text-xs font-bold text-slate-700 block pt-2 uppercase tracking-widest">Product Type</label>
                                   <input type="text" placeholder="e.g. Electronics" value={newBus.productType} onChange={(e: any)=>setNewBus({...newBus, productType:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                                 </div>
                                 <div>
                                   <label className="text-xs font-bold text-slate-700 block pt-2 uppercase tracking-widest">Weight (KG)</label>
                                   <input type="number" placeholder="Total KG" value={newBus.weight} onChange={(e: any)=>setNewBus({...newBus, weight:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                                 </div>
                               </div>

                               <label className="text-xs font-bold text-slate-700 block pt-4 uppercase tracking-widest">Select Service Type</label>
                               <div className="grid grid-cols-3 gap-4 mb-8">
                                  <div onClick={() => setNewBus({...newBus, serviceType: 'Fragile'})} className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-colors ${newBus.serviceType === 'Fragile' ? 'border-[#EA580C] bg-orange-50' : 'border-slate-200'}`}><Package className={`h-8 w-8 mx-auto mb-3 ${newBus.serviceType === 'Fragile' ? 'text-[#EA580C]' : 'text-slate-400'}`}/><div className="text-[10px] font-black uppercase tracking-wider">Fragile</div></div>
                                  <div onClick={() => setNewBus({...newBus, serviceType: 'Express'})} className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-colors ${newBus.serviceType === 'Express' ? 'border-[#EA580C] bg-orange-50' : 'border-slate-200'}`}><Truck className={`h-8 w-8 mx-auto mb-3 ${newBus.serviceType === 'Express' ? 'text-[#EA580C]' : 'text-slate-400'}`}/><div className="text-[10px] font-black uppercase tracking-wider">Express</div></div>
                                  <div onClick={() => setNewBus({...newBus, serviceType: 'Standard'})} className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-colors ${newBus.serviceType === 'Standard' ? 'border-[#EA580C] bg-orange-50' : 'border-slate-200'}`}><Box className={`h-8 w-8 mx-auto mb-3 ${newBus.serviceType === 'Standard' ? 'text-[#EA580C]' : 'text-slate-400'}`}/><div className="text-[10px] font-black uppercase tracking-wider">Standard</div></div>
                               </div>

                               <label className="text-xs font-bold text-slate-700 block pt-4 uppercase tracking-widest">Offered Total Price (₹)</label>
                               <input type="number" placeholder="₹" value={newBus.price} onChange={(e: any)=>setNewBus({...newBus, price:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                               
                               <button type="submit" className="w-full bg-[#0F172A] text-white font-black p-5 rounded-xl hover:bg-slate-800 transition-colors shadow-xl mt-8 text-lg">Post Parcel Demand</button>
                             </div>
                          </form>
                        )}
                      </div>
                      <div className="lg:col-span-2">
                        {renderLiveRadar()}
                      </div>
                   </div>
                 )}

                 {busTab === 'command_center' && renderLiveRadar()}
               </div>
             )}

             {/* MODULE: ENTERPRISE BIDS */}
             {activeModule === 'corporate' && (
               <div className="space-y-10 animate-fade-in">
                 <div className="bg-[#0F172A] text-white p-20 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden border border-slate-800">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#EA580C] rounded-full blur-[150px] opacity-20"></div>
                    <h2 className="text-6xl font-black mb-8 relative z-10 tracking-tight">Corporate Bidding & Reverse Auction</h2>
                    <p className="text-slate-300 font-medium text-xl relative z-10 max-w-3xl mx-auto leading-relaxed">Live bulk shipment auctions with real-time bidding for enterprise clients.</p>
                 </div>
                 
                 {selectedRole === 'corporate' && (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col md:flex-row gap-6 max-w-5xl mx-auto -mt-16 relative z-20">
                       <input type="text" placeholder="Demand (e.g. 50 Tons)" value={newBid.demand} onChange={(e: any)=>setNewBid({...newBid, demand:e.target.value})} className="flex-1 border border-slate-300 rounded-xl p-5 text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                       <input type="text" placeholder="Route (Origin-Dest)" value={newBid.route} onChange={(e: any)=>setNewBid({...newBid, route:e.target.value})} className="flex-1 border border-slate-300 rounded-xl p-5 text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                       <button type="button" onClick={handlePostBid} className="bg-[#EA580C] text-white px-12 py-5 rounded-xl font-black text-xl shadow-lg hover:bg-orange-700 transition-colors">List Auction</button>
                    </div>
                 )}

                 <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl mt-12">
                   <div className="p-8 border-b border-slate-200 bg-slate-50"><h3 className="font-black text-3xl text-slate-900">Active Auctions</h3></div>
                   <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse min-w-[900px]">
                       <thead className="bg-white border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-widest">
                         <tr><th className="p-8 pl-10">ID & Company</th><th className="p-8">Route / Demand</th><th className="p-8">Time Left</th><th className="p-8">L1 (Lowest Bid)</th><th className="p-8 text-right pr-10">Action</th></tr>
                       </thead>
                       <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100">
                         {safeBids.map((bid: any) => (
                           <tr key={bid.id} className="hover:bg-slate-50 transition-colors">
                             <td className="p-8 pl-10"><div className="font-black text-xl text-slate-900 mb-1">{bid.id}</div><div className="text-sm text-slate-500 font-bold">{bid.company}</div></td>
                             <td className="p-8"><div className="font-bold text-slate-900 text-lg">{bid.route}</div><div className="text-[10px] text-[#EA580C] font-black mt-2 bg-orange-50 border border-orange-100 w-fit px-3 py-1 rounded-full uppercase tracking-widest">{bid.demand}</div></td>
                             <td className="p-8 font-bold text-red-500 flex items-center mt-6 text-base"><Clock className="h-5 w-5 mr-2"/> {bid.time}</td>
                             <td className="p-8 font-black text-4xl text-slate-900">₹{bid.L1.toLocaleString('en-IN')}</td>
                             <td className="p-8 text-right pr-10"><button type="button" onClick={() => setNegotiationTarget({ type: 'bid', data: bid })} className="bg-[#0F172A] text-white px-10 py-4 rounded-xl text-sm font-black hover:bg-slate-800 transition-colors shadow-lg">View / Bid</button></td>
                           </tr>
                         ))}
                         {safeBids.length === 0 && <tr><td colSpan={5} className="p-16 text-center text-slate-500 font-bold text-lg">No active enterprise auctions.</td></tr>}
                       </tbody>
                     </table>
                   </div>
                 </div>
               </div>
             )}

             {/* MODULE: TRUCK ADS */}
             {activeModule === 'ads' && (
                <div className="space-y-16 animate-fade-in py-10 relative">
                   {(selectedRole === 'driver' || selectedRole === 'transporter') ? (
                      <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl max-w-5xl mx-auto px-10 relative">
                         {/* PREMIUM 3D DIGITAL MARKETING CARTOON */}
                         <img src="https://img.freepik.com/free-vector/digital-presentation-concept-illustration_114360-8451.jpg?w=800" className="mx-auto h-80 mb-10 object-contain drop-shadow-xl" alt="Digital Marketing Animated" />
                         <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 capitalize tracking-tight">Ad Platform Coming Soon</h2>
                         <p className="text-xl text-slate-500 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">We are actively tying up with leading corporates to bring you exclusive bonus income through truck advertising. We will launch soon!</p>
                         <button type="button" className="bg-[#EA580C] text-white px-12 py-5 rounded-xl font-black text-xl shadow-xl hover:bg-orange-700 transition-colors">Wait For Launch</button>
                      </div>
                   ) : (
                      <>
                         <div className="bg-[#0F172A] rounded-[3rem] p-20 text-center text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#EA580C] rounded-full blur-[150px] opacity-30"></div>
                            <h2 className="text-6xl font-black mb-8 relative z-10 tracking-tight">Reach Millions On The Move</h2>
                            <p className="text-2xl text-slate-300 font-medium max-w-4xl mx-auto relative z-10 leading-relaxed">
                              Transform our extensive fleet network into your moving billboards. High visibility, low CPM, and route-targeted advertising across India.
                            </p>
                         </div>

                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {['Rear Door Panel', 'Full Side Wrap', 'Cabin Crown'].map((p: string, i: number) => (
                               <div key={p} className={`bg-white rounded-[2.5rem] border overflow-hidden shadow-xl p-10 text-center flex flex-col justify-between hover:border-[#EA580C] transition-all group relative ${i===1?'border-4 border-[#EA580C] transform lg:-translate-y-6 shadow-2xl':'border-slate-200'}`}>
                                 {i===1 && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-[#EA580C] text-white text-[10px] font-black px-6 py-2 rounded-b-2xl uppercase tracking-widest shadow-md">Most Popular</div>}
                                 <div className="flex-1">
                                   <div className={`h-56 rounded-2xl mb-8 flex items-center justify-center border-2 border-dashed ${i===1?'bg-orange-50 border-orange-200':'bg-slate-50 border-slate-300'} mt-4`}><Truck className={`h-20 w-20 ${i===1?'text-[#EA580C]':'text-slate-400 group-hover:text-[#EA580C]'} transition-colors`}/></div>
                                   <h4 className="font-black text-3xl text-slate-900 mb-4">{t(p, p)}</h4>
                                   <p className="text-base text-slate-500 font-medium mb-10">Packages and placements vary according to requirement where they want placement and pay.</p>
                                 </div>
                                 <button type="button" onClick={() => openWhatsApp(`I want to place an ad: ${p}`)} className={`${i===1?'bg-[#EA580C]':'bg-[#0F172A]'} text-white px-8 py-5 rounded-xl font-black text-lg w-full hover:opacity-90 transition-opacity shadow-lg`}>Select Placement</button>
                               </div>
                            ))}
                         </div>

                         <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm mt-16">
                            <div className="text-center py-12 bg-slate-50 border-b border-slate-200"><h3 className="text-4xl font-black text-slate-900">Pricing & Packages</h3></div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-lg min-w-[600px]">
                                 <thead className="bg-[#0F172A] text-white">
                                    <tr><th className="p-8 pl-12 font-bold uppercase tracking-widest text-sm">Vehicle Type</th><th className="p-8 font-bold uppercase tracking-widest text-sm">Placement</th><th className="p-8 font-bold uppercase tracking-widest text-sm">Base Price / Month</th></tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                    <tr className="hover:bg-slate-50 transition-colors"><td className="p-8 pl-12">Box Truck</td><td className="p-8">Rear Door</td><td className="p-8 font-black text-2xl text-[#EA580C]">₹15,000</td></tr>
                                    <tr className="hover:bg-slate-50 transition-colors"><td className="p-8 pl-12">Semi-Trailer</td><td className="p-8">Side Panel</td><td className="p-8 font-black text-2xl text-[#EA580C]">₹35,000</td></tr>
                                    <tr className="hover:bg-slate-50 transition-colors"><td className="p-8 pl-12">Full Container</td><td className="p-8">Full Wrap</td><td className="p-8 font-black text-2xl text-[#EA580C]">₹80,000</td></tr>
                                 </tbody>
                              </table>
                            </div>
                         </div>
                      </>
                   )}
                </div>
             )}
             
             {/* MODULE: FLEET MANDI */}
             {activeModule === 'mandi' && (
                <div className="space-y-12 animate-fade-in py-10 relative">
                  
                  <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl max-w-5xl mx-auto px-10 relative">
                      {/* PREMIUM 3D E-COMMERCE CARTOON */}
                      <img src="https://img.freepik.com/free-vector/ecommerce-web-page-concept-illustration_114360-8204.jpg?w=800" className="mx-auto h-80 mb-10 object-contain drop-shadow-xl" alt="E-Commerce Animated" />
                      <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 capitalize tracking-tight">Marketplace Coming Soon</h2>
                      <p className="text-xl text-slate-500 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">We are tying up with big fuel and tire companies to bring you massive group buying discounts. Wait for the official launch!</p>
                      <button type="button" className="bg-[#EA580C] text-white px-12 py-5 rounded-xl font-black text-xl shadow-xl hover:bg-orange-700 transition-colors">Wait For Launch</button>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto -mt-16 mb-16 p-8 bg-white border border-slate-200 rounded-3xl shadow-2xl gap-8 relative z-20">
                    <div className="flex items-center space-x-4">
                      <div className="bg-orange-50 p-4 rounded-full border border-orange-100"><ShoppingBag className="h-8 w-8 text-[#EA580C]"/></div>
                      <p className="text-2xl text-slate-900 font-black">List Your Products plz click this</p>
                    </div>
                    <button type="button" onClick={() => openWhatsApp('I want to list my products')} className="bg-[#0F172A] w-full md:w-auto text-white px-10 py-5 rounded-xl text-lg font-black hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center">Direct WhatsApp <ArrowRight className="h-5 w-5 ml-3"/></button>
                  </div>

                  {/* Pinduoduo clone UI - Marked as Preview */}
                  <div className="bg-[#0F172A] rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative border border-slate-800 p-12 gap-10 opacity-40 select-none pointer-events-none">
                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black/80 px-10 py-5 rounded-2xl border border-slate-700 backdrop-blur-md">
                       <h2 className="text-white font-black text-3xl tracking-widest uppercase">Preview Only</h2>
                     </div>
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635767798638-3e2523d06eb1?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                     <div className="md:w-2/3 relative z-10 flex flex-col justify-center">
                        <div className="bg-[#EA580C] text-white w-fit px-5 py-2 rounded-full text-xs font-black tracking-widest mb-6 shadow-md flex items-center"><Flame className="h-4 w-4 mr-2"/> HOT GROUP BUY</div>
                        <h2 className="text-5xl font-black text-white mb-6 leading-tight">Premium Synthetic Engine Oil Drum</h2>
                        <p className="text-slate-300 text-xl mb-10 font-medium max-w-2xl leading-relaxed">Join 450+ fleet owners to unlock wholesale pricing on our top-tier lubricant. Guaranteed protection for heavy-duty engines.</p>
                        <div className="flex items-center space-x-6">
                          <div className="text-5xl font-black text-[#EA580C]">₹12,499 <span className="text-xl text-slate-400 line-through">₹18,000</span></div>
                          <button type="button" className="bg-[#EA580C] text-white px-8 py-4 rounded-xl text-base font-black shadow-lg flex items-center">Team Up to Save <ArrowRight className="h-5 w-5 ml-3"/></button>
                        </div>
                     </div>
                     <div className="md:w-1/3 flex items-center justify-center relative z-10">
                         <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full text-center">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">DEAL ENDS IN</p>
                            <div className="flex justify-center space-x-4 mb-8">
                              <div className="bg-slate-100 px-5 py-4 rounded-xl font-black text-3xl">14<span className="block text-xs text-slate-400 mt-1">HRS</span></div>
                              <div className="text-3xl font-bold text-slate-300 pt-3">:</div>
                              <div className="bg-slate-100 px-5 py-4 rounded-xl font-black text-3xl">45<span className="block text-xs text-slate-400 mt-1">MIN</span></div>
                              <div className="text-3xl font-bold text-slate-300 pt-3">:</div>
                              <div className="bg-red-50 text-red-600 px-5 py-4 rounded-xl font-black text-3xl">22<span className="block text-xs text-red-400 mt-1">SEC</span></div>
                            </div>
                            <div className="flex justify-between text-sm font-bold mb-3"><span>450 / 500</span><span className="text-slate-500">Joined</span></div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6"><div className="bg-[#EA580C] w-[90%] h-full"></div></div>
                         </div>
                     </div>
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-slate-200">
                    <h3 className="text-3xl font-black text-slate-900">Trending Deals</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 opacity-40 pointer-events-none select-none">
                    {mandiProducts.map((item: any) => (
                       <div key={item.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col">
                          <div className="h-56 overflow-hidden relative bg-slate-100 p-4 flex items-center justify-center border-b border-slate-100">
                            <img src={item.img} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 shadow-md" alt="" />
                            <div className="absolute top-6 right-6 bg-white p-2.5 rounded-full shadow-lg"><ShoppingBag className="h-4 w-4 text-[#EA580C]"/></div>
                          </div>
                          <div className="p-8 flex-1 flex flex-col justify-between">
                             <div>
                               <h4 className="font-black text-xl text-slate-900 mb-2">{item.name}</h4>
                               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border border-slate-200 w-fit px-2 py-1 rounded">{item.tag}</p>
                             </div>
                             <div>
                               <div className="flex justify-between items-end mb-6">
                                  <div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price</div><div className="text-3xl font-black text-[#EA580C]">₹{item.price}</div></div>
                                  <div className="text-right text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded border border-emerald-100"><CheckCircle2 className="h-4 w-4 inline mr-1"/>{item.stock}</div>
                               </div>
                               <button type="button" className="w-full bg-[#0F172A] text-white px-4 py-4 rounded-xl text-sm font-black transition-colors shadow-lg">Buy Now</button>
                             </div>
                          </div>
                       </div>
                    ))}
                  </div>
                </div>
              )}

          </div>
        )}

        {/* --- SUPPLEMENTARY PAGES --- */}

        {/* SERVICES PAGE (Restored Clickable UI) */}
        {activeView === 'services' && (
           <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-24 text-center animate-fade-in space-y-16 relative z-10">
              <BackToDashboardBtn />
              <div className="max-w-4xl mx-auto space-y-6">
                <span className="bg-[#EA580C]/10 text-[#EA580C] px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase border border-[#EA580C]/20 shadow-inner">How We Provide Services</span>
                <h2 className="text-5xl md:text-6xl font-black text-[#0F172A] tracking-tight leading-tight">Your Stories, Our Value</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-12 pt-12 text-left">
                {[
                  {i: Flame, t: 'Farmer Loss Returned', s: 'A farmer in Bihar was losing 30% of his tomato crop to spoilage due to slow transit and middlemen delays. Direct outstation truck matchmaking via LoadBhai solved his transit, eliminated middlemen cuts, and now he makes 50% more profit season on season.', img: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=600'},
                  {i: TrendingDown, t: 'Fleet Owner Success Story', s: 'A fleet owner with 10 trucks was struggling with empty returns, facing 30% revenue loss. By utilizing our live radar, he now finds loads within 2 hours, boosting his monthly revenue by 40% and eliminating empty miles completely.', img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600'},
                ].map((story: any) => (
                  <div key={story.t} className="bg-white rounded-[2rem] border overflow-hidden shadow-2xl flex flex-col group hover:border-[#EA580C] transition-all">
                      <div className="h-64 relative overflow-hidden">
                        <img src={story.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                      </div>
                      <div className="p-10 flex-1 space-y-4">
                        <div className="flex items-center space-x-3 text-[#EA580C]"><story.i className="h-8 w-8"/><h3 className="font-black text-2xl text-slate-900 capitalize tracking-tight">{story.t}</h3></div>
                        <p className="text-slate-600 text-base font-medium leading-relaxed">{story.s}</p>
                      </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {/* SAFE QR PAGE (Accessed from Drawer) */}
        {activeView === 'safe_qr' && (
           <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-20 animate-fade-in relative z-10">
              <BackToDashboardBtn />
              <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-2xl border border-slate-200 text-center mt-10">
                 {!allDocsUploaded ? (
                    <>
                       <div className="bg-orange-50 w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-lg">
                          <QrCode className="h-16 w-16 text-[#EA580C] animate-pulse"/>
                       </div>
                       <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Safe Traffic QR</h2>
                       <p className="text-slate-500 font-medium mb-16 max-w-3xl mx-auto text-xl leading-relaxed">
                         Upload your critical documents to generate a unique QR code. Streamline police cross-checks from 15 minutes to seconds, and protect yourself against highway scams.
                       </p>
                       <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                         {['Driving License', 'Vehicle Registration (RC)', 'Insurance Policy', 'Route Permit'].map((doc: string) => {
                           const docKey = doc.toLowerCase().includes('dl') ? 'dl' : doc.toLowerCase().includes('rc') ? 'rc' : doc.toLowerCase().includes('insur') ? 'ins' : 'permit';
                           const isUploaded = qrDocs[docKey as keyof typeof qrDocs];
                           return (
                             <label key={doc} className={`border-2 border-dashed p-8 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${isUploaded ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-300 hover:bg-slate-50 hover:border-[#EA580C]'}`}>
                               <div>
                                 <h4 className={`font-black text-xl ${isUploaded ? 'text-emerald-700' : 'text-slate-800'}`}>{doc}</h4>
                                 <p className="text-sm text-slate-500 font-medium mt-1">{isUploaded ? 'Document Verified' : 'Click to upload PDF/Image'}</p>
                                 {isUploaded && <p className="text-xs text-emerald-600 font-black mt-3 bg-emerald-100 w-fit px-3 py-1 rounded-full"><CheckCircle2 className="h-4 w-4 inline mr-1"/> Ready</p>}
                               </div>
                               {isUploaded ? <CheckCircle2 className="h-10 w-10 text-emerald-500" /> : <Upload className="h-10 w-10 text-slate-400" />}
                               <input type="file" className="hidden" onChange={(e: any) => {
                                 if (e.target.files && e.target.files.length > 0) {
                                    setQrDocs({...qrDocs, [docKey]: true});
                                 }
                               }} />
                             </label>
                           );
                         })}
                       </div>
                    </>
                 ) : (
                    <div className="animate-fade-in py-10">
                       <div className="bg-emerald-500 w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 shadow-lg">
                          <Check className="h-12 w-12 text-white"/>
                       </div>
                       <h2 className="text-4xl font-black text-slate-900 mb-4">All Documents Verified</h2>
                       <p className="text-slate-500 font-medium mb-12 text-lg">Your Safe QR code is ready for highway inspections.</p>
                       
                       <div className="bg-white p-10 border-4 border-[#0F172A] rounded-[3rem] w-fit mx-auto shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0F172A] text-white px-6 py-2 rounded-full font-black tracking-widest text-sm uppercase">LoadBhai Verified</div>
                          <QrCode className="h-64 w-64 text-[#0F172A] mx-auto"/>
                          <p className="text-sm font-bold text-slate-400 mt-6 tracking-widest uppercase">ID: LDB-{Math.floor(Math.random() * 900000)}</p>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* ABOUT US */}
        {activeView === 'about' && (
           <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-24 text-center animate-fade-in space-y-24 relative z-10">
              <BackToDashboardBtn />
              <div className="max-w-4xl mx-auto space-y-8">
                <span className="bg-[#0F172A] text-white px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-lg">The Future of Freight</span>
                <h2 className="text-5xl md:text-7xl font-black text-[#0F172A] tracking-tight leading-[1.1]">Revolutionizing Logistics through <span className="text-[#EA580C]">Transparency.</span></h2>
                <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
                  We are building the digital backbone of the global supply chain. Connecting fleets, simplifying freight, and delivering absolute clarity to B2B stakeholders everywhere.
                </p>
              </div>
              
              <div className="space-y-12">
                 <div className="text-center"><h3 className="text-4xl font-black text-slate-900 mb-4">Driven by Purpose</h3><p className="text-slate-500 font-medium text-lg">Our foundation is built on cutting-edge corporate modernism.</p></div>
                 <div className="grid md:grid-cols-2 gap-10 text-left">
                    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-shadow">
                       <Activity className="h-12 w-12 text-[#EA580C] mb-8 bg-orange-50 p-3 rounded-2xl border border-orange-100"/>
                       <h3 className="font-black text-2xl mb-4 text-slate-900">Our Mission</h3>
                       <p className="text-base font-medium text-slate-500 leading-relaxed">To eliminate friction in the global logistics network by providing a unified, high-scale platform. We empower carriers and shippers with real-time data, ensuring every load is moved with maximum efficiency.</p>
                    </div>
                    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-shadow">
                       <Eye className="h-12 w-12 text-[#EA580C] mb-8 bg-orange-50 p-3 rounded-2xl border border-orange-100"/>
                       <h3 className="font-black text-2xl mb-4 text-slate-900">Our Vision</h3>
                       <p className="text-base font-medium text-slate-500 leading-relaxed">A fully interconnected freight ecosystem where opacity is obsolete, and predictive intelligence drives strategic logistics decisions. Aligned with India's goal to reduce logistics costs to 9% of GDP.</p>
                    </div>
                    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-shadow">
                       <ShieldCheck className="h-12 w-12 text-[#0F172A] mb-8 bg-slate-100 p-3 rounded-2xl border border-slate-200"/>
                       <h3 className="font-black text-2xl mb-4 text-slate-900">Enterprise Reliability</h3>
                       <p className="text-base font-medium text-slate-500 leading-relaxed">Bank-grade security and 99.99% uptime for operations that never sleep.</p>
                    </div>
                    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-shadow">
                       <Layers className="h-12 w-12 text-[#0F172A] mb-8 bg-slate-100 p-3 rounded-2xl border border-slate-200"/>
                       <h3 className="font-black text-2xl mb-4 text-slate-900">Partner Ecosystem</h3>
                       <p className="text-base font-medium text-slate-500 leading-relaxed">Fostering deep collaborations between independent fleets and global hubs.</p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* PRICING PAGE */}
        {activeView === 'premium' && (
           <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-24 text-center animate-fade-in space-y-16 relative z-10">
              <BackToDashboardBtn />
              <div className="max-w-3xl mx-auto space-y-6">
                <span className="bg-[#0F172A]/10 text-[#0F172A] px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase border border-[#0F172A]/20 shadow-inner">Pricing Plans</span>
                <h2 className="text-5xl md:text-6xl font-black text-[#0F172A] tracking-tight leading-tight">Simple, Transparent Pricing</h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">Power your logistics business with plans designed for single drivers, growing fleets, and large-scale enterprises.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 pt-12 text-left">
                 {/* Starter Plan */}
                 <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-lg flex flex-col h-full hover:shadow-2xl hover:border-[#EA580C] hover:-translate-y-2 transition-all cursor-pointer group">
                    <h3 className="font-black text-3xl text-slate-900 mb-4 group-hover:text-[#EA580C] transition-colors">Starter</h3>
                    <div className="text-6xl font-black text-slate-900 mb-8">₹0<span className="text-xl text-slate-400 font-bold">/mo</span></div>
                    <button type="button" className="w-full bg-slate-100 text-slate-700 font-black py-4.5 rounded-xl mb-10 hover:bg-slate-200 transition-colors text-lg">Current Plan</button>
                    <ul className="space-y-6 text-base font-bold text-slate-600 flex-1">
                      <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-slate-300 mr-4 shrink-0"/> Standard route visibility</li>
                      <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-slate-300 mr-4 shrink-0"/> ₹1500 Match Fee applies per load</li>
                    </ul>
                 </div>

                 {/* Growth Plan (Recommended) */}
                 <div className="bg-[#0F172A] text-white p-12 rounded-[2.5rem] shadow-2xl transform md:-translate-y-8 relative flex flex-col h-full hover:shadow-[0_0_40px_rgba(234,88,12,0.3)] hover:-translate-y-10 transition-all cursor-pointer border border-[#0F172A]">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#EA580C] text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg">Recommended</div>
                    <h3 className="font-black text-3xl text-white mb-4">Platinum</h3>
                    <div className="text-6xl font-black text-white mb-8">₹999<span className="text-xl text-slate-400 font-bold">/mo</span></div>
                    <button type="button" className="w-full bg-[#EA580C] text-white font-black py-4.5 rounded-xl mb-10 shadow-lg hover:bg-orange-700 transition-colors text-lg">Upgrade Now</button>
                    <ul className="space-y-6 text-base font-bold text-slate-300 flex-1">
                      <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-[#EA580C] mr-4 shrink-0"/> Zero Commission on 50 loads</li>
                      <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-[#EA580C] mr-4 shrink-0"/> Dedicated Account Manager</li>
                      <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-[#EA580C] mr-4 shrink-0"/> Live GPS Tracking Access</li>
                    </ul>
                 </div>

                 {/* Enterprise Plan */}
                 <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-lg flex flex-col h-full hover:shadow-2xl hover:border-[#0F172A] hover:-translate-y-2 transition-all cursor-pointer group">
                    <h3 className="font-black text-3xl text-slate-900 mb-4 group-hover:text-[#0F172A] transition-colors">Enterprise</h3>
                    <div className="text-6xl font-black text-slate-900 mb-8">Custom</div>
                    <button type="button" className="w-full bg-[#0F172A] text-white font-black py-4.5 rounded-xl mb-10 hover:bg-slate-800 transition-colors shadow-md text-lg">Contact Sales</button>
                    <ul className="space-y-6 text-base font-bold text-slate-600 flex-1">
                      <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-slate-300 mr-4 shrink-0 group-hover:text-[#0F172A] transition-colors"/> Full API Integrations</li>
                      <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-slate-300 mr-4 shrink-0 group-hover:text-[#0F172A] transition-colors"/> Custom Fleet Management</li>
                    </ul>
                 </div>
              </div>
           </div>
        )}

        {/* --- NEGOTIATION MODAL --- */}
        {negotiationTarget && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-2xl p-8 relative shadow-2xl pointer-events-auto">
              <button type="button" onClick={() => setNegotiationTarget(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-900"><X className="h-5 w-5" /></button>
              <h3 className="text-xl font-black text-slate-900 mb-4">Place Your Bid - {negotiationTarget.data.id}</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm mb-6 font-bold text-slate-600">
                 <div>{negotiationTarget.data.route}</div>
                 <div className="mt-1">Current L1: <span className="text-[#EA580C] text-lg font-black">₹{negotiationTarget.data.L1.toLocaleString('en-IN')}</span></div>
              </div>
              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold text-slate-600 uppercase">Your Counter Bid</label>
                <input type="number" value={counterOffer} onChange={(e: any) => setCounterOffer(e.target.value)} placeholder="Amount (INR)" className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm font-bold outline-none focus:border-[#EA580C] shadow-inner" />
              </div>
              <button type="button" onClick={processBid} className="w-full bg-[#EA580C] text-white font-black text-sm py-4 rounded-xl hover:bg-orange-700 transition-all shadow-md">Submit Bid</button>
            </div>
          </div>
        )}

        {/* CONTACT PAGE WITH CHATBOT & FAQ */}
        {activeView === 'contact' && (
          <div className="max-w-[1400px] mx-auto px-6 py-24 animate-fade-in relative z-10">
             <BackToDashboardBtn />
             <div className="text-center mb-16 mt-8">
                 <h2 className="text-5xl font-black text-slate-900 mb-6">Contact & Support</h2>
                 <p className="text-xl text-slate-500 font-medium">We're here to help you 24/7 with your logistics needs.</p>
             </div>
             <div className="grid lg:grid-cols-2 gap-16">
                {/* Left: Contact Info & Chatbot */}
                <div className="space-y-12">
                   <div className="bg-[#0F172A] p-12 rounded-[3rem] shadow-2xl text-white relative overflow-hidden hover:scale-[1.02] transition-transform cursor-default">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#EA580C] rounded-full blur-[100px] opacity-30"></div>
                      <PhoneCall className="h-16 w-16 text-[#EA580C] mb-6"/>
                      <h3 className="text-3xl font-black mb-2">Call Our Helpdesk</h3>
                      <p className="text-slate-400 font-medium mb-8">Available Mon-Sat, 9 AM to 8 PM</p>
                      <div className="text-5xl font-black text-[#EA580C] tracking-tight">+91 82101 60012</div>
                   </div>

                   <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-200">
                      <div className="flex items-center space-x-5 mb-8 pb-8 border-b border-slate-100">
                         <div className="bg-orange-50 p-4 rounded-full"><Bot className="h-10 w-10 text-[#EA580C]"/></div>
                         <div>
                            <h4 className="font-black text-2xl text-slate-900">LoadBhai AI Assistant</h4>
                            <p className="text-sm font-bold text-emerald-500 flex items-center mt-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span> Online Now</p>
                         </div>
                      </div>
                      <div className="bg-slate-50 rounded-3xl p-8 h-72 overflow-y-auto mb-8 space-y-4 border border-slate-100 shadow-inner">
                         <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm w-fit border border-slate-200">
                            <p className="text-base font-bold text-slate-700">Namaste! How can I help you today with your logistics?</p>
                         </div>
                      </div>
                      <div className="flex items-center bg-white border border-slate-300 rounded-2xl p-3 shadow-inner">
                         <input type="text" placeholder="Type your message..." className="flex-1 outline-none px-5 py-3 text-base font-bold text-slate-700"/>
                         <button type="button" className="bg-[#EA580C] p-4 rounded-xl text-white hover:bg-orange-700 shadow-md transition-colors"><Send className="h-6 w-6"/></button>
                      </div>
                   </div>
                </div>

                {/* Right: FAQs */}
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-200 h-fit">
                   <h3 className="text-3xl font-black text-slate-900 mb-10 flex items-center"><HelpCircle className="h-10 w-10 text-[#EA580C] mr-5"/> Frequently Asked Questions</h3>
                   <div className="space-y-6">
                      {[
                        {q: "How does 'Empowering Transporters' work?", a: "We empower transporters by removing middlemen. You connect directly with the shipper, meaning 100% of the negotiated fare goes to you."},
                        {q: "How to generate Safe QR?", a: "Go to your Profile Drawer > Security QR. Upload your DL, RC, and Permit. Once verified, a unique QR is generated to speed up highway police checks."},
                        {q: "How can I bid on Enterprise Loads?", a: "Register as a 'Corporate' or 'Transporter'. Go to the Enterprise Auctions tab in your dashboard, view active demands, and place your lowest competitive bid (L1)."},
                        {q: "What is Fleet Mandi?", a: "It's our group-buying marketplace. By combining the purchasing power of thousands of fleet owners, we negotiate wholesale prices for engine oil, tires, and spare parts."}
                      ].map((faq: any, i: number) => (
                         <details key={i} className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <summary className="p-6 font-black text-xl text-slate-800 cursor-pointer list-none flex justify-between items-center group-open:bg-orange-50 group-open:text-[#EA580C] transition-colors">
                               {faq.q}
                               <Plus className="h-6 w-6 group-open:rotate-45 transition-transform text-slate-400 group-open:text-[#EA580C]"/>
                            </summary>
                            <div className="p-6 pt-0 text-slate-600 font-medium text-lg leading-relaxed bg-orange-50">
                               {faq.a}
                            </div>
                         </details>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* OTHER FALLBACKS */}
        {(activeView === 'history' || activeView === 'settings') && (
           <div className="max-w-[800px] mx-auto px-6 py-24 text-center animate-fade-in relative z-10">
              <BackToDashboardBtn />
              <div className="bg-white p-16 rounded-[3rem] border border-slate-200 shadow-2xl mt-10">
                 <div className="h-28 w-28 bg-slate-50 border border-slate-100 rounded-full mx-auto flex items-center justify-center mb-10 shadow-inner"><Settings className="h-12 w-12 text-[#EA580C]"/></div>
                 <h2 className="text-5xl font-black text-slate-900 mb-5 capitalize tracking-tight">{activeView.replace('_', ' ')} Module</h2>
                 <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-xl mx-auto">This section is securely integrated into the backend architecture and requires appropriate permissions to view raw data.</p>
              </div>
           </div>
        )}

      </main>

      {/* --- MEGA FOOTER --- */}
      <footer className="bg-[#0B1120] text-slate-400 py-20 px-6 relative z-10 border-t-4 border-[#EA580C] mt-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handlePageChange('landing')}>
              <Truck className="h-10 w-10 text-[#EA580C]" />
              <span className="text-3xl font-black text-white tracking-tight">Load<span className="text-[#EA580C]">Bhai</span></span>
            </div>
            <p className="text-sm font-medium leading-relaxed">Empowering Transporters. Pure Profits. India's Logistics Backbone built for scale and transparency.</p>
            <div className="flex space-x-4 pt-2">
              <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white cursor-pointer hover:bg-[#EA580C] transition-all hover:scale-110 font-bold">f</span>
              <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white cursor-pointer hover:bg-[#EA580C] transition-all hover:scale-110 font-bold">in</span>
              <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white cursor-pointer hover:bg-[#EA580C] transition-all hover:scale-110 font-bold">X</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-black mb-8 text-xl tracking-wide">Company</h4>
            <ul className="space-y-5 text-base font-medium">
              <li><button type="button" onClick={() => handlePageChange('about')} className="hover:text-[#EA580C] transition-colors">About Us</button></li>
              <li><button type="button" onClick={() => handlePageChange('support')} className="hover:text-[#EA580C] transition-colors">Contact Support</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-black mb-8 text-xl tracking-wide">Platform</h4>
            <ul className="space-y-5 text-base font-medium">
              <li><button type="button" onClick={() => handlePageChange('premium')} className="hover:text-[#EA580C] transition-colors">Pricing Plans</button></li>
              <li><button type="button" onClick={() => handlePageChange('services')} className="hover:text-[#EA580C] transition-colors">Services Hub</button></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-black mb-8 text-xl tracking-wide">Newsletter</h4>
            <div className="flex border-2 border-slate-800 rounded-2xl overflow-hidden focus-within:border-[#EA580C] transition-colors bg-black/50 p-1">
              <input type="email" placeholder="Enter Email Address" className="bg-transparent px-6 py-4 text-base outline-none w-full text-white font-medium" />
              <button type="button" className="bg-[#EA580C] text-white px-8 text-sm font-black rounded-xl hover:bg-orange-700 transition-colors shadow-lg">Subscribe</button>
            </div>
          </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto mt-20 pt-10 border-t border-slate-800/50 text-sm flex flex-col md:flex-row justify-between items-center text-slate-500 font-bold">
          <p>LoadBhai Logistics Tech © {new Date().getFullYear()} All rights reserved.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
             <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
             <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes headerFade { 
          0%, 15% { opacity: 1; transform: translateY(0); } 
          20%, 100% { opacity: 0; transform: translateY(-20px); } 
        }
        @keyframes ken-burns {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-ken-burns {
          animation: ken-burns 30s ease-in-out infinite alternate;
        }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        @keyframes truckMoveDynamic { 0% { transform: translate(200px, 300px); } 100% { transform: translate(600px, 300px); } }
        .animate-truck-move-dynamic { animation: truckMoveDynamic 4s linear infinite alternate; }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}