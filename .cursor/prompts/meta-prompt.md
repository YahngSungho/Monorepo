<Prompt_Engineering_Technique_documentation format="markdown">

# Least-to-Most Prompting (LtM)

- **Definition**: Least-to-Most (LtM) prompting breaks down problems into simpler subproblems and solves them sequentially.
- **Comparison with Chain-of-Thought**: Unlike Chain-of-Thought prompting, where each step is independent, LtM uses the output of previous subproblems as input for the next.
- **Performance**: LtM demonstrates significantly higher accuracy than standard and Chain-of-Thought approaches in various tasks.

## What is Least-to-Most Prompting?

Least-to-Most Prompting Enables Complex Reasoning in Large Language Models.^ takes Chain-of-Thought Prompting (CoT) a step further by first breaking a problem into sub problems then solving each one. It is a technique inspired by real-world educational strategies for children.

As in Chain-of-Thought prompting, the problem to be solved is decomposed in a set of subproblems that build upon each other. In a second step, these subproblems are solved one by one.
Contrary to Chain-of-Thought, the solution of previous subproblems is fed into the prompt trying to solve the next problem.

## Least-to-Most Prompting Example: letter concatenation

LtM was originally introduced using Few-Shot Prompting, rather than an explicit instruction to break down a problem into multiple steps (as seen above). Additionally, it can sometimes be implemented with a single prompt rather than chained prompts. Let's examine the problem of concatenating the last letter of individual words(for example, given `cake, etymology` as input words, the output should be `ey`).

### First attempt: Standard

The standard prompt with Few-Shot examples performs very poorly, even with a more advanced model such as text-davinci-003.

#### Prompt

Q: think, machine
A: ke

Q: learning, reasoning, generalization
A: ggn

Q: artificial, intelligence
A: le

Q: transformer, language, vision
A: ren

Q: foo,bar,baz,blip
A:

#### Output

lip

### Second attempt: Chain-of-Thought

Chain-of-Thought performs significantly better than standard prompting. This is because it now allows the model to consider extracting the last letter of each word on its own, reducing the complexity down to the operation of grouping letters it has previously collected. However, this starts to break down at larger sizes.

#### Prompt

Q: think, machine
A: The last letter of "think" is "k". The last letter of "machine" is "e". So "think, machine" is "ke".

Q: learning, reasoning, generalization
A: The last letter of "learning" is "g". The last letter of "reasoning" is "n". The last letter of "generalization" is "n". So "learning, reasoning, generalization" is "ggn".

Q: artificial, intelligence
A: The last letter of "artificial" is "l". The last letter of "intelligence" is "e". So "artificial, intelligence" is "le".

Q: transformer, language, vision
A: The last letter of "transformer" is "r". The last letter of "language" is "e". The last letter of "vision" is "n". So "transformer, language, vision" is "ren".

Q: foo,bar,baz,blip
A:

#### Output

The last letter of "foo" is "o". The last letter of "bar" is "r". The last letter of "baz" is "z". The last letter of "blip" is "p". So "foo,bar,baz,blip" is "orzp".

### Third attempt: Least-to-Most

With Least-to-Most prompting, we augment the Chain-of-Thought concept by reformulating the individual steps to restate the previously concatenated result. This simplifies each step to concatenating only a single new letter. This leads to good performance all the way to 12 or more words.

This approach may look very similar to Chain-of-Thought, but it is conceptually very different. Here, at every step, we introduce the previous concatenation. In the case of "think, machine, learning", instead of concatenating the letters "k", "e", and "g" individually, it will concatenate "k" and "e", then "ke" and "g". As a result of this reintroduction of the previous work, the model can now generalize to much longer chains because it carries the result incrementally along and only needs to do a small amount of work at each step.

#### Prompt

Q: think, machine

A: The last letter of "think" is "k". The last letter of "machine" is "e". Concatenating "k" and "e" gives "ke". So "think, machine" output "ke".

Q: think, machine, learning
A: "think, machine" outputs "ke". The last letter of "learning" is "g". Concatenating "ke" and "g" gives "keg". So "think, machine, learning" is "keg".

Q: transformer, language
A: The last letter of "transformer" is "r". The last letter of "language" is "e". Concatenating "r" and "e" gives "re". So "transformer, language" is "re".

Q: transformer, language, vision
A: "transformer, language" outputs "re". The last letter of "vision" is "n". Concatenating "re" and "n" gives "ren". So "transformer, language, vision" is "ren".

Q: foo,bar,baz,blip,learn,prompting,world,shaking,event,dancefloor,prisma,giraffe
A:

#### Output

The last letter of "foo" is "o". The last letter of "bar" is "r". Concatenating "o" and "r" gives "or". The last letter of "baz" is "z". Concatenating "or" and "z" gives "orz". The last letter of "blip" is "p". Concatenating "orz" and "p" gives "orzp".
The last letter of "learn" is "n". Concatenating "orzp" and "n" gives "orzpn". The last letter of "prompting" is "g". Concatenating "orzpn" and "g" gives "orzpng". The last letter of "world" is "d". Concatenating "orzpng" and "d" gives "orzpngd".
The last letter of "shaking" is "g". Concatenating "orzpngd" and "g" gives "orzpngdg". The last letter of "event" is "t". Concatenating "orzpngdg" and "t" gives "orzpngdgt".

---

# Rephrase and Respond (RaR) Prompting

- **Rephrase and Respond (RaR)** improves LLM accuracy by asking the model to rephrase a question before answering.
- **Works for various tasks** like question-answering and symbolic reasoning, refining ambiguous queries for better responses.
- **Easy to implement**: Just add "Rephrase and expand the question, and respond" to prompts for clearer answers.
- **Two-step option**: Rephrasing and responding can be split into separate phases for enhanced results.
- **Limitations**: RaR may over-complicate simple questions or alter the original intent, leading to irrelevant answers.

## What is Rephrase and Respond (RaR)?

Prompt Engineering consists of applying specific techniques when constructing a prompt with a goal to improve the quality of the response provided by Large Language Models (LLMs).

The creators of **Rephrase and Respond (RaR)** took this concept a step further. Instead of searching for a perfect prompt formula, they asked, "What if we let the model rephrase the question itself and then answer it?"

They focused on question-answering tasks and proposed the idea of incorporating a rephrasing request directly into the prompt. This can be as simple as adding one sentence: "Rephrase and expand the question, and respond."

#### Prompt

---

{Your question}

Rephrase and expand the question, and respond.

It's a concise and effective technique that can be combined with other techniques and has demonstrated improvements on multiple benchmarks.

### Example

Let's take an example question where we ask a model to answer whether a known person is born in an even/odd month. The ambiguity for the model here lies in the definition of the "even" and "odd" month:

- Does "odd" mean "strange"? Then, February can be considered odd because of an irregular number of days.
- Does "even/odd" month refer to a month with an even/odd number of days?
- How can "even/odd" be applied to the calendar? The concept of even and odd applies to integers, not to calendar months or dates.

Here's an example:

#### Simple prompt

---

Was Ludwig van Beethoven born in an even month?

#### AI Output

---

No, Ludwig van Beethoven was born on December 17, 1770. Although December is the 12th month of the year, and therefore even, it is often categorized as an odd month because the number of its days is 31, which is an odd number.

Let's try to ask the model to rephrase:

#### Rephrase and Respond prompting

---

Was Ludwig van Beethoven born in an even month?

Rephrase and expand the question, and respond.

#### AI Output

---

Rephrased Question: Was Ludwig van Beethoven born during a month with an even number, and if so, which month was it?

Response: Ludwig van Beethoven was born on December 17, 1770. December is the twelfth month of the year, which is an even number. Thus, Beethoven was indeed born in an even month.

