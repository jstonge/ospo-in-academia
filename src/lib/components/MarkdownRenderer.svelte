<script lang="ts">
    import Markdown from 'svelte-exmarkdown';
    import { gfmPlugin } from 'svelte-exmarkdown/gfm';
    import Scrolly from './Scrolly.svelte';
    import { processContent, getGroupReferences } from '$lib/utils.js';
    import { base } from '$app/paths';
    import Toc from './TOC.svelte';

    // Import the markdown data
    import markdownData from './markdownData.json';
    
    // Initialize tracking state and plugins
    let currentGroup = $state(0);
    const plugins = [gfmPlugin()];
    
    // Function to handle image paths
    function getImagePath(src) {
        if (!src) return '';
        return src.startsWith('/') ? `${base}${src}` : src;
    }

    // Group sections by their group property
    const groupMap = {};
    markdownData.sections.forEach(section => {
        if (!groupMap[section.group]) {
            groupMap[section.group] = [];
        }
        groupMap[section.group].push(section);
    });
    
    // Create array of groups
    const groups = Object.entries(groupMap).map(([groupId, sections], index) => ({
        id: groupId,
        index,
        title: groupId === 'intro' ? 'Introduction' : 'Estimating Efforts',
        sections
    }));
    
    // Image zoom functionality
    let zoomedImage = $state(null);
    
    function openImageModal(image) {
        zoomedImage = image;
    }
    
    function closeImageModal() {
        zoomedImage = null;
    }
</script>

<div class="container">
   <!-- TOC -->
    <Toc {groups} {currentGroup} />

    <!-- Main Content -->
    <main>
        <Scrolly bind:value={currentGroup} top={100} bottom={100}>
            {#each groups as group, groupIndex}
                <div id={group.id} class="group-content" class:active={currentGroup === groupIndex}>
                    <section class="content-section">
                        {#if group.id === 'intro'}
                            <!-- Introduction content -->
                            {#each group.sections[0].content as block}
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
                                                onclick={() => openImageModal(block.data)}
                                            />
                                            <button class="zoom-button" onclick={() => openImageModal(block.data)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <circle cx="11" cy="11" r="8"></circle>
                                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                                    <line x1="11" y1="8" x2="11" y2="14"></line>
                                                    <line x1="8" y1="11" x2="14" y2="11"></line>
                                                </svg>
                                            </button>
                                        </div>
                                        {#if block.data.caption}
                                            <figcaption>{block.data.caption}</figcaption>
                                        {/if}
                                    </figure>
                                {/if}
                            {/each}
                            
                            <!-- Introduction references -->
                            {@const introRefs = getGroupReferences(group)}
                            {#if introRefs.length > 0}
                                <div id="intro-references" class="references">
                                    <h2>References</h2>
                                    <ol class="reference-list">
                                        {#each introRefs as ref}
                                            <li id={`ref-${ref.id}`}>
                                                {ref.citation}
                                            </li>
                                        {/each}
                                    </ol>
                                </div>
                            {/if}
                        {:else}
                            <!-- Estimation sections -->
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
                                                        onclick={() => openImageModal(block.data)}
                                                    />
                                                    <button class="zoom-button" onclick={() => openImageModal(block.data)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                            <circle cx="11" cy="11" r="8"></circle>
                                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                                            <line x1="11" y1="8" x2="11" y2="14"></line>
                                                            <line x1="8" y1="11" x2="14" y2="11"></line>
                                                        </svg>
                                                    </button>
                                                </div>
                                                {#if block.data.caption}
                                                    <figcaption>{block.data.caption}</figcaption>
                                                {/if}
                                            </figure>
                                        {/if}
                                    {/each}
                                </div>
                            {/each}
                            
                            <!-- Estimation references -->
                            {@const estRefs = getGroupReferences(group)}
                            {#if estRefs.length > 0}
                                <div id="est-references" class="references">
                                    <h2>References</h2>
                                    <ol class="reference-list">
                                        {#each estRefs as ref}
                                            <li id={`ref-${ref.id}`}>
                                                {ref.citation}
                                            </li>
                                        {/each}
                                    </ol>
                                </div>
                            {/if}
                        {/if}
                    </section>
                </div>
            {/each}
        </Scrolly>
    </main>
    
    <!-- Image modal -->
    {#if zoomedImage}
        <div class="modal-backdrop" onclick={closeImageModal}>
            <div class="modal-content" onclick={e => e.stopPropagation()}>
                <button class="close-button" onclick={closeImageModal}>×</button>
                <img src={zoomedImage.src} alt={zoomedImage.alt} class="modal-image" />
                {#if zoomedImage.caption}
                    <div class="modal-caption">{zoomedImage.caption}</div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .container {
        display: grid;
        grid-template-columns: 220px 1fr;
        max-width: 1200px;
        margin: 0 auto;
        gap: 3rem;
    }
    
    main {
        max-width: 720px;
        padding: 2rem;
    }
    
    .group-content {
        margin-bottom: 4rem;
        opacity: 0.75;
        transition: all 0.3s ease;
    }
    
    .group-content.active {
        opacity: 1;
    }
    
    .content-section {
        padding: 2rem;
        background: white;
        border-radius: 0.5rem;
        border-left: 3px solid transparent;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
    
    .figure img:hover {
        transform: scale(1.01);
    }
    
    figcaption {
        margin-top: 0.75rem;
        font-size: 0.875rem;
        color: #6b7280;
        font-style: italic;
    }
    
    .zoom-button {
        position: absolute;
        bottom: 0.5rem;
        right: 0.5rem;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease;
        color: #4b5563;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .image-container:hover .zoom-button {
        opacity: 1;
    }
    
    /* Modal styling */
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(2px);
    }
    
    .modal-content {
        position: relative;
        background: white;
        padding: 1rem;
        border-radius: 0.5rem;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
    }
    
    .close-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: white;
        border: none;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        font-size: 1.5rem;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .modal-image {
        max-width: 100%;
        max-height: calc(90vh - 6rem);
        object-fit: contain;
    }
    
    .modal-caption {
        margin-top: 1rem;
        text-align: center;
        font-style: italic;
        color: #4b5563;
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
    
    /* Table of Contents */
    .toc {
        position: sticky;
        top: 2rem;
        align-self: start;
        padding: 1.5rem;
        height: max-content;
        background: white;
        border-radius: 0.5rem;
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
        
        .toc {
            display: none;
        }
        
        main {
            padding: 1rem;
        }
        
        .modal-content {
            max-width: 95vw;
            padding: 0.75rem;
        }
    }
</style>