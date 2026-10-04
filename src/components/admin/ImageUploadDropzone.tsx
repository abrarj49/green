'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import ServiceImage from '@/components/ServiceImage';

interface ImageUploadDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  presets?: Array<{ label: string; url: string }>;
}

export default function ImageUploadDropzone({
  value,
  onChange,
  label = 'Featured / Cover Image',
  presets = [],
}: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileStats, setFileStats] = useState<{ origSize: string; newSize: string } | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const processFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP, etc.)');
      return;
    }

    setIsProcessing(true);
    const origSizeStr = formatBytes(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Target max dimension 1280px to keep quality crisp while keeping DB size small (~60-120KB)
        const maxDim = 1280;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP at 82% quality (JPEG fallback if WebP unsupported)
        let dataUrl = canvas.toDataURL('image/webp', 0.82);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }

        // Calculate size of base64
        const approxBytes = Math.round((dataUrl.length * 3) / 4);
        setFileStats({
          origSize: origSizeStr,
          newSize: formatBytes(approxBytes),
        });

        onChange(dataUrl);
        setIsProcessing(false);
      };
      img.onerror = () => {
        setIsProcessing(false);
        alert('Could not decode the image file.');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = () => {
    onChange('');
    setFileStats(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-semibold text-red-600 hover:text-red-700 transition"
          >
            ✕ Remove Image (Set as No Image)
          </button>
        )}
      </div>

      {/* Main Upload Box & Live Preview Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Drag & Drop Upload Zone (7 Cols) */}
        <div className="md:col-span-7 space-y-3">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-[#1D8F2C] bg-[#1D8F2C]/5 scale-[1.01]'
                : 'border-neutral-300 hover:border-[#1D8F2C] hover:bg-neutral-50 bg-white'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#1D8F2C] mx-auto flex items-center justify-center mb-3">
              {isProcessing ? (
                <div className="w-6 h-6 border-2 border-[#1D8F2C] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>
              )}
            </div>

            <p className="text-sm font-bold text-neutral-800">
              {isProcessing
                ? 'Optimizing and preparing image...'
                : 'Click to upload image or drag & drop'}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Supports PNG, JPG, WebP, AVIF up to 10MB
            </p>

            {fileStats && (
              <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 text-[#1D8F2C] text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
                <span>✓ Optimized: {fileStats.newSize}</span>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-600">Original: {fileStats.origSize}</span>
              </div>
            )}
          </div>

          {/* Direct URL Input Toggle */}
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-600 mb-1.5 font-medium">
              <span>Or enter external image URL / path:</span>
            </div>
            <input
              type="text"
              value={value.startsWith('data:') ? '(Uploaded from device)' : value}
              onChange={(e) => {
                setFileStats(null);
                onChange(e.target.value);
              }}
              placeholder="e.g. /img/services/landscape-design.jpg or https://..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-[#1D8F2C] font-mono"
            />
          </div>

          {/* Presets library accordion */}
          {presets.length > 0 && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="text-xs font-bold text-[#1D8F2C] hover:underline inline-flex items-center gap-1"
              >
                <span>{showPresets ? '▲ Hide' : '▼ Pick from'} Saudi Landscape Library ({presets.length} options)</span>
              </button>

              {showPresets && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-56 overflow-y-auto p-1 border border-neutral-200 rounded-xl bg-neutral-50">
                  {presets.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        onChange(preset.url);
                        setFileStats(null);
                      }}
                      className={`text-left p-2 rounded-lg text-xs transition border ${
                        value === preset.url
                          ? 'border-[#1D8F2C] bg-[#1D8F2C]/10 text-[#1D8F2C] font-bold'
                          : 'border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      <div className="font-semibold truncate">{preset.label}</div>
                      <div className="text-[10px] font-mono text-neutral-400 truncate">{preset.url || '(No image)'}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Live Preview (5 Cols) */}
        <div className="md:col-span-5">
          <span className="block text-xs font-semibold text-neutral-600 mb-2">Live Image Preview:</span>
          <div className="w-full h-56 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm relative bg-[#1E202B]">
            <ServiceImage
              src={value}
              alt="Uploaded service visual preview"
              className="w-full h-full object-cover"
              containerClassName="w-full h-full relative overflow-hidden bg-[#1E202B]"
            />
          </div>
          <p className="text-[11px] text-neutral-400 mt-2 text-center">
            {value
              ? 'Preview how this image appears across the website.'
              : 'No image selected. The "No Image Available" badge will display.'}
          </p>
        </div>
      </div>
    </div>
  );
}
