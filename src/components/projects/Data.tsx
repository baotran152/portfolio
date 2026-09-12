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
      `A LangGraph-powered conversational agent with memory and tool use, enabling multi-turn clinical dialogue across text, PDF, speech, and image inputs.\n\n- Built with LangGraph for dynamic, multi-turn conversations\n- Embedded structured medical literature into Pinecone vector DB for RAG-powered responses\n- Enabled multi-modal input processing (text, PDF, Whisper speech, PIL images)\n- Designed JSON-constrained prompt templates to enforce structured LLM output\n- Combined cloud APIs and local LLMs (vLLM, Ollama) to optimize inference`,
    techStack: [
      'Python', 'LLM', 'OpenAI', 'Azure', 'GCP', 'OCR', 'RAG', 'Vector DB',
      'Pinecone', 'LangGraph', 'vLLM', 'Ollama', 'Whisper'
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
      `A real-time media summarization and sentiment analysis platform scaling via Kafka.\n\n- Designed pipeline: isolated vocals with Spleeter, transcribed with Whisper\n- Summarized via structured GPT-4 prompts over LangChain\n- Fine-tuned PhoBERT for Vietnamese 3-class sentiment classification (84% F1)\n- Integrated into Kafka streaming architecture, deployed on GCP/AWS`,
    techStack: ['Python', 'Kafka', 'OpenAI', 'GCP', 'AWS', 'LangChain', 'PhoBERT', 'Whisper', 'Spleeter'],
    date: '2023 - 2025',
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
      `A regression-based ML pipeline to predict blood sugar levels from health questionnaire responses and basic diagnostics.\n\n- Trained 10+ regression models on OCR-parsed survey data\n- Applied log-transformed glucose targets and RobustScaler normalization\n- Balanced dataset using ADASYN oversampling\n- SVR achieved R² > 0.85 with ~5% mean prediction error\n- Pipeline supports early-stage, non-invasive diabetes screening`,
    techStack: ['Python', 'Pandas', 'XGBoost', 'Scikit-learn', 'SVR'],
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
      { name: 'GitHub', url: 'https://github.com/baotran152/stock-price-prediction' },
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
      `A Face ID system resistant to presentation attacks via image-based spoof detection using custom-trained YOLOv8.\n\n- Fine-tuned YOLOv8 to classify real vs. spoofed inputs (printed, screens, masks) on custom dataset\n- Integrated OpenCV and DeepFace for post-liveness identity verification\n- Achieved 92% spoof detection accuracy with sub-1s latency\n- Reduced unauthorized check-ins by over 85% in live event conditions`,
    techStack: ['Python', 'YOLOv8', 'OpenCV', 'DeepFace', 'Pandas'],
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
  {
    title: 'MedVita',
    description:
      `A synthetic medical conversation generation pipeline automating end-to-end generation and evaluation of synthetic doctor-patient conversations.\n\n- Designed a Dagster orchestration pipeline with a 4-stage clean architecture: preprocessing, inference, postprocessing, evaluation\n- Architected multi-agent systems with LangChain and Camel-AI\n- Simulates realistic clinical dialogues across 10+ specialized medical departments\n- Generates dynamic patient personas and synthesizes clinical scenarios`,
    techStack: ['Python', 'Dagster', 'LangChain', 'Camel-AI', 'LLM Agents'],
    date: '2025 - Present',
    links: [],
    images: [],
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
    category: 'Healthcare AI',
    title: 'MedVita',
    src: '/projects/medvita/logo.webp',
    content: <ProjectContent project={{ title: 'MedVita' }} />,
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
