# Code Documentation Request

The attachment of this file means that your job is to document the code provided.
Please analyze the given code and create a systematic markdown document in Korean. **The core purpose of the document is to help readers clearly understand the intention and implementation of the code**. Please actively use **visual tools** such as diagrams and tables along with text explanations to help intuitively understand the structure and flow of the code.

## Step 1: Code Analysis

First, thoroughly analyze the code to identify the following:

- Main purpose and functionality of the code
- Programming language and frameworks/libraries used
- Level of code complexity
- Key components/functions/classes/variables and their relationships
- Data flow structure
- **Code parts and patterns that developers might easily confuse or misunderstand**
- **Identify code sections that would be easier to understand when visualized**

## Step 2: Documentation Planning

Based on the analysis results, establish a documentation plan:

- Main section composition of the document
- Range of code examples to include
- **Determine code elements to visualize and diagram types**
- **Detailed explanation methods for easily confused parts**
- Necessary diagrams or visual elements
- Balance of explanations for both beginners and experts

### In addition to what's written here, use your creativity and initiative to think about what would help readers when looking at the provided code. Beyond the typical content found in documentation, what additional information would help people understand the provided code more easily, clearly, and quickly?

## Step 3: Document Creation

Create a systematic document including the following elements:

### Essential Elements

- **Overview**: Explanation of the code's purpose, functionality, and use cases
- **Architecture/Structure**: Overall code structure and relationships between major components
- **Core Functionality Explanation**: Role and operating principles of each major function/class/module
- **API Documentation** (if applicable): Parameters, return values, exception handling, etc.
- **Usage Examples**: Simple and clear examples that demonstrate how to actually use the code
- **Easily Confused Parts**: Explicitly include explanations for parts that could be confusing
- In addition to what's written here, use your creativity and initiative to think about what would help readers when looking at the provided code. Beyond the typical content found in documentation, what additional information would help people understand the provided code more easily, clearly, and quickly?

### Visual Diagrams

- **Actively use Mermaid diagrams**: Provide diagram code that can be directly included in markdown
- **Flowcharts**: Visualize code execution flow and major branching points
- **Sequence Diagrams**: Represent object interactions and method call order
- **Class Diagrams**: Express class structure, inheritance relationships, dependencies
- **State Diagrams**: Represent state transitions for code where state changes are important
- **ER Diagrams**: Express entity relationships if data models are included
- **Component Diagrams**: Express system components and dependencies

#### Precautions when creating Mermaid diagrams

##### Avoiding text parsing errors in Mermaid diagrams

###### Guidelines to Prevent Mermaid Diagram Parsing Errors

When creating Mermaid diagrams, using certain characters inside nodes can cause parsing errors. Especially special characters like **parentheses()**, **periods(.)**, and **question marks(?)** can cause problems.

1. When creating Mermaid diagrams, using certain characters inside nodes can cause parsing errors. Especially special characters like **parentheses()**, **periods(.)**, and **question marks(?)** can cause problems.
2. Always enclose node text containing special characters (`()`, `#`, `:`, etc.) in double quotes (`"`)
3. For subgraph titles, use double quotes around any text containing spaces or special characters
4. For sequence diagram messages, enclose complex text in quotes
5. Keep node IDs simple (alphanumeric) and only use special characters in the displayed text
6. When using HTML tags like `<br/>`, ensure the entire text is quoted
7. For long text, consider using line breaks instead of cramming everything into one node

###### Error Example

The following code causes parsing errors:

```mermaid
flowchart TD
    A[Start] --> B{Check function() call?}
    B --> C[Next step(process)]
```

In this code, the parts `B{Check function() call?}` and `C[Next step(process)]` cause parsing errors.

###### Error Cause

In Mermaid syntax:

- **Square brackets []** and **curly braces {}** define node shapes
- Parentheses() have special meaning in flowchart syntax
- Special characters within text content can confuse the parser

###### Solutions

1. **Remove parentheses**:
2. **Use alternative expressions**:
3. **Wrap text in quotes** (works in some situations):

###### Recommendations

- Use **simple expressions** for node text
- **Avoid** parentheses() and special characters if possible
- Find **alternative expressions** when complex expressions are needed
- **Simplify** technical terms or code (e.g., `page.evaluate()` → `evaluate function`)

### Confusing Elements and Precautions (Very Important)

- **Detailed explanation of easily confused code sections**: Explicitly identify parts of the code that are difficult to understand or not intuitive
- **Potential misunderstanding elements**: Parts in the code's naming or structure that could cause misunderstandings
- **Non-standard patterns**: Parts implemented differently from common patterns and the reasons why
- **Performance-related considerations**: Code patterns or implementation methods that could affect performance
- **Side effects**: Functions or methods that could cause unexpected results
- **Error possibilities**: Errors that could occur when used incorrectly and their solutions
- **Common mistake cases**: Mistakes commonly made by developers when using this code

### Visual Code Explanations

- **Comment diagrams next to code blocks**: Add explanations of how complex code blocks work
- **Use various visualization tools beyond diagrams**: Tables, or anything else that helps understanding
- **Use Markdown tables to represent Types**
- **Core algorithm visualization**: Visualize step-by-step operation of important algorithms
- **Data transformation process visualization**: Express the data transformation process step by step
- **Memory/resource usage diagrams**: Visualize memory usage patterns of resource-intensive code

### Elements to Improve Document Quality

- Appropriate markdown heading structure and formatting
- Apply syntax highlighting to code blocks
- Use step-by-step explanations and diagrams for complex concepts
- Balance basic concept explanations for beginners and advanced information for experts
- Present actual usage scenarios and problem-solving methods
- Avoid simply copying the provided code verbatim. The code itself can already be seen outside this document.
- In addition to what's written here, use your creativity and initiative to think about what would help readers when looking at the provided code. Beyond the typical content found in documentation, what additional information would help people understand the provided code more easily?

### Tone & Style

- Use **반말체 (informal speech)**: End sentences with "~이야" or "~해", etc.
- **Bad Example:** "이 함수는 데이터를 검증합니다."
- **Good Example:** "이 함수는 데이터를 검증해."
- 또는 반말보다 명사형이 더 적절할 경우에는, 반말이 아닌 명사형으로 문장을 끝내.
- 모든 것은 이해를 더 쉽고 빠르게 만들기 위해서

## Step 4: Document Review and Improvement

Review the created document and answer the following questions:

- Have all important aspects of the code been explained?
- Is the document logically structured?
- **Do the diagrams and visual materials actually help understand the code?**
- **Are complex logic or structures visually clearly expressed?**
- **Do the diagrams effectively emphasize the most important aspects of the code?**
- **Are easily confused parts explained in sufficient detail?**
- **Will readers be able to properly understand and utilize the code after reading this document?**
- **Are there clear explanations for difficult concepts or non-intuitive code parts?**
- Does it provide useful information for both beginners and experts?
- Do the examples well demonstrate actual use cases and help understanding?

Based on these questions, please create a document in **Korean** to help understand the provided code.
Write the results in a single markdown text file, in full.
