import { seedTestimonials } from '../data/testimonialsData';

const REPO_OWNER = 'GitGuru29';
const REPO_NAME = 'portfoilo-web';
const LOCAL_APPROVED_KEY = 'portfolio_approved_testimonials';
const LOCAL_PENDING_KEY = 'portfolio_pending_testimonials';

/**
 * Compresses an uploaded File into a 150x150 JPEG Base64 Data URL
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
                approved: true,
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
            approved: true,
        };
    } catch {
        return null;
    }
}

/**
 * Fetches ONLY APPROVED testimonials for the public website.
 */
export async function fetchApprovedTestimonials() {
    let liveTestimonials = [];
    try {
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=approved&state=all&per_page=50`,
            { headers: { Accept: 'application/vnd.github.v3+json' } }
        );

        if (response.ok) {
            const issues = await response.json();
            liveTestimonials = issues.map(parseIssueToTestimonial).filter(Boolean);
        }
    } catch (err) {
        console.warn('Error fetching testimonials from GitHub:', err);
    }

    // Load locally approved items
    let localApproved = [];
    try {
        const stored = localStorage.getItem(LOCAL_APPROVED_KEY);
        if (stored) {
            localApproved = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Error reading local approved testimonials:', e);
    }

    const combined = [...localApproved, ...liveTestimonials];
    return combined.length > 0 ? [...combined, ...seedTestimonials] : seedTestimonials;
}

/**
 * Fetches PENDING testimonials for the Admin Dashboard.
 */
export function fetchPendingTestimonials() {
    try {
        const stored = localStorage.getItem(LOCAL_PENDING_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.warn('Error reading pending testimonials:', e);
        return [];
    }
}

/**
 * Submits a new recommendation — enters as PENDING (approved: false) by default.
 * Trolls/haters CANNOT post live without admin approval!
 */
export async function submitDirectRecommendation(data) {
    const payload = {
        id: `rec-${Date.now()}`,
        name: data.name,
        role: data.role || 'Client / Referee',
        company: data.company || '',
        relationship: data.relationship || 'Client',
        rating: data.rating || 5,
        linkedin: data.linkedin || '',
        avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        text: data.text,
        date: new Date().toISOString().split('T')[0],
        approved: false,
    };

    // Save into Pending queue
    try {
        const pending = JSON.parse(localStorage.getItem(LOCAL_PENDING_KEY) || '[]');
        localStorage.setItem(LOCAL_PENDING_KEY, JSON.stringify([payload, ...pending]));
    } catch (e) {
        console.warn('Error saving pending recommendation:', e);
    }

    // Dispatch to GitHub queue for admin review
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

/**
 * ADMIN ACTION: Approves a pending recommendation by ID.
 * Moves item from Pending to Approved live public view.
 */
export function approveTestimonial(id) {
    try {
        const pending = JSON.parse(localStorage.getItem(LOCAL_PENDING_KEY) || '[]');
        const target = pending.find((item) => item.id === id);
        if (!target) return false;

        // Remove from pending
        const updatedPending = pending.filter((item) => item.id !== id);
        localStorage.setItem(LOCAL_PENDING_KEY, JSON.stringify(updatedPending));

        // Add to approved
        target.approved = true;
        const approved = JSON.parse(localStorage.getItem(LOCAL_APPROVED_KEY) || '[]');
        localStorage.setItem(LOCAL_APPROVED_KEY, JSON.stringify([target, ...approved]));

        return true;
    } catch (e) {
        console.error('Error approving testimonial:', e);
        return false;
    }
}

/**
 * ADMIN ACTION: Permanently deletes any recommendation by ID (Pending or Approved).
 * Used to remove test items or reject troll submissions.
 */
export function deleteTestimonial(id) {
    try {
        // Delete from pending
        const pending = JSON.parse(localStorage.getItem(LOCAL_PENDING_KEY) || '[]');
        const updatedPending = pending.filter((item) => item.id !== id);
        localStorage.setItem(LOCAL_PENDING_KEY, JSON.stringify(updatedPending));

        // Delete from approved
        const approved = JSON.parse(localStorage.getItem(LOCAL_APPROVED_KEY) || '[]');
        const updatedApproved = approved.filter((item) => item.id !== id);
        localStorage.setItem(LOCAL_APPROVED_KEY, JSON.stringify(updatedApproved));

        return true;
    } catch (e) {
        console.error('Error deleting testimonial:', e);
        return false;
    }
}
