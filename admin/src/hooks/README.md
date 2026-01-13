# Hooks Organization

This directory contains all custom hooks organized by functionality for better maintainability and discoverability.

## 📁 Folder Structure

```
src/hooks/
├── queries/           # TanStack Query hooks for data fetching
├── mutations/         # Mutation hooks (future use)
├── filters/           # Filter management hooks
├── utils/             # Utility hooks (future use)
├── index.ts          # Main exports
└── README.md         # This file
```

## 🔍 Query Hooks (`/queries`)

### `useToolsQuery`
- **Purpose**: Fetch tools data with filtering and pagination
- **Features**: 
  - Automatic caching with TanStack Query
  - Filter support (search, category, tags, status, etc.)
  - Pagination handling
  - Error handling and loading states

### `useCategoriesAndTagsQuery`
- **Purpose**: Fetch categories and tags data
- **Features**:
  - Combined hook for both categories and tags
  - Long cache time (10 minutes) since data rarely changes
  - Type-specific filtering (e.g., 'Tool' categories)

### `useSubmissionsAndClaimsQuery`
- **Purpose**: Fetch tool submissions and claims
- **Features**:
  - Separate hooks for submissions and claims
  - Mutation hooks for approve operations
  - Automatic cache invalidation on mutations

## 🎛️ Filter Hooks (`/filters`)

### `useFilters` (Generic)
- **Purpose**: Generic filter management hook
- **Features**:
  - Type-safe filter state management
  - Debounced filter updates
  - Active filter detection
  - Clear/reset functionality
  - Filter configuration system

### `useToolsFilters` (Specialized)
- **Purpose**: Tools-specific filter hook
- **Features**:
  - Pre-configured filter options for tools
  - Integration with categories and tags
  - Computed values (search term, selected items)
  - Automatic filter option generation

## 🚀 Usage Examples

### Basic Query Usage
```tsx
import { useToolsQuery } from '@/hooks/queries';

function ToolsTab() {
  const { data: tools, isLoading, error } = useToolsQuery(filters);
  
  if (error) return <ErrorComponent error={error} />;
  if (isLoading) return <LoadingSpinner />;
  
  return <ToolsList tools={tools} />;
}
```

### Filter Usage
```tsx
import { useToolsFilters } from '@/hooks/filters';

function ToolsTab() {
  const { filters, updateFilters, clearFilters, hasActiveFilters } = useToolsFilters({
    onFiltersChange: (newFilters) => {
      // Trigger refetch or update query
    },
    debounceMs: 500,
  });
  
  return (
    <div>
      <FilterModal 
        filters={filters}
        onUpdate={updateFilters}
        onClear={clearFilters}
      />
      {hasActiveFilters && <ActiveFiltersIndicator />}
    </div>
  );
}
```

## 🔧 Configuration

### Query Client Configuration
Located in `src/lib/queryClient.ts`:
- Stale time: 5 minutes for tools, 10 minutes for categories/tags
- Retry attempts: 1
- Background refetching disabled
- Garbage collection: 10 minutes

### Filter Configuration
- Debounce time: 300ms (configurable per hook)
- Automatic filter state management
- Type-safe filter operations

## 📦 Exports

### Main Index (`/index.ts`)
```tsx
// Import all hooks
import { useToolsQuery, useToolsFilters } from '@/hooks';

// Or import specific categories
import { useToolsQuery } from '@/hooks/queries';
import { useToolsFilters } from '@/hooks/filters';
```

## 🎯 Benefits

1. **Organization**: Clear separation of concerns
2. **Reusability**: Generic hooks can be used across components
3. **Type Safety**: Full TypeScript support
4. **Performance**: Optimized with TanStack Query caching
5. **Maintainability**: Easy to find and update specific functionality
6. **Testing**: Isolated hooks are easier to test

## 🔄 Migration Guide

### From Old Structure
```tsx
// Old
import { useToolsQuery } from '@/hooks/useToolsQuery';

// New
import { useToolsQuery } from '@/hooks/queries';
```

### Adding New Hooks
1. Create hook in appropriate folder
2. Add export to folder's index.ts
3. Add export to main index.ts if needed
4. Update documentation

## 🧪 Testing

Each hook should have corresponding tests in the test directory:
- Unit tests for hook logic
- Integration tests for query behavior
- Mock implementations for external dependencies 