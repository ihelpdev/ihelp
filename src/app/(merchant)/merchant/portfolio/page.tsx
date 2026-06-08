"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";

export default function MerchantPortfolio() {
  const [baseRate, setBaseRate] = useState("80");
  const [skills, setSkills] = useState(["Pipe Repair", "Water Heaters", "Drain Cleaning"]);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto space-y-8">
      <h1 className="text-headline-md font-bold mb-6">Portfolio & Settings</h1>

      {/* Rate Config */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-lg">
        <h2 className="text-headline-sm font-bold mb-4">Pricing Configuration</h2>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Input 
              label="Standard Hourly Rate ($)" 
              type="number"
              value={baseRate}
              onChange={(e) => setBaseRate(e.target.value)}
            />
          </div>
          <Button variant="secondary" className="h-11">Update Rate</Button>
        </div>
      </div>

      {/* Skills Management */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-lg">
        <h2 className="text-headline-sm font-bold mb-4">Expertise & Skills</h2>
        <div className="flex gap-2 flex-wrap mb-6">
          {skills.map(skill => (
            <div key={skill} className="bg-surface-container-low px-3 py-1.5 rounded-full flex items-center gap-2 text-sm border border-outline-variant/20">
              {skill}
              <button onClick={() => removeSkill(skill)} className="text-outline hover:text-[#ba1a1a]">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Input 
            placeholder="Add a new skill..." 
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
          />
          <Button onClick={handleAddSkill}><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-headline-sm font-bold">Work Gallery</h2>
          <span className="text-xs text-on-surface-variant">3 of 10 slots used</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Mock Existing Images */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-surface-container-high rounded-lg flex items-center justify-center relative group overflow-hidden">
              <ImageIcon className="w-8 h-8 text-outline-variant/50" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="text-white hover:text-[#ffb4ab]">
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Add New Placeholder */}
          <button className="aspect-square border-2 border-dashed border-outline-variant/50 rounded-lg flex flex-col items-center justify-center text-outline hover:bg-surface-container-low transition-colors">
            <Plus className="w-8 h-8 mb-2" />
            <span className="text-xs font-semibold uppercase tracking-wider">Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
}
