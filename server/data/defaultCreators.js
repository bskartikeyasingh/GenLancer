/**
 * Canonical Freelancers Dataset & Seed Fixtures
 * Aligns with Supabase schema:
 *   - id, name, hourly_rate_usd, skills, specializations,
 *   - ai_tools_models, visual_styles, content_types, output_formats,
 *   - portfolio_items, availability, commercial_use_licensing, rating
 */
export const DEFAULT_CREATORS = [
  {
    id: 'c1',
    name: 'Alex Smith',
    title: 'AI Film Director & Motion Specialist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    location: 'San Francisco, CA / Remote',
    score: 98,
    rating: 4.98,
    completedGigs: 42,
    hourly_rate_usd: 120,
    hourlyRate: '$120/hr',
    specializations: ['AI Filmmaking', 'Cyberpunk Environments', 'Commercial Direction'],
    skills: ['Cinematography', 'Prompt Engineering', 'Fluid Sim', 'Video Editing'],
    ai_tools_models: ['Runway Gen-3 Alpha', 'Midjourney v6', 'Topaz 4K', 'Pika Labs'],
    visual_styles: ['Cyberpunk', 'Cinematic 8K', 'Photorealistic'],
    content_types: ['Video', 'Promo Video', 'Short Film'],
    output_formats: ['16:9', '9:16', 'ProRes', 'MP4'],
    availability: 'Full-time',
    commercial_use_licensing: 'Full commercial rights included',
    portfolio_items: [
      {
        title: 'Volt Energy Cyberpunk Commercial',
        description: '15s high-octane fluid dynamic commercial produced via Midjourney and Runway Gen-3.',
        media_url: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-neon-city-street-41804-large.mp4',
        content_type: 'Video',
        tool: 'Runway Gen-3 Alpha',
        aspect_ratio: '16:9',
        pipeline: 'Midjourney v6 ➔ Runway Gen-3 ➔ Topaz 4K',
        prompt: '/imagine prompt: futuristic mega-city at night, neon reflections in rainwater, anamorphic cinematic 8k --ar 16:9',
        seed: '482019482',
        verified: true
      }
    ],
    verified: true,
    _is_demo_fixture: true
  },
  {
    id: 'c2',
    name: 'Maya Lin',
    title: 'Generative Visual Architect & LoRA Specialist',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
    location: 'New York, NY / Remote',
    score: 96,
    rating: 4.95,
    completedGigs: 38,
    hourly_rate_usd: 110,
    hourlyRate: '$110/hr',
    specializations: ['Generative Architecture & LoRA', 'Synthetic Media Design'],
    skills: ['LoRA Training', 'ControlNet Depth', 'ComfyUI Pipelines', 'Blender Compositor'],
    ai_tools_models: ['Flux.1 Dev', 'ComfyUI', 'SDXL', 'Blender'],
    visual_styles: ['Minimalist Surrealism', 'Macro Photography', 'Photorealistic'],
    content_types: ['Static Graphics', 'Concept Art', 'Marketing Graphics'],
    output_formats: ['1:1', '4:5', 'PNG', 'PSD'],
    availability: 'Part-time',
    commercial_use_licensing: 'Full commercial rights included',
    portfolio_items: [
      {
        title: 'Biomechanical Android Concept',
        description: 'Detailed portrait study using custom Flux LoRA and ControlNet depth estimation.',
        media_url: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-glowing-futuristic-device-41805-large.mp4',
        content_type: 'Static Graphics',
        tool: 'Flux.1 Dev + ComfyUI',
        aspect_ratio: '1:1',
        pipeline: 'Flux.1 Dev ➔ ControlNet Depth ➔ Blender Compositor',
        prompt: 'close-up portrait of android with exposed copper neural cables, volumetric amber lighting, macro photography',
        seed: '99102412',
        verified: true
      }
    ],
    verified: true,
    _is_demo_fixture: true
  },
  {
    id: 'c3',
    name: 'Carlos Rivera',
    title: '3D Synthetic Media & Animatics Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    location: 'Austin, TX / Remote',
    score: 95,
    rating: 4.92,
    completedGigs: 29,
    hourly_rate_usd: 135,
    hourlyRate: '$135/hr',
    specializations: ['3D Synthetic Media', 'Sci-Fi Cityscapes', 'Drone Cinematics'],
    skills: ['Blender Integration', 'Camera Projections', 'VFX Motion', 'Generative Camera Tracking'],
    ai_tools_models: ['Kling AI 1.5', 'Luma Dream Machine', 'Blender', 'After Effects'],
    visual_styles: ['Sci-Fi Cityscapes', 'Hyper-Speed Drone Views', 'Cinematic'],
    content_types: ['Video', '3D Animation'],
    output_formats: ['16:9', '9:16', '1:1', 'MP4'],
    availability: 'Full-time',
    commercial_use_licensing: 'Full commercial rights included',
    portfolio_items: [
      {
        title: 'Obsidian Spire Drone Passage',
        description: 'Hyper-speed drone sequence over synthetic obsidian monoliths with camera projections.',
        media_url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-flying-car-in-a-cyberpunk-city-41807-large.mp4',
        content_type: 'Video',
        tool: 'Kling AI 1.5',
        aspect_ratio: '16:9',
        pipeline: 'Blender ➔ Kling AI 1.5 ➔ After Effects',
        prompt: 'cinematic drone follow shot of high-tech flying vehicle gliding over glowing obsidian skyscrapers',
        seed: '772183921',
        verified: true
      }
    ],
    verified: true,
    _is_demo_fixture: true
  },
  {
    id: 'c4',
    name: 'Sophia Chen',
    title: 'Commercial AI Creative Director',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    location: 'London, UK / Remote',
    score: 99,
    rating: 5.0,
    completedGigs: 56,
    hourly_rate_usd: 160,
    hourlyRate: '$160/hr',
    specializations: ['Commercial AI Direction', 'Luxury Commercials', 'Product Visuals'],
    skills: ['Art Direction', '4K Commercial Mastering', 'High-Speed Fluid Splashes', 'Color Grading'],
    ai_tools_models: ['Sora', 'Runway Gen-3 Alpha', 'Topaz 4K', 'DaVinci Resolve'],
    visual_styles: ['Luxury Commercial', 'Fluid Dynamics', 'Photorealistic'],
    content_types: ['Video', 'Commercial Stills'],
    output_formats: ['16:9', '9:16', 'ProRes 4444', 'MP4'],
    availability: 'Full-time',
    commercial_use_licensing: 'Full commercial rights included',
    portfolio_items: [
      {
        title: 'Amber Drop Luxury Master',
        description: 'Macro commercial fluid splash sequence mastered in 4K for broadcast licensing.',
        media_url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-light-show-41808-large.mp4',
        content_type: 'Video',
        tool: 'Runway Gen-3 Alpha + Topaz 4K',
        aspect_ratio: '16:9',
        pipeline: 'Sora ➔ Topaz AI ➔ DaVinci Resolve',
        prompt: 'photorealistic cinematic commercial shot, fluid amber beverage splashing with hyper-detailed crystal droplets',
        seed: '10928374',
        verified: true
      }
    ],
    verified: true,
    _is_demo_fixture: true
  }
];
