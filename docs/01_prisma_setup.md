# Prisma and SQLite Database Setup

I have successfully initialized the Prisma ORM connected to a local SQLite database for our Next.js project.

Here is an overview of what was built and why.

## 1. What is Prisma?
Prisma is a modern tool that helps us talk to our database using TypeScript instead of writing raw SQL commands. It gives us auto-completion and type safety, meaning we catch errors before running the code.

## 2. Why SQLite?
For the MVP (v1), we are using SQLite because it is a "zero-configuration" database. It lives purely in a single file inside your project folder (`prisma/dev.db`). This makes local development incredibly fast and requires no external database servers to be set up. It's more than enough for a solo-builder project MVP. 

## 3. The Data Model We Built
The database structure (schema) is defined in `prisma/schema.prisma`. It contains the following tables:

*   **`Project`**: The core entity. An owner fills in their business details (name, type, description, services, contact info). It is linked to a specific Theme.
*   **`Page`**: Represents the final landing page generated for a Project. 
*   **`Section`**: A single block/part of the `Page` (e.g., Hero, About Us, Services, FAQ). We save the exact AI prompt used to generate it and the raw content. This allows us to re-generate or edit single sections instead of the whole page.
*   **`Revision`**: A history tracker for the `Section`. Before the AI re-generates new text, we can save the old version here in case the user wants to "undo."
*   **`Theme`**: Stores UI variables (colors, fonts, border styles). Projects reference a Theme so we know which styling to apply to their generated pages.

## Next Steps
Now that the data layer is ready, the next task on the checklist is to **Build the Design System** (RTL support, Hebrew typography, color variables, and the 5 base themes).
