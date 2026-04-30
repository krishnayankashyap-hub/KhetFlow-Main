import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, addDoc, query, where, serverTimestamp, increment, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  Leaf, Package, ShoppingBag, Clock, LogOut, Plus, Trash2, X, Download, 
  QrCode, ChevronRight, UploadCloud, TrendingUp, MapPin, Phone, User, 
  Zap, Check, IndianRupee, CloudRain, Sun, Wind, Droplets, Calendar, Globe,
  Camera, Aperture, Wand2, ScanLine, Settings, AlertCircle, CreditCard, Landmark,
  ShieldCheck, TrendingDown, Percent, Info, Sprout, Briefcase, MessageCircle, Send, HelpCircle, Bot, MessageSquare,
  Truck, Users, ArrowRight, Timer, Search, BarChart3, Map, Navigation, CheckCircle2
} from 'lucide-react';

// ==========================================
// 0. LANGUAGE & TRANSLATIONS
// ==========================================
const LanguageContext = createContext();

const TRANSLATIONS = {
  en: {
    app_name: "KhetFlow Rider",
    welcome: "Welcome Back",
    become_rider: "Become a Rider",
    login_subtitle: "Enter details to access orders",
    register_subtitle: "Fill form to join fleet",
    login: "Login",
    register: "Register",
    create_account: "Create Account",
    dont_have_account: "Don't have an account?",
    already_have_account: "Already have an account?",
    full_name: "Full Name",
    phone: "Phone Number",
    vehicle_type: "Vehicle Type",
    plate_no: "Plate No.",
    online: "Online",
    offline: "Offline",
    total_earnings: "TOTAL EARNINGS",
    deliveries: "Deliveries",
    rating: "Rating",
    logout: "Logout",
    report_issue: "Report Issue",
    tab_new: "New",
    tab_farm: "To Farm",
    tab_drop: "Delivering",
    tab_done: "Done",
    tab_pool: "Pooling",
    status_waiting: "WAITING FOR RIDER",
    status_go_farm: "GO TO FARM",
    status_on_way: "ON THE WAY",
    status_completed: "COMPLETED",
    btn_accept: "Accept",
    btn_verify: "Verify Pickup",
    btn_finish: "Finish",
    btn_cancel: "Cancel",
    btn_submit: "Submit",
    quality_check: "Quality Check",
    confirm_delivery: "Confirm Delivery",
    upload_proof: "Upload Payment Proof",
    earnings_history: "Earnings History",
    report_title: "Report an Issue",
    issue_type: "Issue Type",
    desc: "Description",
    alert_offline: "🔴 You are currently Offline. Go Online to see new orders.",
    no_orders: "No orders in this section.",
    fastest_growing: "Fastest growing delivery network",
    // Pooling
    pool_title: "Transport Pooling",
    create_pool: "Create Pool",
    join_pool: "Join Pool",
    capacity: "Capacity",
    filled: "Filled",
    farmers_joined: "Farmers/Riders",
    route: "Route",
    status_full: "FULL",
    status_open: "OPEN",
    btn_create_route: "Create Route",
    btn_add_goods: "Add Goods",
    departure_time: "Departure Time",
    btn_receive_cargo: "Receive Transferred Cargo"
  },
  hi: {
    app_name: "खेत-फ्लो राइडर",
    welcome: "वापसी पर स्वागत है",
    become_rider: "राइडर बनें",
    login_subtitle: "ऑर्डर देखने के लिए लॉगिन करें",
    register_subtitle: "जुड़ने के लिए फॉर्म भरें",
    login: "लॉगिन",
    register: "रजिस्टर",
    create_account: "खाता बनाएं",
    dont_have_account: "खाता नहीं है?",
    already_have_account: "पहले से खाता है?",
    full_name: "पूरा नाम",
    phone: "फ़ोन नंबर",
    vehicle_type: "वाहन प्रकार",
    plate_no: "गाड़ी नंबर",
    online: "ऑनलाइन",
    offline: "ऑफलाइन",
    total_earnings: "कुल कमाई",
    deliveries: "डिलीवरी",
    rating: "रेटिंग",
    logout: "लॉगआउट",
    report_issue: "समस्या बताएं",
    tab_new: "नये",
    tab_farm: "फार्म जाओ",
    tab_drop: "रास्ते में",
    tab_done: "पूर्ण",
    tab_pool: "पूलिंग",
    status_waiting: "राइडर का इंतज़ार",
    status_go_farm: "फार्म पर जाएं",
    status_on_way: "रास्ते में है",
    status_completed: "पूरा हुआ",
    btn_accept: "स्वीकार करें",
    btn_verify: "सत्यापित करें",
    btn_finish: "समाप्त करें",
    btn_cancel: "रद्द करें",
    btn_submit: "जमा करें",
    quality_check: "गुणवत्ता जाँच",
    confirm_delivery: "डिलीवरी की पुष्टि",
    upload_proof: "भुगतान सबूत अपलोड करें",
    earnings_history: "कमाई का इतिहास",
    report_title: "समस्या रिपोर्ट करें",
    issue_type: "समस्या का प्रकार",
    desc: "विवरण",
    alert_offline: "आप अभी ऑफलाइन हैं। नए ऑर्डर देखने के लिए ऑनलाइन आएं।",
    no_orders: "यहाँ कोई ऑर्डर नहीं है।",
    fastest_growing: "सबसे तेजी से बढ़ता डिलीवरी नेटवर्क",
    // Pooling
    pool_title: "परिवहन पूलिंग",
    create_pool: "पूल बनाएं",
    join_pool: "पूल में जुड़ें",
    capacity: "क्षमता",
    filled: "भरा हुआ",
    farmers_joined: "किसान/राइडर्स",
    route: "रूट",
    status_full: "पूर्ण",
    status_open: "खुला है",
    btn_create_route: "रूट बनाएं",
    btn_add_goods: "सामान जोड़ें",
    departure_time: "प्रस्थान का समय",
    btn_receive_cargo: "स्थानांतरित माल प्राप्त करें"
  },
  as: {
    heroSubtitle: 'অসম্পূৰ্ণ উৎপাদনক সঠিক লাভলৈ পৰিৱৰ্তন কৰক',
    heroDesc: 'গ্ৰেড বি আৰু চি সামগ্ৰী বিক্ৰী কৰক যি নহলে নষ্ট হৈ যাব। শূন্য আৱৰ্জনা, উন্নত আয়।',
    startSelling: 'এতিয়াই বিক্ৰী আৰম্ভ কৰক',
    betterPrices: 'উন্নত দাম',
    zeroWaste: 'শূন্য আৱৰ্জনা',
    happyBuyers: 'সুখী ক্ৰেতা',
    welcomeBack: 'স্বাগতম',
    joinKhetFlow: 'KhetFlow ত যোগদান কৰক',
    loginDesc: 'আপোনাৰ কৃষি পৰিচালনা কৰিবলৈ লগ ইন কৰক',
    regDesc: 'অধিক উপাৰ্জন কৰিবলৈ পঞ্জীয়ন কৰক',
    yourName: 'আপোনাৰ নাম',
    farmName: 'খেতিৰ নাম',
    email: 'ইমেইল ঠিকনা',
    password: 'পাছৱৰ্ড',
    phone: 'ফোন নম্বৰ',
    location: 'খেতিৰ স্থান',
    login: 'লগ ইন',
    createAccount: 'একাউণ্ট সৃষ্টি কৰক',
    dontHaveAcc: "একাউণ্ট নাই নেকি?",
    alreadyHaveAcc: "ইতিমধ্যে একাউণ্ট আছে?",
    createFarmerAcc: 'কৃষকৰ একাউণ্ট খোলক',
    loginHere: 'ইয়াত লগ ইন কৰক',
    listings: 'তালিকা',
    orders: 'অৰ্ডাৰ',
    payments: 'পেমেন্ট',
    active: 'সক্ৰিয়',
    earned: 'উপাৰ্জন',
    pending: 'বাকী',
    yourHarvest: 'আপোনাৰ ফচল',
    addProduct: 'সামগ্ৰী যোগ কৰক',
    addNewListing: 'নতুন তালিকা যোগ কৰক',
    prodName: 'সামগ্ৰীৰ নাম',
    qty: 'পৰিমাণ (কেজি)',
    price: 'দাম / কেজি (₹)',
    grade: 'গ্ৰেড',
    desc: 'বিৱৰণ',
    publish: 'প্ৰকাশ কৰক',
    noListings: 'কোনো তালিকা নাই',
    createFirst: 'প্ৰথম তালিকা সৃষ্টি কৰক',
    receivedOrders: 'প্ৰাপ্ত অৰ্ডাৰ',
    paymentHistory: 'পেমেন্টৰ ইতিহাস',
    farmerDash: 'কৃষক ডেশ্ববৰ্ড',
    aiScan: 'AI স্কেন',
    scanProduce: 'সামগ্ৰী স্কেন কৰক',
    khetScore: 'খেত স্কোৰ',
    creditHistory: 'ক্ৰেডিট ইতিহাস',
    loanEligible: 'ঋণৰ যোগ্যতা',
    scoreGood: 'ভাল',
    scoreLow: 'উন্নতিৰ প্ৰয়োজন',
    scoreExcellent: 'অতি উত্তম',
    buildScore: 'স্কোৰ বঢ়াবলৈ অধিক বিক্ৰী কৰক',
    transport: 'পৰিবহণ',
    shareTruck: 'ট্ৰাক ভাগ কৰক',
    availablePools: 'উপলব্ধ ট্ৰাক',
    joinPool: 'যোগদান কৰক',
    capacityLeft: 'বাকী থকা ক্ষমতা',
    mandiRates: 'বজাৰৰ দৰ',
    mandi: 'মাণ্ডি',
    searchCrop: 'শস্য বিচাৰক...',
    priceTrend: 'দৰৰ প্ৰৱণতা'
  },
  pa: {
    heroSubtitle: 'ਅਧੂਰੀ ਉਪਜ ਨੂੰ ਪੂਰੇ ਮੁਨਾਫੇ ਵਿੱਚ ਬਦਲੋ',
    heroDesc: 'ਗ੍ਰੇਡ ਬੀ ਅਤੇ ਸੀ ਉਪਜ ਵੇਚੋ ਜੋ ਨਹੀਂ ਤਾਂ ਵਿਅਰਥ ਜਾਵੇਗੀ। ਜ਼ੀਰੋ ਵੇਸਟ, ਬਿਹਤਰ ਆਮਦਨ।',
    startSelling: 'ਹੁਣੇ ਵੇਚਣਾ ਸ਼ੁਰੂ ਕਰੋ',
    betterPrices: 'ਵਧੀਆ ਕੀਮਤਾਂ',
    zeroWaste: 'ਜ਼ੀਰੋ ਵੇਸਟ',
    happyBuyers: 'ਖੁਸ਼ ਖਰੀਦਦਾਰ',
    welcomeBack: 'ਜੀ ਆਇਆਂ ਨੂੰ',
    joinKhetFlow: 'ਖੇਤਫਲੋ ਨਾਲ ਜੁੜੋ',
    loginDesc: 'ਆਪਣੀ ਫਸਲ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰਨ ਲਈ ਲੌਗਇਨ ਕਰੋ',
    regDesc: 'ਵਧੇਰੇ ਕਮਾਈ ਕਰਨ ਲਈ ਰਜਿਸਟਰ ਕਰੋ',
    yourName: 'ਤੁਹਾਡਾ ਨਾਮ',
    farmName: 'ਖੇਤ ਦਾ ਨਾਮ',
    email: 'ਈਮੇਲ ਪਤਾ',
    password: 'ਪਾਸਵਰਡ',
    phone: 'ਫੋਨ ਨੰਬਰ',
    location: 'ਖੇਤ ਦਾ ਟਿਕਾਣਾ',
    login: 'ਲੌਗਇਨ',
    createAccount: 'ਖਾਤਾ ਬਣਾਓ',
    dontHaveAcc: "ਕੀ ਖਾਤਾ ਨਹੀਂ ਹੈ?",
    alreadyHaveAcc: "ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ?",
    createFarmerAcc: 'ਕਿਸਾਨ ਖਾਤਾ ਬਣਾਓ',
    loginHere: 'ਇੱਥੇ ਲੌਗਇਨ ਕਰੋ',
    listings: 'ਸੂਚੀਆਂ',
    orders: 'ਆਰਡਰ',
    payments: 'ਭੁਗਤਾਨ',
    active: 'ਸਰਗਰਮ',
    earned: 'ਕਮਾਈ',
    pending: 'ਬਕਾਇਆ',
    yourHarvest: 'ਤੁਹਾਡੀ ਫਸਲ',
    addProduct: 'ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ',
    addNewListing: 'ਨਵੀਂ ਸੂਚੀ ਸ਼ਾਮਲ ਕਰੋ',
    prodName: 'ਉਤਪਾਦ ਦਾ ਨਾਮ',
    qty: 'ਮਾਤਰਾ (ਕਿਲੋ)',
    price: 'ਕੀਮਤ / ਕਿਲੋ (₹)',
    grade: 'ਗ੍ਰੇਡ',
    desc: 'ਵੇਰਵਾ',
    publish: 'ਸੂਚੀ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ',
    noListings: 'ਅਜੇ ਕੋਈ ਸੂਚੀ ਨਹੀਂ',
    createFirst: 'ਪਹਿਲੀ ਸੂਚੀ ਬਣਾਓ',
    receivedOrders: 'ਪ੍ਰਾਪਤ ਆਰਡਰ',
    paymentHistory: 'ਭੁਗਤਾਨ ਇਤਿਹਾਸ',
    farmerDash: 'ਕਿਸਾਨ ਡੈਸ਼ਬੋਰਡ',
    aiScan: 'AI ਸਕੈਨ',
    scanProduce: 'ਉਪਜ ਸਕੈਨ ਕਰੋ',
    khetScore: 'ਖੇਤ ਸਕੋਰ',
    creditHistory: 'ਕ੍ਰੈਡਿਟ ਇਤਿਹਾਸ',
    loanEligible: 'ਕਰਜ਼ਾ ਯੋਗਤਾ',
    scoreGood: 'ਵਧੀਆ',
    scoreLow: 'ਸੁਧਾਰ ਦੀ ਲੋੜ',
    scoreExcellent: 'ਬਹੁਤ ਵਧੀਆ',
    buildScore: 'ਸਕੋਰ ਵਧਾਉਣ ਲਈ ਹੋਰ ਵੇਚੋ',
    transport: 'ਆਵਾਜਾਈ',
    shareTruck: 'ਟਰੱਕ ਸਾਂਝਾ ਕਰੋ',
    availablePools: 'ਉਪਲਬਧ ਟਰੱਕ',
    joinPool: 'ਸ਼ਾਮਲ ਹੋਵੋ',
    capacityLeft: 'ਬਾਕੀ ਸਮਰੱਥਾ',
    mandiRates: 'ਮੰਡੀ ਦੇ ਭਾਅ',
    mandi: 'ਮੰਡੀ',
    searchCrop: 'ਫਸਲ ਖੋਜੋ...',
    priceTrend: 'ਕੀਮਤ ਦਾ ਰੁਝਾਨ'
  },
  ur: {
    heroSubtitle: 'نامکمل پیداوار کو مکمل منافع میں بدلیں',
    heroDesc: 'گریڈ بی اور سی کی پیداوار بیچیں جو ورنہ ضائع ہو جاتی۔ صفر فضلہ، بہتر آمدنی۔',
    startSelling: 'اب بیچنا شروع کریں',
    betterPrices: 'بہتر قیمتیں',
    zeroWaste: 'صفر فضلہ',
    happyBuyers: 'خوش خریدار',
    welcomeBack: 'خوش آمدید',
    joinKhetFlow: 'کھیت فلو میں شامل ہوں',
    loginDesc: 'اپنی فصل کا انتظام کرنے کے لیے لاگ ان کریں',
    regDesc: 'مزید کمانے کے لیے رجسٹر کریں',
    yourName: 'آپ کا نام',
    farmName: 'کھیت کا نام',
    email: 'ای میل پتہ',
    password: 'پاس ورڈ',
    phone: 'فون نمبر',
    location: 'کھیت کا مقام',
    login: 'لاگ ان',
    createAccount: 'اکاؤنٹ بنائیں',
    dontHaveAcc: "اکاؤنٹ نہیں ہے؟",
    alreadyHaveAcc: "پہلے سے اکاؤنٹ ہے؟",
    createFarmerAcc: 'کسان اکاؤنٹ بنائیں',
    loginHere: 'یہاں لاگ ان کریں',
    listings: 'فہرستیں',
    orders: 'آرڈرز',
    payments: 'ادائیگیاں',
    active: 'فعال',
    earned: 'کمایا',
    pending: 'زیر التوا',
    yourHarvest: 'آپ کی فصل',
    addProduct: 'پروڈکٹ شامل کریں',
    addNewListing: 'نئی فہرست شامل کریں',
    prodName: 'پروڈکٹ کا نام',
    qty: 'مقدار (کلوگرام)',
    price: 'قیمت / کلوگرام (₹)',
    grade: 'گریڈ',
    desc: 'تفصیل',
    publish: 'فہرست شائع کریں',
    noListings: 'ابھی کوئی فہرست نہیں',
    createFirst: 'پہلی فہرست بنائیں',
    receivedOrders: 'موصولہ آرڈرز',
    paymentHistory: 'ادائیگی کی تاریخ',
    farmerDash: 'کسان ڈیش بورڈ',
    aiScan: 'AI اسکین',
    scanProduce: 'پیداوار اسکین کریں',
    khetScore: 'کھیت اسکور',
    creditHistory: 'کریڈٹ ہسٹری',
    loanEligible: 'قرض کی اہلیت',
    scoreGood: 'اچھا',
    scoreLow: 'بہتری کی ضرورت',
    scoreExcellent: 'بہترین',
    buildScore: 'اسکور بڑھانے کے لیے مزید بیچیں',
    transport: 'نقل و حمل',
    shareTruck: 'ٹرک شیئر کریں',
    availablePools: 'دستیاب ٹرک',
    joinPool: 'شامل ہوں',
    capacityLeft: 'باقی گنجائش',
    mandiRates: 'منڈی کے نرخ',
    mandi: 'منڈی',
    searchCrop: 'فصل تلاش کریں...',
    priceTrend: 'قیمت کا رجحان'
  },
  hr: {
    heroSubtitle: 'हल्की फसल का भी बढ़िया मुनाफा कमाओ',
    heroDesc: 'B और C ग्रेड की फसल बेचो जो वैसे ही खराब हो जावे थी। ना बर्बादी, ज्यादा कमाई, खुशहाली।',
    startSelling: 'इब बेचना शुरू करो',
    betterPrices: 'बढ़िया भाव',
    zeroWaste: 'ना होवे बर्बादी',
    happyBuyers: 'राजी गाहक',
    welcomeBack: 'राम राम जी',
    joinKhetFlow: 'खेतफ्लो तै जुड़ो',
    loginDesc: 'अपनी फसल सम्भालण खातिर लॉगिन करो',
    regDesc: 'फालतू कमावण खातिर रजिस्टर करो',
    yourName: 'थारा नाम',
    farmName: 'खेत का नाम',
    email: 'ईमेल',
    password: 'पासवर्ड',
    phone: 'फोन नंबर',
    location: 'खेत कित्त सै',
    login: 'लॉगिन',
    createAccount: 'खाता बणाओ',
    dontHaveAcc: "खाता कोनी के?",
    alreadyHaveAcc: "पहलां ई खाता सै?",
    createFarmerAcc: 'जमींदार खाता बणाओ',
    loginHere: 'उरे लॉगिन करो',
    listings: 'लिस्टिंग',
    orders: 'ऑर्डर',
    payments: 'रुपये',
    active: 'चालू',
    earned: 'कमाई',
    pending: 'रुक रया',
    yourHarvest: 'थारी फसल',
    addProduct: 'फसल जोड़ो',
    addNewListing: 'नई फसल चढ़ाओ',
    prodName: 'फसल का नाम',
    qty: 'वजन (किलो)',
    price: 'भाव / किलो (₹)',
    grade: 'ग्रेड',
    desc: 'ब्यौरा',
    publish: 'लिस्टिंग लगाओ',
    noListings: 'इब तक कोई फसल कोनी',
    createFirst: 'पहली फसल चढ़ाओ',
    receivedOrders: 'आये होये ऑर्डर',
    paymentHistory: 'लेन-देन का हिसाब',
    farmerDash: 'जमींदार डैशबोर्ड',
    aiScan: 'AI स्कैन',
    scanProduce: 'फसल देखो',
    khetScore: 'खेत स्कोर',
    creditHistory: 'उधारी खाता',
    loanEligible: 'लोन मिल सकै',
    scoreGood: 'बढ़िया',
    scoreLow: 'हल्का सै',
    scoreExcellent: 'कती ए जहर',
    buildScore: 'स्कोर बढ़ावण खातिर और बेचो',
    transport: 'ढुलाई',
    shareTruck: 'ट्रक साझा करो',
    availablePools: 'चालू ट्रक',
    joinPool: 'मिल के चलो',
    capacityLeft: 'जगह बची सै',
    mandiRates: 'मंडी का भाव',
    mandi: 'मंडी',
    searchCrop: 'फसल ढूंढो...',
    priceTrend: 'भाव का हाल'
  }
};

