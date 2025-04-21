import { useEffect, useRef } from "react";
import { type FaqItem } from "@shared/schema";
import QuestionList from "./QuestionList";

interface ChatBodyProps {
  faqItems: FaqItem[];
  selectedQuestionId: string | null;
  onQuestionClick: (questionId: string) => void;
}

export default function ChatBody({ faqItems, selectedQuestionId, onQuestionClick }: ChatBodyProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to the selected question when it changes
  useEffect(() => {
    if (selectedQuestionId && chatContainerRef.current) {
      const selectedElement = document.querySelector(`[data-question-id="${selectedQuestionId}"]`);
      if (selectedElement) {
        setTimeout(() => {
          selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }
  }, [selectedQuestionId]);

  return (
    <div className="p-4 flex-grow flex flex-col overflow-auto" ref={chatContainerRef}>
      {/* Initial message */}
      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%] mb-4 self-start">
        <p>Hello! I'm here to help with comprehensive information about ATME College of Engineering. You can explore questions about admissions, departments, campus life, placements, facilities, academic support, innovation, and much more. Please select a question from the list below:</p>
      </div>
      
      {/* Question list */}
      <div className="mt-2 space-y-3">
        <QuestionList 
          faqItems={faqItems} 
          selectedQuestionId={selectedQuestionId} 
          onQuestionClick={onQuestionClick} 
        />
      </div>
    </div>
  );
}
