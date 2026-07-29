import { seedTestimonials } from '../data/testimonialsData';

const REPO_OWNER = 'GitGuru29';
const REPO_NAME = 'portfoilo-web';
const LOCAL_APPROVED_KEY = 'portfolio_approved_testimonials';
const LOCAL_PENDING_KEY = 'portfolio_pending_testimonials';
const LOCAL_DELETED_KEY = 'portfolio_deleted_testimonials';
const LOCAL_EDITED_KEY = 'portfolio_edited_testimonials';

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
 * Helper to get deleted IDs blacklist (always returned as array of strings)
 */
function getDeletedIds() {
    try {
        const stored = localStorage.getItem(LOCAL_DELETED_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        return parsed.map(String);
    } catch {
        return [];
    }
}

/**
 * Helper to get edited recommendations map (key: string id, value: updated testimonial object)
 */
function getEditedOverrides() {
    try {
        const stored = localStorage.getItem(LOCAL_EDITED_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

/**
 * Applies any edited property overrides to an array of testimonial objects
 */
function applyEditedOverrides(items) {
    const editedMap = getEditedOverrides();
    return items.map((item) => {
        const idStr = String(item.id);
        if (editedMap[idStr]) {
            return { ...item, ...editedMap[idStr] };
        }
        return item;
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
    const deletedIds = getDeletedIds();

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

    // Deduplicate by string ID
    const allCandidates = [...localApproved, ...liveTestimonials, ...seedTestimonials];
    const uniqueMap = new Map();
    allCandidates.forEach((item) => {
        const idStr = String(item.id);
        if (!uniqueMap.has(idStr)) {
            uniqueMap.set(idStr, item);
        }
    });

    const combined = Array.from(uniqueMap.values());
    const nonDeleted = combined.filter((item) => !deletedIds.includes(String(item.id)));
    return applyEditedOverrides(nonDeleted);
}

/**
 * Fetches PENDING testimonials for the Admin Dashboard.
 */
export function fetchPendingTestimonials() {
    const deletedIds = getDeletedIds();
    try {
        const stored = localStorage.getItem(LOCAL_PENDING_KEY);
        const pending = stored ? JSON.parse(stored) : [];
        const nonDeleted = pending.filter((item) => !deletedIds.includes(String(item.id)));
        return applyEditedOverrides(nonDeleted);
    } catch (e) {
        console.warn('Error reading pending testimonials:', e);
        return [];
    }
}

/**
 * Submits a new recommendation — enters as PENDING (approved: false) by default.
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
 */
export function approveTestimonial(id) {
    if (!id) return false;
    const idStr = String(id);

    try {
        const pending = JSON.parse(localStorage.getItem(LOCAL_PENDING_KEY) || '[]');
        const target = pending.find((item) => String(item.id) === idStr);
        if (!target) return false;

        // Remove from pending
        const updatedPending = pending.filter((item) => String(item.id) !== idStr);
        localStorage.setItem(LOCAL_PENDING_KEY, JSON.stringify(updatedPending));

        // Apply edited override if exists
        const editedMap = getEditedOverrides();
        const finalTarget = editedMap[idStr]
            ? { ...target, ...editedMap[idStr], approved: true }
            : { ...target, approved: true };

        // Add to approved
        const approved = JSON.parse(localStorage.getItem(LOCAL_APPROVED_KEY) || '[]');
        const cleanApproved = approved.filter((item) => String(item.id) !== idStr);
        localStorage.setItem(LOCAL_APPROVED_KEY, JSON.stringify([finalTarget, ...cleanApproved]));

        return true;
    } catch (e) {
        console.error('Error approving testimonial:', e);
        return false;
    }
}

/**
 * ADMIN ACTION: Updates an existing recommendation's data (saves edits across all collections).
 */
export function updateTestimonial(updatedData) {
    if (!updatedData || !updatedData.id) return false;
    const idStr = String(updatedData.id);

    try {
        // 1. Save in edited overrides map
        const editedMap = getEditedOverrides();
        editedMap[idStr] = updatedData;
        localStorage.setItem(LOCAL_EDITED_KEY, JSON.stringify(editedMap));

        // 2. Update in pending list if present
        const pending = JSON.parse(localStorage.getItem(LOCAL_PENDING_KEY) || '[]');
        const updatedPending = pending.map((item) =>
            String(item.id) === idStr ? { ...item, ...updatedData } : item
        );
        localStorage.setItem(LOCAL_PENDING_KEY, JSON.stringify(updatedPending));

        // 3. Update in approved list if present
        const approved = JSON.parse(localStorage.getItem(LOCAL_APPROVED_KEY) || '[]');
        const updatedApproved = approved.map((item) =>
            String(item.id) === idStr ? { ...item, ...updatedData } : item
        );
        localStorage.setItem(LOCAL_APPROVED_KEY, JSON.stringify(updatedApproved));

        return true;
    } catch (e) {
        console.error('Error updating testimonial:', e);
        return false;
    }
}

/**
 * ADMIN ACTION: Permanently deletes any recommendation by ID (Pending, Approved, Seed, or Old Key).
 */
export function deleteTestimonial(id) {
    if (!id) return false;
    const idStr = String(id);

    try {
        // 1. Delete from pending
        const pending = JSON.parse(localStorage.getItem(LOCAL_PENDING_KEY) || '[]');
        const updatedPending = pending.filter((item) => String(item.id) !== idStr);
        localStorage.setItem(LOCAL_PENDING_KEY, JSON.stringify(updatedPending));

        // 2. Delete from approved
        const approved = JSON.parse(localStorage.getItem(LOCAL_APPROVED_KEY) || '[]');
        const updatedApproved = approved.filter((item) => String(item.id) !== idStr);
        localStorage.setItem(LOCAL_APPROVED_KEY, JSON.stringify(updatedApproved));

        // 3. Delete from edited overrides
        const editedMap = getEditedOverrides();
        if (editedMap[idStr]) {
            delete editedMap[idStr];
            localStorage.setItem(LOCAL_EDITED_KEY, JSON.stringify(editedMap));
        }

        // 4. Blacklist the ID permanently so it never shows up from seed or API
        const deletedIds = getDeletedIds();
        if (!deletedIds.includes(idStr)) {
            localStorage.setItem(LOCAL_DELETED_KEY, JSON.stringify([...deletedIds, idStr]));
        }

        return true;
    } catch (e) {
        console.error('Error deleting testimonial:', e);
        return false;
    }
}
