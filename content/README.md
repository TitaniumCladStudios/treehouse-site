# Content Directory

This directory contains all CMS content stored as JSON files and versioned via Git.

## Structure

- `/pages/` - Page content files (one JSON file per page)
- `/custom/` - Custom content types (to be implemented)

## Page Content

Each page is stored as a separate JSON file in `/pages/` with the following structure:

```json
{
  "metadata": {
    "slug": "page-slug",
    "title": "Page Title",
    "createdAt": "2025-10-31T00:00:00.000Z",
    "updatedAt": "2025-10-31T00:00:00.000Z"
  },
  "fields": [
    {
      "id": "field_id",
      "label": "Field Label",
      "type": "shortText|longText|image",
      "value": "field value"
    }
  ]
}
```

### Field Types

- **shortText**: Single line text input (max ~255 characters)
- **longText**: Multi-line text area for longer content
- **image**: Image path (e.g., `/uploads/image.jpg`)

## API Endpoints

- `GET /api/content/pages` - List all pages
- `GET /api/content/pages/[slug]` - Get a specific page
- `POST /api/content/pages` - Create a new page
- `PUT /api/content/pages/[slug]` - Update a page
- `DELETE /api/content/pages/[slug]` - Delete a page

## Git Versioning

All content changes are committed to Git via the GitHub API, providing:
- Complete change history
- Easy rollback capabilities
- Backup and disaster recovery
