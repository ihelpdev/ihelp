"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";

export default function UploadServicesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [previewData, setPreviewData] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus({ type: null, message: "" });
    setPreviewData(null);
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Try parsing to show a quick preview
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          setPreviewData(parsed);
        } catch (err) {
          setStatus({ type: "error", message: "Invalid JSON format in the uploaded file." });
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!previewData) return;

    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/admin/upload-services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(previewData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({ type: "success", message: "Services successfully updated in batch!" });
        setFile(null);
        setPreviewData(null);
        // reset file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setStatus({ type: "error", message: data.message || "Failed to upload." });
      }
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const getRecordCount = () => {
    if (!previewData) return 0;
    if (Array.isArray(previewData)) return previewData.length;
    if (previewData.on_demand_services && Array.isArray(previewData.on_demand_services)) return previewData.on_demand_services.length;
    return 0;
  };

  return (
    <div className="min-h-screen bg-surface p-6 md:p-12 text-on-surface flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Batch Upload Services</h1>
          <p className="text-on-surface-variant mt-2">
            Upload a JSON file containing on-demand skills/services to update the platform's mockup database.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center gap-6">
          <label 
            htmlFor="file-upload" 
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 rounded-xl cursor-pointer transition-colors"
          >
            <UploadCloud className="w-12 h-12 text-primary mb-3" />
            <span className="font-semibold text-primary">Click to select JSON file</span>
            <span className="text-sm text-on-surface-variant mt-1">or drag and drop</span>
            <input 
              id="file-upload" 
              type="file" 
              accept=".json,application/json" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </label>

          {file && (
            <div className="w-full bg-surface-container-low p-4 rounded-xl flex items-center justify-between border border-outline-variant">
              <div>
                <p className="font-semibold text-sm truncate max-w-[250px]">{file.name}</p>
                <p className="text-xs text-on-surface-variant">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              {previewData && status.type !== "error" && (
                <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  Valid JSON ({getRecordCount()} records)
                </div>
              )}
            </div>
          )}

          {status.type && (
            <div className={`w-full p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${status.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              {status.message}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!previewData || loading || status.type === "error"}
            className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Process & Save Batch"}
          </button>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-xl text-sm">
          <h3 className="font-bold mb-2">Expected JSON Format</h3>
          <p className="text-on-surface-variant mb-4">You can upload a flat array of services, or an object containing an <code>on_demand_services</code> key.</p>
          <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`[
  {
    "id": "srv_new_01",
    "name": "Electrical Repair",
    "slug": "electrical-repair",
    "category": "Pro",
    "description": "Fixing electrical issues.",
    "suggested_base_rate_ngn": 8000,
    "unit": "hour"
  }
]`}
          </pre>
        </div>
      </div>
    </div>
  );
}
