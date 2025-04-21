import { useQuery } from "@tanstack/react-query";
import { type FaqItem } from "@shared/schema";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const { data: faqItems, isLoading, error } = useQuery<FaqItem[]>({
    queryKey: ["/api/faq"],
  });

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 min-h-screen flex flex-col">
      <header className="mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">ATME College of Engineering FAQ</h1>
        <p className="text-gray-600">Admissions • Departments • Campus Life • Placements • Facilities • Support</p>
      </header>

      <ChatInterface faqItems={faqItems || []} isLoading={isLoading} error={error} />
    </div>
  );
}
