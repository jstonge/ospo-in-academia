<script lang="ts">
    import { setContext } from "svelte";
    import Scrolly from '$lib/components/Scrolly.svelte';
    import Toc from '$lib/components/TOC.svelte';
    import Refs from '$lib/components/Refs.svelte';
    import markdownData from '$lib/components/markdownData.json';    
    import Estimating from '$lib/components/Estimating.svelte';
    import copy from "$lib/components/copy.json";
    import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
    import Markdown from 'svelte-exmarkdown';

    let { data } = $props();

    setContext("copy", copy);
	setContext("data", data);

    // Initialize tracking state and plugins
    let currentSection = $state(0);
    
    // Process sections for hierarchy and navigation
    const sections = markdownData.sections;

    import Toggle from "$lib/components/Toggle.svelte";

    let isShortStatement = $state(true);
    let ShortStatement = {
        id: "short-statement",
        title: "Short Statement",
        level: 1,
        content: [
            {
            type: "markdown",
            data: "## Working with me"
            },
            {
            type: "markdown",
            data: "As a research software engineer (RSE), I help research groups build better tools and better habits. My role isn’t just to write code—it's to integrate open-source practices that make research more collaborative, reproducible, and sustainable.\n\nI support research teams in tasks like:\n- **Data collection and labeling** through custom interfaces and collaborative workflows.\n- **Model-specific data pipelines** tailored to the methods you use, whether Bayesian stats, NLP, or machine learning. Data pipelines is one area where groups struggle the most, but good practices in industry emerged to help with that. \n- **Interactive tools** like dashboards, web apps, and maps that communicate results clearly to stakeholders. But beyond technical deliverables, my core value is helping teams work better together. I introduce tools, licensing guidance, and open-source habits that improve long-term collaboration—inside your group and beyond."
            },
            {
                type: "markdown",
                data: "Working with me means:\n- **Clear boundaries and expectations**: I’m not a student or PI; I’m a collaborator who strengthens your technical backbone. My involvement—whether consultative or hands-on—should be defined at the start of a project.\n- **Flexible roles**: I can mentor students, advise on research design, write reusable code, or build full-stack tools—depending on your project’s needs.\n- **Sustainability planning**: I build tools that can outlast my involvement, with documentation, training, and support for handoff."
            },
            {
                type: "markdown",
                data: "Many researchers still build software in isolation. I help shift that culture. By aligning the open-source ethos with academic workflows, I make it easier for your group to grow, share, and build on each other's work. Science’s biggest bottleneck isn’t computing power—it’s collaboration. I’m here to help you fix that."
            }
        ]
    }
    
</script>

<div class="app">
    
    <div class="container">
        <Toc groups={sections} currentGroup={currentSection} />
    
        <main>
            <Scrolly bind:value={currentSection} top={100} bottom={100}>
                {#each sections as section, index}
                    {#if section.level === 1}
                        {#if section.id === 'intro'}
                            <MarkdownRenderer {section} />
                        <!-- {:else if section.id === 'work-with-me'}  -->
                        <!-- <div class="p-4">
                            <Toggle 
                                bind:checked={isShortStatement} 
                                label={isShortStatement ? "Show long statement" : "Show short Statement"}
                            />
                        </div>
                        {#if isShortStatement}
                            <MarkdownRenderer section={ShortStatement} />
                        {:else}
                            <MarkdownRenderer {section} />
                        {/if} -->
                        {:else if section.id === 'estimating'} 
                            <Estimating {section} {index} {markdownData} {currentSection}/>
                        {/if}
                    {:else}
                        <!-- Invisible anchor for navigation only -->
                        <div id={section.id} style="height: 0; overflow: hidden;"></div>
                    {/if}
                {/each}
                <Refs {sections} />
            </Scrolly>
        </main>
    </div>

    <footer>
        <div class="container">
            <p>© {new Date().getFullYear()} VERSO. Released under MIT License.</p>
        </div>
    </footer>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #f9fafb;
        color: #1f2937;
    }
    
    .app {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    
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
    
    
    
    footer {
        margin-top: auto;
        padding: 2rem 0;
        background-color: #1f2937;
        color: #e5e7eb;
        font-size: 0.875rem;
    }
    .toggle-wrapper {
        padding: 0.75rem;
        background-color: #f3f4f6;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        display: inline-block;
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

