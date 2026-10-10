import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { ToolConfig } from '../../types';
import { DropZone } from './DropZone';
import { Download, RefreshCw, ZoomIn, ZoomOut, Check, Crop } from 'lucide-react';
import { getCroppedImg } from '../../processors/cropHelper';

export function CropWorkspace({ tool }: { tool: ToolConfig }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const aspectRatio = tool.processorConfig?.aspectRatio || undefined;
  const cropShape = tool.processorConfig?.shape === 'circle' ? 'round' : 'rect';

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFilesSelected = (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];
      setOriginalFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = async () => {
    if (!imageSrc || !croppedAreaPixels || !originalFile) return;
    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        { type: originalFile.type === 'image/png' || cropShape === 'round' ? 'image/png' : 'image/jpeg' }
      );
      
      const url = URL.createObjectURL(croppedBlob);
      setResultBlob(croppedBlob);
      setResultUrl(url);
    } catch (e) {
      console.error(e);
      alert('Failed to crop image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setImageSrc(null);
    setOriginalFile(null);
    setResultUrl(null);
    setResultBlob(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const handleDownload = () => {
    if (!resultUrl || !originalFile) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const ext = cropShape === 'round' || originalFile.type === 'image/png' ? 'png' : 'jpg';
    a.download = `cropped_${originalFile.name.replace(/\.[^/.]+$/, "")}.${ext}`;
    a.click();
  };

  if (!imageSrc) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 md:p-10 min-h-[500px]">
        <DropZone onFilesSelected={handleFilesSelected} accept={tool.acceptedFormats?.join(',')} />
      </div>
    );
  }

  if (resultUrl) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 md:p-10">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Crop Successful!</h2>
          <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 max-w-full">
            <img src={resultUrl} alt="Cropped result" className="max-h-[400px] object-contain rounded shadow-sm" />
          </div>
          
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md shadow-primary-500/20 transition-all active:scale-[0.98]"
            >
              <Download className="w-5 h-5" /> Download Image
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-all"
            >
              <RefreshCw className="w-5 h-5" /> Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 md:p-6 min-h-[600px] flex flex-col md:flex-row gap-6">
      
      {/* Crop Editor Area */}
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-slate-900 min-h-[400px] shadow-inner">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspectRatio}
          cropShape={cropShape}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          showGrid={true}
        />
      </div>

      {/* Controls Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Crop className="w-4 h-4" /> Adjust Crop
          </h3>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                <span>Zoom</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                <span>Rotation</span>
                <span>{rotation}°</span>
              </div>
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleCrop}
          disabled={isProcessing}
          className="mt-auto w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md shadow-primary-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Check className="w-5 h-5" /> Apply Crop</>
          )}
        </button>
      </div>
    </div>
  );
}
