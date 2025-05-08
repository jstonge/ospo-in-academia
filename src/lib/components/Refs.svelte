
<script>
    let { sections } = $props();
</script>
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

<style>

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


</style>