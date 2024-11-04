"use client";
import { FileText, FileUp, FileX } from "lucide-react";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { decodeBase64ToFile, encodeFileToBase64, loadStoredFiles } from "@/utils";
import useRobot from "@/hooks/use-robot";
import path from 'path';
import Spinner from "@/components/Spinner";
import SideChat from "@/components/SideChat";
import Link from 'next/link';

type PdfFile = {
  base64: string;
  name: string;
};

const ExtractFiles = () => {


  const [selectedOption, setSelectedOption] = useState('');
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const {
    folderLink,
    setFolderLink,
    logs,
    loading,
    successMessageVisible,
    maxWords,
    handleLinkChange,
    addLog,
    clearLogs,
    stopJob,
    automate_summary,
    setSuccessMessageVisible,
    setMaxWords
  } = useRobot();
  const [language, setLanguage] = useState('en'); // Default language

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLanguage(window.navigator.language.slice(0, 2));
    }
  }, []);


  const handleMaxWordsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMaxWords(parseInt(value));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadedFiles = loadStoredFiles();
    setPdfFiles(loadedFiles);
  }, []);

  useEffect(() => {
    const filesToStore = pdfFiles.map(async (file) => ({
      base64: await encodeFileToBase64(file),
      name: file.name,
    }));
    Promise.all(filesToStore).then((storedFiles) =>
      localStorage.setItem("pdfFiles", JSON.stringify(storedFiles))
    );
  }, [pdfFiles]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedPdfFiles = e.target.files;
    if (selectedPdfFiles && selectedPdfFiles.length > 0) {
      if (selectedPdfFiles[0].size > 10 * 1000 * 1024) {
        toast({
          title: "Maximum size exceeded",
          variant: "destructive",
        });
        return;
      }
      const newFiles = Array.from(selectedPdfFiles);
      setPdfFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };
  const handleFileUpload = async () => {

    if (!selectedOption) {
      toast({ title: "Please select an option first", variant: "destructive" });
      return;
    }
    const time = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/Bangkok",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).replace(",", "").replace(" ", " ").split("/").map((part, index) => index === 0 ? part : part).join("/").replace(" ", " ");
    
    console.log(time); // Outputs in DD/MM/yyyy HH:mm:ss format

    const uploadsDir = 
      `public/uploads/${new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }))
        .toLocaleString("en-GB", { hour12: false })
        .replace(",", "")
        .replace(/\//g, "-")
        .replace(/:/g, "-")}`


    for (const file of pdfFiles) {
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const encodedDir = encodeURIComponent(uploadsDir);
        const response = await fetch(`/api/upload?uploadsDir=${encodedDir}`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          toast({ title: "Upload failed", variant: "destructive" });
          return;
        }
        const data = await response.json();
        toast({ title: `${file.name} uploaded successfully` });
        // Console log different messages based on selected option
      } catch (error) {
        toast({
          title: `Error uploading ${file.name}`,
          variant: "destructive",
        });
        return;
      }
    }
    const upload_path = process.env.NEXT_PUBLIC_UPLOAD_PATH + uploadsDir;

    if (selectedOption === 'template') {
      console.log('Extracting with template');
      clearLogs();
      
      automate_summary("Upload_Template", upload_path, true, time, pdfFiles.length, undefined, undefined);
    
    } else if (selectedOption === 'individual') {
      console.log('Summarizing individually');
      clearLogs();
      automate_summary("Upload_Summarize", upload_path, true, time, pdfFiles.length, false, maxWords )
    } else if (selectedOption === 'combine') {
      console.log('Summarizing together');
      clearLogs();
      automate_summary("Upload_Summarize", upload_path, true, time, pdfFiles.length, true, maxWords)
    }
  };
   const handleDrop = async (e: DragEvent) => {
     e.preventDefault();
     const droppedFiles = e.dataTransfer.files;
     if (droppedFiles && droppedFiles.length > 0) {
       if (droppedFiles[0].size > 10 * 1000 * 1024) {
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
    <div className={cn("w-full h-full ml-4 mb-10", isOpen && "flex gap-4")}>
      <section className="md:ml-64 flex flex-col items-center justify-center gap-8">
        <div className="flex w-full justify-start items-center">
          <div className="flex-none">
            <select
              className="border border-green-400 rounded-lg p-2"
              value={selectedOption}
              onChange={handleSelectChange}
            >
              <option value="">Select Option</option>
              <option value="template">Extract with Template</option>
              <option value="individual">Summarize Individually</option>
              <option value="combine">Summarize Together</option>
            </select>

          </div>

          {(selectedOption === 'individual' || selectedOption === 'combine') && (
            <div className="flex items-center ml-4"> {/* Added margin-left for spacing */}

              <label className="ml-4 mr-2">Max Words:</label>
              <input
                type="number"
                value={maxWords}
                onChange={handleMaxWordsChange}
                className="border border-green-400 rounded-lg p-2 w-24"
                placeholder="Max"
                min="0"
                max="1000"
              />
            </div>

          )}
        </div>
        <h2 className="lg:text-[36px] text-[28px] font-bold text-green-600">
          Extract from File
        </h2>
        <p className="font-md lg:text-lg text-md">
          Drag and drop of a whole set for easy extraction
        </p>

        <div
        className={cn(
          "relative flex rounded-lg border border-dashed left-0 border-green-400 w-[400px] md:w-[640px] lg:min-w-[1140px] h-[275px] lg:min-h-[200px] p-3",
          pdfFiles.length === 0 ? "items-center justify-center" : ""
        )}
        style={{ overflowY: "auto", maxHeight: "275px" }} 
        >
          {pdfFiles.length === 0 && (
            <div className="absolute flex flex-col gap-3 items-center h-full justify-center">
              <FileUp size={60} className="text-green-600 font-semibold" />
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

        {!loading && <div className="flex gap-2">
          <Button
            className="bg-green-500 hover:bg-green-600 font-semibold"
            type="button"
            onClick={handleFileUpload}
          >
            Extract PDF
          </Button>
          {pdfFiles.length > 0 && (
            <Button
              variant="outline"
              className="border border-green-500 hover:bg-green-600 hover:text-white font-semibold"
              type="button"
              onClick={() => fileInput.current?.click()}
            >
              Add More Files
            </Button>
          )}
        </div>}
             {/* Render loading spinner */}
             {loading && (
          <div className="mt-4 flex flex-col items-center justify-center">
            <Spinner />
            <p className="mt-2">Loading...</p>
          </div>
        )}

        {/* Render Stop button */}
        {loading && (
          <div className="mt-4">
            <Button
              className="bg-red-500 hover:bg-red-700 font-semibold"
              type="button"
              onClick={stopJob}
            >
              Stop
            </Button>
          </div>
        )}

        {/* Render success message box */}
        {successMessageVisible && (
          <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
            <p className="text-green-800">The output file is sent to your email. Kindly check your mailbox.</p>
            <button className="mt-2 text-red-600" onClick={() => setSuccessMessageVisible(false)}>Close</button>
          </div>
        )}

        {/* Render log messages */}
        <div className="mt-4 w-full max-w-xl p-4 rounded">
          <ul>
            {logs.map((log, index) => (
              <li key={index} className="text-sm text-gray-700">
                {log}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <SideChat/>
    </div>
  );
}

export default ExtractFiles;
