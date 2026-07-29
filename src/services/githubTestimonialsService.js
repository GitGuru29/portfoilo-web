import { seedTestimonials } from '../data/testimonialsData';

const REPO_OWNER = 'GitGuru29';
const REPO_NAME = 'portfoilo-web';

const LOCAL_APPROVED_KEY = 'portfolio_approved_testimonials';
const LOCAL_PENDING_KEY = 'portfolio_pending_testimonials';
const LOCAL_DELETED_KEY = 'portfolio_deleted_testimonials';
const LOCAL_EDITED_KEY = 'portfolio_edited_testimonials';

const CLOUD_APP_NAME = 'siluna_portfolio_testimonials';
const PRIMARY_CLOUD_API = `https://api.restful-api.dev/objects`;

let cachedCloudId = typeof localStorage !== 'undefined' ? localStorage.getItem('portfolio_cloud_server_id') : null;

/**
 * Gets or discovers the global shared cloud object ID across all devices
 */
async function getOrDiscoverCloudId() {
    if (cachedCloudId) {
        return cachedCloudId;
    }

    try {
        const res = await fetch(PRIMARY_CLOUD_API, {
            headers: { Accept: 'application/json' },
        });

        if (res.ok) {
            const list = await res.json();
            if (Array.isArray(list)) {
                const existing = list.find((item) => item.name === CLOUD_APP_NAME);
                if (existing && existing.id) {
                    cachedCloudId = existing.id;
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('portfolio_cloud_server_id', cachedCloudId);
                    }
                    return cachedCloudId;
                }
            }
        }
    } catch (e) {
        console.warn('Cloud discovery notice:', e);
    }
    return null;
}

/**
 * Synchronizes cloud JSON payload into local storage cache
 */
function syncToLocal(data) {
    if (!data || typeof data !== 'object') return data;
    try {
        if (Array.isArray(data.pending)) {
            localStorage.setItem(LOCAL_PENDING_KEY, JSON.stringify(data.pending));
        }
        if (Array.isArray(data.approved)) {
            localStorage.setItem(LOCAL_APPROVED_KEY, JSON.stringify(data.approved));
        }
        if (Array.isArray(data.deleted)) {
            localStorage.setItem(LOCAL_DELETED_KEY, JSON.stringify(data.deleted));
        }
        if (data.edited && typeof data.edited === 'object') {
            localStorage.setItem(LOCAL_EDITED_KEY, JSON.stringify(data.edited));
        }
    } catch (e) {
        console.warn('Local cache sync notice:', e);
    }
    return data;
}

/**
 * Reads local storage data into a clean state object
 */
function getLocalState() {
    return {
        pending: JSON.parse(localStorage.getItem(LOCAL_PENDING_KEY) || '[]'),
        approved: JSON.parse(localStorage.getItem(LOCAL_APPROVED_KEY) || '[]'),
        deleted: JSON.parse(localStorage.getItem(LOCAL_DELETED_KEY) || '[]'),
        edited: JSON.parse(localStorage.getItem(LOCAL_EDITED_KEY) || '{}'),
    };
}

/**
 * Fetches fresh recommendations state from the shared Cloud DB
 */
async function fetchCloudData() {
    try {
        let cloudId = await getOrDiscoverCloudId();

        if (cloudId) {
            const res = await fetch(`${PRIMARY_CLOUD_API}/${cloudId}`, {
                headers: { Accept: 'application/json' },
            });

            if (res.ok) {
                const json = await res.json();
                const payload = json.data || json;
                if (payload && typeof payload === 'object') {
                    console.log('[Cloud Sync] Fetched live data from Cloud ID:', cloudId);
                    return syncToLocal(payload);
                }
            } else if (res.status === 404) {
                cachedCloudId = null;
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem('portfolio_cloud_server_id');
                }
            }
        }

        // Initialize new cloud object if none discovered
        const localState = getLocalState();
        const initRes = await fetch(PRIMARY_CLOUD_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                name: CLOUD_APP_NAME,
                data: localState,
            }),
        });

        if (initRes.ok) {
            const initJson = await initRes.json();
            if (initJson && initJson.id) {
                cachedCloudId = initJson.id;
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('portfolio_cloud_server_id', cachedCloudId);
                }
                console.log('[Cloud Sync] Initialized new Cloud DB ID:', cachedCloudId);
                if (initJson.data) {
                    return syncToLocal(initJson.data);
                }
            }
        }
    } catch (e) {
        console.warn('Cloud read notice (using local fallback):', e);
    }
    return getLocalState();
}

/**
 * Saves updated recommendations state to the shared Cloud DB and local storage
 */
