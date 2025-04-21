import { GraduationCap } from 'lucide-react';

export default function ChatHeader() {
  return (
    <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
        <GraduationCap className="text-xl" />
      </div>
      <div>
        <h2 className="font-medium">ATME Admissions Assistant</h2>
        <span className="text-xs opacity-80">Online</span>
      </div>
    </div>
  );
}
