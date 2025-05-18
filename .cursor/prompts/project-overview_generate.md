<Role_Persona>
You are an expert AI system architect specializing in creating and maintaining comprehensive, LLM-native knowledge bases. Your goal is to construct and continuously refine a "living" internal reference document specifically for an LLM assistant. This document will serve as the LLM's primary source of truth and operational guide for understanding and interacting with a complex software project, enabling it to provide highly accurate, context-aware, and efficient development support.
</Role_Persona>

<Overall_Task>
This process involves 5 steps designed to build and refine this LLM-native document. You must ensure the LLM assistant can parse, query, and utilize this document effectively to perform its development support functions. **Crucially, all information within this knowledge base MUST be grounded in verifiable facts directly extracted from the codebase; speculation or assumptions are strictly forbidden.**

ENSURE you meticulously follow each step, show your reasoning, detail ALL tool calls (including parameters and justification), and use the output of each step as direct input for the next.
</Overall_Task>

<Key_Inputs>

1. The **Current Codebase**: Explored live via tools (`list_dir`, `read_file`, `codebase_search`, `grep_search`) to extract information for the LLM's knowledge base.
2. The **Existing LLM Knowledge Base**: The current version of `.cursor/rules/project-overview.mdc` (if it exists), which the LLM will read and update. If it doesn't exist, it will be created from scratch.
   </Key_Inputs>

<Output_Specification>
Your response MUST be structured as follows:

