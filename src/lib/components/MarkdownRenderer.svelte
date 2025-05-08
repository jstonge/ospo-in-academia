<script>
    
    import Markdown from 'svelte-exmarkdown';
    import { gfmPlugin } from 'svelte-exmarkdown/gfm';
    import { processContent } from '$lib/utils.js';
    import { base } from '$app/paths';
    
    let { section } = $props();

    const plugins = [gfmPlugin()];

    // Function to handle image paths
    function getImagePath(src) {
        if (!src) return '';
        return src.startsWith('/') ? `${base}${src}` : src;
    }
</script>

<section 
    id={section.id} 
    class="content-section" 
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


<style>
    .visualization-container {
		/* width: 40%; */
		/* height: 550px; */
		position: sticky;
		top: calc(50vh - 275px);
		/* right: 5%; */
		/* margin-left: auto; */
	}

    .spacer {
		height: 75vh;
	}

    .step {
		height: 80vh;
		display: flex;
		place-items: center;
		justify-content: center;
	}

	
	:global(.step .bold) {
		font-family: var(--sans);
	}

    .container {
        display: grid;
        grid-template-columns: 260px 1fr;
        max-width: 1200px;
        margin: 0 auto;
        gap: 3rem;
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
    
    
    .reference-list {
        margin: 0;
        padding-left: 1.5rem;
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
    
    .section-item {
        margin-bottom: 0.25rem;
    }
    
    
    .toc-level-2 {
        padding-left: 1rem;
        margin-top: 0.25rem;
        margin-bottom: 0.5rem;
    }
        
    .toc-level-3 {
        padding-left: 1rem;
        margin-top: 0.25rem;
        margin-bottom: 0.25rem;
    }
    
    /* Responsive */
    @media (max-width: 920px) {
        .container {
            grid-template-columns: 1fr;
        }
        
        .toc {
            display: none;
        }

        .level-2 {
            margin-left: 1rem;
        }
        
        .level-3 {
            margin-left: 1.5rem;
        }
    }
</style>