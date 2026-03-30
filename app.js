// --- State Management ---
let base64Image = null;
let currentAngle = null;
let isGenerating = false;
let apiKey = localStorage.getItem('viziaul_gemini_key') || '';

// --- Configuration Data (Enhanced Pro Prompts) ---
const angles = [
    { 
        id: 'frontal', name: 'Frontal & Dynamic', icon: 'ri-crosshair-line',
        prompt: 'shot straight on, perfectly symmetrical front-facing view, dynamic commercial product angle, dramatic three-point studio lighting with soft key light and hard rim light, product centered in frame with slight upward tilt for commanding presence, sharp focus on brand label, shallow depth of field with smooth bokeh background, professional product catalog style',
        technique: 'Three-point studio lighting, Canon EOS R5, 100mm macro lens, f/4, 1/200s',
        tone: 'Bold, confident, commercial-grade, catalog-ready'
    },
    { 
        id: 'floating', name: 'Floating & Artistic', icon: 'ri-space-ship-line',
        prompt: 'levitating in mid-air, zero gravity CGI setup, artistic suspension with dynamic floating composition, product gently rotating at slight angle, surrounded by matching ingredient particles and droplets also floating weightlessly, soft ambient volumetric light from above, anti-gravity commercial photography, ethereal atmosphere with gentle motion blur on floating elements, clean gradient background',
        technique: 'CGI-style levitation, volumetric god rays, anti-gravity physics simulation',
        tone: 'Ethereal, premium, futuristic, mesmerizing weightlessness'
    },
    { 
        id: 'macro', name: 'Macro & Ingredient', icon: 'ri-microscope-line',
        prompt: 'extreme macro close-up product photography, focusing on exquisite raw ingredient textures surrounding the product, micro details of product surface visible, scattered natural raw ingredients around the base (herbs, spices, seeds, minerals, or botanicals matching the product), shallow depth of field with creamy bokeh, moisture droplets on product surface catching soft light, studio ring light with diffuser for even illumination',
        technique: 'Macro lens 100mm, f/2.8, focus stacking, ring light diffuser',
        tone: 'Trustworthy, scientific, ingredient-focused, detail-obsessed'
    },
    { 
        id: 'lifestyle', name: 'Lifestyle & In-use', icon: 'ri-home-heart-line',
        prompt: 'lifestyle product photography, shown naturally in-use by an elegant hand model or a beautiful Southeast Asian woman wearing hijab in a premium realistic environment, warm golden hour window light, product being actively used or held gracefully, cozy luxurious interior background with bokeh, candid natural pose conveying genuine satisfaction, editorial style photography for social media campaign',
        technique: 'Natural window light, 85mm portrait lens, f/1.8, editorial candid style',
        tone: 'Warm, relatable, aspirational, social media ready, Malaysian market'
    },
    { 
        id: 'minimalist', name: 'Minimalist & Clean', icon: 'ri-layout-masonry-line',
        prompt: 'ultra minimalist product composition, placed alone on an infinite seamless clean background, single color studio sweep, professional softbox lighting with subtle shadow beneath product, product perfectly centered, extremely clean and sleek luxury e-commerce style, no distractions, pristine corporate brand photography, subtle reflection on surface',
        technique: 'Seamless backdrop, dual softbox diffused lighting, Sony A7R V, 90mm, f/8',
        tone: 'Clean, premium, e-commerce ready, Apple-style elegance'
    },
    { 
        id: 'flatlay', name: 'Flat Lay / Overhead', icon: 'ri-layout-top-line',
        prompt: 'perfect top-down flat lay overhead view, product placed centrally, harmoniously surrounded by carefully curated matching props arranged in balanced geometric pattern, complementary color palette accessories, fresh flowers or natural elements as accents, clean marble or linen textured surface, soft diffused natural daylight from directly above, Instagram-worthy editorial styling',
        technique: 'Overhead 90° bird-eye angle, diffused daylight, styled prop arrangement',
        tone: 'Curated, Instagram-worthy, editorial, aesthetically balanced'
    },
    { 
        id: 'splash', name: 'Action & Splash', icon: 'ri-drop-line',
        prompt: 'ultra high-speed action photography, dramatic liquid splash or thick viscous pour surrounding the product, frozen motion at 1/8000s shutter speed, dynamic sauce drip or cream explosion or water crown splash, highly energetic kinetic composition with liquid swirling around product, matching liquid color to product theme (chocolate, honey, cream, sauce, juice), droplets suspended in mid-air, intense studio strobe lighting with dark or vibrant gradient background, hyper-realistic CGI-quality rendering',
        technique: 'High-speed strobe 1/8000s, liquid dynamics simulation, multi-flash freeze',
        tone: 'Explosive energy, appetite appeal, viral-worthy, show-stopping drama'
    },
    { 
        id: 'nature', name: 'Nature & Organic', icon: 'ri-leaf-line',
        prompt: 'outdoor organic nature product photography, product placed on natural stone or wooden surface, surrounded by lush fresh green leaves, sliced fresh fruits or vegetables matching product ingredients, wildflowers, morning dew drops, beautiful golden hour warm sunlight streaming through foliage creating dappled light patterns, earthy botanical aesthetic, shallow depth of field with dreamy green bokeh background, farm-to-table premium feel',
        technique: 'Golden hour natural light, outdoor setting, 85mm f/1.4, botanical styling',
        tone: 'Fresh, organic, wholesome, trustworthy, nature-connected'
    },
    { 
        id: 'dark', name: 'Dark & Luxurious', icon: 'ri-moon-clear-line',
        prompt: 'dark moody background product photography, dramatic chiaroscuro spotlight single beam lighting from above, intense deep shadows and striking golden or warm highlights, wisps of atmospheric smoke or mist curling around product base, product glowing as hero element, ultra high-end luxurious mood, dark marble or obsidian surface with subtle reflections, reminiscent of luxury perfume or whiskey advertising, embers or sparks optional for dramatic effect',
        technique: 'Single spot light, smoke machine, dark backdrop, Nikon D850, 70-200mm f/2.8',
        tone: 'Luxurious, mysterious, premium, dark elegance, high-end brand'
    },
    { 
        id: 'cyber', name: 'Cyberpunk & Neon', icon: 'ri-flashlight-line',
        prompt: 'cyberpunk futuristic neon product photography, vibrant dual-tone neon rim lighting in contrasting colors (hot pink and electric teal or purple and cyan), glowing dramatic volumetric light beams, reflective wet surface creating neon reflections beneath product, dark futuristic environment, holographic or iridescent accents, sci-fi commercial aesthetic, product as centerpiece hero lit by neon edge lighting',
        technique: 'RGB LED strip lighting, wet reflective surface, dual neon rim lights',
        tone: 'Futuristic, tech-savvy, gaming aesthetic, Gen-Z appeal, bold'
    },
    { 
        id: 'scale', name: 'Scale & Reference', icon: 'ri-ruler-line',
        prompt: 'product scale reference photography, placed artistically next to familiar everyday objects for intuitive size comparison (hand, coffee cup, coin, smartphone), natural commercial studio lighting with soft shadows, clean neutral background, casual but intentional arrangement showing product dimensions clearly, trustworthy e-commerce informational style that helps buyers understand actual product size',
        technique: 'Neutral studio, reference objects, even fill lighting, informational angle',
        tone: 'Informative, trustworthy, helpful, transparent, buyer-friendly'
    },
    { 
        id: 'vintage', name: 'Nostalgic & Vintage', icon: 'ri-camera-lens-line',
        prompt: 'nostalgic vintage retro aesthetic product photography, warm sepia and amber color grading, subtle analog film grain texture overlay, surrounded by charming retro props (old books, dried flowers, vintage fabric, brass instruments, antique wooden elements), soft directional window light creating warm shadows, rustic weathered surface texture, heritage brand storytelling mood, Kodak Portra 400 film emulation',
        technique: 'Warm tungsten lighting, film grain overlay, Kodak Portra 400 color science',
        tone: 'Nostalgic, heritage, artisanal, warm storytelling, timeless charm'
    },
    { 
        id: 'festive', name: 'Festive & Thematic', icon: 'ri-gift-line',
        prompt: 'festive celebration thematic product photography, warm holiday lighting with bokeh fairy lights in background, subtle traditional decorative motifs (Raya ketupat, ribbon bows, confetti, or seasonal flowers), rich jewel-tone color palette (gold, burgundy, emerald), product styled as a gift or celebration centerpiece, joyful warm glow ambiance, festive wrapping elements nearby, commercial seasonal campaign style perfect for Hari Raya, CNY, or Christmas promotions',
        technique: 'Fairy light bokeh, warm tungsten, festive props, seasonal color palette',
        tone: 'Joyful, celebratory, seasonal campaign, gift-giving, cultural warmth'
    }
];

