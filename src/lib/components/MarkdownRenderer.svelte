<script lang="ts">
    import Markdown from 'svelte-exmarkdown';
    import { gfmPlugin } from 'svelte-exmarkdown/gfm';
    import Scrolly from './Scrolly.svelte';
    import { processContent } from '$lib/utils.js';
    import { base } from '$app/paths';
    import Toc from './TOC.svelte';
    // Import the markdown data
    import markdownData from './MarkdownData.json';
    import BubbleChart from './BubbleChart.svelte';
    
    // Initialize tracking state and plugins
    let currentSection = $state(0);
    const plugins = [gfmPlugin()];
    
    // Function to handle image paths
    function getImagePath(src) {
        if (!src) return '';
        return src.startsWith('/') ? `${base}${src}` : src;
    }
    
    // Process sections for hierarchy and navigation
    const sections = markdownData.sections;
    
    // Create a map of sections by level for the table of contents
    const sectionsByLevel = {};
    sections.forEach(section => {
        if (!sectionsByLevel[section.level]) {
            sectionsByLevel[section.level] = [];
        }
        sectionsByLevel[section.level].push(section);
    });
    
    // Map for quick parent lookup
    const sectionMap = {};
    sections.forEach(section => {
        sectionMap[section.id] = section;
    });
    
</script>

<div class="container">
    <!-- Table of Contents -->
    <Toc groups={sections} currentGroup={currentSection} />

    <!-- Main Content - Only Level 1 Content, No Headers for Others -->
    <main>
        <Scrolly bind:value={currentSection} top={100} bottom={100}>
            {#each sections as section, index}
                {#if section.level === 1}
                    <!-- Show full content for Level 1 sections -->
                    <section 
                        id={section.id} 
                        class="content-section" 
                        class:active={currentSection === index}
                        class:level-1={true}
                    >
                        {#each section.content as block}
                            {#if block.type === 'markdown'}
                                <Markdown md={processContent(block.data, [])} {plugins} />
                            {:else if block.type === 'callout'}
                                <div class="callout {block.data.type}">
                                    <strong>{block.data.icon} {block.data.title}: </strong> 
                                    {block.data.content}
                                </div>
                            {:else if block.type === 'image'}
                                <figure class="figure">
                                    <div class="image-container">
                                        <img 
                                            src={getImagePath(block.data.src)} 
                                            alt={block.data.alt} 
                                            style={`max-width: ${block.data.width}px;`}
                                        />
                                    </div>
                                    {#if block.data.caption}
                                        <figcaption>{block.data.caption}</figcaption>
                                    {/if}
                                </figure>
                            {/if}
                        {/each}
                    </section>
                {:else}
                    <!-- Invisible anchor for navigation only -->
                    <div id={section.id} style="height: 0; overflow: hidden;"></div>
                {/if}
            {/each}
            
            <!-- Bubble Chart Visualization -->
            <div class="visualization-container">
                <p class="viz-description"><em>Hover over or click a bubble to explore section content. Size indicates content length, color represents category.</em></p>
                <BubbleChart {markdownData}/>
            </div>

            <!-- References section -->
            {#if sections.some(s => s.references?.length > 0)}
                <section id="references" class="references">
                    <h2>References</h2>
                    <ol class="reference-list">
                        {#each sections.flatMap(s => s.references || []) as ref}
                            <li id={`ref-${ref.id}`}>
                                {ref.citation}
                            </li>
                        {/each}
                    </ol>
                </section>
            {/if}
        </Scrolly>
    </main>
</div>


<style>
    .container {
        display: grid;
        grid-template-columns: 260px 1fr;
        max-width: 1200px;
        margin: 0 auto;
        gap: 3rem;
    }
    
    main {
        max-width: 720px;
        padding: 2rem;
    }
    
    .content-section {
        margin-bottom: 3rem;
        padding: 2rem;
        background: white;
        border-radius: 0.5rem;
        border-left: 3px solid transparent;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        opacity: 0.8;
        transition: all 0.3s ease;
    }
    
    .content-section.active {
        opacity: 1;
    }
    
    /* Indentation for hierarchy levels */
    .level-1 {
        margin-left: 0;
    }
    
    .level-2 {
        margin-left: 1.5rem;
    }
    
    .level-3 {
        margin-left: 3rem;
    }
    
    /* Figure and image styling */
    .figure {
        margin: 2rem 0;
        text-align: center;
    }
    
    .image-container {
        position: relative;
        display: inline-block;
        margin: 0 auto;
        line-height: 0;
    }
    
    .figure img {
        max-width: 100%;
        height: auto;
        border-radius: 0.375rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    figcaption {
        margin-top: 0.75rem;
        font-size: 0.875rem;
        color: #6b7280;
        font-style: italic;
    }
    
    /* Callout styling */
    .callout {
        margin: 1.5rem 0;
        padding: 1rem 1.25rem;
        border-left: 4px solid;
        border-radius: 0.25rem;
        background-color: #f9fafb;
    }
    
    .callout.warning { border-color: #ef4444; background-color: #fee2e2; }
    .callout.hint { border-color: #3b82f6; background-color: #dbeafe; }
    .callout.info { border-color: #0ea5e9; background-color: #e0f2fe; }
    .callout.example { border-color: #84cc16; background-color: #ecfccb; }
    
    /* References styling */
    .references {
        margin-top: 3rem;
        padding: 2rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .references h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-top: 0;
        margin-bottom: 1rem;
        color: #111827;
    }
    
    .reference-list {
        margin: 0;
        padding-left: 1.5rem;
    }
    
    .reference-list li {
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        line-height: 1.5;
        color: #4b5563;
    }
    
    /* Table of Contents */
    .toc {
        position: sticky;
        top: 2rem;
        align-self: start;
        padding: 1.5rem;
        height: max-content;
        background: white;
        border-radius: 0.5rem;
        max-height: calc(100vh - 4rem);
        overflow-y: auto;
    }
    
    .toc h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-top: 0;
        margin-bottom: 1rem;
        color: #111827;
    }
    
    .toc ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .section-item {
        margin-bottom: 0.25rem;
    }
    
    .section-item a {
        display: block;
        padding: 0.375rem 0.5rem;
        font-size: 0.9375rem;
        color: #4b5563;
        text-decoration: none;
        border-radius: 0.25rem;
        transition: all 0.2s ease;
    }
    
    .section-item a:hover {
        background-color: #f3f4f6;
        color: #2563eb;
    }
    
    .section-item.active > a {
        color: #2563eb;
        font-weight: 500;
    }
    
    /* TOC indentation */
    .toc-level-1 > .section-item > a {
        font-weight: 600;
    }
    
    .toc-level-2 {
        padding-left: 1rem;
        margin-top: 0.25rem;
        margin-bottom: 0.5rem;
    }
    
    .toc-level-2 > .section-item > a {
        font-size: 0.875rem;
    }
    
    .toc-level-3 {
        padding-left: 1rem;
        margin-top: 0.25rem;
        margin-bottom: 0.25rem;
    }
    
    .toc-level-3 > .section-item > a {
        font-size: 0.8125rem;
        padding: 0.25rem 0.5rem;
    }
    
    /* Responsive */
    @media (max-width: 920px) {
        .container {
            grid-template-columns: 1fr;
        }
        
        .toc {
            display: none;
        }
        
        main {
            padding: 1rem;
        }
        
        .level-2 {
            margin-left: 1rem;
        }
        
        .level-3 {
            margin-left: 1.5rem;
        }
    }
</style>