<script lang="ts">
    import Markdown from 'svelte-exmarkdown';
    import { gfmPlugin } from 'svelte-exmarkdown/gfm';
    import Scrolly from './Scrolly.svelte';
    
    // Import the markdown data with references
    import markdownData from './markdownData.json';
    
    // Initialize tracking state and plugins
    let currentGroup = $state(0);
    const plugins = [gfmPlugin()];
    
    // Group sections by their group property
    const groupMap = {};
    markdownData.sections.forEach(section => {
        if (!groupMap[section.group]) {
            groupMap[section.group] = [];
        }
        groupMap[section.group].push(section);
    });
    
    // Create an array of groups with their sections
    const groups = Object.entries(groupMap).map(([groupId, sections], index) => {
        return {
            id: groupId,
            index,
            title: groupId === 'intro' ? 'Introduction' : 'Estimating Efforts',
            sections
        };
    });
    
    // Process markdown content to convert footnote references
    function processMarkdown(content, groupReferences) {
        // Build a map of references for this group
        const refMap = new Map();
        groupReferences.forEach(ref => {
            refMap.set(ref.id, ref.citation);
        });
        
        // Replace all footnote references with superscript links
        let processed = content;
        
        return processed;
    }
    
    // Collect all references for a group
    function getGroupReferences(group) {
        const allRefs = [];
        group.sections.forEach(section => {
            if (section.references && section.references.length > 0) {
                allRefs.push(...section.references);
            }
        });
        
        // Sort references by id
        return allRefs.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    }
</script>

<div class="container">
    <aside class="toc">
        <h2>Contents</h2>
        <ul>
            {#each groups as group, i}
                <li class="group" class:active={currentGroup === i}>
                    <button 
                        onclick={() => document.getElementById(group.id)?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        {group.title}
                    </button>
                    {#if group.id === 'estimation'}
                        <ul class="subgroup">
                            {#each group.sections as section}
                                <li class="section">
                                    <a 
                                        href={`#${section.id}`}
                                        onclick={(e) => {
                                            e.preventDefault();
                                            document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        {section.title}
                                    </a>
                                </li>
                            {/each}
                            <li class="section">
                                <a 
                                    href="#est-references"
                                    onclick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('est-references')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    References
                                </a>
                            </li>
                        </ul>
                    {/if}
                </li>
            {/each}
        </ul>
    </aside>

    <main>
        <Scrolly bind:value={currentGroup} top={100} bottom={100}>
            {#each groups as group, groupIndex}
                <div 
                    id={group.id} 
                    class="group-content" 
                    class:active={currentGroup === groupIndex}
                >
                    <section class="content-section">
                        {#if group.id === 'intro'}
                            <!-- Render introduction as a single block -->
                            {#each group.sections[0].content as block}
                                {#if block.type === 'markdown'}
                                    {@const groupRefs = getGroupReferences(group)}
                                    {@const processedMd = processMarkdown(block.data, groupRefs)}
                                    <Markdown md={processedMd} {plugins} />
                                {:else if block.type === 'callout'}
                                    <div class="callout {block.data.type}">
                                        <strong>{block.data.icon} {block.data.title}: </strong> 
                                        {block.data.content}
                                    </div>
                                {/if}
                            {/each}
                            
                            <!-- Render references for the introduction -->
                            {@const introRefs = getGroupReferences(group)}
                            {#if introRefs.length > 0}
                                <div id="intro-references" class="references">
                                    <h2>References</h2>
                                    <ol class="reference-list">
                                        {#each introRefs as ref}
                                            <li id={`ref-${ref.id}`}>
                                                {ref.citation} 
                                                <a href={`#ref-src-${ref.id}`} class="back-link">↩</a>
                                            </li>
                                        {/each}
                                    </ol>
                                </div>
                            {/if}
                        {:else}
                            <!-- Render estimation sections in a unified block with anchors -->
                            {#each group.sections as section}
                                <div id={section.id} class="section-anchor">
                                    {#each section.content as block}
                                        {#if block.type === 'markdown'}
                                            {@const groupRefs = getGroupReferences(group)}
                                            {@const processedMd = processMarkdown(block.data, groupRefs)}
                                            <Markdown md={processedMd} {plugins} />
                                        {:else if block.type === 'callout'}
                                            <div class="callout {block.data.type}">
                                                <strong>{block.data.icon} {block.data.title}: </strong> 
                                                {block.data.content}
                                            </div>
                                        {/if}
                                    {/each}
                                </div>
                            {/each}
                            
                            <!-- Render references for the estimation group -->
                            {@const estRefs = getGroupReferences(group)}
                            {#if estRefs.length > 0}
                                <div id="est-references" class="references">
                                    <h2>References</h2>
                                    <ol class="reference-list">
                                        {#each estRefs as ref}
                                            <li id={`ref-${ref.id}`}>
                                                {ref.citation} 
                                                <a href={`#ref-src-${ref.id}`} class="back-link">↩</a>
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
    
    /* .group-content.active .content-section {
        border-left-color: #3b82f6;
    } */
    
    .section-anchor {
        scroll-margin-top: 2rem;
    }
    
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
    
    .back-link {
        display: inline-block;
        margin-left: 0.5rem;
        font-size: 0.8rem;
        color: #3b82f6;
        text-decoration: none;
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
    
    .toc li {
        margin-bottom: 0.5rem;
    }
    
    /* Group styling */
    .group button {
        background: none;
        border: none;
        padding: 0.5rem;
        font-size: 0.95rem;
        font-weight: 600;
        color: #374151;
        text-align: left;
        width: 100%;
        cursor: pointer;
        border-radius: 0.25rem;
        transition: all 0.2s ease;
    }
    
    .group button:hover {
        background-color: #f3f4f6;
    }
    
    /* .group.active button {
        color: #2563eb;
    } */
    
    /* Subgroup styling */
    .subgroup {
        padding-left: 1rem;
        margin-top: 0.5rem;
    }
    
    .section a {
        display: block;
        padding: 0.3rem 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
        text-decoration: none;
        border-radius: 0.25rem;
        transition: all 0.2s ease;
    }
    
    .section a:hover {
        background-color: #f3f4f6;
        text-decoration: none;
    }
    
    /* Superscript styling for references */
    :global(sup a) {
        text-decoration: none;
        color: #2563eb;
        font-weight: 500;
        padding: 0 0.1rem;
    }
    
    :global(sup a:hover) {
        text-decoration: underline;
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
    }
</style>