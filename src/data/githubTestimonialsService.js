import { seedTestimonials } from '../data/testimonialsData';

const REPO_OWNER = 'GitGuru29';
const REPO_NAME = 'portfoilo-web';
const LOCAL_STORAGE_KEY = 'portfolio_pending_testimonials';

/**
 * Compresses an uploaded File into a 150x150 WebP/JPEG Base64 Data URL
 */
export function compressImageFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const size = 150;

                canvas.width = size;
                canvas.height = size;

                // Crop and scale to center square
                const minDimension = Math.min(img.width, img.height);
                const sx = (img.width - minDimension) / 2;
                const sy = (img.height - minDimension) / 2;

                ctx.drawImage(img, sx, sy, minDimension, minDimension, 0, 0, size, size);
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve(compressedDataUrl);
            };
            img.onerror = (err) => reject(err);
            img.src = e.target.result;
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
}

/**
 * Parses issue body into a recommendation object if formatted.
 */
function parseIssueToTestimonial(issue) {
    try {
        const jsonMatch = issue.body?.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            const data = JSON.parse(jsonMatch[1]);
            return {
                id: `gh-${issue.id}`,
                name: data.name || issue.user?.login || 'Anonymous Referee',
                role: data.role || 'Verified Referee',
                company: data.company || '',
                avatar: data.avatar || issue.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
                relationship: data.relationship || 'Client / Peer',
                rating: Number(data.rating) || 5,
                text: data.text || issue.body,
                date: issue.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
                linkedin: data.linkedin || '',
            };
        }

        return {
            id: `gh-${issue.id}`,
            name: issue.title.replace(/^\[Recommendation\]\s*/i, '') || issue.user?.login,
            role: 'Verified Referee',
            company: '',
            avatar: issue.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            relationship: 'Client',
            rating: 5,
            text: issue.body,
            date: issue.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            linkedin: '',
        };
    } catch {
        return null;
    }
}

/**
 * Fetches approved testimonials from GitHub Issues tagged with `approved`,
 * plus any locally submitted test items.
 */
export async function fetchApprovedTestimonials() {
    let liveTestimonials = [];
    try {
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=approved&state=all&per_page=50`,
            {
                headers: { Accept: 'application/vnd.github.v3+json' },
            }
        );

        if (response.ok) {
            const issues = await response.json();
            liveTestimonials = issues.map(parseIssueToTestimonial).filter(Boolean);
        }
    } catch (err) {
        console.warn('Error fetching testimonials from GitHub:', err);
    }

    // Load locally saved items (for testing/immediate preview)
    let localItems = [];
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            localItems = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Error reading local stored testimonials:', e);
    }

    const combined = [...localItems, ...liveTestimonials];
    return combined.length > 0 ? [...combined, ...seedTestimonials] : seedTestimonials;
}

/**
 * Direct seamless submission — saves recommendation payload and dispatches to GitHub queue.
 * Clients NEVER need a GitHub account.
 */
export async function submitDirectRecommendation(data) {
    const payload = {
        id: `local-${Date.now()}`,
        name: data.name,
        role: data.role || 'Client / Referee',
        company: data.company || '',
        relationship: data.relationship || 'Client',
        rating: data.rating || 5,
        linkedin: data.linkedin || '',
        avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        text: data.text,
        date: new Date().toISOString().split('T')[0],
    };

    // Save locally so the client/tester gets instant feedback
    try {
        const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([payload, ...existing]));
    } catch (e) {
        console.warn('Error saving local recommendation:', e);
    }

    // Attempt direct GitHub API submission
    try {
        const bodyContent = `### Client Recommendation Submission\n\n\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\`\n\n**Recommendation Text:**\n> ${data.text}`;
        
        await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: `[Recommendation] ${data.name} - ${data.role || 'Client'}`,
                body: bodyContent,
                labels: ['recommendation-pending'],
            }),
        });
    } catch (err) {
        console.log('GitHub dispatch logged:', err);
    }

    return payload;
}
