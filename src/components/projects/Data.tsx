import Image from 'next/image';
import { Image as Img } from 'lucide-react';
import { ChevronRight, Link } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { url } from 'inspector';

// Enhanced project content array with all projects
const PROJECT_CONTENT = [
  {
    title: 'Doctor Assistant',
    description:
      `An AI-powered healthcare assistant designed for intelligent, multimodal interactions using state-of-the-art LLMs and vector search.\n\n- Built with LangChain Agent for dynamic, multi-turn conversations\n- Integrated Pinecone for semantic search over medical documents\n- Enabled PDF/image (e.g., X-rays) analysis via OCR and embedding\n- Combined OpenAI/GCP/Azure APIs to provide contextual answers\n- Used RAG to provide document-grounded medical assistance`,
    techStack: [
      'Python', 'LLM', 'OpenAI', 'Azure', 'GCP', 'OCR', 'RAG', 'Vector DB',
      'Pinecone', 'Langchain', 'vLLM', 'Ollama', 'PyPDF'
    ],
    date: '2024 - 2025',
    links: [
      { name: 'Website', url: 'https://doctornetwork.us/' },
      { name: 'Android App', url: 'https://play.google.com/store/apps/details?id=com.doctornetwork.doctorassitant&hl=en&pli=1' },
      { name: 'IOS App', url: 'https://apps.apple.com/vn/app/doctor-assistant/id6477260207?l=vi' },
    ],
    images: [
      { src: '/projects/doctor-assistant/diagrams.webp', alt: 'Chatbot diagram' },
      { src: '/projects/doctor-assistant/inapp.png', alt: 'In-app interface' },
      { src: '/projects/doctor-assistant/inapp-history.png', alt: 'Chat history' },
    ],
  },
  {
    title: 'Spaceone',
    description:
      `A multimodal big data platform that summarizes video content and analyzes social sentiment using LLMs and Kafka.\n\n- Extracted audio from video via Spleeter, transcribed to text\n- Summarized using OpenAI LLM with structured prompts\n- Fine-tuned PhoBERT for Vietnamese sentiment classification\n- Scaled processing with Kafka, deployed on GCP and AWS`,
    techStack: ['Python', 'Kafka', 'OpenAI', 'GCP', 'AWS', 'NodeJs', 'Transformer'],
    date: '2024',
    links: [
      { name: 'Homepage', url: 'https://spaceone.vn/' },
    ],
    images: [
      { src: '/projects/spaceone/comments.png', alt: 'Sentiment analysis result' },
      { src: '/projects/spaceone/summary.png', alt: 'Video summary' },
    ],
  },
  {
    title: 'Diabetes Prediction',
    description:
      `A regression-based ML pipeline to predict blood sugar levels from health questionnaire responses and basic diagnostics.\n\n- Cleaned/normalized tabular data (198+ mismatches, missing G2)\n- Applied log transformation on skewed target distribution\n- Balanced dataset using ADASYN oversampling\n- Trained multiple regressors; SVR yielded best R² (≈0.8)\n- Pipeline supports early-stage, non-invasive diabetes screening`,
    techStack: ['Python', 'Pandas', 'XGBoost', 'Scikit-learn'],
    date: '2024',
    links: [],
    images: [
      { src: '/projects/diabetes/data-skewness.png', alt: 'Data skewness' },
      { src: '/projects/diabetes/model-comparision.png', alt: 'Model comparison' },
      { src: '/projects/diabetes/result.png', alt: 'Prediction results' },
    ],
  },
  {
    title: 'Stock Price Forecasting',
    description:
      `Time series forecasting project using LSTM to predict stock closing prices based on historic market behavior.\n\n- Conducted EDA (moving averages, volatility, returns, correlation)\n- Normalized features, built sliding windows over 50-day inputs\n- Trained a 2-layer LSTM with dense output for regression\n- Achieved R² ≈ 0.799 and RMSE ≈ 12.7 on validation set\n- Visualized predictions vs. actual values using Plotly`,
    techStack: ['Python', 'Pandas', 'Seaborn', 'LSTM', 'Keras', 'Plotly'],
    date: '2023',
    links: [
      { name: 'Dataset', url: 'https://data-flair.training/blogs/download-tata-global-beverages-stocks-data/' },
      { name: 'GitHub', url: 'https://github.com/Baro1502/stock-price-prediction' },
    ],
    images: [
      { src: '/projects/stock-lstm/price-ma.png', alt: 'Moving averages' },
      { src: '/projects/stock-lstm/volatility.png', alt: 'Volatility graph' },
      { src: '/projects/stock-lstm/eval.png', alt: 'Prediction vs actual' },
    ],
  },
  {
    title: 'Spooface',
    description:
      `A Face ID system resistant to presentation attacks via image-based spoof detection using custom-trained YOLOv8.\n\n- Labeled a spoofing dataset to fine-tune YOLOv8 model\n- Integrated OpenCV, DeepFace, and face_recognition for identity matching\n- Real-time spoof detection pipeline filters out printed/onscreen images\n- Modular design for kiosk or edge deployment`,
    techStack: ['Python', 'YOLOv8', 'OpenCV', 'DeepFace', 'face_recognition', 'Pandas'],
    date: '2024',
    links: [],
    images: [
      { src: '/projects/spooface/both-spoofing.png', alt: 'Real vs Spoof' },
      { src: '/projects/spooface/real-spoofing.png', alt: 'Only real face detected' },
    ],
  },
  {
    title: 'Traffix',
    description:
      `A smart traffic navigation system built with public camera feeds and computer vision, replacing GPS data with real-time congestion analysis.\n\n- Collected public camera images and fine-tuned YOLOv8 to count vehicle types\n- Used A* algorithm over camera graph weighted by vehicle density\n- Built cross-platform app with React Native frontend, Python backend\n- Integrated Google Maps for geolocation + live route display`,
    techStack: ['Python', 'YOLOv8', 'OpenCV', 'React Native', 'Google Maps API'],
    date: '2024 - 2025',
    links: [],
    images: [
      { src: '/projects/traffix/detection-batch1.jpg', alt: 'Vehicle detection' },
      { src: '/projects/traffix/default-inapp.jpg', alt: 'App screenshot' },
    ],
  },
];


