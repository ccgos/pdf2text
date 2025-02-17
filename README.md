# pdf2text

# Product Requirements Document (PRD)

## App Overview
**Name:** PDF to Markdown Converter  
**Description:** A graphical application that scans a selected folder or PDF file, converts all found PDFs into Markdown text files, and saves them in the same location with identical filenames.  
**Tagline:** "Effortless PDF conversion for students."

## Target Audience
- **Users:** Students needing to convert PDFs into Markdown for note-taking and research.
- **Profile:** Tech-savvy students seeking quick, reliable conversion.

## Key Features
1. **Selection:** Choose a folder or individual PDF.
2. **Crawling:** Traverse folder structures to locate PDFs.
3. **Conversion:** Convert PDFs to Markdown, saving with the original filename.
4. **Progress Display:** Show a progress bar during conversion.
5. **Error Reporting:** Display any errors in the UI.
6. **Undo Function:** Option to remove all created Markdown files.

## Success Metrics
- Accurate conversion.
- Minimal errors.
- High user satisfaction.

## Assumptions & Risks
- Users possess basic technical skills.
- Complex PDFs might pose challenges.
- Dependency on robust PDF parsing libraries.

---

# Frontend Documentation

## UI Framework
- **Framework:** Electron

## UI Library
- **Library:** shadcn emerald

## Navigation
- **Structure:** Minimal single-page layout with modal dialogs for secondary functions

## Styling
- **Approach:** Tailwind CSS
- **Design Aesthetic:** Elegant and futuristic, inspired by Apple's design

## User Interactions
- **File Selection:** OS-based dialogs for choosing folders or individual PDF files
- **Progress Display:** Visual progress bar during conversions
- **Error Reporting:** UI displays errors as they occur
- **Undo Function:** Option to remove all created Markdown files

---

# Backend Documentation

## Architecture Overview
- **Integration:** Embedded within the Electron app using Node.js.
- **Conversion Process:** A two-step approach:
  1. Convert PDFs to HTML.
  2. Convert HTML to Markdown using Turndown.

## Conversion Process
1. **PDF Identification:** Recursively scan the selected folder for PDFs.
2. **PDF-to-HTML Conversion:** Utilize a robust tool (e.g., pdf2htmlEX) to convert each PDF to HTML, preserving context and formatting.
3. **HTML-to-Markdown Conversion:** Use Turndown to transform the generated HTML into Markdown.
4. **File Saving:** Save the Markdown file in the same folder as the source PDF with the same filename (except for the extension).

## Error Handling & Logging
- Capture and display errors in the UI.
- Maintain detailed logs for troubleshooting.

## Undo Functionality
- Record the paths of generated Markdown files.
- Provide an option to remove these files upon user request.

## External Services
- **Remote API Integrations:** None. All functionality is self-contained within the app.

---

# State Management Documentation

## Global State Management
- **Solution:** Zustand
- **Usage:** Manage shared UI state, including conversion progress, error notifications, and undo operation status.

## Local State Management
- **Solution:** React's built-in state (useState)
- **Usage:** Handle component-specific state for UI interactions and forms.

---

# Persistent Storage Documentation

## Approach
- **Mechanism:** Use Electron's file system (fs module) to manage persistent data.
- **Data Managed:** Conversion history, error logs, and user settings.
- **Format:** JSON files.

## Storage Details
- **Directory:** A designated data folder within the app's user directory.
- **Conversion History:** Logs details of each conversion.
- **Error Logs:** Records any errors encountered during operations.
- **User Settings:** Stores configuration and preferences.

## Data Handling
- **Read/Write:** Utilize asynchronous file operations for efficiency.
- **Backup:** Option for manual backup and restoration of JSON files.
- **Maintenance:** Include a mechanism for cleaning up outdated logs.

---

# DevOps Documentation

## CI/CD Pipeline with GitHub Actions

### Overview
- **Tool:** GitHub Actions
- **Purpose:** Automate testing, building, and packaging of the Electron app.

### Workflow Details
- **Triggers:** Pushes, pull requests, and scheduled builds.
- **Testing:** Run unit and integration tests on each commit.
- **Building:** Compile the Electron app for target platforms.
- **Packaging:** Package the app into distributable formats (e.g., installers, zip files).

### Benefits
- Ensures consistent, reproducible builds.
- Streamlines the development workflow.
- Reduces manual intervention in deployment processes.

---

# Third-Party Libraries Documentation

## Overview
This document details the third-party libraries and tools used in the development of the PDF to Markdown Converter app.

## Libraries & Tools

### Electron
- **Purpose:** Provides a cross-platform desktop application framework.
- **Usage:** Builds the graphical interface and integrates Node.js for backend operations.

### shadcn emerald
- **Purpose:** UI component library.
- **Usage:** Supplies pre-built, elegant UI components.

### Tailwind CSS
- **Purpose:** Utility-first CSS framework.
- **Usage:** Styles the interface with an elegant, futuristic design inspired by Apple.

### Zustand
- **Purpose:** Global state management.
- **Usage:** Manages shared state (progress, errors, undo status) across the app.

### pdf2htmlEX
- **Purpose:** Converts PDF files to HTML.
- **Usage:** Extracts content from PDFs while preserving layout and context.

### Turndown
- **Purpose:** Converts HTML to Markdown.
- **Usage:** Transforms the HTML output from pdf2htmlEX into Markdown text.

### GitHub Actions
- **Purpose:** CI/CD automation.
- **Usage:** Automates testing, building, and packaging of the Electron app.

---

# User Flow Documentation

## Overview
This document outlines the user journey for the PDF to Markdown Converter app, detailing each step from launching the app to completing conversions, including error handling and an undo option.

## User Flow Diagram
```mermaid
flowchart TD
    A[Launch App] --> B[Display Main Window]
    B --> C[Select Folder or PDF]
    C --> D[Scan for PDFs in Folder Structure]
    D --> E[Initiate Conversion Process]
    E --> F[Display Progress Bar]
    F --> G{Conversion Successful?}
    G -- No --> H[Display Error Notifications]
    G -- Yes --> I[Conversion Complete]
    I --> J[Offer Undo Option]
    J --> K[User Executes Undo (Optional)]
    K --> L[Return to Main Window or Exit]