const offers = {
    urgency: [
        {id: 'flash', text: 'Flash Sale / Jualan Kilat'},
        {id: 'preorder', text: 'Pre-order Special Price'}
    ],
    volume: [
        {id: 'b1f1', text: 'Buy 1 Free 1 (B1F1)'},
        {id: 'bundle', text: 'Bundling Produk'},
        {id: 'bulk', text: 'Beli Banyak Dapat Lebih'}
    ],
    value: [
        {id: 'gift', text: 'Hadiah percuma dengan pembelian'},
        {id: 'sample', text: 'Free Sample / Sampel Percuma'},
        {id: 'trial', text: 'Free Trial'},
        {id: 'wrapping', text: 'Free Gift Wrapping'},
        {id: 'setup', text: 'Percuma pemasangan / Konsultasi'}
    ],
    friction: [
        {id: 'coupon', text: 'Kupon atau baucar diskaun'},
        {id: 'sameday', text: 'Same-day delivery'},
        {id: 'guarantee', text: 'Jaminan pulangan wang'},
        {id: 'cashback', text: 'Cashback / Mata Ganjaran'}
    ]
};


// --- DOM Elements ---
const modal = document.getElementById('settings-modal');
const btnOpenSettings = document.getElementById('open-settings');
const btnCloseSettings = document.getElementById('close-settings');
const inpGeminiKey = document.getElementById('gemini-key');
const btnSaveSettings = document.getElementById('save-settings');

