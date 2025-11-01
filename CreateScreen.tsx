import React, { useState, useRef } from 'react';
import { UploadIcon, LiveIcon, ChevronLeftIcon, SparklesIcon } from '../components/icons';
import { type User } from '../types';
import { uploadToCloudinary } from '../services/cloudinaryService';

interface CreateScreenProps {
  onPostCreated: () => void;
  addVideoPost: (postData: { caption: string; songName: string; videoUrl: string; thumbnailUrl?: string; }) => void;
  currentUser: User;
  onGoLive: () => void;
  onGenerateVideo: () => void;
}

export const CreateScreen: React.FC<CreateScreenProps> = ({ onPostCreated, addVideoPost, currentUser, onGoLive, onGenerateVideo }) => {
  const [mode, setMode] = useState<'choice' | 'upload'>('choice');
  const [caption, setCaption] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Converts a File object into a data URL (base64 encoded string).
   * This is used to create an in-memory preview of the file that can be displayed
   * in an `<img>` or `<video>` tag.
   * @param file The file to convert.
   * @returns A promise that resolves with the data URL string.
   */
  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error || new Error('An unknown error occurred while reading the file.'));
      reader.readAsDataURL(file);
    });
  };
  
  /**
   * Generates a thumbnail from the first few seconds of a video file for local preview.
   * @param file The video file from which to generate a thumbnail.
   * @returns A promise that resolves with the thumbnail's data URL string.
   */
  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const videoUrl = URL.createObjectURL(file);
        
        let timeoutId: number;

        const cleanup = () => {
            URL.revokeObjectURL(videoUrl);
            clearTimeout(timeoutId);
            video.onloadedmetadata = null;
            video.onseeked = null;
            video.onerror = null;
            video.remove();
        };

        video.onloadedmetadata = () => {
            video.currentTime = Math.min(1, video.duration / 2);
        };

        video.onseeked = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    cleanup();
                    return reject(new Error('Could not get 2D context from canvas.'));
                }
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                cleanup();
                resolve(dataUrl);
            } catch (err) {
                cleanup();
                const errorMessage = err instanceof Error ? err.message : String(err);
                reject(new Error(`فشل في إنشاء الصورة المصغرة من الفيديو: ${errorMessage}`));
            }
        };

        video.onerror = () => {
            cleanup();
            const errorDetails = video.error ? `code ${video.error.code}: ${video.error.message}` : 'An unknown error occurred while loading the video.';
            reject(new Error(`فشل تحميل الفيديو. التفاصيل: ${errorDetails}`));
        };

        timeoutId = window.setTimeout(() => {
            cleanup();
            reject(new Error('انتهت مهلة معالجة الفيديو بعد 20 ثانية.'));
        }, 20000);

        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        video.src = videoUrl;
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);
    setFileType(file.type);
    setSelectedFile(file); // Store the actual file for upload
    setThumbnailUrl(null);

    try {
      const dataUrl = await fileToDataURL(file);
      setFilePreview(dataUrl);

      if (file.type.startsWith('video/')) {
        try {
            const thumbUrl = await generateVideoThumbnail(file);
            setThumbnailUrl(thumbUrl);
        } catch (thumbError) {
            console.warn("Could not generate local video thumbnail:", thumbError);
            setThumbnailUrl(null);
        }
      } else {
        setThumbnailUrl(dataUrl);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Failed to process file for preview:', err);
      setError(`فشل في معالجة الملف. ${errorMessage}. يرجى التأكد من أن صيغة الملف مدعومة والمحاولة مرة أخرى.`);
      setFilePreview(null);
      setThumbnailUrl(null);
      setFileType(null);
      setSelectedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePost = async () => {
    if (!selectedFile || isProcessing || isUploading) return;
    
    setIsUploading(true);
    setError(null);

    try {
      // Upload the file to Cloudinary
      const { url, thumbnailUrl: cloudThumbnailUrl } = await uploadToCloudinary(selectedFile);
      
      // Add the post using the URLs from Cloudinary
      addVideoPost({
        caption,
        songName: `Original Sound - @${currentUser.username}`,
        videoUrl: url,
        thumbnailUrl: cloudThumbnailUrl,
      });
      
      onPostCreated();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during upload.";
      console.error('Upload failed:', err);
      setError(`فشل رفع الملف: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  if (mode === 'choice') {
    return (
      <div className="flex flex-col h-full bg-black text-white p-4 pb-20 justify-center items-center gap-6">
        <h1 className="text-2xl font-bold text-center mb-4">إنشاء محتوى جديد</h1>
         <button
          disabled
          title="هذه الميزة متاحة فقط في بيئة التطوير الخاصة بـ Google AI Studio"
          className="w-full max-w-sm flex flex-col items-center justify-center p-8 bg-gray-600 rounded-2xl cursor-not-allowed opacity-60"
        >
          <SparklesIcon className="w-12 h-12 mb-4" />
          <span className="text-xl font-bold">إنشاء فيديو بالذكاء الاصطناعي</span>
          <span className="text-xs mt-2 text-gray-300">(غير متاحة في النسخة المنشورة)</span>
        </button>
        <button
          onClick={() => setMode('upload')}
          className="w-full max-w-sm flex flex-col items-center justify-center p-8 bg-purple-600 rounded-2xl hover:bg-purple-500 transition-transform transform hover:scale-105"
        >
          <UploadIcon className="w-12 h-12 mb-4" />
          <span className="text-xl font-bold">تحميل فيديو أو صورة</span>
        </button>
        <button
          onClick={onGoLive}
          className="w-full max-w-sm flex flex-col items-center justify-center p-8 bg-pink-500 rounded-2xl hover:bg-pink-400 transition-transform transform hover:scale-105"
        >
          <LiveIcon className="w-12 h-12 mb-4" />
          <span className="text-xl font-bold">بدء بث مباشر</span>
        </button>
      </div>
    );
  }

  const resetSelection = () => {
    setFilePreview(null);
    setFileType(null);
    setThumbnailUrl(null);
    setSelectedFile(null);
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-4 pb-20 overflow-y-auto">
      <header className="flex items-center mb-6">
        <button onClick={() => setMode('choice')} aria-label="العودة" className="p-2 -ml-2">
            <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-center flex-1 -ml-10">تحميل منشور جديد</h1>
      </header>
        <div className="flex-1 flex flex-col gap-6">
            {!filePreview ? (
                 <label 
                    className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-800 transition-colors"
                    htmlFor="file-upload"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') triggerFileSelect(); }}
                >
                    <UploadIcon className="w-12 h-12 text-gray-500 mb-4" />
                    <h2 className="font-semibold text-lg">تحميل فيديو أو صورة</h2>
                    <p className="text-sm text-gray-400">انقر هنا لاختيار ملف</p>
                </label>
            ) : (
                <div className="relative w-full aspect-[9/16] rounded-lg overflow-hidden bg-black flex items-center justify-center">
                   {isProcessing ? (
                      <div className="flex flex-col items-center text-gray-400">
                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
                        <p className="mt-4">جاري المعالجة...</p>
                      </div>
                    ) : (
                      <>
                        {fileType?.startsWith('image/') && <img src={filePreview} alt="Preview" className="max-h-full max-w-full object-contain" />}
                        {fileType?.startsWith('video/') && <video src={filePreview} controls autoPlay loop muted className="max-h-full max-w-full object-contain" />}
                        <button onClick={resetSelection} className="absolute top-2 right-2 bg-black/50 text-white rounded-full py-1 px-3 text-xs">
                            تغيير
                        </button>
                      </>
                    )}
                </div>
            )}
             <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-matroska,image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isProcessing || isUploading}
            />
            
            {error && (
                <div className="mt-4 text-center text-red-400 bg-red-900/30 p-3 rounded-lg">
                    <p className="text-sm">{error}</p>

                </div>
            )}

            <div>
                 <label htmlFor="caption" className="block text-sm font-medium text-gray-300 mb-2">
                    الوصف
                </label>
                <textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="اكتب وصفاً..."
                    rows={4}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                />
            </div>
        </div>

        <div className="mt-auto pt-6">
            <button
                onClick={handlePost}
                disabled={!filePreview || isProcessing || isUploading}
                className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
            >
                {isUploading ? 'جاري الرفع...' : (isProcessing ? 'جاري المعالجة...' : 'نشر')}
            </button>
        </div>
    </div>
  );
};