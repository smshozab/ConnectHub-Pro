/**
 * Business Directory Search and Filter Enhancement
 * Enhances the existing search functionality with better UX
 */

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Search Functionality
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const businessCards = document.querySelectorAll('.business-card');
    const resultsCount = document.getElementById('results-count');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Search state
    let searchState = {
        query: '',
        category: '',
        filters: {
            rating: false,
            new: false,
            verified: false
        }
    };
    
    // Loading indicator
    function showSearchLoading() {
        const searchContainer = searchInput.parentElement;
        searchContainer.classList.add('opacity-75');
        searchInput.style.cursor = 'wait';
    }
    
    function hideSearchLoading() {
        const searchContainer = searchInput.parentElement;
        searchContainer.classList.remove('opacity-75');
        searchInput.style.cursor = 'text';
    }
    
    // Enhanced search function with highlighting
    function performSearch() {
        showSearchLoading();
        
        setTimeout(() => {
            let visibleCount = 0;
            const query = searchState.query.toLowerCase();
            
            businessCards.forEach(card => {
                let shouldShow = true;
                
                // Reset highlighting
                const textElements = card.querySelectorAll('h3, p, .text-text-secondary');
                textElements.forEach(el => {
                    if (el.dataset.originalText) {
                        el.innerHTML = el.dataset.originalText;
                    } else {
                        el.dataset.originalText = el.innerHTML;
                    }
                });
                
                // Search filter
                if (query) {
                    const searchableText = card.textContent.toLowerCase();
                    if (!searchableText.includes(query)) {
                        shouldShow = false;
                    } else {
                        // Highlight matching text
                        textElements.forEach(el => {
                            const text = el.dataset.originalText || el.innerHTML;
                            const highlightedText = text.replace(
                                new RegExp(`(${escapeRegExp(searchState.query)})`, 'gi'),
                                '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
                            );
                            el.innerHTML = highlightedText;
                        });
                    }
                }
                
                // Category filter
                if (searchState.category && card.dataset.category !== searchState.category) {
                    shouldShow = false;
                }
                
                // Rating filter
                if (searchState.filters.rating) {
                    const rating = parseFloat(card.dataset.rating || '0');
                    if (rating < 4.5) {
                        shouldShow = false;
                    }
                }
                
                // New business filter (assuming new businesses are marked somehow)
                if (searchState.filters.new) {
                    if (!card.classList.contains('new-business')) {
                        shouldShow = false;
                    }
                }
                
                // Verified filter
                if (searchState.filters.verified) {
                    if (!card.querySelector('.verified-badge')) {
                        shouldShow = false;
                    }
                }
                
                // Animate show/hide
                if (shouldShow) {
                    if (card.style.display === 'none') {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.3s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    }
                    visibleCount++;
                } else {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update results count with animation
            if (resultsCount) {
                resultsCount.style.transition = 'all 0.3s ease';
                resultsCount.style.opacity = '0';
                setTimeout(() => {
                    resultsCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'business' : 'businesses'}`;
                    if (query) {
                        resultsCount.textContent += ` for "${searchState.query}"`;
                    }
                    resultsCount.style.opacity = '1';
                }, 150);
            }
            
            // Show no results message
            showNoResultsMessage(visibleCount === 0);
            
            hideSearchLoading();
        }, 200); // Small delay for better UX
    }
    
    // Show/hide no results message
    function showNoResultsMessage(show) {
        let noResultsDiv = document.getElementById('no-results');
        if (!noResultsDiv && show) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.id = 'no-results';
            noResultsDiv.className = 'col-span-full text-center py-12';
            noResultsDiv.innerHTML = `
                <div class="text-text-secondary">
                    <svg class="w-16 h-16 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <h3 class="text-xl font-semibold mb-2">No businesses found</h3>
                    <p>Try adjusting your search criteria or browse all businesses.</p>
                    <button onclick="clearAllFilters()" class="btn-primary mt-4">Clear All Filters</button>
                </div>
            `;
            const businessGrid = document.querySelector('.grid');
            if (businessGrid) {
                businessGrid.appendChild(noResultsDiv);
            }
        } else if (noResultsDiv && !show) {
            noResultsDiv.remove();
        }
    }
    
    // Debounced search
    const debouncedSearch = Utils.debounce(performSearch, 300);
    
    // Search input handler
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchState.query = e.target.value;
            debouncedSearch();
        });
        
        // Clear search button
        const clearSearch = document.createElement('button');
        clearSearch.innerHTML = '×';
        clearSearch.className = 'absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary w-6 h-6 rounded-full hover:bg-surface transition-all';
        clearSearch.style.display = 'none';
        searchInput.parentElement.appendChild(clearSearch);
        
        clearSearch.addEventListener('click', function() {
            searchInput.value = '';
            searchState.query = '';
            this.style.display = 'none';
            performSearch();
            searchInput.focus();
        });
        
        searchInput.addEventListener('input', function() {
            clearSearch.style.display = this.value ? 'flex' : 'none';
        });
    }
    
    // Category filter handler
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            searchState.category = this.value;
            performSearch();
        });
    }
    
    // Filter buttons handler
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            if (filter && searchState.filters.hasOwnProperty(filter)) {
                searchState.filters[filter] = !searchState.filters[filter];
                
                // Update button appearance
                if (searchState.filters[filter]) {
                    this.classList.add('bg-primary', 'text-white');
                    this.classList.remove('bg-primary-100', 'text-primary', 'bg-accent-100', 'text-accent', 'bg-secondary-100', 'text-secondary');
                } else {
                    this.classList.remove('bg-primary', 'text-white');
                    // Restore original colors based on filter type
                    if (filter === 'rating') {
                        this.classList.add('bg-primary-100', 'text-primary');
                    } else if (filter === 'new') {
                        this.classList.add('bg-accent-100', 'text-accent');
                    } else if (filter === 'verified') {
                        this.classList.add('bg-secondary-100', 'text-secondary');
                    }
                }
                
                performSearch();
            }
        });
    });
    
    // Clear all filters function (global)
    window.clearAllFilters = function() {
        searchState = {
            query: '',
            category: '',
            filters: {
                rating: false,
                new: false,
                verified: false
            }
        };
        
        // Reset UI
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        
        filterButtons.forEach(button => {
            button.classList.remove('bg-primary', 'text-white');
            const filter = button.dataset.filter;
            if (filter === 'rating') {
                button.classList.add('bg-primary-100', 'text-primary');
            } else if (filter === 'new') {
                button.classList.add('bg-accent-100', 'text-accent');
            } else if (filter === 'verified') {
                button.classList.add('bg-secondary-100', 'text-secondary');
            }
        });
        
        // Hide clear search button
        const clearSearch = searchInput?.parentElement.querySelector('button');
        if (clearSearch) clearSearch.style.display = 'none';
        
        performSearch();
    };
    
    // Utility function to escape regex special characters
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // Escape to clear search
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            clearAllFilters();
        }
    });
    
    // Initialize with current state
    performSearch();
});
