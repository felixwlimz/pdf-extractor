"use client";
import { useState, useEffect } from "react";



const HistoryPage = () => {
  const [fileHistory, setFileHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loading_data = async () => {
    try {
      const response = await fetch("/api/posts");
      const { data, errMsg } = await response.json();

      if (errMsg) {
        console.error("Error:", errMsg);
        setErrorMsg(errMsg);
      } else {
        console.log("Data:", data);
        setFileHistory(data); // Set the data from MongoDB to fileHistory
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMsg("Failed to fetch file history.");
    }
  };

  // Call loading_data on component mount
  useEffect(() => {
    loading_data();
  }, []);

  return (
    <div className="p-8 ml-64">
      <h1 className="text-3xl font-bold text-green-700 mb-6">File History</h1>
      <p className="text-md text-gray-600 mb-4">
        Here’s a list of your previously extracted or downloaded files.
      </p>

      {errorMsg ? (
        <p className="text-red-500">{errorMsg}</p>
      ) : fileHistory.length > 0 ? (
        <div className="overflow-x-auto w-full md:overflow-hidden"> {/* Prevent x-axis scrolling on larger screens */}
          <table className="min-w-full bg-white rounded-lg shadow-md max-w-full"> {/* Set max-w-full on table */}
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">Extraction Time</th>
                <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">Source</th>
                <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">Extraction</th>
                <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">Number of Files</th>
                <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">Status</th>
                <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">Link</th>
              </tr>
            </thead>
            <tbody>
              {fileHistory.map((file: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-center text-sm">{file.time}</td>
                  <td className="py-3 px-4 text-center text-sm">{file.drive_upload ? "Files Upload" : "Google Drive"}</td>
                  <td className="py-3 px-4 text-sm text-center">{file.way_extract || "N/A"}</td>
                  <td className="py-3 px-4 text-sm text-center">{file.no_files || 0}</td>
                  <td className="py-3 px-4 text-sm text-center">{file.success ? "Success" : "Failed" }</td>
                  <td className="py-3 px-4 text-sm text-center">
                    {file.success ? (
                      <a
                        href={file.filepath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`py-2 px-4 rounded ${
                          file.filepath.endsWith(".zip") ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                        } hover:opacity-90`}
                      >
                        {file.filepath.endsWith(".zip") ? "Download ZIP" : "View in Drive"}
                      </a>
                      ) : (
                      <div className="py-2 px-4 rounded bg-red-500 text-white inline-block">
                          Failed
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 mt-4">No file history available.</p>
      )}
    </div>
  );
};

export default HistoryPage;