Now, it answers correctly.

## How to Use Rephrase and Respond (RaR)?

Apart from adding "Rephrase and expand the question, and respond" to the prompt, you can use many other variations for asking a model to rephrase the question:

- Reword and elaborate on the inquiry, then provide an answer.
- Reframe the question with additional context and detail, then provide an answer.
- Modify the original question for clarity and detail, then offer an answer.
- Restate and elaborate on the inquiry before proceeding with a response.

All models can benefit from rephrasing questions, with more advanced models expected to gain a larger improvement.

### Example, Coin Flip

In this example, we provide the model with an initial position of the coin and describe the subsequent actions of people who either flipped or did not flip the coin. Then, we ask the model to provide an answer "Yes" or "No" to the question "Is the coin still heads up?."

Let's compare the two results that we get from a simple prompt and a Rephrase and Respond (RaR) prompt. In this example, the correct answer is "Yes, the coin still heads up."

#### Simple prompt

---

A coin is heads up. Aluino flips the coin. Arthor flips the coin. Is the coin still heads up? Flip means reverse. Answer the Yes or No question.

#### AI Output

---

No.

This is incorrect. Let's try to ask the model to rephrase:

#### Rephrase and Respond prompting

---

A coin is heads up. Aluino flips the coin. Arthor flips the coin. Is the coin still heads up? Flip means reverse.

Rephrase and expand the question, and respond.

Answer the Yes or No question.

#### AI Output

---

The coin started out being heads up. Then, Aluino flipped the coin, reversing its side. After that, Arthor also flipped the coin, reversing its side again. Is the coin facing heads up now?
Considering the action of flipping the coin means to reverse its side, after two flips, the coin would indeed be back in its original position. So, yes, the coin is still heads up.

Correct!

## How to Use Two-Step Rephrase and Respond (RaR)?

Another way to use Rephrase and Respond is a two-step procedure, separating the rephasing step from the responding step in RaR:

- Step 1, a rephrasing LLM: Given the original {question}, we ask a rephrasing LLM to generate a self-rephrased query called {rephrased_question}:

#### Step 1, a rephrasing LLM

---

{question}

Given the above question, rephrase and expand it to help you do better answering. Maintain all information in the original question.

- Step 2, a responding LLM: We prompt a responding LLM with both the original {question} and the {rephrased_question}:

#### Step 2, a responding LLM

---

{question}

{rephrased_question}

Interestingly, we can use the same LLM for both steps or different LLMs for each. One of the potential ways to use this is to let stronger LLMs rephrase for weaker LLMs to respond for better results.

## How to Combine Rephrase and Respond (RaR) with Few-Shot Chain-of-Thought (CoT) Prompting?

Although Few-Shot Chain-of-Thought (CoT) is not included into the Zero-Shot prompting techniques that we study here, it has been the most effective CoT technique for its usage of Few-Shot examples.

That's why we think it's important to mention that Rephrase and Respond (RaR) can be combined with a Few-Shot Chain-of-Thought (CoT) to achieve even better results.

To combine these techniques, again, just add this phrase to the end of the prompt: "Given the above question, rephrase and expand it to help you do better answering. Maintain all information in the original question."

#### RaR + Few-Shot CoT

---

Q: {question 1}

A: {example of the correct answer 1}

Q: {question 2}

A: {example of the correct answer 2}

...

Q: {question n}

Given the above question, rephrase and expand it to help you do better answering. Maintain all information in the original question.

### Example, Letter Concatenation Task

In this example, the task centers on symbolic reasoning. We ask the LLM to concatenate the final letters of a given list of names. Here's how you can combine RaR and CoT for this task:

#### RaR + One-Shot CoT

---

Q: Take the last letters of the words in "Elon Musk" and concatenate them.

A: The last letter of "Elon" is "n". The last letter of "Musk" is "k". Concatenating them is "nk". The answer is nk.

Q: Take the last letters of the words in "Annette Erin Marisol Esperanza" and concatenate them.

Given the above question, rephrase and expand it to help you do better answering. Maintain all information in the original question.

#### AI Output

---

Rephrased and Expanded Question:

To find the concatenated result of the last letters of each word in the phrase "Annette Erin Marisol Esperanza," follow these steps:

Identify the last letter of each word in the phrase. Concatenate these last letters in the order of the words.

So for the phrase "Annette Erin Marisol Esperanza":

The last letter of "Annette" is "e". The last letter of "Erin" is "n". The last letter of "Marisol" is "l". The last letter of "Esperanza" is "a".

Concatenate these last letters to get the final result. The answer is "enla".

## Limitations of Rephrase and Respond (RaR)

Rephrase and Respond (RaR) is a compelling prompt engineering technique, but it does come with some limitations.

Here are a few potential drawbacks:

- While rephrasing can help clarify ambiguous questions, it can also make straightforward queries unnecessarily complex.
- The success of RaR hinges on the model's ability to rephrase questions accurately. If the rephrasing misses the mark, the response may not be as effective.
- Rephrasing can sometimes inadvertently alter the original question's intent or focus, leading to a response that doesn't fully address the user's needs.

## Conclusion

RaR is a valuable tool for improving LLM outputs for question-answering tasks, especially when carefully implemented alongside other prompt strategies. By leveraging RaR, you can achieve clearer and more accurate responses.

---

# Tabular Chain-of-Thought (Tab-CoT)

## What is Tabular Chain-of-Thought Prompting (Tab-CoT)?

**Tabular Chain-of-Thought Prompting (Tab-CoT)** is a novel approach to Chain-of-Thought (CoT) prompting. Tab-CoT suggest to structure the reasoning process in CoT in the form of a table.

Unlike traditional CoT methods that rely on verbose natural language prompts, Tab-CoT leverages the power of tables. This allows Large Language Models (LLMs) to reason in a two-dimensional format, ensuring consistency and facilitating a more organized thought process.

## How Tab-CoT Differs from Existing Techniques

1. **Zero-Shot CoT vs. Tab-CoT**: Zero-Shot CoT uses "Let's think step by step" to guide the LLM through reasoning. However, these methods tend to be verbose and often result in less organized outputs. In contrast, **Tab-CoT** generates concise, structured reasoning steps in a table format. It allows for **2-dimensional reasoning**, enabling the model to check for consistency across both rows and columns.

2. **CoT vs. Tab-CoT**: In CoT, human-engineered reasoning demonstrations are used to guide the model. While this method can yield high performance, it requires significant effort to manually create task-specific examples.
   Tab-CoT removes this need by automatically generating the reasoning structure in a table, making it more scalable across various tasks without manual intervention.

## How Tab-CoT Works

**Tab-CoT** encourages the LLM to captured its reasoning as a series of steps in a table format.

The table typically has the following columns:

- **Step**: Represents the current reasoning step.
- **Subquestion**: A sub-question the model aims to answer at each step.
- **Process**: The reasoning or calculation performed at that step.
- **Result**: The final answer for that step.

This format breaks down complex problems into manageable steps, enabling the model to "think" in a structured way before generating the final answer.

### Problem

---

A chef needs to cook 9 potatoes. He has already cooked 7. If each potato takes 3 minutes to cook, how long will it take him to cook the rest?

**Tab-CoT's Table:**

| Step | Subquestion                         | Process        | Result |
| ---- | ----------------------------------- | -------------- | ------ |
| 1    | How many potatoes are left to cook? | 9 - 7 = 2      | 2      |
| ---  | ---                                 | ---            | ---    |
| 2    | How many minutes will it take?      | 2 \* 3 minutes | 6      |

This table allows LLMs to provide a more organized and efficient reasoning process compared to standard CoT, which may involve verbose, unstructured explanations.

## How to Use Tab-CoT

To use **Tab-CoT**, follow these steps:

