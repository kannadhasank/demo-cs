# Storybook Guide

## 📚 What's in Storybook?

Storybook now includes stories for:

### 1. Common Components (Reusable Library)
- **Button** - All variants, sizes, states
- **Input** - All input types, validation states

### 2. Layout Components
- **Header** - App header with navigation
- **Sidebar** - Navigation sidebar
- **Footer** - App footer

## 🚀 Running Storybook

```bash
npm run storybook
```

Opens at: `http://localhost:6006`

## 📖 Storybook Structure

```
Storybook/
├── Common/          # Reusable components
│   ├── Button
│   └── Input
│
└── Layout/          # Layout components
    ├── Header
    ├── Sidebar
    └── Footer
```

## 🎨 Features

### Theme Switching
- Use the theme selector in Storybook toolbar
- Toggle between light and dark themes
- See components in both themes

### Interactive Controls
- Change props in real-time
- Test different variants
- See component behavior

### Documentation
- Auto-generated docs for each component
- Props table with types
- Usage examples

## ✏️ Adding New Stories

### For a Component in `src/common/`

Create `ComponentName.stories.jsx`:

```jsx
import ComponentName from './ComponentName';

export default {
  title: 'Common/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {
    // Your default props
  },
};
```

### For a Component with Redux

```jsx
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ComponentName from './ComponentName';
import yourReducer from '@store/slices/yourSlice';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      yourSlice: yourReducer,
    },
    preloadedState: initialState,
  });
};

export default {
  title: 'Category/ComponentName',
  component: ComponentName,
  decorators: [
    (Story) => (
      <Provider store={createMockStore()}>
        <Story />
      </Provider>
    ),
  ],
};

export const Default = {
  args: {},
};
```

### For a Component with Router

```jsx
import { BrowserRouter } from 'react-router-dom';
import ComponentName from './ComponentName';

export default {
  title: 'Category/ComponentName',
  component: ComponentName,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export const Default = {
  args: {},
};
```

## 📂 Story Locations

Storybook looks for `*.stories.jsx` files in:
- `src/common/**/*.stories.jsx`
- `src/components/**/*.stories.jsx`
- `src/pages/**/*.stories.jsx`

## 🎯 Best Practices

1. **One story file per component**
   - Button.jsx → Button.stories.jsx

2. **Multiple variants per story**
   ```jsx
   export const Primary = { args: { variant: 'primary' } };
   export const Secondary = { args: { variant: 'secondary' } };
   ```

3. **Provide meaningful names**
   - Use descriptive story names
   - Group related components

4. **Test both themes**
   - Create dark theme variants
   - Ensure components work in both

5. **Document props**
   - Use PropTypes
   - Add descriptions in argTypes

## 🔍 Example: Creating a Card Story

1. **Create the component:**
```jsx
// src/common/Card/Card.jsx
const Card = ({ title, content, variant = 'default' }) => {
  return (
    <div className={`card card-${variant}`}>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['default', 'highlighted']),
};

export default Card;
```

2. **Create the story:**
```jsx
// src/common/Card/Card.stories.jsx
import Card from './Card';

export default {
  title: 'Common/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'highlighted'],
    },
  },
};

export const Default = {
  args: {
    title: 'Card Title',
    content: 'This is the card content.',
  },
};

export const Highlighted = {
  args: {
    title: 'Important Card',
    content: 'This card is highlighted.',
    variant: 'highlighted',
  },
};

export const DarkTheme = {
  args: {
    title: 'Dark Theme Card',
    content: 'This card in dark mode.',
  },
  decorators: [
    (Story) => {
      document.documentElement.setAttribute('data-theme', 'dark');
      return <Story />;
    },
  ],
};
```

3. **Run Storybook:**
```bash
npm run storybook
```

4. **View your component:**
   - Navigate to Common → Card
   - Toggle between variants
   - Test in both themes

## 🎨 Customizing Story Layout

### Centered Layout
```jsx
parameters: {
  layout: 'centered',
}
```

### Fullscreen Layout
```jsx
parameters: {
  layout: 'fullscreen',
}
```

### Padded Layout
```jsx
parameters: {
  layout: 'padded',
}
```

## 🛠️ Advanced Features

### Actions
```jsx
export default {
  title: 'Common/Button',
  component: Button,
  argTypes: {
    onClick: { action: 'clicked' },
  },
};
```

### Controls
```jsx
argTypes: {
  size: {
    control: 'select',
    options: ['small', 'medium', 'large'],
  },
  disabled: {
    control: 'boolean',
  },
}
```

### Backgrounds
```jsx
parameters: {
  backgrounds: {
    default: 'dark',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'dark', value: '#1e1e2e' },
    ],
  },
}
```

## 📦 Building Storybook

For production:
```bash
npm run build-storybook
```

Output in `storybook-static/` folder.

## 🎉 Benefits

1. **Isolated Development**
   - Build components independently
   - Test without running full app

2. **Visual Testing**
   - See all variants at once
   - Compare themes side-by-side

3. **Documentation**
   - Auto-generated docs
   - Live examples
   - Props reference

4. **Collaboration**
   - Share components with team
   - Design system showcase

## 📚 Learn More

- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)
- [Writing Stories](https://storybook.js.org/docs/react/writing-stories/introduction)
- [Essential Addons](https://storybook.js.org/docs/react/essentials/introduction)

---

Happy component building! 🎨
