import { createClient } from '@supabase/supabase-js';
import fs from 'fs-extra';
import path from 'path';

// ==========================================================
// CONFIGURATION
// ==========================================================

const SUPABASE_URL = "https://xvjdhxtyaktagrevixjt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2amRoeHR5YWt0YWdyZXZpeGp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ5NDM2OCwiZXhwIjoyMDg3MDcwMzY4fQ.4lnn65a5V1RDe-CtqaWMEr1r0Z0WKId3frzbjExNBN0";

// Directory where HTML files will be saved
const OUTPUT_DIR = './compare'; 

// Your Website Domain (WITHOUT trailing slash)
const BASE_URL = 'https://maaney.store/compare';

const ITEMS_PER_PAGE = 10;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================================
// HELPER FUNCTIONS
// ==========================================================

function extractPrice(priceStr) {
    if (!priceStr) return 0;
    if (typeof priceStr === 'number') return priceStr;
    const match = String(priceStr).replace(/,/g, '').match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttr(text) {
    if (!text) return '';
    return String(text).replace(/"/g, '&quot;');
}

function getSourceStyle(source) {
    if (!source) return { bg: '#F3F4F6', color: '#374151', img: '', name: 'Store' };
    const s = source.toLowerCase();
    const styles = {
        'amazon': { bg: '#232F3E', color: '#FFFFFF', img: 'https://maaney.store/brands/amazon.png', name: 'Amazon' },
        'flipkart': { bg: '#ffffff', color: '#FFFFFF', img: 'https://maaney.store/brands/flipkart.png', name: 'Flipkart' },
        'reliance': { bg: '#FFFFFF', color: '#333333', img: 'https://maaney.store/brands/reliance.png', name: 'Reliance' },
        'croma': { bg: '#1976D2', color: '#FFFFFF', img: 'https://maaney.store/brands/croma.png', name: 'Croma' },
    };
    const key = Object.keys(styles).find(k => s.includes(k));
    return key ? styles[key] : { bg: '#F3F4F6', color: '#374151', img: '', name: source };
}

function generateStars(rating) {
    if (!rating) return '';
    const fullStars = Math.floor(rating);
    let html = '';
    for (let i = 0; i < 5; i++) {
        const starClass = i < fullStars ? 'star-filled' : 'text-gray-300';
        html += `<svg class="w-3 h-3 ${starClass} inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    }
    return html;
}

function findBestDeal(products) {
    if (products.length === 0) return null;
    let best = null;
    let lowestPrice = Infinity;
    products.forEach(p => {
        const price = extractPrice(p.price);
        if (price > 0 && price < lowestPrice) {
            lowestPrice = price;
            best = p;
        }
    });
    return best;
}

// ==========================================================
// SITEMAP FUNCTIONS
// ==========================================================

const SITEMAP_FILE = path.join(OUTPUT_DIR, 'products.xml');

async function updateSitemap(newUrls) {
    console.log(`🗺️ Updating Sitemap...`);
    
    await fs.ensureDir(OUTPUT_DIR);

    let existingUrls = [];
    if (await fs.pathExists(SITEMAP_FILE)) {
        const content = await fs.readFile(SITEMAP_FILE, 'utf-8');
        const matches = content.match(/<loc>(.*?)<\/loc>/g);
        if (matches) {
            existingUrls = matches.map(m => m.replace(/<\/?loc>/g, ''));
        }
    }

    const allUrlsSet = new Set([...existingUrls, ...newUrls]);
    const allUrls = Array.from(allUrlsSet);

    const date = new Date().toISOString();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    allUrls.forEach(url => {
        xml += `
   <url>
      <loc>${url}</loc>
      <lastmod>${date}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
   </url>`;
    });

    xml += `
</urlset>`;

    await fs.writeFile(SITEMAP_FILE, xml);
    console.log(`✅ Sitemap saved: ${SITEMAP_FILE}`);
}

// ==========================================================
// SEO & SCHEMA GENERATORS
// ==========================================================

function generateSchemaOrg(query, products, url) {
    const itemList = products.map((p, index) => {
        const price = extractPrice(p.price);
        return {
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Product",
                "name": p.title,
                "image": p.image,
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "INR",
                    "price": price,
                    "availability": "https://schema.org/InStock",
                    "seller": {
                        "@type": "Organization",
                        "name": p.source || "Retailer"
                    }
                }
            }
        };
    });

    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `${query} - Best Deals`,
        "description": `Compare ${query} prices and find the best deals.`,
        "numberOfItems": products.length,
        "itemListElement": itemList
    };
}

// ==========================================================
// HTML GENERATION COMPONENTS
// ==========================================================

function renderBrandLogo(sourceStyle) {
    if (!sourceStyle.img) return '';
    return `
        <div class="brand-logo-overlay" style="background-color: ${sourceStyle.bg};">
            <img src="${sourceStyle.img}" alt="${sourceStyle.name}"
                onerror="this.parentElement.innerHTML='<span class=\\'text-xs font-bold\\' style=\\'color:${sourceStyle.color}\\'>${sourceStyle.name}</span>'">
        </div>`;
}

function renderProductHTML(product, bestDeal) {
    const isBestDeal = bestDeal && product.id === bestDeal.id;
    const source = product.source || product.brand || 'Store';
    const sourceStyle = getSourceStyle(source);
    const safeLink = escapeAttr(product.link);
    const price = extractPrice(product.price).toLocaleString();

    // Desktop HTML
    const desktopHTML = `
        <div class="product-row hidden sm:flex items-center gap-4 animate-in">
            <div class="flex-shrink-0 relative">
                <div class="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                    <img src="${product.image || 'https://via.placeholder.com/80'}" alt="${escapeHtml(product.title)}" class="w-full h-full object-contain" loading="lazy" onerror="this.src='https://via.placeholder.com/80?text=No+Img'">
                </div>
                ${renderBrandLogo(sourceStyle)}
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-start gap-2 mb-1">
                    ${isBestDeal ? '<span class="best-deal text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">BEST DEAL</span>' : ''}
                </div>
                <h3 class="text-sm font-medium text-black leading-snug line-clamp-2 mb-1">${escapeHtml(product.title)}</h3>
                <div class="flex items-center gap-2 flex-wrap">
                    ${product.rating ? `<div class="flex items-center gap-1">${generateStars(product.rating)}<span class="text-xs text-gray-500">${product.rating}</span></div>` : ''}
                    ${product.rating_count ? `<span class="text-xs text-gray-400">(${product.rating_count.toLocaleString()} reviews)</span>` : ''}
                </div>
            </div>
            <div class="flex items-center gap-3 sm:flex-col sm:items-end flex-shrink-0 w-full sm:w-auto">
                <div class="text-right">
                    <p class="text-lg font-bold accent-text">₹${price}</p>
                </div>
                <button data-link="${safeLink}" class="btn-buy px-4 py-1.5 rounded-md text-xs font-medium ml-auto sm:ml-0">
                    <span>Buy</span>
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                </button>
            </div>
        </div>`;

    // Mobile HTML
    const mobileHTML = `
        <div class="mobile-card block sm:hidden animate-in">
            <div class="flex gap-3 mb-3">
                <div class="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 relative">
                    <img src="${product.image || 'https://via.placeholder.com/80'}" alt="${escapeHtml(product.title)}" class="w-full h-full object-contain" loading="lazy" onerror="this.src='https://via.placeholder.com/80?text=No+Img'">
                    ${renderBrandLogo(sourceStyle)}
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center">
                    <div class="mb-1">${isBestDeal ? '<span class="best-deal text-[9px] font-bold px-1.5 py-0.5 rounded">BEST DEAL</span>' : ''}</div>
                    <h3 class="text-sm font-medium text-black leading-snug line-clamp-2 mb-1">${escapeHtml(product.title)}</h3>
                    <div class="flex items-center gap-1 flex-wrap">
                        ${product.rating ? `<div class="flex items-center">${generateStars(product.rating)}</div>` : ''}
                        ${product.rating ? `<span class="text-xs text-gray-500">${product.rating}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between border-t border-gray-100 pt-3">
                <p class="text-lg font-bold accent-text">₹${price}</p>
                <button data-link="${safeLink}" class="btn-buy px-4 py-2 rounded-md text-xs font-medium">
                    <span>Buy Now</span>
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                </button>
            </div>
        </div>`;

    return desktopHTML + mobileHTML;
}

function renderPagination(currentPage, totalPages, baseFileName) {
    if (totalPages <= 1) return '';
    let pagesHtml = '';

    if (currentPage > 1) {
        const prevLink = currentPage === 2 ? `${baseFileName}.html` : `${baseFileName}-${currentPage - 1}.html`;
        pagesHtml += `<a href="./${prevLink}" class="pagination-btn">« Prev</a>`;
    } else {
        pagesHtml += `<span class="pagination-btn disabled">« Prev</span>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            pagesHtml += `<span class="pagination-btn active">${i}</span>`;
        } else {
            const link = i === 1 ? `${baseFileName}.html` : `${baseFileName}-${i}.html`;
            pagesHtml += `<a href="./${link}" class="pagination-btn">${i}</a>`;
        }
    }

    if (currentPage < totalPages) {
        const nextLink = `${baseFileName}-${currentPage + 1}.html`;
        pagesHtml += `<a href="./${nextLink}" class="pagination-btn">Next »</a>`;
    } else {
        pagesHtml += `<span class="pagination-btn disabled">Next »</span>`;
    }

    return `<div class="flex justify-center items-center gap-2 mt-8 mb-4 flex-wrap">${pagesHtml}</div>`;
}

function generateFullHTML(query, products, bestDeal, currentPage, totalPages, baseFileName, folderName) {
    const safeQuery = escapeHtml(query);
    const productsHTML = products.map(p => renderProductHTML(p, bestDeal)).join('');
    const paginationHTML = renderPagination(currentPage, totalPages, baseFileName);

    // --- SEO Configuration ---
    const pageUrl = `${BASE_URL}/${folderName}/${baseFileName}${currentPage > 1 ? `-${currentPage}` : ''}.html`;
    const pageTitle = currentPage > 1 ? `${safeQuery} - Page ${currentPage} - Best Deals` : `${safeQuery} - Best Price Comparison in India`;
    const seoTitle = `${pageTitle} | Maaney`;
    const seoDesc = `Compare ${safeQuery} prices across Amazon, Flipkart & more. Find the lowest price for ${safeQuery} on page ${currentPage}. Save money with Maaney.`;
    
    // Pick first product image for Social Preview (OG Image)
    const ogImage = products[0]?.image || 'https://maaney.store/og-default.png'; 

    // Generate JSON-LD Schema
    const schemaData = generateSchemaOrg(query, products, pageUrl);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>${seoTitle}</title>
    <meta name="title" content="${seoTitle}">
    <meta name="description" content="${seoDesc}">
    <meta name="keywords" content="${safeQuery} price, ${safeQuery} offers, buy ${safeQuery} online, ${safeQuery} best deal, compare ${safeQuery}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${pageUrl}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:title" content="${seoTitle}">
    <meta property="og:description" content="${seoDesc}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:site_name" content="Maaney Price Comparison">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${pageUrl}">
    <meta property="twitter:title" content="${seoTitle}">
    <meta property="twitter:description" content="${seoDesc}">
    <meta property="twitter:image" content="${ogImage}">

    <!-- Favicon & Fonts -->
    <link rel="icon" type="image/png" href="./favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- Stylesheets -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- JSON-LD Schema -->
    <script type="application/ld+json">
        ${JSON.stringify(schemaData)}
    </script>
    
    <style>
        :root {
            --bg: #F3F4F6; --fg: #0A0A0A; --muted: #6B7280; --accent: #F97316;
            --accent-light: #FFF7ED; --border: #E5E5E5; --card: #FFFFFF;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--fg); line-height: 1.5; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; }
        .accent-text { color: var(--accent); }
        .search-input { transition: all 0.2s ease; border: 1px solid var(--border); }
        .search-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1); }
        
        /* Desktop Styles */
        .product-row { transition: all 0.2s ease; border-bottom: 1px solid var(--border); background: var(--card); padding: 16px; }
        .product-row:hover { background: #FAFAFA; }

        /* Mobile Styles */
        .mobile-card { 
            background: var(--card); 
            border: 1px solid var(--border); 
            border-radius: 8px; 
            padding: 16px; 
            margin-bottom: 12px; 
            transition: all 0.2s ease; 
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .mobile-card:active { background: #f9fafb; transform: scale(0.99); }

        /* Buttons */
        .btn-buy { background: var(--accent); color: white; transition: all 0.2s ease; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 4px; text-decoration: none; }
        .btn-buy:hover { background: #EA580C; transform: translateY(-1px); }
        .btn-buy:active { transform: translateY(0); }
        .btn-buy:disabled { opacity: 0.7; cursor: wait; }
        .btn-search { background: var(--accent); color: white; transition: all 0.2s ease; }
        .btn-search:hover { background: #EA580C; }

        /* Brand Logo Overlay */
        .brand-logo-overlay { position: absolute; top: 0; left: 0; z-index: 10; padding: 4px 6px; border-bottom-right-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.2); }
        .brand-logo-overlay img { height: 12px; width: auto; object-fit: contain; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1)); }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fadeIn 0.3s ease forwards; }
        .best-deal { background: #059669; color: white; }
        .star-filled { color: #FBBF24; }

        /* Pagination Styles */
        .pagination-btn {
            padding: 8px 16px;
            border: 1px solid var(--border);
            background: white;
            color: #374151;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .pagination-btn:hover { background: #F9FAFB; border-color: #D1D5DB; text-decoration: none; }
        .pagination-btn.active { background: var(--accent); color: white; border-color: var(--accent); }
        .pagination-btn.disabled { opacity: 0.5; pointer-events: none; cursor: default; }
        
        .top-strip { background: #f44f08; color: #fff; font-size: 12px; padding: 6px 0; }
        
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
    </style>
     <!-- Scripts -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5811636573059605" crossorigin="anonymous"></script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-S60YQL9TZ2"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-S60YQL9TZ2');
  </script>
</head>
<body class="min-h-screen">
    <!-- TOP STRIP -->
    <div class="top-strip">
        <div class="container d-flex justify-content-between align-items-center">
            <div><i class="fas fa-tag me-2"></i> India's Best Price Comparison Engine</div>
            <div class="d-none d-md-block">
                <span class="me-3"><i class="fas fa-download me-1"></i> Download App</span>
                <span><i class="fas fa-headset me-1"></i> Support</span>
            </div>
        </div>
    </div>

    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <a href="/" class="flex items-center gap-2">
                    <img src="https://maaney.store/white_logo.png" alt="Maaney Logo" class="h-8 w-auto object-contain"/>
                </a>
            </div>
            <div class="text-xs text-gray-400" id="lastUpdate">Updated: ${new Date().toLocaleTimeString()}</div>
        </div>
    </header>

    <!-- Search Section -->
    <section class="border-b border-gray-100 bg-white">
        <div class="max-w-6xl mx-auto px-4 py-6">
            <form action="/" method="GET" class="flex flex-col sm:flex-row gap-3">
                <div class="relative flex-1">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input type="text" name="q" class="search-input w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-sm placeholder-gray-400" placeholder="Search products (e.g., Samsung, iPhone)" value="${safeQuery}">
                </div>
                <button type="submit" class="btn-search px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <span>Search</span>
                </button>
            </form>
        </div>
    </section>

    <!-- Results Section -->
    <main class="max-w-6xl mx-auto px-4 py-6">
        <div class="mb-3 px-1">
            <h1 class="text-xl font-bold text-black">Results for "<span class="accent-text">${safeQuery}</span>"</h1>
            <p class="text-xs text-gray-500 mt-0.5">Page ${currentPage} of ${totalPages}</p>
        </div>

        <!-- Products List -->
        <div id="productsList">
            ${productsHTML}
        </div>
        
        <!-- Pagination -->
        ${paginationHTML}
    </main>

    <footer class="border-t border-gray-100 mt-8 py-6 bg-white">
        <div class="max-w-6xl mx-auto px-4 text-center">
            <p class="text-xs text-gray-400">Prices may vary. Always verify on the store before purchasing.</p>
        </div>
    </footer>

    <!-- Client-side Script -->
    <script type="module">
        import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
        
        const AFFILIATE_API_URL = "https://ekaro-api.affiliaters.in/api/converter/public";
        const AFFILIATE_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTk5NTRmMTIxMjRjODNjMjY0NTI3NDMiLCJlYXJua2FybyI6IjQ3NjAyMzYiLCJpYXQiOjE3NzE2NTcwMTN9.Q-D3pAjob9pUOoDb5G7NOMa57Up79j2ZKz3ZYZXeANw";

        async function convertLink(originalUrl) {
            try {
                const response = await fetch(AFFILIATE_API_URL, {
                    method: 'POST',
                    headers: { 'Authorization': AFFILIATE_TOKEN, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ deal: 'Buy now ' + originalUrl, convert_option: "convert_only" })
                });
                const result = await response.json();
                if (result.success && result.data) {
                    let link = result.data;
                    if (link.startsWith("Buy now ")) link = link.substring(8);
                    if (link.startsWith('http://') || link.startsWith('https://')) return link;
                }
                return originalUrl;
            } catch (error) { return originalUrl; }
        }

        async function handleBuyClick(event) {
            const button = event.currentTarget;
            const originalUrl = button.dataset.link;
            if (!originalUrl) return;
            const win = window.open('', '_self');
            if (win) {
                win.document.write('<html><head><title>Redirecting...</title><style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;background:#f8fafc;color:#334155;}</style></head><body><div>Generating your deal link...</div></body></html>');
            }
            button.disabled = true;
            const convertedUrl = await convertLink(originalUrl);
            if (win) win.location.href = convertedUrl;
            button.disabled = false;
        }

        document.querySelectorAll('.btn-buy').forEach(btn => btn.addEventListener('click', handleBuyClick));
    </script>
</body>
</html>`;
}

// ==========================================================
// MAIN LOGIC
// ==========================================================

async function generatePage(query) {
    console.log(`🔍 Searching for: "${query}"...`);

    // 1. Fetch from Database
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('❌ Database Error:', error);
        return;
    }

    if (!data || data.length === 0) {
        console.log('⚠️ No products found. No file generated.');
        return;
    }

    // 2. Prepare Folder Structure
    const queryWords = query.trim().toLowerCase().split(/\s+/);
    const folderName = queryWords[0]; 
    const baseFileName = queryWords.join('-');
    
    const dirPath = path.join(OUTPUT_DIR, folderName);

    // 3. Calculate Global Best Deal
    const bestDeal = findBestDeal(data);

    // 4. Pagination Calculations
    const totalProducts = data.length;
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

    console.log(`📊 Found ${totalProducts} products. Generating ${totalPages} pages.`);

    // Array to store newly generated URLs for Sitemap
    const generatedUrls = [];

    try {
        await fs.ensureDir(dirPath);

        // 5. Generate Pages
        for (let i = 0; i < totalPages; i++) {
            const currentPage = i + 1;
            const startIndex = i * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const chunk = data.slice(startIndex, endIndex);

            // Determine filename
            let fileName = `${baseFileName}.html`;
            if (currentPage > 1) {
                fileName = `${baseFileName}-${currentPage}.html`;
            }
            
            const filePath = path.join(dirPath, fileName);

            console.log(`🛠️ Generating Page ${currentPage}: ${fileName}`);
            
            // Pass folderName for Canonical URL construction
            const htmlContent = generateFullHTML(query, chunk, bestDeal, currentPage, totalPages, baseFileName, folderName);
            
            await fs.writeFile(filePath, htmlContent);

            // Add to Sitemap List
            const fileUrl = `${BASE_URL}/${folderName}/${fileName}`;
            generatedUrls.push(fileUrl);
        }

        console.log(`✅ SUCCESS! All pages generated in: ${dirPath}`);

        // 6. Update Sitemap
        if (generatedUrls.length > 0) {
            await updateSitemap(generatedUrls);
        }

    } catch (err) {
        console.error('❌ File System Error:', err);
    }
}

// Run the generator
generatePage('vivo v70 elite');