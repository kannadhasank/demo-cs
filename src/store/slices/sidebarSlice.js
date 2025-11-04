import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: true,
  expandedMenus: [],
};

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    toggleMenu: (state, action) => {
      const menuId = action.payload;
      const index = state.expandedMenus.indexOf(menuId);
      
      if (index > -1) {
        state.expandedMenus.splice(index, 1);
      } else {
        state.expandedMenus.push(menuId);
      }
    },
    setExpandedMenus: (state, action) => {
      state.expandedMenus = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleMenu, setExpandedMenus } = sidebarSlice.actions;
export default sidebarSlice.reducer;
