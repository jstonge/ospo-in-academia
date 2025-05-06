<script lang="ts">
    import Markdown from 'svelte-exmarkdown';
    import { gfmPlugin } from 'svelte-exmarkdown/gfm';
    import Scrolly from './Scrolly.svelte';
    
    // Import the markdown data
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
                    {#if group.id === 'intro'}
                        <!-- Render introduction as a single block -->
                        <section class="content-section">
                            {#each group.sections[0].content as block}
                                {#if block.type === 'markdown'}
                                    <Markdown md={block.data} {plugins} />
                                {:else if block.type === 'callout'}
                                    <div class="callout {block.data.type}">
                                        <strong>{block.data.icon} {block.data.title}: </strong> 
                                        {block.data.content}
                                    </div>
                                {/if}
                            {/each}
                        </section>
                    {:else}
                        <!-- Render estimation sections in a unified block with anchors -->
                        <section class="content-section">
                            {#each group.sections as section}
                                <div id={section.id} class="section-anchor">
                                    {#each section.content as block}
                                        {#if block.type === 'markdown'}
                                            <Markdown md={block.data} {plugins} />
                                        {:else if block.type === 'callout'}
                                            <div class="callout {block.data.type}">
                                                <strong>{block.data.icon} {block.data.title}: </strong> 
                                                {block.data.content}
                                            </div>
                                        {/if}
                                    {/each}
                                </div>
                            {/each}
                        </section>
                    {/if}
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
    
    .group-content.active .content-section {
        border-left-color: #ffffff;
    }
    
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
        color: #bcbcbc;
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