const uploadArea = document.getElementById('upload-area');
const productInput = document.getElementById('product-input');
const uploadPrompt = document.getElementById('upload-prompt');
const previewContainer = document.getElementById('preview-container');
const imagePreview = document.getElementById('image-preview');
const removeImageBtn = document.getElementById('remove-image');

const anglesGrid = document.getElementById('angles-grid');
const offerToggle = document.getElementById('offer-toggle');
const offerSection = document.getElementById('offer-section');
const offerCategory = document.getElementById('offer-category');
const offerType = document.getElementById('offer-type');

const btnGenerate = document.getElementById('generate-btn');
const emptyState = document.getElementById('empty-state');
const resultState = document.getElementById('result-state');
const loadingState = document.getElementById('ai-loading');
const promptResult = document.getElementById('prompt-result');
const outputPrompt = document.getElementById('output-prompt');
const copyBtn = document.getElementById('copy-btn');

const posterComposer = document.getElementById('poster-composer');
const composerUpload = document.getElementById('composer-upload');
const aiImageInput = document.getElementById('ai-image-input');
const canvasWrapper = document.getElementById('canvas-wrapper');
const posterCanvas = document.getElementById('poster-canvas');
const downloadBtn = document.getElementById('download-btn');


// --- Initialization ---
function init() {
    renderAngles();
    populateOffers(offerCategory.value);
    
    // Check if key exists
    if(apiKey) {
        inpGeminiKey.value = apiKey;
    } else {
        setTimeout(() => modal.classList.remove('hidden'), 500);
    }
    
    attachEventListeners();
}

// --- Render Functions ---
function renderAngles() {
    anglesGrid.innerHTML = '';
    angles.forEach(angle => {
        const div = document.createElement('div');
        div.className = 'angle-card';
        div.innerHTML = `
            <i class="${angle.icon} ${angle.icon.includes('-fill')?'':'angle-icon'}"></i>
            <span class="angle-name">${angle.name}</span>
        `;
        div.addEventListener('click', () => {
            document.querySelectorAll('.angle-card').forEach(c => c.classList.remove('active'));
            div.classList.add('active');
            currentAngle = angle;
            checkReadyState();
        });
        anglesGrid.appendChild(div);
    });
}

function populateOffers(category) {
    offerType.innerHTML = '';
    const list = offers[category];
    list.forEach(offer => {
        const option = document.createElement('option');
        option.value = offer.id;
        option.textContent = offer.text;
        offerType.appendChild(option);
    });
}

