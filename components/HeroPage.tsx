 "use client";
import { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UiPathRobot } from "@uipath/robot";
import { Job, RobotProcess, JobPromise} from "@uipath/robot/dist/models";


const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
);

const HeroPage = () => {
  const robot = UiPathRobot.init();
  const [folderLink, setFolderLink] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessageVisible, setSuccessMessageVisible] = useState<boolean>(false);
  const [robotProcess, setRobotProcess] = useState<RobotProcess | null>(null); // State for storing robot process

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
      robot.stopProcess(robotProcess); // Stop the robot process
      addLog("Job has been stopped.");
    }
    setLoading(false);
  };

  const automate_summary = (processName: string, link: string, combine?: boolean): void => {
    clearLogs();
    setLoading(true);
    setSuccessMessageVisible(false);
    robot.getProcesses().then(
      (processes: Array<{ id: string; name: string }>) => {
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

        const newRobotProcess = new RobotProcess(process.id, processName); // Create the RobotProcess
        setRobotProcess(newRobotProcess); // Store the robotProcess in state

        interface Arguments {
          drive_link_in: string;
          combine?: boolean;
        }

        const args: Arguments = {
          drive_link_in: link,
          ...(combine !== undefined && { combine })
        };

        const job = new Job(process.id, args);
        const jobPromise = new JobPromise(job);

        jobPromise.onStatus((status) => {
          addLog(`Status: ${status}`);
        });

        jobPromise.onWorkflowEvent((event) => {
          addLog(`Workflow Event: ${event}`);
        });

        jobPromise
          .then((result) => {
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

  return (
    <section className="flex flex-col items-center justify-center gap-8">
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
            onClick={() => automate_summary("Drive_Summarize", folderLink, false)}
          >
            Extract individually
          </Button>
          <Button
            className="bg-green-400 hover:bg-green-600 font-semibold"
            type="button"
            onClick={() => automate_summary("Drive_Summarize", folderLink, true)}
          >
            Extract Combined PDFs
          </Button>
          <Button
            className="bg-green-400 hover:bg-green-600 font-semibold"
            type="button"
            onClick={() => {
              clearLogs();
              automate_summary("Drive_Template", folderLink);
            }}
          >
            Extract with Template
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