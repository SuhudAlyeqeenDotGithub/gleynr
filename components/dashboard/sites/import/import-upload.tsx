import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import type { ImportFormat } from "@/lib/sites/types";

type ImportUploadProps = {
  format: ImportFormat;
  fileName?: string;
  onFile: (name: string, text: string, error?: string) => void;
};

const MAX_BYTES = 2 * 1024 * 1024;

const ImportUpload = ({ format, fileName, onFile }: ImportUploadProps) => {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const read = async (file?: File) => {
    if (!file) return;
    if (file.size > MAX_BYTES)
      return onFile(
        file.name,
        "",
        "The file is larger than the 2 MB prototype limit.",
      );
    onFile(file.name, await file.text());
    if (input.current) input.current.value = "";
  };

  return (
    <div
      className={`upload-zone drop-zone ${dragging ? "dragging" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        void read(event.dataTransfer.files[0]);
      }}
    >
      <UploadCloud size={24} />
      <strong>{fileName ?? `Drop a .${format} file here`}</strong>
      <span>Files are parsed in your browser and never uploaded.</span>
      <button
        className="button secondary"
        onClick={() => input.current?.click()}
      >
        Choose file
      </button>
      <input
        ref={input}
        type="file"
        hidden
        accept={format === "csv" ? ".csv,text/csv" : ".json,application/json"}
        onChange={(event) => void read(event.target.files?.[0])}
      />
    </div>
  );
};

export default ImportUpload;
