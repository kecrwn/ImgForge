import React, { useState, useRef, useEffect } from 'react';
import { ToolConfig } from '../../types';
import { DropZone } from './DropZone';
import { Pipette, RefreshCw, Copy, Check } from 'lucide-react';

export function ColorPickerWorkspace({ tool }: { tool: ToolConfig }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files && files.length > 0) {
      setImageSrc(URL.createObjectURL(files[0]));
    }
  };

  useEffect(() => {
    if (imageSrc && canvasRef.current && imgRef.current) {
      const img = imgRef.current;
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
      };
    }
  }, [imageSrc]);

  const getColorAtEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    return hex.toUpperCase();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    const color = getColorAtEvent(e);
    if (color) setHoverColor(color);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const color = getColorAtEvent(e);
    if (color) {
      setPickedColor(color);
      setCopied(false);
    }
  };

  const copyToClipboard = () => {
    if (pickedColor) {
      navigator.clipboard.writeText(pickedColor);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reset = () => {
    setImageSrc(null);
    setPickedColor(null);
    setHoverColor(null);
  };

  if (!imageSrc) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 md:p-10 min-h-[500px]">
        <DropZone onFilesSelected={handleFilesSelected} accept="image/jpeg,image/png,image/webp" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 md:p-6 min-h-[500px] flex flex-col md:flex-row gap-8">
      {/* Canvas Area */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-2xl flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-slate-800 overflow-hidden relative cursor-crosshair">
        <img ref={imgRef} src={imageSrc} alt="source" className="hidden" />
        <div className="relative inline-block max-w-full max-h-[500px] overflow-hidden rounded-lg">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            onMouseLeave={() => setHoverColor(null)}
            className="max-w-full max-h-[500px] object-contain block touch-none"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
          {/* Hover magnifier could go here, for now just basic pointer tracking */}
        </div>
        
        {hoverColor && (
          <div 
            className="absolute pointer-events-none rounded-full border-4 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)] w-12 h-12 flex items-center justify-center text-[10px] font-bold text-white bg-black/30 backdrop-blur-sm transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ 
              left: mousePos.x, 
              top: mousePos.y,
              backgroundColor: hoverColor
            }}
          />
        )}
      </div>

      {/* Controls Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Picked Color</h3>
            <p className="text-sm text-slate-500 mb-6">Click anywhere on the image to pick a color.</p>
          </div>
          
          <div 
            className="w-32 h-32 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors"
            style={{ backgroundColor: pickedColor || '#f8fafc' }}
          >
            {!pickedColor && <Pipette className="w-10 h-10 text-slate-300" />}
          </div>
          
          {pickedColor ? (
            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-3">
                <div className="flex-1 font-mono text-center font-bold text-slate-700 dark:text-slate-300">
                  {pickedColor}
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 text-slate-500 hover:text-primary-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Optional RGB / HSL converters could go here */}
            </div>
          ) : (
            <div className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center text-slate-400 text-sm border-dashed">
              No color selected yet
            </div>
          )}
        </div>

        <div className="mt-auto pt-6">
          <button
            onClick={reset}
            className="w-full py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" /> Choose New Image
          </button>
        </div>
      </div>
    </div>
  );
}