async function saveCloudData(data) {
    // 1. Immediately cache to localStorage
    syncToLocal(data);

    // 2. Persist to shared Cloud DB globally
    try {
        let cloudId = await getOrDiscoverCloudId();

        const payload = {
            name: CLOUD_APP_NAME,
            data: {
                pending: data.pending || [],
                approved: data.approved || [],
                deleted: data.deleted || [],
                edited: data.edited || {},
            },
        };

        if (cloudId) {
            const res = await fetch(`${PRIMARY_CLOUD_API}/${cloudId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                console.log('[Cloud Sync] Updated Cloud DB ID:', cloudId);
                return;
            }
        }

        // Create object if missing or PUT failed
        const initRes = await fetch(PRIMARY_CLOUD_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (initRes.ok) {
            const initJson = await initRes.json();
            if (initJson && initJson.id) {
                cachedCloudId = initJson.id;
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('portfolio_cloud_server_id', cachedCloudId);
                }
                console.log('[Cloud Sync] Created new Cloud DB ID:', cachedCloudId);
            }
        }
    } catch (e) {
        console.warn('Cloud save notice:', e);
    }
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
    await fetchCloudData();

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

    // Load locally/cloud approved items
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
 * Fetches PENDING testimonials for the Admin Dashboard (synced globally across all devices).
 */
export async function fetchPendingTestimonials() {
    await fetchCloudData();

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
 * Submits a new recommendation — pushes globally to Cloud DB so any admin device can approve it.
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

    // 1. Fetch fresh cloud state
    const currentCloud = (await fetchCloudData()) || getLocalState();

    const updatedPending = [payload, ...(currentCloud.pending || []).filter((item) => String(item.id) !== payload.id)];
    const newCloudState = {
        ...currentCloud,
        pending: updatedPending,
    };

    // 2. Save globally to Cloud DB
    await saveCloudData(newCloudState);
    return payload;
}

/**
 * ADMIN ACTION: Approves a pending recommendation by ID globally across all devices.
 */
export async function approveTestimonial(id) {
    if (!id) return false;
    const idStr = String(id);

    const currentCloud = (await fetchCloudData()) || getLocalState();

    const pendingList = currentCloud.pending || [];
    const target = pendingList.find((item) => String(item.id) === idStr);
    if (!target) return false;

    const updatedPending = pendingList.filter((item) => String(item.id) !== idStr);

    const editedMap = currentCloud.edited || {};
    const finalTarget = editedMap[idStr]
        ? { ...target, ...editedMap[idStr], approved: true }
        : { ...target, approved: true };

    const approvedList = currentCloud.approved || [];
    const cleanApproved = approvedList.filter((item) => String(item.id) !== idStr);
    const updatedApproved = [finalTarget, ...cleanApproved];

    const newCloudState = {
        ...currentCloud,
        pending: updatedPending,
        approved: updatedApproved,
    };

    await saveCloudData(newCloudState);
    return true;
}

/**
 * ADMIN ACTION: Updates an existing recommendation's data globally across all devices.
 */
export async function updateTestimonial(updatedData) {
    if (!updatedData || !updatedData.id) return false;
    const idStr = String(updatedData.id);

    const currentCloud = (await fetchCloudData()) || getLocalState();

    const editedMap = currentCloud.edited || {};
    editedMap[idStr] = updatedData;

    const updatedPending = (currentCloud.pending || []).map((item) =>
        String(item.id) === idStr ? { ...item, ...updatedData } : item
    );

    const updatedApproved = (currentCloud.approved || []).map((item) =>
        String(item.id) === idStr ? { ...item, ...updatedData } : item
    );

    const newCloudState = {
        ...currentCloud,
        pending: updatedPending,
        approved: updatedApproved,
        edited: editedMap,
    };

    await saveCloudData(newCloudState);
    return true;
}

/**
 * ADMIN ACTION: Permanently deletes any recommendation by ID globally across all devices.
 */
export async function deleteTestimonial(id) {
    if (!id) return false;
    const idStr = String(id);

    const currentCloud = (await fetchCloudData()) || getLocalState();

    const updatedPending = (currentCloud.pending || []).filter((item) => String(item.id) !== idStr);
    const updatedApproved = (currentCloud.approved || []).filter((item) => String(item.id) !== idStr);

    const editedMap = currentCloud.edited || {};
    if (editedMap[idStr]) {
        delete editedMap[idStr];
    }

    const deletedIds = (currentCloud.deleted || []).map(String);
    if (!deletedIds.includes(idStr)) {
        deletedIds.push(idStr);
    }

    const newCloudState = {
        pending: updatedPending,
        approved: updatedApproved,
        deleted: deletedIds,
        edited: editedMap,
    };

    await saveCloudData(newCloudState);
    return true;
}