// --- Event Listeners ---
function attachEventListeners() {
    // Settings
    btnOpenSettings.addEventListener('click', () => modal.classList.remove('hidden'));
    btnCloseSettings.addEventListener('click', () => modal.classList.add('hidden'));
    btnSaveSettings.addEventListener('click', () => {
        const key = inpGeminiKey.value.trim();
        if(key) {
            apiKey = key;
            localStorage.setItem('viziaul_gemini_key', key);
            modal.classList.add('hidden');
        } else {
            alert("Tolong masukkan API Key yang sah.");
        }
    });

    // File Upload (Base Product)
    uploadArea.addEventListener('click', () => {
        if(!base64Image) productInput.click();
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if(e.dataTransfer.files.length) {
            handleBrandImage(e.dataTransfer.files[0]);
        }
    });

    productInput.addEventListener('change', (e) => {
        if(e.target.files.length) {
            handleBrandImage(e.target.files[0]);
        }
    });

    removeImageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        base64Image = null;
        productInput.value = '';
        previewContainer.style.display = 'none';
        uploadPrompt.style.display = 'block';
        checkReadyState();
    });

    // Offer Selectors
    offerToggle.addEventListener('change', (e) => {
        if(e.target.checked) {
            offerSection.classList.remove('hidden');
        } else {
            offerSection.classList.add('hidden');
        }
    });
    
    offerCategory.addEventListener('change', (e) => {
        populateOffers(e.target.value);
    });

    // Generate
    btnGenerate.addEventListener('click', generateStrategy);
    
    // Copy
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(outputPrompt.value).then(() => {
            const icon = copyBtn.querySelector('i');
            icon.className = 'ri-check-line';
            setTimeout(() => { icon.className = 'ri-clipboard-line'; }, 2000);
        });
    });
    
    // Composer
    composerUpload.addEventListener('click', () => aiImageInput.click());
    aiImageInput.addEventListener('change', (e) => {
        if(e.target.files.length) {
            drawPosterCanvas(e.target.files[0]);
        }
    });
    
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'VizuAIl-Marketing-Poster.png';
        link.href = posterCanvas.toDataURL('image/png');
        link.click();
    });
}

function handleBrandImage(file) {
    if(!file.type.startsWith('image/')) return alert("Sila muat naik fail imej.");
    
    const reader = new FileReader();
    reader.onload = (e) => {
        base64Image = e.target.result;
        imagePreview.src = base64Image;
        uploadPrompt.style.display = 'none';
        previewContainer.style.display = 'block';
        checkReadyState();
    };
    reader.readAsDataURL(file);
}

function checkReadyState() {
    if(base64Image && currentAngle) {
        btnGenerate.disabled = false;
        btnGenerate.classList.add('pulse');
    } else {
        btnGenerate.disabled = true;
        btnGenerate.classList.remove('pulse');
    }
}

// --- Integration API ---
async function analyzeImageWithGemini() {
    if(!apiKey) throw new Error("API Key hilang.");
    
    // Remove data uri prefix
    const base64Data = base64Image.split(',')[1];
    
    const payload = {
        contents: [{
            parts: [
                { text: "Describe this product's physical appearance (shape, exact colors, materials) in under 30 words in English. Do not describe the background. Focus ONLY on the main product." },
                {
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: base64Data
                    }
                }
            ]
        }],
        generationConfig: {
            temperature: 0.1, // Keep it objective and factual
            maxOutputTokens: 50
        }
    };

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if(!res.ok) {
        throw new Error("Gagal hubungi Gemini. Sila semak API Key.");
    }
    
    const data = await res.json();
    if(data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text.trim();
    }
    throw new Error("Tiada analisa dikembalikan.");
}