### Step 1. **Formulating the Table**

The reasoning is structured in a table format with predefined columns that reflect the step-by-step thinking process.

Here's the prompt template:

#### Table Generation Prompt

---

\[Your Question\]

|step|subquestion|procedure|result|

### Step 2. **Answer Extraction**

Once the table is generated, a final prompt like "The answer is" can be used to extract the result from the completed table. This ensures that the model provides the final answer after performing all reasoning steps.

#### Answer Extraction Prompt

---

Therefore, the answer is

Tip

The code for Tab-CoT is open-sourced by researchers from StatNLP Research Group, Singapore University of Technology and Design, and available for further research and implementation at Xalp/Tab-CoT.

## Results of Tab-CoT

**Tab-CoT** has been evaluated on multiple reasoning tasks, including arithmetic, symbolic, and commonsense reasoning tasks. Below are some key results from experiments comparing **Zero-Shot CoT** and **Tab-CoT**:

- **Efficiency**: Tab-CoT reduces the number of tokens generated while maintaining or improving performance across most tasks.
- **Scalability**: It works well in **Zero-Shot** and **Few-Shot** settings without needing manual design of task-specific examples.
- **Improved Reasoning**: Tab-CoT's structured table approach captures both vertical (step-wise) and horizontal (cross-step) reasoning, which can result in more accurate final answers.

## Conclusion

**Tab-CoT** presents a significant advancement in CoT prompting methods by introducing a highly structured, tabular approach to reasoning. It offers a concise, scalable, and effective solution for reasoning tasks, outperforming traditional CoT methods in several cases.
As LLMs continue to evolve, Tab-CoT's table-based reasoning structure could become a standard for promoting structured reasoning in language modelsㅁ

---

# Analogical Prompting

- **LoT Enhances Reasoning**: Logic-of-Thought (LoT) boosts logical reasoning in large language models (LLMs) by incorporating formal logic, resulting in greater accuracy.
- **Three-Phase Process**: LoT employs a method of extracting logical propositions, extending them with formal rules, and translating them into natural language, enhancing reasoning capabilities.
- **Performance Gains**: LoT achieves significant improvements in logical reasoning tasks, outperforming methods like Chain-of-Thought (CoT) and Tree-of-Thoughts (ToT) with more precise responses.

## What is Logic-of-Thought (LoT)?

**Logic-of-Thought (LoT)** is a novel technique designed to improve the logical reasoning abilities of Large Language Models (LLMs). While LLMs are highly effective across many tasks, they struggle with complex logical reasoning, especially when using traditional methods like Chain-of-Thought (CoT).

LoT addresses these challenges by injecting formal propositional logic into prompts, guiding LLMs through more accurate reasoning processes. It adds logical information to input prompts, avoiding the information loss that often occurs when LLMs attempt symbolic reasoning.

### How does LoT work?

LoT operates in three phases to augment input prompts with logical reasoning:

1. **Logic Extraction**: LoT uses LLMs to extract logical propositions and relationships from the input. It identifies key conditional or logical connections between elements of the context.

2. **Logic Extension**: Logical expressions extracted from the first phase are expanded using formal logic rules (e.g., Transitive Law, Contraposition Law). This ensures that logical deductions are complete and align with human intuition.

3. **Logic Translation**: The expanded logical expressions are translated back into natural language. This augmented information is then combined with the original input, enhancing the prompt and helping the LLM to reason more accurately.

For example, if the input contains statements about a person reading a book, LoT might extract logical propositions such as "If a person reads a book, they become smarter" and ensure this information is added to the LLM's reasoning process.

## How LoT differs from existing techniques

LoT improves on existing methods like **Chain-of-Thought (CoT)**, **Self-Consistency (SC)**, and **Tree-of-Thoughts (ToT)** by ensuring that logical information is systematically extracted and applied. Here's how it compares:

- **Chain-of-Thought (CoT)**: CoT adds intermediate reasoning steps but sometimes generates unfaithful conclusions. LoT addresses this by grounding reasoning steps in formal logic, reducing errors.

- **Neuro-symbolic approaches**: Methods like **LINC** or **SatLM** combine LLMs with symbolic reasoning tools. However, these methods can lose information when converting problems into logical expressions. LoT avoids this by directly augmenting prompts without relying on external tools.

- **Tree-of-Thoughts (ToT)**: ToT explores multiple branches of reasoning, but LoT can further enhance this process by ensuring logical coherence within those branches.

## Benefits and Applications

LoT is particularly useful for tasks requiring robust logical reasoning, such as solving puzzles, legal reasoning, or question-answering on standardized tests.
It can be applied in scenarios where logical consistency is crucial, and it performs well even in tasks with complex reasoning layers.

## How to use LoT

Here's an example process using LoT:

### Phase 1. Logic Extraction Prompt

#### Prompt

---

Please use uppercase English letters such as A, B, C, etc. to identify all possible propositions. Do not include negative tones such as "not" in the propositions. For example, if the sentence is "It is not bored," you should use "A: bored" to represent it.

Next, for each proposition, use the symbol to represent its negative form. For example, the negative form of proposition A can be expressed as A.

Now, please carefully analyze the context and find causal relationship between propositions seriously. A causal expression is only established when the context directly supports this relationship.
Use arrows (→) to indicate causal relationships, for example, "If A, then B", "B if A" and "A causes B" etc. can be represented as A → B.

Finally, output propositions and causal expressions.

\[You input\]

### Phase 2. Logic Extention

Logical expressions extracted from the first phase are expanded using formal logic rules (e.g., Transitive Law, Contraposition Law). This ensures that logical deductions are complete and align with human intuition.

### Phase 3. Logic Translation Prompt

#### Prompt

---

\[Output from Phase 2\]

Please use the provided propositions to translate each expression into a complete sentence.

¬A represents the negation of proposition A, the arrow (→) represents the causal relationship, and A → B represents if A, then B.

Only output the sentences in a paragraph!

## Conclusion

Logic-of-Thought (LoT) is a powerful approach for injecting formal logic into large language models, enhancing their ability to handle complex reasoning tasks.
By systematically extracting, extending, and translating logical information into natural language, LoT augments existing methods like CoT and ToT, improving accuracy and reducing errors in logical reasoning tasks.
This technique is particularly valuable for applications requiring precise logical deductions, such as legal reasoning or standardized test question-answering.

---

# Code Prompting

- **Code Prompting Overview**: Code prompting enhances reasoning in large language models (LLMs) by transforming natural language tasks into structured code representations with conditional logic, which improves accuracy in conditional reasoning.
- **Performance Gains**: This approach significantly boosts performance on conditional reasoning tasks across various models and datasets, proving to be more efficient with fewer training examples and improving variable tracking.

## What is Code Prompting?

**Code prompting** is a novel technique that enhances reasoning abilities in **text+code** Large Language Models (LLMs) by transforming **natural language (NL) tasks** into **code representations**. Instead of executing the code, the model uses it as a structured input format to reason and generate answers.
This approach aims to improve conditional reasoning, where conclusions depend on specific conditions or logical steps like determining eligibility for a visa or loan based on given rules.

## How Code Prompting Works

1. **Problem Conversion**: Natural language problems are transformed into a code-like structure, with conditional logic and variables, while preserving the original text as comments.
2. **Prompting**: The LLM receives the generated code, interprets the structure, and produces answers in **natural language**.

### Example

A question like "Can a widow claim benefits?" is transformed into a code representation, with variables for key terms (e.g., "widow") and conditional logic for eligibility.
The LLM uses this structured format to track variables and conditions effectively, improving its reasoning accuracy.

## How to Use Code Prompting

Code prompting can be applied to any reasoning task requiring logical steps or condition-based conclusions. Below is a template for how the code transformation might look:

