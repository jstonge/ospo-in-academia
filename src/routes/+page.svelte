<script lang="ts">
    // let count = $state(0);
    import Markdown from 'svelte-exmarkdown';
    import { gfmPlugin } from 'svelte-exmarkdown/gfm';
	const plugins = [gfmPlugin()];
</script>

<main>

<Markdown md={`
# Ospo in Academia

Much has been written on the technical side of making scientific free/open-source software; performant code, important licensing, building reproducible data pipeline, and so on. 

But academic foss is more than that; it is about the banality of FOSS. How projects can get out of hand. How taking the time of building reproducible pipeline might get in the way of publishing papers. Dealing with institutional inertia, even though everybody might be on board with open source.

We identify key challenges
- how can we best spread best coding practices, given the above considerations. 
- What should we adapted from industry. But perhaps  more importantly, what not to bring from industry.
- ...

---

## 1. Estimating efforts in F/OSS research projects

Here we provide a few examples of projects that are easy, medium, and hard to do. The goal is to help RSEs to estimate the level of effort required to accomplish the project goals.

### Easy

Easy is perhaps a slighly misleading label. You only really know how easy a project is once you have done it.

#### Vermontick's ticks

`} {plugins}/>

<span class="tag">#deliverable</span>

<Markdown md={`
The Vermont Ticks project aims to track the spread of infectious diseases in Vermont, using sophisticated mechanistic and statistical models. The client is the MAP2LE team.

The MAP2LE team reached out to the RSE to help design an interactive map where it would be possible to look at probability of infections, given different states (the vector disease, weather, time of the year, etc). The RSE provided a draft of the interactive map that could be achieved, which was put in the draft sent for grant. This draft map was done in less than an hour.

The plan does not involve mentorship on the behalf of the RSE. Once the project has been funded, the RSE will collaborate with experienced researchers to develop that interactive map.

As a product, this map is estimated to be fairly easy to do, given what has been agreed in the research proposal (the current effort bet is around 5-10 RSE-hours for a working prototype, but can involve more effort if the map ought to be more polished).

The product seems easy enough to do because it is a single-web app page, including a map of Vermont with a few widgets (activity, vector type, model type). That said, the RSE identified two aspects of the project that could be more time consuming to implement, based on his experience:

- Making sure the Application Programming Interface has access to hourly/daily weather data.
- The API data should be then used in models developed by the team. The back and forth depending on the particular models used, and predictive performance in this case, could require some more efforts to fine-tune.

`}/>

<div class="callout hint">
    <strong>💡 Hint: </strong> Since the RSE is not expected to provide modeling expertise in this project, it makes the overall project easier.
</div>

<Markdown md={`
Once the app has been deployed, the RSE doesn't take responsibility of developing it further. That is, if the MAP2LE team wants to develop further extensions to the basic web app, they might need to re-apply. The RSE still commits himself to fix bugs due to flawed original design, if within the boundary of the prior agreement. The RSE is expected to write documentation in accordance with open-source principles such that the project could be developed further later on without too much hassle, if needs be.
`}/>

<div class="callout hint">
    <strong>💡 Hint: </strong> A student could helped on the project design and take care of the maintenance.
</div>


<div class="callout warning">
    <strong>⚠ Project going sideways:</strong>
    A key challenge academics are facing when doing computational works is that they rarely know in advance what is going to be the scope of the work. This can lead to the project going sideways in a different ways.   The scope might be "clear", in the sense that stakeholders know in a vague way what they want, but the expectations are not realists. That is, the "true" level of expertise or work required to accomplish the projects' goals are beyond current level of expertise. This can be a good learning opportunity for students, an important source of frustation, or both. Consider a case where the MAP2LE team didn't realize, but the data is ungainly and large. As such, the data pipeline would benefit from building a [[Postgres]] database that the web interface could query. Furthermore, it wasn't clear before, but the model the MAP2LE team had in mind won't work, or perhaps the inference they want to make are not doable, given the data they currently have. A student could take on herself to fix both problems, leading to unreasonable level of expectations, while stakeholders don't see the effort required in fixing both problems. Setting up a database is a nontrivial task to do when it is a first time, especially when students are not coming from a computer science background.
  </div>


<Markdown md={`
### Medium

Todo 

### Hard mode

#### Wikimedia

The Wikimedia project aims to use the wikimedia data and apply tools unique for which  Vermont Complex System Institute has an expertise. The client is Wikimedia.

The precise aims of this project are somewhat fuzzy, but the idea is to help Wikimedia to highlight facts about their data using methods from the institute. It is multifaceted, and part of the project is to design what methods will work best on Wikimedia data, and communicate the results effectively. As such, there are milestones and regular check up on advancements, but there is no clear agreed deliverable at the project onset. It is an ongoing discussion. That said, there are a few steps that were understood to be more or less involved upon accepting the research proposals:

- There is "backend" effort involved, as the data is voluminous and require database work to manage effectively.
- There is also "frontend" effort involved, as part of the missions for this project is to highlight results that are unique to both the Wikimedia data and the complex systems approach.
- In between, there is "research" effort involved, as the RSEs are expected to contribute to the design of methods that will shape both the backend and frontend aspects of the work. 

As such, there are multiple dependencies between different parts of the pipeline in this project, making it much harder than specific deliverables.
`}/>


</main>

<style>
      main {
            max-width: 720px;
            margin: 4rem auto;
            padding: 0 1.5rem;
            font-family: system-ui, sans-serif;
            line-height: 1.;
            color: #222;
        }

        .callout {
            padding: 1rem 1.25rem;
            border-left: 6px solid;
            border-radius: 0.5rem;
            margin: 1.5rem 0;
            font-size: 1rem;
            background-color: #f9f9f9;
        }

        .callout.warning {
            background-color: #fff4f4;
            border-color: #d9534f;
            color: #a94442;
        }

        .callout.hint {
            background-color: #f0f9ff;
            border-color: #5bc0de;
            color: #31708f;
        }
        
    .tag {
        display: inline-block;
        background-color: #e0f2fe;
        color: #0369a1;
        font-size: 0.85rem;
        font-weight: 500;
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;

        }
</style>