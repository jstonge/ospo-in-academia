<script lang="ts">
    import { gfmPlugin } from 'svelte-exmarkdown/gfm';
    import Scrolly from './Scrolly.svelte';
    
    import Toc from './TOC.svelte';
    import Intro from './Intro.svelte';
    import Chapter1 from './Chapter1.svelte';

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
    
    // Create array of groups
    const groups = Object.entries(groupMap).map(([groupId, sections], index) => ({
        id: groupId,
        index,
        title: groupId === 'intro' ? 'Introduction' : 'Estimating Efforts',
        sections
    }));

</script>

<div class="container">
   <Toc {groups} {currentGroup} />
   
    <!-- Main Content -->
    <main>
        <Scrolly bind:value={currentGroup} top={100} bottom={100}>
            {#each groups as group, groupIndex}
                <div id={group.id} class="group-content" class:active={currentGroup === groupIndex}>
                    <section class="content-section">
                        {#if group.id === 'intro'}
                            <Intro {group} {plugins} />
                        {:else}
                            <Chapter1 {group} {plugins}/>
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


    /* Responsive */
    @media (max-width: 920px) {
        .container {
            grid-template-columns: 1fr;
        }
        
        main {
            padding: 1rem;
        }
        
    }
</style>