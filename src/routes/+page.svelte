<script lang="ts">
    let count = $state(0);
</script>

<h1>Counter</h1>
<button onclick={() => count += 1}>Increment</button>
<p>Count: {count}</p>
<p>Click the button to increment the count.</p>