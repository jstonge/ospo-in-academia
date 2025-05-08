<script>
    import { forceSimulation, forceX, forceY, forceCollide, forceCenter } from "d3-force";
    import { scaleOrdinal, scaleSqrt } from "d3-scale";
    import { fade } from "svelte/transition";
    import Markdown from 'svelte-exmarkdown';
    import { gfmPlugin } from 'svelte-exmarkdown/gfm';
    import { processContent } from '$lib/utils.js';
    
    // Import the content data
    let { scrollyIndex, markdownData } = $props();
    
    // Initialize plugins for markdown rendering
    const plugins = [gfmPlugin()];
    
    // Use $state for reactive variables
    let width = $state(400);
    let height = $state(400);
    let hovered = $state(null);
    let selected = $state(null);
    let nodes = $state([]);
    
    // Margins
    const margin = { top: 20, right: 20, left: 20, bottom: 20 };
  
    // Use $derived for computed values
    let innerWidth = $derived(width - margin.left - margin.right);
    let innerHeight = $derived(height - margin.top - margin.bottom);
    
    // Extract level 3 sections for the bubbles
    let level3Sections = $derived(
      markdownData.sections.filter(section => section.level === 3)
    );
    
    // Create a map of parent sections by ID for lookup
    const sectionMap = {};
    markdownData.sections.forEach(section => {
      sectionMap[section.id] = section;
    });
    
    // Prepare the bubble data
    const bubbleData = level3Sections.map(section => {
      // Get parent section (level 2)
      const parentSection = sectionMap[section.parentId];
      // Get grandparent section (level 1)
      const grandparentSection = parentSection ? sectionMap[parentSection.parentId] : null;
      
      // Calculate a "happiness" score based on the section content length
      // This will determine the bubble size
      const contentLength = section.content.reduce((total, block) => {
        if (block.type === 'markdown') {
          return total + (block.data.length || 0);
        }
        return total;
      }, 0);
      
      // Normalize to a 1-9 scale for the bubble chart
      const normalizedSize = Math.min(9, Math.max(1, contentLength / 200));
      
      return {
        id: section.id,
        title: section.title,
        parentTitle: parentSection ? parentSection.title : "Unknown",
        categoryTitle: grandparentSection ? grandparentSection.title : "Unknown",
        size: normalizedSize,
        content: section.content
      };
    });
  
    // Group bubbles by parent category (level 2 sections)
    const categories = [ 'Easy', 'Medium', 'Hard' ]
    // Create color scale by parent category
    const colorScale = scaleOrdinal()
      .domain(categories)
      .range([
          "#457b9d", // blue
          "#fca311",  // yellow
          "#e63946" // red
      ]);
  
    // Base radius scale
    let radiusScale = $derived(
      scaleSqrt()
        .domain([1, 9])
        .range(width < 568 ? [10, 25] : [15, 40])
    );
  
    // Compute actual radius based on if node is selected
    function getRadius(node) {
      return selected === node ? radiusScale(node.size) * 1.2 : radiusScale(node.size);
    }
  
    // Get color for a node based on its parent section
    function getColor(node) {
      return colorScale(node.parentTitle);
    }
  
    // Initialize the simulation with our bubble data
    let simulation = forceSimulation(bubbleData);
    simulation.on("tick", () => {
      nodes = simulation.nodes();
    });
  
    // Modify your $effect section to handle specific scrollyIndex values
    $effect(() => {
      // All bubbles cluster together in the center
      const centerX = innerWidth / 2;
      const centerY = innerHeight / 2;
      
      // If a node is selected, give it more emphasis
      let collideStrength = 0.7;
      let centerStrength = 0.1;

      // Calculate target X position based on scrollyIndex
      let targetX = centerX; // Default position
      
      // Handle scrollyIndex changes
      if (scrollyIndex === undefined) {
          selected = null;
        } else if (scrollyIndex === 0) {
          selected = nodes.find(node => node.id === 'vermontticks');
          targetX = centerX * 1.5;

        } else if (scrollyIndex === 1) {
          selected = nodes.find(node => node.id === 'vermontticks');
          targetX = centerX * 1.5;
          
        }  else if (scrollyIndex === 2) {
          selected = nodes.find(node => node.id === 'vermontlivability');
          targetX = centerX * 1.5;
      }
      
      // Adjust simulation based on selection state
      if (selected) {
        // Selected node gets stronger forces
        collideStrength = 1;
        centerStrength = 0.2;
      }

      simulation
        .force("center", forceCenter(targetX, centerY).strength(centerStrength))
        .force("x", forceX(targetX).strength(0.05))
        .force("y", forceY(centerY).strength(0.05))
        .force("collide", forceCollide().radius(d => getRadius(d) + 3).strength(collideStrength))
        .alpha(0.3)
        .alphaDecay(0.005)
        .restart();
    });

    // Handle circle click
    function handleCircleClick(node, event) {
        event.stopPropagation();
        if (selected?.id === node.id) {
            selected = null;
        } else {
            selected = node;
            hovered = null;
        }
    }
  
    // Background click handler to deselect
    function handleBackgroundClick() {
      selected = null;
    }
</script>
  
