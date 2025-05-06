<script lang="ts">
    import MarkdownViewer from '$lib/components/MarkdownRenderer.svelte';
</script>

<div class="app">
    
    <div class="container">
        <MarkdownViewer />
    </div>
    
    <footer>
        <div class="container">
            <p>© {new Date().getFullYear()} University Research Program. Released under MIT License.</p>
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
    
    header {
        background-color: #2563eb;
        color: white;
        padding: 2rem 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    header h1 {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
    }
    
    header p {
        margin: 0.5rem 0 0;
        opacity: 0.9;
        font-size: 1.125rem;
    }
    
    footer {
        margin-top: auto;
        padding: 2rem 0;
        background-color: #1f2937;
        color: #e5e7eb;
        font-size: 0.875rem;
    }
</style>