import { useState } from "react";
import { type FaqItem } from "@shared/schema";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ChatInterfaceProps {
  faqItems: FaqItem[];
  isLoading: boolean;
  error: Error | null;
}

export default function ChatInterface({ faqItems, isLoading, error }: ChatInterfaceProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const handleQuestionClick = (questionId: string) => {
    setSelectedQuestionId(prevId => prevId === questionId ? null : questionId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-grow flex flex-col overflow-hidden">
      <ChatHeader />
      
      {isLoading ? (
        <div className="p-4 flex-grow">
          <Skeleton className="h-8 w-full max-w-[80%] mb-4" />
          <div className="space-y-3 mt-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      ) : error ? (
        <div className="p-4 flex-grow">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              There was an error loading the FAQ data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <ChatBody 
          faqItems={faqItems} 
          selectedQuestionId={selectedQuestionId} 
          onQuestionClick={handleQuestionClick} 
        />
      )}
      
      <div className="border-t border-gray-100 p-3 text-center text-xs text-gray-500">
        ATME College of Engineering © {new Date().getFullYear()} | FAQ Chatbot
      </div>
    </div>
  );
}