async function generateStrategy() {
    if(isGenerating) return;
    isGenerating = true;
    
    if(!apiKey) {
        modal.classList.remove('hidden');
        isGenerating = false;
        return;
    }

    // UI Updates
    emptyState.classList.add('hidden');
    resultState.classList.remove('hidden');
    promptResult.classList.add('hidden');
    posterComposer.classList.add('hidden');
    loadingState.classList.remove('hidden');
    btnGenerate.disabled = true;
    btnGenerate.innerHTML = '<div class="spinner border-sm mr-2" style="display:inline-block; border-color:white; border-top-color:transparent; width:15px; height:15px"></div> Membina Prompt...';

    try {
        // 1. Get identity 'Lock' from Gemini Vision
        const productTraits = await analyzeImageWithGemini();
        
        // 2. Build structured 5T Prompt
        let lines = [];
        
        // T1: TASK
        lines.push(`[T1 - TASK]`);
        lines.push(`Create a hyper-realistic, studio-grade commercial product photograph suitable for a premium e-commerce listing, social media advertising campaign, and print marketing material.`);
        lines.push(``);

        // T2: THING (Product Identity — AI-Locked)
        lines.push(`[T2 - THING / PRODUCT IDENTITY — AI VISUAL LOCK]`);
        lines.push(`The hero subject is: ${productTraits}.`);
        lines.push(`Preserve the exact packaging design, brand logo, label text, color scheme, and physical proportions of the product with absolute precision. The product must be clearly identifiable and the label must remain sharp and legible.`);
        lines.push(``);

        // T3: TECHNIQUE (Visual Angle & Camera)
        lines.push(`[T3 - TECHNIQUE / VISUAL ANGLE]`);
        lines.push(`Style: ${currentAngle.name}`);
        lines.push(`${currentAngle.prompt}.`);
        lines.push(`Camera: ${currentAngle.technique}.`);
        lines.push(`Render at 8K ultra-high resolution, photorealistic, RAW uncompressed quality.`);
        lines.push(``);

        // T4: TONE (Mood & Feel)
        lines.push(`[T4 - TONE / MOOD]`);
        lines.push(`${currentAngle.tone}.`);
        lines.push(`The overall image must feel like a RM10,000+ professional studio campaign — premium, polished, commercial-grade quality that elevates the perceived value of the product.`);
        lines.push(``);

        // T5: TEMPLATE (Composition & Layout)
        lines.push(`[T5 - TEMPLATE / COMPOSITION]`);
        if(offerToggle.checked) {
            const offerText = offerType.options[offerType.selectedIndex].text;
            lines.push(`IMPORTANT LAYOUT: Reserve a prominent clean negative space area (approximately 30% of the frame) in the top-right or top portion of the image. This space must be a solid or softly gradient-colored area with NO product elements — it will be used for bold "${offerText}" typography overlay in post-production.`);
            lines.push(`The composition must intentionally push the product slightly to the lower-left to accommodate this text-ready zone.`);
            posterComposer.classList.remove('hidden');
        } else {
            lines.push(`Full-frame hero composition. Product occupies the hero center of the frame. No text space required — the entire canvas is dedicated to showcasing the product at maximum visual impact.`);
            posterComposer.classList.add('hidden');
        }
        lines.push(``);

        // NEGATIVE PROMPT
        lines.push(`[NEGATIVE PROMPT]`);
        lines.push(`Do NOT include: watermarks, blurry areas, distorted labels, extra text, unrealistic proportions, cartoon style, clipart, low quality, pixelation, AI artifacts, extra fingers on models.`);

        outputPrompt.value = lines.join('\n');
        promptResult.classList.remove('hidden');
        
    } catch (err) {
        alert("Ralat Penjanaan: " + err.message);
        emptyState.classList.remove('hidden');
        resultState.classList.add('hidden');
    } finally {
        isGenerating = false;
        loadingState.classList.add('hidden');
        btnGenerate.disabled = false;
        btnGenerate.innerHTML = '<i class="ri-magic-line"></i> Jana Rantaian Strategi (5T Prompt)';
    }
}

// --- Canvas Composer ---
function drawPosterCanvas(file) {
    if(!file.type.startsWith('image/')) return alert("Sila muat naik fail imej.");
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const ctx = posterCanvas.getContext('2d');
            
            // Set canvas size (normalize to a standard max dimension for quality)
            const MAX_WIDTH = 1200;
            let width = img.width;
            let height = img.height;
            
            if (width > MAX_WIDTH) {
                height = height * (MAX_WIDTH / width);
                width = MAX_WIDTH;
            }
            
            posterCanvas.width = width;
            posterCanvas.height = height;
            
            // Draw Background Image
            ctx.drawImage(img, 0, 0, width, height);
            
            // Draw Offer Overlay if applicable
            if(offerToggle.checked) {
                const labelField = offerType.options[offerType.selectedIndex].text;
                
                // Overlay Design (Red Ribbon / Badge top right)
                ctx.save();
                ctx.font = `bold ${width * 0.05}px 'Outfit', sans-serif`;
                
                const padding = width * 0.03;
                const textWidth = ctx.measureText(labelField).width;
                const badgeWidth = textWidth + (padding * 2);
                const badgeHeight = width * 0.08;
                
                const x = width - badgeWidth - (width * 0.05); // 5% margin from right
                const y = width * 0.05; // 5% margin from top
                
                // Draw shadow
                ctx.shadowColor = "rgba(0,0,0,0.5)";
                ctx.shadowBlur = 15;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 10;
                
                // Draw shape
                ctx.fillStyle = "#ef4444"; // Danger Red
                ctx.beginPath();
                ctx.roundRect(x, y, badgeWidth, badgeHeight, badgeHeight/2);
                ctx.fill();
                
                // Draw text
                ctx.shadowColor = "transparent";
                ctx.fillStyle = "#ffffff";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(labelField, x + (badgeWidth/2), y + (badgeHeight/2) + (badgeHeight*0.05));
                ctx.restore();
            }
            
            composerUpload.style.display = 'none';
            canvasWrapper.classList.remove('hidden');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Let's attach polyfill for roundRect quickly just in case older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
  }
}

// Start app
init();
