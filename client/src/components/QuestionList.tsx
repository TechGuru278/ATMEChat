import { useState, useEffect } from "react";
import { type FaqItem } from "@shared/schema";
import { ChevronDown, GraduationCap, Building, Users, Award, BookOpen, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionListProps {
  faqItems: FaqItem[];
  selectedQuestionId: string | null;
  onQuestionClick: (questionId: string) => void;
}

// Define categories and their icons
const categories = [
  { 
    id: 'admissions', 
    name: 'Admissions & Eligibility', 
    icon: GraduationCap,
    questionIds: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7']
  },
  { 
    id: 'departments', 
    name: 'Departments & Academics', 
    icon: BookOpen,
    questionIds: ['q8', 'q19', 'q23', 'q26', 'q27']
  },
  { 
    id: 'campus', 
    name: 'Campus Life & Facilities', 
    icon: Building,
    questionIds: ['q11', 'q12', 'q22', 'q24', 'q25', 'q28']
  },
  { 
    id: 'student', 
    name: 'Student Experience', 
    icon: Users,
    questionIds: ['q9', 'q10', 'q13']
  },
  { 
    id: 'placements', 
    name: 'Placements & Career', 
    icon: Briefcase,
    questionIds: ['q14', 'q20']
  },
  { 
    id: 'about', 
    name: 'About ATME', 
    icon: Award,
    questionIds: ['q15', 'q17', 'q18', 'q29']
  }
];

export default function QuestionList({ 
  faqItems, 
  selectedQuestionId, 
  onQuestionClick 
}: QuestionListProps) {
  const [activeItems, setActiveItems] = useState<Record<string, boolean>>({});
  const [animatingItems, setAnimatingItems] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    admissions: true,  // Start with admissions expanded
    departments: false,
    campus: false,
    student: false,
    placements: false,
    about: false
  });

  // Set active state based on selectedQuestionId
  useEffect(() => {
    if (selectedQuestionId) {
      setActiveItems(prev => ({
        ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
        [selectedQuestionId]: true
      }));
      
      // Add bounce animation
      setAnimatingItems(prev => ({ ...prev, [selectedQuestionId]: true }));
      
      // Remove bounce animation after it completes
      setTimeout(() => {
        setAnimatingItems(prev => ({ ...prev, [selectedQuestionId]: false }));
      }, 500);

      // Expand the category containing the selected question
      const categoryWithQuestion = categories.find(
        category => category.questionIds.includes(selectedQuestionId)
      );
      
      if (categoryWithQuestion) {
        setExpandedCategories(prev => ({
          ...prev,
          [categoryWithQuestion.id]: true
        }));
      }
    } else {
      setActiveItems({});
    }
  }, [selectedQuestionId]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Get questions for a specific category
  const getCategoryQuestions = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];
    
    return faqItems.filter(item => 
      category.questionIds.includes(item.questionId)
    );
  };

  return (
    <div className="space-y-6">
      {categories.map(category => (
        <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div 
            className="bg-gray-50 p-3 flex items-center justify-between cursor-pointer hover:bg-gray-100"
            onClick={() => toggleCategory(category.id)}
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-primary-100 rounded-full flex items-center justify-center">
                {category.icon && <category.icon className="w-4 h-4 text-primary" />}
              </span>
              <h3 className="font-medium text-gray-800">{category.name}</h3>
            </div>
            <ChevronDown
              className={cn(
                "text-gray-500 transition-transform duration-300",
                expandedCategories[category.id] && "transform rotate-180"
              )}
            />
          </div>
          
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              expandedCategories[category.id] ? "max-h-[2000px]" : "max-h-0"
            )}
          >
            <div className="divide-y divide-gray-100">
              {getCategoryQuestions(category.id).map((item) => (
                <div
                  key={item.questionId}
                  data-question-id={item.questionId}
                  className={cn(
                    "question-item p-3 cursor-pointer transition-all",
                    activeItems[item.questionId]
                      ? "bg-primary-200"
                      : "hover:bg-primary-50"
                  )}
                  onClick={() => onQuestionClick(item.questionId)}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">{item.question}</p>
                    <ChevronDown
                      className={cn(
                        "text-primary transition-transform duration-300",
                        activeItems[item.questionId] && "transform rotate-180"
                      )}
                    />
                  </div>
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      activeItems[item.questionId]
                        ? "max-h-[800px] opacity-100 pt-3 pb-2"
                        : "max-h-0 opacity-0 pt-0 pb-0"
                    )}
                  >
                    <p className="text-gray-700 whitespace-pre-line">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