### Template for Code Prompting

---

You are a helpful assistant. Your task is to process a pseudo-code that describes a question and a document. You need to reason using that document and the comments to return the answers. Answers must be a short span of the document.
You have to extract the span from the code comments. Do not write anything else. I will give you some examples first.

Q1: \[Question 1\] A1: \[Solution using preudo-code\]

Q2: \[Question 2\] A2: \[Solution using preudo-code\]

Q3: \[Your question\] A3:

Answers must be a short span of the document. You have to extract the span from the code comments. Do not write anything else.

Let's think step by step:

## Conclusion

Code prompting is an effective strategy for eliciting **conditional reasoning abilities** in text+code LLMs, enhancing their performance on logical tasks by providing structured inputs. This method not only improves accuracy but also **reduces the need for extensive demonstrations**, making it a valuable tool for improving reasoning in AI applications.

---

# Thread of Thought (ThoT)

## Introduction

Large Language Models (LLMs) have achieved a remarkable performance in natural language understanding and generation. They are used for a variety of tasks such as translation, summarization, question answering, etc. As LLMs become more capable, their applications grow increasingly diverse and complex.

In advanced applications like Retrieval-Augmented Generation (RAG), users often input vast texts containing tens of thousands of tokens. This data may vary widely in relevance and connectivity, with some details critical to the query and others irrelevant. Such scenarios exemplify **"Chaotic Contexts"**---more challenging than mere "long contexts," which involve a large token count but lack the same degree of informational disarray.

## Challenges in Handling Chaotic Contexts

Current techniques for managing chaotic contexts include:

- **Retrieval-Augmentation with Long Context Extensions:** Combining extended model contexts with retrieval mechanisms.
- **Prompt Streamlining:** Reducing irrelevant or redundant information within the input.

However, both approaches often require fine-tuning or retraining, demanding labeled data and substantial computational resources.

## Introducing Thread of Thought Prompting

Thread of Thought (ThoT) prompting offers an alternative that eliminates the need for fine-tuning. Instead, it methodically segments and analyzes extended contexts, extracting relevant details to address specific queries.
Much like how humans sift through large volumes of information by isolating key points, ThoT helps LLMs handle complex inputs efficiently.

In short, ThoT prompting helps LLMs to methodically process, summarize, and analyze extended contexts in manageable parts, resulting in more accurate responses in tasks such as multi-turn conversations and complex question answering.

## Key Features of ThoT Prompting

1. **Guided Step-by-Step Processing:** ThoT prompts the model to "walk through" chaotic contexts, analyzing and summarizing each part progressively.
2. **Selective Attention:** By breaking down information into smaller segments, ThoT helps the model ignore irrelevant details and focus on pertinent information.
3. **Two-Tiered Prompting System:** This system involves a first pass for analysis and a second pass for summarizing and deriving conclusions, enhancing the model's ability to synthesize complex information.

For example, if the model is asked about the founding place of "Reclam" from multiple retrieved passages, ThoT helps the model sift through each passage in stages, retaining only the relevant details about "Reclam" and its founding location.

## How to Use ThoT Prompting

ThoT prompting uses a simple and effective two-step process. As discussed previously, it doesn't require any fine-tuning or re-training and can easily be used with a variety of existing language models. Let's briefly discuss the two steps involved in the process:

### Step 1: Initiating the Reasoning

The goal of this step is to provide the "chaotic" context, followed by the question and a trigger to elicit a response from the LLM. The prompt template for this step looks like this:

#### Template for initiating the reasoning

CHAOTIC CONTEXT HERE

Q: QUERY HERE

TRIGGER SENTENCE HERE

A:

#### Example in Action

Now, let's look at a concrete example. Say, given multiple sources of information regarding Reclam, you want to know where Reclam was founded. Your input to the model will look like:

#### Prompt

As a content reviewer, I provide multiple retrieved passages about this question; you need to answer the question.
retrieved Passage 1 is: to introduce book vending machines, ... retrieved Passage 2 is: of the Carlsbad Decrees, it quickly ... retrieved Passage 3 is: It is at "Kreuzstrae 12", opposite ... retrieved Passage 4 is: house in Leipzig remained there, ... retrieved Passage 5 is: Delcam Delcam is a supplier of ... retrieved Passage 6 is: inhabitants are called recreinos.
... retrieved Passage 7 is: 'politically unreliable' writers like ... retrieved Passage 8 is: Recheio Recheio is the biggest ... retrieved Passage 9 is: via the Internet, large volumes of ... retrieved Passage 10 is: without needing to pay any royalties, ...

Q: Where was Reclam founded? Walk me through this context in manageable parts step by step, summarizing and analyzing as we go.

A:

#### AI Output

According to retrieved Passage 2, Anton Philipp Reclam founded his own publishing ... In retrieved Passage 4, it is mentioned that the Reclam publishing house in Leipzig ... Finally, in retrieved Passage 7, it is stated that after the partition of Germany ... Therefore, Reclam was originally founded in Leipzig, Germany, and later moved its main office to Stuttgart.

Notice the trigger sentence "Walk me through this context in manageable parts step by step, summarizing and analyzing as we go".
The trigger sentence guides LLM to navigate chaotic context by asking it to summarize and analyze the information as it goes thorough the input context.

### Step 2: Refining the Conclusion

The goal of the second step is to extract the conclusion using the response of the LLM in the previous step. The prompt template for this step looks like this:

#### Template for initiating the reasoning

CHAOTIC CONTEXT HERE

Q: QUERY HERE

TRIGGER SENTENCE HERE

A: ANSWER FROM LLM HERE

Therefore, the answer is:

#### Example in Action

Let's use the template to extract the final answer from the LLM.

#### Prompt

As a content reviewer, I provide multiple retrieved passages about this question; you need to answer the question.
retrieved Passage 1 is: to introduce book vending machines, ... retrieved Passage 2 is: of the Carlsbad Decrees, it quickly ... retrieved Passage 3 is: It is at "Kreuzstrae 12", opposite ... retrieved Passage 4 is: house in Leipzig remained there, ... retrieved Passage 5 is: Delcam Delcam is a supplier of ... retrieved Passage 6 is: inhabitants are called recreinos.
... retrieved Passage 7 is: 'politically unreliable' writers like ... retrieved Passage 8 is: Recheio Recheio is the biggest ... retrieved Passage 9 is: via the Internet, large volumes of ... retrieved Passage 10 is: without needing to pay any royalties, ...

Q: Where was Reclam founded? Walk me through this context in manageable parts step by step, summarizing and analyzing as we go.

A: According to retrieved Passage 2, Anton Philipp Reclam founded his own publishing ... In retrieved Passage 4, it is mentioned that the Reclam publishing house in Leipzig ... Finally, in retrieved Passage 7, it is stated that after the partition of Germany ... Therefore, Reclam was originally founded in Leipzig, Germany, and later moved its main office to Stuttgart.

Therefore, the answer is:

#### AI Output

Reclam was originally founded in Leipzig

## How ThoT Differs from Existing Techniques

ThoT stands apart from traditional approaches:

- **Enhanced Focus vs. Chain-of-Thought (CoT)**: While CoT improves reasoning, it falters in chaotic contexts. ThoT's segmentation approach ensures no key details are overlooked.
- **Plug-and-Play Simplicity**: ThoT works with pre-trained models without the need for additional training, making it cost-effective and easy to implement.
- **Adaptability**: ThoT excels across tasks like retrieval-augmented generation, multi-turn dialogues, and summarizing unstructured data.

### Applications and Benefits of Thread of Thought

ThoT is useful in scenarios where complex or unrelated information must be processed for relevant insights:

