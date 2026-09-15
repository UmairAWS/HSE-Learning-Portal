import { ChatMessage } from "../types";

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg_1",
    sender: "Dr. Phelpstead (Lead Tutor)",
    role: "tutor",
    avatar: "👨‍🏫",
    content: "Welcome to the HSE Revision Cohort! Remember: the open-book assessment is 100% scenario-based. Never quote textbook theory without anchoring it to the scenario using P.E.E. (Point, Evidence, Explanation). What topics are you working on today?",
    timestamp: "10:15 AM",
    likes: 12,
    tag: "Exam Technique"
  },
  {
    id: "msg_2",
    sender: "Sarah Jenkins (Student)",
    role: "student",
    avatar: "👩‍💼",
    content: "Hi everyone! Quick question on Element 1: In the Uninsured Loss Iceberg, does the 10:1 ratio include criminal court fines?",
    timestamp: "10:22 AM",
    likes: 4,
    tag: "Element 1"
  },
  {
    id: "msg_3",
    sender: "Dr. Phelpstead (Lead Tutor)",
    role: "tutor",
    avatar: "👨‍🏫",
    content: "Yes, Sarah! Criminal fines are strictly UNINSURABLE by law (it would defeat the deterrent purpose). They fall squarely into the unseen, underwater portion of the iceberg, alongside lost production, sick pay, and investigation hours.",
    timestamp: "10:25 AM",
    likes: 9,
    tag: "Element 1"
  },
  {
    id: "msg_4",
    sender: "Tariq Al-Mansoor",
    role: "student",
    avatar: "👨‍💻",
    content: "I always get mixed up on active vs. reactive monitoring in Element 4. If a near-miss report is submitted before anyone gets hurt, why is it considered reactive?",
    timestamp: "10:31 AM",
    likes: 3,
    tag: "Element 4"
  },
  {
    id: "msg_5",
    sender: "Elena Rostova",
    role: "student",
    avatar: "👩‍🔬",
    content: "Because an unwanted event ALREADY occurred! The dropped brick or the forklift near-collision already happened, even if luck prevented harm. Active monitoring is doing a checklist or inspection BEFORE any event occurs.",
    timestamp: "10:34 AM",
    likes: 14,
    tag: "Element 4"
  }
];