<div class="chart-container" bind:clientWidth={width} onclick={handleBackgroundClick}>
  <svg {width} {height}>
    <g class="inner-chart" transform="translate({margin.left}, {margin.top})" onmouseleave={() => (hovered = null)}>
      <!-- All bubbles in a single group -->
      {#each nodes as node, i}
        <circle
            in:fade={{ delay: 200 + 10 * i, duration: 400 }}
            cx={node.x}
            cy={node.y}
            r={getRadius(node)}
            fill={getColor(node)}
            title={node.title}
            opacity={
            (selected || hovered)
                ? (selected?.id === node.id || hovered?.id === node.id ? 1 : 0.3)
                : 0.85
            }
            stroke={(selected?.id === node.id || hovered?.id === node.id) ? "black" : "#00000030"}
            stroke-width={selected?.id === node.id ? 2 : 1}
            onmouseover={() => (hovered = node)}
            onfocus={() => (hovered = node)}
            onclick={(event) => handleCircleClick(node, event)}
            tabindex="0"
            class="circle"
            class:selected={selected?.id === node.id}
        />

        {#if selected?.id === node.id || hovered?.id === node.id}
            <text
            x={node.x}
            y={node.y}
            text-anchor="middle"
            dominant-baseline="middle"
            class="bubble-title"
            pointer-events="none"
            >
            {node.title.length > 12 ? node.title.substring(0, 10) + '...' : node.title}
            </text>
        {/if}
        {/each}
    </g>
  </svg>
  
  <!-- Legend for categories -->
  <div class="legend">
    <h4>Categories</h4>
    {#each categories as category}
      <div class="legend-item">
        <span class="color-dot" style="background-color: {colorScale(category)};"></span>
        <span>{category}</span>
      </div>
    {/each}
  </div>
  
  <!-- Sidebar tooltip with full section content -->
  {#if hovered || selected}
    <div class="sidebar-tooltip">
      <div class="tooltip-content">
        {#each (selected || hovered).content as block}
          {#if block.type === 'markdown'}
            <div class="markdown-content">
              <Markdown md={processContent(block.data, [])} {plugins} />
            </div>
          {:else if block.type === 'callout'}
            <div class="callout {block.data.type}">
              <strong>{block.data.icon} {block.data.title}: </strong> 
              {block.data.content}
            </div>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</div>
  
<style>
  :global(*) {
    font-family: Inter, -apple-system, system-ui;
    -moz-osx-font-smoothing: grayscale;
  }

  .chart-container {
    position: relative;
    margin: 0 auto;
    height: 400px;
  }

  circle {
    transition: r 400ms ease, opacity 300ms ease, stroke-width 300ms ease;
    cursor: pointer;
  }

  circle.selected {
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.4));
  }
  
  .bubble-title {
    font-size: 10px;
    font-weight: bold;
    fill: white;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.9);
    pointer-events: none;
  }
  
  .sidebar-tooltip {
    position: fixed;
    top: 0;
    left: 0;
    width: 500px;
    height: 100vh;
    /* margin-top: 45vh; */
    background: white;
    border-left: 1px solid #ddd;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    overflow-y: auto;
    z-index: 1000;
  }
  
  
  .tooltip-category {
    margin: 0 0 8px 0;
    font-size: 0.8rem;
    color: #555;
    font-style: italic;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
  }
  
  .tooltip-content {
    font-size: 0.9rem;
  }
  
  .markdown-content :global(p) {
    margin: 0.5em 0;
  }
  
  .markdown-content :global(h1),
  .markdown-content :global(h2),
  .markdown-content :global(h3) {
    font-size: 1.1rem;
    margin: 0.75em 0 0.5em 0;
    font-weight: 600;
  }
  
  .markdown-content :global(h4),
  .markdown-content :global(h5),
  .markdown-content :global(h6) {
    font-size: 1rem;
    margin: 0.75em 0 0.5em 0;
    font-weight: 600;
  }
  
  .markdown-content :global(ul),
  .markdown-content :global(ol) {
    margin: 0.5em 0;
    padding-left: 1.5em;
  }
  
  .markdown-content :global(li) {
    margin: 0.25em 0;
  }
  
  .markdown-content :global(a) {
    color: #3182ce;
    text-decoration: none;
  }
  
  .markdown-content :global(a:hover) {
    text-decoration: underline;
  }
  
  .markdown-content :global(code) {
    background-color: #f1f5f9;
    padding: 0.1em 0.3em;
    border-radius: 0.25em;
    font-family: monospace;
    font-size: 0.9em;
  }
  
  /* Callout styling */
  .callout {
    margin: 0.75rem 0;
    padding: 0.5rem 0.75rem;
    border-left: 3px solid;
    border-radius: 0.25rem;
    background-color: #f9fafb;
    font-size: 0.85rem;
  }
  
  .callout.warning { border-color: #ef4444; background-color: #fee2e2; }
  .callout.hint { border-color: #3b82f6; background-color: #dbeafe; }
  .callout.info { border-color: #0ea5e9; background-color: #e0f2fe; }
  .callout.example { border-color: #84cc16; background-color: #ecfccb; }
  
  .legend {
    position: absolute;
    bottom: 10px;
    right: 10px; /* Changed from left: 10px to right: 10px */
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  
  .legend h4 {
    margin: 0 0 5px 0;
    font-size: 0.9rem;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 3px;
    font-size: 0.8rem;
  }
  
  .color-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
    display: inline-block;
  }
</style>