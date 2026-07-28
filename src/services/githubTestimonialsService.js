import { seedTestimonials } from '../data/testimonialsData';

const REPO_OWNER = 'GitGuru29';
const REPO_NAME = 'portfoilo-web';

/**
 * Parses issue body into a recommendation object if formatted,
 * or returns a clean structured object from issue content.
 */
function parseIssueToTestimonial(issue) {
    try {
        // Try parsing JSON block inside issue body if present
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

        // Fallback: parse markdown lines
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
 * Fetches approved testimonials from GitHub Issues tagged with `approved`.
 * Falls back seamlessly to seedTestimonials if API is offline or empty.
 */
export async function fetchApprovedTestimonials() {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=approved&state=all&per_page=50`,
            {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        if (!response.ok) {
            console.warn('GitHub API returned non-200 status, using seed testimonials');
            return seedTestimonials;
        }

        const issues = await response.json();
        const liveTestimonials = issues
            .map(parseIssueToTestimonial)
            .filter(Boolean);

        return liveTestimonials.length > 0 ? [...liveTestimonials, ...seedTestimonials] : seedTestimonials;
    } catch (err) {
        console.warn('Error fetching testimonials from GitHub:', err);
        return seedTestimonials;
    }
}

/**
 * Creates a pre-filled GitHub Issue URL for client submission.
 * Opens GitHub issue form directly with pre-populated fields.
 */
export function getGitHubIssueSubmitUrl(data) {
    const title = encodeURIComponent(`[Recommendation] ${data.name} - ${data.role || 'Client'}`);
    const bodyContent = `### Client Recommendation Submission

\`\`\`json
{
  "name": ${JSON.stringify(data.name)},
  "role": ${JSON.stringify(data.role)},
  "company": ${JSON.stringify(data.company)},
  "relationship": ${JSON.stringify(data.relationship)},
  "rating": ${data.rating},
  "linkedin": ${JSON.stringify(data.linkedin)},
  "avatar": ${JSON.stringify(data.avatar)},
  "text": ${JSON.stringify(data.text)}
}
\`\`\`

**Recommendation Text:**
> ${data.text}`;

    const body = encodeURIComponent(bodyContent);
    const labels = encodeURIComponent('recommendation-pending');

    return `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues/new?title=${title}&body=${body}&labels=${labels}`;
}
