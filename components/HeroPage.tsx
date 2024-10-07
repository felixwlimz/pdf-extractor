"use client";
import { FileText, FileUp, FileX } from "lucide-react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const HeroPage = () => {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const { toast } = useToast()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedPdfFiles = e.target.files;
    if (selectedPdfFiles && selectedPdfFiles.length > 0) {
      if (selectedPdfFiles[0].size > 10 * 1000 * 1024) {
        toast({
          title : 'Maximum size exceeded',
          variant : 'destructive'
        })
        return;
      }

      const newFiles = Array.from(selectedPdfFiles);
      setPdfFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      if (droppedFiles[0].size > 10 * 1000 * 1024){
         toast({
           title: "Maximum size exceeded",
           variant: "destructive",
         });
         return;
      }
      const newDroppedFiles = Array.from(droppedFiles);
      setPdfFiles((prevFiles) => [...prevFiles, ...newDroppedFiles]);
    }
  };

  const onDelete = (fileName: string) => {
    setPdfFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-[36px] font-bold">Extract your PDF files</h2>
      <p className="font-md text-lg">
        Drag and drop of a whole set for easy extraction
      </p>
      <div
        className={cn(
          "relative flex rounded-lg border border-dashed left-0 border-orange-500 w-[640px] lg:min-w-[1140px] h-[275px] lg:min-h-[380px] p-3",
          pdfFiles.length === 0 ? "items-center justify-center" : ""
        )}
      >
        {pdfFiles.length === 0 && (
          <div className="absolute flex flex-col gap-3 items-center h-full justify-center">
            <FileUp size={60} className="text-orange-600 font-semibold" />
            <p className="font-bold text-gray-400">
              Drag and drop PDF files to upload. Max 10MB
            </p>
          </div>
        )}
        <div className="flex flex-col flex-wrap w-full gap-3 items-start">
          {pdfFiles.length > 0 &&
            pdfFiles.map((pdfFile) => (
              <div className="flex gap-2" key={pdfFile.name}>
                <FileText />
                <span className="text-sm font-semibold">{pdfFile.name}</span>
                <FileX
                  onClick={() => onDelete(pdfFile.name)}
                  className="cursor-pointer"
                />
              </div>
            ))}
        </div>
        <Input
          type="file"
          multiple
          ref={fileInput}
          accept=".pdf,.docx"
          onChange={handleFileChange}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex gap-2">
        <Button
          className="bg-orange-500 hover:bg-orange-600 font-semibold"
          type="button"
        >
          Extract PDF
        </Button>
        {pdfFiles.length > 0 && (
          <Button
            variant="outline"
            className="border border-orange-500 hover:bg-orange-600 hover:text-white font-semibold"
            type="button"
            onClick={() => fileInput.current?.click()}
          >
            Add More Files
          </Button>
        )}
      </div>
    </section>
  );
};

export default HeroPage;