1. A brief restatement of your understanding of this overall task (generating/maintaining an LLM-native knowledge base).
2. For EACH of the 5 steps detailed below:
   a. Clearly state the **Step Number** and its **Objective** (focusing on how it contributes to the LLM's knowledge and operational capability).
   b. Provide a **Plan of Action** for how you will approach this specific step, detailing how the LLM will gather or process information for its own use.
   c. Detail your **Execution Process**, including:
   i. Step-by-step reasoning and analysis from the perspective of building/refining the LLM's knowledge.
   ii. Explicit descriptions of EVERY tool call made: specify the tool name, ALL parameters used, and a brief justification for why the tool call is necessary for this step _to gather information for the LLM's knowledge base_.
   iii. Clear summaries of the relevant information extracted or derived from tool call outputs, framed as "knowledge gained by the LLM".
   d. A **Conclusion for the Step**, summarizing key findings that will be incorporated into the LLM's knowledge base or will inform its operational guidelines.
3. After completing all 5 steps, you MUST output the **FULL and complete Markdown content** for the updated `.cursor/rules/project-overview.mdc` document. This Markdown is the LLM's internal knowledge base.
4. Finally, describe the `edit_file` tool call you will make to save this new Markdown content to the path `.cursor/rules/project-overview.mdc`, thereby updating the LLM's core knowledge.
   </Output_Specification>

<Instructions>
**IMPORTANT OPERATIONAL MANDATE: Once this generation/update process for `.cursor/rules/project-overview.mdc` is initiated, you MUST complete all 5 Steps in their entirety without interruption or premature termination. Each step builds upon the last, and partial execution will result in an incomplete or corrupted knowledge base for the LLM assistant.**

Carefully execute the following 5 steps IN ORDER. The primary goal is to build a document that an LLM assistant can use as its brain for this project, filled **only with verifiable facts** from the codebase.

**Step 1: Codebase Wide Survey for Foundational LLM Knowledge**

- **Objective**: To conduct a broad initial survey of the entire current workspace to establish foundational knowledge for the LLM assistant. This involves identifying the file structure, major directories (especially `apps/*`, `libraries/*`, `scripts/`, `storybook/`), and key configuration files. This information will form the basic map the LLM uses to navigate and understand the project. **This initial map MUST be constructed solely from directly observable and verifiable facts from the codebase; no assumptions are permitted.**
- **Plan of Action**:
  1. Use `list_dir` to map the root directory and key high-level directories (`apps`, `libraries`, `scripts`, `storybook`). This helps the LLM understand the project's top-level organization.
  2. Use `file_search` or `grep_search` to locate critical global configuration files (e.g., root `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.json`, `eslint.config.js`). These files define the project's operational parameters for the LLM.
  3. Read the content of these global configuration files using `read_file`. The LLM will parse these to understand project setup, workspace definitions, and top-level scripts/dependencies, forming a core part of its understanding. **All interpretations MUST be based strictly on the file contents.**
  4. For each major application in `apps/*` and library in `libraries/*`:
     - Use `list_dir` for the LLM to learn its internal structure.
     - Locate its specific `package.json` and other key local config files (e.g., `vite.config.js`, `svelte.config.js`). Read them with `read_file` so the LLM can learn about module-specific configurations and dependencies. **Information extracted MUST be a direct reflection of the file content.**
  5. Investigate `.github/workflows/` using `list_dir` and `read_file` for each workflow YAML. This allows the LLM to understand the CI/CD setup, which is crucial for answering questions about build/deployment processes. **Again, only record what is explicitly present.**
- **Execution Process**: Detail tool calls and how their outputs build the LLM's foundational knowledge, **emphasizing the direct, verifiable nature of the information.**
- **Conclusion for Step 1**: Summarize the core structural and configuration knowledge the LLM has acquired, **reiterating that it is based purely on verifiable codebase facts.**

**Step 2: Analysis of Existing LLM Knowledge Base (if any) and Discrepancy Identification**

- **Objective**: To perform an in-depth review of the existing `.cursor/rules/project-overview.mdc` (the LLM's current knowledge base). This involves the LLM reading its own knowledge, comparing it meticulously against the "foundational knowledge map" from Step 1 (which is itself based purely on facts), and **identifying outdated, missing, or unclear information, or any statements not directly verifiable by codebase evidence, within its own knowledge base.** This step is about self-correction and identifying knowledge gaps for the LLM, **ensuring its entire knowledge base remains factually grounded.**
- **Plan of Action**:
  1. Use `read_file` for the LLM to fetch the ENTIRE content of its current knowledge base at `.cursor/rules/project-overview.mdc`.
  2. The LLM will systematically go through each section of its retrieved knowledge.
  3. For each section, the LLM will compare its assertions and descriptions against its "foundational knowledge map" from Step 1. **The core of this comparison is verifying that all existing knowledge statements are still supported by direct codebase evidence and free from past assumptions.**
  4. Use a Tabular Chain-of-Thought format (in your reasoning output) for the LLM to list discrepancies within its own knowledge. Columns: `| Section in LLM Knowledge Base | Specific Statement/Topic | Issue Identified (e.g., Outdated, Missing, Vague, Incorrect, _Not Verifiable_) | Evidence from Codebase (or lack thereof) | Action for LLM (e.g., Update, Add, Remove, Clarify, _Verify or Remove_) | Brief Reasoning |`.
  5. The LLM will also assess its existing Markdown structure for its own parsability and retrieval efficiency, noting structural improvements for better self-use.
- **Execution Process**: Detail tool calls and the LLM's internal analysis of its knowledge base, **focusing on the verification against codebase facts.**
- **Conclusion for Step 2**: Provide a summary of identified gaps, outdated information, and areas for improvement, **especially any parts of the existing knowledge that are not strictly verifiable and thus need correction or removal.**

**Step 3: Defining Information Requirements for Maximizing LLM's Own Assistance Capabilities**

- **Objective**: To strategically define the specific types of _verifiable_ information and the level of detail the LLM assistant _must have in its knowledge base_ (`project-overview.mdc`) to effectively perform a wide range of development support tasks. This step is about the LLM determining what _factual knowledge_ it needs to be most helpful.
- **Plan of Action**:
  1. (Internal RaR by the system architecting the LLM's knowledge base) Rephrase the core goal: "For the LLM assistant to maximize its ability to assist with development, what categories of _verifiable codebase information_ and what level of detail must be explicitly encoded in its `.cursor/rules/project-overview.mdc` knowledge base so it can quickly and accurately retrieve and apply this knowledge?"
  2. Address EACH of the following guiding questions from the perspective of _what verifiable information the LLM needs to find in its own knowledge base_. For each, identify concrete, _fact-based_ information points that the LLM requires to be documented in `project-overview.mdc`:
     - "When a developer asks about SvelteKit's routing, load functions, or hooks, what specific _verifiable details from the codebase_ (e.g., file-system routing conventions observed, `+page.server.js` usage patterns found, server/universal hooks examples _directly from the code_) MUST the LLM be able to retrieve from this document to provide accurate explanations or code examples?"
     - "To explain the impact of changes to configuration files (Vite, TypeScript, ESLint, Turborepo), what _verifiable information from those files_ about their interconnections, inheritance, and key properties (e.g., Vite aliases mapped to TSConfig paths _as seen in the configs_) MUST be readily available in the LLM's knowledge base?"
     - "When asked to generate code using shared library components (e.g., `@library/ui`) or helper functions (`@library/helpers`), what specific details _verifiable from their source code or exported types_ about their APIs (props, arguments, return types, usage examples _found in code_) MUST the LLM find in this document to ensure correctness?"
     - "To generate code consistent with project conventions (coding style, naming rules, design patterns), what specific guidelines, _if explicitly documented or consistently observable in the codebase_, MUST be stated in this document for the LLM to reference and follow? _Avoid inferring undocumented conventions._"
     - "To support i18n tasks (using Paraglide JS), what _verifiable details from message files and Paraglide configurations_ about message file structure, key generation, the compilation process, and usage of functions like `m` in Svelte components MUST be documented here for the LLM to provide correct guidance or code modifications?"
     - "When a developer encounters common errors or needs debugging help, what _verifiable reference points_ (e.g., known issues documented in code comments/issues, typical configuration errors based on common patterns seen, environment variable caveats _explicitly mentioned_) should the LLM be able to quickly pull from this document?"
  3. Structure these requirements as a detailed list or a table for the LLM's reference: `| Developer Request Category/Scenario | Specific _Verifiable_ Information LLM Needs in project-overview.mdc | Why LLM Needs This (e.g., to generate X based on _observed pattern Y_) | Example of How LLM Will Use This _Factual_ Information |`.
- **Execution Process**: Document the thought process for defining the LLM's own information needs, **always emphasizing the need for verifiable sources.**
- **Conclusion for Step 3**: Compile a comprehensive list of _fact-based_ information points critical for the LLM's operational effectiveness. This, combined with Step 2's gap analysis, guides the _fact-based_ knowledge acquisition in Step 4.

**Step 4: In-depth Codebase Exploration for Targeted LLM Knowledge Acquisition**

- **Objective**: To perform a deep and targeted exploration of the current codebase specifically to gather the _verifiable_ information defined in Step 3 (what the LLM needs to know) and to fill the knowledge gaps identified in Step 2. All gathered information must be formatted for optimal LLM parsing, retrieval, and utilization, and **MUST be strictly limited to what can be directly observed and verified from the codebase. No assumptions, inferences beyond direct evidence, or speculation are allowed.**
- **Plan of Action**:
  1. (ThoT Approach for LLM knowledge gathering) For each major area defined below, systematically explore relevant files and directories. The LLM will process information from multiple files on a single topic, summarizing findings from each before forming an integrated piece of knowledge. The focus is on extracting information that directly maps to the LLM's operational needs identified in Step 3, **ensuring every piece of information is verifiable.**
  2. **Key Exploration Areas (for LLM's Knowledge Base - Emphasize Verifiable Utility for LLM)**:
     - **Application Structure (`apps/*`) and `boiler_plates` Role (LLM's _verified_ understanding for code generation)**:
       - For `apps/boiler_plates/` (and other representative apps): Use `list_dir` and `read_file` for the LLM to learn `src/routes` structure, common layouts, hooks (`src/hooks.*.ts`), data loading patterns (`+page.server.js`, `+page.js`), and state management. The LLM will use this _verified_ knowledge to understand how new pages/features are typically added (referencing `boiler_plates`) and to generate consistent code for new SvelteKit routes/components. Document how the LLM should handle deviations _observed_ in other apps. **Only document patterns explicitly found.**
     - **Shared Libraries (`libraries/*`) API and Usage (LLM's _verified_ reference for code generation & explanation)**: For EACH library in `libraries/*`:
       - Examine its `package.json` for the LLM to learn `exports`, `dependencies`, and `scripts` – **recording only what is present.**
       - For `helpers/`: `list_dir` its subdirectories. For key utility files, use `read_file` for the LLM to extract exported functions, their signatures, and **illustrative code examples _directly found in the codebase or its tests_. Do not invent examples.**
       - For `llms/` (especially `src/gemini/`): Use `read_file` for the LLM to understand Gemini API integration. Document key functions, how they are used (based on _observed usage_), and **CRITICAL points the LLM must consider (e.g., API key handling instructions _if found in docs/code comments_, error management patterns _observed_).**
       - For `ui/`: Identify major components. Document for the LLM how to use representative components, their key props (from source code/types), and styling approaches (_as implemented_).
     - **Core Configuration Files - Meaning and Interrelations (LLM's _verified_ understanding for explaining project behavior & impact analysis)**: For `vite.config.js`, `svelte.config.js`, `tsconfig.json` (`paths` alias), `eslint.config.js`, `turbo.json`:
       - Use `read_file`. Explain the primary role of each file and key configurations. **CRITICALLY, document relationships (e.g., how `tsconfig.json` paths relate to Vite aliases _as explicitly configured_) for the LLM to explain these to developers or predict the impact of changes. Do not infer relationships not explicitly defined.**
     - **CI/CD Pipelines (`.github/workflows/`) (LLM's _verified_ reference for troubleshooting & explanation)**:
       - Use `list_dir` and `read_file`. Document for the LLM each workflow's purpose, triggers, main jobs/steps, key GitHub Actions used, and **common commands executed (_as written in the YAML_).**
     - **Development Environment & Automation Scripts (LLM's _verified_ knowledge for guiding developers)**:
       - Examine `package.json` scripts (`dev`, `build`, `test`, `lint`). Document their purpose and common usage **based on the script content and any accompanying comments.**
     - **i18n (`libraries/paraglide/`) (LLM's _verified_ guide for i18n tasks)**:
       - Explore `project.inlang/settings.json`, `messages/{locale}.json`, `paraglide-output/`. Document message structure, key generation, compilation, and **how the LLM should instruct developers to use generated functions (like `m`) in Svelte components with examples _taken from the codebase or official ParaglideJS documentation context if directly referenced_.**
     - **State Management & Data Fetching Patterns (LLM's _verified_ patterns for code generation)**:
       - Identify prevalent patterns (Svelte stores, SvelteKit `load` functions) **by observing their usage in the codebase.** Document these patterns with simple examples _derived from actual code_. **Do not generalize beyond observed patterns unless a clear, documented project standard exists.**
  3. All information gathered must be summarized and presented in a way that the LLM can easily parse and use (clear, concise, structured, with directly usable examples), **and every statement must be traceable back to a verifiable source in the codebase.**
- **Execution Process**: Detail tool usage and how the extracted information is processed into the LLM's actionable knowledge, **with constant emphasis on the source and verifiability of each piece of information.**
- **Conclusion for Step 4**: Summarize the wealth of _verified_ operational knowledge collected for the LLM, categorized by the areas above, ready for structuring into its internal knowledge base. **Reiterate that no unverified information has been included.**

**Step 5: Structuring and Composing the LLM's Internal Knowledge Base (`project-overview.mdc`)**

- **Objective**: To synthesize all _verified_ knowledge gathered and analyzed into the `.cursor/rules/project-overview.mdc` file, structuring it for **maximum utility, parsability, and actionability by the LLM assistant itself, based solely on facts.** This is about creating the LLM's "brain" for this project, ensuring it is a source of truth.
- **Plan of Action**:
  1. Take the existing structure of `project-overview.mdc` (if any, from Step 2 analysis) as a baseline for the LLM's knowledge.
  2. Integrate all new _verified_ knowledge gathered in Step 4 and address all discrepancies and requirements identified in Steps 2 and 3. This involves the LLM updating its own knowledge sections, adding new ones, and ensuring all topics from Step 3's "LLM information needs" list are covered comprehensively _from the perspective of an LLM user of this document, strictly adhering to verifiable facts_. **During this integration, the LLM MUST continuously cross-reference with codebase evidence to prevent introduction of any unverified statements.**
  3. Create/Update a dedicated section in `.cursor/rules/project-overview.mdc` titled **"LLM Operational Guide: Common Development Scenarios & Self-Correction Procedures Based on Verifiable Knowledge"**. This section is CRITICAL and tells the LLM _how to use this document (which contains only verifiable facts) and assist developers_. It MUST include:
     - **How the LLM Should Use This Document (as a Source of Verifiable Truth)**: Explicit instructions for the LLM on querying this document, prioritizing its information, and using it as the primary source of _verified_ truth for project-specific queries. **Instruct the LLM to explicitly state when its responses are based on information from this document.**
     - **LLM-Suitable Tasks & Procedures (Based on Verifiable Knowledge)**: For tasks the LLM can confidently handle:
       - Clearly state the task type.
       - **Specify which sections of this `project-overview.mdc` (containing verifiable facts) the LLM MUST reference.**
       - Provide a template or checklist for the LLM's response/action (e.g., "When generating a Svelte component, ensure to include: [prop definitions from UI library section, based on _verified_ component code], [state management pattern from relevant section, based on _observed_ patterns], [i18n usage from Paraglide section, based on _verified_ setup]").
     - **Tasks Requiring Developer Oversight (LLM as Guided Assistant Using Verifiable Knowledge) & Procedures**: For tasks where the LLM assists but does not execute autonomously:
       - Identify these tasks and explain _to the LLM_ why developer oversight is needed.
       - Instruct the LLM on how to assist using _verified information from this document_: e.g., "Generate the command for the developer to review and run, (command taken from _verified_ `package.json` scripts section)," "Outline the steps based on [relevant section with _verified_ patterns in this doc] for the developer to implement."
     - **LLM Self-Correction / Information Gap Identification (Regarding Verifiable Knowledge)**:
       - Instruct the LLM that if it encounters a developer query for which _verifiable_ information is missing or outdated in this document, it should note this. **It should also explicitly state to the developer if it cannot find the required _verifiable_ information in its knowledge base.**
       - Provide a placeholder or instruction for the LLM on how it might suggest an update to this document or flag it for review, **emphasizing that any proposed update must also be verifiable.**
     - **Interpreting Developer Requests & Seeking Clarification (for Fact-Based Responses)**:
       - Guidance for the LLM on parsing developer intent.
       - **Provide specific questions the LLM should ask the developer to get necessary context to provide a _fact-based_ answer by referencing this document.**
       - Emphasize adherence to project conventions outlined _within this document (which are themselves verified)_. **If a convention is not documented here as verified, the LLM should not assume it.**
     - **Scenario-Based Operational Examples for LLM (Using Verifiable Knowledge)**:
       - _Example 1: Developer asks "How do I add a new page for XYZ?"_
         LLM Action: "1. Consult 'Application Structure' and '`boiler_plates` Role' sections (which describe _verified_ structures). 2. Consult 'i18n' section for _verified_ translation key patterns. 3. Provide developer with steps based on these _verified_ patterns..."
       - _Example 2: Developer asks "Generate a UI component to display a list of users."_
         LLM Action: "1. Consult 'Shared Libraries (`libraries/*`) API and Usage' specifically for `@library/ui` components (_verified_ APIs). 2. Consult 'State Management & Data Fetching Patterns' (_verified_ patterns). 3. Generate Svelte code using appropriate list/table components from `@library/ui`, demonstrating data fetching as per _verified_ project patterns..."
  4. **Adhere strictly to "Content Composition for LLM Utility Maximization" principles (from LLM's perspective)**:
     - **Strict Factual Accuracy and Verifiability**: The LLM MUST ensure that ALL information recorded in `.cursor/rules/project-overview.mdc` is derived _directly and exclusively_ from the codebase through tool use (`read_file`, `codebase_search`, etc.). There is ZERO tolerance for speculation, assumption, or hallucination. If information cannot be definitively verified from the codebase, it MUST NOT be included. This is a CRITICAL directive to maintain the integrity and reliability of the LLM's knowledge base. Violations will severely degrade the LLM's utility. **This principle underpins all other principles.**
     - **Language**: All content in this document MUST be in English, as this is optimal for the LLM's processing.
     - **Clarity and Directness**: Use unambiguous language that the LLM can parse easily. Avoid metaphors or colloquialisms.
     - **Code Blocks and Examples**: Provide actual code snippets (using Markdown triple backticks with language identifiers) that the LLM can directly use as templates or to understand syntax/patterns. These are critical for code generation tasks.
     - **Keyword and Term Emphasis**: Use **bold** or `backticks` for important keywords, library names, file names, or configuration keys that the LLM should pay special attention to or use as search keys within this document.
     - **Tables for Comparison/Summaries**: Use Markdown tables for lists of configuration options, API endpoints, etc., as this structured format is easier for the LLM to parse and extract specific data points from.
     - **"Do" and "Don't" Lists (for LLM actions)**: Provide explicit guidance on recommended practices or patterns the LLM should follow or avoid when generating code or providing explanations.
  5. Review and refine the entire document ensuring it is a coherent, accurate (because it is _fact-based_), and highly actionable internal knowledge base for the LLM.
  6. The output of this step is the FINAL, complete Markdown text for `.cursor/rules/project-overview.mdc` – the LLM's brain, **built on verifiable facts.**
- **Execution Process**: Describe how the LLM's knowledge base is constructed section by section, emphasizing how each part is designed for LLM consumption and actionability, **and crucially, how verifiability is maintained at each stage.**
- **Conclusion for Step 5**: State that the LLM's internal knowledge base (`project-overview.mdc`) is now complete and ready to be loaded/used, **and that its contents are strictly based on verifiable codebase facts.** Output the full Markdown content.

**Final Action: Save the LLM's Updated Knowledge Base**

- After outputting the complete Markdown content, describe the `edit_file` tool call you will make:
  - `tool_name`: `edit_file`
  - `args`:
    - `target_file`: `.cursor/rules/project-overview.mdc`
    - `code_edit`: The full Markdown content generated in Step 5.
    - `instructions`: "To save the comprehensively updated internal knowledge base for the LLM assistant, ensuring all content is strictly based on verifiable facts from the codebase."

</Instructions>
