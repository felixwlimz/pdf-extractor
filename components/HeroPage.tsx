"use client";
import { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Spinner from "./Spinner";
import useRobot from "@/hooks/use-robot";
import { useToast } from "@/hooks/use-toast";

const HeroPage = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const { toast } = useToast();


  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedOption(event.target.value);
      // Reset min and max words when the option changes
  };
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

  const handleMaxWordsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMaxWords(parseInt(value));
  };

  const handleButtonClick = () => {
    console.log(maxWords)
    if (selectedOption === 'template') {
      console.log('Extracting with template');
      clearLogs();
      automate_summary("Drive_Template", folderLink);
    } else if (selectedOption === 'individual') {
      console.log('Summarizing individually');
      clearLogs();
      automate_summary("Drive_Summarize", folderLink, false, maxWords)
    } else if (selectedOption === 'combine') {
      console.log('Summarizing together');
      clearLogs();
      automate_summary("Drive_Summarize", folderLink, true, maxWords)
    }
    else{
      toast({ title: "Please select an option first", variant: "destructive" });
      return;
    }
  };

  
  return (
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
      <h2 className="text-[36px] font-bold text-green-600">
        Extract your PDF files
      </h2>
      <p className="font-md text-lg">
        Enter your Google Drive folder link for extraction
      </p>

      <Input
        type="text"
        placeholder="Enter Google Drive folder link"
        value={folderLink}
        onChange={handleLinkChange}
        className="w-[1140px] max-md:max-w-xl border border-green-300"
      />

      {/* Render buttons only when not loading */}
      {!loading && (
        <div className="flex gap-2">
          <Button
            className="bg-green-400 hover:bg-green-600 font-semibold"
            type="button"
            onClick={handleButtonClick}
          >
            Extract PDFs
          </Button>

        </div>
      )}

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
  );
};

export default HeroPage;