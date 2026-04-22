"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileVideo, FileImage, CheckCircle2, AlertCircle, Loader2, Link as LinkIcon, Trash2 } from "lucide-react";
import { getPresignedUploadUrl } from "@/app/actions/storage";

export default function TestStoragePage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resultKey, setResultKey] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    setUploadProgress(0);
    setError(null);

    try {
      // 1. Get presigned URL
      const folder = file.type.startsWith("video/") ? "videos" : "photos";
      const res = await getPresignedUploadUrl(file.name, file.type, folder);

      if (!res.success || !res.url) {
        throw new Error(res.error || "Gagal mendapatkan URL upload");
      }

      // 2. Upload with Progress (using XMLHttpRequest for progress)
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", res.url, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setStatus("success");
          setResultKey(res.key!);
          // Construct public URL
          const publicUrlBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
          setResultUrl(`${publicUrlBase}/${res.key}`);
        } else {
          setError(`Upload gagal: ${xhr.statusText}`);
          setStatus("error");
        }
      };

      xhr.onerror = () => {
        setError("Network error saat upload");
        setStatus("error");
      };

      xhr.send(file);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan");
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setResultKey(null);
    setResultUrl(null);
    setUploadProgress(0);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-2"
        >
          Cloudflare R2 Test
        </motion.h1>
        <p className="text-gray-500">Uji coba upload foto & video ke storage baru kamu</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Dropzone */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          <div 
            className={`relative group border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer
              ${status === "uploading" ? "pointer-events-none opacity-50" : ""}
              ${file ? "border-emerald-500 bg-emerald-50/50" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50/50"}
            `}
          >
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileChange}
              disabled={status === "uploading"}
              accept="image/*,video/*"
            />
            
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <p className="font-semibold text-gray-700">Pilih File</p>
                  <p className="text-xs text-gray-400 mt-1">Foto atau Video (Maks 10GB)</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="selected"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {file.type.startsWith("video/") ? <FileVideo size={32} /> : <FileImage size={32} />}
                  </div>
                  <p className="font-semibold text-gray-700 truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-emerald-600 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || status === "uploading" || status === "success"}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all
              ${!file || status === "uploading" || status === "success"
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98]"
              }
            `}
          >
            {status === "uploading" ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Mengupload {uploadProgress}%
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle2 size={20} />
                Selesai!
              </>
            ) : (
              "Mulai Upload"
            )}
          </button>

          {status === "success" && (
            <button 
              onClick={reset}
              className="text-gray-400 hover:text-red-500 text-sm font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <Trash2 size={14} /> Hapus & Reset
            </button>
          )}
        </motion.div>

        {/* Results */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm"
        >
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            Status Terkini
          </h3>

          <div className="space-y-6">
            {status === "idle" && !file && (
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm">Belum ada file yang dipilih</p>
              </div>
            )}

            {status === "uploading" && (
              <div className="space-y-4">
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-blue-600"
                  />
                </div>
                <p className="text-sm text-center text-gray-500 italic">Sedang mengirim data ke Cloudflare...</p>
              </div>
            )}

            {status === "error" && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-900">Upload Gagal</p>
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900">File Berhasil Disimpan!</p>
                    <p className="text-xs text-emerald-600 mt-1">Tersimpan di bucket Cloudflare R2</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">File Key</label>
                    <div className="bg-gray-50 rounded-xl p-3 text-xs font-mono text-gray-600 break-all border border-gray-100">
                      {resultKey}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Public URL</label>
                    <a 
                      href={resultUrl || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-50 rounded-xl p-3 text-xs font-mono text-blue-600 break-all border border-blue-100 flex items-center gap-2 group hover:bg-blue-100 transition-colors"
                    >
                      <LinkIcon size={12} />
                      {resultUrl}
                    </a>
                  </div>
                </div>

                {file?.type.startsWith("image/") && resultUrl && (
                  <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100">
                    <img src={resultUrl} alt="Preview" className="w-full h-auto object-cover max-h-48" />
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
