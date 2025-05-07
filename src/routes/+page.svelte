<script lang="ts">
    import MarkdownViewer from '$lib/components/MarkdownRenderer.svelte';
</script>

<div class="app">
    
    <div class="container">
        <MarkdownViewer />
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
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
    }
    
    
    footer {
        margin-top: auto;
        padding: 2rem 0;
        background-color: #1f2937;
        color: #e5e7eb;
        font-size: 0.875rem;
    }
</style>

