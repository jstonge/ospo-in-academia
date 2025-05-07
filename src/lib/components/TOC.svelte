 <script>
    let { groups, currentGroup} = $props();
    import { getGroupReferences } from '$lib/utils.js';

 </script>
 <!-- Table of Contents -->
 <aside class="toc">
    <h2>Contents</h2>
    <ul>
        {#each groups as group, i}
            {#if group.level == 1 } 
            <li class="group" class:active={currentGroup === i}>
                <button onclick={() => document.getElementById(group.id)?.scrollIntoView({ behavior: 'smooth' })}>
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
                        {#if getGroupReferences(groups.find(g => g.id === 'estimation')).length > 0}
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
                        {/if}
                    </ul>
                {/if}
            </li>
            {/if}
        {/each}
    </ul>
</aside>

<style>
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
    
    .group.active button {
        color: #2563eb;
    }
    
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
</style>