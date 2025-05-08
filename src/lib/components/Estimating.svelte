<script lang="ts">
    import Scrolly from '$lib/components/Scrolly.svelte';
    import { getContext } from 'svelte';
    import BubbleChart from './BubbleChart.svelte';
    import MarkdownRenderer from './MarkdownRenderer.svelte';
    const copy = getContext("copy");
	const steps = copy.steps;

    let { section, index, markdownData, currentSection } = $props();

    let scrollyIndex = $state();
    
</script>
    

<MarkdownRenderer {section} />

<section>
    <div class="visualization-container" >
        <BubbleChart {scrollyIndex} {markdownData}/>
    </div>

    <div class="spacer"></div>
    <Scrolly bind:value={scrollyIndex}>
            {#each steps as text, i}
                {@const active = scrollyIndex === i}
                <div class="step" class:active>
                    <p> 
                        {@html text.value}
                    </p>
                </div>
            {/each}
    </Scrolly>
    <div class="spacer"></div>
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

	.step p {
		padding: 0.5rem 1rem;
		background: whitesmoke;
		color: #ccc;
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		transition: background 500ms ease;
		box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
		z-index: 10;
		width: 40%;
		transform: translateX(-20%);
	}

	.step.active p {
		background: white;
		color: black;
	}

	:global(.step .bold) {
		font-family: var(--sans);
	}

</style>