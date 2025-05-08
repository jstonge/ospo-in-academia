<script lang="ts">
    import { Switch } from "bits-ui";
    
    // Define props with default values
    let { 
      checked = $bindable(false),
      label = "Toggle me",
      disabled = false,
      description = "" // Optional description text
    } = $props();
    
    // Function to handle clicks on the container
    function toggleState() {
      if (!disabled) {
        checked = !checked;
      }
    }
  </script>
  
  <div 
    class="toggle-wrapper"
    on:click={toggleState} 
    class:disabled={disabled}
    role="button"
    tabindex={disabled ? -1 : 0}
    on:keydown={(e) => e.key === 'Enter' && toggleState()}
    aria-pressed={checked}
  >
    <div class="toggle-content">
      <div class="text-content">
        <span class="label">{label}</span>
        {#if description}
          <span class="description">{description}</span>
        {/if}
      </div>
      
      <Switch.Root 
        bind:checked={checked}
        {disabled}
        class="toggle"
        on:click={(e) => e.stopPropagation()}
      >
        <Switch.Thumb class="thumb" />
      </Switch.Root>
    </div>
  </div>
  
  <style>
    .toggle-wrapper {
      margin: 0.5rem 0;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      background-color: white;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .toggle-wrapper:hover {
      background-color: #f9fafb;
      border-color: #d1d5db;
    }
    
    .toggle-wrapper:focus-visible {
      outline: none;
      ring: 2px solid #3b82f6;
      ring-offset: 2px;
    }
    
    .toggle-wrapper.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .toggle-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    
    .text-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .label {
      font-weight: 500;
      font-size: 0.875rem;
      color: #111827;
    }
    
    .description {
      font-size: 0.75rem;
      color: #6b7280;
    }
    
    .toggle {
      position: relative;
      flex-shrink: 0;
      height: 1.5rem;
      width: 2.75rem;
      border-radius: 9999px;
      background-color: #e5e7eb;
      transition: background-color 0.2s ease-in-out;
    }
    
    .toggle.checked {
      background-color: #3b82f6;
    }
    
    .thumb {
      position: absolute;
      top: 0.125rem;
      left: 0.125rem;
      height: 1.25rem;
      width: 1.25rem;
      border-radius: 9999px;
      background-color: white;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .toggle.checked .thumb {
      transform: translateX(1.25rem);
    }
  </style>