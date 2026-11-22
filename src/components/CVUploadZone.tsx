import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  FileUp,
  FolderOpen,
  Image as ImageIcon,
  Lock,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { formatFileSize, validateUploadedFileMeta } from '../shared/scoring';
import type { CVAnalysisResult, SupportedFileType } from '../shared/types';

interface CVUploadZoneProps {
  onAnalysisComplete: (result: CVAnalysisResult) => void;
  targetRoleHint?: string;
  compact?: boolean;
}

type UploadStage = 'idle' | 'selected' | 'uploading' | 'analyzing' | 'error';

const TEXT_ANALYSIS_STEPS = [
  'Uploading CV securely...',
  'Extracting document text and layout signals...',
  'Scoring against 7 evaluation categories...',
  'Auditing ATS compatibility and grammar...',
];

const VISION_ANALYSIS_STEPS = [
  'Uploading CV securely...',
  'Reading CV text and layout with AI Vision...',
  'Extracting experience, skills, and education...',
  'Scoring against 7 evaluation categories...',
];

const CLIENT_TIMEOUT_MS = 105_000;

export function CVUploadZone({
  onAnalysisComplete,
  targetRoleHint,
  compact = false,
}: CVUploadZoneProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isSubmittingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const stepIntervalRef = useRef<number | null>(null);

  const [maxFileSizeMb, setMaxFileSizeMb] = useState<number>(5);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<SupportedFileType | null>(null);
  const [selectedIsImage, setSelectedIsImage] = useState(false);
  const [previewEntry, setPreviewEntry] = useState<{ file: File; url: string } | null>(null);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const previewUrl =
    selectedFile && previewEntry?.file === selectedFile ? previewEntry.url : null;

  const [stage, setStage] = useState<UploadStage>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { maxFileSizeMb?: number } | null) => {
        if (active && data?.maxFileSizeMb && Number.isFinite(data.maxFileSizeMb)) {
          setMaxFileSizeMb(data.maxFileSizeMb);
        }
      })
      .catch(() => {
        // Keep default 5MB limit if health check is temporarily unreachable
      });
    return () => {
      active = false;
    };
  }, []);

  // Create and deterministically revoke Object URL for image CV preview
  useEffect(() => {
    setThumbnailFailed(false);
    if (!selectedFile || !selectedIsImage) {
      setPreviewEntry(null);
      setShowFullPreview(false);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewEntry({ file: selectedFile, url });
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile, selectedIsImage]);

  // Abort active request and clear timers on unmount
  useEffect(() => {
    return () => {
      if (stepIntervalRef.current !== null) {
        window.clearInterval(stepIntervalRef.current);
      }
      abortControllerRef.current?.abort();
    };
  }, []);

  const clearTimers = () => {
    if (stepIntervalRef.current !== null) {
      window.clearInterval(stepIntervalRef.current);
      stepIntervalRef.current = null;
    }
  };

  const handleFilePicked = useCallback(
    (file: File | undefined | null) => {
      if (!file || isSubmittingRef.current) return;
      const maxBytes = maxFileSizeMb * 1024 * 1024;
      const check = validateUploadedFileMeta(
        file.name,
        file.type,
        file.size,
        maxBytes
      );

      if (!check.valid || !check.fileType) {
        setSelectedFile(null);
        setSelectedFileType(null);
        setSelectedIsImage(false);
        setShowFullPreview(false);
        setStage('error');
        setErrorMessage(check.error ?? 'Invalid file selected.');
        return;
      }

      setSelectedFile(file);
      setSelectedFileType(check.fileType);
      setSelectedIsImage(Boolean(check.isImage));
      setShowFullPreview(false);
      setStage('selected');
      setErrorMessage(null);
      setProgress(0);
    },
    [maxFileSizeMb]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFilePicked(file);
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging && !isSubmittingRef.current) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFilePicked(file);
  };

  const clearSelection = () => {
    if (isSubmittingRef.current) return;
    clearTimers();
    setSelectedFile(null);
    setSelectedFileType(null);
    setSelectedIsImage(false);
    setShowFullPreview(false);
    setStage('idle');
    setProgress(0);
    setStatusMessage('');
    setErrorMessage(null);
  };

  const startAnalysis = async () => {
    if (!selectedFile || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    clearTimers();
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;
    let didClientTimeout = false;

    const timeoutHandle = window.setTimeout(() => {
      didClientTimeout = true;
      controller.abort();
    }, CLIENT_TIMEOUT_MS);

    const steps = selectedIsImage ? VISION_ANALYSIS_STEPS : TEXT_ANALYSIS_STEPS;

    setStage('uploading');
    setErrorMessage(null);
    setShowFullPreview(false);
    setProgress(15);
    setStatusMessage(steps[0]);

    const formData = new FormData();
    formData.append('cv', selectedFile);
    if (targetRoleHint) {
      formData.append('targetRole', targetRoleHint);
    }

    let stepIdx = 0;
    stepIntervalRef.current = window.setInterval(() => {
      stepIdx = Math.min(steps.length - 1, stepIdx + 1);
      setStage('analyzing');
      setStatusMessage(steps[stepIdx]);
      setProgress((prev) => Math.min(92, prev + 16));
    }, 1400);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimers();
      window.clearTimeout(timeoutHandle);

      const rawText = await response.text();
      let parsedBody: { analysis?: CVAnalysisResult; error?: string } = {};
      try {
        parsedBody = JSON.parse(rawText) as {
          analysis?: CVAnalysisResult;
          error?: string;
        };
      } catch {
        throw new Error(
          response.ok
            ? 'Unexpected response format from the server. Please try again.'
            : `Analysis failed (HTTP ${response.status}). Please retry.`
        );
      }

      if (!response.ok || !parsedBody.analysis) {
        throw new Error(
          parsedBody.error ?? 'Failed to analyze your CV. Please try again.'
        );
      }

      setProgress(100);
      setStatusMessage('Analysis complete!');
      onAnalysisComplete(parsedBody.analysis);
    } catch (err: unknown) {
      clearTimers();
      window.clearTimeout(timeoutHandle);

      setStage('error');
      setProgress(0);
      setStatusMessage('');

      if (err instanceof DOMException && err.name === 'AbortError') {
        setErrorMessage(
          didClientTimeout
            ? 'The analysis request took too long to complete. Please click Retry Analysis or try a smaller/clearer file.'
            : 'Analysis was interrupted. Click Retry Analysis to try again.'
        );
      } else {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred during analysis.'
        );
      }
    } finally {
      isSubmittingRef.current = false;
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  };

  const isProcessing = stage === 'uploading' || stage === 'analyzing';
  const canPreview = Boolean(previewUrl && selectedIsImage && !thumbnailFailed);

  return (
    <div id="cv-upload-zone" className="w-full max-w-3xl mx-auto">
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept=".pdf,.docx,.jpg,.jpeg,.png,.webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="sr-only"
        aria-label="Upload CV file in PDF, DOCX, JPG, PNG, or WebP format"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="cv-dropzone"
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${
          compact ? 'px-6 py-8 sm:px-8 sm:py-10' : 'px-6 py-8 sm:px-10 sm:py-11'
        } ${
          isDragging
            ? 'border-[#1677FF] bg-[#1677FF]/[0.08] shadow-[0_0_40px_rgba(22,119,255,0.18)]'
            : 'border-white/15 bg-[#090C12]/90 hover:border-white/25'
        }`}
      >
        {/* Idle State */}
        {stage === 'idle' && (
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] text-white">
              <FileUp className="h-6 w-6" aria-hidden="true" />
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Drop your CV here
            </h2>
            <p className="mt-1.5 text-sm text-zinc-400">
              PDF, DOCX, or CV image (JPG, PNG, WebP) <span aria-hidden="true">·</span> Max{' '}
              {maxFileSizeMb} MB <span aria-hidden="true">·</span> Upload securely
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 inline-flex items-center gap-2.5 rounded-xl bg-[#1677FF] hover:bg-[#2584FF] active:bg-[#1262D6] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_24px_rgba(22,119,255,0.35)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090C12]"
            >
              <FolderOpen className="h-4 w-4" aria-hidden="true" />
              <span>Choose your CV</span>
            </button>
          </div>
        )}

        {/* File Selected State */}
        {stage === 'selected' && selectedFile && (
          <div className="flex flex-col items-center text-center">
            <div className="w-full max-w-lg rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {selectedIsImage && previewUrl && !thumbnailFailed ? (
                    <img
                      src={previewUrl}
                      alt={`Preview of ${selectedFile.name}`}
                      onError={() => setThumbnailFailed(true)}
                      className="h-12 w-10 shrink-0 rounded-lg object-cover border border-white/15 bg-black"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1677FF]/15 text-[#3B82F6]">
                      {selectedIsImage ? (
                        <ImageIcon className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <FileText className="h-5 w-5" aria-hidden="true" />
                      )}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-zinc-400 tabular-nums">
                      {selectedFileType?.toUpperCase()} <span aria-hidden="true">·</span>{' '}
                      {formatFileSize(selectedFile.size)} <span aria-hidden="true">·</span> Ready for analysis
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {canPreview && (
                    <button
                      type="button"
                      onClick={() => setShowFullPreview((prev) => !prev)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {showFullPreview ? (
                        <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>{showFullPreview ? 'Hide' : 'Preview'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={clearSelection}
                    aria-label="Remove selected CV file"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {showFullPreview && previewUrl && selectedIsImage && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <img
                    src={previewUrl}
                    alt={`Full preview of ${selectedFile.name}`}
                    className="max-h-72 w-auto mx-auto rounded-lg border border-white/10 object-contain bg-black"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={startAnalysis}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1677FF] hover:bg-[#2584FF] disabled:opacity-60 px-7 py-3 text-sm font-semibold text-white shadow-[0_6px_24px_rgba(22,119,255,0.35)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677FF]"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Analyze My CV</span>
              </button>
            </div>
          </div>
        )}

        {/* Uploading / Analyzing Progress State */}
        {isProcessing && selectedFile && (
          <div className="flex flex-col items-center text-center py-2" aria-live="polite">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1677FF]/15 text-[#3B82F6]">
              <RefreshCw className="h-6 w-6 animate-spin" aria-hidden="true" />
            </div>
            <p className="text-base font-semibold text-white">
              {statusMessage || 'Analyzing your CV...'}
            </p>
            <p className="mt-1 text-xs text-zinc-400 truncate max-w-md">
              {selectedFile.name} ({formatFileSize(selectedFile.size)})
            </p>

            <div className="mt-5 w-full max-w-md">
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#1677FF] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-zinc-400 tabular-nums">
                {progress}% complete
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {stage === 'error' && (
          <div className="flex flex-col items-center text-center" role="alert">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/15 text-red-400 border border-red-500/25">
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Could not analyze this document
            </h3>
            <p className="mt-1.5 text-sm text-red-300/90 max-w-lg leading-relaxed">
              {errorMessage}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {selectedFile && (
                <button
                  type="button"
                  onClick={startAnalysis}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1677FF] hover:bg-[#2584FF] disabled:opacity-60 px-5 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  <span>Retry Analysis</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-5 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer"
              >
                <FolderOpen className="h-4 w-4" aria-hidden="true" />
                <span>Choose Different File</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trust Note Directly Below Dropzone */}
      <div className="mt-3.5 flex items-center justify-center gap-2 text-xs text-zinc-400 text-center">
        <Lock className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
        <span>No account required · Free basic analysis</span>
      </div>
    </div>
  );
}
