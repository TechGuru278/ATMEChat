import { users, type User, type InsertUser, type FaqItem, type InsertFaqItem } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // FAQ related methods
  getAllFaqItems(): Promise<FaqItem[]>;
  getFaqItem(id: number): Promise<FaqItem | undefined>;
  getFaqItemByQuestionId(questionId: string): Promise<FaqItem | undefined>;
  createFaqItem(faqItem: InsertFaqItem): Promise<FaqItem>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private faqItems: Map<number, FaqItem>;
  currentUserId: number;
  currentFaqItemId: number;

  constructor() {
    this.users = new Map();
    this.faqItems = new Map();
    this.currentUserId = 1;
    this.currentFaqItemId = 1;
    
    // Initialize with predefined FAQ items
    this.initializeFaqItems();
  }

  private initializeFaqItems() {
    const predefinedFaqItems: InsertFaqItem[] = [
      {
        questionId: 'q1',
        question: 'What are the eligibility criteria for B.E. programs?',
        answer: 'To be eligible for B.E. programs at ATME College of Engineering, candidates must:\n\n• Have passed 2nd PUC / 12th Std / Equivalent Exam with English as one of the languages.\n\n• Have obtained a minimum of 45% marks in aggregate in Physics and Mathematics along with Chemistry / Bio-Technology / Biology / Electronics / Computer. (40% for SC, ST, Cat-1, 2A, 2B, 3A, and 3B category candidates).\n\n• Have a qualifying rank in either CET or COMEDK entrance test.'
      },
      {
        questionId: 'q2',
        question: 'How are seats distributed for B.E. admissions?',
        answer: 'The seat distribution for B.E. programs is as follows:\n\n• 45% through centralized admission process controlled by the KEA.\n\n• 30% through COMED-K, a government-approved unit of private engineering colleges.\n\n• 25% at the institute level, as per the guidelines given by the DTE, Karnataka.'
      },
      {
        questionId: 'q3',
        question: 'What is the application process for B.E. admissions?',
        answer: 'Candidates seeking admission in B.E. must:\n\n• Visit the official website of the college.\n\n• Click on the Admissions tab and then on the Application tab.\n\n• Download the application form from the link given on the page.\n\n• Fill the form in their own handwriting.\n\n• Pay the application fees through a Demand Draft of INR 500 in favour of "Academy for Technical & Management Excellence, Mysore" payable at Mysore.\n\n• Attach the application fee along with the application form and send it to the college\'s address.'
      },
      {
        questionId: 'q4',
        question: 'What documents are required at the time of admission?',
        answer: 'The following documents are required:\n\n• SSLC Marks Card.\n• PUC Marks Card.\n• Transfer Certificate.\n• Migration Certificate (for CBSE, ICSE Students).\n• Study Certificate (from all institutions studied from 1st to 12th).\n• Character/Conduct Certificate (from all institutions).\n• ID Proof & Address Proof (Aadhaar, Passport).\n• CET Rank Sheet (Mandatory)/ COMEDK Rank Sheet/ JEE Rank Sheet.\n• CET Admission Ticket (Mandatory)/ COMEDK Admission Ticket/ JEE Admission Ticket.\n• 5 passport size photographs.\n• 3 stamp size photographs.\n• Self-Addressed Postal Envelopes-3.\n\nNote: 5 sets of photocopies of the above-mentioned documents, attested by a Gazetted Officer or Notary, should be kept ready, and 3 sets should be submitted during the time of admission along with the original documents.'
      },
      {
        questionId: 'q5',
        question: 'Are there any scholarships available?',
        answer: 'Yes, ATME offers scholarships under the Vidyaasare Scheme:\n\n• For CET Ranking 1 to 5000: Free tuition, college, and transportation fees for all 4 years.\n\n• For CET Ranking 5001 to 10000 or >95% in PCM: 50% concession in tuition, college, and transportation fees for all 4 years.\n\n• For CET Ranking 10001 to 20000 or 90% to 95% in PCM: 25% concession in tuition, college, and transportation fees for all 4 years.\n\n• For CET Ranking 20001 to 25000: 25% concession in tuition, college, and transportation fees for the first 2 years.\n\n• For CET Ranking 25001 to 35000: 25% concession in tuition, college, and transportation fees for the first year only.\n\nNote: Tuition fee concession is extended only for direct admission under the management quota.'
      },
      {
        questionId: 'q6',
        question: 'What are the eligibility criteria for MBA and MCA programs?',
        answer: 'MBA: Candidates must have passed graduation from a recognized university.\n\nMCA: Candidates must have a bachelor\'s degree in a relevant discipline with a minimum of 50% marks (45% for SC/ST/OBC).'
      },
      {
        questionId: 'q7',
        question: 'How can I contact the admissions office?',
        answer: 'You can reach out to the admissions office at:\n\nPhone: +91-94482-85644 / +91-94482-85641 / +91-94482-85651\n\nEmail: admissions@atme.edu.in\n\nAddress: ATME College of Engineering, 13th Kilometer, Mysore – Kanakapura – Bangalore Road, Mysore – 570 028, Karnataka.'
      },
      {
        questionId: 'q8',
        question: 'What are the different departments available at ATME College of Engineering?',
        answer: 'ATME offers the following academic departments:\n\nUndergraduate (B.E):\n• Computer Science & Engineering (CSE)\n• Electronics & Communication Engineering (ECE)\n• Electrical & Electronics Engineering (EEE)\n• Mechanical Engineering (ME)\n• Civil Engineering (CE)\n• Artificial Intelligence & Machine Learning (AI & ML)\n\nPostgraduate Programs:\n• MBA – Master of Business Administration\n• MCA – Master of Computer Applications\n\nBasic Sciences & Humanities:\n• Physics\n• Chemistry\n• Mathematics\n• English'
      },
      {
        questionId: 'q9',
        question: 'How are the college reviews and student experiences at ATME?',
        answer: '🔹 Overall Review:\nATME College is appreciated for its serene campus, qualified faculty, and strong placement support.\n\n🔹 Infrastructure:\nModern classrooms, fully equipped labs, Wi-Fi, libraries, sports facilities, and a spacious canteen.\n\n🔹 Faculty:\nProfessors are described as knowledgeable and supportive. The CSE and ECE departments often receive high praise.\n\n🔹 Placements:\nTop recruiters include Infosys, TCS, Wipro, Bosch, HCL, etc. Regular training and mock interviews are conducted.\n\n🔹 Clubs & Events:\nThe college conducts many technical fests, cultural programs, and entrepreneurship events that students find engaging.'
      },
      {
        questionId: 'q10',
        question: 'What extracurricular and club activities are available?',
        answer: 'ATME encourages all-round development through various clubs:\n\n• Tech Club – Workshops & hackathons\n• Cultural Club – Dance, music, and drama\n• NSS & NCC – Social service and leadership\n• Entrepreneurship Cell – Start-up & innovation support\n• Sports Club – Cricket, football, volleyball, chess, and more'
      },
      {
        questionId: 'q11',
        question: 'Is the campus environment student-friendly and safe?',
        answer: 'Yes, ATME maintains a safe and disciplined environment:\n\n• Separate hostels for boys and girls with wardens\n• Anti-ragging cell\n• CCTV surveillance\n• 24/7 security\n• Medical facility available on campus'
      },
      {
        questionId: 'q12',
        question: 'How is the hostel facility at ATME?',
        answer: '• Spacious and clean rooms\n• Veg and non-veg food options\n• Wi-Fi enabled\n• Study rooms, indoor games, and recreation areas\n• Laundry and medical care available'
      },
      {
        questionId: 'q13',
        question: 'How are the industry connections and internship opportunities?',
        answer: '• MoUs with various companies for training & internships\n• Industrial visits are arranged regularly\n• Internships encouraged during semester breaks\n• Companies like Infosys, Bosch, and Tata ELXSI offer internships'
      },
      {
        questionId: 'q14',
        question: 'How are the placement opportunities at ATME College of Engineering?',
        answer: '🔹 ATME has a dedicated Training & Placement Cell that actively connects students with top companies.\n🔹 Students receive training in aptitude, technical skills, resume building, and interview preparation.\n\nTop Recruiters Include:\n• Infosys\n• Wipro\n• TCS\n• Bosch\n• Capgemini\n• Accenture\n• Mindtree\n• DXC Technology\n\nPlacement Support Highlights:\n• Soft skills and personality development sessions\n• Mock interviews & GD practice\n• Coding bootcamps for CSE & ECE students'
      },
      {
        questionId: 'q15',
        question: 'Who is the Principal of ATME College of Engineering?',
        answer: 'Sri L. Basavaraj is the Principal of ATME College of Engineering.\n\n• A visionary leader in education and philanthropy.\n• Strongly believes in empowering youth through technical education.\n• Established ATME to provide world-class education in Mysuru.'
      },
      {
        questionId: 'q17',
        question: 'What is the vision and mission of ATME College of Engineering?',
        answer: '🧭 Vision:\n"To become a premier institution recognized for excellence in technical education and research."\n\n🎯 Mission:\n• To provide student-centric education.\n• To foster innovation and entrepreneurship.\n• To develop industry-ready professionals with ethics and leadership qualities.'
      },
      {
        questionId: 'q18',
        question: 'What recognitions or affiliations does ATME have?',
        answer: '• Affiliated to Visvesvaraya Technological University (VTU), Belagavi\n• Approved by AICTE, New Delhi\n• Recognized by Government of Karnataka\n• NBA Accreditation (for some departments)'
      },
      {
        questionId: 'q19',
        question: 'Is research encouraged at ATME College of Engineering?',
        answer: 'Yes! ATME has:\n\n• Research centers in Mechanical and Electronics & Communication Engineering\n• Faculty actively involved in publishing research papers\n• Students encouraged to work on real-world projects and Smart India Hackathon challenges\n• Innovation & Entrepreneurship Development Cell (IEDC) and Incubation support'
      },
      {
        questionId: 'q20',
        question: 'Does ATME have any international tie-ups or collaborations?',
        answer: 'ATME is developing collaborations with:\n\n• Foreign universities for faculty exchange and student internships\n• MNCs and startups for real-world training\n• Infosys Campus Connect, Wipro Mission10X, and other skill development programs'
      },
      {
        questionId: 'q22',
        question: 'Is transport facility available for students?',
        answer: 'Yes, ATME offers college bus facilities from various parts of Mysuru and nearby regions.\n\n• Buses are equipped for comfort and safety.\n• Fixed routes with punctual service.\n• Affordable fees.'
      },
      {
        questionId: 'q23',
        question: 'What is the minimum attendance required for students?',
        answer: 'A minimum of 85% attendance is required in each subject to be eligible for the university exam.\n\nAttendance is tracked regularly and SMS alerts are sent to parents in case of shortages.'
      },
      {
        questionId: 'q24',
        question: 'Is there Wi-Fi available for students in the campus and hostel?',
        answer: 'Yes! The entire ATME campus is Wi-Fi enabled.\n\n• High-speed internet available in classrooms, labs, and hostels.\n• Helps students access e-learning content and research materials.'
      },
      {
        questionId: 'q25',
        question: 'What sports facilities does ATME offer?',
        answer: 'ATME promotes physical fitness and sportsmanship:\n\nOutdoor: Cricket, Football, Basketball, Volleyball, Throwball\n\nIndoor: Table Tennis, Chess, Carrom, Gym\n\nAnnual sports day and inter-college competitions are held.'
      },
      {
        questionId: 'q26',
        question: 'Are there any value-added or certificate courses offered?',
        answer: 'Yes! ATME conducts several value-added certification programs in:\n\n• Python, Java, C++\n• IoT and AI/ML\n• Soft Skills and Aptitude Training\n• Communication Skills and Resume Building\n\nThese improve student profiles and employability.'
      },
      {
        questionId: 'q27',
        question: 'Does the college provide academic or counseling support?',
        answer: 'Absolutely!\n\n• Academic Mentors guide students for studies and personal growth.\n• Counseling Cell helps manage stress, anxiety, and emotional wellbeing.\n• Remedial classes are arranged for academically weak students.'
      },
      {
        questionId: 'q28',
        question: 'What student grievance or feedback system is in place?',
        answer: 'ATME has a Grievance Redressal Cell and Online Feedback System.\n\n• Students can report academic or personal issues anonymously.\n• Regular feedback is taken from students to improve quality.'
      },
      {
        questionId: 'q29',
        question: 'Does ATME have a dedicated Innovation/Startup support cell?',
        answer: 'Yes, ATME has:\n\n• IEDC (Innovation & Entrepreneurship Development Cell)\n• Supports student startups and innovative ideas\n• Provides mentorship, workspace, and funding guidance'
      }
    ];

    predefinedFaqItems.forEach(item => {
      this.createFaqItem(item);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllFaqItems(): Promise<FaqItem[]> {
    return Array.from(this.faqItems.values());
  }
  
  async getFaqItem(id: number): Promise<FaqItem | undefined> {
    return this.faqItems.get(id);
  }
  
  async getFaqItemByQuestionId(questionId: string): Promise<FaqItem | undefined> {
    return Array.from(this.faqItems.values()).find(
      (item) => item.questionId === questionId,
    );
  }
  
  async createFaqItem(insertFaqItem: InsertFaqItem): Promise<FaqItem> {
    const id = this.currentFaqItemId++;
    const faqItem: FaqItem = { ...insertFaqItem, id };
    this.faqItems.set(id, faqItem);
    return faqItem;
  }
}

export const storage = new MemStorage();
