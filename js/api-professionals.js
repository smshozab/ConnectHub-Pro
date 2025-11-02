/**
 * Professionals API Integration
 * Handles fetching and displaying professional profiles from backend
 */

const ProfessionalsAPI = {
    baseURL: 'http://localhost:3000/api',

    /**
     * Fetch professionals from backend
     */
    async getProfessionals(filters = {}) {
        try {
            const params = new URLSearchParams();
            
            if (filters.search) params.append('search', filters.search);
            if (filters.skills) params.append('skills', filters.skills);
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.offset) params.append('offset', filters.offset);

            const response = await fetch(`${this.baseURL}/professionals?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch professionals');
            }
        } catch (error) {
            console.error('Get professionals error:', error);
            Utils.showNotification('Failed to load professionals', 'error');
            return { professionals: [], pagination: { total: 0, hasMore: false } };
        }
    },

    /**
     * Render professional card HTML
     */
    renderProfessionalCard(professional) {
        const skills = Array.isArray(professional.skills) ? professional.skills : 
                      (professional.skills ? JSON.parse(professional.skills) : []);
        
        return `
            <div class="card text-center hover:shadow-custom-lg transition-all duration-300 group">
                <div class="relative mb-4">
                    <img src="${professional.profile_image_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(professional.first_name + '+' + professional.last_name)}" 
                         alt="${professional.first_name} ${professional.last_name}" 
                         class="w-20 h-20 rounded-full mx-auto object-cover border-4 border-primary-100 group-hover:border-primary-200 transition-colors">
                    <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-white"></div>
                </div>
                <h3 class="text-lg font-semibold text-primary mb-1">
                    ${professional.first_name} ${professional.last_name}
                </h3>
                <p class="text-accent font-medium mb-2">${professional.title || 'Professional'}</p>
                ${professional.company ? `<p class="text-sm text-text-secondary mb-2">${professional.company}</p>` : ''}
                <p class="text-sm text-text-secondary mb-4 line-clamp-2">${professional.bio || ''}</p>
                <div class="flex flex-wrap gap-1 justify-center mb-4">
                    ${skills.slice(0, 3).map(skill => 
                        `<span class="px-2 py-1 bg-primary-100 text-primary text-xs rounded">${skill}</span>`
                    ).join('')}
                    ${skills.length > 3 ? `<span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">+${skills.length - 3}</span>` : ''}
                </div>
                ${professional.hourly_rate ? `
                    <p class="text-sm text-success font-semibold mb-4">$${professional.hourly_rate}/hr</p>
                ` : ''}
                <a href="member_profile_pages.html?id=${professional.id}&type=professional" 
                   class="text-primary font-semibold hover:text-primary-600 transition-custom">
                    View Profile
                </a>
            </div>
        `;
    },

    /**
     * Load and render professionals on page
     */
    async loadProfessionals(containerId = 'professionals-grid', filters = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Show loading state
        container.innerHTML = '<div class="col-span-full text-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div><p class="mt-4 text-text-secondary">Loading professionals...</p></div>';

        const data = await this.getProfessionals(filters);
        
        if (data.professionals && data.professionals.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <svg class="w-16 h-16 mx-auto mb-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <h3 class="text-xl font-semibold text-primary mb-2">No professionals found</h3>
                    <p class="text-text-secondary">Try adjusting your search filters</p>
                </div>
            `;
            return;
        }

        // Render professionals
        container.innerHTML = data.professionals.map(professional => this.renderProfessionalCard(professional)).join('');

        return data;
    }
};

// Make globally available
window.ProfessionalsAPI = ProfessionalsAPI;

