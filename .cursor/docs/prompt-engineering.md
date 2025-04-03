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

## What is Analogical Prompting?

**Analogical Prompting** is a new approach that enhances the reasoning process of Large Language Models (LLMs) by drawing inspiration from human analogical reasoning. Inspired by our ability to draw connections between past experiences and current challenges, analogical prompting encourages LLMs to self-generate relevant examples before tackling new problems.

For example, if you're asked to solve a complex math problem, you might think of similar problems you've solved before and apply that knowledge. Similarly, analogical prompting instructs LLMs to recall or generate examples and solutions that resemble the current task.
The LLM then uses these examples to better solve the original problem.

## How Does Analogical Prompting Work?

1. **Problem Statement**: The LLM is presented with a problem.
2. **Generate Exemplars**: It generates relevant problems and their solutions as exemplars.
3. **Solve Original Problem**: The LLM uses these exemplars to solve the initial problem.

This method not only removes the need for manually labeled examples but also tailors the exemplars to the specific problem, making it more adaptive.

## How Does Analogical Prompting Differ from Existing Techniques?

Analogical Prompting builds upon and improves earlier prompting techniques such as:

- Zero-Shot Chain-of-Thought (CoT): LLMs are guided to "think step by step," but this guidance may be too generic for complex tasks. Analogical prompting generates demonstrations and does this automatically.
- Chain-of-Thought (CoT): LLMs are given labeled examples to mimic reasoning processes, but acquiring these labeled examples is labor-intensive. The generated examples through Analogical Prompting are customized for each problem, which improves adaptability compared to the fixed exemplars in Few-Shot CoT.

## How to Use Analogical Prompting

Analogical Prompting can be implemented with a specific instruction template in the LLM's input. Here's a general template you can follow:

### Template

---

\[Insert problem here\]

Instruction: Relevant problems: Solve the initial problem:

### Sample Prompt

---

Your task is to tackle mathematical problems. When presented with a math problem, recall relevant problems as examples. Afterward, proceed to solve the initial problem.

\[Insert problem here\]

Instruction: Relevant problems: Recall examples of math problems that are relevant to the initial problem. Your problems should be distinct from each other and from the initial problem (e.g., involving different numbers and names).

For each problem: After "Q: ", describe the problem After "A: ", explain the solution.

Solve the initial problem:

### Example

If the problem is to calculate the area of a square given its vertices, the model first generates a similar problem with a known side length, solves it, and then applies this reasoning to the original problem.

#### Prompt

---

Q: What is the area of the square with the four vertices at (-2, 2), (2, -2), (-2, -6), and (-6, -2)?

Recall relevant problems: Solve the initial problem:

#### AI Output

---

```markdown
# Relevant exemplars

Q: What is the area of the square with a side length of 5? A: The area of a square is found by squaring the length of its side. So, the area of this square is 5^2 = 25. ...

# Solve the initial problem

To find the area of the square, we need to find the side length. The length is ... \\sqrt-8 \= \\sqrt32. So, the area of the square is (\\sqrt32)^2 = 32.

## Results of Analogical Prompting

Analogical prompting has been tested across various tasks including math problem-solving and code generation. The results show that it consistently outperforms both Zero-Shot and Few-Shot CoT methods.

### Performance Comparison on GSM8K (Math Dataset)

Analogical prompting particularly shines in complex tasks that require reasoning across multiple steps, such as solving competitive programming challenges or advanced math problems.
```

## Conclusion

Analogical prompting allows LLMs to generate their own reasoning examples tailored to each problem, offering a flexible and powerful method to guide reasoning without the need for labeled data.
This approach improves performance on reasoning tasks and opens new possibilities for solving more complex problems where fixed examples are impractical or unavailable.

---

# Logic-of-Thought (LoT)

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