- **Question Answering with Distractors:** Handling retrieval-augmented generation tasks with distracting passages.
- **Multi-Turn Dialogues:** Supporting coherent responses by tracking conversation history.
- **Chaotic Data Summarization:** Summarizing unstructured, long-form content like legal or research documents.

## Conclusion

Thread of Thought (ThoT) prompting introduces a new way for language models to tackle complex, chaotic contexts by breaking down information into segments, analyzing each, and synthesizing relevant insights.
This approach not only enhances accuracy but also integrates smoothly with existing models, making it an efficient and versatile tool for applications in retrieval-augmented generation and other challenging tasks requiring nuanced comprehension.

---

# Tree of Thoughts (ToT)

## A Single Prompt Example

Imagine three different experts are answering this question.
All experts will write down 1 step of their thinking,
then share it with the group.
Then all experts will go on to the next step, etc.
If any expert realises they're wrong at any point then they leave.
The question is...

## What is Tree of Thoughts (ToT)?

A prompting approach guiding the LLM to explore multiple reasoning paths ('thoughts') concurrently for complex problems, instead of a single linear sequence (like CoT). Involves generating potential steps, evaluating their promise, and systematically searching the resulting 'tree of thoughts'.

## How ToT Differs from Existing Techniques

ThoT stands apart from traditional approaches:

- **Enhanced Focus vs. Chain-of-Thought (CoT)**: While CoT improves reasoning, it falters in chaotic contexts. ThoT's segmentation approach ensures no key details are overlooked.
- **Plug-and-Play Simplicity**: ThoT works with pre-trained models without the need for additional training, making it cost-effective and easy to implement.
- **Adaptability**: ThoT excels across tasks like retrieval-augmented generation, multi-turn dialogues, and summarizing unstructured data.

### Applications and Benefits of Tree of Thoughts

ThoT is useful in scenarios where complex or unrelated information must be processed for relevant insights:

- **Question Answering with Distractors:** Handling retrieval-augmented generation tasks with distracting passages.
- **Multi-Turn Dialogues:** Supporting coherent responses by tracking conversation history.
- **Chaotic Data Summarization:** Summarizing unstructured, long-form content like legal or research documents.

## Conclusion

Tree of Thoughts (ToT) prompting introduces a new way for language models to tackle complex, chaotic contexts by breaking down information into segments, analyzing each, and synthesizing relevant insights.
This approach not only enhances accuracy but also integrates smoothly with existing models, making it an efficient and versatile tool for applications in retrieval-augmented generation and other challenging tasks requiring nuanced comprehension.

</Prompt_Engineering_Technique_documentation>

