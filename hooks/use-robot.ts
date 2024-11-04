import { useState, ChangeEvent } from "react";
import { UiPathRobot } from "@uipath/robot";
import { RobotProcess, Job, JobPromise, JobStatus } from "@uipath/robot/dist/models";
import { useToast } from "@/hooks/use-toast";
import path from 'path';

const useRobot = () => {
  const { toast } = useToast();
  const robot = UiPathRobot.init();
  const [folderLink, setFolderLink] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessageVisible, setSuccessMessageVisible] = useState<boolean>(false);
  const [robotProcess, setRobotProcess] = useState<RobotProcess | null>(null);
  const [maxWords, setMaxWords] = useState<number>(500);
  async function addPost(filepath: String, time:String, no_files: number, drive_upload: Boolean, way_extract: String, success: Boolean) {
    const postData = {
      filepath: filepath,
      time: time,
      no_files: no_files,
      drive_upload: drive_upload,
      way_extract: way_extract,
      success: success
    };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      if (!response.ok) {
        const { errMsg } = await response.json();
        console.error('Error:', errMsg);
      } else {
        const { data } = await response.json();
        console.log('Data inserted successfully:', data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  const handleZipRequest = async (uploadsDir: string) => {
    try {
      const zipResponse = await fetch('/api/zip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uploadsDir }),
      });
  
      if (!zipResponse.ok) {
        const errorData = await zipResponse.json();
        throw new Error(errorData.error || 'Zipping failed');
      }
  
      const zipData = await zipResponse.json();
      toast({ title: 'Folder zipped successfully'});
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      console.log({ title: 'Error', description: errorMessage, variant: 'destructive' })
    }
  };

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFolderLink(e.target.value);
  };

  const addLog = (message: string) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const stopJob = () => {
    if (robotProcess) {
      robot.stopProcess(robotProcess);
      addLog("Job has been stopped.");
    }
    setLoading(false);
  };

  const automate_summary = (    processName: string, 
    link: string, 
    upload: boolean,
    extract_time: String,
    no_files?: number,
    combine?: boolean, 
    maxWords?: number,
    ): void => {
    clearLogs();
    setLoading(true);
    setSuccessMessageVisible(false);
    robot.getProcesses().then(
      (processes) => {
        if (processes.length === 0) {
          alert("Robot not connected to Orchestrator or no processes are available");
          setLoading(false);
          return;
        }

        const process = processes.find((p) => p.name.includes(processName));
        if (!process) {
          alert(`No process found with name containing: ${processName}`);
          setLoading(false);
          return;
        }

        const newRobotProcess = new RobotProcess(process.id, processName);
        setRobotProcess(newRobotProcess);

        const args = { 
            drive_link_in: link, 
            ...(combine !== undefined && { combine }), 
            ...(maxWords !== undefined && { maxWords })
        };
        const job = new Job(process.id, args);
        const jobPromise = new JobPromise(job);

        jobPromise.onWorkflowEvent((event) => {
          try{
            const payloadString = JSON.stringify(event.payload, null, 2);
            const extractedString = payloadString.slice(3, -3); 
            addLog(`Status: ${extractedString}`);
          }
          catch (error) {
            // Handle any errors gracefully
            console.error('Error processing workflow event:', error);
          }

      });
        
        jobPromise
          .then(async(processResults) => {
            addLog("Job completed successfully");
            let summaryType = '';
            if (upload && no_files) {
              // Ensure handleZipRequest is awaited if it’s async
              await handleZipRequest(link);
              const filePath = link + "/" + path.basename(link) + ".zip";
          
              // Use a switch for readability
              if (combine === true) {
                summaryType = "Summarize Together";
              } else if (combine === false) {
                summaryType = "Summarize Individually";
              } else {
                summaryType = "Extract with Template";
              }
          
              // Ensure addPost is awaited if it’s async
              await addPost(filePath, extract_time, no_files, upload, summaryType, true);
            }    
            else {
              // Call the function to zip the uploads directory here
              if (combine === true) {
                summaryType = "Summarize Together";
                link = processResults.summary_file;
              } else if (combine === false) {
                summaryType = "Summarize Individually";
                link = processResults.summary_file;
              } else {
                summaryType = "Extract with Template";
              }
              await addPost(link, extract_time, processResults.no_files , upload, summaryType, true)
            }     
            setLoading(false);
            setSuccessMessageVisible(true);
          })
          .catch(async(error) => {
            let summaryType = '';

            if (upload && no_files) {
              // Ensure handleZipRequest is awaited if it’s async
              await handleZipRequest(link);
              const filePath = link + "/" + path.basename(link) + ".zip";
          
              // Use a switch for readability
              if (combine === true) {
                summaryType = "Summarize Together";
              } else if (combine === false) {
                summaryType = "Summarize Individually";
              } else {
                summaryType = "Extract with Template";
              }
          
              // Ensure addPost is awaited if it’s async
              await addPost(filePath, extract_time, no_files, upload, summaryType, false);
            }    
            else {
              // Call the function to zip the uploads directory here
              if (combine === true) {
                summaryType = "Summarize Together";
              } else if (combine === false) {
                summaryType = "Summarize Individually";
              } else {
                summaryType = "Extract with Template";
              }
              await addPost(link, extract_time, -1 , upload, summaryType, true)
            }
            addLog(`Job failed: ${error}`);
            setLoading(false);
          });
      },
      async(err) => {
        alert("Error! " + err);
        setLoading(false);   
      }
    );
  };

  return {
    folderLink,
    setFolderLink,
    logs,
    loading,
    successMessageVisible,
    robotProcess,
    maxWords,
    handleLinkChange,
    addLog,
    clearLogs,
    stopJob,
    automate_summary,
    setLoading,
    setSuccessMessageVisible,
    setMaxWords
  };
};

export default useRobot;