// Define interface for project prop
interface ProjectProps {
  title: string;
  description?: string;
  techStack?: string[];
  date?: string;
  links?: { name: string; url: string }[];
  images?: { src: string; alt: string }[];
}

const ProjectContent = ({ project }: { project: ProjectProps }) => {
  // Find the matching project data
  const projectData = PROJECT_CONTENT.find((p) => p.title === project.title);

  if (!projectData) {
    return <div>Project details not available</div>;
  }

  return (
    <div className="space-y-10">
      {/* Header section with description */}
      <div className="rounded-3xl bg-[#F5F5F7] p-8 dark:bg-[#1D1D1F]">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span>{projectData.date}</span>
          </div>

          <p className="text-secondary-foreground font-sans text-base leading-relaxed md:text-lg">
            {projectData.description}
          </p>

          {/* Tech stack */}
          <div className="pt-4">
            <h3 className="mb-3 text-sm tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {projectData.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-neutral-200 px-3 py-1 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Links section */}
      {projectData.links && projectData.links.length > 0 && (
        <div className="mb-24">
          <div className="px-6 mb-4 flex items-center gap-2">
            <h3 className="text-sm tracking-wide text-neutral-500 dark:text-neutral-400">
              Links
            </h3>
            <Link className="text-muted-foreground w-4" />
          </div>
          <Separator className="my-4" />
          <div className="space-y-3">
            {projectData.links.map((link, index) => (
                <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#F5F5F7] flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-[#E5E5E7] dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                <span className="font-light capitalize">{link.name}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
            ))}
          </div>
        </div>
      )}
{/* Images gallery */}
{projectData.images && projectData.images.length > 0 && (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-6">
      {projectData.images.map((image, index) => (
        <div
          key={index}
          className="w-full rounded-xl bg-neutral-100 dark:bg-neutral-900 p-4 space-y-2"
        >
          <div className="relative w-full h-96 overflow-hidden rounded-lg bg-white dark:bg-black flex items-center justify-center">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-contain"
            />
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 text-center">
            {image.alt}
          </p>
        </div>
      ))}
    </div>
  </div>
)}




    </div>
  );
};

// Main data export with updated content
export const data = [
  {
    category: 'Healthcare AI',
    title: 'Doctor Assistant',
    src: '/projects/doctor-assistant/logo.webp',
    content: <ProjectContent project={{ title: 'Doctor Assistant' }} />,
  },
  {
    category: 'Big Data & Multimodal',
    title: 'Spaceone',
    src: '/projects/spaceone/logo.webp',
    content: <ProjectContent project={{ title: 'Spaceone' }} />,
  },
  {
    category: 'Big Data & Multimodal',
    title: 'Spooface',
    src: '/projects/spooface/logo.webp',
    content: <ProjectContent project={{ title: 'Spooface' }} />,
  },
  {
    category: 'Finance & Deep Learning',
    title: 'Stock Price Forecasting',
    src: '/projects/stock-lstm/logo.png',
    content: <ProjectContent project={{ title: 'Stock Price Forecasting' }} />,
  },
  {
    category: 'Healthcare & Classification',
    title: 'Diabetes Prediction',
    src: '/projects/diabetes/logo.png',
    content: <ProjectContent project={{ title: 'Diabetes Prediction' }} />,
  },
  {
    category: 'Computer Vision API',
    title: 'Traffix',
    src: '/projects/traffix/logo.png',
    content: <ProjectContent project={{ title: 'Traffix' }} />,
  },
];