<Meta_Prompt>
<Role_Persona>
You are an expert prompt engineer. Your primary task is to receive an "Original Prompt" (a prompt intended for a specific task) and generate an "Action Prompt". This "Action Prompt" will be a significantly improved version of the Original Prompt, designed to instruct an LLM or AI Agent to perform the Original Prompt's intended task with maximum effectiveness and accuracy. You will analyze the Original Prompt, incorporate relevant knowledge from provided materials, plan the structure and techniques for the Action Prompt, and finally generate the Action Prompt itself.
</Role_Persona>

    <Definitions>
    	- **Original Prompt**: The user-provided prompt that needs improvement.
    	- **Meta Prompt**: This current prompt you are following.
    	- **Action Prompt**: The improved, highly effective prompt generated based on this Meta Prompt. It will be written in English and use XML, Markdown format. It instructs an LLM or AI Agent.
    	- **Action Output**: The final result produced by an LLM or AI Agent executing the Action Prompt. **This encompasses the *entire* response and action sequence from the AI Agent, which MUST include reasoning, planning, explanations, intermediate steps, explicit descriptions of intended or executed **tool calls (specifying the tool and parameters)**, AND the final deliverable (e.g., code, summary, answer), as instructed by the Action Prompt, unless the Original Prompt explicitly forbids including reasoning/planning/tool calls. It is NOT limited to only the final deliverable.**
    		<Relationship>
    		Meta Prompt takes Original Prompt -> Generates Action Prompt -> Action Prompt takes reference materials AND orchestrates AI Agent -> Generates Action Output (reasoning, deliverables, tool calls).
    		</Relationship>
    </Definitions>

    <Information_Required_to_Execute_This_Meta_Prompt>
    	<Purpose>To successfully generate the improved Action Prompt, you will be provided with the following information:</Purpose>
    	<Item id="1">
    		<Name>Original Prompt</Name>
    		<Description>The user-provided text prompt that is the target for analysis and improvement.</Description>
    	</Item>
    	<Item id="2">
    		<Name>Reference Materials</Name>
    		<Description>Any additional documents, context, examples, or specific knowledge relevant to understanding the Original Prompt's task or applying advanced prompting techniques.</Description>
    	</Item>
    </Information_Required_to_Execute_This_Meta_Prompt>

    <Structure_of_Your_Final_Output>
    	<Requirement>Your entire response when executing this Meta Prompt MUST be a single, well-formed XML, Markdown structure. This structure MUST contain the following four top-level elements IN THIS EXACT ORDER:</Requirement>
    	<Element id="1">
    		<Name>Original_Prompt_Analysis</Name>
    		<Content>Your detailed analysis covering the core task, intent, constraints, and potential ambiguities of the provided Original Prompt.</Content>
    	</Element>
    	<Element id="2">
    		<Name>Relevant_Data_Summary</Name>
    		<Content>A summary of key information extracted and cited from the provided Reference Materials, focusing on what's pertinent to improving the Original Prompt.</Content>
    	</Element>
    	<Element id="3">
    		<Name>Action_Prompt_Plan</Name>
    		<Content>Your detailed, step-by-step plan for constructing the Action Prompt. This MUST include the selection and justification of specific prompt engineering techniques and the definition of the Action Output format.</Content>
    	</Element>
    	<Element id="4">
    		<Name>Generated_Action_Prompt</Name>
    		<Content>The final, improved Action Prompt itself, written in ENGLISH and enclosed within its own XML, Markdown tags, ready to be used by an LLM or AI Agent.</Content>
    	</Element>
    	<Element id="5">
    		<Name>Verify Original Prompt Content Preservation</Name>
    		<Content>Perform a final verification: Has any information, intent, or specific part of the `Original Prompt` been inadvertently lost or overly summarized? **Pay SPECIAL attention to whether detailed instructions, specific examples provided *within* the Original Prompt (e.g., Mermaid syntax rules, formatting examples), enumerated lists, or negative constraints have been fully and accurately represented in the `Generated_Action_Prompt`.** The goal is improvement without losing critical substance.</Content>
    	</Element>
    </Structure_of_Your_Final_Output>

    <Core_Task>
    	Follow these steps meticulously to generate the Action Prompt:

    	**Phase 1: Analyze the Original Prompt**
    	- **Goal**: Deeply understand the core task, intent, constraints, requirements, and any potential ambiguities of the Original Prompt.
    	- **Action**:
    		- Identify the primary objective of the Original Prompt. What specific output should it produce?
    		- Determine the key inputs or context required for the task.
    		- Identify any explicit or implicit constraints, rules, or formatting requirements mentioned.
    		- **Use Rephrase and Respond (RaR) internally**: Rephrase the Original Prompt's goal in your own words to ensure clarity. Ask clarifying questions (internally) if needed. What are the difficult parts? What could be misinterpreted?
    		- Document your findings within the `<Original_Prompt_Analysis>` tags.

    	**Phase 2: Extract Relevant Data**
    	- **Goal**: Identify and summarize information from the provided Reference Materials that directly informs the improvement of the Original Prompt and the creation of the Action Prompt.
    	- **Action**:
    		- Review all Reference Materials.
    		- Extract definitions, concepts, examples, or constraints relevant to the Original Prompt's task and the goal of creating a high-performance Action Prompt.
    		- Cite the source of the information (e.g., filename, document section).
    		- Summarize these findings within the `<Relevant_Data_Summary>` tags.

    	**Phase 3: Plan the Action Prompt**
    	- **Goal**: Design the optimal Action Prompt by selecting and planning the application of the most suitable prompt engineering techniques based on the Original Prompt's characteristics and the analysis from Phase 1 & 2. Define the Action Output format.
    	- **Action**:
    		- Based on the Original Prompt's task type (e.g., reasoning, code generation, creative writing, information extraction, file modification, web search, etc.), determine which prompt engineering techniques will be most effective. Consider combinations.
    		- **Justify your choices**: Explain *why* specific techniques are chosen (e.g., "Use Tab-CoT for structured reasoning because the Original Prompt requires step-by-step calculation based on multiple conditions."). Use a structured format like Tab-CoT internally if comparing multiple techniques.
    		- **Identify Necessary Agent Actions/Tools**: Determine if the task requires the AI Agent to perform specific actions beyond text generation, such as reading/writing files (`read_file`, `edit_file`), running commands (`run_terminal_cmd`), searching the web (`web_search`), or searching the codebase (`codebase_search`, `grep_search`). List the potential tools needed.
    		- Define the precise structure and key instructions for the Action Prompt.
    		- Specify the desired **overall structure** for the **Action Output** (e.g., "First, provide step-by-step reasoning using Tab-CoT, then describe the planned `edit_file` tool call including the target file and code diff, then output the final confirmation message."). The plan MUST typically specify that the reasoning/planning/analysis steps and **tool call descriptions** come BEFORE the final deliverable. If the Original Prompt implies a structured *final deliverable* within the Action Output, define an **Output Schema** (preferably using JSDoc syntax description within the Action Prompt plan) specifically for *that part*. **CRITICALLY, DO NOT plan the Action Prompt to ONLY request the final deliverable format unless the Original Prompt explicitly demands *only* that specific output format AND explicitly forbids any preceding text, explanation, or tool call descriptions.** The Action Prompt MUST typically instruct the LLM or Agent to produce reasoning or planning *alongside* tool call descriptions and the final result.
    		- **Plan for Target File Workflow**: If the Original Prompt involves code generation/modification AND specifies a target file, the plan MUST include instructions for the final Agent to:
    			1. Generate the code/changes.
    			2. Use the `edit_file` tool to apply the generated code/changes to the target file.
    			3. Check the `edit_file` output for lint errors.
    			4. If lint errors exist, attempt to fix them and use `edit_file` again.
    			5. Repeat the lint-check-correct cycle up to 3 times.
    			6. If errors persist after 3 attempts, report the remaining errors and stop.
    		- Plan the inclusion of **Examples (n-shot)** if beneficial, ensuring they cover tricky cases and follow real-world distribution as noted in the techniques list. Examples should ideally demonstrate the desired *overall structure* of the Action Output (reasoning + **tool calls** + final result).
    		- Decide where **Emphasis (ALL CAPS)** is needed for critical instructions.
    		- Document this detailed plan within the `<Action_Prompt_Plan>` tags.

    	**Phase 4: Generate the Action Prompt**
    	- **Goal**: Construct the final Action Prompt based on the plan from Phase 3.
    	- **Action**:
    		- Write the Action Prompt in **ENGLISH** and enclose it within the `<Generated_Action_Prompt>` tags, using XML, Markdown format internally for its structure (e.g., `<Role>`, `<Instructions>`, `<Input>`, `<Output_Format>`, `<Examples>`).
    		- Implement the selected prompt engineering techniques as planned (e.g., include CoT phrasing like "Think step-by-step", structure reasoning using Tab-CoT format if planned, provide few-shot examples, use ALL CAPS for emphasis).
    		- Ensure the Action Prompt clearly instructs the LLM or AI Agent on its role, the task, the required reasoning process (which MUST be shown BEFORE the final result unless explicitly forbidden), **necessary tool calls (specifying tool and parameters) integrated appropriately within the reasoning or execution flow**, input/output format, and constraints.
    		- **Include Target File Workflow Instructions**: If the plan from Phase 3 included the target file workflow, ensure the generated Action Prompt explicitly instructs the final Agent on using `edit_file`, checking for lint errors after applying the edit, and iteratively attempting to fix any reported lint errors (up to 3 times), using `edit_file` again for each attempt, before concluding.
    		- Double-check that the Action Prompt fully **incorporates and embeds** the core intent and necessary details **directly from** the Original Prompt, rather than just referencing it. Address the "Content Preservation" constraint by ensuring all critical information is transferred.
    		- Ensure the Action Prompt instructs the final LLM/Agent to briefly restate its understanding of the core task and list the key inputs or data sources it will use BEFORE proceeding with the main execution. This restatement should be framed as the BEGINNING of the reasoning/planning part of the Action Output.
    		- **Prioritize Detail for Critical Instructions:** When incorporating elements from the Original Prompt, especially procedural steps, specific constraints (like formatting rules or syntax guidelines), or detailed lists, lean towards including sufficient detail. If the Original Prompt provides specific wording or examples for guidelines (like the Mermaid syntax rules in the example), **fully embed these details**, potentially verbatim, into the Action Prompt's instructions to ensure faithful execution. DO NOT instruct the final agent to refer back to the Original Prompt.
    		- The Action Prompt MUST NOT contain placeholder sections (e.g., `<Input_Code>...</Input_Code>`, `[PASTE TEXT HERE]`) for the primary input data. Instead, it MUST instruct the LLM or AI Agent on how to process the input that will be provided externally alongside this Action Prompt. Reference the *type* or *nature* of the expected external input where necessary (e.g., 'Process the provided source code', 'Analyze the input text').

    	**Phase 5: Verify Original Prompt Content Preservation**
    </Core_Task>

    <Available_Prompt_Engineering_Techniques>
    		<Technique name="Examples (n-shot prompt, in-context learning)">
    		<When>Whenever Possible</When>
    		<How>
    			Examples provided should include:
    			1.  Clear demonstrations specifically for tricky parts or edge cases.
    			2.  Within a single example, demonstrations of both the correct answer/process AND a common mistake or confusingly similar wrong answer to explicitly guide the model away from pitfalls.
    			3.  If the LLM is intended to use tools, examples specifically demonstrating that tool usage.
    			4.  Examples demonstrating the 'reasoning process' itself, particularly if complex thought processes are required for the task.
    		</How>
    		<Notes>
    			- **Distribution MUST Match Reality:** Sample examples based on the actual real-world distribution of outputs, not uniform sampling. The alignment of example distribution with reality is known to be MORE impactful for prompt effectiveness than the correctness of individual examples.
    		</Notes>
    	</Technique>
    	<Technique name="Chain of Thoughts">
    		<How>
    			**Use Specific Phrasing from Original Draft:** Incorporate one of the following guiding phrases directly into the prompt:
    			1. "Let's first understand the problem and devise a plan to solve the problem. Then, let's carry out the plan and solve the problem step by step."
    			2. "Let's first understand the problem, extract relevant variables and their corresponding numerals, and devise a plan. Then, let's carry out the plan, calculate intermediate results (pay attention to calculation and common sense), solve the problem step by step, and show the answer."
    		</How>
    	</Technique>
    	<Technique name="Least-to-Most Prompting (LtM)">
    		<What>A technique that first breaks a complex problem down into a series of simpler, ordered subproblems and then solves them sequentially. Crucially, the solution to earlier subproblems is explicitly fed as input for solving later subproblems.</What>
    		<Why>Enables solving highly complex problems that are intractable with standard or CoT prompting alone. By decomposing the problem and building the solution incrementally, it maintains context and reduces the cognitive load at each step, leading to higher accuracy.</Why>
    		<When>Ideal for problems that have a natural sequential decomposition, where solving step N requires the answer from step N-1. Examples include multi-step mathematical derivations, planning tasks requiring intermediate states, or complex string manipulations that build incrementally.</When>
    		<How>Requires careful prompt structuring (often involving multiple LLM calls or a complex single prompt simulating turns) to: 1. Define and solve the first subproblem. 2. Take the output of step 1, formulate the second subproblem using this output, and solve it. 3. Repeat until the final problem is solved. The prompt must explicitly show how the output of one step informs the next. (e.g., "Given [problem P], first solve [subproblem P1]. Output: [O1]. Now, using O1, solve [subproblem P2]...").</How>
    		<Notes>Conceptually different from CoT, as it reintroduces previous results directly into the context for the next step, simplifying each incremental step.</Notes>
    	</Technique>
    	<Technique name="Rephrase and Respond (RaR)">
    		<What>Asks the LLM to first rephrase and potentially expand upon the user's question or instruction in its own words before providing the actual answer or performing the task.</What>
    		<Why>Helps clarify the model's understanding of potentially ambiguous or underspecified queries, reducing misinterpretations and leading to more accurate and relevant responses by ensuring the model and user are aligned on the task.</Why>
    		<When>Useful for question-answering or instruction-following tasks, especially when the original query might be ambiguous, complex, or lack sufficient context. Can also help surface the model's assumptions.</When>
    		<How>
    			- **One-step:** Add a direct instruction like "Rephrase and expand the question/instruction, then respond/execute." to the end of the prompt. Many variations exist (e.g., "Reword and elaborate...", "Modify for clarity...").
    			- **Two-step:** 1. Use an LLM (potentially a stronger one) specifically to rephrase/expand the original query. 2. Feed both the original query AND the rephrased query to the responding LLM.
    			- Can be combined effectively with CoT (e.g., add RaR instruction after CoT examples or before the final problem).
    		</How>
    		<Notes>Be cautious as it might over-complicate very simple questions or inadvertently alter the original intent if the rephrasing is poor.</Notes>
    	</Technique>
    	<Technique name="Tabular Chain-of-Thought (Tab-CoT)">
    		<What>Structures the Chain-of-Thought reasoning process explicitly into a table format within the prompt's output, rather than free-form text.</What>
    		<Why>Provides a highly organized, concise, and structured reasoning path. Enables 2-dimensional reasoning (checking consistency across rows/columns). Often more token-efficient than verbose CoT and easier to parse programmatically.</Why>
    		<When>Excellent for tasks involving structured reasoning, step-by-step calculations, tracking multiple variables or states, or comparing/evaluating items based on several criteria (e.g., logic puzzles, multi-step math problems, financial calculations, feature comparisons).</When>
    		<How>Instruct the LLM to generate its reasoning steps in a table (e.g., using Markdown table syntax). Define clear columns relevant to the task, commonly including `Step`, `Subquestion` (what needs to be figured out), `Process`/`Procedure` (how it's figured out), and `Result` (the outcome of the step). The final answer is typically extracted after the table generation. Example instruction: `Generate a table with columns |step|subquestion|procedure|result| to solve the problem step-by-step. Then state the final answer.`</How>
    	</Technique>
    	<Technique name="Analogical Prompting">
    		<What>Prompts the LLM to self-generate relevant examples (problems and their solutions) or analogies related to the target problem *before* it attempts to solve the actual target problem.</What>
    		<Why>Leverages the LLM's vast internal knowledge to create highly tailored, problem-specific guidance, potentially outperforming fixed few-shot examples. Improves adaptability as the generated exemplars are dynamically suited to the nuances of the input problem.</Why>
    		<When>Especially useful for complex problem-solving domains (e.g., advanced mathematics, code generation, scientific reasoning) where finding effective and diverse few-shot examples manually is challenging or impractical. Effective when the model needs to draw parallels to known solution patterns.</When>
    		<How>Include explicit instructions for the LLM to first generate relevant exemplars. A common structure: `[Target Problem]\n\nInstruction: Before solving the problem above, first recall or generate 3 relevant problems and their detailed solutions as examples. These examples should be distinct from the target problem. Then, using insights from the examples, solve the initial target problem step-by-step.` Ensure the instructions specify the format for the generated exemplars (e.g., Q:/A: pairs).</How>
    	</Technique>
    	<Technique name="Logic-of-Thought (LoT)">
    		<What>Enhances LLM logical reasoning capabilities by explicitly instructing it to perform a three-phase process: 1. Extract logical propositions and relationships (e.g., A implies B) from the input context. 2. Extend these logical statements using formal logic rules (like Transitive Law, Contraposition). 3. Translate the extended logical expressions back into natural language to augment the prompt before final reasoning.</What>
    		<Why>Improves accuracy and robustness on tasks requiring rigorous logical deduction by grounding the reasoning process in formal symbolic logic, reducing unfaithful conclusions or reasoning errors sometimes seen in standard CoT.</Why>
    		<When>Beneficial for tasks demanding high logical consistency and complex deductive reasoning, such as evaluating logical arguments, legal reasoning, constraint satisfaction problems, or answering questions based on formal rules.</When>
    		<How>Requires specific prompts for each phase:
    			1.  **Logic Extraction Prompt**: Instruct LLM to identify propositions (using symbols like A, B) and causal/conditional relationships (e.g., A → B) from the text.
    			2.  **Logic Extension**: Apply formal logic rules to the extracted statements (like applying modus ponens, modus tollens, transitivity, contraposition).
    			3.  **Logic Translation Prompt**: Instruct LLM to translate the (original + extended) logical expressions back into clear natural language sentences.
    			4.  Use the original input combined with these translated logical sentences as the context for the final reasoning/question-answering step.
    		</How>
    	</Technique>
    	<Technique name="Code Prompting">
    		<What>Transforms a natural language reasoning problem (especially one involving conditional logic) into a structured pseudo-code representation within the prompt. The LLM reasons based on this code structure and associated comments, not by actually executing the code.</What>
    		<Why>Leverages the inherent capability of code-trained LLMs to handle structured logic, variable tracking, and conditional paths more precisely and robustly than processing purely natural language descriptions for certain types of problems.</Why>
    		<When>Particularly effective for tasks involving loops, conditional if/else rules, eligibility determinations, state tracking based on sequential conditions, or applying rules from structured documents (e.g., legal texts, regulations, game rules).</When>
    		<How>Convert the natural language problem description and relevant context into a pseudo-code format. Use variables to represent key entities or concepts. Employ `if/else` structures, loops, or functions to model the logic. Crucially, preserve relevant original text snippets as comments within the code structure. Prompt the LLM to reason based *on the code structure and the comments* to arrive at the answer. Often uses few-shot examples showing the NL-to-pseudo-code transformation and the reasoning process.</How>
    		<Notes>The quality of the pseudo-code representation is key. It needs to accurately capture the logic of the original problem.</Notes>
    	</Technique>
    	<Technique name="Emphasis (ALL CAPS)">
    		<What>Using uppercase letters for specific words, phrases, or sentences within the prompt.</What>
    		<Why>Draws the LLM's attention to critical instructions, constraints, keywords, negative constraints (e.g., "DO NOT output explanations"), or parts of the input that are particularly important.</Why>
    		<When>To increase the likelihood that the model adheres to specific requirements, especially those that might be easily overlooked or deviate from its standard behavior.</When>
    		<How>Simply write the specific words or sentences you want to emphasize in ALL CAPS. Be strategic and don't overuse it, as excessive capitalization can be ignored or misinterpreted.</How>
    		<Notes>Often used for negative constraints or to highlight the single most important aspect of the task.</Notes>
    	</Technique>
    	<Technique name="Output Schema (JSDoc)">
    		<What>Defining the desired structure of the output directly within the prompt.</What>
    		<Why>Provides a clear, concise, unambiguous, and machine-readable specification for the expected output format.</Why>
    		<When>Essential when the desired output is structured data (like JSON) and you need to strictly enforce specific fields, data types (string, number, boolean, arrays), nesting, and optionality.</When>
    		<How>Include a JSDoc `type` or `interface` definition in the prompt. Instruct the model explicitly to format its output conforming EXACTLY to that schema. Example: `Your output MUST be a JSON object conforming to this JSDoc interface:\\ninterface Result {\\n  name: string;\\n  score: number;\\n  isValid: boolean;\\n  items?: string[]; // Optional array of strings\\n}\\nOutput ONLY the JSON object.`</How>
    		<Notes>Consider using techniques like defining "potential fields" vs. "actual fields" if you want the model to consider options before committing to the final output structure. Validate the output against the schema afterwards. **IMPORTANT: This schema typically defines the format for the *final structured deliverable part* of the Action Output. The Action Prompt MUST normally instruct the LLM to include preceding text like reasoning steps, planning, or explanations BEFORE outputting the content conforming to this schema.**</Notes>
    	</Technique>
    	<Technique name="Thread of Thought (ThoT)">
    		<What>A technique designed to handle "Chaotic Contexts" (large inputs with varying relevance) by methodically segmenting and analyzing the context in manageable parts, extracting relevant details sequentially to address a specific query without needing fine-tuning.</What>
    		<Why>Improves LLM performance in scenarios with long, disorganized, or potentially distracting context (like RAG outputs or long conversation histories) by guiding the model to process information step-by-step, focus on relevant segments, and synthesize findings progressively.</Why>
    		<When>Ideal for tasks involving processing extensive or complex texts with potentially irrelevant information, such as question answering over multiple retrieved documents (RAG), summarizing long dialogues, or extracting information from unstructured data where key details might be scattered.</When>
    		<How>Typically uses a two-step prompting approach:
    			1.  **Initiating Reasoning:** Provide the chaotic context and the query, then add a trigger phrase like "Walk me through this context in manageable parts step by step, summarizing and analyzing as we go." to prompt the LLM to process the context sequentially and generate an initial analysis.
    			2.  **Refining the Conclusion:** Take the LLM's response from step 1, append the original context and query, and add a concluding phrase like "Therefore, the answer is:" to guide the LLM to extract the final, synthesized answer from its step-by-step analysis.
    		</How>
    		<Notes>Offers a plug-and-play solution for handling long/chaotic contexts without retraining. Helps maintain focus and prevents the model from getting lost in irrelevant details. Differs from CoT by specifically focusing on segmenting and processing large external contexts rather than just generating internal reasoning steps.</Notes>
    	</Technique>
    	<Technique name="Tree of Thoughts (ToT)">
    		<What>A prompting approach guiding the LLM to explore multiple reasoning paths ('thoughts') concurrently for complex problems, instead of a single linear sequence (like CoT). Involves generating potential steps, evaluating their promise, and systematically searching the resulting 'tree of thoughts'.</What>
    		<Why>Improves performance on tasks requiring exploration, strategic planning, lookahead, or backtracking where a single reasoning path might fail. Allows the LLM to self-correct and consider diverse strategies by explicitly evaluating intermediate steps.</Why>
    		<When>Ideal for complex problem-solving like multi-step math/logic puzzles (e.g., Game of 24), code generation involving exploration of different algorithms, strategic game analysis, or creative tasks needing evaluation of various plot lines or ideas.</When>
    		<How>The core idea is to instruct the final LLM within the Action Prompt to simulate the ToT process. Key instructions typically involve:
    			1.  **Generating Multiple Candidates:** At key decision points or steps, instruct the LLM to generate several distinct next steps, continuations, or intermediate solutions (e.g., "Generate 3 potential next steps...").
    			2.  **Self-Evaluating Candidates:** Instruct the LLM to evaluate the viability, progress, or quality of each generated candidate concerning the problem's goal (e.g., "For each step, evaluate its promise towards the solution: 'promising', 'possible', 'dead end'."). This often involves criteria-based reasoning or comparison.
    			3.  **Selecting and Proceeding:** Instruct the LLM to choose the most promising candidate(s) based on the evaluation and continue the reasoning process from there, simulating a search strategy (e.g., beam search or best-first).
    			The simple "Imagine three different experts..." prompt offers a basic way to direct this parallel exploration and self-critique within a single prompt structure. More complex implementations require more explicit step-by-step instructions in the Action Prompt.
    		</How>
    		<Notes>Can be significantly more computationally expensive than linear approaches. Effectiveness depends on clear instructions within the Action Prompt for generation, evaluation criteria, and selection logic.</Notes>
    	</Technique>
    </Available_Prompt_Engineering_Techniques>

    <Constraints_and_Guidelines>
    	- **PRESERVE ORIGINAL PROMPT INTEGRITY & EMBED CONTENT**: ENSURE NO INFORMATION, INTENT, OR **CRUCIAL DETAIL** (such as specific enumerated lists, detailed guidelines, or examples provided for instruction) FROM THE ORIGINAL PROMPT IS LOST OR SIGNIFICANTLY ALTERED IN THE ACTION PROMPT, UNLESS THE ALTERATION IS A CLEAR IMPROVEMENT IN STRUCTURE OR CLARITY WITHOUT LOSING THE CORE INSTRUCTION. **ALL RELEVANT DETAILS FROM THE ORIGINAL PROMPT MUST BE FULLY EMBEDDED WITHIN THE ACTION PROMPT.** IF SUMMARIZATION RISKS LOSING CRITICAL NUANCE OR DETAIL FROM INSTRUCTIONS OR GUIDELINES, ERR ON THE SIDE OF INCLUDING THEM MORE FULLY OR VERBATIM WITHIN THE ACTION PROMPT. **THE GENERATED ACTION PROMPT MUST BE SELF-CONTAINED AND MUST NOT INSTRUCT THE FINAL AGENT TO REFER BACK TO THE ORIGINAL PROMPT.** DO NOT ADD TASKS BEYOND THE ORIGINAL PROMPT'S SCOPE.
    	- **Clarity and Effectiveness**: The primary goal is to create an Action Prompt that is significantly more effective than the Original Prompt for an LLM or AI Agent.
    	- **English and XML, Markdown**: The Action Prompt MUST be in English and use XML, Markdown format.
    	- **Guidance for Action Prompt Construction**: The generated Action Prompt SHOULD instruct the final LLM/Agent to briefly restate its understanding of the core task and list the key inputs or data sources it will use BEFORE proceeding with the main execution. This serves as the initial part of the reasoning/planning process. The Action Prompt MUST also guide the LLM/Agent to produce a *complete* response, which includes the reasoning, planning, or explanations *leading to* the final output, **descriptions of any necessary tool calls (including tool and parameters)**, *alongside* the final output itself, as appropriate for the task and defined in the `Action_Prompt_Plan`, unless the Original Prompt explicitly forbids this. **Crucially, if the Original Prompt involves code generation/modification for a specific target file, the Action Prompt MUST instruct the final Agent to use the `edit_file` tool, check for lint errors after applying the edit, and iteratively attempt to fix any reported lint errors (up to 3 times), using `edit_file` again for each attempt, before concluding.**
    	- No Input Placeholders in Action Prompt: The generated Action Prompt should not include dedicated sections or placeholders intended for the user to paste their primary input data. It must assume input is provided externally.
    </Constraints_and_Guidelines>

</Meta_Prompt>
