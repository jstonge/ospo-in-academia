<script>
    import { processContent, getGroupReferences } from '$lib/utils.js';
    import Markdown from 'svelte-exmarkdown';
    import BubbleChart from '$lib/components/BubbleChart.svelte';
    import data from "./data.js";
    
    let { group, plugins } = $props();
    
    // Function to handle image paths
    function getImagePath(src) {
        if (!src) return '';
        return src.startsWith('/') ? `${base}${src}` : src;
    }

</script>

{#each group.sections as section}
<div id={section.id} class="section-anchor">
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
</div>
{/each}

<!-- <BubbleChart {data} /> -->

<!-- Estimation references -->
{#if getGroupReferences(group).length > 0}
<div id="est-references" class="references">
    <h2>References</h2>
    <ol class="reference-list">
        {#each getGroupReferences(group) as ref}
            <li id={`ref-${ref.id}`}>
                {ref.citation}
            </li>
        {/each}
    </ol>
</div>
{/if}

<style>
    .container {
        display: grid;
        grid-template-columns: 220px 1fr;
        max-width: 1200px;
        margin: 0 auto;
        gap: 3rem;
    }
    

    .group-content {
        margin-bottom: 4rem;
        opacity: 0.75;
        transition: all 0.3s ease;
    }
    
    .group-content.active {
        opacity: 1;
    }

    .section-anchor {
        scroll-margin-top: 2rem;
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
        cursor: pointer;
        transition: transform 0.15s ease;
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
        padding-top: 1.5rem;
        border-top: 1px solid #e5e7eb;
        scroll-margin-top: 2rem;
    }
    
    .references h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-top: 0;
        margin-bottom: 1rem;
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
    

    /* Subgroup styling */
    .subgroup {
        padding-left: 1rem;
        margin-top: 0.5rem;
    }
    
    /* Responsive */
    @media (max-width: 920px) {
        .container {
            grid-template-columns: 1fr;
        }

    }
</style>