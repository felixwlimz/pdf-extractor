import { useState, ChangeEvent } from "react";
import { UiPathRobot } from "@uipath/robot";
import { RobotProcess, Job, JobPromise } from "@uipath/robot/dist/models";

const useRobot = () => {
  const robot = UiPathRobot.init();
  const [folderLink, setFolderLink] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessageVisible, setSuccessMessageVisible] = useState<boolean>(false);
  const [robotProcess, setRobotProcess] = useState<RobotProcess | null>(null);
  const [maxWords, setMaxWords] = useState<number>(500);
  
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
    combine?: boolean, 
    maxWords?: number): void => {
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

        jobPromise.onStatus((status) => addLog(`Status: ${status}`));
        jobPromise.onWorkflowEvent((event) => addLog(`Workflow Event: ${event}`));

        jobPromise
          .then(() => {
            addLog("Job completed successfully");
            setLoading(false);
            setSuccessMessageVisible(true);
          })
          .catch((error) => {
            addLog(`Job failed: ${error}`);
            setLoading(false);
          });
      },
      (err) => {
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