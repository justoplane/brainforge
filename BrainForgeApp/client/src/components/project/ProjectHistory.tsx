import React from "react";

export const ProjectHistory: React.FC = () => {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        {/* <h2 className="text-xl font-semibold">Project History</h2> */}
        
        {/* History content */}
        <div className="space-y-4 mt-4">
          <div className="border rounded-lg p-3 bg-card">
            <div className="text-sm font-medium">March 19, 2025</div>
            <div className="text-muted-foreground text-sm">Initial project setup</div>
          </div>
          <div className="border rounded-lg p-3 bg-card">
            <div className="text-sm font-medium">March 18, 2025</div>
            <div className="text-muted-foreground text-sm">Added task description</div>
          </div>
          <div className="border rounded-lg p-3 bg-card">
            <div className="text-sm font-medium">March 17, 2025</div>
            <div className="text-muted-foreground text-sm">Created project</div>
          </div>
          
          {/* You can add more history items or fetch from an API */}
        </div>
        
        <p className="text-muted-foreground text-sm mt-6">
          Past actions and changes in this project will appear here.
        </p>
      </div>
    </div>
  );
};

