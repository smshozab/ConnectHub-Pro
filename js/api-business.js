/**
 * Business API Integration
 * Handles fetching and displaying businesses from backend
 */

const BusinessAPI = {
    baseURL: 'http://localhost:3000/api',

    /**
     * Fetch businesses from backend
     */
    async getBusinesses(filters = {}) {
        try {
            const params = new URLSearchParams();
            
            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.rating) params.append('rating', filters.rating);
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.offset) params.append('offset', filters.offset);

            const response = await fetch(`${this.baseURL}/businesses?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch businesses');
            }
        } catch (error) {
            console.error('Get businesses error:', error);
            Utils.showNotification('Failed to load businesses', 'error');
            return { businesses: [], pagination: { total: 0, hasMore: false } };
        }
    },

    /**
     * Get single business by ID
     */
    async getBusiness(businessId) {
        try {
            const response = await fetch(`${this.baseURL}/businesses/${businessId}`);
            const data = await response.json();

            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Business not found');
            }
        } catch (error) {
            console.error('Get business error:', error);
            Utils.showNotification('Failed to load business', 'error');
            return null;
        }
    },

    /**
     * Add review to business
     */
    async addReview(businessId, rating, reviewText) {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                Utils.showNotification('Please log in to leave a review', 'warning');
                return { success: false };
            }

            const response = await fetch(`${this.baseURL}/businesses/${businessId}/reviews`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating, reviewText })
            });

            const data = await response.json();

            if (data.success) {
                Utils.showNotification('Review added successfully!', 'success');
                return { success: true };
            } else {
                Utils.showNotification(data.message || 'Failed to add review', 'error');
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Add review error:', error);
            Utils.showNotification('Failed to add review', 'error');
            return { success: false };
        }
    },

    /**
     * Get business categories
     */
    async getCategories() {
        try {
            const response = await fetch(`${this.baseURL}/businesses/meta/categories`);
            const data = await response.json();

            if (data.success) {
                return data.data;
            } else {
                throw new Error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Get categories error:', error);
            return [];
        }
    },

    /**
     * Render business card HTML
     */
    renderBusinessCard(business) {
        const rating = business.avg_rating || business.rating || 0;
        const reviewCount = business.review_count || 0;
        
        return `
            <div class="card hover:shadow-custom-lg transition-all duration-300 group business-card" 
                 data-category="${business.category || ''}" 
                 data-rating="${rating}">
                <div class="relative mb-4">
                    <div class="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                        <img src="${business.cover_image_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2940'}" 
                             alt="${business.business_name}" 
                             class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                             onerror="this.src='https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2940'">
                    </div>
                    ${business.is_featured ? `
                        <div class="absolute bottom-3 left-3 bg-success text-white px-2 py-1 rounded-full text-xs font-medium">
                            Verified
                        </div>
                    ` : ''}
                </div>
                
                <div class="flex items-start justify-between mb-3">
                    <h3 class="text-xl font-semibold text-primary group-hover:text-primary-600 transition-custom">
                        ${business.business_name}
                    </h3>
                    <div class="flex items-center text-warning">
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span class="ml-1 text-sm font-medium">${rating.toFixed(1)}</span>
                        ${reviewCount > 0 ? `<span class="ml-1 text-xs text-text-secondary">(${reviewCount})</span>` : ''}
                    </div>
                </div>
                
                <p class="text-text-secondary mb-4 line-clamp-3">${business.description || ''}</p>
                
                ${business.address ? `
                    <div class="flex items-center text-sm text-text-secondary mb-4">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        ${business.address}
                    </div>
                ` : ''}
                
                <div class="flex flex-wrap gap-2 mb-4">
                    <span class="px-3 py-1 bg-accent-100 text-accent-600 rounded-full text-sm font-medium">
                        ${business.category || 'General'}
                    </span>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center text-sm text-text-secondary">
                        <svg class="w-4 h-4 mr-1 text-success" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                        </svg>
                        Active
                    </div>
                    <a href="member_profile_pages.html?id=${business.id}" 
                       class="text-primary font-semibold hover:text-primary-600 transition-custom">
                        View Profile
                    </a>
                </div>
            </div>
        `;
    },

    /**
     * Load and render businesses on page
     */
    async loadBusinesses(containerId = 'business-grid', filters = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Show loading state
        container.innerHTML = '<div class="col-span-full text-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div><p class="mt-4 text-text-secondary">Loading businesses...</p></div>';

        const data = await this.getBusinesses(filters);
        
        if (data.businesses.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <svg class="w-16 h-16 mx-auto mb-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    <h3 class="text-xl font-semibold text-primary mb-2">No businesses found</h3>
                    <p class="text-text-secondary">Try adjusting your search filters</p>
                </div>
            `;
            return;
        }

        // Render businesses
        container.innerHTML = data.businesses.map(business => this.renderBusinessCard(business)).join('');

        // Update results count
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = `Showing ${data.businesses.length} of ${data.pagination.total} businesses`;
        }

        return data;
    }
};

// Make globally available
window.BusinessAPI = BusinessAPI;

// Auto-load businesses if on business directory page
if (window.location.pathname.includes('business_directory')) {
    document.addEventListener('DOMContentLoaded', () => {
        BusinessAPI.loadBusinesses();
    });
}


