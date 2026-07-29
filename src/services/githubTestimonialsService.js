import { seedTestimonials } from '../data/testimonialsData';

const REPO_OWNER = 'GitGuru29';
const REPO_NAME = 'portfoilo-web';

// User's GitHub Fine-Grained Personal Access Token (Set in Vercel Environment Variables)
const GITHUB_TOKEN = import.meta.env?.VITE_GITHUB_TOKEN || '';

const LOCAL_APPROVED_KEY = 'portfolio_approved_testimonials';
const LOCAL_PENDING_KEY = 'portfolio_pending_testimonials';
const LOCAL_DELETED_KEY = 'portfolio_deleted_testimonials';
const LOCAL_EDITED_KEY = 'portfolio_edited_testimonials';

/**
 * Standard headers for GitHub API requests
 */
function getGitHubHeaders() {
    const headers = {
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
    };
    if (GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }
    return headers;
}

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
 * Helper to get edited recommendations map
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
                id: `gh-${issue.number}`,
                issueNumber: issue.number,
                name: data.name || issue.user?.login || 'Anonymous Referee',
                role: data.role || 'Verified Referee',
                company: data.company || '',
                avatar: data.avatar || issue.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
                relationship: data.relationship || 'Client / Peer',
                rating: Number(data.rating) || 5,
                text: data.text || issue.body,
                date: issue.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
                linkedin: data.linkedin || '',
                approved: issue.labels?.some((l) => l.name === 'approved') || false,
            };
        }

        return {
            id: `gh-${issue.number}`,
            issueNumber: issue.number,
            name: issue.title.replace(/^\[Recommendation\]\s*/i, '') || issue.user?.login,
            role: 'Verified Referee',
            company: '',
            avatar: issue.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            relationship: 'Client',
            rating: 5,
            text: issue.body,
            date: issue.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            linkedin: '',
            approved: issue.labels?.some((l) => l.name === 'approved') || false,
        };
    } catch {
        return null;
    }
}

/**
 * Fetches ONLY APPROVED testimonials for the public website from GitHub Issues + Seed.
 */
