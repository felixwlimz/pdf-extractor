import { FileUp } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

const HeroPage = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-[36px] font-bold">Extract your PDF files</h2>
      <p className="font-md text-lg">
        Drag and drop of a whole set for easy extraction
      </p>
      <div className="border border-dashed border-orange-500 w-[640px] lg:min-w-[1140px] rounded-lg h-[275px] lg:min-h-[380px] p-3">
        <div className="relative flex flex-col gap-3 items-center h-full justify-center">
          <FileUp size={60} className="text-orange-600 font-semibold" />
          <p className="font-bold text-gray-400">
            Drag and drop PDF files to upload
          </p>
        </div>
      </div>
      <Button
        className="bg-orange-500 hover:bg-orange-600 font-semibold"
        type="button"
      >
        Extract
      </Button>
    </section>
  );
};

export default HeroPage;
