"use client";
import { ChangeEvent, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { UiPathRobot } from "@uipath/robot";
import { Job } from "@uipath/robot/dist/models";

const HeroPage = () => {
  const [folderLink, setFolderLink] = useState<string>("");

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFolderLink(e.target.value);
  };

  const google_run = (processName: string, link: string): void => {
    const robot = UiPathRobot.init();
    robot.getProcesses().then(
      (processes: Array<{ id: string; name: string }>) => {
        if (processes.length === 0) {
          alert("Robot not connected to Orchestrator or no processes are available");
          return;
        }

        const process = processes.find((p) => p.name.includes(processName));

        if (!process) {
          alert(`No process found with name containing: ${processName}`);
          return;
        }
        // Assuming 'link' is a string variable containing the drive link
        const test = link; // link should already be a string

        // Define the Arguments interface
        interface Arguments {
          drive_link_in: string; // The drive link is expected to be a string
        }

        // Create the arguments object
        const args: Arguments = {
          drive_link_in: test, // Use the drive_link_in variable directly
        };

        // Assuming process.id is defined and valid
        const job = new Job(process.id, args);
        robot.startJob(job).then(
          (result) => {
            alert("The summary is sent to your email");
          },
          (err) => {
            alert("Job Failed! " + err);
          }
        );
      },
      (err) => {
        alert("Error! " + err);
      }
    );
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-[36px] font-bold">Extract your PDF files</h2>
      <p className="font-md text-lg">
        Enter your Google Drive folder link for extraction
      </p>
      
      <Input
        type="text"
        placeholder="Enter Google Drive folder link"
        value={folderLink}
        onChange={handleLinkChange}
        className="w-full max-w-md"
      />

      <div className="flex gap-2">
        <Button
          className="bg-orange-500 hover:bg-orange-600 font-semibold"
          type="button"
          onClick={() => google_run("Upload_Run", folderLink)}
        >
          Extract PDFs
        </Button>
      </div>
    </section>
  );
};

export default HeroPage;