export async function fetchApprovedTestimonials() {
    const deletedIds = getDeletedIds();

    let liveApproved = [];
    try {
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=approved&state=all&per_page=100`,
            { headers: getGitHubHeaders(), cache: 'no-store' }
        );

        if (response.ok) {
            const issues = await response.json();
            liveApproved = issues.map(parseIssueToTestimonial).filter(Boolean);
        }
    } catch (err) {
        console.warn('Error fetching approved testimonials from GitHub:', err);
    }

    // Load local approved items
    let localApproved = [];
    try {
        const stored = localStorage.getItem(LOCAL_APPROVED_KEY);
        if (stored) {
            localApproved = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Error reading local approved testimonials:', e);
    }

    // Combine & deduplicate by string ID
    const allCandidates = [...localApproved, ...liveApproved, ...seedTestimonials];
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
 * Fetches PENDING testimonials for the Admin Dashboard from GitHub Issues + local cache.
 */
export async function fetchPendingTestimonials() {
    const deletedIds = getDeletedIds();

    let githubPending = [];
    try {
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=recommendation-pending&state=open&per_page=100`,
            { headers: getGitHubHeaders(), cache: 'no-store' }
        );

        if (response.ok) {
            const issues = await response.json();
            githubPending = issues.map(parseIssueToTestimonial).filter(Boolean);
        }
    } catch (err) {
        console.warn('Error fetching pending testimonials from GitHub:', err);
    }

    // Load local pending items
    let localPending = [];
    try {
        const stored = localStorage.getItem(LOCAL_PENDING_KEY);
        if (stored) {
            localPending = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Error reading local pending testimonials:', e);
    }

    // Deduplicate by string ID
    const allPending = [...githubPending, ...localPending];
    const uniqueMap = new Map();
    allPending.forEach((item) => {
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
 * Submits a new recommendation — posts an Issue to GitHub repository using GitHub API.
 */
export async function submitDirectRecommendation(data) {
    const payload = {
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

    let createdItem = {
        id: `rec-${Date.now()}`,
        ...payload,
    };

    // Dispatch to GitHub Issues API
    try {
        const bodyContent = `### Recommendation Submission\n\n\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\`\n\n**Recommendation Text:**\n> ${data.text}`;
        
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
            method: 'POST',
            headers: getGitHubHeaders(),
            body: JSON.stringify({
                title: `[Recommendation] ${data.name} - ${data.role || 'Client'}`,
                body: bodyContent,
                labels: ['recommendation-pending'],
            }),
        });

        if (response.ok) {
            const issueData = await response.json();
            createdItem = {
                ...payload,
                id: `gh-${issueData.number}`,
                issueNumber: issueData.number,
            };
        } else {
            const errorText = await response.text();
            alert(`GitHub API Error (Submission): ${response.status}\nMake sure your token is added to Vercel for PRODUCTION environments and redeployed!\nDetails: ${errorText}`);
            console.error("Submission error:", errorText);
        }
    } catch (err) {
        alert(`Network Error during submission: ${err.message}`);
        console.warn('GitHub issue creation warning:', err);
    }

    // Cache locally
    try {
        const pending = JSON.parse(localStorage.getItem(LOCAL_PENDING_KEY) || '[]');
        const updated = [createdItem, ...pending.filter((i) => String(i.id) !== String(createdItem.id))];
        localStorage.setItem(LOCAL_PENDING_KEY, JSON.stringify(updated));
    } catch (e) {
        console.warn('Error caching pending item locally:', e);
    }

    return createdItem;
}

/**
 * ADMIN ACTION: Approves a pending recommendation by ID via GitHub Issues API.
 */
export async function approveTestimonial(id) {
    if (!id) return false;
    const idStr = String(id);

    // If it's a GitHub issue, update labels via GitHub API
    if (idStr.startsWith('gh-')) {
        const issueNumber = idStr.replace(/^gh-/, '');
        try {
            const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}`, {
                method: 'PATCH',
                headers: getGitHubHeaders(),
                body: JSON.stringify({
                    labels: ['approved'],
                    state: 'open',
                }),
            });
            if (!response.ok) {
                alert("GitHub API Error: Could not approve. Make sure VITE_GITHUB_TOKEN is set in Vercel and you have redeployed!");
                console.error("GitHub API Error:", await response.text());
                return false;
            }
        } catch (err) {
            console.warn('Error updating GitHub issue label to approved:', err);
            return false;
        }
    }

    // Sync local storage queues
    try {
        const pending = JSON.parse(localStorage.getItem(LOCAL_PENDING_KEY) || '[]');
        const target = pending.find((item) => String(item.id) === idStr) || { id: idStr, approved: true };

        const updatedPending = pending.filter((item) => String(item.id) !== idStr);
        localStorage.setItem(LOCAL_PENDING_KEY, JSON.stringify(updatedPending));

        const editedMap = getEditedOverrides();
        const finalTarget = editedMap[idStr]
            ? { ...target, ...editedMap[idStr], approved: true }
            : { ...target, approved: true };

        const approved = JSON.parse(localStorage.getItem(LOCAL_APPROVED_KEY) || '[]');
        const cleanApproved = approved.filter((item) => String(item.id) !== idStr);
        localStorage.setItem(LOCAL_APPROVED_KEY, JSON.stringify([finalTarget, ...cleanApproved]));

        return true;
    } catch (e) {
        console.error('Error approving testimonial locally:', e);
        return false;
    }
}

/**
 * ADMIN ACTION: Updates an existing recommendation's data on GitHub Issues API and locally.
 */
export async function updateTestimonial(updatedData) {
    if (!updatedData || !updatedData.id) return false;
    const idStr = String(updatedData.id);

    // If it's a GitHub issue, update issue body via GitHub API
    if (idStr.startsWith('gh-')) {
        const issueNumber = idStr.replace(/^gh-/, '');
        try {
            const bodyContent = `### Recommendation Submission\n\n\`\`\`json\n${JSON.stringify(updatedData, null, 2)}\n\`\`\`\n\n**Recommendation Text:**\n> ${updatedData.text}`;
            await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}`, {
                method: 'PATCH',
                headers: getGitHubHeaders(),
                body: JSON.stringify({
                    title: `[Recommendation] ${updatedData.name} - ${updatedData.role || 'Client'}`,
                    body: bodyContent,
                }),
            });
        } catch (err) {
            console.warn('Error updating GitHub issue body:', err);
        }
    }

    // Save in edited overrides & local storage
    try {
        const editedMap = getEditedOverrides();
        editedMap[idStr] = updatedData;
        localStorage.setItem(LOCAL_EDITED_KEY, JSON.stringify(editedMap));

        const pending = JSON.parse(localStorage.getItem(LOCAL_PENDING_KEY) || '[]');
        const updatedPending = pending.map((item) => (String(item.id) === idStr ? { ...item, ...updatedData } : item));
        localStorage.setItem(LOCAL_PENDING_KEY, JSON.stringify(updatedPending));

        const approved = JSON.parse(localStorage.getItem(LOCAL_APPROVED_KEY) || '[]');
        const updatedApproved = approved.map((item) => (String(item.id) === idStr ? { ...item, ...updatedData } : item));
        localStorage.setItem(LOCAL_APPROVED_KEY, JSON.stringify(updatedApproved));

        return true;
    } catch (e) {
        console.error('Error updating testimonial:', e);
        return false;
    }
}

/**
 * ADMIN ACTION: Permanently deletes any recommendation by ID via GitHub Issues API & blacklist.
 */
export async function deleteTestimonial(id) {
    if (!id) return false;
    const idStr = String(id);

    // If it's a GitHub issue, close the issue and label as rejected
    if (idStr.startsWith('gh-')) {
        const issueNumber = idStr.replace(/^gh-/, '');
        try {
            await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}`, {
                method: 'PATCH',
                headers: getGitHubHeaders(),
                body: JSON.stringify({
                    state: 'closed',
                    labels: ['rejected'],
                }),
            });
        } catch (err) {
            console.warn('Error closing GitHub issue:', err);
        }
    }

    try {
        const pending = JSON.parse(localStorage.getItem(LOCAL_PENDING_KEY) || '[]');
        const updatedPending = pending.filter((item) => String(item.id) !== idStr);
        localStorage.setItem(LOCAL_PENDING_KEY, JSON.stringify(updatedPending));

        const approved = JSON.parse(localStorage.getItem(LOCAL_APPROVED_KEY) || '[]');
        const updatedApproved = approved.filter((item) => String(item.id) !== idStr);
        localStorage.setItem(LOCAL_APPROVED_KEY, JSON.stringify(updatedApproved));

        const editedMap = getEditedOverrides();
        if (editedMap[idStr]) {
            delete editedMap[idStr];
            localStorage.setItem(LOCAL_EDITED_KEY, JSON.stringify(editedMap));
        }

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
