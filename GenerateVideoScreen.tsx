import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChevronLeftIcon, SparklesIcon } from '../components/icons';

const loadingMessages = [
    'تحضير المخرج الذكي...',
    'إعداد موقع التصوير الافتراضي...',
    'تشغيل الكاميرات الرقمية...',
    'معالجة المشهد...',
    'إضافة المؤثرات الخاصة...',
    'وضع اللمسات النهائية على التحفة الفنية...',
    'على وشك الانتهاء...',
];

interface GenerateVideoScreenProps {
    onBack: () => void;
}

export const GenerateVideoScreen: React.FC<GenerateVideoScreenProps> = ({ onBack }) => {
    const [hasApiKey, setHasApiKey] = useState(false);
    const [isCheckingApiKey, setIsCheckingApiKey] = useState(true);
    
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('9:16');
    const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [error, setError] = useState<string | null>(null);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    
    const messageIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        const checkKey = async () => {
            setIsCheckingApiKey(true);
            try {
                const keyStatus = await window.aistudio.hasSelectedApiKey();
                setHasApiKey(keyStatus);
            } catch (e) {
                console.error("Failed to check API key status:", e);
                setHasApiKey(false);
            } finally {
                setIsCheckingApiKey(false);
            }
        };
        checkKey();

        return () => {
            if (messageIntervalRef.current) {
                clearInterval(messageIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isLoading) {
            let i = 0;
            messageIntervalRef.current = window.setInterval(() => {
                i = (i + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[i]);
            }, 3000);
        } else {
            if (messageIntervalRef.current) {
                clearInterval(messageIntervalRef.current);
            }
        }
    }, [isLoading]);

    const handleSelectKey = async () => {
        try {
            await window.aistudio.openSelectKey();
            setHasApiKey(true); // Assume success to avoid race condition
            setError(null);
        } catch (e) {
            console.error("Could not open select key dialog:", e);
            setError("فشل في فتح نافذة اختيار المفتاح. يرجى المحاولة مرة أخرى.");
        }
    };

    const handleGenerate = async () => {
        if (!prompt || isLoading) return;

        setIsLoading(true);
        setError(null);
        setGeneratedVideoUrl(null);
        setLoadingMessage(loadingMessages[0]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                config: {
                    numberOfVideos: 1,
                    resolution: resolution,
                    aspectRatio: aspectRatio,
                }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) {
                throw new Error("لم يتم العثور على رابط الفيديو في استجابة المخدم.");
            }
            
            const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            if (!response.ok) {
                 throw new Error(`فشل في تحميل الفيديو: ${response.statusText}`);
            }
            const videoBlob = await response.blob();
            const videoUrl = URL.createObjectURL(videoBlob);
            setGeneratedVideoUrl(videoUrl);

        } catch (e: any) {
            console.error("Video generation failed:", e);
            if (e.message && e.message.includes("Requested entity was not found.")) {
                setHasApiKey(false);
                setError("مفتاح API الخاص بك غير صالح. يرجى اختيار مفتاح صالح والمحاولة مرة أخرى.");
            } else {
                setError(e.message || "حدث خطأ غير معروف أثناء إنشاء الفيديو.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderContent = () => {
        if (isCheckingApiKey) {
            return (
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
                </div>
            );
        }
        
        if (!hasApiKey) {
            return (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                    <SparklesIcon className="w-16 h-16 text-purple-400 mb-4" />
                    <h2 className="text-xl font-bold mb-2">مفتاح API مطلوب</h2>
                    <p className="text-gray-400 mb-6">
                        لإنشاء فيديوهات باستخدام Veo، يجب عليك اختيار مفتاح API من Google AI Studio.
                    </p>
                    <button onClick={handleSelectKey} className="w-full max-w-xs bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-500 transition-colors">
                        اختيار مفتاح API
                    </button>
                    <p className="text-xs text-gray-500 mt-4">
                        قد يتم تطبيق رسوم. للمزيد من المعلومات، يرجى زيارة <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-400">وثائق الفوترة</a>.
                    </p>
                </div>
            );
        }
        
        if (isLoading) {
             return (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-500 mb-6"></div>
                    <h2 className="text-2xl font-bold mb-2 text-white">جاري الإنشاء...</h2>
                    <p className="text-lg text-gray-300 transition-opacity duration-500">{loadingMessage}</p>
                    <p className="text-sm text-gray-500 mt-4">قد تستغرق هذه العملية بضع دقائق.</p>
                </div>
             );
        }
        
        return (
             <div className="flex-1 flex flex-col gap-6 p-4">
                 {generatedVideoUrl ? (
                    <div className="flex flex-col items-center gap-4">
                        <video src={generatedVideoUrl} controls className="w-full max-w-md rounded-lg aspect-[9/16] bg-black object-contain" />
                        <button onClick={() => setGeneratedVideoUrl(null)} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                            إنشاء فيديو آخر
                        </button>
                    </div>
                 ) : (
                    <>
                        <div>
                             <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                                صف الفيديو الذي تتخيله
                            </label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="مثال: قطة ترتدي نظارات شمسية وتقود سيارة رياضية حمراء"
                                rows={5}
                                className="w-full bg-gray-800 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                            />
                        </div>

                        <div className="space-y-4">
                             <div>
                                <h3 className="text-sm font-medium text-gray-300 mb-2">أبعاد الفيديو</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => setAspectRatio('9:16')} className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 ${aspectRatio === '9:16' ? 'bg-purple-600 border-purple-600' : 'border-gray-700 hover:bg-gray-800'}`}>طولي (9:16)</button>
                                    <button onClick={() => setAspectRatio('16:9')} className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 ${aspectRatio === '16:9' ? 'bg-purple-600 border-purple-600' : 'border-gray-700 hover:bg-gray-800'}`}>عرضي (16:9)</button>
                                </div>
                            </div>
                             <div>
                                <h3 className="text-sm font-medium text-gray-300 mb-2">الدقة</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => setResolution('720p')} className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 ${resolution === '720p' ? 'bg-purple-600 border-purple-600' : 'border-gray-700 hover:bg-gray-800'}`}>720p</button>
                                    <button onClick={() => setResolution('1080p')} className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 ${resolution === '1080p' ? 'bg-purple-600 border-purple-600' : 'border-gray-700 hover:bg-gray-800'}`}>1080p</button>
                                </div>
                            </div>
                        </div>
                        
                        {error && (
                            <div className="text-center text-red-400 bg-red-900/30 p-3 rounded-lg">
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                        
                        <div className="mt-auto">
                            <button
                                onClick={handleGenerate}
                                disabled={!prompt.trim()}
                                className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-purple-500 flex items-center justify-center gap-2"
                            >
                                <SparklesIcon className="w-5 h-5"/>
                                <span>إنشاء</span>
                            </button>
                        </div>
                    </>
                 )}
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full bg-black text-white pb-20 overflow-y-auto relative">
             <header className="flex items-center p-4 sticky top-0 bg-black/80 backdrop-blur-sm z-10">
                <button onClick={onBack} aria-label="العودة" className="p-2 -ml-2">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-center flex-1 -ml-10">إنشاء فيديو بالذكاء الاصطناعي</h1>
            </header>
            {renderContent()}
        </div>
    )
}