// ==========================================
// 1. ANIMATED BACKGROUND
// ==========================================
function AnimatedBackground() {
  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none', background: '#f3f4f6'
      }}>
        <div style={{
          position: 'absolute', width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0) 70%)',
          borderRadius: '50%', filter: 'blur(60px)', top: '-100px', left: '-100px', animation: 'float1 25s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(234, 179, 8, 0.1) 0%, rgba(234, 179, 8, 0) 70%)',
          borderRadius: '50%', filter: 'blur(60px)', bottom: '-100px', right: '-100px', animation: 'float2 20s ease-in-out infinite'
        }}></div>
      </div>
      <style>{`
        @keyframes float1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(30px, 50px) scale(1.1); } }
        @keyframes float2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-30px, -50px) scale(1.1); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1f2937; }
      `}</style>
    </>
  );
}

// ==========================================
// 2. POOLING COMPONENT
// ==========================================
function TransportPooling({ user, riderData }) {
  const { t } = useContext(LanguageContext);
  const [pools, setPools] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [joinId, setJoinId] = useState(null);
  
  const isMiddleMileVehicle = riderData?.vehicleType === 'truck' || riderData?.vehicleType === 'bus';

  const [newPool, setNewPool] = useState({ origin: '', destination: '', capacity: '', departureTime: '' });
  const [joinWeight, setJoinWeight] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'transport_pools'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPools(data);
    });
    return () => unsubscribe();
  }, []);

  const handleCreatePool = async (e) => {
    e.preventDefault();
    if (!newPool.origin || !newPool.destination || !newPool.capacity || !newPool.departureTime) return;
    
    try {
      await addDoc(collection(db, 'transport_pools'), {
        origin: newPool.origin,
        destination: newPool.destination,
        totalCapacity: parseInt(newPool.capacity),
        filledCapacity: 0,
        departureTime: newPool.departureTime, 
        farmerCount: 0,
        status: 'open',
        createdBy: user.uid,
        driverName: riderData?.riderName || 'Driver',
        vehicleType: riderData?.vehicleType || 'truck',
        createdAt: serverTimestamp()
      });
      setShowCreate(false);
      setNewPool({ origin: '', destination: '', capacity: '', departureTime: '' });
      alert("Route created successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleJoinPool = async (pool) => {
    if (!joinWeight || !pickupLocation) {
        alert("Please provide both weight and your pickup location along the route.");
        return;
    }
    const weight = parseInt(joinWeight);
    
    if (pool.filledCapacity + weight > pool.totalCapacity) {
      alert("Exceeds capacity! Only " + (pool.totalCapacity - pool.filledCapacity) + "kg space left.");
      return;
    }

    try {
      const isFull = (pool.filledCapacity + weight) >= pool.totalCapacity;
      
      await updateDoc(doc(db, 'transport_pools', pool.id), {
        filledCapacity: increment(weight),
        farmerCount: increment(1),
        status: isFull ? 'full' : 'open'
      });

      await addDoc(collection(db, `transport_pools/${pool.id}/joiners`), {
          riderId: user.uid,
          riderName: riderData?.riderName,
          weightAdded: weight,
          pickupLocation: pickupLocation,
          timestamp: serverTimestamp()
      });

      setJoinId(null);
      setJoinWeight('');
      setPickupLocation('');
      alert("Successfully joined the transport pool!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ animation: 'slideInUp 0.3s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: 0 }}>{t('pool_title')}</h2>
        {isMiddleMileVehicle && (
          <button 
            onClick={() => setShowCreate(true)}
            style={{ background: '#0c831f', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)' }}
          >
            + {t('create_pool')}
          </button>
        )}
      </div>

      {showCreate && isMiddleMileVehicle && (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', marginBottom: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>{t('btn_create_route')}</h3>
          <form onSubmit={handleCreatePool} style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input placeholder="Origin (e.g. Nashik)" value={newPool.origin} onChange={e => setNewPool({...newPool, origin: e.target.value})} style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db' }} required />
              <input placeholder="Destination (e.g. Mumbai)" value={newPool.destination} onChange={e => setNewPool({...newPool, destination: e.target.value})} style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db' }} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input type="number" placeholder="Total Capacity (kg)" value={newPool.capacity} onChange={e => setNewPool({...newPool, capacity: e.target.value})} style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db' }} required />
              <input type="datetime-local" placeholder={t('departure_time')} value={newPool.departureTime} onChange={e => setNewPool({...newPool, departureTime: e.target.value})} style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db', fontFamily: 'inherit' }} required />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={() => setShowCreate(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none', background: '#f3f4f6' }}>Cancel</button>
              <button type="submit" style={{ flex: 2, padding: '0.75rem', borderRadius: '10px', border: 'none', background: '#0c831f', color: 'white', fontWeight: '600' }}>Create Route</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {pools.length === 0 ? <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No active pools available.</p> : null}
        
        {pools.map(pool => {
          const percent = Math.min(100, (pool.filledCapacity / pool.totalCapacity) * 100);
          const isFull = pool.status === 'full';

          return (
            <div key={pool.id} style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>
                    {t('route')} • <span style={{ color: '#0c831f' }}>🕒 {pool.departureTime ? new Date(pool.departureTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'TBD'}</span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937' }}>
                    {pool.origin} <span style={{ color: '#9ca3af', margin: '0 4px' }}>➝</span> {pool.destination}
                  </div>
                  {pool.driverName && <div style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: '4px' }}>🚛 {pool.driverName} ({pool.vehicleType})</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    display: 'inline-block', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', 
                    background: isFull ? '#fee2e2' : '#dcfce7', color: isFull ? '#991b1b' : '#166534'
                  }}>
                    {isFull ? t('status_full') : t('status_open')}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: '#4b5563' }}>{pool.filledCapacity} / {pool.totalCapacity} kg</span>
                  <span style={{ color: '#0c831f', fontWeight: '600' }}>{Math.round(percent)}%</span>
                </div>
                <div style={{ height: '10px', background: '#e5e7eb', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', width: `${percent}%`, 
                    background: isFull ? '#ef4444' : '#22c55e', 
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', marginLeft: '8px' }}>
                    {[...Array(Math.min(3, pool.farmerCount || 0))].map((_, i) => (
                      <div key={i} style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#d1d5db', border: '2px solid white', marginLeft: '-8px' }}></div>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    {pool.farmerCount} {t('farmers_joined')}
                  </span>
                </div>

                {!isFull && !isMiddleMileVehicle && (
                  joinId === pool.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                      <input 
                        type="text" 
                        placeholder="Where will you meet the truck?" 
                        value={pickupLocation}
                        onChange={e => setPickupLocation(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem', width: '200px' }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input 
                            type="number" 
                            placeholder="kg" 
                            autoFocus
                            value={joinWeight} 
                            onChange={e => setJoinWeight(e.target.value)}
                            style={{ width: '80px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                          />
                          <button onClick={() => handleJoinPool(pool)} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '0 12px', cursor: 'pointer' }}>✓</button>
                          <button onClick={() => {setJoinId(null); setPickupLocation('');}} style={{ background: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: '8px', padding: '0 12px', cursor: 'pointer' }}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setJoinId(pool.id)}
                      style={{ background: '#fff', border: '1px solid #2563eb', color: '#2563eb', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      {t('join_pool')}
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 3. MODALS 
// ==========================================

function LanguageToggle({ style }) {
  const { lang, setLang } = useContext(LanguageContext);
  return (
    <button 
      onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
      style={{
        background: 'white', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '6px 12px',
        fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)', ...style
      }}
    >
      <span>🌐</span> {lang === 'en' ? 'Hindi' : 'English'}
    </button>
  );
}

function ReportIssueModal({ user, onClose }) {
  const { t } = useContext(LanguageContext);
  const [type, setType] = useState('breakdown');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!desc) return alert('Please describe the issue');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'issues'), {
        riderId: user.uid,
        type,
        description: desc,
        status: 'open',
        timestamp: serverTimestamp()
      });
      alert('Issue reported. Support will contact you shortly.');
      onClose();
    } catch (e) {
      alert(e.message);
    }
    setSubmitting(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 11000, backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', animation: 'slideInUp 0.3s' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginTop: 0 }}>🚨 {t('report_title')}</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('issue_type')}</label>
          <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <option value="breakdown">Vehicle Breakdown</option>
            <option value="accident">Accident</option>
            <option value="shop_closed">Shop/Farm Closed</option>
            <option value="wrong_location">Wrong Location</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('desc')}</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows="4" style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e5e7eb', resize: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: '#f3f4f6', border: 'none', fontWeight: '600', cursor: 'pointer' }}>{t('btn_cancel')}</button>
          <button onClick={handleSubmit} disabled={submitting} style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: '#dc2626', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}>{submitting ? '...' : t('btn_submit')}</button>
        </div>
      </div>
    </div>
  );
}

function EarningsModal({ orders, onClose }) {
  const { t } = useContext(LanguageContext);
  const history = orders
    .filter(o => o.status === 'delivered')
    .sort((a, b) => (b.deliveredAt?.seconds || 0) - (a.deliveredAt?.seconds || 0));

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 11000, backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', animation: 'slideInUp 0.3s' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>📊 {t('earnings_history')}</h2>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
          {history.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>No history yet.</p>
          ) : (
            history.map(order => (
              <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#111827' }}>#{order.id.substring(0,6)}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    {order.deliveredAt ? new Date(order.deliveredAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div style={{ fontWeight: '700', color: '#16a34a' }}>
                  + ₹{Math.floor((order.deliveryFee || 150) * 0.9)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DeliveryPaymentModal({ order, onClose, onConfirm }) {
  const { t } = useContext(LanguageContext);
  const [paymentPhoto, setPaymentPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const deliveryFee = order.deliveryFee || 150; 
  const riderEarnings = Math.floor(deliveryFee * 0.90);
  const isCOD = order.paymentMethod === 'cod' || order.paymentMethod === 'pay_on_delivery';

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { alert('Photo too large!'); return; }
      const reader = new FileReader();
      reader.onloadend = () => setPaymentPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (isCOD && !paymentPhoto) {
      alert("⚠️ Since this is Pay on Delivery, you must upload a photo of the received payment (Cash or UPI screen).");
      return;
    }
    setIsUploading(true);
    await onConfirm(paymentPhoto, riderEarnings);
    setIsUploading(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10000, backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', animation: 'slideInUp 0.3s' }}>
      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.5rem', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px -15px rgba(0,0,0,0.15)', border: '1px solid #e5e7eb' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '60px', height: '60px', background: '#ecfccb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem', color: '#65a30d' }}>🚀</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827', margin: 0 }}>{t('confirm_delivery')}</h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Complete this order to get paid.</p>
        </div>
        
        <div style={{ background: 'linear-gradient(135deg, #0c831f, #15803d)', padding: '1.5rem', borderRadius: '20px', marginBottom: '2rem', textAlign: 'center', color: 'white', boxShadow: '0 10px 20px -5px rgba(22, 163, 74, 0.4)' }}>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '0.25rem', fontSize: '0.95rem', fontWeight: '500' }}>INSTANT EARNINGS</p>
          <p style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1 }}>₹{riderEarnings}</p>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>Base Fare + Surge Bonus included</p>
        </div>

        {isCOD ? (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ background: '#fff7ed', border: '1px solid #fdba74', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem' }}>💵</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#9a3412', fontWeight: '700', fontSize: '1.1rem', margin: 0 }}>Collect Cash: ₹{order.totalAmount}</p>
                <p style={{ fontSize: '0.85rem', color: '#c2410c', margin: 0 }}>Customer pays via Cash or UPI</p>
              </div>
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', border: '2px dashed #d1d5db', borderRadius: '16px', cursor: 'pointer', background: paymentPhoto ? '#f0fdf4' : '#f9fafb', transition: 'all 0.2s' }}>
              <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</span>
              <span style={{ color: '#4b5563', fontWeight: '500' }}>{paymentPhoto ? 'Proof Captured' : t('upload_proof')}</span>
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} style={{ display: 'none' }} />
            </label>
            {paymentPhoto && <img src={paymentPhoto} alt="Proof" style={{ width: '100%', height: '150px', objectFit: 'cover', marginTop: '1rem', borderRadius: '12px' }} />}
          </div>
        ) : (
          <div style={{ marginBottom: '2rem', textAlign: 'center', padding: '1.25rem', background: '#eff6ff', borderRadius: '16px', border: '1px solid #dbeafe' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
            <p style={{ color: '#1e40af', fontWeight: '700', fontSize: '1.1rem' }}>Pre-paid Order</p>
            <p style={{ color: '#60a5fa', fontSize: '0.9rem' }}>Do not collect any cash from customer.</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: '#f3f4f6', border: 'none', color: '#4b5563', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}>{t('btn_cancel')}</button>
          <button onClick={handleSubmit} disabled={isUploading || (isCOD && !paymentPhoto)} style={{ flex: 1.5, padding: '1rem', borderRadius: '12px', border: 'none', background: (isCOD && !paymentPhoto) ? '#9ca3af' : '#0c831f', color: 'white', fontWeight: '700', cursor: (isCOD && !paymentPhoto) ? 'not-allowed' : 'pointer' }}>{isUploading ? 'Verifying...' : t('btn_finish')}</button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. QR SCANNER + VERIFICATION MODAL
// ==========================================
function VerificationModal({ order, onClose, onVerify, riderData }) {
  const { t } = useContext(LanguageContext);
  const [scannedData, setScannedData] = useState(null);
   
  const [checklist, setChecklist] = useState({
    freshness: false, packaging: false, quantity: false, noticeable_damage: false,
    temperature_check: false, color_check: false, no_pests: false, labeling_correct: false
  });
   
  const [photos, setPhotos] = useState([]);
  const [notes, setNotes] = useState('');
  const [scannerInitialized, setScannnerInitialized] = useState(false);

  useEffect(() => {
    let scanner = null;

    const initScanner = () => {
      const element = document.getElementById('qr-reader');
      if (element && !scanner) {
        scanner = new Html5QrcodeScanner('qr-reader', {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          supportedScanTypes: [0, 1] 
        }, false);

        scanner.render(
          (decodedText) => {
            try {
              const data = JSON.parse(decodedText);
              setScannedData(data);
              scanner.clear();
            } catch (e) {
              alert('Invalid QR code format! Must be JSON.');
            }
          },
          (error) => { /* Ignore scan errors */ }
        );
        setScannnerInitialized(true);
      }
    };

    const timer = setTimeout(initScanner, 200);

    return () => {
      clearTimeout(timer);
      if (scanner) {
        scanner.clear().catch(err => console.error("Scanner cleanup error", err));
      }
    };
  }, []);

  const handlePhotoCapture = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVerify = async () => {
    if (!scannedData) { alert('Please scan QR code first!'); return; }
    if (!Object.values(checklist).every(v => v)) { alert('Please complete the entire quality checklist!'); return; }
    if (photos.length === 0) { alert('Please take at least one photo!'); return; }

    try {
      await addDoc(collection(db, 'verifications'), {
        orderId: order.id,
        riderId: riderData.uid, 
        riderName: riderData.riderName,
        scannedProduct: scannedData,
        checklist: checklist,
        photos: photos,
        notes: notes,
        timestamp: serverTimestamp(),
        status: 'verified'
      });

      await updateDoc(doc(db, 'orders', order.id), {
        status: 'picked',
        verificationCompleted: true,
        verificationPhotos: photos,
        verificationNotes: notes,
        updatedAt: serverTimestamp()
      });

      onVerify();
    } catch (error) {
      alert('Error verifying: ' + error.message);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1.5rem', backdropFilter: 'blur(5px)', animation: 'slideInUp 0.3s ease-out' }}>
      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '0', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: 0 }}>{t('quality_check')}</h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>Verify items before pickup</p>
          </div>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', color: '#4b5563', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        <div style={{ padding: '2rem' }}>
          {!scannedData ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: '#f9fafb', borderRadius: '16px', border: '2px dashed #d1d5db' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '700', color: '#1f2937' }}>Step 1: Scan Farm QR</h3>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Point your camera at the crate's QR code</p>
              <div id="qr-reader" style={{ borderRadius: '12px', margin: '0 auto', maxWidth: '350px' }}></div>
            </div>
          ) : (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>✓</div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#166534', margin: 0 }}>Farm Verified</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#15803d' }}>{scannedData.farmName}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px' }}>
                  <span style={{ color: '#6b7280', display: 'block', fontSize: '0.8rem' }}>Product</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{scannedData.name}</span>
                </div>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px' }}>
                  <span style={{ color: '#6b7280', display: 'block', fontSize: '0.8rem' }}>Grade</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{scannedData.grade}</span>
                </div>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px' }}>
                  <span style={{ color: '#6b7280', display: 'block', fontSize: '0.8rem' }}>Weight</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{scannedData.quantity} kg</span>
                </div>
              </div>
            </div>
          )}

          {scannedData && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '700', color: '#374151' }}>Step 2: Quality Checklist</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {[
                  { key: 'freshness', label: 'Freshness Check', icon: '🌿' },
                  { key: 'packaging', label: 'Packaging Secure', icon: '📦' },
                  { key: 'quantity', label: 'Weight Verified', icon: '⚖️' },
                  { key: 'noticeable_damage', label: 'No Damage', icon: '🔍' },
                  { key: 'temperature_check', label: 'Temperature', icon: '🌡️' },
                  { key: 'color_check', label: 'Color Natural', icon: '🎨' },
                  { key: 'no_pests', label: 'No Pests', icon: '🐛' },
                  { key: 'labeling_correct', label: 'Labels OK', icon: '🏷️' }
                ].map((item) => (
                  <label key={item.key} style={{
                    display: 'flex', alignItems: 'center', padding: '0.75rem',
                    background: checklist[item.key] ? '#f0fdf4' : '#f9fafb',
                    borderRadius: '10px', cursor: 'pointer',
                    border: checklist[item.key] ? '1px solid #22c55e' : '1px solid #e5e7eb',
                    transition: 'all 0.2s', userSelect: 'none'
                  }}>
                    <input type="checkbox" checked={checklist[item.key]} onChange={(e) => setChecklist({...checklist, [item.key]: e.target.checked})} style={{ width: '18px', height: '18px', marginRight: '0.75rem', cursor: 'pointer', accentColor: '#16a34a' }} />
                    <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>{item.icon}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500', color: checklist[item.key] ? '#15803d' : '#4b5563' }}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {scannedData && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '700', color: '#374151' }}>Step 3: Evidence</h3>
              <label style={{ display: 'block', padding: '1rem', border: '2px dashed #cbd5e1', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', background: '#f9fafb', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📸</div>
                <span style={{ color: '#2563eb', fontWeight: '600' }}>Take Verification Photos</span>
                <input type="file" accept="image/*" multiple capture="environment" onChange={handlePhotoCapture} style={{ display: 'none' }} />
              </label>
              {photos.length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  {photos.map((photo, i) => (
                    <img key={i} src={photo} alt={`Evidence ${i}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb', flexShrink: 0 }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {scannedData && (
            <div style={{ marginBottom: '2rem' }}>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any notes for the buyer (optional)..." rows="2" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #d1d5db', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', resize: 'none' }} />
            </div>
          )}
        </div>

        {scannedData && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid #f3f4f6', background: 'white', position: 'sticky', bottom: 0 }}>
            <button onClick={handleVerify} disabled={!Object.values(checklist).every(v => v) || photos.length === 0} style={{
              width: '100%', background: Object.values(checklist).every(v => v) && photos.length > 0 ? '#0c831f' : '#e5e7eb',
              color: Object.values(checklist).every(v => v) && photos.length > 0 ? 'white' : '#9ca3af', 
              padding: '1.1rem', borderRadius: '12px', border: 'none', fontSize: '1.1rem', fontWeight: '700',
              cursor: Object.values(checklist).every(v => v) && photos.length > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s', boxShadow: Object.values(checklist).every(v => v) && photos.length > 0 ? '0 4px 12px rgba(22, 163, 74, 0.3)' : 'none'
            }}>
              {Object.values(checklist).every(v => v) && photos.length > 0 ? 'Confirm Pickup' : 'Complete Checklist to Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- NEW HANDSHAKE MODAL FOR TRUCK DRIVERS ---
function HandshakeModal({ user, riderData, onClose, onConfirm }) {
  const { t } = useContext(LanguageContext);
  const [scannedData, setScannedData] = useState(null);
  const [isTransferring, setIsTransferring] = useState(false);

  useEffect(() => {
    let scanner = null;
    const initScanner = () => {
      const element = document.getElementById('handshake-qr-reader');
      if (element && !scanner) {
        element.innerHTML = ''; 
        scanner = new Html5QrcodeScanner('handshake-qr-reader', {
          fps: 10, 
          qrbox: { width: 250, height: 250 }, 
          aspectRatio: 1.0, 
          supportedScanTypes: [0, 1] 
        }, false);
        scanner.render(
          (decodedText) => {
            try {
              const data = JSON.parse(decodedText);
              setScannedData(data);
              scanner.clear();
            } catch (e) { 
              alert('Invalid QR format! Must be KhetFlow standard QR.'); 
            }
          },
          (error) => {}
        );
      }
    };
    const timer = setTimeout(initScanner, 250);
    return () => { 
      clearTimeout(timer); 
      if (scanner) scanner.clear().catch(e => console.error(e)); 
    };
  }, []);

  const handleConfirm = async () => {
    if (!scannedData) return;
    setIsTransferring(true);
    try {
      await addDoc(collection(db, 'transfers'), {
        middleMileRiderId: user.uid,
        middleMileRiderName: riderData.riderName,
        scannedData: scannedData,
        timestamp: serverTimestamp()
      });

      const q = query(collection(db, 'orders'), where('status', '==', 'picked'));
      const snapshot = await getDocs(q);
      
      let foundOrder = false;
      for (const document of snapshot.docs) {
        const oData = document.data();
        if (oData.farmName === scannedData.farmName || (oData.items && oData.items.some(i => i.farmerId === scannedData.farmerId))) {
           await updateDoc(doc(db, 'orders', document.id), {
             riderId: user.uid,
             riderName: riderData.riderName,
             riderPhone: riderData.phone || '',
             vehicleType: riderData.vehicleType || 'truck',
             transferredAt: serverTimestamp()
           });
           foundOrder = true;
        }
      }
      
      if (!foundOrder) {
          console.warn("No active order found for this farm transfer.");
      }

      onConfirm();
    } catch (err) {
      alert("Error: " + err.message);
    }
    setIsTransferring(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1.5rem', backdropFilter: 'blur(5px)', animation: 'slideInUp 0.3s ease-out' }}>
      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '0', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: 0 }}>Receive Cargo</h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>Scan crate to take custody</p>
          </div>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', color: '#4b5563', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        <div style={{ padding: '2rem' }}>
          {!scannedData ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: '#eff6ff', borderRadius: '16px', border: '2px dashed #93c5fd' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '700', color: '#1e3a8a' }}>Scan Handoff QR</h3>
              <p style={{ color: '#3b82f6', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Scan the QR code from the farmer or first-mile rider</p>
              <div id="handshake-qr-reader" style={{ borderRadius: '12px', margin: '0 auto', maxWidth: '350px' }}></div>
            </div>
          ) : (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>✓</div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#166534', margin: 0 }}>Cargo Identified</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#15803d' }}>Ready for transfer</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', fontSize: '0.95rem' }}>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280', display: 'block', fontSize: '0.75rem', fontWeight: '600' }}>ORIGIN (FARM)</span>
                  <span style={{ fontWeight: '700', color: '#111827' }}>{scannedData.farmName || 'Unknown Farm'}</span>
                </div>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
                   <div>
                      <span style={{ color: '#6b7280', display: 'block', fontSize: '0.75rem', fontWeight: '600' }}>COMMODITY</span>
                      <span style={{ fontWeight: '700', color: '#111827' }}>{scannedData.name}</span>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#6b7280', display: 'block', fontSize: '0.75rem', fontWeight: '600' }}>WEIGHT</span>
                      <span style={{ fontWeight: '700', color: '#0c831f' }}>{scannedData.quantity} kg</span>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {scannedData && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid #f3f4f6', background: 'white', position: 'sticky', bottom: 0 }}>
            <button onClick={handleConfirm} disabled={isTransferring} style={{
              width: '100%', background: '#2563eb', color: 'white', 
              padding: '1.1rem', borderRadius: '12px', border: 'none', fontSize: '1.1rem', fontWeight: '700',
              cursor: isTransferring ? 'not-allowed' : 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}>
              {isTransferring ? 'Transferring Custody...' : 'Confirm Custody Transfer'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- LIVE TRACKING MAP MODAL (REAL MAP) ---
function LiveTrackingModal({ order, onClose }) {
  const getStatusIndex = () => {
    if (order.status === 'pending' && !order.readyForPickup) return 0; 
    if (order.status === 'pending' && order.readyForPickup) return 1; 
    if (order.status === 'accepted') return 1;
    if (order.status === 'picked') return 2; 
    if (order.status === 'delivered') return 3; 
    return 0;
  };

  const statusIndex = getStatusIndex();
  const progressPercent = statusIndex === 0 ? 10 : statusIndex === 1 ? 33 : statusIndex === 2 ? 66 : 100;
  const isFarmerDriving = order.farmerSelfDelivery;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(17, 24, 39, 0.9)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20000, padding: '1.5rem',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: '#1f2937', border: '1px solid #374151', borderRadius: '2rem',
        maxWidth: '800px', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)', color: 'white'
      }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Map className="w-6 h-6 text-blue-400" /> Live Tracking
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: '0.25rem 0 0 0', fontFamily: 'monospace' }}>Order #{order.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} style={{ background: '#374151', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}><X /></button>
        </div>

        {/* Real Map Container */}
        <div style={{ position: 'relative', width: '100%', height: '350px', background: '#e2e8f0' }}>
          {/* OSM Iframe (100% Free, No Keys) */}
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight="0" 
            marginWidth="0" 
            src="https://www.openstreetmap.org/export/embed.html?bbox=77.0,28.4,77.4,28.7&layer=mapnik" 
            style={{ 
               filter: 'invert(100%) hue-rotate(180deg) brightness(80%) contrast(120%)',
               pointerEvents: 'none' // Prevent accidental scrolling while tracking
            }}
          ></iframe>
          
          {/* SVG Overlay for Route and Truck */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', padding: '0 15%' }}>
             <div style={{ position: 'relative', width: '100%', height: '40px' }}>
                {/* Dashed Background Line */}
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.2)', borderTop: '2px dashed rgba(255,255,255,0.5)', transform: 'translateY(-50%)' }}></div>
                
                {/* Solid Progress Line */}
                <div style={{ position: 'absolute', top: '50%', left: 0, height: '6px', width: `${progressPercent}%`, background: '#3b82f6', borderRadius: '4px', transform: 'translateY(-50%)', transition: 'width 1.5s ease-in-out', boxShadow: `0 0 15px #3b82f6` }}></div>
                
                {/* Moving Vehicle */}
                <div style={{ 
                   position: 'absolute', top: '50%', left: `${progressPercent}%`, 
                   transform: 'translate(-50%, -50%)', transition: 'left 1.5s ease-in-out', zIndex: 20
                }}>
                   <div style={{ background: 'white', color: '#1f2937', padding: '0.6rem', borderRadius: '50%', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                      {isFarmerDriving ? <User size={24} /> : <Truck size={24} color="#3b82f6" />}
                   </div>
                </div>

                {/* Nodes */}
                {[0, 33, 66, 100].map((pos, idx) => (
                   <div key={pos} style={{ position: 'absolute', top: '50%', left: `${pos}%`, transform: 'translate(-50%, -50%)', width: '16px', height: '16px', borderRadius: '50%', background: progressPercent >= pos ? '#3b82f6' : '#374151', border: `3px solid white`, transition: 'background 0.5s' }}></div>
                ))}
             </div>
          </div>
          <div style={{ position: 'absolute', top: '55%', left: '15%', transform: 'translateX(-50%)', color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center', marginTop: '1rem' }}>Placed</div>
          <div style={{ position: 'absolute', top: '55%', left: '38.1%', transform: 'translateX(-50%)', color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center', marginTop: '1rem' }}>At Farm</div>
          <div style={{ position: 'absolute', top: '55%', left: '61.2%', transform: 'translateX(-50%)', color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center', marginTop: '1rem' }}>In Transit</div>
          <div style={{ position: 'absolute', top: '55%', left: '85%', transform: 'translateX(-50%)', color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center', marginTop: '1rem' }}>Delivered</div>
        </div>

        {/* Details Footer */}
        <div style={{ padding: '2rem', background: '#1f2937', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#374151', borderRadius: '1rem', color: '#3b82f6' }}><Package /></div>
            <div>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Commodity</p>
              <p style={{ fontSize: '1rem', color: 'white', fontWeight: '600', margin: 0 }}>{order.totalItems || order.items?.reduce((acc, i) => acc + i.cartQuantity, 0)}kg Produce</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#374151', borderRadius: '1rem', color: '#10b981' }}><Navigation /></div>
            <div>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Logistics Status</p>
              <p style={{ fontSize: '1rem', color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                <CheckCircle2 size={16} color="#10b981"/> Network Tracked
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. LANDING PAGE
// ==========================================
function RiderLanding() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground />
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 20 }}><LanguageToggle /></div>

      <div style={{ maxWidth: '1200px', textAlign: 'center', position: 'relative', zIndex: 10, width: '100%' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '50px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '2rem', border: '1px solid #e5e7eb', animation: 'slideInUp 0.6s' }}>
          <span style={{ fontSize: '1.2rem' }}>⚡</span><span style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>{t('fastest_growing')}</span>
        </div>

        <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: '900', marginBottom: '1.5rem', color: '#111827', letterSpacing: '-0.03em', lineHeight: 1.1, animation: 'slideInUp 0.8s' }}>
          KhetFlow <span style={{ color: '#0c831f' }}>Rider</span>
        </h1>

        <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6, animation: 'slideInUp 1s' }}>
          Be your own boss. Pick up fresh farm produce and deliver to businesses. <br />
          <span style={{ color: '#111827', fontWeight: '600' }}>Instant payouts, zero commissions.</span>
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem', maxWidth: '1000px', margin: '0 auto 4rem', animation: 'slideInUp 1.2s' }}>
          {[
            { label: 'Instant Pay', value: '₹500+', icon: '⚡', color: '#0c831f', desc: 'Average daily earnings' },
            { label: 'Flexible', value: '24/7', icon: '🕒', color: '#f59e0b', desc: 'Work when you want' },
            { label: 'Bonuses', value: 'Weekly', icon: '🎁', color: '#3b82f6', desc: 'Performance rewards' }
          ].map((stat, i) => (
            <div key={i} onMouseEnter={() => setHoveredCard(i)} onMouseLeave={() => setHoveredCard(null)} style={{ background: 'white', borderRadius: '24px', padding: '2rem', transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', cursor: 'default', border: '1px solid #f3f4f6', transform: hoveredCard === i ? 'translateY(-8px)' : 'translateY(0)', boxShadow: hoveredCard === i ? '0 20px 40px -12px rgba(0,0,0,0.1)' : '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: stat.color, marginBottom: '0.25rem' }}>{stat.value}</div>
              <div style={{ color: '#1f2937', fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem' }}>{stat.label}</div>
              <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{stat.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '5rem', flexWrap: 'wrap', animation: 'slideInUp 1.4s' }}>
          <button onClick={() => navigate('/login')} style={{ background: '#0c831f', color: 'white', padding: '1rem 3rem', borderRadius: '14px', border: 'none', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(22, 163, 74, 0.4)', transition: 'transform 0.2s', minWidth: '200px' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
            {t('login')}
          </button>
          <button onClick={() => navigate('/register')} style={{ background: 'white', color: '#1f2937', padding: '1rem 3rem', borderRadius: '14px', border: '1px solid #e5e7eb', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', transition: 'transform 0.2s', minWidth: '200px' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.background = '#f9fafb'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.background = 'white'; }}>
            {t('register')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. AUTH
// ==========================================
function AuthPage({ isLogin }) {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const [form, setForm] = useState({ email: '', password: '', riderName: '', phone: '', vehicleType: 'bike', vehicleNumber: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, form.email, form.password);
        navigate('/dashboard');
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await setDoc(doc(db, 'riders', userCred.user.uid), { ...form, userType: 'rider', totalDeliveries: 0, totalEarnings: 0, rating: 5.0, createdAt: serverTimestamp(), isOnline: true });
        navigate('/dashboard');
      }
    } catch (err) { setError(err.message.replace('Firebase: ', '').replace('auth/', '')); } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb', color: '#1f2937', fontSize: '1rem', outline: 'none', transition: 'all 0.2s', fontWeight: '500' };
  const focusStyle = (e) => { e.target.style.background = 'white'; e.target.style.borderColor = '#0c831f'; e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)'; };
  const blurStyle = (e) => { e.target.style.background = '#f9fafb'; e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground />
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 20 }}><LanguageToggle /></div>

      <div style={{ background: 'white', borderRadius: '32px', padding: '3rem', maxWidth: '480px', width: '100%', position: 'relative', zIndex: 10, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', animation: 'slideInUp 0.5s ease-out', border: '1px solid #f3f4f6' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', background: '#f0fdf4', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🛵</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', color: '#111827' }}>{isLogin ? t('welcome') : t('become_rider')}</h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>{isLogin ? t('login_subtitle') : t('register_subtitle')}</p>
        </div>

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500' }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <>
              <input type="text" placeholder={t('full_name')} value={form.riderName} onChange={(e) => setForm({...form, riderName: e.target.value})} required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              <input type="tel" placeholder={t('phone')} value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </>
          )}
          <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          {!isLogin && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <select value={form.vehicleType} onChange={(e) => setForm({...form, vehicleType: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focusStyle} onBlur={blurStyle}>
                <option value="bike">🏍️ Bike</option>
                <option value="scooter">🛵 Scooter</option>
                <option value="car">🚗 Car</option>
                <option value="van">🚐 Van</option>
                <option value="tempo">🛺 Tempo</option>
                <option value="truck">🚛 Truck</option>
                <option value="bus">🚌 Bus</option>
              </select>
              <input type="text" placeholder={t('plate_no')} value={form.vehicleNumber} onChange={(e) => setForm({...form, vehicleNumber: e.target.value})} required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
          )}
          <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', background: loading ? '#9ca3af' : '#0c831f', color: 'white', padding: '1rem', borderRadius: '14px', border: 'none', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 12px rgba(22, 163, 74, 0.3)', transition: 'all 0.2s' }}>
            {loading ? 'Processing...' : (isLogin ? t('login') : t('create_account'))}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            {isLogin ? t('dont_have_account') + " " : t('already_have_account') + " "}
            <span onClick={() => navigate(isLogin ? '/register' : '/login')} style={{ color: '#0c831f', fontWeight: '700', cursor: 'pointer' }}>{isLogin ? t('register') : t('login')}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}><div style={{ width: '40px', height: '40px', border: '4px solid #d1d5db', borderTopColor: '#0c831f', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div></div>;
  }
  return user ? children : <Navigate to="/login" />;
}

// ==========================================
// 7. DASHBOARD
// ==========================================
function Dashboard() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const [user, setUser] = useState(null);
  const [riderData, setRiderData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [isOnline, setIsOnline] = useState(true);
   
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showHandshakeModal, setShowHandshakeModal] = useState(false); 
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null); 

  // 🚨 NEW REAL-TIME SYNC
  useEffect(() => {
    let ordersUnsubscribe;

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await fetchRiderData(u);

        // Fetch orders in real-time instead of just once
        const q = query(collection(db, 'orders'));
        ordersUnsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(data);
        });
      }
      loading && setLoading(false);
    });

    return () => {
      unsubscribe();
      if (ordersUnsubscribe) ordersUnsubscribe(); // Clean up listener when closed
    };
  }, []);

  const fetchRiderData = async (currentUser) => {
    try {
      const docRef = doc(db, 'riders', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRiderData({ uid: currentUser.uid, ...data });
        setIsOnline(data.isOnline !== false);
      } else {
        const defaultData = {
          riderName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Rider',
          email: currentUser.email,
          phone: '',
          vehicleType: 'bike',
          vehicleNumber: '',
          userType: 'rider',
          totalDeliveries: 0,
          totalEarnings: 0,
          rating: 5.0,
          createdAt: serverTimestamp(),
          isOnline: true
        };
        await setDoc(docRef, defaultData);
        setRiderData({ uid: currentUser.uid, ...defaultData });
      }
    } catch (error) {
      console.error('Error fetching rider data:', error);
    }
  };

  const toggleOnlineStatus = async () => {
    const newState = !isOnline;
    setIsOnline(newState);
    try { if (user) await updateDoc(doc(db, 'riders', user.uid), { isOnline: newState }); } 
    catch (error) { setIsOnline(!newState); }
  };

  const openMaps = (address) => { window.open(`http://googleusercontent.com/maps.google.com/?q=${encodeURIComponent(address)}`, '_blank'); };
  const callNumber = (number) => { window.location.href = `tel:${number}`; };

  // --- ACTIONS ---
  // Notice: The manual 'await fetchOrders()' lines have been removed because 
  // onSnapshot automatically updates the screen now!

  const handleAcceptOrder = async (order) => {
    if (!window.confirm("Accept Order?")) return;
    try {
      await updateDoc(doc(db, 'orders', order.id), { status: 'accepted', riderId: user.uid, riderName: riderData?.riderName || 'Unknown', riderPhone: riderData?.phone || '', acceptedAt: serverTimestamp() });
      setFilter('accepted');
    } catch (error) { alert('Error: ' + error.message); }
  };

  const handleVerifyPickup = (order) => {
    if (!riderData) { alert("Rider data still loading. Please wait a moment."); return; }
    setSelectedOrder(order);
    setShowVerificationModal(true);
  };

  const handleDeliverOrder = (order) => {
    setSelectedOrder(order);
    setShowDeliveryModal(true);
  };

  const handleDeliveryComplete = async (paymentPhoto, earnings) => {
    try {
      await updateDoc(doc(db, 'orders', selectedOrder.id), { status: 'delivered', paymentStatus: 'paid', paymentProof: paymentPhoto || null, deliveredAt: serverTimestamp() });
      await updateDoc(doc(db, 'riders', user.uid), { totalEarnings: increment(earnings), totalDeliveries: increment(1) });
      setRiderData(prev => ({ ...prev, totalEarnings: (prev.totalEarnings || 0) + earnings, totalDeliveries: (prev.totalDeliveries || 0) + 1 }));
      setShowDeliveryModal(false);
      setSelectedOrder(null);
      alert(`✅ Delivered! ₹${earnings} added.`);
    } catch (e) { alert(e.message); }
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}><div style={{ width: '40px', height: '40px', border: '4px solid #d1d5db', borderTopColor: '#0c831f', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div></div>;

  const isMiddleMileVehicle = riderData?.vehicleType === 'truck' || riderData?.vehicleType === 'bus';

  // 🚨 NEW FILTER LOGIC
  const filteredOrders = orders.filter(order => {
    if (filter === 'pooling') return false; 
    if (!isOnline && filter === 'pending') return false;
    
    if (filter === 'pending') {
      if (order.status !== 'pending') return false;
      if (order.farmerSelfDelivery === true) return false; 
      
      // Middle Mile vehicles do not see small pending orders
      if (isMiddleMileVehicle) {
         const totalWeight = order.totalItems || (order.items && order.items.reduce((acc, i) => acc + (i.cartQuantity || i.quantity || 0), 0)) || 0;
         if (totalWeight < 50) return false; // Hide orders under 50kg from big trucks
      }
      return true; 
    }
    
    if (filter === 'accepted') return order.status === 'accepted' && order.riderId === user.uid;
    if (filter === 'picked') return order.status === 'picked' && order.riderId === user.uid;
    if (filter === 'delivered') return order.status === 'delivered' && order.riderId === user.uid;
    return false;
  });

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem', paddingBottom: '100px', maxWidth: '800px', margin: '0 auto' }}>
      <AnimatedBackground />

      {/* --- ALL MODALS --- */}
      {trackingOrder && (
         <LiveTrackingModal 
            order={trackingOrder} 
            onClose={() => setTrackingOrder(null)} 
         />
      )}

      {showVerificationModal && selectedOrder && riderData && (
        <VerificationModal
          order={selectedOrder}
          riderData={riderData}
          onClose={() => { setShowVerificationModal(false); setSelectedOrder(null); }}
          onVerify={async () => {
            alert('✅ Product verified and picked up!');
            setShowVerificationModal(false);
            setSelectedOrder(null);
            setFilter('picked');
          }}
        />
      )}

      {showDeliveryModal && selectedOrder && <DeliveryPaymentModal order={selectedOrder} onClose={() => { setShowDeliveryModal(false); setSelectedOrder(null); }} onConfirm={handleDeliveryComplete} />}
      {showReportModal && <ReportIssueModal user={user} onClose={() => setShowReportModal(false)} />}
      {showEarningsModal && <EarningsModal orders={orders.filter(o => o.riderId === user.uid)} onClose={() => setShowEarningsModal(false)} />}
      
      {showHandshakeModal && riderData && (
         <HandshakeModal
           user={user}
           riderData={riderData}
           onClose={() => setShowHandshakeModal(false)}
           onConfirm={async () => {
             alert('✅ Cargo successfully transferred to your truck!');
             setShowHandshakeModal(false);
             setFilter('picked'); 
           }}
         />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderRadius: '20px', padding: '1.25rem', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', background: '#dcfce7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#166534' }}>
            {riderData?.vehicleType === 'truck' ? '🚛' : riderData?.vehicleType === 'bus' ? '🚌' : riderData?.vehicleType === 'van' ? '🚐' : riderData?.vehicleType === 'tempo' ? '🛺' : '🛵'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.1rem', color: '#111827' }}>Hi, {riderData?.riderName?.split(' ')[0]}</h1>
            <div onClick={toggleOnlineStatus} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', background: isOnline ? '#ecfccb' : '#f3f4f6' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOnline ? '#16a34a' : '#9ca3af' }}></div>
              <p style={{ color: isOnline ? '#3f6212' : '#6b7280', fontSize: '0.9rem', fontWeight: '600', margin: 0 }}>{isOnline ? t('online') : t('offline')}</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setShowReportModal(true)} style={{ background: '#fee2e2', border: 'none', borderRadius: '10px', padding: '0.5rem', fontSize: '1.2rem', cursor: 'pointer' }} title={t('report_issue')}>🚨</button>
          <LanguageToggle style={{ padding: '0.5rem' }} />
          <button onClick={handleLogout} style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.6rem 1.2rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}>{t('logout')}</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
        <div onClick={() => setShowEarningsModal(true)} style={{ cursor: 'pointer', background: '#0c831f', borderRadius: '20px', padding: '1.5rem', color: 'white', boxShadow: '0 10px 25px -5px rgba(22, 163, 74, 0.4)', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem', fontWeight: '500' }}>{t('total_earnings')}</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1 }}>₹{riderData?.totalEarnings || 0}</h2>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '10px', fontSize: '1.5rem' }}>💰</div>
          </div>
        </div>
        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📦</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827' }}>{riderData?.totalDeliveries || 0}</div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>{t('deliveries')}</div>
        </div>
        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⭐</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827' }}>{riderData?.rating || 5.0}</div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>{t('rating')}</div>
        </div>
      </div>

      {/* NEW HANDSHAKE BUTTON FOR MIDDLE MILE VEHICLES */}
      {isMiddleMileVehicle && (
        <div style={{ position: 'relative', zIndex: 10, marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => setShowHandshakeModal(true)} 
            style={{ background: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            📷 {t('btn_receive_cargo') || 'Receive Transferred Cargo'}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', position: 'relative', zIndex: 10, overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
        {[
          { key: 'pending', label: t('tab_new'), icon: '⚡' },
          { key: 'accepted', label: t('tab_farm'), icon: '🚜' },
          { key: 'picked', label: t('tab_drop'), icon: '🎒' },
          { key: 'delivered', label: t('tab_done'), icon: '✅' },
          { key: 'pooling', label: t('tab_pool'), icon: '🚛' }
        ].map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} style={{ background: filter === tab.key ? '#1f2937' : 'white', border: filter === tab.key ? '1px solid #1f2937' : '1px solid #e5e7eb', color: filter === tab.key ? 'white' : '#4b5563', padding: '0.75rem 1.25rem', borderRadius: '50px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', boxShadow: filter === tab.key ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.02)' }}>
            <span style={{ marginRight: '6px' }}>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {filter === 'pooling' ? (
          <TransportPooling user={user} riderData={riderData} />
        ) : (
          <>
            {filter === 'pending' && !isOnline && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '1rem', borderRadius: '16px', marginBottom: '1rem', textAlign: 'center', fontWeight: '600' }}>{t('alert_offline')}</div>}

            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '24px', border: '1px dashed #d1d5db' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📭</div>
                <p style={{ fontSize: '1rem', color: '#6b7280', fontWeight: '500' }}>{t('no_orders')}</p>
                {filter === 'pending' && isMiddleMileVehicle && (
                    <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.5rem' }}>Your vehicle is set to Large Capacity. You will only see bulk orders ({'>'}50kg) here. Check the Pooling tab to create middle-mile routes.</p>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filteredOrders.map((order) => (
                  <div key={order.id} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)', transition: 'transform 0.2s', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', background: order.status === 'pending' ? '#f59e0b' : order.status === 'accepted' ? '#3b82f6' : order.status === 'picked' ? '#a855f7' : '#22c55e' }}></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingLeft: '1rem' }}>
                      <span style={{ background: '#f9fafb', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', color: '#6b7280', letterSpacing: '0.5px' }}>#{order.id.substring(0, 8)}</span>
                      <span style={{ color: order.status === 'pending' ? '#d97706' : order.status === 'accepted' ? '#2563eb' : order.status === 'picked' ? '#9333ea' : '#166534', fontWeight: '700', fontSize: '0.85rem' }}>
                        {order.status === 'pending' && t('status_waiting')}
                        {order.status === 'accepted' && t('status_go_farm')}
                        {order.status === 'picked' && t('status_on_way')}
                        {order.status === 'delivered' && t('status_completed')}
                      </span>
                    </div>

                    {/* Locations Timeline */}
                    <div style={{ paddingLeft: '1rem', position: 'relative', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'absolute', left: '1.35rem', top: '10px', bottom: '25px', width: '2px', borderLeft: '2px dashed #e5e7eb', zIndex: 0 }}></div>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '50%', marginTop: '6px', border: '3px solid white', boxShadow: '0 0 0 2px #bfdbfe' }}></div>
                            <div style={{ flex: 1 }}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                  <div><p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', marginBottom: '2px' }}>PICKUP</p><p style={{ fontSize: '1rem', fontWeight: '700', color: '#111827' }}>{order.farmName || 'Green Valley Farms'}</p><p style={{ fontSize: '0.9rem', color: '#4b5563', margin: 0 }}>{order.farmAddress || 'Sector 4, Nashik Road'}</p></div>
                                  <div style={{display: 'flex', gap: '0.5rem'}}><button onClick={() => openMaps(order.farmAddress || 'Nashik')} style={{ background: '#eff6ff', border: '1px solid #dbeafe', color: '#2563eb', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>🗺️</button>{order.farmPhone && <button onClick={() => callNumber(order.farmPhone)} style={{ background: '#f0fdf4', border: '1px solid #dcfce7', color: '#16a34a', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>📞</button>}</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ width: '12px', height: '12px', background: '#22c55e', borderRadius: '50%', marginTop: '6px', border: '3px solid white', boxShadow: '0 0 0 2px #bbf7d0' }}></div>
                            <div style={{ flex: 1 }}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                  <div><p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', marginBottom: '2px' }}>DROP</p><p style={{ fontSize: '1rem', fontWeight: '700', color: '#111827' }}>{order.businessName || 'Fresh Mart'}</p><p style={{ fontSize: '0.9rem', color: '#4b5563', margin: 0 }}>{order.deliveryAddress}</p></div>
                                  <div style={{display: 'flex', gap: '0.5rem'}}><button onClick={() => openMaps(order.deliveryAddress)} style={{ background: '#eff6ff', border: '1px solid #dbeafe', color: '#2563eb', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>🗺️</button>{order.customerPhone && <button onClick={() => callNumber(order.customerPhone)} style={{ background: '#f0fdf4', border: '1px solid #dcfce7', color: '#16a34a', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>📞</button>}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ background: '#eff6ff', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', color: '#1e40af', fontWeight: '600' }}>📦 {order.totalItems} kg</div>
                      <div style={{ background: '#ecfccb', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', color: '#3f6212', fontWeight: '600' }}>💰 ₹{order.paymentMethod === 'cod' ? 'Cash' : 'Paid'}</div>
                    </div>

                    {/* NEW TRACKING BUTTON */}
                    <div style={{ marginBottom: '1rem', marginLeft: '1rem' }}>
                        <button 
                            onClick={() => setTrackingOrder(order)}
                            style={{ width: '100%', background: '#eff6ff', color: '#1e40af', padding: '0.75rem', borderRadius: '12px', fontWeight: '700', border: '1px solid #bfdbfe', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.target.style.background = '#dbeafe'}
                            onMouseLeave={e => e.target.style.background = '#eff6ff'}
                        >
                            <Map size={18} /> Track Live Status
                        </button>
                    </div>

                    <div style={{ background: 'f9fafb', padding: '1rem', borderRadius: '16px', marginLeft: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><p style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600', marginBottom: '2px' }}>YOU EARN</p><p style={{ fontSize: '1.4rem', fontWeight: '800', color: '#059669' }}>₹{Math.floor((order.deliveryFee || 150) * 0.9)}</p></div>
                      {order.status === 'pending' && <button onClick={() => handleAcceptOrder(order)} style={{ background: '#111827', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>{t('btn_accept')}</button>}
                      {order.status === 'accepted' && <button onClick={() => handleVerifyPickup(order)} style={{ background: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>{t('btn_verify')}</button>}
                      {order.status === 'picked' && <button onClick={() => handleDeliverOrder(order)} style={{ background: '#059669', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)' }}>{t('btn_finish')}</button>}
                      {order.status === 'delivered' && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: '700' }}><span>✅</span> Paid</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState('en');
  const t = (key) => TRANSLATIONS[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RiderLanding />} />
          <Route path="/login" element={<AuthPage isLogin={true} />} />
          <Route path="/register" element={<AuthPage isLogin={false} />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </LanguageContext.Provider>
  );
}
