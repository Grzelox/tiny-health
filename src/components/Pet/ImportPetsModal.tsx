"use client";

import { useImportPets } from "@/hooks/useQueries";
import { ImportPetsResult } from "@/types/pet";
import { FileUpIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";

interface ImportPetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CSV_TEMPLATE = [
  "name,animalType,breed,color,bornAt,weight,notes,isDead",
  "Mysza,Mysz,Standardowa,Szara,2024-01-15,35,Lubi orzechy,false",
  'Burek,Pies,Kundelek,"Brązowo-biały",2019-06-01,,,false',
].join("\n");

const downloadTemplate = () => {
  const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "szablon-importu-zwierzakow.csv");
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const ImportPetsModal: React.FC<ImportPetsModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslations("ImportPets");
  const importMutation = useImportPets();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportPetsResult | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
    setError(null);
    setResult(null);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError(t("errorNoFile"));
      return;
    }

    setError(null);
    setResult(null);

    try {
      const data = await importMutation.mutateAsync(selectedFile);
      setResult(data);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorImportFailed"));
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface/95 backdrop-blur-lg border border-border/80 shadow-2xl rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary-800">{t("title")}</h2>
          <button
            onClick={handleClose}
            className="btn-secondary p-2 rounded-xl hover:scale-110 transition-all duration-300"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-sm text-secondary-600 mb-6">
          <p>{t("intro")}</p>
          <div className="bg-background/60 border border-border/70 rounded-xl p-4 space-y-2">
            <p className="font-semibold text-secondary-700">{t("formatHeading")}</p>
            <p>
              {t("requiredColumnsPrefix")}{" "}
              <code className="px-1 py-0.5 rounded bg-secondary-100 text-secondary-800">name</code>{" "}
              {t("requiredColumnsName")}{" "}
              <code className="px-1 py-0.5 rounded bg-secondary-100 text-secondary-800">bornAt</code>{" "}
              {t("requiredColumnsBornAt")}
            </p>
            <p>
              {t("optionalColumnsPrefix")}{" "}
              <code className="px-1 py-0.5 rounded bg-secondary-100 text-secondary-800">
                animalType
              </code>
              ,{" "}
              <code className="px-1 py-0.5 rounded bg-secondary-100 text-secondary-800">breed</code>,{" "}
              <code className="px-1 py-0.5 rounded bg-secondary-100 text-secondary-800">color</code>,{" "}
              <code className="px-1 py-0.5 rounded bg-secondary-100 text-secondary-800">weight</code>{" "}
              {t("optionalColumnsWeight")}{" "}
              <code className="px-1 py-0.5 rounded bg-secondary-100 text-secondary-800">notes</code>{" "}
              {t("optionalColumnsAnd")}{" "}
              <code className="px-1 py-0.5 rounded bg-secondary-100 text-secondary-800">isDead</code>{" "}
              {t("optionalColumnsIsDead")}
            </p>
            <p>
              {t("quotingHintPrefix")}{" "}
              <code className="px-1 py-0.5 rounded bg-secondary-100 text-secondary-800">
                &quot;Brązowo-biały&quot;
              </code>
              {t("quotingHintSuffix")}
            </p>
            <button
              type="button"
              onClick={downloadTemplate}
              className="btn-secondary px-3 py-1.5 rounded-lg text-xs mt-2"
            >
              {t("downloadTemplate")}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-secondary-700">{t("fileLabel")}</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="w-full text-sm p-3 bg-background/70 backdrop-blur-sm border border-border rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300 text-secondary-800 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary-400 file:text-white"
          />

          {error && <p className="text-danger-600 text-sm">{error}</p>}
        </div>

        {result && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold text-secondary-700">
              {t("importedSummary", { imported: result.imported })}
              {result.failed > 0 && t("failedSummary", { failed: result.failed })}.
            </p>
            {result.failed > 0 && (
              <ul className="max-h-48 overflow-y-auto space-y-1 text-xs">
                {result.results
                  .filter((row) => row.status === "error")
                  .map((row) => (
                    <li
                      key={row.row}
                      className="bg-danger-50 text-danger-700 rounded-lg px-3 py-2 border border-danger-100"
                    >
                      {t("rowError", { row: row.row, name: row.name, message: row.message })}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary px-4 py-2 rounded-xl"
            disabled={importMutation.isPending}
          >
            {t("close")}
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!selectedFile || importMutation.isPending}
            className="btn-primary px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FileUpIcon className="w-4 h-4" />
            {importMutation.isPending ? t("importing") : t("import")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportPetsModal;
